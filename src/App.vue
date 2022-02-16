<template>
  <div class="vue-template">
    <nav class="my-nav navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand my-nav-bar">
          <img src="/icons/icon.png" class="my-brand-icon" />
          <span class="my-bold my-small-font">MY-LEGACY</span></a
        >
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          @click="toggleMenu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="collapse navbar-collapse show my-navbar"
          :class="collapsedMenu ? '' : 'my-expand'"
        >
          <ul class="navbar-nav me-auto mb-2-s mb-lg-0 ml-2-s">
            <li class="nav-item">
              <router-link class="nav-link active" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link active" to="/docs"
                >Documentation</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link active" to="/dashboard"
                >Dashboard</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link active"
                to="/health-check-and-decrypt"
                >Trigger a health check / Access archive</router-link
              >
            </li>
          </ul>
          <div class="f-flex ml-2-s mb-2-s">
            <router-link class="mr-2" to="/login" v-if="!loggedIn"
              >Sign in</router-link
            >
            <router-link
              class="btn btn-outline-primary mr-2"
              test="btn-signup"
              to="/signup"
              v-if="!loggedIn"
              >Sign up</router-link
            >
            <button
              class="btn btn-outline-primary mr-2"
              test="btn-logout"
              @click="logout"
              v-if="loggedIn"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    <div class="app">
      <router-view />
    </div>
  </div>
</template>

<script>
import Userfront from "@userfront/core";
import { SettingsService } from "@/service/settings.service.ts";
import { EncryptionService } from "@/service/encryption.service.ts";

export default {
  data() {
    return {
      collapsedMenu: true,
    };
  },
  provide: {
    settingsService: new SettingsService(),
    encryptionService: new EncryptionService(),
  },
  computed: {
    loggedIn() {
      return Userfront.tokens.accessToken;
    },
  },
  methods: {
    logout() {
      Userfront.logout();
    },
    toggleMenu() {
      this.collapsedMenu = !this.collapsedMenu;
    },
  },
  watch: {
    $route: function () {
      this.collapsedMenu = true;
    },
  },
};
</script>

<style scoped>
.navbar {
  transition: all 0.3s;
}

@media screen and (max-width: 992px) {
  .my-navbar {
    transition: all 0.3s;
    max-height: 0;
    overflow: hidden;
  }

  .my-navbar.my-expand {
    max-height: 300px;
  }

  .ml-2-s {
    margin-left: 0.5rem;
  }

  .mb-2-s {
    margin-bottom: 0.5rem;
  }
}

.my-nav {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.my-nav-bar {
  display: flex;
  flex-direction: column;
  margin-top: -10px;
  margin-bottom: -12px;
  margin-right: 5px;
  align-content: center;
  align-items: center;
}

.my-brand-icon {
  max-height: 40px;
  height: 40px;
}
</style>
