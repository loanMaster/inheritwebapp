<template>
  <div class="my-inner-block">
    <div class="vue-template">
      <form @submit.prevent="submit" v-if="!signedUp">
        <h3>Sign Up</h3>

        <GoogleLoginButton class="mt-4" />

        <div class="form-group mt-4">
          <h4>Sign up with email</h4>
          <label>Email address</label>
          <input
            type="email"
            test="signup-email"
            class="form-control form-control-lg"
            v-model="email"
            required
            v-my-focus
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            test="signup-password"
            class="form-control form-control-lg"
            v-model="password"
            required
          />
          <span
            >At least 16 characters OR at least 8 characters including a number
            and a letter.</span
          >
        </div>

        <button
          type="submit"
          test="signup-submit"
          class="btn btn-dark btn-lg btn-block mt-2"
          :disabled="submitting"
        >
          Sign Up
        </button>
        <div v-if="errormsg" test="signup-error-msg" class="invalid-feedback">
          {{ errormsg }}
        </div>
        <div class="forgot-password text-right mt-2">
          Already registered
          <router-link :to="{ name: 'login' }">sign in?</router-link>
        </div>
      </form>
      <div v-if="signedUp" test="signup-success-msg">
        Thank you for signing up. To activate your account click on the link in
        the verification email you will receive shortly.
      </div>
    </div>
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
      signedUp: false,
      submitting: false,
    };
  },
  components: {
    GoogleLoginButton,
  },
  methods: {
    async submit() {
      try {
        this.errormsg = "";
        this.submitting = true;
        await this.$store.dispatch("signup", {
          method: "password",
          email: this.email,
          password: this.password,
          redirect: false,
        });
        this.signedUp = true;
      } catch (error: any) {
        this.errormsg = error.message;
      } finally {
        this.submitting = false;
      }
    },
  },
});
</script>
