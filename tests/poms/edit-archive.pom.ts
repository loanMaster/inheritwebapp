import { expect, Page } from "@playwright/test";

export class EditArchivePom {
  constructor(private page: Page) {}

  async submit() {
    await this.page.click(`[test="submit"]`);
  }

  async addHeir(index = 0) {
    await this.page.click(`[test="add-heir"] >> nth=${index}`);
  }

  async verifySaveSuccessMsg() {
    await expect(this.page.locator('[test="success-msg"]')).toBeVisible();
  }

  async fillArchiveName(value: string) {
    this.page.fill(`[test="archive-name-input"]`, value);
  }

  async fillHeir(value: string, heirIndex = 0) {
    const locator = this.page
      .locator(`[test="edit-archive"]`)
      .locator(`[test="heir-email-input"] >> nth=${heirIndex}`);
    await locator.fill(value);
  }

  async removeHeir(heirIndex = 0) {
    const locator = this.page
      .locator(`[test="edit-archive"]`)
      .locator(`[test="remove-heir"] >> nth=${heirIndex}`);
    await locator.click();
  }
}
