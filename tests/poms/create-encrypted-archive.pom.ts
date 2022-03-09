import { expect, Page } from "@playwright/test";

export class CreateEncryptedArchivePom {
  constructor(private page: Page) {}

  async encryptAndUploadFile() {
    await this.navigateTo();
    await this.setInputFile(__dirname + "/../assets/upload-file.txt");
    await this.inputArchiveName("my-test-archive");
    await this.inputPassword("tops1cretLongpassword");
    await this.inputPasswordVerify("tops1cretLongpassword");
    await this.clickDisclaimerCheckbox();
    await this.clickPasswordCheckbox();
    await this.clickHeirsCheckbox();
    await this.submit();
  }

  async navigateTo() {
    await this.page.goto(
      `${process.env.WEBSITE_PATH}/dashboard/create-encrypted-archive`
    );
  }

  async setInputFile(fileName: string) {
    await this.page.setInputFiles('[test="upload-file"]', fileName);
  }

  async getFileCount() {
    return this.page.locator('[test="file-attachment"]').count();
  }

  async submit() {
    await this.page.click('[test="create-archive-submit"]');
  }

  async verifyErrorMsg(errorMsg: string) {
    await expect(
      this.page.locator('[test="create-archive-errormsg"]')
    ).toContainText(errorMsg);
  }

  async verifySubmitDisabled(disabled: boolean) {
    const isDisabled =
      (await this.page
        .locator('[test="create-archive-submit"]')
        .getAttribute("disabled")) === "";
    await expect(isDisabled).toBe(disabled);
  }

  async inputArchiveName(archiveName: string) {
    await this.page.fill('[test="archive-name-input"]', archiveName);
  }

  async inputPassword(pass: string) {
    await this.page.fill('[test="password-input"]', pass);
  }

  async inputPasswordVerify(pass: string) {
    await this.page.fill('[test="password-verify-input"]', pass);
  }

  async clickPasswordCheckbox() {
    await this.page.click('[test="password-checkbox"]');
  }

  async clickDisclaimerCheckbox() {
    await this.page.click('[test="disclaimer-checkbox"]');
  }

  async clickHeirsCheckbox() {
    await this.page.click('[test="heirs-checkbox"]');
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
