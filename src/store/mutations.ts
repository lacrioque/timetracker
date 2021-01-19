import { BasicState, Project, Task } from "@/types";

export default [
  [
    "setCurrentTask",
    (state: BasicState, task: Task) => {
      state.currentTask = task;
    },
  ],
  [
    "unsetCurrentTask",
    (state: BasicState) => {
      state.currentTask = null;
    },
  ],
  [
    "addToTaskList",
    (state: BasicState, task: Task) => {
      state.taskList.set(task.name, task);
    },
  ],
  [
    "removeFromTaskList",
    (state: BasicState, task: Task) => {
      state.taskList.delete(task.name);
    },
  ],
  [
    "modyfyTaskOnList",
    (state: BasicState, task: Task) => {
      state.taskList.set(task.name, task);
    },
  ],
  [
    "updateTaskList",
    (state: BasicState, taskList: Map<string, Task>) => {
      state.taskList = taskList;
    },
  ],
  [
    "setCurrentProject",
    (state: BasicState, project: Project) => {
      state.currentProject = project;
    },
  ],
  [
    "unsetCurrentProject",
    (state: BasicState) => {
      state.currentProject = null;
    },
  ],
  [
    "addProject",
    (state: BasicState, project: Project) => {
      state.projects.add(project);
    },
  ],
  [
    "removeProject",
    (state: BasicState, project: Project) => {
      state.projects.delete(project);
    },
  ],
  [
    "updateProjectList",
    (state: BasicState, projects: Project[]) => {
      state.projects = new Set(projects);
    },
  ],
] as [string, (state: BasicState, ...args: any) => void][];
