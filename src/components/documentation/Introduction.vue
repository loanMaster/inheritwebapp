<template>
  <div class="my-justify">
    <h5 class="mt-2">About <i>my-legacy</i></h5>
    <i>my-legacy</i> is a service that allows users to easily pass on documents
    to their heirs (pdfs, text files, crypto keys, or any other file). The
    service is appropriate for passing on any type of file to friends or family
    members in the event of death.<br />
    In addition, <i>my-legacy</i> is suitable to manage or backup any private
    data.

    <h5 class="mt-2">Motivation</h5>
    The traditional way of inheriting important data is to deposit a "last will"
    at a bank or a notary. However, this approach comes with caveats:<br />
    (1) One must have faith in the bank/notary.<br />
    (2) Expensive<br />
    (3) Difficult to maintain, especially if the data you want to inherit is
    frequently updated.<br />
    (4) Nowadays, the majority of assets and information inherited are stored
    digitally. A physical storage is old fashioned.<br />
    (5) Absence of anonymity<br />
    <br />
    <i>my-legacy</i> addresses these issues by providing a dead man's switch.
    The user can select files which are then zipped and encrypted using the
    state-of-the-art
    <a href="https://en.wikipedia.org/wiki/Web_Cryptography_API"
      >Web Cryptography API</a
    >
    in the browser. The encrypted archive is either stored in a cloud storage
    container or the
    <a href="https://ipfs.io/">interplanetary file system</a>.
    <br />
    Once the dead man's switch is triggered, the user's heirs can access the
    archives prepared by the deceased.

    <h5 class="mt-2">How to use my-legacy</h5>
    <div class="my-bold mt-4">(1) Before our die</div>
    <div class="mb-4 my-center">
      <img src="/instructions/instruction1.png" />
    </div>
    First you register as a new user, then:<br />
    <ol type="a">
      <li>
        You select one or more files. The files are zipped and encrypted in the
        browser using the
        <a href="https://en.wikipedia.org/wiki/Web_Cryptography_API"
          >Web Cryptography API</a
        >. The encryption password and your unencrypted data are never sent to
        the server.<br />
      </li>
      <li>
        The encrypted archive is uploaded and stored in the cloud. You will
        receive an <i>access code</i>.<br />
      </li>
      <li>
        You share your encryption password and the <i>access code</i> with your
        heirs. Your heirs can not access your files yet.<br />
      </li>
    </ol>

    <div class="my-bold mt-4">(2) After your die</div>
    <div class="mb-4 my-center">
      <img src="/instructions/instruction2.png" />
    </div>

    <ol type="a">
      <li>
        If you die, your heirs can enter their <i>access code&nbsp;</i>
        <router-link to="/health-check-and-decrypt">here</router-link> to
        trigger a <i>health check</i>.<br />
      </li>
      <li>
        <i>my-legacy</i> will send a <i>health check</i> email to you. <br />
      </li>
      <li>
        If you do not confirm the reception of the <i>health check</i> and do
        not respond to the <i>reminder</i> emails either, the system will
        conclude that you are dead.
      </li>
    </ol>

    <div class="mt-4 mb-4 my-center">
      <img src="/instructions/instruction3.png" />
    </div>

    Your heirs can now enter their <i>access code</i>&nbsp;<router-link
      to="/health-check-and-decrypt"
      >here</router-link
    >
    to access the archive. They can decrypt the archive with the encryption
    password you shared with them previously.

    <h5 class="mt-2">User content</h5>
    <i>my-legacy</i> is intended to transfer documents to your heirs after your
    death. These documents can contain passwords, access codes, or bank
    accounts. However, while you can transfer any document, there are cases
    where its content might not be legally enforceable, as in case of a will.
    Hence, <i>my-legacy</i> may or may not be used for legally enforceable
    documents. Please refer to your state's law to ensure that the files you
    intend to transfer to your heirs can be used in the desired way.
    <i>my-legacy</i> has no knowledge of the content of your files and is not
    responsible for it. Legal or tax consequences that are associated with the
    transferred files are not the responsibility of <i>my-legacy</i> but of the
    user and/or the user's heirs. Although the content of your files is unknown
    to <i>my-legacy</i>, it is not permitted to upload illegal and unlawful
    content. <i>my-legacy</i> is not responsible in any way for the user files
    and their content.

    <h5 class="mt-2">Data storage</h5>
    Customers can choose to upload their encrypted files either to a
    conventional cloud storage container or to the
    <a href="https://ipfs.io/">interplanetary file system</a>. Both options have
    distinct advantages. By default a cloud storage container is used. If you
    are uncertain about what to choose, just stick with the default settings.

    <div class="my-bold mt-2">Cloud storage container</div>
    The cloud storage container stores and retrieves files just like you would
    expect. Advantages are:
    <ul>
      <li>Fast access</li>
      <li>High reliability</li>
      <li>File access is restricted to the uploader.</li>
    </ul>

    <div class="my-bold mt-2">Interplanetary file system</div>
    The <a href="https://ipfs.io/">interplanetary file system (ipfs)</a> is
    suitable to store files long-term and distributed over several servers and
    geographical regions. Every file in the ipfs gets assigned an ipfs hash
    (<span class="my-word-break-all"
      >"QmNRcJdHQTw2Ty1BxAbS4rDesQVDzSyz5Z6WUHos6s71tr"</span
    >, for example). A file can be accessed by anyone who knows its hash.
    <i>my-legacy</i> encrypts all data before uploading it into the ipfs. If an
    archive is deleted via the <i>my-legacy</i> website, the corresponding entry
    in the ipfs is unpinned. However, there is no guarantee that the file will
    be deleted from all nodes in the ipfs network.<br />
    The advantages of ipfs are:
    <ul>
      <li>Transparency: Files can be accessed via public servers</li>
      <li>
        Files are available even if <i>my-legacy</i> suffers from downtime.
      </li>
      <li>Distributed storage and redundancy</li>
    </ul>
    Disadvantages are:
    <ul>
      <li>Unpinned files are not necessarily removed from all servers.</li>
      <li>Low performance</li>
    </ul>

    <h5 class="mt-2">Service duration and termination</h5>
    We cannot guarantee that we will run this service forever. Legal issues or
    the economic situation may force us to stop running the service. However, we
    will warn our customers before this happens. We will provide 60 days’ notice
    to users via email to allow them enough time to make arrangements. In the
    event of a termination of the service, all user data will be deleted within
    3 months. User files in the ipfs will be unpinned.

    <h5 class="mt-2">Privacy</h5>
    <i>my-legacy</i> does not share any personal data with a third-party company
    or service. The website uses persistent cookies exclusively to store the
    user's login information. The service keeps a record of the most important
    events, such as when a <i>health check</i> was sent to a user. Your records
    are shown in the
    <router-link to="/dashboard/history">history</router-link> section of the
    <router-link to="/dashboard">dashboard</router-link>.

    <h5 class="mt-2">Pricing</h5>
    Using this service is free.

    <h5 class="mt-2">Disclaimer</h5>
    <Disclaimer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Disclaimer from "@/components/documentation/Disclaimer.vue";

export default defineComponent({
  name: "Introduction",
  components: { Disclaimer },
});
</script>

<style scoped>
img {
  max-width: 80%;
}
</style>
