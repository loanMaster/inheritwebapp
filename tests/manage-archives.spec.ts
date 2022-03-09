import { test, expect, Page } from "@playwright/test";
import { mockLogin } from "./mocks/mock.login";
import {
  MOCK_FILE_SERVER_LOCATION,
  MockBackend,
  TEST_FILE,
} from "./mocks/mock.backend";
import { ManageArchivesPom } from "./poms/manage-archives.pom";
import { DownloadAndDecryptPom } from "./poms/download-and-decrypt.pom";
import fs from "fs";
import { EditArchivePom } from "./poms/edit-archive.pom";
import { Archive } from "@/entities/archive";
import { UpdateArchivePom } from "./poms/update-archive.pom";

test.describe("manage-archives", async () => {
  let pom: ManageArchivesPom;
  let mockBackend: MockBackend;

  const mockArchive: Archive = {
    archiveName: "my-awesome-archive",
    iv: TEST_FILE.iv,
    accessCode: "dummy-access-code",
    id: "1",
    creationDate: Date.now(),
    lastModified: Date.now(),
    file: {
      size: 999,
      id: TEST_FILE.hash,
      ipfs: true,
      location: MOCK_FILE_SERVER_LOCATION + TEST_FILE.hash,
    },
  };

  const formatDate = (date: number): string => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("en", options as any);
  };

  test.beforeEach(async ({ page }) => {
    pom = new ManageArchivesPom(page);
    await mockLogin(page);
    mockBackend = new MockBackend();
    await mockBackend.initMocks(page);
  });

  test("show-empty-list", async () => {
    await pom.navigateTo();
    await pom.verifyArchiveCount(0);
    await pom.verifyEmptyListVisibility(true);
  });

  test("show-archive-ipfs", async () => {
    mockBackend.settingsMock.archives.push(mockArchive);
    await pom.navigateTo();
    await pom.verifyArchiveCount(1);
    await pom.verifyEmptyListVisibility(false);
    await pom.verifyIv(mockArchive.iv);
    await pom.verifyAccessCode(mockArchive.accessCode);
    await pom.verifyFileId(mockArchive.file.id);
    await pom.verifyIpfsLink(`https://ipfs.io/ipfs/${mockArchive.file.id}`);
    await pom.verifySize(`${mockArchive.file.size} Bytes`);
    await pom.verifyCreationDate(formatDate(mockArchive.creationDate));
    await pom.verifyStorageLocationType("ipfs");
  });

  test("show-archive-cloud-storage", async () => {
    const cloudStorageArchive = JSON.parse(JSON.stringify(mockArchive));
    cloudStorageArchive.file.ipfs = false;
    cloudStorageArchive.file.location =
      MOCK_FILE_SERVER_LOCATION + TEST_FILE.hash;
    mockBackend.settingsMock.archives = [cloudStorageArchive];
    await pom.navigateTo();
    await pom.verifyArchiveCount(1);
    await pom.verifyFileId(mockArchive.file.id);
    await pom.verifyIpfsLink(cloudStorageArchive.file.location);
    await pom.verifyStorageLocationType("Cloud storage container");
  });

  test.describe("edit-archive", () => {
    let updateArchivePom: UpdateArchivePom;

    test.beforeEach(({ page }) => {
      updateArchivePom = new UpdateArchivePom(page);
      mockBackend.settingsMock.archives.push(
        JSON.parse(JSON.stringify(mockArchive))
      );
    });

    const openAndDecryptArchive = async (page: Page) => {
      await pom.navigateTo();
      await pom.verifyArchiveName(mockArchive.archiveName as string);
      await pom.verifyArchiveCount(1);

      await pom.showEditArchiveModal();

      const editArchivePom = new EditArchivePom(page);
      await editArchivePom.enterPassword(TEST_FILE.password);
      await editArchivePom.decrypt();
    };

    test("edit-archive-name-and-access-code", async ({ page }) => {
      await openAndDecryptArchive(page);

      expect(await updateArchivePom.getArchiveName()).toBe(
        mockArchive.archiveName
      );
      await updateArchivePom.fillArchiveName("my-new-name");
      await updateArchivePom.verifyAccessCodeWarningVisible(false);
      await updateArchivePom.refreshAccessCode();
      await updateArchivePom.verifyAccessCodeWarningVisible(true);
      await updateArchivePom.submit();
      await updateArchivePom.verifySaveSuccessMsg();

      const archive = mockBackend.settingsMock.archives.find(
        (a) => a.id === mockArchive.id
      ) as Archive;
      await pom.verifyAccessCode(archive.accessCode);
      await pom.verifyArchiveName("my-new-name");
    });

    test("edit-archive-files", async ({ page }) => {
      const confirmDownload = async (trigger: Promise<any>, file: string) => {
        const [download] = await Promise.all([
          page.waitForEvent("download"),
          trigger,
        ]);
        const path = await download.path();
        expect(fs.readFileSync(path as string, "utf-8")).toEqual(
          fs.readFileSync(file, "utf-8")
        );
      };
      await openAndDecryptArchive(page);
      expect(await updateArchivePom.getArchiveName()).toBe(
        mockArchive.archiveName
      );
      expect(await updateArchivePom.getFileCount()).toBe(1);
      await confirmDownload(
        updateArchivePom.downloadFile(0),
        __dirname + "/assets/mock-archive-file-attachment.txt"
      );

      await updateArchivePom.removeFile(0);
      expect(await updateArchivePom.getFileCount()).toBe(0);

      await updateArchivePom.setInputFile(
        __dirname + "/assets/upload-file.txt"
      );
      expect(await updateArchivePom.getFileCount()).toBe(1);

      await updateArchivePom.setInputFile(
        __dirname + "/assets/for-override/upload-file2.txt"
      );
      expect(await updateArchivePom.getFileCount()).toBe(2);

      await confirmDownload(
        updateArchivePom.downloadFile(1),
        __dirname + "/assets/for-override/upload-file2.txt"
      );

      await updateArchivePom.setInputFile(
        __dirname + "/assets/upload-file2.txt"
      );
      await updateArchivePom.verifyOverrideWarningVisible(true);
      await updateArchivePom.cancelOverride();
      await confirmDownload(
        updateArchivePom.downloadFile(1),
        __dirname + "/assets/for-override/upload-file2.txt"
      );

      await updateArchivePom.setInputFile(
        __dirname + "/assets/upload-file2.txt"
      );
      await updateArchivePom.confirmOverride();
      await confirmDownload(
        updateArchivePom.downloadFile(1),
        __dirname + "/assets/upload-file2.txt"
      );

      await updateArchivePom.submit();
      await updateArchivePom.verifySaveSuccessMsg();
    });
  });

  test("download-and-decrypt-archive", async ({ page }) => {
    mockBackend.settingsMock.archives.push(mockArchive);
    await pom.navigateTo();
    await pom.openDownloadAndDecryptModal();
    const modalPom = new DownloadAndDecryptPom(page);
    await modalPom.enterPassword(TEST_FILE.password);

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      modalPom.submit(),
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
      file: {
        size: 999,
        ipfs: true,
        id: "123",
        location: "",
      },
      iv: "bla",
      id: "1",
      creationDate: Date.now(),
      lastModified: Date.now(),
      accessCode: "",
    };
    const mockArchive2 = {
      archiveName: "my-awesome-archive2",
      file: {
        size: 999,
        ipfs: true,
        id: "bla",
        location: "",
      },
      iv: "foo",
      id: "2",
      creationDate: Date.now(),
      lastModified: Date.now(),
      size: 123,
      accessCode: "",
    };

    test.beforeEach(() => {
      mockBackend.settingsMock.archives.push(mockArchive1);
      mockBackend.settingsMock.archives.push(mockArchive2);
    });

    test("delete-archives", async () => {
      await pom.navigateTo();
      await pom.verifyArchiveCount(2);
      await pom.verifyEmptyListVisibility(false);
      await pom.verifyIpfsLink(
        `https://ipfs.io/ipfs/${mockArchive1.file.id}`,
        0
      );
      await pom.verifyIpfsLink(
        `https://ipfs.io/ipfs/${mockArchive2.file.id}`,
        1
      );
      await pom.deleteArchiveConfirm(0);
      await pom.verifyArchiveCount(1);
      await pom.verifyIpfsLink(
        `https://ipfs.io/ipfs/${mockArchive2.file.id}`,
        0
      );
      await pom.verifyDeleteDialogShown(false);
    });

    test("delete-archive-cancel", async () => {
      await pom.navigateTo();
      await pom.verifyArchiveCount(2);
      await pom.deleteArchiveCancel(0);
      await pom.verifyArchiveCount(2);
      await pom.verifyDeleteDialogShown(false);
    });
  });
});
