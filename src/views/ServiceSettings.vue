<template>
  <div class="d-flex justify-content-center" v-if="fetchingData">
    <div class="spinner-border"></div>
  </div>
  <form @submit.prevent="submit" v-if="!fetchingData && settings">
    <label class="form-label">Interval of <i>reminder</i> emails</label>
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

    <label class="form-label mt-4">Alive</label>
    <div>
      This switch indicates if you are regarded as alive in the system. If the
      value is 'off' your heirs are able to access your archives. Change this
      value to reset your <i>alive</i> status.
    </div>
    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="alive"
        test="alive-toggle"
      />
    </div>

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
      alive: true,
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
      this.settings = await this.settingsService.fetchSettings();
      this.alive = !this.settings.dead;
      this.fetchingData = false;
    },
    async submit() {
      this.savingData = true;
      this.errormsg = "";
      this.successmsg = "";
      try {
        await this.settingsService.updateServiceSettings({
          dead: !this.alive,
          intervalReminder: this.settings.intervalReminder,
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
