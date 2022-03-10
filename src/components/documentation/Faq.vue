<template>
  <div class="my-justify">
    <h5 class="mt-2">🎭 How can I inherit my crypto keys?</h5>
    Create a file containing the information needed to access your wallet(s). In
    the dashboard, navigate to <i>Create encrypted archive</i>. Select a
    password and encrypt and upload the file. Share the password and the
    archive's <i>access code</i> with your heirs. Your heirs will not be able to
    access your archive yet. If you die, your users can use an
    <i>access code</i> to trigger a <i>health check</i>. If the
    <i>health check</i> remains unanswered, your heirs can access your archive
    using the <i>access code</i>. They can decrypt the archive with the password
    you provided them.

    <h5 class="mt-2">💀 What happens when I die?</h5>
    Your heirs can use the <i>access code</i> of one of your archives to trigger
    a <i>health check</i>. <i>my-legacy</i> will then send a
    <i>health check</i> email to you. The system will send you 3 reminder
    emails, which you won't be able to respond to (if you are dead). The system
    will conclude that you are dead. Your heirs will now be able to access their
    archive using the <i>access code</i>. They can decrypt the archive with the
    encryption password.

    <h5 class="mt-2">
      ⌛ What happens when a <i>health check</i> is triggered while I am still
      alive?
    </h5>
    Your heirs can trigger a <i>health check</i> at any time using the
    <i>access code</i> of one of your archives. If you confirm the reception of
    the <i>health check</i> by clicking on the confirmation link in the
    <i>health check</i> email, your heirs will not be able to access your
    archive. Therefore, you remain in control at any time.

    <h5 class="mt-2">
      🤷 I do not trust the system. How can I verify that it works?
    </h5>
    You can either use your current account or create a new test account. Then
    adjust the service settings in the
    <router-link to="/dashboard">dashboard</router-link>. Reduce the
    <i>health check</i> reminder interval to 5 minutes. Also, create a dummy
    archive and trigger a <i>health check</i>. In this way, you will be able to
    judge within a couple of minutes if everything is working properly.<br />
    The source code of the client application is available
    <a href="https://github.com/loanMaster/inheritwebapp">here</a>.

    <h5 class="mt-2">
      🗑 Emails from <i>my-legacy</i> end up in my spam folder
    </h5>
    This behavior is clearly not desired, as you may overlook important emails
    sent by the <i>my-legacy</i> service. Try configuring your mailbox not to
    treat emails from <i>my-legacy</i> as spam.

    <h5 class="mt-2">
      🔓 What happens if the <i>my-legacy</i> database is hacked?
    </h5>
    If the <i>my-legacy</i> database is hacked, the hackers will gain
    information about where the encrypted archives are located and what
    initialization vector for the encryption was used. The attackers will not
    know the password to your archive, however, and therefore cannot access your
    data. The hackers might also obtain your email address.

    <h5 class="mt-2">
      😱 How can I be sure that an attacker can not decrypt my files?
    </h5>
    The standard
    <a href="https://en.wikipedia.org/wiki/Web_Cryptography_API"
      >Web Cryptography application programming interface</a
    >
    (AES-GCM) is used to encrypt your files in the browser. If you don't trust
    the standardized libraries, there is not much you can trust in general.<br />
    The source code of the client application is publicly available
    <a href="https://github.com/loanMaster/inheritwebapp">here</a>. You can
    verify that all the uploaded data is encrypted. Furthermore, you will see
    that <i>my-legacy</i> does not know or store your password.

    <h5 class="mt-2">
      🌎 Why are the encrypted files stored in the interplanetary file system?
    </h5>
    Users can choose to either store their archives in the interplanetary file
    system or a traditional cloud storage container. The
    <a href="https://ipfs.io/">interplanetary file system</a> is a decentralized
    storage. During a downtime of the <i>my-legacy</i> website the ipfs files
    will still be accessible. You can access and decrypt the files if you know
    the file location, the initialization vector used for encryption, and the
    encryption password. The file location and initialization vector are shown
    in the dashboard.

    <h5 class="mt-2">🙅 Which problems can <i>my-legacy</i> not solve?</h5>
    <i>my-legacy</i> can only grant access to files when reminder emails are not
    answered after the potential heirs enter an access code to retrieve the
    uploaded files. If the customer does not answer the email reminders for
    other reasons than the death of the customer, e.g. emails being blocked in
    spam filters, a temporary inability of the customer to access emails due to
    a long vacation, a coma or short but severe illness, etc,
    <i>my-legacy</i> cannot check the circumstances and will trigger the death
    event. Unanswered reminder emails irrespective of the cause will result in
    granting access to the potential heirs even though the customer would not
    wish to grant access at this point. <i>my-legacy</i> is not responsible for
    any consequences in these cases. Any legal or tax-related aspects of
    transferring the archive are the sole responsibility of the customer and its
    potential heirs, and not of <i>my-legacy</i>.

    <h5 class="mt-2">🕵 What to do if I suspect unauthorized actions?</h5>
    If you suspect suspicious unauthorized actions please delete your archives
    immediately. Change your password (you can do so
    <router-link to="/reset-password">here</router-link>). Update any passwords
    that are stored in your archives. Contact your future heirs. Be aware that
    if you are using ipfs, there is no guarantee that your archives are removed
    from all ipfs nodes.
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Faq",
});
</script>
