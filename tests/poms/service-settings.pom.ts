import { expect, Page } from "@playwright/test";

export class ServiceSettingsPom {
  constructor(private page: Page) {}

  async navigateTo() {
    await this.page.goto(
      `${process.env.WEBSITE_PATH}/dashboard/service-settings`
    );
  }

  async setIntervalReminder(value: number) {
    await this.page.fill("[test='interval-reminder-input']", String(value));
  }

  async verifyIntervalReminder(value: number) {
    await expect(
      this.page.locator("[test='interval-reminder-input']")
    ).toHaveValue(String(value));
  }

  async verifyAlive(value: string) {
    await expect(this.page.locator("[test='alive-toggle']")).toHaveValue(value);
  }

  async submit() {
    await this.page.click("[test='settings-submit']");
  }

  async verifySettingsUpdateSuccessful() {
    await expect(
      this.page.locator("[test='settings-success-msg']")
    ).toContainText("Settings updated.");
  }
}
