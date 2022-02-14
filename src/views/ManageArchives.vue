<template>
  <div class="d-flex justify-content-center" v-if="fetchingData">
    <div class="spinner-border"></div>
  </div>

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
      @archive-deleted="onArchiveDeleted"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import ArchiveListItem from "@/components/ArchiveListItem.vue";

export default defineComponent({
  name: "ManageArchives",
  inject: ["settingsService"],
  data() {
    return {
      fetchingData: false,
      settings: undefined,
    };
  },
  components: {
    ArchiveListItem,
  },
  created() {
    this.fetchSettings();
  },
  methods: {
    async fetchSettings() {
      this.fetchingData = true;
      try {
        this.settings = await this.settingsService.fetchSettings();
        this.fetchingData = false;
      } catch (error) {
        console.log(error);
      }
    },
    async onArchiveDeleted() {
      this.settings = await this.settingsService.fetchSettings();
    },
  },
});
</script>
