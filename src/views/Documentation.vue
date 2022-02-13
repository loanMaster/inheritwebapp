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
      <a href="https://w3c.github.io/webcrypto/">Web Cryptography API</a> in the
      browser. The encrypted archive is stored in the
      <a href="https://ipfs.io/">interplanetary file system</a>.
      <br />
      Once the dead man's switch is triggered the user's heirs will receive a
      link to the encrypted archive(s) prepared by the deceased. Together with
      the encryption password they can access the file.
      <div class="bulletpoint">💻 How does it work?</div>
      <div class="mt-4 mb-4 my-center">
        <img src="/instructions/instruction1.png" />
      </div>
      First you register as a new user, then:<br />
      1. You select one or more files. The files are zipped and encrypted in the
      browser using the
      <a href="https://w3c.github.io/webcrypto/">Web Cryptography API</a>. The
      password and your unencrypted data are never sent to the server.<br />
      2. The encrypted archive is uploaded and stored in the
      <a href="https://ipfs.io/">interplanetary file system</a>. You assign
      heirs to your archive.<br />
      3. You share your password with your heirs. Your heirs will not be able to
      access your data, because they do not know the file location and do not
      know the initialization vector used for encryption.<br />

      <div class="mt-4 mb-4 my-center">
        <img src="/instructions/instruction2.png" />
      </div>

      1. <i>my-legacy</i> will periodically send a <i>health check</i> email to
      you. This email contains a link. Click on the link to confirm the
      reception of the email.<br />
      2. If you do not confirm the reception of the <i>health check</i> and do
      not respond to the <i>reminder</i> emails neither, the system will
      conclude that you are dead. <i>my-legacy</i> will contact your heirs via
      email.

      <div class="mt-4 mb-4 my-center">
        <img src="/instructions/instruction3.png" />
      </div>

      1. <i>my-legacy</i> sends a link to the archive(s) you prepared previously
      to your heirs, including the initialization vector used for encryption.<br />
      2. Your heirs can know access and decrypt the archive using the password
      you shared with them previously.
      <br /><br />
      User can opt out from receiving periodic <i>health checks</i>. In this
      case the heirs can trigger a <i>health check</i> manually using a
      <i>health-check-code</i> provided in the dashboard.
      <div class="bulletpoint">
        🎭 How to share your crypto keys with your heirs
      </div>
      Create a file containing the required information to access your
      wallet(s). In the dashboard navigate to <i>Create encrypted archive</i>.
      Select a password and assign heirs to the archive. Share the password with
      your heirs. Your heirs will be unable to access your archive because they
      do not know the file location and the initialization vector used for
      encryption. Once the dead man's switch is triggered your heirs will
      receive the missing information via email.
      <div class="bulletpoint">
        🔓 What happens if the <i>my-legacy</i> database is hacked?
      </div>
      If the <i>my-legacy</i> database is hacked, the hackers will gain
      information where the encrypted archives are located and what
      initialization vector for the encryption was used. The attackers will not
      know the password to your archive however, and therefore can not access
      your data.
      <div class="bulletpoint">💀 What happens when I die?</div>
      <i>my-legacy</i> will send you <i>health check</i> emails regularly. If
      you die, you will no longer be able to confirm the reception of such an
      email. The system will send you 3 reminder emails, which you won't be able
      to respond to, neither. The system will conclude that you are dead and
      send the messages containing links to the archives you prepared to your
      heirs. The duration from time of death until your heirs receive the links
      your archive(s) depends on the service settings, which you can adjust in
      the <router-link to="/dashboard">dashboard</router-link>.

      <br />
      In case you opted out from the periodic <i>health check</i> emails, your
      heirs can trigger a manual health check using the
      <i>health-check-code</i> you can find in the dashboard. If your heirs do
      not know the <i>health-check-code</i> there is always the possibility to
      contact us via email.
      <div class="bulletpoint">
        ⌛ Is it possible for my heirs to speed up the process?
      </div>
      Yes. Your heirs can contact <i>crypto-legacy</i> via email or trigger a
      manual health check
      <router-link to="/trigger-health-check">here</router-link>. A
      <i>health check</i> email will then be sent immediately to you. You are
      still in control. If you confirm your <i>health check</i> email, the
      messages you prepared will not be sent to your heirs. However, if you are
      indeed dead, your heirs will receive your messages a lot quicker than
      without human intervention.

      <div class="bulletpoint">
        🤷 I do not trust the system. How can I verify that it works?
      </div>
      You can either use your current account or create a new test account. Then
      adjust the service settings in the
      <router-link to="/dashboard">dashboard</router-link>. Reduce the
      <i>health check</i> interval and reminders to 1 day. Also create a test
      archive. In this way, you will be able to judge within a couple of days if
      everything is working properly.<br />
      The source code of the client application is available
      <a href="https://github.com/loanMaster/inheritwebapp">here</a>.

      <div class="bulletpoint">
        🗑 Emails from <i>my-legacy</i> end up in my spam folder
      </div>
      This behavior is clearly not desired, as you may overlook important emails
      sent by the <i>my-legacy</i> service. Try to configure your mailbox not to
      treat emails by <i>my-legacy</i> as spam. <br /><br />
      It is recommended to inform your heirs that you have an account at
      <i>my-legacy</i>. Your heirs can contact <i>my-legacy</i> at any time such
      that a message which got lost in a spam folder can be delivered once more.

      <div class="bulletpoint">
        😳 I do not want be to overwhelmed with emails from
        <i>my-legacy</i>
      </div>
      You have full control over the frequency of emails sent to you. You can
      change the service settings in the
      <router-link to="/dashboard">dashboard</router-link> and even opt out from
      periodic <i>health check</i> emails entirely.

      <div class="bulletpoint">
        😱 How can I be sure that an attacker can not decrypt my files?
      </div>
      The standard
      <a href="https://w3c.github.io/webcrypto/"
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
      <CryptoAddress address="3JUCr4UE9A7BELo661z729DehC4jgkqnVk" /><br /><br />
      Ethereum / DAI / USDC / USD-T:
      <CryptoAddress
        address="0x49c98b33edab55dccb4d8a1793fee56b2e482d22"
      /><br /><br />
      Cardano:
      <CryptoAddress
        address="DdzFFzCqrht5KWFo1yhC4vd4SX2mroEDZKYAc3Rw3TqdvkBgfDUYGktQvaWgeMG84DGjsdRDvFdujVQnHjv2sV2geoa1zyqqUmEyndhf"
      /><br /><br />
      Solana:
      <CryptoAddress
        address="ANqgvpCsEjAZ71e1DU3Cq6VS2Agk5m56rgQt8XEcq2Ho"
      /><br /><br />
      Luna:
      <CryptoAddress
        address="terra1z2lj8xaqadvfxdfyjaghd57x3zcvt8233k3h8j"
      /><br /><br />
      Polkadot:
      <CryptoAddress
        address="14dAqjsNqy34kh7VfwbH8z8vNLzyT1K1QRKpn9gv4BS1ewZu"
      /><br /><br />
      Avalanche:
      <CryptoAddress
        address="0x555f90751ce2fafe97d67bd8c75f6861ce08318a"
      /><br /><br />
      Doge:
      <CryptoAddress address="DJf2WJC5o2W7WPi7LRMd9PfYYpyiPavqh2" /><br /><br />
      Monero:
      <CryptoAddress
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
import CryptoAddress from "@/components/CryptoAddress.vue";

export default {
  components: {
    CryptoAddress,
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
