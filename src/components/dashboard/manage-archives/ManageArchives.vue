<template>
  <div
    v-if="settings && (!settings.archives || settings.archives.length === 0)"
    test="empty-list-info"
  >
    You have not created any archives yet
  </div>
  <div v-if="settings">
    <ArchiveListItem
      v-for="archive in settings.archives"
      :key="archive.id"
      :archive-id="archive.id"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ArchiveListItem from "@/components/dashboard/manage-archives/ArchiveListItem.vue";

export default defineComponent({
  name: "ManageArchives",
  components: {
    ArchiveListItem,
  },
  computed: {
    settings() {
      return this.$store.state.settings;
    },
  },
});
</script>
