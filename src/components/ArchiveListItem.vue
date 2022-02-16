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
    Do you want to delete this archive? This action can not be undone.
  </AppModal>

  <AppModal
    :title="'Download and decrypt archive'"
    :cancel-button-title="'Cancel'"
    :show-modal="showDecryptModal"
    @cancel="showDecryptModal = false"
    test="download-and-decrypt-modal"
  >
    <IpfsDecrypt
      v-if="showDecryptModal && archive"
      :iv="archive.iv"
      :hash="archive.ipfsHash"
      @decryption-complete="showDecryptModal = false"
    />
  </AppModal>

  <AppModal
    :title="'Edit archive'"
    :cancel-button-title="'Close'"
    :show-modal="showEditModal"
    @cancel="onEditModalClose"
    test="edit-archive-modal"
  >
    <EditArchive v-if="showEditModal && archive" :archive-id="archiveId" />
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
        <div class="my-bold">Location</div>
        <a
          class="my-word-break-all"
          test="archive-ipfs-link"
          :href="'https://ipfs.io/ipfs/' + archive.ipfsHash"
          >https://ipfs.io/ipfs/{{ archive.ipfsHash }}</a
        >
      </div>
      <div class="my-bold mt-2">Access code</div>
      <div class="my-normal-font" test="access-code">
        <CopyText :address="archive.accessCode" />
      </div>
      <div>
        ⚠ Share this code with your heirs. Your heirs can use the code to
        trigger a <i>health check</i>
        and access the archive after your death.
      </div>
      <div class="archive-columns mt-2">
        <div
          class="my-flex-1 mr-2"
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <div class="mb-3">
            <div class="my-bold">Archive name</div>
            <div type="text" class="my-normal-font" test="archive-name">
              {{ archive.archiveName }}
            </div>
            <div class="my-bold mt-2">Creation date</div>
            <span test="creation-date">{{
              formatDate(archive.creationDate || Date.now())
            }}</span>
          </div>

          <div class="my-flex-align-center">
            <button
              type="button"
              class="btn btn-primary btn-blockmr-2 mr-2"
              test="show-edit-modal"
              @click="showEditModal = true"
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
          <div class="my-bold">Hash</div>
          <span test="ipfs-hash">{{ archive.ipfsHash }}</span>
          <div class="my-bold mt-2">Initialization vector (iv)</div>
          <span test="iv">{{ archive.iv }}</span>
          <div class="my-bold mt-2">Size</div>
          <span test="size">{{ formatBytes(archive.size || 0) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import IpfsDecrypt from "@/components/IpfsDecrypt.vue";
import AppModal from "@/components/AppModal.vue";
import EditArchive from "@/components/EditArchive.vue";
import { formatBytes } from "@/util/format-bytes";
import CopyText from "@/components/CopyText.vue";

export default defineComponent({
  name: "ArchiveListItem",
  inject: ["settingsService"],
  data() {
    return {
      deleting: false,
      deleteErrorMsg: "",
      showConfirmationModal: false,
      showDecryptModal: false,
      showEditModal: false,
      archive: undefined,
    };
  },
  props: {
    archiveId: String,
  },
  emits: ["archive-deleted"],
  components: {
    IpfsDecrypt,
    AppModal,
    EditArchive,
    CopyText,
  },
  async created() {
    const settings = await this.settingsService.fetchSettings();
    this.archive = settings.archives.find((m) => m.id === this.archiveId);
  },
  methods: {
    showDeleteDialog() {
      this.showConfirmationModal = true;
    },
    async deleteArchive() {
      try {
        this.deleting = true;
        await this.settingsService.deleteArchive(this.archive.id);
        this.showConfirmationModal = false;
        this.$emit("archive-deleted");
      } catch (error) {
        this.deleteErrorMsg = error;
      } finally {
        this.deleting = false;
      }
    },
    async onEditModalClose() {
      const settings = await this.settingsService.fetchSettings();
      this.archive = settings.archives.find((m) => m.id === this.archiveId);
      this.showEditModal = false;
    },
    formatDate(date) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(date).toLocaleDateString("en", options);
    },
    formatBytes(bytes, decimals = 2) {
      return formatBytes(bytes, decimals);
    },
    showDecryptionDialog() {
      this.showDecryptModal = true;
    },
  },
});
</script>

<style scoped>
.archive-columns {
  display: flex;
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
