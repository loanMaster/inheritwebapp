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
      <div class="archive-columns mt-2">
        <form @submit.prevent="updateArchive" class="my-flex-1 mr-2">
          <div class="form-group">
            <label>Archive name</label>
            <input
              type="text"
              class="my-normal-font form-control form-control-lg"
              maxlength="100"
              test="archive-name"
              :disabled="savingData"
              v-model="archive.archiveName"
            />
          </div>

          <label class="form-label mt-2">Heirs</label>
          <div
            v-for="(recipient, index) in archive.recipients"
            :key="recipient"
          >
            <div class="input-group mb-3">
              <input
                type="email"
                class="my-normal-font form-control form-control-lg"
                placeholder="Heir email address"
                test="heir-email"
                :disabled="savingData"
                v-model="recipient.email"
                required
              />
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="removeRecipient(index)"
              >
                <i class="bi-trash" test="remove-heir"></i>
              </button>
            </div>
          </div>

          <div class="mt-2">
            <button
              type="button"
              class="btn btn-primary"
              @click="addRecipient"
              :disabled="savingData"
              test="add-heir"
            >
              <i class="bi-plus"></i> Add heir
            </button>
          </div>
          <div class="my-flex-align-center mb-2 mt-2">
            <button
              type="submit"
              class="btn btn-dark btn-blockmr-2 mr-2"
              test="submit"
              :disabled="savingData"
            >
              Save changes
            </button>
            <button
              type="button"
              class="btn btn-dark btn-blockmr-2 mr-2"
              test="downoad-and-decrypt-submit"
              :disabled="savingData"
              @click="showDecryptionDialog"
            >
              Download & decrypt
            </button>
            <div
              class="spinner-border my-spinner"
              v-my-visible="savingData"
            ></div>
          </div>
          <span
            v-if="successmsg"
            class="fadeOut display-block"
            test="success-msg"
            >{{ successmsg }}</span
          >
          <span v-if="errormsg" class="invalid-feedback" test="error-msg">{{
            "errormsg"
          }}</span>
        </form>
        <div class="my-flex-1 my-word-break-all archive-column-right">
          <div class="my-bold">Hash</div>
          <span test="ipfs-hash">{{ archive.ipfsHash }}</span>
          <div class="my-bold mt-2">Initialization vector (iv)</div>
          <span test="iv">{{ archive.iv }}</span>
          <div class="my-bold mt-2">Creation date</div>
          <span test="creation-date">{{
            formatDate(archive.creationDate || Date.now())
          }}</span>
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
import { formatBytes } from "@/util/format-bytes";

export default defineComponent({
  name: "EditArchive",
  inject: ["settingsService"],
  data() {
    return {
      errormsg: "",
      successmsg: "",
      savingData: false,
      deleting: false,
      deleteErrorMsg: "",
      showConfirmationModal: false,
      showDecryptModal: false,
      archive: undefined,
    };
  },
  props: {
    archiveId: String,
  },
  emits: ["archive-updated"],
  components: {
    IpfsDecrypt,
    AppModal,
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
        this.$emit("archive-updated");
      } catch (error) {
        this.deleteErrorMsg = error;
      } finally {
        this.deleting = false;
      }
    },
    async updateArchive() {
      this.savingData = true;
      this.errormsg = "";
      this.successmsg = "";
      try {
        const settings = await this.settingsService.updateArchive(this.archive);
        this.archive = JSON.stringify(
          settings.archives.find((m) => m.id === this.archive.id)
        );
        this.successmsg = "👍 Archive updated ";
        this.$emit("archive-updated");
      } catch (error) {
        this.errormsg = error;
      }
      this.savingData = false;
    },
    removeRecipient(recipientIndex) {
      this.archive.recipients.splice(recipientIndex, 1);
    },
    addRecipient() {
      this.archive.recipients.push({ email: "" });
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
.my-spinner {
  min-width: 2rem;
}
</style>
