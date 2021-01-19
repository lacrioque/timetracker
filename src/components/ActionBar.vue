<template>
  <div
    class="container w-full flex flex-row p-1 border-solid border-2 shadow-md bg-grey-400"
  >
    <button
      :class="{ button: true, disabled, active: curValue === STATUS.Solved }"
      :disabled="disabled"
      @click="setSolved"
    >
      Set Task solved
    </button>
    <button
      :class="{ button: true, disabled, active: curValue === STATUS.OnHold }"
      :disabled="disabled"
      @click="setOnHold"
    >
      Set Task on hold
    </button>
    <button
      :class="{ button: true, disabled, active: curValue === STATUS.Ongoing }"
      :disabled="disabled"
      @click="setOngoing"
    >
      Set Task to ongoing
    </button>
    <button
      :class="{ button: true, disabled, active: curValue === STATUS.Failed }"
      :disabled="disabled"
      @click="setFailed"
    >
      Set Task to failed
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { STATUS } from "../types";

export default defineComponent({
  name: "ActionBar",
  props: {
    value: {
      type: Number as () => STATUS,
      default: STATUS.Solved,
    },
    activeTask: {
      type: Object,
      default: () => null,
    },
  },
  setup() {
    return {
      STATUS,
    };
  },
  computed: {
    disabled(): boolean {
      return this.activeTask === null;
    },
    curValue: {
      get(): STATUS {
        return this.value;
      },
      set(nV: STATUS): void {
        this.$emit("change", nV);
      },
    },
  },
  methods: {
    setSolved() {
      if (this.activeTask !== null) {
        this.curValue = STATUS.Solved;
      }
    },
    setOnHold() {
      if (this.activeTask !== null) {
        this.curValue = STATUS.OnHold;
      }
    },
    setOngoing() {
      if (this.activeTask !== null) {
        this.curValue = STATUS.Ongoing;
      }
    },
    setFailed() {
      if (this.activeTask !== null) {
        this.curValue = STATUS.Failed;
      }
    },
  },
});
</script>
