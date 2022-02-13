import { Page, expect } from "@playwright/test";

export class ServiceInfoPom {
  constructor(private page: Page) {}

  async navigateTo() {
    await this.page.goto(`${process.env.WEBSITE_PATH}/dashboard/info`);
  }

  async getInfoText() {
    return this.page.locator('[test="service-info-text"]').innerText();
  }

  async verifyHealthCheckManuallyTriggeredVisible() {
    await expect(
      await this.page.locator('[text="triggered-manually-info"]')
    ).toBeVisible();
  }

  async verifySendMessagesWarningsVisible() {
    await expect(
      await this.page.locator('[test="messages-will-be-sent-warning"]')
    ).toBeVisible();
  }
}
