<template>
  <div class="my-inner-block-wide">
    <h3 class="mb-4 my-center" test="welcome">Welcome {{ email }}</h3>
    <ul class="nav nav-tabs">
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
          >Info</router-link
        >
      </li>
    </ul>
    <div class="tab-content mt-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Userfront from "@userfront/core";

export default {
  data() {
    return {
      email: Userfront.user && Userfront.user.email,
    };
  },
};
</script>
