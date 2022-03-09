<template>
  <div class="my-inner-block">
    <form @submit.prevent="submit" v-if="!submitted">
      <h3>Reset Password</h3>

      <div class="form-group">
        <label>Email address</label>
        <input
          type="email"
          test="reset-password-email"
          class="form-control form-control-lg"
          v-model="email"
          required
          v-my-focus
        />
      </div>

      <button
        type="submit"
        test="reset-password-submit"
        class="btn btn-dark btn-lg btn-block mt-2"
        :disabled="isSending"
      >
        Reset password
      </button>
      <div
        v-if="errormsg"
        test="reset-password-error-msg"
        class="invalid-feedback display-block"
      >
        {{ errormsg }}
      </div>
    </form>
    <div v-if="submitted" test="reset-password-success-msg">
      You will shortly receive an email with a link to reset your password.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      email: "",
      errormsg: "",
      submitted: false,
      isSending: false,
    };
  },
  methods: {
    async submit() {
      try {
        this.isSending = true;
        await this.$store.dispatch("sendResetLink", this.email);
        this.submitted = true;
      } catch (error: any) {
        this.isSending = false;
        this.errormsg = error.message;
      }
    },
  },
});
</script>
