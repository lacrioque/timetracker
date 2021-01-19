<template>
  <section class="main flex flex-col px-4 my-0 mx-auto w-full">
    <div class="w-full pt-2 bg-blue-100">
      <h1 class="w-full px-6 text-left text-xl text-bold">
        Clockwise - Timetracking
      </h1>
      <nav class="nav w-full px-2 py-2 mb-3 flex-flex-row justify-items-auto">
        <button
          :class="{ button: true, disabled: activeTask === null }"
          @click="pauseActivity"
        >
          Pause current Activity
        </button>
        <button
          :class="{ button: true, disabled: !hasPausedTask }"
          @click="resumeActivity"
        >
          Resume paused Activity
        </button>
        <span class="px-12">&nbsp;</span>
        <button class="button" @click="showFormTrigger">
          {{ activeTask === null ? "Start Activity" : "Edit Activity" }}
        </button>
        <button
          :class="{ button: true, disabled: activeTask === null }"
          @click="endCurrentActivity"
        >
          End current Activity
        </button>
        <span class="px-12">&nbsp;</span>
        <select class="button" v-model="selectedProject">
          <option value="">--No Project--</option>
          <option
            v-for="project in projectList"
            :key="unWhitespace(project)"
            value="project"
          >
            {{ project }}
          </option>
        </select>
        <button class="button" @click="setProject">Set current Project</button>
      </nav>
    </div>
    <div class="container mx-auto w-full flex flex-col px-2 my-2">
      <div class="flex flex-row">
        <ActionBar
          v-show="activeTask !== null"
          :active-task="activeTask"
          :value="closeState"
          @change="changeCloseState"
        />
        <DateSelector :selected-date="selectedDate" @setDate="selectDate" />
      </div>
      <Table
        :active-task="activeTask"
        :selected-date="selectedDate"
        @selectDataSet="selectDataSet"
      />
    </div>
    <Modal v-if="showForm" title="Task form" @close="() => (showForm = false)">
      <TaskForm @update="updateDataSet" :task="activeTask" />
    </Modal>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref } from "vue";
import { store } from "./store";
import Table from "./components/Table.vue";
import DateSelector from "./components/DateSelector.vue";
import ActionBar from "./components/ActionBar.vue";
import TaskForm from "./components/TaskForm.vue";
import Modal from "./components/Modal.vue";

import { Project, STATUS, Task } from "./types";

export default defineComponent({
  name: "App",
  components: {
    Table,
    DateSelector,
    ActionBar,
    Modal,
    TaskForm,
  },
  setup() {
    const projectList: Ref<string[]> = ref([]);
    const selectedDate: Ref<Date> = ref(new Date());
    const activeTask: Ref<Task | null> = ref(null);
    const closeState: Ref<STATUS> = ref(STATUS.Solved);
    const selectedProject = ref("");
    const showForm = ref(false);

    // store.dispatch("readFromDB")
    projectList.value = Array.from(store.state.projects).map(
      (p) => (p as Project).name
    );
    activeTask.value = store.state.currentTask;
    selectedProject.value = store.state.currentProject
      ? store.state.currentProject.name
      : "";

    const hasPausedTask = computed(() => {
      return (
        activeTask.value !== null && activeTask.value.status === STATUS.OnHold
      );
    });

    const selectDataSet = (dataSet: Task) => {
      dataSet.status = STATUS.Active;
      store.commit("modyfyTaskOnList", dataSet);
      store.commit("setCurrentTask", dataSet);
      activeTask.value = dataSet;
    };
    const changeDataSet = (dataSet: Task) => {
      store.commit("setCurrentTask", dataSet);
      activeTask.value = dataSet;
    };

    const updateDataSet = (dataSet: Task) => {
      if (activeTask.value === null) {
        store.commit("addToTaskList", dataSet);
      } else {
        store.commit("modyfyTaskOnList", dataSet);
      }
      store.commit("setCurrentTask", dataSet);
      activeTask.value = dataSet;
      showForm.value = false;
    };

    const setProject = () => {
      for (const project of store.state.projects) {
        if (project.name === selectedProject.value) {
          store.commit("setCurrentProject", project);
          break;
        }
      }
    };

    const changeCloseState = (iCloseState: STATUS) => {
      closeState.value = iCloseState;
    };

    const endCurrentActivity = () => {
      if (activeTask.value !== null) {
        const modifiedState: Task = (() => activeTask.value)();
        modifiedState.status = closeState.value;
        store.commit("modyfyTaskOnList", modifiedState);
        activeTask.value = null;
        store.commit("unsetCurrentTask");
      }
    };
    const pauseActivity = () => {
      closeState.value = STATUS.OnHold;
      endCurrentActivity();
    };
    const resumeActivity = () => {
      // tbd
    };

    return {
      selectedProject,
      currentProject: computed(() => store.state.currentProject),
      projectList,
      selectedDate,
      activeTask,
      hasPausedTask,
      setProject,
      selectDataSet,
      changeDataSet,
      updateDataSet,
      showForm,
      closeState,
      changeCloseState,
      pauseActivity,
      resumeActivity,
      endCurrentActivity,
    };
  },
  methods: {
    unWhitespace(str: string) {
      return str.replace(/[^a-zA-Z0-9-_]/, "_");
    },
    selectDate(selectedDate: Date) {
      console.log("[App] selectDate emitted");
      this.selectedDate = selectedDate;
    },
    showFormTrigger() {
      this.showForm = true;
    },
  },
});
</script>
