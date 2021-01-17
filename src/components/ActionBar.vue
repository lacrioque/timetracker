<template>
  <div
    class="container w-full flex flex-row p-1 border-solid border-2 shadow-md bg-grey-400"
  >
    <button
      :class="{ button: true, disabled }"
      :disabled="disabled"
      @click="setSolved"
    >
      Set Task solved
    </button>
    <button
      :class="{ button: true, disabled }"
      :disabled="disabled"
      @click="setOnHold"
    >
      Set Task on hold
    </button>
    <button
      :class="{ button: true, disabled }"
      :disabled="disabled"
      @click="setOngoing"
    >
      Set Task to ongoing
    </button>
    <button
      :class="{ button: true, disabled }"
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
    dataSet: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    curDataSet: {
      get(): null | Record<string, unknown> {
        return this.dataSet;
      },
      set(nV: null | Record<string, unknown>) {
        const newDataSet = Object.assign(this.dataSet || {}, nV);
        this.$emit("change", newDataSet);
      },
    },
    disabled(): boolean {
      return this.curDataSet === null;
    },
  },
  methods: {
    setSolved() {
      if (this.curDataSet !== null) {
        this.curDataSet.status = STATUS.Solved;
      }
    },
    setOnHold() {
      if (this.curDataSet !== null) {
        this.curDataSet.status = STATUS.OnHold;
      }
    },
    setOngoing() {
      if (this.curDataSet !== null) {
        this.curDataSet.status = STATUS.Ongoing;
      }
    },
    setFailed() {
      if (this.curDataSet !== null) {
        this.curDataSet.status = STATUS.Failed;
      }
    },
  },
});
</script>
