import { expect, Page } from "@playwright/test";

export class UpdateArchivePom {
  constructor(private page: Page) {}

  async submit() {
    await this.page.click(`[test="update-archive-submit"]`);
  }

  async getArchiveName() {
    return this.page.inputValue(`[test="archive-name-input"]`);
  }

  async verifySaveSuccessMsg() {
    await expect(
      this.page.locator('[test="update-archive-success-msg"]')
    ).toBeVisible();
  }

  async removeFile(idx: number) {
    await this.page.click(`[test="remove-attachment"] >> nth=${idx}`);
  }

  async downloadFile(idx: number) {
    await this.page.click(`[test="download-file"] >> nth=${idx}`);
  }

  async getFileCount() {
    return this.page.locator('[test="file-attachment"]').count();
  }

  async refreshAccessCode() {
    await this.page.click('[test="regenerate-access-code"]');
  }

  async verifyAccessCodeWarningVisible(visible: boolean) {
    await expect(
      await this.page
        .locator('[test="access-code-changed-warning"]')
        .isVisible()
    ).toBe(visible);
  }

  async fillArchiveName(value: string) {
    this.page.fill(`[test="archive-name-input"]`, value);
  }

  async setInputFile(fileName: string) {
    await this.page.setInputFiles('[test="upload-file"]', fileName);
  }

  async verifyOverrideWarningVisible(visible: boolean) {
    await expect(
      await this.page.locator('[test="confirm-override-modal"]').isVisible()
    ).toBe(visible);
  }

  async confirmOverride() {
    await this.page.click(
      '[test="confirm-override-modal"] [test="modal-confirm"]'
    );
  }

  async cancelOverride() {
    await this.page.click(
      '[test="confirm-override-modal"] [test="modal-cancel"]'
    );
  }
}
