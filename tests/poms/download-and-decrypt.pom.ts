import { expect, Page } from "@playwright/test";

export class DownloadAndDecryptPom {
  constructor(private page: Page) {}

  async navigateToDecryptPage(iv: string, hash: string) {
    await this.page.goto(
      `${process.env.WEBSITE_PATH}/decrypt?iv=${iv}&hash=${hash}`
    );
  }

  async enterPassword(password: string) {
    await this.page.type('[test="decrypt-password"]', password);
  }

  async submit() {
    this.page.click('[test="decrypt-submit"]');
  }

  async verifyError(errorMsg: string) {
    await expect(this.page.locator('[test="decrypt-error-msg"]')).toHaveText(
      errorMsg
    );
  }
}
