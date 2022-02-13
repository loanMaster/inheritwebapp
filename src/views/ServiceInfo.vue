<template>
  <div class="d-flex justify-content-center" v-if="fetchingData">
    <div class="spinner-border"></div>
  </div>
  <div test="service-info-text" v-if="!fetchingData">
    <div v-if="settings.triggerOnce" text="triggered-manually-info">
      A one-time <i>health check</i> has been triggered manually.
    </div>
    <div
      v-if="(settings.active || settings.triggerOnce) && hasArchivesWithHeirs"
    >
      <div v-if="settings.contactAttempts.length < 4">
        <div v-if="settings.contactAttempts.length > 0" class="mb-2">
          ⚠ You have not confirmed the reception of your last
          <i>health check</i> email yet. The message was sent on
          {{ lastHealthCheckSentDate() }}. Please click on the confirmation link
          in the email.
        </div>
        <div>
          The next <i>health check</i> email will be sent in ~
          {{ days }} day(s), {{ hours }} hour(s), {{ minutes }} minute(s) and
          {{ seconds }} second(s).
        </div>
        <div>
          In case you die today, a link to the archive(s) you prepared will be
          sent on
          {{ getMessageSendDate() }} to your heirs.
        </div>
      </div>
      <div
        v-if="settings.contactAttempts.length >= 4"
        test="messages-will-be-sent-warning"
      >
        ⚠ A link to the archive(s) you prepared will be sent to your heirs in ~
        {{ days }} day(s), {{ hours }} hour(s), {{ minutes }} minute(s) and
        {{ seconds }} second(s). <br />
        <span v-if="!settings.triggerOnce"
          >Confirm your <i>health check</i> email now or deactivate the
          <i>crypto-legacy</i> service to prevent the messages from being sent
          to your heirs.</span
        >
      </div>
    </div>
    <div v-if="settings.active && !hasArchivesWithHeirs">
      The service is not active yet. Create at least one archive with heir to
      activate the service.
    </div>
    <div v-if="!settings.active">
      Periodic <i>health checks</i> are currently disabled.
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HealthCheckInfo",
  inject: ["settingsService"],
  data() {
    return {
      errormsg: "",
      successmsg: "",
      fetchingData: false,
      settings: undefined,
      days: -1,
      hours: -1,
      minutes: -1,
      seconds: -1,
      intervalId: -1,
    };
  },
  created() {
    this.fetchSettings();
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
  computed: {
    hasArchivesWithHeirs() {
      return (
        this.settings.archives &&
        this.settings.archives.length > 0 &&
        this.settings.archives.filter(
          (archive) => archive.recipients.length > 0
        ).length > 0
      );
    },
  },
  methods: {
    interval() {
      this.recalculate();
      this.intervalId = setTimeout(this.interval, 1000);
    },
    recalculate() {
      this.days = this.getDays();
      this.hours = this.getHours();
      this.minutes = this.getMinutes();
      this.seconds = this.getSeconds();
    },
    getDays() {
      return Math.max(
        0,
        Math.floor((this.settings.dueDate - Date.now()) / 1000 / 60 / 60 / 24)
      );
    },
    getHours() {
      const rest = (this.settings.dueDate - Date.now()) % (1000 * 60 * 60 * 24);
      return Math.max(0, Math.floor(rest / 1000 / 60 / 60));
    },
    getMinutes() {
      const rest = (this.settings.dueDate - Date.now()) % (1000 * 60 * 60);
      return Math.max(0, Math.floor(rest / 1000 / 60));
    },
    getSeconds() {
      const rest = (this.settings.dueDate - Date.now()) % (1000 * 60);
      return Math.max(0, Math.floor(rest / 1000));
    },
    getMessageSendDate() {
      const oneDay = 1000 * 60 * 60 * 24;
      const numberContactAttempts = this.settings.contactAttempts.length;
      const sendDate = new Date(
        this.settings.dueDate +
          (4 - numberContactAttempts) * this.settings.intervalReminder * oneDay
      );
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return sendDate.toLocaleDateString("en", options);
    },
    lastHealthCheckSentDate() {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return new Date(
        this.settings.contactAttempts[this.settings.contactAttempts.length - 1]
      ).toLocaleDateString("en", options);
    },
    async fetchSettings() {
      this.fetchingData = true;
      try {
        this.settings = await this.settingsService.fetchSettings();
        this.interval();
        this.fetchingData = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>
