<template>
  <div class="modal fade my-modal" :class="showModal ? 'show' : ''">
    <div
      class="modal-dialog modal-dialog-centered"
      :class="
        large
          ? 'modal-dialog-scrollable modal-lg'
          : scrollable
          ? 'modal-dialog-scrollable'
          : ''
      "
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            @click="cancel"
            :disabled="disabled"
          ></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            :disabled="disabled"
            @click="cancel"
            test="modal-cancel"
          >
            {{ cancelButtonTitle }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="disabled"
            @click="confirm"
            test="modal-confirm"
            v-if="confirmButtonTitle"
          >
            {{ confirmButtonTitle }}
          </button>
          <span v-if="errorMsg" class="invalid-feedback">{{ errorMsg }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppModal",
  props: {
    title: { type: String },
    cancelButtonTitle: { type: String },
    confirmButtonTitle: { type: String },
    showModal: { type: Boolean },
    errorMsg: { type: String },
    disabled: { type: Boolean },
    large: { type: Boolean },
    scrollable: { type: Boolean },
  },
  emits: ["confirm", "cancel"],
  methods: {
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.$emit("cancel");
    },
  },
});
</script>

<style scoped>
.my-modal {
  display: block;
  pointer-events: none;
  background-color: #00000044;
}
.my-modal:not(.show) .modal-content {
  pointer-events: none;
}
</style>
