import { Page, expect } from "@playwright/test";

export class ServiceInfoPom {
  constructor(private page: Page) {}

  async navigateTo() {
    await this.page.goto(`${process.env.WEBSITE_PATH}/dashboard/info`);
  }

  async getInfoText() {
    return this.page.locator('[text="service-info-text"]').innerText();
  }

  async verifyHealthCheckManuallyTriggeredVisible() {
    await expect(
      await this.page.locator('[text="triggered-manually-info"]')
    ).toBeVisible();
  }

  async verifyNoHealthCheckTriggeredTextVisible() {
    return await expect(
      await this.page.locator('[test="no-heath-check-triggered"]')
    ).toBeVisible();
  }

  async getNoHealthCheckTriggeredText() {
    return await this.page
      .locator('[test="no-heath-check-triggered"]')
      .textContent();
  }
}
