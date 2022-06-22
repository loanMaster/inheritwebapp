<template>
  <h1 class="text-center mb-4">Other projects</h1>
  <div class="d-flex flex-column">
    <div class="d-flex flex-column mb-4 align-items-center">
      <a href="https://kepler22.org">Kepler22</a>
      <span>The first audio-based brain jogging app</span>
    </div>
    <div class="d-flex flex-column mb-4 align-items-center">
      <a href="https://www.newgrounds.com/portal/view/844124"
        >Treasure island</a
      >
      <span>A small jump'n'run game with pirate theme</span>
    </div>
    <div class="d-flex flex-column mb-4 align-items-center">
      <a href="https://chessninja.org">ChessNinja</a>
      <span>Learn to play blindfold chess</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "OtherProjects",
});
</script>

<style scoped>
a {
  font-size: 1.5rem;
}
</style>
