<template>
  <div class="my-inner-block">
    <form @submit.prevent="submit" v-if="showForm">
      <h3>Sign In</h3>

      <GoogleLoginButton class="mt-4" />

      <div class="form-group mt-4">
        <h4>Sign in with email</h4>
        <label>Email address</label>
        <input
          type="email"
          test="login-email"
          class="form-control form-control-lg"
          v-model="email"
          autocomplete="on"
          required
          v-my-focus
        />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          type="password"
          test="login-password"
          class="form-control form-control-lg"
          v-model="password"
          autocomplete="on"
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

<script lang="ts">
import { defineComponent } from "vue";
import GoogleLoginButton from "@/components/user-management/GoogleLoginButton.vue";

export default defineComponent({
  data() {
    return {
      email: "",
      password: "",
      errormsg: "",
      showForm: true,
      submitting: false,
    };
  },
  components: {
    GoogleLoginButton,
  },
  async created() {
    await this.$store.dispatch("redirectIfLoggedIn");
    if (this.$route.query.uuid && this.$route.query.token) {
      this.showForm = false;
      try {
        await this.$store.dispatch("login", {
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
        await this.$store.dispatch("login", {
          method: "password",
          emailOrUsername: this.email,
          password: this.password,
        });
      } catch (error: any) {
        this.errormsg = error.message;
        this.submitting = false;
      }
    },
  },
});
</script>
