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

  async verifyCreateArchiveSuccessful() {
    await expect(
      await this.page.locator('[test="archive-created-msg"]')
    ).toBeVisible();
  }

  async verifyAccessCodeShown(value: string) {
    await expect(
      await this.page.locator('[test="archive-created-msg"]')
    ).toContainText(value);
  }

  async startCreateAnotherArchive() {
    await this.page.click('[test="create-another-archive"]');
  }
}
