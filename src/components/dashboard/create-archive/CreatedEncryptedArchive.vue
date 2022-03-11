<template>
  <div v-if="!archiveCreated && settings && settings.archives.length < 3">
    <div class="my-justify">
      Create an encrypted archive. Your files will be zipped and encrypted with
      the
      <a href="https://en.wikipedia.org/wiki/Web_Cryptography_API"
        >Web Cryptography API</a
      >
      using the
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-gcmin"
        >AES-GCM algorithm</a
      >
      in the browser.
    </div>
    <div class="my-border-box mt-4 mb-2">
      <CreateArchive @archive-created="onArchiveCreated" />
    </div>
  </div>
  <div v-if="!archiveCreated && settings && settings.archives.length >= 3">
    You have already created 3 archives. Users can not create more than 3
    archives.
  </div>
  <div v-if="archiveCreated && archive" test="archive-created-msg">
    The archive was successfully created. You can download and decrypt the
    archive <router-link to="/dashboard/manage-archives">here</router-link>.
    <br />
    <br />
    If you die, your heirs can trigger a <i>health check</i> using the
    <i>access code</i> <CopyText :address="archive.accessCode" />
    &nbsp;
    <router-link to="/health-check-and-decrypt">here</router-link>
    .<br />
    After your death they can use the <i>access code</i> to access your archive.
    The <i>access code</i> is shown in the 'Manage archives' tab.<br />
    <br />
    Please share the <i>access code</i> and the encryption password with your
    heirs.
    <div v-if="settings.archives.length < 3">
      <button
        @click="createAnotherArchive"
        test="create-another-archive"
        class="btn btn-outline-primary mt-4"
      >
        Create another archive
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CopyText from "@/components/shared/CopyText.vue";
import CreateArchive from "@/components/dashboard/create-archive/CreateArchive.vue";

export default defineComponent({
  name: "CreateEncryptedArchive",
  data() {
    return {
      fetchingData: false,
      archiveCreated: false,
    } as {
      fetchingData: boolean;
      archiveCreated: boolean;
    };
  },
  components: {
    CopyText,
    CreateArchive,
  },
  created() {
    this.$store.commit("currentArchive", undefined);
  },
  computed: {
    archive() {
      return this.$store.state.currentArchive;
    },
    settings() {
      return this.$store.state.settings;
    },
  },
  methods: {
    async onArchiveCreated() {
      this.archiveCreated = true;
    },
    createAnotherArchive() {
      this.$store.commit("currentArchive", undefined);
      this.archiveCreated = false;
    },
  },
});
</script>
