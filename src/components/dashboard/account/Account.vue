<template>
  <div text="account-info-text">
    <span test="email">Email: {{ user.email }}</span
    ><br />
    <span test="member-since">Member since: {{ registrationDate }}</span>
  </div>
  <button
    class="btn btn-outline-primary mt-2"
    @click="resetPassword"
    test="reset-password"
    :disabled="isSending || pwReset"
  >
    Change / Reset password
  </button>
  <br />
  <span v-if="pwReset" class="display-block" test="reset-pw-success-msg">
    👍 You will receive a password reset link shortly
  </span>
  <div v-if="errormsg" test="error-msg" class="invalid-feedback display-block">
    {{ errormsg }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { formatDateTime } from "@/util/format-date";

export default defineComponent({
  name: "Account",
  data() {
    return {
      errormsg: "",
      isSending: false,
      pwReset: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    registrationDate() {
      return formatDateTime(
        new Date(this.$store.state.user.createdAt).getTime()
      );
    },
  },
  methods: {
    async resetPassword() {
      try {
        this.isSending = true;
        await this.$store.dispatch("sendResetLink", this.user.email);
        this.pwReset = true;
      } catch (error: any) {
        this.errormsg = error.message;
      } finally {
        this.isSending = false;
      }
    },
  },
});
</script>
