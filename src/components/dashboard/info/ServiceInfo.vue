<template>
  <div text="service-info-text" v-if="settings">
    <div
      v-if="settings.triggerOnce && !settings.dead"
      text="triggered-manually-info"
    >
      A one-time <i>health check</i> has been triggered.<br />
      <div v-if="settings.contactAttempts.length > 0" class="mb-2">
        ⚠ You have not confirmed the reception of your last
        <i>health check</i> email yet. The message was sent on
        {{ lastHealthCheckSentDate() }}. Please click on the confirmation link
        in the email.
      </div>
      <div>
        <span v-if="settings.contactAttempts.length < 4"
          >The next <i>health check</i> email will be sent in</span
        >
        <span v-if="settings.contactAttempts.length >= 4"
          >⚠ <i>my-legacy</i> will conclude that you are dead in</span
        >
        <span v-if="minutes() > 5 || hours() > 0 || days() > 0"
          >&nbsp;~ {{ days() }} day(s), {{ hours() }} hour(s),
          {{ minutes() }} minute(s)</span
        >
        <span v-if="minutes() <= 5 && hours() === 0 && days() === 0"
          >&nbsp;less than 5 min</span
        >.
      </div>
      <div v-if="settings.contactAttempts.length < 4">
        In case you die today, access to the archives you prepared will be
        granted on {{ archiveAccessDate() }} to your heirs. Your heirs need the
        archive's <i>access code</i> and password to decrypt the file.
      </div>
    </div>
    <div v-if="settings.dead" test="info-dead">
      The system concluded that you are no longer alive. Your heirs are able to
      access your archives using the <i>access code</i> and archive password.
      You can update your <i>alive</i> status in your
      <router-link to="/dashboard/service-settings"
        >service settings</router-link
      >.
    </div>
    <div
      v-if="!settings.dead && !settings.triggerOnce"
      test="no-heath-check-triggered"
    >
      No health check has been triggered. If you die today and your heirs
      trigger a health check immediately, they will be able to access your
      archives on
      {{ archiveAccessDate() }}.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { formatDate, formatDateTime } from "@/util/format-date";
import { Settings } from "@/entities/settings";

export default defineComponent({
  name: "HealthCheckInfo",
  computed: {
    settings() {
      return this.$store.state.settings as Settings;
    },
  },
  methods: {
    lastHealthCheckSentDate() {
      return formatDateTime(
        this.settings.contactAttempts[this.settings.contactAttempts.length - 1]
      );
    },
    days() {
      return Math.max(
        0,
        Math.floor((this.settings.dueDate - Date.now()) / 1000 / 60 / 60 / 24)
      );
    },
    hours() {
      const rest = (this.settings.dueDate - Date.now()) % (1000 * 60 * 60 * 24);
      return Math.max(0, Math.floor(rest / 1000 / 60 / 60));
    },
    minutes() {
      const rest = (this.settings.dueDate - Date.now()) % (1000 * 60 * 60);
      return Math.max(0, Math.floor(rest / 1000 / 60));
    },
    archiveAccessDate() {
      const oneMin = 1000 * 60;
      const numberContactAttempts = this.settings.contactAttempts.length;
      const sendDate =
        (this.settings.triggerOnce ? this.settings.dueDate : Date.now()) +
        (4 - numberContactAttempts) * this.settings.intervalReminder * oneMin;
      return formatDate(sendDate);
    },
  },
});
</script>
