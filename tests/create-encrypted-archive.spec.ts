import { test, expect } from "@playwright/test";
import { mockLogin } from "./mocks/mock.login";
import { MockBackend } from "./mocks/mock.backend";
import { CreateEncryptedArchivePom } from "./poms/create-encrypted-archive.pom";

test.describe("service-settings", async () => {
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
    await pom.setHeirEmail("myheir@example.com");
    await pom.submitHeirs();
    await pom.verifyCreateArchiveSuccessful();

    const recipients = mockBackend.settingsMock.archives[0].recipients;
    expect(recipients.length).toBe(1);
    expect(recipients[0].email).toBe("myheir@example.com");
  });

  test("create-multiple-archives", async () => {
    await pom.encryptAndUploadFile();
    await pom.setHeirEmail("myheir@example.com");
    await pom.submitHeirs();
    await pom.verifyCreateArchiveSuccessful();

    await pom.startCreateAnotherArchive();
    await pom.encryptAndUploadFile();
    await pom.setHeirEmail("secondheir@example.com");
    await pom.submitHeirs();
    await pom.verifyCreateArchiveSuccessful();
    await expect(mockBackend.settingsMock.archives.length).toBe(2);
  });

  test("multiple-heirs", async () => {
    await pom.encryptAndUploadFile();
    await pom.setHeirEmail("secondheir@example.com");
    await expect(await pom.getHeirCount()).toBe(1);

    for (let i = 0; i < 4; i++) {
      await pom.addHeir();
    }
    await expect(await pom.getHeirCount()).toBe(5);
    await pom.verifyAddHeirButtonNotVisible();

    for (let i = 0; i < 3; i++) {
      await pom.removeHeir();
    }
    await expect(await pom.getHeirCount()).toBe(2);
    await pom.setHeirEmail("myheir1@example.com", 0);
    await pom.setHeirEmail("myheir2@example.com", 1);

    await pom.submitHeirs();
    await pom.verifyCreateArchiveSuccessful();

    const recipients = mockBackend.settingsMock.archives[0].recipients;
    expect(recipients.length).toBe(2);
    expect(recipients[0].email).toBe("myheir1@example.com");
    expect(recipients[1].email).toBe("myheir2@example.com");
  });
});
