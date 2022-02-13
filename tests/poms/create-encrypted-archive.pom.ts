import { expect, Page } from "@playwright/test";

export class CreateEncryptedArchivePom {
  constructor(private page: Page) {}

  async encryptAndUploadFile() {
    await this.page.goto(
      `${process.env.WEBSITE_PATH}/dashboard/create-encrypted-archive`
    );
    await this.page.setInputFiles(
      '[test="upload-file"]',
      __dirname + "/../assets/upload-file.txt"
    );
    await this.page.fill('[test="archive-name-input"]', "my-test-archive");
    await this.page.fill('[test="password-input"]', "tops1cretlongpassword");
    await this.page.fill(
      '[test="password-verify-input"]',
      "tops1cretlongpassword"
    );
    await this.page.click('[test="create-archive-submit"]');
  }

  async addHeir() {
    await this.page.click('[test="add-heir"]');
  }

  async setHeirEmail(email: string, index = 0) {
    await this.page.fill(`[test="heir-email-input"] >> nth=${index}`, email);
  }

  async removeHeir(index = 0) {
    await this.page.click(`[text="remove-heir"] >> nth=${index}`);
  }

  async submitHeirs() {
    await this.page.click('[text="assign-heirs-submit"]');
  }

  async verifyCreateArchiveSuccessful() {
    await expect(
      await this.page.locator('[test="create-archive-success-msg"]')
    ).toContainText("Done");
  }

  async verifyAddHeirButtonNotVisible() {
    await expect(this.page.locator('[test="add-heir"]')).not.toBeVisible();
  }

  async startCreateAnotherArchive() {
    await this.page.click('[test="create-another-archive"]');
  }

  async getHeirCount() {
    return this.page.locator('[test="heir-email-input"]').count();
  }
}
