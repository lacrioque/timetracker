export enum STATUS {
  New = 0,
  Active = 1,
  Solved = 2,
  OnHold = 3,
  Ongoing = 4,
  Failed = 9,
}

export interface Task {
  name: string;
  description: string;
  start: Date | string;
  end?: Date | string;
  status: STATUS;
  info?: Record<string, any>;
}

export interface Project {
  name: string;
  customer?: string;
  number?: string;
}

export interface BasicState {
  currentTask: Task | null;
  taskList: Map<string, Task>;
  currentProject: Project | null;
  projects: Set<Project>;
}
