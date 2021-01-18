<template>
  <div
    class="task-form-container fixed w-full h-full inset-0 bg-blue-50 bg-opacity-10 z-10"
  >
    <div
      class="form-container absolute w-2/4 h-3/4 top-16 inset-x-1/4 border-4 border-blue-800 bg-white rounded-2xl z-20"
    >
      <span class="float-right p-3 mr-6 border-4 cursor-pointer" @click="close"
        >X</span
      >
      <h1 class="py-6 px-4 text-xl">New Task</h1>
      <form
        @submit.prevent="formSubmit"
        class="flex flex-col h-full w-full px-3 py-1"
      >
        <div class="h-16 flex flex-row w-full m-3 px-4 py-2">
          <div class="w-1/4 flex-grow-0">
            <label for="name"> Task name </label>
          </div>
          <div class="flex-grow p-1">
            <input class="w-full button" v-model="formContent.name" />
          </div>
        </div>
        <div class="h-16 flex flex-row w-full  m-3 px-4 py-2">
          <div class="w-1/4 flex-grow-0">
            <label for="name"> Description </label>
          </div>
          <div class="flex-grow p-1">
            <input class="w-full button" v-model="formContent.description" />
          </div>
        </div>
        <div class="h-16 flex flex-row w-full  m-3 px-4 py-2">
          <div class="w-1/4 flex-grow-0">
            <label for="name"> Task start </label>
          </div>
          <div class="flex-grow p-1">
            <input
              type="datetime-local"
              class="w-full button"
              v-model="reflectedStartDate"
            />
          </div>
        </div>
        <div class="h-16 flex flex-row w-full m-3 px-4 py-2">
          <div class="w-1/4 flex-grow-0">
            <label for="name"> Task end </label>
          </div>
          <div class="flex-grow p-1">
            <input
              type="datetime-local"
              class="w-full button"
              v-model="reflectedEndDate"
            />
          </div>
        </div>
        <div class="h-16 flex flex-row w-full  m-3 px-4 py-2">
          <div class="w-1/4 flex-grow-0">
            <label for="name"> Task status </label>
          </div>
          <div class="flex-grow p-1">
            <select class="w-full button" v-model="formContent.status">
              <option v-for="stt in STATUS" :key="stt" :value="stt">
                {{ Object.keys(STATUS)[stt] }}
              </option>
            </select>
          </div>
        </div>
        <div class="h-16 flex flex-row w-full  m-3 px-4 py-2">
          <button type="submit" class="button">Create new task</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { STATUS, Task } from "../types";

export default defineComponent({
  props: {
    task: { type: Object as () => Task | null, default: () => null },
  },
  emits: ["update", "close"],
  setup(props, { emit }) {
    const formContent = reactive({
      name: "",
      description: "",
      start: new Date(),
      status: 0,
    } as Task);

    const formSubmit = () => {
      emit("update", formContent);
      return;
    };
    const close = () => {
      emit("close");
    };

    return { formContent, formSubmit, STATUS, close };
  },
  computed: {
    reflectedStartDate: {
      get(): string {
        const d = this.formContent.start;
        const parsed = this.parseDate(d as Date);
        return parsed;
      },
      set(nV: string) {
        this.formContent.start = new Date(nV);
      },
    },
    reflectedEndDate: {
      get(): string | null {
        if (this.formContent.end) {
          const d = this.formContent.end;
          const parsed = this.parseDate(d as Date);
          return parsed;
        }
        return null;
      },
      set(nV: string) {
        this.formContent.end = new Date(nV);
      },
    },
  },
  methods: {
    parseDate(d: Date): string {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}T${String(
        d.getHours()
      ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    },
  },
});
</script>
