<template>
  <div class="my-inner-block">
    <form @submit.prevent="submit" v-if="showForm">
      <h3>Sign In</h3>

      <div class="form-group">
        <label>Email address</label>
        <input
          type="email"
          test="login-email"
          class="form-control form-control-lg"
          v-model="email"
          required
        />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          type="password"
          test="login-password"
          class="form-control form-control-lg"
          v-model="password"
          required
        />
      </div>

      <button
        type="submit"
        test="login-submit"
        class="btn btn-dark btn-lg btn-block mt-2"
        :disabled="submitting"
      >
        Sign In
      </button>
      <div v-if="errormsg" test="login-error-msg" class="invalid-feedback">
        {{ errormsg }}
      </div>
      <p class="forgot-password text-right mt-2 mb-4">
        <router-link test="reset-password-link" to="/reset-password"
          >Forgot password ?</router-link
        >
      </p>
    </form>
  </div>
</template>

<script>
import Userfront from "@userfront/core";

export default {
  data() {
    return {
      email: "",
      password: "",
      errormsg: "",
      showForm: true,
      submitting: false,
    };
  },
  async created() {
    if (Userfront.user && Userfront.user.isConfirmed) {
      Userfront.redirectIfLoggedIn();
    }
    if (this.$route.query.uuid && this.$route.query.token) {
      this.showForm = false;
      try {
        await Userfront.login({
          method: "link",
          uuid: this.$route.query.uuid,
          token: this.$route.query.token,
        });
      } catch (error) {
        this.showForm = true;
      }
    }
  },
  methods: {
    async submit() {
      try {
        this.submitting = true;
        this.errormsg = "";
        await Userfront.login({
          method: "password",
          emailOrUsername: this.email,
          password: this.password,
        });
      } catch (error) {
        this.errormsg = error.message;
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>
