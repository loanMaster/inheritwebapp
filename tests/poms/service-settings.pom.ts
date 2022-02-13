import { expect, Page } from "@playwright/test";

export class ServiceSettingsPom {
  constructor(private page: Page) {}

  async navigateTo() {
    await this.page.goto(
      `${process.env.WEBSITE_PATH}/dashboard/service-settings`
    );
  }

  async verifyInterval(value: number) {
    await expect(this.page.locator("[test='interval-input']")).toHaveValue(
      String(value)
    );
  }

  async setInterval(value: number) {
    await this.page.fill("[test='interval-input']", String(value));
  }

  async setIntervalReminder(value: number) {
    await this.page.fill("[test='interval-reminder-input']", String(value));
  }

  async verifyIntervalReminder(value: number) {
    await expect(
      this.page.locator("[test='interval-reminder-input']")
    ).toHaveValue(String(value));
  }

  async verifyHealthCheckActive(value: string) {
    await expect(
      this.page.locator("[test='periodic-checks-toggle']")
    ).toHaveValue(value);
  }

  async verifyHealthCheckTriggerCode(value: string) {
    await expect(
      this.page.locator("[test='health-check-trigger-code']")
    ).toContainText(value);
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
