<template>
  <span class="copy-crypto-address" @click="copy">{{ address }}</span
  ><span class="short fadeOut ml-2" v-if="copiedAddress"
    >✅ Address copied</span
  >
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "CryptoAddress",
  props: {
    address: String,
  },
  data() {
    return {
      copiedAddress: false,
    };
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(this.address);
      this.copiedAddress = true;
      setTimeout(() => {
        this.copiedAddress = false;
      }, 2000);
    },
  },
});
</script>

<style scoped>
.short {
  animation-duration: 2s;
}
.copy-crypto-address {
  cursor: pointer;
  overflow-wrap: break-word;
  max-width: 100%;
  word-break: break-all;
}
.copy-crypto-address:hover {
  color: blue;
}
</style>
