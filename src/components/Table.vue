<template>
  <div class="container w-full h-max flex flex-col">
    <template v-if="activeTask !== null">
      <div
        class="w-full bg-green-100 border-t-2 border-b-2 border-gray-50 mb-4"
      >
        <div class="w-full grid grid-cols-6 bg-indigo-200">
          Active Task
        </div>
        <TaskRow :task="activeTask" />
      </div>
    </template>
    <div class="w-full">
      <template v-if="tasks.length === 0">
        <div class="m-auto py-8 px-4 text-lg text-center">
          Currently no tasks in the system.
        </div>
      </template>
      <template v-else>
        <div class="w-full grid grid-cols-6 bg-indigo-200">
          <div class="flex p-1 mx-1">Task name</div>
          <div class="flex p-1 mx-1">description</div>
          <div class="flex p-1 mx-1">Start</div>
          <div class="flex p-1 mx-1">End</div>
          <div class="flex p-1 mx-1">Duration</div>
          <div class="flex p-1 mx-1">Status</div>
        </div>
      </template>
      <TaskRow
        v-for="task in tasks"
        :key="`task-${task[0]}`"
        :id="`task-${task[0]}`"
        :task="task[1]"
        class="task-row"
        @click="selectSet(task[1])"
      />
    </div>
    <Modal v-if="warning" title="Task already active">
      <p class="text-lg">
        There is already a running task. Do you want to pause it, or set it
        finished?
      </p>
      <div class="grid grid-col-2">
        <button class="block button" @click="setPaused">Pause task</button>
        <button class="block button" @click="setFinished">Finish task</button>
        <button class="block button" @click="warning = false">Cancel</button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { STATUS, Task } from "@/types";
import { computed, ComputedRef, defineComponent, watch, ref } from "vue";
import { store } from "../store";
import TaskRow from "./TaskRow.vue";
import Modal from "./Modal.vue";

export default defineComponent({
  name: "Table",
  components: { TaskRow, Modal },
  props: {
    activeTask: {
      type: Object as () => Task,
      default: () => null,
    },
  },
  emits: ["selectDataSet"],
  setup(props, { emit }) {
    const tasks: ComputedRef<Map<string, Task>> = computed(
      () => store.state.taskList
    );
    const warning = ref(false);
    const warnActiveTask = () => {
      warning.value = true;
      return new Promise((res) => {
        watch(warning, (curWarning) => {
          if (!curWarning) {
            res(true);
          }
        });
      });
    };

    const selectSet = async (set: Task) => {
      if (store.state.currentTask !== null) {
        await warnActiveTask();
      }
      emit("selectDataSet", set);
    };
    const setPaused = () => {
      if (store.state.currentTask !== null) {
        const modTask = store.state.currentTask;
        modTask.status = STATUS.OnHold;
        store.commit("modyfyTaskOnList", modTask);
        warning.value = false;
      }
    };
    const setFinished = () => {
      if (store.state.currentTask !== null) {
        const modTask = store.state.currentTask;
        modTask.status = STATUS.Solved;
        store.commit("modyfyTaskOnList", modTask);
        warning.value = false;
      }
    };
    return {
      tasks,
      selectSet,
      warning,
      setPaused,
      setFinished,
    };
  },
});
</script>

<style>
.task-row:nth-of-type(odd) {
  @apply bg-indigo-100;
}
</style>
