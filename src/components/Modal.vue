<template>
  <div
    class="modal-backdrop-container fixed w-full h-full inset-0 bg-blue-50 bg-opacity-10 z-10"
  >
    <div
      class="modal-container absolute w-2/4 h-3/4 top-16 inset-x-1/4 border-4 border-blue-800 bg-white rounded-2xl z-20"
    >
      <span class="float-right p-3 mr-6 border-4 cursor-pointer" @click="close"
        >X</span
      >
      <h1 class="py-6 px-4 text-xl">{{ refTitle }}</h1>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  props: {
    title: String,
  },
  emits: ["close"],
  setup(props, { emit }) {
    const refTitle = ref(props.title);
    return {
      refTitle,
      close: () => emit("close"),
    };
  },
});
</script>
