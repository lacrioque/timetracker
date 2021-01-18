import { BasicState, Project, Task } from "@/types";
import { createStore, createLogger } from "vuex";
import VuexPersistence from "vuex-persist";

import StoreService from "../services/storeService";

const myStoreService = new StoreService();

const basicState: BasicState = {
  currentTask: null,
  taskList: [],
  currentProject: null,
  projects: new Set(),
};

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default createStore({
  state: basicState,
  mutations: {
    setCurrentTask(state: BasicState, task: Task) {
      state.currentTask = task;
    },
    unsetCurrentTask(state: BasicState) {
      state.currentTask = null;
    },
    addToTaskList(state: BasicState, task: Task) {
      state.taskList.push(task);
    },
    removeFromTaskList(state: BasicState, task: Task) {
      state.taskList = state.taskList.filter((t) => t.name !== task.name);
    },
    updateTaskList(state: BasicState, taskList: Task[]) {
      state.taskList = taskList;
    },
    setCurrentProject(state: BasicState, project: Project) {
      state.currentProject = project;
    },
    unsetCurrentProject(state: BasicState) {
      state.currentProject = null;
    },
    addProject(state: BasicState, project: Project) {
      state.projects.add(project);
    },
    removeProject(state: BasicState, project: Project) {
      state.projects.delete(project);
    },
    updateProjectList(state: BasicState, projects: Project[]) {
      state.projects = new Set(projects);
    },
  },
  actions: {
    storeToDB({ state }) {
      myStoreService.write(
        "tasks",
        (state.taskList as unknown) as Record<string, unknown>[]
      );
      myStoreService.write(
        "projects",
        (state.projects as unknown) as Record<string, unknown>[]
      );
    },
    async readFromDB({ commit }) {
      const [tasks, projects] = await Promise.all([
        myStoreService.read("tasks"),
        myStoreService.read("projects"),
      ]);
      commit("updateTaskList", tasks);
      commit("updateProjectList", projects);
    },
  },
  modules: {},
  plugins: [createLogger(), vuexLocal.plugin],
});
