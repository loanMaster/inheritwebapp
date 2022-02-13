<template>
  <div class="mr-1">
    <div
      class="my-step"
      v-for="(stepLabel, idx) in steps"
      :key="stepLabel"
      :class="step === idx + 1 ? 'my-active' : step > idx + 1 ? 'my-done' : ''"
    >
      <div class="my-step-line" v-if="idx < steps.length - 1"></div>
      <div class="my-step-indicator">{{ step > idx + 1 ? "✓" : idx + 1 }}</div>
      <span class="my-step-text">{{ stepLabel }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppStepper",
  props: {
    step: Number,
    steps: Object,
  },
});
</script>

<style scoped>
.my-step {
  position: relative;
  display: flex;
  align-content: center;
  align-items: center;
  padding-bottom: 50px;
}
.my-step-indicator {
  border-radius: 50%;
  background-color: lightgrey;
  color: black;
  width: 50px;
  min-width: 50px;
  height: 50px;
  text-align: center;
  font-size: 2rem;
  margin-right: 5px;
  z-index: 1;
}
.my-active .my-step-indicator {
  background-color: blue;
  color: white;
}
.my-done .my-step-indicator {
  background-color: green;
  color: white;
}
.my-step-line {
  position: absolute;
  height: 100%;
  width: 2px;
  background-color: lightgrey;
  top: 25px;
  left: 24px;
}
.my-done .my-step-line {
  background-color: black;
}
.my-active .my-step-text {
  font-weight: 800;
}
</style>
