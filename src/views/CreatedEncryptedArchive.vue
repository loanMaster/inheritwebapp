<template>
  <div class="d-flex justify-content-center" v-if="fetchingData">
    <div class="spinner-border"></div>
  </div>
  <div v-if="!fetchingData">
    <form
      @submit.prevent="encryptAndUpload"
      v-if="!archiveCreated && settings.archives.length < 3"
    >
      <div class="my-justify">
        Create an encrypted archive. Your files will by zipped and encrypted
        with the
        <a href="https://en.wikipedia.org/wiki/Web_Cryptography_API"
          >Web Cryptography API</a
        >
        using the
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-gcmin"
          >AES-GCM algorithm</a
        >
        in the browser. The encrypted archive will stored in the
        <a href="https://ipfs.io/">interplanetary file system (ipfs)</a>.<br />
        <br />
        You must remember the encryption password. my-legacy does not know or
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
              minlength="12"
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
    <div v-if="!archiveCreated && settings.archives.length >= 3">
      You have already created 3 archives. Users can not create more than 3
      archives.
    </div>
    <div>
      <span v-if="errormsg" class="display-block invalid-feedback">{{
        errormsg
      }}</span>
    </div>
    <div v-if="archiveCreated" test="archive-created-msg">
      The archive was successfully created. You can download and decrypt the
      archive via the 'Manage archives' tab.
      <br />
      <br />
      If you die, your heirs can trigger a <i>health check</i> using the
      <i>access code</i> <CopyText :address="archive.accessCode" />
      &nbsp;
      <router-link to="/health-check-and-decrypt">here</router-link>
      .<br />
      After your death they can use the <i>access code</i> to access your
      archive. The <i>access code</i> is shown in the 'Manage archives' tab.<br />
      <br />
      Please share the <i>access code</i> and the encryption password with your
      heirs.
      <div v-if="settings.archives.length < 3">
        <button
          @click="createAnotherArchive"
          test="create-another-archive"
          class="btn btn-outline-primary mt-4"
        >
          Create another archive
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import JSZip from "jszip";
import { formatBytes } from "@/util/format-bytes";
import CopyText from "@/components/CopyText.vue";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default defineComponent({
  name: "CreateEncryptedArchive",
  inject: ["settingsService", "encryptionService"],
  data() {
    return {
      errormsg: "",
      fetchingData: false,
      savingData: false,
      fileInputError: "",
      pass: "",
      passVerify: "",
      archiveCreated: false,
      archive: {
        ipfsHash: "",
        archiveName: "",
        attachments: [],
        id: "",
        iv: "",
        accessCode: "",
      },
      settings: undefined,
    };
  },
  components: {
    CopyText,
  },
  async created() {
    this.fetchingData = true;
    this.settings = await this.settingsService.fetchSettings();
    this.fetchingData = false;
  },
  computed: {
    downloadAndDecryptLink() {
      return `/decrypt?hash=${this.archive.ipfsHash}&iv=${this.archive.iv}`;
    },
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
        this.archiveCreated = true;
        this.settings = response.settings;
        this.archive = response.settings.archives.find(
          (a) => a.id === response.archiveId
        );
      } catch (error) {
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
    createAnotherArchive() {
      this.archiveCreated = false;
      this.pass = "";
      this.passVerify = "";
      this.archive = {
        ipfsHash: "",
        archiveName: "",
        attachments: [],
        id: "",
        iv: "",
        accessCode: "",
      };
    },
  },
});
</script>
