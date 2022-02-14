<template>
  <div v-if="archive" test="edit-archive">
    <div class="mt-2">
      <form @submit.prevent="updateArchive" class="my-flex-1 mr-2">
        <div class="form-group">
          <label>Archive name</label>
          <input
            type="text"
            class="my-normal-font form-control form-control-lg"
            maxlength="100"
            test="archive-name-input"
            :disabled="savingData"
            v-model="archive.archiveName"
          />
        </div>

        <label class="form-label mt-2">Heirs</label>
        <div v-for="(recipient, index) in archive.recipients" :key="recipient">
          <div class="input-group mb-3">
            <input
              type="email"
              class="my-normal-font form-control form-control-lg"
              placeholder="Heir email address"
              test="heir-email-input"
              :disabled="savingData"
              v-model="recipient.email"
              required
            />
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="removeRecipient(index)"
            >
              <i class="bi-trash" test="remove-heir"></i>
            </button>
          </div>
        </div>

        <div class="mt-2">
          <button
            type="button"
            class="btn btn-primary"
            @click="addRecipient"
            :disabled="savingData"
            test="add-heir"
          >
            <i class="bi-plus"></i> Add heir
          </button>
        </div>
        <div class="my-flex-align-center mb-2 mt-2">
          <button
            type="submit"
            class="btn btn-dark btn-blockmr-2 mr-2"
            test="submit"
            :disabled="savingData"
          >
            Save changes
          </button>
          <div class="spinner-border my-spinner" v-if="savingData"></div>
          <span
            v-if="successmsg"
            class="fadeOut display-block"
            test="success-msg"
            >{{ successmsg }}</span
          >
          <span v-if="errormsg" class="invalid-feedback" test="error-msg">{{
            "errormsg"
          }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EditArchive",
  inject: ["settingsService"],
  data() {
    return {
      errormsg: "",
      successmsg: "",
      savingData: false,
      archive: undefined,
    };
  },
  props: {
    archiveId: String,
  },
  emits: ["archive-updated"],
  async created() {
    const settings = await this.settingsService.fetchSettings();
    this.archive = settings.archives.find((m) => m.id === this.archiveId);
  },
  methods: {
    async updateArchive() {
      this.savingData = true;
      this.errormsg = "";
      this.successmsg = "";
      try {
        const settings = await this.settingsService.updateArchive(this.archive);
        this.archive = settings.archives.find((m) => m.id === this.archive.id);
        this.successmsg = "👍 Archive updated ";
        this.$emit("archive-updated");
      } catch (error) {
        this.errormsg = error;
      }
      this.savingData = false;
    },
    removeRecipient(recipientIndex) {
      this.archive.recipients.splice(recipientIndex, 1);
    },
    addRecipient() {
      this.archive.recipients.push({ email: "" });
    },
  },
});
</script>
