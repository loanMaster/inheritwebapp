<template>
  <div class="my-inner-block">
    <form @submit.prevent="send" v-if="!success">
      <h3>Trigger a health check</h3>

      <div class="form-group">
        <label>Enter code</label>
        <input
          type="text"
          test="input-code"
          class="form-control form-control-lg"
          v-model="code"
          :disabled="loadingData"
          required
        />
      </div>
      <div class="mt-2 my-flex-align-center">
        <button
          type="submit"
          test="btn-submit"
          class="btn btn-dark btn-lg btn-block mr-2"
          :disabled="loadingData"
        >
          Send
        </button>
        <div class="spinner-border" v-my-visible="loadingData"></div>
      </div>
      <div class="my-msg-anchor">
        <div v-if="errormsg" test="error-msg" class="invalid-feedback">
          {{ errormsg }}
        </div>
      </div>
    </form>
    <div v-if="success" test="success-msg">
      A health check email will be sent shortly to {{ email }}.
    </div>
  </div>
</template>

<script>
export default {
  inject: ["settingsService"],
  data() {
    return {
      errormsg: "",
      loadingData: false,
      success: false,
      email: "",
      code: "",
    };
  },
  created() {
    this.iv = this.$route.query.iv;
    this.hash = this.$route.query.hash;
  },
  methods: {
    async send() {
      this.errormsg = "";
      this.loadingData = true;
      try {
        const response = await this.settingsService.triggerHealthCheck(
          this.code.trim()
        );
        this.email = response.email;
        this.success = true;
      } catch (error) {
        this.errormsg = error.message || "Error triggering health check.";
      } finally {
        this.loadingData = false;
      }
    },
  },
};
</script>
