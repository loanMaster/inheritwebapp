<template>
  <form @submit.prevent="encryptAndUpload">
    <div>
      <label class="form-label mt-2"
        >Attachments (max size 10 MB in total)</label
      >
      <div class="mt-2">
        <MultiFileInput
          :attachments="newArchive.attachments"
          :disabled="savingData"
          @attachments-update="onUpdateAttachments"
        ></MultiFileInput>
      </div>

      <div class="form-group mt-4">
        <label>Archive name (optional)</label>
        <input
          type="text"
          class="form-control form-control-lg"
          maxlength="100"
          :disabled="savingData"
          v-model="newArchive.archiveName"
          test="archive-name-input"
        />
      </div>
      <label class="mt-2">Access code</label>
      <div class="input-group" v-if="newArchive.accessCode">
        <input
          type="email"
          class="my-normal-font form-control form-control-lg"
          :disabled="true"
          :value="newArchive.accessCode"
          test="access-code-input"
        />
        <button
          type="button"
          class="btn btn-outline-primary"
          test="regenerate-access-code"
          :disabled="savingData"
          @click="refreshAccessCode"
        >
          🗘
        </button>
      </div>
      <div v-my-visible="accessCodeChanged">
        <div class="text-warning" test="access-code-changed-warning">
          ⚠ If you save these changes, the current access code will become
          invalid!
        </div>
      </div>
    </div>
    <div class="my-flex-align-center mt-2 mb2">
      <button
        type="submit"
        class="btn btn-dark btn-lg btn-blockmr-2 mr-2"
        test="update-archive-submit"
        :disabled="savingData || newArchive.attachments.length === 0"
      >
        Update&nbsp;archive<br />
      </button>
      <div class="spinner-border" v-if="savingData"></div>
    </div>
    <span
      v-if="successmsg"
      class="display-block"
      test="update-archive-success-msg"
      >{{ successmsg }}</span
    >
    <span v-if="errormsg" class="display-block invalid-feedback">{{
      errormsg
    }}</span>
  </form>
</template>

<script>
import { defineComponent } from "vue";
import { zip } from "@/util/file.helper";
import { v4 as uuidv4 } from "uuid";
import { EncryptionService } from "@/service/encryption.service";
import MultiFileInput from "@/components/dashboard/shared/MultiFileInput.vue";

export default defineComponent({
  name: "UpdateArchive",
  components: { MultiFileInput },
  data() {
    return {
      errormsg: "",
      savingData: false,
      successmsg: "",
      accessCodeChanged: false,
      newArchive: {
        archiveName: "",
        attachments: [],
        accessCode: undefined,
      },
    };
  },
  props: {
    existingAttachments: {},
    existingPass: { type: String },
  },
  async created() {
    this.newArchive.archiveName = this.currentArchive.archiveName;
    this.newArchive.id = this.currentArchive.id;
    this.newArchive.accessCode = this.currentArchive.accessCode;
    this.existingAttachments.forEach((att) =>
      this.newArchive.attachments.push(att)
    );
  },
  computed: {
    currentArchive() {
      return this.$store.state.currentArchive;
    },
  },
  emits: ["archive-updated"],
  methods: {
    refreshAccessCode() {
      this.accessCodeChanged = true;
      this.newArchive.accessCode = uuidv4();
    },
    anyAttachmentChanged() {
      if (!this.existingAttachments) {
        return true;
      }
      const removed = this.existingAttachments.filter(
        (a) => this.newArchive.attachments.indexOf(a) === -1
      ).length;
      return (
        removed ||
        this.existingAttachments.length !== this.newArchive.attachments.length
      );
    },
    async encryptAndUpload() {
      this.errormsg = "";
      this.successmsg = "";
      this.savingData = true;
      try {
        let encryption = {};
        if (this.anyAttachmentChanged()) {
          const zipFile = await zip(this.newArchive.attachments);
          encryption = await new EncryptionService().encrypt(
            zipFile,
            this.existingPass
          );
        }
        await this.$store.dispatch("updateArchive", {
          blob: encryption.blob,
          iv: encryption.iv,
          archiveName: this.newArchive.archiveName,
          accessCode: this.newArchive.accessCode,
          id: this.newArchive.id,
        });
        this.$emit("archive-updated");
        this.successmsg = "👍 Archive saved";
        this.accessCodeChanged = false;
      } catch (error) {
        this.errormsg = "An error occurred while uploading / encrypting";
      } finally {
        this.savingData = false;
      }
    },
    onUpdateAttachments(attachments) {
      this.newArchive.attachments = attachments;
    },
  },
});
</script>
