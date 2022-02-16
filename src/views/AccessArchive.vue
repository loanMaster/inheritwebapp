<template>
  <div class="my-inner-block" v-if="!iv">
    <TriggerHealthCheck @access-granted="onAccessGranted" />
  </div>
  <div class="my-inner-block" v-if="iv">
    <div>Access granted</div>
    <h3>Download and decrypt the archive</h3>
    <IpfsDecrypt :iv="iv" :hash="hash" />
  </div>
</template>

<script>
import TriggerHealthCheck from "@/components/TriggerHealthCheck";
import IpfsDecrypt from "@/components/IpfsDecrypt";

export default {
  components: {
    TriggerHealthCheck,
    IpfsDecrypt,
  },
  data() {
    return {
      iv: "",
      hash: "",
    };
  },
  methods: {
    async onAccessGranted({ iv, hash }) {
      this.iv = iv;
      this.hash = hash;
    },
  },
};
</script>
