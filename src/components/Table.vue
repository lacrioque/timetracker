<template>
  <div class="container w-full h-max flex flex-column">
    <template v-if="activeTask !== null">
      <div class="w-full bg-green-100 border-t-2 border-b-2 border-gray-50">
        <TaskRow :task="activeTask" />
      </div>
    </template>
    <div class="w-full">
      <template v-if="tasks.length === 0">
        <div class="m-auto py-8 px-4 text-lg text-center">
          Currently no tasks in the system.
        </div>
      </template>
      <TaskRow v-for="(task, i) in tasks" :key="`task-${i}`" :task="task" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TaskRow from "./TaskRow.vue";

export default defineComponent({
  name: "Table",
  components: { TaskRow },
  props: {
    activeTask: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      tasks: [],
    };
  },
});
</script>
