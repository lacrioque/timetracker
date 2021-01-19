import { BasicState, Project, Task } from "@/types";
// import { ref, watch } from "vue";
import { transform } from "lodash";

import mutations from "./mutations";
import actions from "./actions";
import { App, reactive } from "vue";

const LOCALSTORAGE_KEY = "TIMETRACKER";

export class AppStorage {
  private innerState: BasicState = reactive({
    currentTask: null,
    taskList: new Map(),
    currentProject: null,
    projects: new Set(),
  });

  get state() {
    return this.innerState;
  }

  set state(nv) {
    console.warn("Setting the state directly is not allowed");
  }

  constructor() {
    this.restoreContent();
  }

  get storageableState() {
    return {
      currentTask: this.state.currentTask,
      taskList: Array.from(this.state.taskList.entries()),
      currentProject: this.state.currentProject,
      projects: Array.from(this.state.projects),
    } as Record<string, any>;
  }

  set storageableState(stateObj: Record<string, any>) {
    const parsedObj: BasicState = {
      currentTask: stateObj.currentTask,
      taskList: transform(
        stateObj.taskList,
        (map: Map<string, Task>, taskArray: [string, Task]) => {
          map.set(taskArray[0], taskArray[1]);
          return map;
        },
        new Map()
      ),
      currentProject: stateObj.currentProject,
      projects: transform(
        stateObj.projects,
        (projects: Set<Project>, project: Project) => {
          projects.add(project);
          return projects;
        },
        new Set()
      ),
    };
    console.log("Fully parsed new state: ", parsedObj);
    this.innerState = reactive(parsedObj);
  }

  private storeContent() {
    window.localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify(this.storageableState)
    );
  }

  private restoreContent() {
    const rawState = window.localStorage.getItem(LOCALSTORAGE_KEY);
    console.log("Restoring state from localStorage", rawState);
    if (rawState !== null) {
      try {
        const stateObj = JSON.parse(rawState);
        console.log("Parsed state", stateObj);
        this.storageableState = stateObj;
      } catch (error) {
        console.group("[STATE-ERROR]");
        console.error("Error restoring state");
        console.warn(error);
        console.groupEnd();
      }
    }
  }

  private mutations: Map<
    string,
    (state: BasicState, ...args: any[]) => void
  > = new Map(mutations);

  private actions: Map<
    string,
    (context: AppStorage, ...payload: any[]) => Promise<unknown> | void
  > = new Map(actions);

  public commit(mutation: string, ...payload: any) {
    const toRunMutation = this.mutations.get(mutation);
    if (toRunMutation === undefined) {
      console.warn(`| ${mutation} is not a valid mutation`);
      return;
    }
    toRunMutation(this.state, ...payload);
    this.storeContent();
  }

  public async dispatch(action: string, ...payload: any) {
    const toRunAction = this.actions.get(action);
    if (toRunAction === undefined) {
      console.warn(`| ${action} is not a valid action`);
      return;
    }
    return toRunAction(this, ...payload);
  }
}

const store = new AppStorage();

declare global {
  interface Window {
    store: any;
  }
}
if (window) {
  window.store = store;
}
export { store };

export default {
  install: (app: App) => {
    app.config.globalProperties.$store = store;
  },
};
