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
    <EditArchive
      v-for="archive in settings.archives"
      :key="archive.id"
      :archive-id="archive.id"
      @archive-updated="onArchiveUpdated"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import EditArchive from "@/components/EditArchive.vue";

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
    EditArchive,
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
    async onArchiveUpdated() {
      this.settings = await this.settingsService.fetchSettings();
    },
  },
});
</script>
