<template>
  <div class="my-inner-block">
    <form @submit.prevent="submit" v-if="!passwordReset">
      <h3>Reset Password</h3>

      <div class="form-group">
        <label>New password</label>
        <input
          type="password"
          class="form-control form-control-lg"
          v-model="password"
          required
        />
        <span
          >At least 16 characters OR at least 8 characters including a number
          and a letter.</span
        >
      </div>
      <div class="form-group">
        <label>Verify password</label>
        <input
          type="password"
          class="form-control form-control-lg"
          v-model="passwordVerify"
          required
        />
      </div>

      <button type="submit" class="btn btn-dark btn-lg btn-block mt-2">
        Reset password
      </button>
      <div v-if="errormsg" class="invalid-feedback">
        {{ errormsg }}
      </div>
    </form>
    <div v-if="passwordReset">Password changed</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      password: "",
      passwordVerify: "",
      errormsg: "",
      passwordReset: false,
    };
  },
  methods: {
    async submit() {
      if (this.password !== this.passwordVerify) {
        this.errormsg = "Passwords are not identical";
        return;
      }
      try {
        await this.$store.dispatch("resetPassword", {
          password: this.password,
          uuid: this.$route.query.uuid,
          token: this.$route.query.token,
          redirect: false,
        });
        this.passwordReset = true;
      } catch (error: any) {
        this.errormsg = error.message || "Error trying to log in.";
      }
    },
  },
});
</script>
