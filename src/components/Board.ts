export class Board {
  id: number;
  name: string;
  stages: Stage[];

  constructor(name: string, stages: Stage[], id: number) {
    this.id = id;
    this.name = name;
    this.stages = stages;
  }
}

export class Stage {
  id: number;
  name: string;
  boardId: number;
  highlighted: boolean

  constructor(id: number, name: string, boardId: number) {
    this.id = id;
    this.name = name;
    this.boardId = boardId;
    this.highlighted = false;
  }
}

export class Task {
  id: number;
  name: string;
  description: string;
  stageId: number;
  boardId: number;
  dragging: boolean;

  constructor(id: number, name: string, description: string, stageId: number, boardId: number) {
    this.name = name;
    this.description = description;
    this.id = id;
    this.stageId = stageId;
    this.boardId = boardId;
    this.dragging = false;
  }
}
