<template>
  <div class="d-flex justify-content-center" v-if="fetchingData">
    <div class="spinner-border"></div>
  </div>
  <form @submit.prevent="submit" v-if="!fetchingData && settings">
    <label class="form-label">Interval of <i>health check</i> emails</label>
    <div class="my-justify">
      You will receive a <i>health check</i> email every
      <b>{{ settings.interval }}</b> day(s). Each <i>health check</i> email will
      contain a confirmation link. Confirm the email by clicking on its
      confirmation link. You can change the interval using the slider below.
    </div>
    <input
      type="range"
      class="form-range"
      min="1"
      max="180"
      step="1"
      v-model="settings.interval"
      test="interval-input"
    />

    <label class="form-label mt-4">Interval of <i>reminder</i> emails</label>
    <div class="my-justify">
      You will receive up to 3 <i>reminder</i> emails if you fail to respond to
      the <i>health check</i> email within
      <b>{{ settings.intervalReminder }}</b> day(s). If you do not confirm the
      last <i>reminder</i> email within
      <b>{{ settings.intervalReminder }}</b> day(s) the message(s) you created
      for your heirs will be sent via email. You can change the interval using
      the slider below.
    </div>
    <input
      type="range"
      class="form-range"
      min="1"
      max="14"
      step="1"
      v-model="settings.intervalReminder"
      test="interval-reminder-input"
    />

    <label class="form-label mt-4"
      >Activate / deactivate periodic health check mails</label
    >
    <div class="form-check form-switch">
      <span
        ><span v-if="settings.active"
          >Deactivate this switch if you do not want to receive periodic health
          check emails.</span
        >
        <span v-if="!settings.active"
          >Activate this switch if you wish to receive periodic health check
          emails.</span
        ></span
      >
      <input
        class="form-check-input"
        type="checkbox"
        v-model="settings.active"
        test="periodic-checks-toggle"
      />
    </div>
    <label class="form-label mt-4"><i>health-check-code</i></label
    ><br />
    The following code can be used to trigger a health check manually:<br />
    <span test="health-check-trigger-code">{{
      settings.healthCheckTriggerCode
    }}</span>
    <br />
    Please share this code with your heirs. To trigger a health check manually
    enter the code
    <router-link to="/trigger-health-check">here</router-link>.

    <div class="mt-4 my-flex-align-center">
      <button
        type="submit"
        class="btn btn-dark btn-lg btn-block mr-2"
        :disabled="savingData"
        test="settings-submit"
      >
        Save
      </button>
      <span
        v-if="errormsg"
        class="fadeOut invalid-feedback"
        test="settings-error-msg"
        >{{ errormsg }}</span
      >
      <span
        v-if="successmsg"
        class="fadeOut display-block"
        test="settings-success-msg"
        >{{ successmsg }}</span
      >
      <span
        v-if="successmsg && settings.active && settings.hasHeirs"
        class="fadeOut display-block ml-2"
        >The next <i>health check</i> email will be sent in one day.</span
      >
    </div>
  </form>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ServiceSettings",
  inject: ["settingsService"],
  data() {
    return {
      errormsg: "",
      successmsg: "",
      fetchingData: false,
      savingData: false,
      settings: undefined,
      lastSavedSettings: undefined,
    };
  },
  created() {
    this.fetchSettings();
  },
  methods: {
    async fetchSettings() {
      this.fetchingData = true;
      const settings = await this.settingsService.fetchSettings();
      this.settings = {
        interval: settings.interval,
        intervalReminder: settings.intervalReminder,
        active: settings.active,
        hasHeirs:
          settings.archives.filter((a) => a.recipients.length > 0).length > 0,
        healthCheckTriggerCode: settings.healthCheckTriggerCode,
      };
      this.fetchingData = false;
    },
    async submit() {
      this.savingData = true;
      this.errormsg = "";
      this.successmsg = "";
      try {
        await this.settingsService.updateServiceSettings({
          interval: this.settings.interval,
          intervalReminder: this.settings.intervalReminder,
          active: this.settings.active,
        });
        this.successmsg = "👍 Settings updated.";
      } catch (error) {
        this.errormsg = error;
      }
      this.savingData = false;
    },
  },
});
</script>
