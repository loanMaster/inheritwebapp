<template>
  <form
    @submit.prevent="decrypt"
    class="my-flex-1 mr-2"
    v-if="archive && files.length === 0"
  >
    <div class="form-group">
      <label>Archive Password</label>
      <input
        type="password"
        class="my-normal-font form-control form-control-lg"
        test="archive-password"
        autocomplete="false"
        v-my-focus
        required
        :disabled="loadingData"
        v-model="password"
      />
    </div>
    <div class="my-flex-align-center mb-2 mt-2">
      <button
        type="submit"
        class="btn btn-dark btn-blockmr-2 mr-2"
        test="decrypt-archive"
        :disabled="loadingData"
      >
        Access&nbsp;archive
      </button>
      <div class="spinner-border my-spinner" v-if="loadingData"></div>
      <span
        v-if="errormsg"
        class="invalid-feedback display-block"
        test="error-msg"
        >{{ errormsg }}</span
      >
    </div>
  </form>
  <div v-if="files.length > 0">
    <UpdateArchive
      :existing-attachments="files"
      :existing-pass="password"
    ></UpdateArchive>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UpdateArchive from "@/components/dashboard/manage-archives/UpdateArchive.vue";
import { unzip } from "unzipit";
import { EncryptionService } from "@/service/encryption.service";
import { FileService } from "@/service/file.service";
import { Archive } from "@/entities/archive";

export default defineComponent({
  name: "EditArchive",
  components: {
    UpdateArchive,
  },
  data() {
    return {
      errormsg: "",
      successmsg: "",
      password: "",
      loadingData: false,
      files: [],
    } as {
      errormsg: string;
      successmsg: string;
      password: string;
      loadingData: boolean;
      files: any[];
    };
  },
  computed: {
    archive() {
      return this.$store.state.currentArchive;
    },
  },
  methods: {
    async unzip(blob: Blob) {
      const { entries } = await unzip(blob);
      this.files = [];
      for (const entry of Object.values(entries)) {
        this.files.push(entry);
      }
    },
    async decrypt() {
      this.errormsg = "";
      this.loadingData = true;
      try {
        const fileContent = await new FileService().download(
          (this.archive as Archive).file
        );
        const decryptedBlob = await new EncryptionService().decrypt(
          fileContent,
          this.password,
          (this.archive as Archive).iv
        );
        await this.unzip(decryptedBlob);
      } catch (error) {
        console.log(error);
        this.errormsg =
          error instanceof DOMException
            ? "There was an error decrypting your file. Please verify your password and iv."
            : "There was an error downloading your file.";
      } finally {
        this.loadingData = false;
      }
    },
  },
});
</script>
