<template>
  <div class="my-inner-block-wide">
    <div class="justify">
      <div class="bulletpoint">🤨 What is <i>my-legacy</i>?</div>
      <i>my-legacy</i> is a service that enables users to easily inherit
      documents (pdfs, text files, crypto keys or any other file) to theirs
      heirs. The service is suitable to inherit any type of file to friends or
      family in case of death.

      <div class="bulletpoint">
        🤔 What problem does <i>my-legacy</i> solve?
      </div>
      The traditional way of inheriting important data is to deposit a "last
      will" at a bank or a notary. However, this approach comes with caveats:<br />
      (1) One needs to trust the bank / notary<br />
      (2) High costs<br />
      (3) Tedious to maintain, especially if you frequently update the data you
      wish to inherit<br />
      (4) Most assets and information one inherits these days are stored
      digitally. A physical storage is old fashioned.<br />
      (5) Lack of anonymity<br />
      <br />
      my-legacy addresses these issues providing a dead man's switch. The user
      can select files which are then zipped and encrypted using the
      state-of-the-art
      <a href="https://en.wikipedia.org/wiki/Web_Cryptography_API"
        >Web Cryptography API</a
      >
      in the browser. The encrypted archive is stored in the
      <a href="https://ipfs.io/">interplanetary file system</a>.
      <br />
      Once the dead man's switch is triggered the user's heirs can access the
      archive(s) prepared by the deceased.

      <div class="bulletpoint">💻 How does it work?</div>
      <div class="mt-4 mb-4 my-center">
        <img src="/instructions/instruction1.png" />
      </div>
      First you register as a new user, then:<br />
      1. You select one or more files. The files are zipped and encrypted in the
      browser using the
      <a href="https://en.wikipedia.org/wiki/Web_Cryptography_API"
        >Web Cryptography API</a
      >. The password and your unencrypted data are never sent to the server.<br />
      2. The encrypted archive is uploaded and stored in the
      <a href="https://ipfs.io/">interplanetary file system</a>. You receive an
      <i>access code</i>.<br />
      3. You share your password and the <i>access code</i> with your heirs.
      Your heirs will not be able to access your data, because they do not know
      the file location and do not know the initialization vector used for
      encryption.<br />

      <div class="mt-4 mb-4 my-center">
        <img src="/instructions/instruction2.png" />
      </div>

      1. If you die, your heirs can enter their <i>access code&nbsp;</i>
      <router-link to="/health-check-and-decrypt">here</router-link> to trigger
      a <i>health check</i><br />
      2. <i>my-legacy</i> will send a <i>health check</i> email to you. <br />
      3. If you do not confirm the reception of the <i>health check</i> and do
      not respond to the <i>reminder</i> emails neither, the system will
      conclude that you are dead.

      <div class="mt-4 mb-4 my-center">
        <img src="/instructions/instruction3.png" />
      </div>

      You heirs can now enter their <i>access code</i>&nbsp;<router-link
        to="/health-check-and-decrypt"
        >here</router-link
      >
      to access the archive. They can decrypt the archive with the encryption
      password you shared with them previously.

      <div class="bulletpoint">
        🎭 How to share your crypto keys with your heirs
      </div>
      Create a file containing the required information to access your
      wallet(s). In the dashboard navigate to <i>Create encrypted archive</i>.
      Select a password and encrypt & upload the file. Share the password and
      the archive's <i>access code</i> with your heirs. Your heirs will be
      unable to access your archive because they do not know the file location
      and the initialization vector used for encryption. If you die, your users
      can use an <i>access code</i> to trigger a <i>health check</i>. If the
      <i>health check</i> remains unanswered, your heirs can and access your
      archive using the <i>access code</i>. They can decrypt the archive with
      the password you provided them.
      <div class="bulletpoint">
        🔓 What happens if the <i>my-legacy</i> database is hacked?
      </div>
      If the <i>my-legacy</i> database is hacked, the hackers will gain
      information where the encrypted archives are located and what
      initialization vector for the encryption was used. The attackers will not
      know the password to your archive however, and therefore can not access
      your data.
      <div class="bulletpoint">💀 What happens when I die?</div>
      Your heirs can use the <i>access code</i> of one of your archives to
      trigger a <i>health check</i>. <i>my-legacy</i> will then send a
      <i>health check</i> email to you. The system will send up you 3 reminder
      emails, which you won't be able to respond to (if you are dead). The
      system will conclude that you are dead. Your heirs will now be able to
      access their archive using the <i>access code</i>. They can decrypt the
      archive with the encryption password.

      <div class="bulletpoint">
        ⌛ What happens when a <i>health check</i> is triggered while I am still
        alive?
      </div>
      Your heirs can trigger a <i>health check</i> at any time using the
      <i>access code</i> of one of your archives. If you confirm the reception
      of the <i>health check</i> by clicking on the confirmation link in the
      <i>health check</i> email, your heirs will not be able to access your
      archive. Therefore, you remain in control at any time.

      <div class="bulletpoint">
        🤷 I do not trust the system. How can I verify that it works?
      </div>
      You can either use your current account or create a new test account. Then
      adjust the service settings in the
      <router-link to="/dashboard">dashboard</router-link>. Reduce the
      <i>health check</i> reminder interval to 1 day. Also create a dummy
      archive and trigger a <i>health check</i>. In this way, you will be able
      to judge within a couple of days if everything is working properly.<br />
      The source code of the client application is available
      <a href="https://github.com/loanMaster/inheritwebapp">here</a>.

      <div class="bulletpoint">
        🗑 Emails from <i>my-legacy</i> end up in my spam folder
      </div>
      This behavior is clearly not desired, as you may overlook important emails
      sent by the <i>my-legacy</i> service. Try to configure your mailbox not to
      treat emails by <i>my-legacy</i> as spam.

      <div class="bulletpoint">
        😱 How can I be sure that an attacker can not decrypt my files?
      </div>
      The standard
      <a href="https://en.wikipedia.org/wiki/Web_Cryptography_API"
        >Web Cryptography application programming interface</a
      >
      with AES-GCM algorithm is used to encrypt your files in the browser. If
      you don't trust the standardized libraries, there is not much you can
      trust in general.<br />
      The source code of the client application is publicly available
      <a href="https://github.com/loanMaster/inheritwebapp">here</a>. You can
      verify that neither your archive's encryption password nor any unencrypted
      data is stored or uploaded to the <i>my-legacy</i> server.

      <div class="bulletpoint">
        🌎 Why are the encrypted files stored in the interplanetary file system?
      </div>
      The <a href="https://ipfs.io/">interplanetary file system</a> is a
      decentralized storage. In case of a database crash of my-legacy the files
      will still be available. You can access and decrypt the files if you know
      the file location, the initialization vector used for encryption and the
      encryption password. The file location and initialization vector are shown
      in the dashboard.

      <div class="bulletpoint">💰 Pricing</div>
      Using this service is free.

      <div class="bulletpoint">🙏 Donations</div>
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

      <div class="bulletpoint">😇 Liability</div>
      <i>my-legacy</i> is not liable for any data leak as consequence of using
      <i>my-legacy</i>. Make sure to use secure passwords and only share them
      with your heirs.

      <div class="bulletpoint">✉ Contact</div>
      <span>support@my-legacy.rocks</span>
    </div>
  </div>
</template>

<script>
import CopyText from "@/components/CopyText.vue";

export default {
  components: {
    CopyText,
  },
};
</script>

<style scoped>
.bulletpoint {
  font-weight: 500;
  margin-top: 12px;
}
img {
  max-width: 80%;
}
</style>
