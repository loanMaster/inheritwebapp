import { test, expect } from "@playwright/test";
import { mockLogin } from "./mocks/mock.login";
import { MockBackend, TEST_FILE } from "./mocks/mock.backend";
import { ManageArchivesPom } from "./poms/manage-archives.pom";
import { DownloadAndDecryptPom } from "./poms/download-and-decrypt.pom";
import fs from "fs";

test.describe("manage-archives", async () => {
  let pom: ManageArchivesPom;
  let mockBackend: MockBackend;

  const mockArchive = {
    archiveName: "my-awesome-archive",
    ipfsHash: TEST_FILE.hash,
    iv: TEST_FILE.iv,
    recipients: [],
    id: "1",
    creationDate: Date.now(),
    size: 999,
  };

  const formatDate = (date: number): string => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("en", options);
  };

  test.beforeEach(async ({ page }) => {
    pom = new ManageArchivesPom(page);
    await mockLogin(page);
    mockBackend = new MockBackend();
    await mockBackend.initMocks(page);
  });

  test("show-empty-list", async () => {
    await pom.navigateTo();
    expect(await pom.getArchiveCount()).toBe(0);
    await pom.verifyEmptyListVisibility(true);
  });

  test("show-archive", async () => {
    mockBackend.settingsMock.archives.push(mockArchive);
    await pom.navigateTo();
    expect(await pom.getArchiveCount()).toBe(1);
    await pom.verifyEmptyListVisibility(false);
    await pom.verifyIv(mockArchive.iv);
    await pom.verifyIpfsHash(mockArchive.ipfsHash);
    await pom.verifyIpfsLink(`https://ipfs.io/ipfs/${mockArchive.ipfsHash}`);
    await pom.verifySize(`${mockArchive.size} Bytes`);
    await pom.verifyCreationDate(formatDate(mockArchive.creationDate));
  });

  test("edit-archive", async ({ page }) => {
    mockBackend.settingsMock.archives.push(mockArchive);
    await pom.navigateTo();
    await pom.verifyArchiveName(mockArchive.archiveName);
    expect(await pom.getArchiveCount()).toBe(1);
    await pom.fillArchiveName("my-new-name");
    await pom.addHeir();
    await pom.fillHeir("my-heir@example.com");
    await pom.addHeir();
    await pom.fillHeir("my-second-heir@example.com", 1);
    await pom.submit();
    await pom.verifySaveSuccessMsg();
    expect(await pom.getArchiveCount()).toBe(1);
    await page.reload();
    await pom.verifyArchiveName("my-new-name");
    await pom.verifyHeirEmail("my-heir@example.com");
    await pom.verifyHeirEmail("my-second-heir@example.com", 1);
    await expect(await pom.getHeirCount()).toBe(2);

    await pom.removeHeir(0, 0);
    await pom.submit();
    await pom.verifySaveSuccessMsg();
    await page.reload();
    await pom.verifyHeirEmail("my-second-heir@example.com", 0);
    await expect(await pom.getHeirCount()).toBe(1);
  });

  test("download-and-decrypt-archive", async ({ page }) => {
    mockBackend.settingsMock.archives.push(mockArchive);
    await pom.navigateTo();
    await pom.openDownloadAndDecryptModal();
    const modalPom = new DownloadAndDecryptPom(page);
    await modalPom.enterPassword(TEST_FILE.password);
    await modalPom.submit();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      pom.submit(),
    ]);
    const path = await download.path();
    expect(fs.readFileSync(path as string, "utf-8")).toEqual(
      fs.readFileSync(__dirname + "/assets/decrypted-archive.zip", "utf-8")
    );
    await pom.verifyDownloadAndDecryptDialogShown(false);
  });

  test.describe("delete-archives", () => {
    const mockArchive1 = {
      archiveName: "my-awesome-archive1",
      ipfsHash: "123",
      iv: "bla",
      recipients: [],
      id: "1",
      creationDate: Date.now(),
      size: 999,
    };
    const mockArchive2 = {
      archiveName: "my-awesome-archive2",
      ipfsHash: "321",
      iv: "foo",
      recipients: [],
      id: "2",
      creationDate: Date.now(),
      size: 123,
    };

    test.beforeEach(() => {
      mockBackend.settingsMock.archives.push(mockArchive1);
      mockBackend.settingsMock.archives.push(mockArchive2);
    });

    test("delete-archives", async () => {
      await pom.navigateTo();
      expect(await pom.getArchiveCount()).toBe(2);
      await pom.verifyEmptyListVisibility(false);
      await pom.verifyIpfsLink(
        `https://ipfs.io/ipfs/${mockArchive1.ipfsHash}`,
        0
      );
      await pom.verifyIpfsLink(
        `https://ipfs.io/ipfs/${mockArchive2.ipfsHash}`,
        1
      );
      await pom.deleteArchiveConfirm(0);
      expect(await pom.getArchiveCount()).toBe(1);
      await pom.verifyIpfsLink(
        `https://ipfs.io/ipfs/${mockArchive2.ipfsHash}`,
        0
      );
      await pom.verifyDeleteDialogShown(false);
    });

    test("delete-archive-cancel", async () => {
      await pom.navigateTo();
      expect(await pom.getArchiveCount()).toBe(2);
      await pom.deleteArchiveCancel(0);
      expect(await pom.getArchiveCount()).toBe(2);
      await pom.verifyDeleteDialogShown(false);
    });
  });
});
