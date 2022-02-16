<template>
  <form @submit.prevent="send" v-if="!success">
    <h3>Trigger a health check / Access archive</h3>

    <div class="form-group">
      <label>Enter access code</label>
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
  <div v-if="success">
    <span
      v-if="archiveResponse.contactAttempts.length === 0"
      test="health-check-triggered-msg"
    >
      A <i>health check</i> email will be sent shortly to
      {{ archiveResponse.email }}.
    </span>
    <span
      v-if="archiveResponse.contactAttempts.length > 0"
      test="triggered-already-msg"
    >
      A <i>health check</i> email to {{ archiveResponse.email }} has already
      been triggered.
    </span>
    <br />
    <span test="expected-access-date-msg">
      If {{ archiveResponse.email }} does not confirm the reception of the
      <i>health check</i>, you will be able to access the archive on
      {{ getArchiveAccessDate() }}
    </span>
  </div>
</template>

<script>
import { formatDateTime } from "../util/format-date";

export default {
  name: "TriggerHealthCheck",
  inject: ["settingsService"],
  data() {
    return {
      errormsg: "",
      loadingData: false,
      success: false,
      code: "",
      archiveResponse: undefined,
    };
  },
  emits: ["access-granted"],
  methods: {
    async send() {
      this.errormsg = "";
      this.loadingData = true;
      try {
        this.archiveResponse = await this.settingsService.triggerHealthCheck(
          this.code.trim()
        );
        if (this.archiveResponse.dead) {
          this.$emit("access-granted", {
            iv: this.archiveResponse.archive.iv,
            hash: this.archiveResponse.archive.ipfsHash,
          });
        } else {
          this.success = true;
        }
      } catch (error) {
        this.errormsg = error.message || "Error triggering health check.";
      } finally {
        this.loadingData = false;
      }
    },
    getArchiveAccessDate() {
      const oneDay = 1000 * 60 * 60 * 24;
      const numberContactAttempts = this.archiveResponse.contactAttempts.length;
      const sendDate =
        this.archiveResponse.dueDate +
        (4 - numberContactAttempts) *
          this.archiveResponse.intervalReminder *
          oneDay;
      return formatDateTime(sendDate);
    },
  },
};
</script>
