<template>
  <div class="my-flex">
    <AppStepper
      :step="step"
      :steps="steps"
      class="my-flex-1 my-mobile-hidden"
    />
    <div class="my-flex-2">
      <EncryptAndUpload v-if="step === 1" @archive-created="onArchiveCreated" />
      <AssignHeirs
        v-if="step === 2"
        :archive-id="archiveId"
        @heirs-assigned="onHeirsAssigned"
      />
      <div v-if="step === 3">
        <span test="create-archive-success-msg"
          >Done!<br />
          You can update the heirs for your archive at any time in the 'manage
          archives' tab.</span
        >
        <div class="my-flex-align-center">
          <button
            @click="step = 1"
            class="btn btn-dark btn-lg btn-block mt-2 mr-2"
            test="create-another-archive"
          >
            Create another archive<br />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import AppStepper from "@/components/AppStepper.vue";
import EncryptAndUpload from "@/components/EncryptAndUpload.vue";
import AssignHeirs from "@/components/AssignHeirs.vue";

export default defineComponent({
  name: "CreateEncryptedArchive",
  data() {
    return {
      step: 1,
      steps: ["Create encrypted archive", "Assign heirs", "Confirmation"],
      archiveId: "",
    };
  },
  components: {
    AppStepper,
    EncryptAndUpload,
    AssignHeirs,
  },
  methods: {
    onArchiveCreated({ archiveId }) {
      this.archiveId = archiveId;
      this.step++;
    },
    onHeirsAssigned() {
      this.step++;
    },
  },
});
</script>
