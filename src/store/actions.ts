import { forEach } from "lodash";
import StoreService from "../services/storeService";

import { AppStorage } from ".";

const myStoreService = new StoreService();

export default [
  [
    "storeToDB",
    ({ state }: AppStorage) => {
      const obj: Record<string, any> = {};

      state.taskList.forEach((value, key) => {
        obj[key] = value;
      });

      myStoreService.write("tasks", obj);
      myStoreService.write(
        "projects",
        (state.projects as unknown) as Record<string, unknown>[]
      );
    },
  ],
  [
    "readFromDB",
    async ({ commit }: AppStorage) => {
      try {
        const [tasks, projects] = await Promise.all([
          myStoreService.read("tasks"),
          myStoreService.read("projects"),
        ]);
        const refinedTasks = new Map();
        forEach(tasks, (taskObj, key) => {
          refinedTasks.set(key, taskObj);
        });
        commit("updateTaskList", refinedTasks);
        commit("updateProjectList", projects);
      } catch (e) {
        console.warn("Node environment or storage not working");
      }
    },
  ],
] as [
  string,
  (context: AppStorage, ...args: any[]) => Promise<unknown> | void
][];
