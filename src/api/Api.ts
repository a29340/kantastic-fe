/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface TaskDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  description?: string;
  /** @format int64 */
  stageId?: number;
  /** @format int64 */
  boardId?: number;
}

export interface StageDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  description?: string;
  /** @format int64 */
  boardId?: number;
}

export interface BoardDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  description?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "api";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title OpenAPI definition
 * @version v0
 * @baseUrl http://localhost:8080
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  task = {
    /**
     * No description
     *
     * @tags task-controller
     * @name postTask
     * @request POST:/task
     */
    postTask: (data: TaskDTO, params: RequestParams = {}) =>
      this.request<TaskDTO, any>({
        path: `/task`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags task-controller
     * @name getTask
     * @request GET:/task/{id}
     */
    getTask: (id: number, params: RequestParams = {}) =>
      this.request<TaskDTO, any>({
        path: `/task/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task-controller
     * @name deleteTask
     * @request DELETE:/task/{id}
     */
    deleteTask: (id: number, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/task/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  stage = {
    /**
     * No description
     *
     * @tags stage-controller
     * @name createStage
     * @request POST:/stage
     */
    createStage: (data: StageDTO, params: RequestParams = {}) =>
      this.request<StageDTO, any>({
        path: `/stage`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags stage-controller
     * @name getStage
     * @request GET:/stage/{id}
     */
    getStage: (id: number, params: RequestParams = {}) =>
      this.request<StageDTO, any>({
        path: `/stage/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags stage-controller
     * @name deleteStage
     * @request DELETE:/stage/{id}
     */
    deleteStage: (id: number, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/stage/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  board = {
    /**
     * No description
     *
     * @tags board-controller
     * @name createBoard
     * @request POST:/board
     */
    createBoard: (data: BoardDTO, params: RequestParams = {}) =>
      this.request<BoardDTO, any>({
        path: `/board`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags board-controller
     * @name getBoard
     * @request GET:/board/{id}
     */
    getBoard: (id: number, params: RequestParams = {}) =>
      this.request<BoardDTO, any>({
        path: `/board/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags board-controller
     * @name deleteBoard
     * @request DELETE:/board/{id}
     */
    deleteBoard: (id: number, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/board/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  tasks = {
    /**
     * No description
     *
     * @tags task-controller
     * @name getTasks
     * @request GET:/tasks
     */
    getTasks: (
      query: {
        /** @format int64 */
        stageId?: number;
        boardId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<TaskDTO[], any>({
        path: `/tasks`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  stages = {
    /**
     * No description
     *
     * @tags stage-controller
     * @name getStages
     * @request GET:/stages
     */
    getStages: (
      query: {
        /** @format int64 */
        boardId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<StageDTO[], any>({
        path: `/stages`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  boards = {
    /**
     * No description
     *
     * @tags board-controller
     * @name getBoards
     * @request GET:/boards
     */
    getBoards: (
      query: {
        /** @format int32 */
        size: number;
        /** @format int32 */
        page: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BoardDTO[], any>({
        path: `/boards`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
}
