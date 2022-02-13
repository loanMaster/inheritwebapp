<template>
  <div v-if="archive">
    <div>
      The archive was successfully created. Your file is stored
      <a :href="ipfsLink">here</a>. <br /><br />
      You can download and decrypt the archive
      <a :href="downloadAndDecryptLink">here</a>
      using your password.
      <br />
      <br />
      If you die, crypto-legacy will share the file location and encryption
      initialization vector with your heirs. Please share the password you used
      to encrypt the file with your heirs. crypto-legacy does not know or store
      the password.
    </div>
    <form @submit.prevent="saveRecipients">
      <div class="my-border-box mt-4 mb-2">
        <label class="my-normal-font form-label">Assign heirs</label>
        <div v-for="(recipient, index) in archive.recipients" :key="recipient">
          <div class="input-group mb-3">
            <input
              type="email"
              class="my-normal-font form-control form-control-lg"
              placeholder="Heir email address"
              v-model="recipient.email"
              :disabled="savingData"
              test="heir-email-input"
              required
            />
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="removeRecipient(index)"
              text="remove-heir"
            >
              <i class="bi-trash"></i>
            </button>
          </div>
        </div>
        <div>
          <button
            type="button"
            class="btn btn-primary"
            @click="addRecipient()"
            :disabled="savingData"
            v-if="archive.recipients.length < 5"
            test="add-heir"
          >
            <i class="bi-plus"></i> Add heir
          </button>
        </div>
      </div>
      <div class="my-flex-align-center mb-2 mt-2">
        <button
          type="submit"
          class="btn btn-dark btn-lg btn-blockmr-2 mr-2"
          text="assign-heirs-submit"
          :disabled="savingData"
        >
          Save<br />
        </button>
        <div class="spinner-border" v-my-visible="savingData"></div>
      </div>
    </form>
    <div>
      <span v-if="errormsg" class="invalid-feedback">{{ errormsg }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AssignHeirs",
  inject: ["settingsService"],
  data() {
    return {
      errormsg: "",
      savingData: false,
      archive: undefined,
    };
  },
  props: {
    archiveId: {
      type: String,
    },
  },
  async created() {
    const settings = await this.settingsService.fetchSettings();
    this.archive = settings.archives.find((a) => a.id === this.archiveId);
    this.archive.recipients = [{ email: "" }];
  },
  computed: {
    ipfsLink() {
      return `https://ipfs.io/ipfs/${this.archive.ipfsHash}`;
    },
    downloadAndDecryptLink() {
      return `/decrypt?hash=${this.archive.ipfsHash}&iv=${this.archive.iv}`;
    },
  },
  emits: ["heirs-assigned"],
  methods: {
    async saveRecipients() {
      this.savingData = true;
      this.errormsg = "";
      try {
        await this.settingsService.updateArchive(this.archive);
        this.$emit("heirs-assigned");
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
