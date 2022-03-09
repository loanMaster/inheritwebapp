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
    Ethereum / DAI / USDC / USD-T:
    <CopyText
      address="0x49c98b33edab55dccb4d8a1793fee56b2e482d22"
    /><br /><br />
    Cardano:
    <CopyText
      address="DdzFFzCqrht5KWFo1yhC4vd4SX2mroEDZKYAc3Rw3TqdvkBgfDUYGktQvaWgeMG84DGjsdRDvFdujVQnHjv2sV2geoa1zyqqUmEyndhf"
    /><br /><br />
    Solana:
    <CopyText
      address="ANqgvpCsEjAZ71e1DU3Cq6VS2Agk5m56rgQt8XEcq2Ho"
    /><br /><br />
    Luna:
    <CopyText
      address="terra1z2lj8xaqadvfxdfyjaghd57x3zcvt8233k3h8j"
    /><br /><br />
    Polkadot:
    <CopyText
      address="14dAqjsNqy34kh7VfwbH8z8vNLzyT1K1QRKpn9gv4BS1ewZu"
    /><br /><br />
    Avalanche:
    <CopyText
      address="0x555f90751ce2fafe97d67bd8c75f6861ce08318a"
    /><br /><br />
    Doge:
    <CopyText address="DJf2WJC5o2W7WPi7LRMd9PfYYpyiPavqh2" /><br /><br />
    Monero:
    <CopyText
      address="84jtHTywSuZZXdg4K1TFmKREcbP7SwMNQ95uygHgf95oHfuEdY6YtmH5ZFZWC6bYg91heLFNJW5zeh4mtL62MFiJSsU5TMU"
    />
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
