<template>
  <div class="my-inner-block">
    <div class="vue-template">
      <h3>Email verification pending</h3>
      Thank you for signing up. To activate your account click on the link in
      the verification email which was sent to {{ email }}.
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
  },
  methods: {
    async sendVerificationEmail() {
      await this.$store.dispatch("sentVerificationLink");
      this.emailSent = true;
    },
  },
});
</script>
