export enum STATUS {
  New = 0,
  Solved = 1,
  OnHold = 2,
  Ongoing = 3,
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
  taskList: Task[];
  currentProject: Project | null;
  projects: Set<Project>;
}
