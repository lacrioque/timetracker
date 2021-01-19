<template>
  <div class="w-full grid grid-cols-6">
    <div class="flex p-1 mx-1">{{ task.name }}</div>
    <div class="flex p-1 mx-1">{{ task.description }}</div>
    <div class="flex p-1 mx-1">{{ nicetime(task.start) }}</div>
    <div class="flex p-1 mx-1">{{ task.end ? nicetime(task.end) : "---" }}</div>
    <div class="flex p-1 mx-1">{{ niceDuration(duration) }}</div>
    <div class="flex p-1 mx-1">{{ parsedStatus }}</div>
  </div>
</template>

<script lang="ts">
import { STATUS, Task } from "@/types";
import { invert } from "lodash";
import { computed, defineComponent, onUnmounted, ref } from "vue";
import { toDate } from "../utility";

export default defineComponent({
  name: "TaskRow",
  props: {
    task: {
      type: Object as () => Task,
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

    try {
      duration.value = now.getTime() - toDate(props.task.start).getTime();
    } catch (err) {
      console.warn("Duration calculation error", {
        task: props.task,
        start: props.task.start,
        now,
      });
    }

    if (
      !props.task.end &&
      !!props.task.start &&
      props.task.status == STATUS.Active
    ) {
      const interval = setInterval(function() {
        const nowInt = new Date();
        duration.value = nowInt.getTime() - toDate(props.task.start).getTime();
      }, 1000);

      onUnmounted(() => {
        clearInterval(interval);
      });
    }

    const nicetime = (val: Date | string) => {
      try {
        return `${toDate(val).toLocaleDateString()} ${toDate(
          val
        ).toLocaleTimeString()}`;
      } catch (err) {
        return "---";
      }
    };

    const niceDuration = (val: number) => {
      const seconds = String(Math.round(val / 1000) % 60).padStart(2, "0");
      const minutes = String(Math.round(val / 1000 / 60) % 60).padStart(2, "0");
      const hours = String(Math.round(val / 1000 / 60 / 60) % 24).padStart(
        2,
        "0"
      );
      const days = Math.round(val / 1000 / 60 / 60 / 24);

      return `${days > 0 ? `${days} day${days > 1 ? "s" : ""}, ` : ""} ${[
        hours,
        minutes,
        seconds,
      ].join(":")}`;
    };

    const parsedStatus = computed(() => {
      return invert(STATUS)[props.task.status];
    });

    return {
      duration,
      nicetime,
      niceDuration,
      parsedStatus,
    };
  },
});
</script>

<style></style>
