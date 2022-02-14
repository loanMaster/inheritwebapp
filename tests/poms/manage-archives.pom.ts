import { expect, Page } from "@playwright/test";

export class ManageArchivesPom {
  constructor(private page: Page) {}

  async navigateTo() {
    await this.page.goto(
      `${process.env.WEBSITE_PATH}/dashboard/manage-archives`
    );
  }

  async getArchiveCount() {
    return this.page.locator('[test="edit-archive"]').count();
  }

  async getHeirCount(archiveIndex = 0) {
    const locator = this.page
      .locator(`[test="edit-archive"] >> nth=${archiveIndex}`)
      .locator('[test="heir-email"]');
    return locator.count();
  }

  async deleteArchiveConfirm(index = 0) {
    await this.page.click(`[test="delete-archive-btn"] >> nth=${index}`);
    const locator = this.page.locator(`[test="confirm-delete-modal"] >> nth=0`);
    await expect(await locator.isVisible()).toBeTruthy();
    await this.page.click(`[test="modal-confirm"]`);
  }

  async closeEditArchiveModal() {
    await this.page.click('[test="edit-archive-modal"] [test="modal-cancel"]');
  }

  async verifyDownloadAndDecryptDialogShown(value: boolean) {
    await this.page.$eval(
      `[test="download-and-decrypt-modal"]`,
      (el, value) => el.classList.contains("show") === value,
      value
    );
  }

  async verifyDeleteDialogShown(value: boolean) {
    await this.page.$eval(
      `[test="confirm-delete-modal"]`,
      (el, value) => el.classList.contains("show") === value,
      value
    );
  }

  async deleteArchiveCancel(index = 0) {
    await this.page.click(`[test="delete-archive-btn"] >> nth=${index}`);
    const locator = this.page.locator(`[test="confirm-delete-modal"] >> nth=0`);
    await expect(await locator.isVisible()).toBeTruthy();
    await this.page.click(`[test="modal-cancel"]`);
  }

  async openDownloadAndDecryptModal(index = 0) {
    await this.page.click(`[test="show-download-dialog"] >> nth=${index}`);
  }

  async verifyEmptyListVisibility(value: boolean, index = 0) {
    await expect(
      await this.page
        .locator(`[test="empty-list-info"] >> nth=${index}`)
        .isVisible()
    ).toBe(value);
  }

  async verifyIv(value: string, index = 0) {
    await expect(
      this.page.locator(`[test="iv"] >> nth=${index}`)
    ).toContainText(value);
  }

  async verifyArchiveName(value: string, index = 0) {
    await expect(
      this.page.locator(`[test="archive-name"] >> nth=${index}`)
    ).toContainText(value);
  }

  async verifyHeirEmail(value: string, heirIndex = 0, archiveIndex = 0) {
    const locator = this.page
      .locator(`[test="edit-archive"] >> nth=${archiveIndex}`)
      .locator(`[test="heir-email"] >> nth=${heirIndex}`);
    expect(await locator.textContent()).toBe(value);
  }

  async showEditArchiveModal(index = 0) {
    this.page.click(`[test="show-edit-modal"] >> nth=${index}`);
  }

  async verifyIpfsHash(value: string, index = 0) {
    await expect(
      this.page.locator(`[test="ipfs-hash"] >> nth=${index}`)
    ).toContainText(value);
  }

  async verifyCreationDate(value: string, index = 0) {
    await expect(
      this.page.locator(`[test="creation-date"] >> nth=${index}`)
    ).toContainText(value);
  }

  async verifySize(value: string, index = 0) {
    await expect(
      this.page.locator(`[test="size"] >> nth=${index}`)
    ).toContainText(value);
  }

  async verifyIpfsLink(value: string, index = 0) {
    await expect(
      this.page.locator(`[test="archive-ipfs-link"] >> nth=${index}`)
    ).toContainText(value);
  }
}
