<template>
  <div class="my-inner-block">
    <div>
      <h3>Email verification pending</h3>
      Thank you for signing up. To activate your account click on the link in
      the verification email which was sent to {{ email }}.
    </div>
    <div v-if="firefox">
      ⚠ There is currently an issue in <b>firefox</b> with account verification.
      In case you have already verified your email, just logout and login again
      to proceed to the dashboard. ⚠
    </div>
    <button
      class="btn btn-dark btn-lg btn-block mt-2"
      type="button"
      @click="sendVerificationEmail"
      test="send-verification-email"
      :disabled="emailSent"
    >
      Resend verification email
    </button>
    <span
      v-my-visible="emailSent"
      class="display-block"
      test="email-sent-successmsg"
      >✉ Email sent</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      emailSent: false,
    };
  },
  computed: {
    email() {
      return this.$store.state.email;
    },
    firefox() {
      return navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    },
  },
  methods: {
    async sendVerificationEmail() {
      await this.$store.dispatch("sentVerificationLink");
      this.emailSent = true;
    },
  },
});
</script>
