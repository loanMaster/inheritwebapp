<template>
  <form @submit.prevent="downloadAndDecrypt">
    <div class="form-group mt-2">
      <label>Password</label>
      <input
        type="password"
        autocomplete="off"
        test="decrypt-password"
        class="form-control form-control-lg"
        v-model="password"
        v-my-focus
        :disabled="loadingData"
        required
      />
    </div>
    <div class="mt-2 my-flex-align-center">
      <button
        type="submit"
        test="decrypt-submit"
        class="btn btn-dark btn-lg btn-block mr-2"
        :disabled="loadingData"
      >
        Download and decrypt
      </button>
      <div class="spinner-border" v-my-visible="loadingData"></div>
    </div>
    <div v-if="errormsg" test="decrypt-error-msg" class="invalid-feedback">
      {{ errormsg }}
    </div>
  </form>
</template>

<script lang="ts">
import FileSaver from "file-saver";
import { defineComponent } from "vue";
import { EncryptionService } from "@/service/encryption.service";
import { FileService } from "@/service/file.service";
import { Archive } from "@/entities/archive";

export default defineComponent({
  name: "Decrypt",
  data() {
    return {
      loadingData: false,
      password: "",
      errormsg: "",
    };
  },
  emits: ["decryption-complete"],
  computed: {
    archive() {
      return this.$store.state.currentArchive as Archive;
    },
  },
  methods: {
    async downloadAndDecrypt() {
      this.errormsg = "";
      this.loadingData = true;
      try {
        const fileContent = await new FileService().download(this.archive.file);
        const decryptedBlob = await new EncryptionService().decrypt(
          fileContent,
          this.password,
          this.archive.iv
        );
        FileSaver.saveAs(decryptedBlob, `${this.archive.file.id}.zip`);
        this.$emit("decryption-complete");
      } catch (error) {
        this.errormsg =
          error instanceof DOMException
            ? "There was an error decrypting your file. Please verify your password."
            : "There was an error downloading your file.";
      } finally {
        this.loadingData = false;
      }
    },
  },
});
</script>
