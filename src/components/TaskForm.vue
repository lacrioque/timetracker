<template>
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
      <button type="submit" class="button">
        {{ isNew ? "Create new task" : "Save changes" }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { get, set } from "lodash";
import { defineComponent, reactive } from "vue";
import { toDate } from "../utility";
import { STATUS, Task } from "../types";

export default defineComponent({
  props: {
    task: { type: Object as () => Task | null, default: () => null },
  },
  emits: ["update", "close"],
  setup(props, { emit }) {
    const isNew = props.task === null;

    const formContent = reactive({
      name: "",
      description: "",
      start: new Date(),
      status: 1,
    } as Task);

    const formSubmit = () => {
      emit("update", formContent);
      return;
    };

    if (!isNew) {
      Object.keys(formContent).forEach((key) => {
        set(
          formContent,
          key,
          get(props.task, key, get(formContent, key, undefined))
        );
      });
    }

    return { formContent, formSubmit, STATUS, isNew };
  },
  computed: {
    reflectedStartDate: {
      get(): string {
        const d = toDate(this.formContent.start);
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
          const d = toDate(this.formContent.end);
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
