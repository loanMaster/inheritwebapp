import { expect, Page } from "@playwright/test";

export class AccountPom {
  constructor(private page: Page) {}

  async navigateTo() {
    await this.page.goto(`${process.env.WEBSITE_PATH}/dashboard/account`);
  }

  async verifyEmailShown(value: string) {
    await expect(this.page.locator("[test='email']")).toContainText(value);
  }

  async verifyCreationDate(value: string) {
    await expect(this.page.locator("[test='member-since']")).toContainText(
      value
    );
  }

  async resetPassword() {
    await this.page.click("[test='reset-password']");
  }

  async verifySuccessMsgShown() {
    await expect(
      this.page.locator("[test='reset-pw-success-msg']")
    ).toBeVisible();
  }
}
