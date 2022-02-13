<template>
  <form @submit.prevent="downloadAndDecrypt">
    <div class="form-group">
      <label>ipfs hash</label>
      <input
        type="text"
        test="decrypt-hash"
        class="form-control form-control-lg"
        v-model="hashModel"
        :disabled="loadingData"
        required
      />
    </div>
    <div class="form-group mt-2">
      <label>Initialization vector (iv)</label>
      <input
        type="text"
        test="decrypt-iv"
        class="form-control form-control-lg"
        v-model="ivModel"
        :disabled="loadingData"
        required
      />
    </div>
    <div class="form-group mt-2">
      <label>Password</label>
      <input
        type="password"
        autocomplete="off"
        test="decrypt-password"
        class="form-control form-control-lg"
        v-model="password"
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

<script>
import FileSaver from "file-saver";

export default {
  name: "IpfsDecrypt",
  inject: ["encryptionService"],
  data() {
    return {
      loadingData: false,
      password: "",
      errormsg: "",
      ivModel: "",
      hashModel: "",
    };
  },
  props: {
    iv: String,
    hash: String,
  },
  created() {
    this.ivModel = this.iv;
    this.hashModel = this.hash;
  },
  emits: ["decryption-complete"],
  methods: {
    async downloadAndDecrypt() {
      this.errormsg = "";
      this.loadingData = true;
      try {
        const response = await fetch(
          `https://gateway.pinata.cloud/ipfs/${this.hashModel}`
        );
        if (!response.ok) {
          this.errormsg =
            "The archive could not be downloaded. Please verify the ipfs hash";
          return;
        }
        const fileContent = await response.arrayBuffer();
        const decryptedBlob = await this.encryptionService.decrypt(
          fileContent,
          this.password,
          this.ivModel.trim()
        );
        FileSaver.saveAs(decryptedBlob, `${this.hashModel}.zip`);
        this.$emit("decryption-complete");
      } catch (error) {
        console.error(error);
        this.errormsg =
          "There was an error decrypting your file. Please check your password and iv";
      } finally {
        this.loadingData = false;
      }
    },
  },
};
</script>
