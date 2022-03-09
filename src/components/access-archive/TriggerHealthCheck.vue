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
        v-my-focus
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
      v-if="healthCheck.contactAttempts.length === 0"
      test="health-check-triggered-msg"
    >
      A <i>health check</i> email will be sent shortly to
      {{ healthCheck.email }}.
    </span>
    <span
      v-if="healthCheck.contactAttempts.length > 0"
      test="triggered-already-msg"
    >
      A <i>health check</i> email to {{ healthCheck.email }} has already been
      triggered.
    </span>
    <br />
    <span test="expected-access-date-msg">
      If {{ healthCheck.email }} does not confirm the reception of the
      <i>health check</i>, you will be able to access the archive on
      {{ getArchiveAccessDate() }}
    </span>
  </div>
</template>

<script lang="ts">
import { formatDateTime } from "@/util/format-date";
import { defineComponent } from "vue";
import { HealthCheckResponse } from "@/entities/health-check.response";

export default defineComponent({
  name: "TriggerHealthCheck",
  data() {
    return {
      errormsg: "",
      loadingData: false,
      success: false,
      code: "",
    };
  },
  computed: {
    healthCheck() {
      return this.$store.state.healthCheck;
    },
  },
  methods: {
    async send() {
      this.errormsg = "";
      this.loadingData = true;
      try {
        await this.$store.dispatch("triggerHealthCheck", this.code.trim());
        this.success = true;
      } catch (error: any) {
        this.errormsg = error.message || "Error triggering health check.";
      } finally {
        this.loadingData = false;
      }
    },
    getArchiveAccessDate() {
      const oneMin = 1000 * 60;
      const healthCheck = this.healthCheck as HealthCheckResponse;
      const numberContactAttempts = healthCheck.contactAttempts.length;
      const sendDate =
        healthCheck.dueDate +
        (4 - numberContactAttempts) * healthCheck.intervalReminder * oneMin;
      return formatDateTime(sendDate);
    },
  },
});
</script>
