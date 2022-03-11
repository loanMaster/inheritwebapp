<template>
  <AppModal
    :title="'Replace files?'"
    :cancelButton-title="'No'"
    :confirm-button-title="'Yes'"
    :show-modal="showConfirmationModal"
    @cancel="closeModal"
    @confirm="confirmDelete"
    test="confirm-override-modal"
  >
    Do you want to replace the following file(s)?
    <div v-if="showConfirmationModal">
      <div v-for="file in getFilesToOverride().slice(0, 5)" :key="file.name">
        {{ file.name }}
      </div>
      <div v-if="getFilesToOverride().length > 5">...</div>
    </div>
  </AppModal>

  <div
    v-for="attachment in attachments"
    :key="attachment"
    class="mb-2"
    test="file-attachment"
  >
    <FileListEntry
      :attachment="attachment"
      :disabled="disabled"
      @remove-attachment="removeAttachment"
    ></FileListEntry>
  </div>
  <div v-if="attachments.length > 0" class="mb-2">
    <span
      ><b>Total file size: {{ totalFileSize }}</b></span
    >
  </div>
  <div class="mb-4">
    <input
      class="form-control"
      @change="addFile($event)"
      type="file"
      multiple="true"
      :disabled="disabled"
      test="upload-file"
      ref="upload-file-input"
    />
    <div class="my-msg-anchor">
      <div v-if="fileInputError" class="invalid-feedback">
        {{ fileInputError }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { calculateTotalSize } from "@/util/file.helper";
import { formatBytes } from "@/util/format-bytes";
import FileListEntry from "@/components/dashboard/shared/FileListEntry.vue";
import AppModal from "@/components/shared/AppModal.vue";

export default defineComponent({
  name: "MultiFileInput",
  components: {
    FileListEntry,
    AppModal,
  },
  data() {
    return {
      fileInputError: "",
      showConfirmationModal: false,
    };
  },
  props: {
    disabled: { type: Boolean, default: false },
    maxFileSize: { type: Number, default: 10 * 1024 * 1024 },
    attachments: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["attachments-update"],
  computed: {
    inputElement() {
      return this.$refs["upload-file-input"] as HTMLInputElement;
    },
    totalFileSize() {
      return formatBytes(
        calculateTotalSize([this.attachments as unknown as any[]])
      );
    },
  },
  methods: {
    closeModal() {
      this.showConfirmationModal = false;
      this.inputElement.value = null as any;
    },
    confirmDelete() {
      this.showConfirmationModal = false;
      this.addFilesExecute();
    },
    async addFile(event: any) {
      this.fileInputError = "";
      const totalFIleSize = calculateTotalSize([
        this.attachments as unknown as any[],
        Array.from(event.target.files),
      ]);
      if (totalFIleSize > this.maxFileSize) {
        this.fileInputError = `Total archive size exceeded. The max size is ${formatBytes(
          this.maxFileSize
        )}.`;
        return;
      }
      if (this.getFilesToOverride().length > 0) {
        this.showConfirmationModal = true;
      } else {
        this.addFilesExecute();
      }
    },
    getFilesToOverride() {
      if (!this.inputElement.files) {
        return [];
      }
      const targetFileNames = Array.from(this.inputElement.files).map(
        (f) => f.name
      );
      return this.attachments.filter(
        (a) => targetFileNames.indexOf((a as File).name) > -1
      );
    },
    addFilesExecute() {
      const filesToOverride = this.getFilesToOverride().map(
        (f) => (f as File).name
      );
      let newAttachments: File[] = [];
      if (filesToOverride.length > 0) {
        newAttachments = this.attachments.filter(
          (a) => filesToOverride.indexOf((a as File).name) === -1
        ) as File[];
      } else {
        this.attachments.forEach((a) => newAttachments.push(a as File));
      }
      Array.from(this.inputElement.files as FileList).forEach((f) => {
        newAttachments.push(f);
      });
      this.inputElement.value = null as any;
      this.$emit("attachments-update", newAttachments);
    },
    removeAttachment(attachment: File) {
      this.fileInputError = "";
      const newAttachments = this.attachments.filter(
        (a) => a !== attachment
      ) as File[];
      this.$emit("attachments-update", newAttachments);
    },
  },
});
</script>
