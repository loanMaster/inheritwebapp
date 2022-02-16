import { test, expect } from "@playwright/test";
import { mockLogin } from "./mocks/mock.login";
import { MockBackend } from "./mocks/mock.backend";
import { CreateEncryptedArchivePom } from "./poms/create-encrypted-archive.pom";

test.describe("create-encrypted-archive", async () => {
  let mockBackend: MockBackend;
  let pom: CreateEncryptedArchivePom;

  test.beforeEach(async ({ page }) => {
    pom = new CreateEncryptedArchivePom(page);
    await mockLogin(page);
    mockBackend = new MockBackend();
    await mockBackend.initMocks(page);
  });

  test("create-archive", async () => {
    await pom.encryptAndUploadFile();
    await pom.verifyCreateArchiveSuccessful();
    await pom.verifyAccessCodeShown(
      mockBackend.settingsMock.archives[0].accessCode
    );
  });

  test("create-multiple-archives", async () => {
    await pom.encryptAndUploadFile();
    await pom.verifyCreateArchiveSuccessful();

    await pom.startCreateAnotherArchive();
    await pom.encryptAndUploadFile();
    await pom.verifyCreateArchiveSuccessful();
    await expect(mockBackend.settingsMock.archives.length).toBe(2);
  });
});
