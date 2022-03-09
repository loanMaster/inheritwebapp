<template>
  <span class="my-crypto-address" @click="copy">{{ address }} 📋</span
  ><span class="my-short fadeOut ml-2" v-if="copiedAddress">✅ copied</span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CopyText",
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
      navigator.clipboard.writeText(this.address as string);
      this.copiedAddress = true;
      setTimeout(() => {
        this.copiedAddress = false;
      }, 2000);
    },
  },
});
</script>

<style scoped>
.my-short {
  animation-duration: 2s;
}
.my-crypto-address {
  cursor: pointer;
  overflow-wrap: break-word;
  max-width: 100%;
  word-break: break-all;
}
.my-crypto-address:hover {
  color: blue;
}
</style>
