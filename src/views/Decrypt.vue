<template>
  <div class="my-inner-block">
    <h3>Access an encrypted archive</h3>
    <IpfsDecrypt :iv="iv" :hash="hash" />
  </div>
</template>

<script>
import IpfsDecrypt from "@/components/IpfsDecrypt.vue";

export default {
  components: {
    IpfsDecrypt,
  },
  computed: {
    iv() {
      return this.$route.query.iv;
    },
    hash() {
      return this.$route.query.hash;
    },
  },
};
</script>
