import { expect, Page } from "@playwright/test";

export class HistoryPom {
  constructor(private page: Page) {}

  async navigateTo() {
    await this.page.goto(`${process.env.WEBSITE_PATH}/dashboard/history`);
  }

  async verifyEmptyListShown() {
    return expect(
      this.page.locator('[test="history-empty-list"]')
    ).toBeVisible();
  }

  async verifyHistoryEventCount(num: number) {
    await expect(this.page.locator('[test="history-event-entry"]')).toHaveCount(
      num
    );
  }

  async verifyName(idx: number, expectedValue: string) {
    return expect(
      this.page.locator(`[test="history-event-name"] >> nth=${idx}`)
    ).toContainText(expectedValue);
  }

  async verifyAdditional(idx: number, expectedValue: string) {
    return expect(
      this.page.locator(`[test="history-event-additional"] >> nth=${idx}`)
    ).toContainText(expectedValue);
  }

  async verifyDate(idx: number, expectedValue: string) {
    return expect(
      this.page.locator(`[test="history-event-date"] >> nth=${idx}`)
    ).toContainText(expectedValue);
  }
}
