<template>
  <div class="my-inner-block" v-if="!archive">
    <TriggerHealthCheck />
  </div>
  <div class="my-inner-block" v-if="archive">
    <div>✅ Access granted</div>
    <h3>Download and decrypt the archive</h3>
    <Decrypt />
  </div>
</template>

<script lang="ts">
import TriggerHealthCheck from "@/components/access-archive/TriggerHealthCheck.vue";
import Decrypt from "@/components/dashboard/manage-archives/Decrypt.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    TriggerHealthCheck,
    Decrypt,
  },
  created() {
    this.$store.commit("currentArchive", undefined);
  },
  computed: {
    archive() {
      return this.$store.state.currentArchive;
    },
  },
});
</script>
