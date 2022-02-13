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
        style="display: block"
        class="invalid-feedback"
      >
        {{ errormsg }}
      </div>
    </form>
    <div v-if="submitted" test="reset-password-success-msg">
      You will shortly receive an email with a link to reset your password.
    </div>
  </div>
</template>

<script>
import Userfront from "@userfront/core";

export default {
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
        await Userfront.sendResetLink(this.email);
        this.submitted = true;
      } catch (error) {
        this.isSending = false;
        this.errormsg = error.message;
      }
    },
  },
};
</script>
