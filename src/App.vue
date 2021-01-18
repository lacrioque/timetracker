<template>
  <section class="main flex flex-col px-4 my-0 mx-auto w-full">
    <div class="w-full pt-2 bg-blue-100">
      <h1 class="w-full px-6 text-left text-xl text-bold">
        Clockwise - Timetracking
      </h1>
      <nav class="nav w-full px-2 py-2 mb-3 flex-flex-row justify-items-auto">
        <button
          :class="{ button: true, disabled: activeTask === null }"
          click="pauseActivity"
        >
          Pause current Activity
        </button>
        <button
          :class="{ button: true, disabled: !hasPausedTask }"
          click="resumeActivity"
        >
          Resume paused Activity
        </button>
        <span class="px-12">&nbsp;</span>
        <button
          :class="{ button: true, disabled: activeTask !== null }"
          @click="startActivity"
        >
          Start Activity
        </button>
        <button
          :class="{ button: true, disabled: activeTask === null }"
          click="endCurrentActivity"
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
      <DateSelector :selected-date="selectedDate" @setDate="selectDate" />
      <Table
        :active-task="activeTask"
        :selected-date="selectedDate"
        @selectDataSet="selectDataSet"
      />
      <ActionBar :data-set="dataSet" @change="changeDataSet" />
    </div>
    <TaskForm
      v-if="showForm"
      @update="updateDataSet"
      @close="() => (showForm = false)"
      :task="dataSet"
    />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref } from "vue";
import { useStore } from "vuex";
import Table from "./components/Table.vue";
import DateSelector from "./components/DateSelector.vue";
import ActionBar from "./components/ActionBar.vue";
import TaskForm from "./components/TaskForm.vue";

import { Project, STATUS, Task } from "./types";

export default defineComponent({
  name: "App",
  components: {
    Table,
    DateSelector,
    ActionBar,
    TaskForm,
  },
  setup() {
    const store = useStore();

    const projectList: Ref<string[]> = ref([]);
    const selectedDate: Ref<Date> = ref(new Date());
    const activeTask: Ref<Task | null> = ref(null);
    const selectedProject = ref("");
    const showForm = ref(false);

    store.dispatch("readFromDB").then(() => {
      projectList.value = Array.from(store.state.projects).map(
        (p) => (p as Project).name
      );
      activeTask.value = store.state.currentTask;
      selectedProject.value = store.state.currentProject;
    });

    const hasPausedTask = computed(() => {
      return (
        activeTask.value !== null && activeTask.value.status === STATUS.OnHold
      );
    });

    const selectDataSet = (dataSet: Task) => {
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
      }
      store.commit("setCurrentTask", dataSet);
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
    startActivity() {
      this.showForm = true;
    },
  },
});
</script>
