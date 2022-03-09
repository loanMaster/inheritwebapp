import { expect, Page } from "@playwright/test";

export class DashboardPom {
  constructor(private page: Page) {}

  async navigateTo() {
    await this.page.goto(`${process.env.WEBSITE_PATH}/dashboard`);
  }

  async verifyWelcomeModalShown(value: boolean) {
    await this.page.$eval(
      `[test="welcome-modal"]`,
      (el, value) => el.classList.contains("show") === value,
      value
    );
  }

  async closeWelcomeModal() {
    await this.page.click("[test='welcome-modal'] [test='modal-cancel']");
  }

  async verifyUserInfoTextContains(value: string) {
    await expect(
      this.page.locator("[test='user-info-desktop'] [test='user-info']")
    ).toContainText(value);
  }
}
