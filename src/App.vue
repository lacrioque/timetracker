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
          click="startActivity"
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
        <select class="button">
          <option value=""> --No Project-- </option>
          <option
            v-for="project in projects"
            :key="unWhitespace(project)"
            value="project"
            >{{ project }}</option
          >
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
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Table from "./components/Table.vue";
import DateSelector from "./components/DateSelector.vue";
import ActionBar from "./components/ActionBar.vue";
import { STATUS } from "./types";

interface AppDataDefinition {
  projects: string[];
  selectedDate: Date;
  dataSet: Record<string, unknown> | null;
  activeTask: Record<string, unknown> | null;
}

export default defineComponent({
  name: "App",
  components: {
    Table,
    DateSelector,
    ActionBar,
  },
  data() {
    return {
      projects: [],
      selectedDate: new Date(),
      dataSet: null,
      activeTask: null,
    } as AppDataDefinition;
  },
  computed: {
    hasPausedTask() {
      if (
        this.activeTask !== null &&
        this.activeTask.status === STATUS.OnHold
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    unWhitespace(str: string) {
      return str.replace(/[^a-zA-Z0-9-_]/, "_");
    },
    selectDate(selectedDate: Date) {
      console.log("[App] selectDate emitted");
      this.selectedDate = selectedDate;
    },
    selectDataSet(dataSet: any) {
      this.dataSet = dataSet;
    },
    changeDataSet(dataSet: any) {
      this.dataSet = dataSet;
      // do something
    },
    setProject() {
      console.log("Project set");
    },
  },
});
</script>
