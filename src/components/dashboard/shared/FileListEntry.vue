<template>
  <div class="input-group my-flex-align-center">
    <div class="my-flex-1">
      {{ attachment.name }},
      {{ formatBytes(attachment.size) }}
    </div>
    <button
      type="button"
      class="btn btn-outline-primary"
      test="download-file"
      :disabled="disabled"
      @click="downloadFile(attachment)"
    >
      <i class="bi-cloud-arrow-down"></i>
    </button>
    <button
      type="button"
      test="remove-attachment"
      :disabled="disabled"
      class="btn btn-outline-danger"
      @click="removeAttachment(index)"
    >
      <i class="bi-trash"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { formatBytes } from "@/util/format-bytes";
import FileSaver from "file-saver";
import { Attachment } from "@/entities/attachment";

export default defineComponent({
  name: "FileListEntry",
  props: {
    attachment: Object,
    disabled: Boolean,
  },
  emits: ["remove-attachment"],
  methods: {
    removeAttachment() {
      this.$emit("remove-attachment", this.attachment);
    },
    async downloadFile(attachment: Attachment) {
      const blob = new Blob([await attachment.arrayBuffer()]);
      FileSaver.saveAs(blob, attachment.name);
    },
    formatBytes(size: number) {
      return formatBytes(size);
    },
  },
});
</script>
