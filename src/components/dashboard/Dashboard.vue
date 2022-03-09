<template>
  <AppModal
    :title="'Thank you for using my-legacy'"
    :cancelButton-title="'Close'"
    :show-modal="showFirstAccessModal"
    @cancel="confirmFirstAccessModal"
    test="welcome-modal"
  >
    <FirstAccess />
  </AppModal>

  <div class="my-desktop-hidden">
    <UserInfo />
  </div>

  <SideNav v-if="hasSettings">
    <li class="nav-item">
      <router-link
        class="nav-link"
        active-class="active"
        :to="{ name: 'CreatedEncryptedArchive' }"
        >Create encrypted archive</router-link
      >
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        active-class="active"
        :to="{ name: 'ServiceSettings' }"
        >Service settings</router-link
      >
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        active-class="active"
        :to="{ name: 'ManageArchives' }"
        >Manage archives</router-link
      >
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        active-class="active"
        :to="{ name: 'HealthCheckInfo' }"
        >Service Info</router-link
      >
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        active-class="active"
        :to="{ name: 'History' }"
        >History</router-link
      >
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        active-class="active"
        :to="{ name: 'DashboardDonations' }"
        >Donate</router-link
      >
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        active-class="active"
        :to="{ name: 'Account' }"
        >Account</router-link
      >
    </li>
  </SideNav>

  <div
    v-if="!fetchingData"
    class="my-mobile-hidden my-border-box my-user-info"
    test="user-info-desktop"
  >
    <UserInfo />
  </div>

  <div class="my-inner-block-wide">
    <div class="my-center" v-if="fetchingData">
      <div class="spinner-border"></div>
    </div>
    <div class="tab-content mt-4" v-if="!fetchingData">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/shared/SideNav.vue";
import UserInfo from "@/components/dashboard/shared/UserInfo.vue";
import AppModal from "@/components/shared/AppModal.vue";
import FirstAccess from "@/components/dashboard/first-access/FirstAccess.vue";

export default defineComponent({
  components: {
    SideNav,
    UserInfo,
    FirstAccess,
    AppModal,
  },
  data() {
    return {
      fetchingData: false,
    };
  },
  computed: {
    dead() {
      return this.$store.state.settings?.dead;
    },
    email() {
      return this.$store.state.settings?.email;
    },
    hasSettings() {
      return !!this.$store.state.settings;
    },
    showFirstAccessModal() {
      return !!this.$store.state.settings?.justCreated;
    },
  },
  async created() {
    this.fetchingData = true;
    await this.$store.dispatch("fetchSettings");
    this.fetchingData = false;
  },
  methods: {
    confirmFirstAccessModal() {
      this.$store.commit("firstAccess", false);
    },
  },
});
</script>

<style scoped>
.my-user-info {
  position: fixed;
  width: 20%;
  right: 0;
  margin-right: 5px;
}
</style>
