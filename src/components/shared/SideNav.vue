<template>
  <div
    class="d-flex flex-column flex-shrink-0 my-mobile-hidden"
    style="position: fixed; width: 20%; padding-left: 1rem"
  >
    <ul class="nav nav-pills flex-column mb-auto">
      <slot></slot>
    </ul>
  </div>

  <div class="my-inner-block-wide my-desktop-hidden">
    <ul class="nav nav-tabs mt-4">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SideNav",
});
</script>
