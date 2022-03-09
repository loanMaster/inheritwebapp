<template>
  <button
    type="button"
    test="google-login-submit"
    class="btn btn-outline-dark btn-lg"
    @click="login"
  >
    <img src="/images/google.svg" />
    <span>Google</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "GoogleLoginButton",
  methods: {
    login() {
      this.$store.dispatch("signup", { method: "google" });
    },
  },
});
</script>

<style scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
img {
  width: 35px;
  height: 35px;
  margin-right: 6px;
}
button span {
  margin-left: 6px;
}
</style>
