<template>
  <form @submit.prevent="encryptAndUpload">
    <div class="my-justify">
      Create an encrypted archive. Your files will by zipped and encrypted with
      the
      <a href="https://w3c.github.io/webcrypto/">Web Cryptography API</a> using
      the
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-gcmin"
        >AES-GCM algorithm</a
      >
      in the browser. The encrypted archive will stored in the
      <a href="https://ipfs.io/">interplanetary file system (ipfs)</a>.<br />
      <br />
      You must remember the encryption password. crypto-legacy does not know or
      store the password anywhere.
    </div>

    <div class="my-border-box mt-4 mb-2">
      <div>
        <label class="form-label mt-4"
          >Attachments (max size 10 MB in total)</label
        >
        <div
          v-for="(attachment, index) in archive.attachments"
          :key="attachment"
        >
          <div class="input-group mb-3 my-flex-align-center">
            <div class="my-flex-1">
              {{ attachment.file.name }},
              {{ formatBytes(attachment.file.size) }}
            </div>
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="removeAttachment(index)"
            >
              <i class="bi-trash"></i>
            </button>
          </div>
        </div>
        <div
          class="mb-3"
          v-if="archive.attachments.length < 5"
          :disabled="savingData"
        >
          <input
            class="form-control"
            @change="addFile($event)"
            type="file"
            :disabled="savingData"
            test="upload-file"
          />
          <div class="my-msg-anchor">
            <div v-if="fileInputError" class="invalid-feedback">
              {{ fileInputError }}
            </div>
          </div>
        </div>
        <div class="form-group mt-4">
          <label>Archive name (optional)</label>
          <input
            type="text"
            class="form-control form-control-lg"
            maxlength="100"
            :disabled="savingData"
            v-model="archive.archiveName"
            test="archive-name-input"
          />
        </div>
        <div class="form-group mt-4">
          <label>Encryption password</label>
          <input
            type="password"
            autocomplete="off"
            class="form-control form-control-lg"
            v-model="pass"
            maxlength="50"
            :disabled="savingData"
            minlength="1"
            test="password-input"
            required
          />
          <span>At least 12 characters</span>
        </div>
        <div class="form-group mt-4">
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
      </div>
    </div>
    <div class="my-flex-align-center mt-2 mb2">
      <button
        type="submit"
        class="btn btn-dark btn-lg btn-blockmr-2 mr-2"
        test="create-archive-submit"
        :disabled="savingData || archive.attachments.length === 0"
      >
        Encrypt and upload to ipfs<br />
      </button>
      <div class="spinner-border" v-if="savingData"></div>
    </div>
  </form>
  <div>
    <span v-if="errormsg" class="invalid-feedback">{{ errormsg }}</span>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import JSZip from "jszip";
import { formatBytes } from "@/util/format-bytes";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default defineComponent({
  name: "CreateEncryptedArchive",
  inject: ["settingsService", "encryptionService"],
  data() {
    return {
      errormsg: "",
      uploadingFile: false,
      savingData: false,
      fileInputError: "",
      pass: "",
      passVerify: "",
      archive: {
        ipfsHash: "",
        archiveName: "",
        attachments: [],
        id: "",
        iv: "",
      },
    };
  },
  emits: ["archive-created"],
  methods: {
    async encryptAndUpload() {
      this.errormsg = "";
      if (this.pass !== this.passVerify) {
        this.errormsg = "Passwords are not identical";
        return;
      }
      this.savingData = true;
      try {
        const zip = new JSZip();
        this.archive.attachments.forEach((att) => {
          zip.file(att.file.name, att.file);
        });
        const zipFile = await zip.generateAsync({ type: "blob" });
        const { blob, iv } = await this.encryptionService.encrypt(
          zipFile,
          this.pass
        );
        const response = await this.settingsService.uploadFile(
          blob,
          iv,
          this.archive.archiveName
        );
        this.$emit("archive-created", {
          settings: response.settings,
          archiveId: response.archiveId,
          iv,
        });
      } catch (error) {
        console.log(error);
        this.errormsg = "An error occurred while uploading / encrypting";
      } finally {
        this.savingData = false;
      }
    },
    async addFile(event) {
      this.fileInputError = "";
      let totalFileSize = this.archive.attachments
        .map((a) => a.file.size)
        .reduce((a, b) => a + b, 0);
      for (let i = 0; i < event.target.files.length; i++) {
        totalFileSize += event.target.files[i].size;
      }

      if (totalFileSize > MAX_FILE_SIZE) {
        this.fileInputError = `Total archive size exceeded. The max size is ${formatBytes(
          MAX_FILE_SIZE
        )}.`;
      } else {
        for (let i = 0; i < event.target.files.length; i++) {
          this.archive.attachments.push({ file: event.target.files[i] });
        }
        event.target.value = null;
      }
    },
    removeAttachment(attachmentIndex) {
      this.fileInputError = "";
      this.archive.attachments.splice(attachmentIndex, 1);
    },
    formatBytes(size) {
      return formatBytes(size);
    },
  },
});
</script>
