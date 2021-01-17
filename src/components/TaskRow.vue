<template>
  <div class="flex flex-row w-full grid-cols-6">
    <div>{{ task.name }}</div>
    <div>{{ task.description }}</div>
    <div>{{ task.start }}</div>
    <div>{{ task.end || "---" }}</div>
    <div>{{ duration }}</div>
    <div>{{ task.status }}</div>
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
