<template>
  <div class="d-flex justify-content-center" v-if="!settings">
    <div class="spinner-border"></div>
  </div>
  <form @submit.prevent="submit" v-if="settings">
    <label class="form-label">Alive</label>
    <div>
      This switch indicates whether you are regarded as alive in the system. If
      the value is "off" your heirs are able to access your archives. Change
      this value to reset your <i>alive</i> status.
    </div>
    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="alive"
        test="alive-toggle"
      />
    </div>

    <label class="form-label mt-4">File storage</label>
    <div>
      You can choose whether to upload your encrypted files to the
      <a href="https://ipfs.io/">interplanetary file system (ipfs)</a> or to a
      standard cloud storage container. Please have a look at the
      <router-link to="/docs">documentation</router-link>
      if you are unsure what to choose.
    </div>
    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        test="use-ipfs-storage"
        v-model="useIpfsStorage"
        :value="false"
      />
      <span> Standard cloud storage container </span>
    </div>
    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        test="use-cloud-storage-container"
        v-model="useIpfsStorage"
        :value="true"
      />
      <span> Interplanetary file system </span>
    </div>

    <label class="form-label mt-4">Interval of <i>reminder</i> emails</label>
    <div class="my-justify">
      You will receive 3 <i>reminder</i> emails if you fail to respond to a
      <i>health check</i> email within <b>{{ interval }}</b
      >. If you do not confirm the last <i>reminder</i> email within
      <b>{{ interval }}</b> your heirs will be granted access to your archives.
      You can change the interval using the slider below.
    </div>
    <input
      type="range"
      class="form-range"
      min="0"
      :max="intervalMax"
      step="1"
      v-model="intervalSetting"
      test="interval-reminder-input"
    />

    <div class="mt-2 my-flex-align-center">
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
        class="fadeOut invalid-feedback display-block"
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
import { waitForSettings } from "@/store/store";

const DAY = 1440;
export const POSSIBLE_INTERVAL_VALUES = [
  5,
  10,
  30,
  60,
  180,
  600,
  DAY,
  2 * DAY,
  3 * DAY,
  5 * DAY,
  7 * DAY,
  10 * DAY,
  14 * DAY,
];

export default defineComponent({
  name: "ServiceSettings",
  data() {
    return {
      errormsg: "",
      successmsg: "",
      fetchingData: false,
      alive: true,
      useIpfsStorage: true,
      savingData: false,
      intervalSetting: POSSIBLE_INTERVAL_VALUES.length - 1,
      intervalMax: POSSIBLE_INTERVAL_VALUES.length - 1,
    };
  },
  async created() {
    await waitForSettings(this.$store);
    this.alive = !this.settings.dead;
    this.useIpfsStorage = this.settings.useIpfsStorage;
    this.intervalSetting =
      POSSIBLE_INTERVAL_VALUES.indexOf(this.settings.intervalReminder) > -1
        ? POSSIBLE_INTERVAL_VALUES.indexOf(this.settings.intervalReminder)
        : this.intervalMax;
  },
  computed: {
    settings() {
      return this.$store.state.settings;
    },
    interval() {
      const intervalInMin = POSSIBLE_INTERVAL_VALUES[this.intervalSetting];
      if (intervalInMin < 60) {
        return `${intervalInMin} minutes`;
      } else if (intervalInMin < 1440) {
        return `${Math.floor(intervalInMin / 60)} hour(s)`;
      } else {
        return `${Math.floor(intervalInMin / 1440)} day(s)`;
      }
    },
  },
  methods: {
    async submit() {
      this.savingData = true;
      this.errormsg = "";
      this.successmsg = "";
      try {
        const intervalReminder = POSSIBLE_INTERVAL_VALUES[this.intervalSetting];
        await this.$store.dispatch("updateSettings", {
          dead: !this.alive,
          useIpfsStorage: this.useIpfsStorage,
          intervalReminder,
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
