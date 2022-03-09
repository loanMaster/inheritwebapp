import { expect, Page } from "@playwright/test";

export class AccessArchivePom {
  constructor(private page: Page) {}

  async navigateTo() {
    await this.page.goto(
      `${process.env.WEBSITE_PATH}/health-check-and-decrypt`
    );
  }

  async enterCode(code: string) {
    await this.page.fill('[test="input-code"]', code);
  }

  async submitCode() {
    await this.page.click('[test="btn-submit"]');
  }

  async verifyHealthCheckTriggeredMsgVisible() {
    return expect(
      this.page.locator('[test="health-check-triggered-msg"]')
    ).toBeVisible();
  }

  async verifyTriggeredAlreadyMsgVisible() {
    return expect(
      this.page.locator('[test="triggered-already-msg"]')
    ).toBeVisible();
  }

  async getExpectedAccessDateMsg() {
    return this.page.locator('[test="expected-access-date-msg"]').textContent();
  }
}
