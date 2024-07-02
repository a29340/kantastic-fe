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

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

export class Task {
  name: string;
  id: number;
  stageId: number;

  constructor(name: string, id: number, stageId: number) {
    this.name = name;
    this.id = id;
    this.stageId = stageId;
  }
}
