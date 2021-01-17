<template>
  <div
    class="container mx-auto w-full flex flex-row p-1 border-solid border-2 shadow-md bg-indigo-300"
  >
    <select class="button" v-model="day">
      <option v-for="d in pDays" :key="`d-${d}`" :value="d">{{ d }}</option>
    </select>
    <select class="button" v-model="month">
      <option v-for="m in pMonths" :key="`m-${m}`" :value="m">{{
        getMonth(m)
      }}</option>
    </select>
    <select class="button" v-model="year">
      <option v-for="y in pYears" :key="`y-${y}`" :value="y">{{ y }}</option>
    </select>
    <button
      :class="{ button: true, disabled: !validDate }"
      :disabled="!validDate"
      @click="setDate"
    >
      Set
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "date-selector",
  emits: ["setDate"],
  props: {
    selectedDate: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  data() {
    return {
      day: 0,
      month: 0,
      year: 0,
    } as {
      day: number;
      month: number;
      year: number;
    };
  },
  computed: {
    pDays() {
      return Array.from(Array(31).keys());
    },
    pMonths() {
      return Array.from(Array(12).keys());
    },
    pYears() {
      const curYear = new Date().getFullYear();
      const lastYear = curYear - 1;
      const nextYear = curYear + 1;
      return [lastYear, curYear, nextYear];
    },
    parsedDate(): Date {
      return new Date(`${this.year}-${this.month}-${this.day}`);
    },
    validDate() {
      return (
        this.parsedDate instanceof Date &&
        isFinite((this.parsedDate as unknown) as number)
      );
    },
  },
  watch: {
    selectedDate(nV: Date) {
      this.day = nV.getDate();
      this.month = nV.getMonth() + 1;
      this.year = nV.getFullYear();
    },
  },
  mounted() {
    this.day = ((this.selectedDate as unknown) as Date).getDate();
    this.month = ((this.selectedDate as unknown) as Date).getMonth() + 1;
    this.year = ((this.selectedDate as unknown) as Date).getFullYear();
    this.$forceUpdate();
  },
  methods: {
    setDate() {
      console.log("[DateSelector] Emitting setDate");
      this.$emit("setDate", this.parsedDate);
    },
    getMonth(m: number): string {
      return [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][m - 1];
    },
  },
});
</script>
