<template>
  <AppModal
    :title="'Delete Archive?'"
    :cancelButton-title="'No'"
    :confirm-button-title="'Yes'"
    :show-modal="showConfirmationModal"
    :disabled="deleting"
    :error-msg="deleteErrorMsg"
    @cancel="showConfirmationModal = false"
    @confirm="deleteArchive"
    test="confirm-delete-modal"
  >
    Do you want to delete this archive? This action can not be undone. If you
    press 'yes' the archive will be deleted from the <i>my-legacy</i> database.
    <span v-if="archive.file.ipfs"
      >The corresponding ipfs file will be unpinned.</span
    >
  </AppModal>

  <AppModal
    :title="'Download and decrypt archive'"
    :cancel-button-title="'Cancel'"
    :show-modal="showDecryptModal"
    @cancel="showDecryptModal = false"
    test="download-and-decrypt-modal"
  >
    <Decrypt
      v-if="showDecryptModal && archive"
      @decryption-complete="showDecryptModal = false"
    />
  </AppModal>

  <AppModal
    :title="'Edit archive'"
    :cancel-button-title="'Close'"
    :show-modal="showEditModal"
    :large="true"
    @cancel="showEditModal = false"
    test="edit-archive-modal"
  >
    <EditArchive v-if="showEditModal && archive" />
  </AppModal>

  <div class="my-border-box mt-4 mb-2" v-if="archive" test="edit-archive">
    <div>
      <div class="my-float-right">
        <button
          type="button"
          class="btn btn-outline-danger"
          @click="showDeleteDialog"
          test="delete-archive-btn"
        >
          <i class="bi-trash"></i>
        </button>
      </div>
      <div>
        <div class="my-bold">Access code</div>
        <div class="my-normal-font" test="access-code">
          <CopyText :address="archive.accessCode" />
        </div>
        <div>
          ⚠ Share this code with your heirs. Your heirs can use the code to
          trigger a <i>health check</i>
          and access the archive after your death.
        </div>
        <div class="my-bold mt-2">Location</div>
        <a
          class="my-word-break-all"
          test="archive-ipfs-link"
          :href="
            archive.file.ipfs
              ? 'https://ipfs.io/ipfs/' + archive.file.id
              : archive.file.location
          "
          >{{
            archive.file.ipfs
              ? "https://ipfs.io/ipfs/" + archive.file.id
              : archive.file.location
          }}</a
        >
      </div>
      <div class="archive-columns mt-2">
        <div class="mr-2 my-flex-1 my-flex archive-column-left">
          <div class="mb-3">
            <div class="my-bold">Archive name</div>
            <div type="text" class="my-normal-font" test="archive-name">
              {{ archive.archiveName || "-" }}
            </div>
            <div class="my-bold mt-2">Creation date</div>
            <span test="creation-date">{{
              formatDateTime(archive.creationDate || Date.now())
            }}</span>
            <div class="my-bold mt-2">Last modified on</div>
            <span test="creation-date">{{
              formatDateTime(archive.lastModified || Date.now())
            }}</span>
          </div>

          <div class="my-flex-align-center">
            <button
              type="button"
              class="btn btn-primary btn-blockmr-2 mr-2"
              test="show-edit-modal"
              @click="showEditDialog"
            >
              Edit
            </button>
            <button
              type="button"
              class="btn btn-dark btn-blockmr-2 mr-2"
              test="show-download-dialog"
              @click="showDecryptionDialog"
            >
              Download & decrypt
            </button>
          </div>
        </div>
        <div class="my-flex-1 my-word-break-all archive-column-right">
          <div class="my-bold">Id / Hash</div>
          <span test="file-id">{{ archive.file.id }}</span>
          <div class="my-bold mt-2">Initialization vector (iv)</div>
          <span test="iv">{{ archive.iv }}</span>
          <div class="my-bold mt-2">Size</div>
          <span test="size">{{ formatBytes(archive.file.size || 0) }}</span>
          <div class="my-bold mt-2">Storage location</div>
          <span test="location-type">{{
            archive.file.ipfs ? "ipfs" : "Cloud storage container"
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Decrypt from "@/components/dashboard/manage-archives/Decrypt.vue";
import AppModal from "@/components/shared/AppModal.vue";
import EditArchive from "@/components/dashboard/manage-archives/EditArchive.vue";
import { formatBytes } from "@/util/format-bytes";
import CopyText from "@/components/shared/CopyText.vue";
import { formatDateTime } from "@/util/format-date";
import { Settings } from "@/entities/settings";
import { Archive } from "@/entities/archive";

export default defineComponent({
  name: "ArchiveListItem",
  data() {
    return {
      deleting: false,
      deleteErrorMsg: "",
      showConfirmationModal: false,
      showDecryptModal: false,
      showEditModal: false,
    };
  },
  props: {
    archiveId: { type: String },
  },
  emits: ["archive-deleted"],
  components: {
    Decrypt,
    AppModal,
    EditArchive,
    CopyText,
  },
  computed: {
    archive(): Archive {
      return (this.$store.state.settings as Settings).archives.find(
        (a: Archive) => a.id === this.archiveId
      ) as Archive;
    },
  },
  methods: {
    showDeleteDialog() {
      this.$store.commit("currentArchive", this.archive);
      this.showConfirmationModal = true;
    },
    async deleteArchive() {
      try {
        this.deleting = true;
        await this.$store.dispatch("deleteArchive", this.archive.id);
        this.showConfirmationModal = false;
        this.$emit("archive-deleted");
      } catch (error: any) {
        this.deleteErrorMsg = error;
      } finally {
        this.deleting = false;
      }
    },
    formatDateTime(date: number) {
      return formatDateTime(date);
    },
    formatBytes(bytes: number, decimals = 2) {
      return formatBytes(bytes, decimals);
    },
    showDecryptionDialog() {
      this.$store.commit("currentArchive", this.archive);
      this.showDecryptModal = true;
    },
    showEditDialog() {
      this.$store.commit("currentArchive", this.archive);
      this.showEditModal = true;
    },
  },
});
</script>

<style scoped>
.archive-columns {
  display: flex;
}

.archive-column-left {
  justify-content: space-between;
  flex-direction: column;
}

.archive-column-right {
  margin-left: 6px;
}

@media screen and (max-width: 992px) {
  .archive-columns {
    flex-direction: column-reverse;
  }

  .archive-column-right {
    margin-left: 0;
  }
}
</style>
