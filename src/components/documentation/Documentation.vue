<template>
  <SideNav>
    <li class="nav-item">
      <router-link
        class="nav-link"
        active-class="active"
        :to="{ name: 'Introduction' }"
        >Introduction</router-link
      >
    </li>
    <li>
      <router-link class="nav-link" active-class="active" :to="{ name: 'FAQ' }"
        >FAQ</router-link
      >
    </li>
    <li>
      <router-link
        class="nav-link"
        active-class="active"
        :to="{ name: 'Contact' }"
        >Contact</router-link
      >
    </li>
    <li>
      <router-link
        class="nav-link"
        active-class="active"
        :to="{ name: 'Donations' }"
        >Donations</router-link
      >
    </li>
  </SideNav>

  <div class="my-inner-block-wide">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/shared/SideNav.vue";

export default defineComponent({
  name: "Documentation",
  components: { SideNav },
});
</script>
