<template>
  <div class="my-title-container my-gray-desktop-only">
    <div class="my-flex-1 my-center my-mobile-hidden">
      <img src="/promo/woman_promo.jpg" class="my-mobile-hidden" />
    </div>
    <div class="my-flex-2">
      <div class="my-center xl-font">
        Inherit your data with <br /><i class="xxl-font">my-legacy</i>
      </div>
      <div class="my-promo-documents my-fade-in mt-2">
        <img src="/images/bitcoin.png" style="max-width: 21%" />
        <img src="/images/documents3.png" style="max-width: 26%" />
        <img src="/images/envelope.png" style="max-width: 23%" />
      </div>
    </div>
  </div>

  <div class="pb-8 pt-8">
    <div class="my-promo-video my-border-box">
      <video controls poster="/promo/promo_preview.jpg">
        <source src="/promo/promo.mp4" type="video/mp4" />
      </video>
    </div>
  </div>

  <div class="my-pt-desktop-only my-pb-desktop-only">
    <div class="item">
      <img src="images/secure.webp" class="my-border-box" />
      <div class="center mr-2 pl-2">
        <div class="item-heading">Trustless & Secure</div>
        <div class="center">
          Your data is safely encrypted using the
          <a href="https://w3c.github.io/webcrypto/">Web Cryptography API</a>.
          Only you know the password. <i>my-legacy</i> does not know or store
          passwords anywhere.
        </div>
        <div class="item-heading mt-4">Open source</div>
        <div class="center">
          The code of this website is publicly available
          <a href="https://github.com/loanMaster/inheritwebapp">here</a>.
        </div>
      </div>
    </div>
  </div>

  <div class="my-pt-desktop-only my-pb-desktop-only my-gray-desktop-only">
    <div class="item">
      <div class="center ml-2 pr-2">
        <div class="item-heading">Inherit any document</div>
        <div class="center">
          With <i>my-legacy</i> you can inherit PDFs, simple text files or any
          other document to your heirs. It is suitable to inherit crypto
          wallets, too.
        </div>
        <div class="item-heading mt-4">Automated</div>
        <div class="center">
          <i>my-legacy</i> implements a dead man's switch. If you die, it will
          send the documents you prepared to your heirs. No additional human
          interaction is required.
        </div>
        <div class="item-heading mt-4">You are in control</div>
        <div class="center">
          You can adjust the service settings or pause the service at any time.
        </div>
      </div>
      <img src="promo/dude_promo.jpg" class="my-mobile-hidden" />
    </div>
  </div>

  <div class="my-pt-desktop-only my-pb-desktop-only">
    <div class="item">
      <div class="center ml-2 pr-2">
        <div class="item-heading">Decentralized storage</div>
        <div class="center">
          Your documents are stored in the
          <a href="https://ipfs.io/">interplanetary file system</a>
        </div>
      </div>
      <img src="images/ipfs.jpg" class="my-border-box" />
    </div>
  </div>

  <div class="my-pt-desktop-only my-pb-desktop-only my-gray-desktop-only">
    <div class="item">
      <img src="promo/older_guy_promo.jpg" class="my-mobile-hidden" />
      <div class="center ml-2 pr-2">
        <div class="item-heading">Easy to use</div>
        <div class="center">
          Using <i>my-legacy</i> is easy. Just sign up and create archives for
          your heirs.
        </div>
        <div class="item-heading mt-4">From Switzerland</div>
        <div class="center">
          <i>my-legacy</i> profits from this political and economic stability in
          Switzerland, which is a safe haven in times of unrest.
        </div>
        <div class="item-heading mt-4">For free</div>
        <div class="center">
          <i>my-legacy</i> does not charge users for the service.
        </div>
      </div>
    </div>
  </div>

  <div class="my-pt-desktop-only my-pb-desktop-only">
    <div class="item">
      <div class="center ml-2 pr-2">
        <div class="item-heading">Anonymous</div>
        <div class="center">
          You remain anonymous. <i>my-legacy</i> does not know your name or any
          other personal data except your email address.
        </div>
      </div>
      <img src="images/anonymous2.jpg" class="my-border-box" />
    </div>

    <div class="mt-4 center">
      <router-link class="btn btn-primary mr-2" to="/signup"
        >Sign up</router-link
      >
      <router-link class="btn btn-primary ml-2" to="/docs"
        >Documentation</router-link
      >
    </div>
  </div>
  <div class="contact-form-background">
    <div class="contact-form">
      <div class="contact-form-title">
        Got questions? Let’s talk about your needs.
      </div>
      We aim to get back to all inquiries within 24 hours. The more information
      you can provide us with, the better and easier we can draft an offer and
      get back to you.
      <div class="contact-email">support@my-legacy.rocks</div>
    </div>
  </div>
</template>

<style scoped>
.my-gray-desktop-only {
  background-color: rgba(184, 191, 209, 1);
}
.my-title-container {
  padding-bottom: 25px;
  padding-top: 60px;
  margin-top: -50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 500px;
}

img {
  object-fit: scale-down;
}
.xl-font {
  font-size: 4rem;
}
.xxl-font {
  font-size: 5rem;
}
.my-promo-documents {
  margin: auto;
  max-width: 80%;
  min-height: 300px;
  display: flex;
  justify-content: space-around;
}

.item {
  display: flex;
  align-items: center;
  margin: auto;
  max-width: 80%;
}
.item-heading {
  font-size: 3rem;
}
video {
  max-width: 100%;
  width: 100%;
}
.center {
  text-align: center;
  margin: auto;
}
.contact-form-title {
  font-size: 2rem;
}
.contact-email {
  font-size: 2rem;
}
.contact-form-background {
  width: 100%;
  margin: auto;
  margin-top: 50px;
  margin-bottom: -70px;
  background-color: #03989e;
}
.contact-form {
  width: 60%;
  margin: auto;
  margin-bottom: 50px;
  padding-top: 50px;
  padding-bottom: 30px;
  text-align: center;
  color: white;
}
@media screen and (max-width: 700px) {
  .contact-form {
    width: 90%;
  }
}
@media screen and (max-width: 700px) {
  .contact-email {
    font-size: 1rem;
  }
  .item-heading {
    font-size: 2rem;
  }
}
.item img {
  max-width: 50%;
}
.pr-2 {
  padding-right: 0.5rem;
}
.my-pt-desktop-only {
  padding-top: 24px;
}
.my-pb-desktop-only {
  padding-bottom: 24px;
}
.my-promo-video {
  margin: auto;
  max-width: 50%;
}

@media screen and (max-width: 992px) {
  .item {
    flex-direction: column-reverse;
  }
  .item img {
    margin-bottom: 20px;
    margin-top: 20px;
    max-width: 90%;
  }
  .my-promo-video {
    max-width: 90%;
  }
  .my-gray-desktop-only {
    background-color: transparent;
  }
  .xl-font {
    font-size: 2.5rem;
  }
  .xxl-font {
    font-size: 3rem;
  }
  .my-promo-documents {
    min-height: 0;
  }
  .my-title-container {
    min-height: 0;
  }
  .my-pt-desktop-only {
    padding-top: 0;
  }
  .my-pb-desktop-only {
    padding-bottom: 0;
  }
}
</style>
