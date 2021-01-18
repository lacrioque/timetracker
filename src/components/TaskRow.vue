<template>
  <div class="w-full grid grid-cols-6">
    <div class="flex p-1 mx-1">{{ task.name }}</div>
    <div class="flex p-1 mx-1">{{ task.description }}</div>
    <div class="flex p-1 mx-1">{{ task.start }}</div>
    <div class="flex p-1 mx-1">{{ task.end || "---" }}</div>
    <div class="flex p-1 mx-1">{{ duration }}</div>
    <div class="flex p-1 mx-1">{{ task.status }}</div>
  </div>
</template>

<script>
import { defineComponent, onUnmounted, ref } from "vue";

export default defineComponent({
  name: "TaskRow",
  props: {
    task: {
      type: Object,
      default: () => ({
        name: null,
        description: null,
        start: null,
        end: null,
        status: null,
      }),
    },
  },
  setup(props) {
    const duration = ref(0);
    const now = new Date();
    duration.value = now - props.task.start;

    if (props.task.end === null && props.task.start !== null) {
      const interval = setInterval(() => {
        const nowInt = new Date();
        duration.value = nowInt - props.task.start;
      });
      onUnmounted(() => {
        clearInterval(interval);
      });
    }

    return {
      duration,
    };
  },
});
</script>

<style></style>
