export class Board {
  name: string;
  stages: Stage[];

  constructor(name: string, stages: Stage[]) {
    this.name = name;
    this.stages = stages;
  }
}

export class Stage {
  name: string;
  tasks: Task[];

  constructor(name: string, tasks: Task[]) {
    this.name = name;
    this.tasks = tasks;
  }
}

export class Task {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}
