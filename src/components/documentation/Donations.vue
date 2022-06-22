<template>
  <div class="mt-2">
    <h3>🙏 Donations</h3>
    <a
      href="https://www.paypal.com/donate/?hosted_button_id=6LF9EP8KGAX6L"
      class="btn btn-outline-primary mb-2 mt-2"
      >Donate with credit card or PayPal</a
    >

    <h4>Donate crypto</h4>
    (click on an address to copy it to the clipboard)<br /><br />
    Bitcoin:
    <CopyText address="3JUCr4UE9A7BELo661z729DehC4jgkqnVk" /><br /><br />
    Ethereum:
    <CopyText
      address="0x51622a619601E51f0a66F59036f7591C6bF1A29F"
    /><br /><br />
    Solana:
    <CopyText
      address="BRwkLE84SQoz8XTiG3hrN9iwYHTS8YSdnjNMY5qi7r7D"
    /><br /><br />
    Polkadot:
    <CopyText address="1YfKQnjEtVsp84PUYcXoSyMnbQjUnaWJmFX1GPNQgeniR1p" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CopyText from "@/components/shared/CopyText.vue";

export default defineComponent({
  components: {
    CopyText,
  },
});
</script>
