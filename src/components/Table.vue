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
      <template v-else>
        <div class="w-full grid grid-cols-6 bg-indigo-200">
          <div class="flex p-1 mx-1">Task name</div>
          <div class="flex p-1 mx-1">description</div>
          <div class="flex p-1 mx-1">Start</div>
          <div class="flex p-1 mx-1">End</div>
          <div class="flex p-1 mx-1">Duration</div>
          <div class="flex p-1 mx-1">Status</div>
        </div>
      </template>
      <TaskRow
        v-for="(task, i) in tasks"
        :key="`task-${i}`"
        :task="task"
        :class="{ 'bg-indigo-100': i % 2 === 1 }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
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
  setup() {
    const store = useStore();
    const tasks = computed(() => store.state.taskList);
    return {
      tasks,
    };
  },
});
</script>
