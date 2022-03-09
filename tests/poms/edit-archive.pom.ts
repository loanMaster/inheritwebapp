import { expect, Page } from "@playwright/test";

export class EditArchivePom {
  constructor(private page: Page) {}

  async submit() {
    await this.page.click(`[test="submit"]`);
  }

  async decrypt() {
    await this.page.click('[test="decrypt-archive"]');
  }

  async verifySaveSuccessMsg() {
    await expect(this.page.locator('[test="success-msg"]')).toBeVisible();
  }

  async enterPassword(pass: string) {
    await this.page.fill('[test="archive-password"]', pass);
  }

  async fillArchiveName(value: string) {
    this.page.fill(`[test="archive-name-input"]`, value);
  }
}
