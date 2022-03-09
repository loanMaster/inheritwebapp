import { expect, Page } from "@playwright/test";

export class VerificationPendingPom {
  constructor(private page: Page) {}

  async resendEmail() {
    this.page.click("[test='send-verification-email']");
  }

  async verifySuccessMsgShown() {
    await expect(
      this.page.locator("[test='email-sent-successmsg']")
    ).toBeVisible();
  }
}
