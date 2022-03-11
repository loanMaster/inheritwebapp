<template>
  <AppModal
    :title="'Disclaimer'"
    :cancelButton-title="'Close'"
    :show-modal="showDisclaimer"
    :scrollable="true"
    @cancel="showDisclaimer = false"
    test="disclaimer-modal"
  >
    <Disclaimer />
  </AppModal>

  <form @submit.prevent="encryptAndUpload">
    <div>
      <label class="form-label mt-2"
        >Attachments (max size 10 MB in total)</label
      >
      <MultiFileInput
        :attachments="newArchive.attachments"
        :disabled="savingData"
        @attachments-update="onUpdateAttachments"
      ></MultiFileInput>

      <div class="form-group mt-4">
        <label>Archive name (optional)</label>
        <input
          type="text"
          class="form-control form-control-lg"
          maxlength="100"
          autocomplete="on"
          :disabled="savingData"
          v-model="newArchive.archiveName"
          test="archive-name-input"
        />
      </div>
      <div class="form-group mt-2">
        <div class="my-bold">
          🛑✋ You must remember the encryption password. my-legacy does not
          know or store the password anywhere.
        </div>
        <label>Choose an encryption password</label>
        <input
          type="password"
          autocomplete="off"
          class="form-control form-control-lg"
          v-model="pass"
          maxlength="50"
          :disabled="savingData"
          minlength="12"
          test="password-input"
          required
        />
        <span
          >At least 12 characters with upper and lowercase letters and at least
          one digit</span
        >
      </div>
      <div class="form-group mt-2">
        <label>Verify password</label>
        <input
          type="password"
          autocomplete="off"
          class="form-control form-control-lg"
          v-model="passVerify"
          :disabled="savingData"
          test="password-verify-input"
          required
        />
      </div>

      <div class="mt-2">
        <label>File storage</label>
        <div>
          You can choose whether to upload your encrypted files to the
          <a href="https://ipfs.io/">interplanetary file system</a> or to a
          standard cloud storage container. Just stick with the standard cloud
          storage container if you are unsure what to choose.
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            v-model="newArchive.useIpfsStorage"
            :value="false"
          />
          <span> Standard cloud storage container </span>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            test="use-ipfs-storage"
            v-model="newArchive.useIpfsStorage"
            :value="true"
          />
          <span> Interplanetary file system </span>
        </div>
      </div>

      <div class="mt-4 my-flex">
        <input
          class="form-check-input mr-2"
          type="checkbox"
          v-model="disclaimerCheck"
          test="disclaimer-checkbox"
          required
        />
        <span class="my-flex-1"
          >I have read and agree to the
          <a href="javascript:void(0);" @click="showDisclaimer = true"
            >disclaimer</a
          ></span
        >
      </div>

      <div class="mt-2 my-flex">
        <input
          class="form-check-input mr-2"
          type="checkbox"
          test="password-checkbox"
          v-model="passwordCheck"
          required
        />
        <span class="my-flex-1"
          >I understand that without this encryption password and the access
          code created after encryption, my uploaded files cannot be accessed
          EVER. The password cannot be recovered by my-legacy. my-legacy is not
          responsible for the content of the uploaded files or any loss in the
          event of missing passwords or access codes.</span
        >
      </div>

      <div class="mt-2 my-flex">
        <input
          class="form-check-input mr-2"
          type="checkbox"
          test="heirs-checkbox"
          v-model="heirsCheck"
          required
        />
        <span class="my-flex-1"
          >I understand that it is my sole responsibility to provide both the
          encryption password and the access code to my heirs. I will provide
          password, access code and instructions how to use them to my
          heirs.</span
        >
      </div>
    </div>
    <div class="my-flex-align-center mt-2 mb2">
      <button
        type="submit"
        class="btn btn-dark btn-lg btn-blockmr-2 mr-2"
        test="create-archive-submit"
        :disabled="
          savingData ||
          newArchive.attachments.length === 0 ||
          !allCheckboxesChecked
        "
      >
        Encrypt&nbsp;and&nbsp;upload<br />
      </button>
      <div class="spinner-border" v-if="savingData"></div>
    </div>
    <span
      v-if="errormsg"
      class="display-block invalid-feedback"
      test="create-archive-errormsg"
      >{{ errormsg }}</span
    >
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { zip } from "@/util/file.helper";
import AppModal from "@/components/shared/AppModal.vue";
import Disclaimer from "@/components/documentation/Disclaimer.vue";
import { waitForSettings } from "@/store/store";
import { EncryptionService } from "@/service/encryption.service";
import MultiFileInput from "@/components/dashboard/shared/MultiFileInput.vue";
import { Attachment } from "@/entities/attachment";

export default defineComponent({
  name: "CreateArchive",
  components: { AppModal, Disclaimer, MultiFileInput },
  data() {
    return {
      errormsg: "",
      savingData: false,
      disclaimerCheck: false,
      passwordCheck: false,
      heirsCheck: false,
      showDisclaimer: false,
      pass: "",
      passVerify: "",
      newArchive: {
        useIpfsStorage: false,
        archiveName: "",
        attachments: [],
        accessCode: undefined,
      },
    } as {
      errormsg: string;
      savingData: boolean;
      disclaimerCheck: boolean;
      passwordCheck: boolean;
      heirsCheck: boolean;
      showDisclaimer: boolean;
      pass: string;
      passVerify: string;
      newArchive: {
        useIpfsStorage: boolean;
        archiveName: string;
        attachments: Attachment[];
        accessCode: undefined | string;
      };
    };
  },
  async created() {
    await waitForSettings(this.$store);
  },
  computed: {
    allCheckboxesChecked() {
      return this.disclaimerCheck && this.heirsCheck && this.passwordCheck;
    },
  },
  emits: ["archive-created"],
  methods: {
    checkPwStrength(pass: string): RegExpMatchArray | null {
      const match1 = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}$/;
      return pass.match(match1);
    },
    async encryptAndUpload() {
      this.errormsg = "";
      if (this.pass !== this.passVerify) {
        this.errormsg = "Passwords are not identical";
        return;
      }
      if (!this.checkPwStrength(this.pass)) {
        this.errormsg = "Your password is to weak";
        return;
      }
      this.savingData = true;
      try {
        const zipFile = await zip(this.newArchive.attachments);
        const encryption = await new EncryptionService().encrypt(
          zipFile,
          this.pass
        );
        await this.$store.dispatch("createArchive", {
          ipfs: this.newArchive.useIpfsStorage,
          blob: encryption.blob,
          iv: encryption.iv,
          archiveName: this.newArchive.archiveName,
        });
        this.$emit("archive-created");
      } catch (error) {
        console.log(error);
        this.errormsg = "An error occurred while uploading / encrypting";
      } finally {
        this.savingData = false;
      }
    },
    onUpdateAttachments(attachments: Attachment[]) {
      this.newArchive.attachments = attachments;
    },
  },
});
</script>
