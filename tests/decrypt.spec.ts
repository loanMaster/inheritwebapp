import { expect, test } from "@playwright/test";
import * as fs from "fs";
import { MockBackend, TEST_FILE } from "./mocks/mock.backend";
import { DownloadAndDecryptPom } from "./poms/download-and-decrypt.pom";
import { AccessArchivePom } from "./poms/access-archive.pom";

test.describe("download-and-decrypt", async () => {
  let pom: DownloadAndDecryptPom;
  let accessArchivePom: AccessArchivePom;
  let mockBackend = new MockBackend();

  test.beforeEach(async ({ page }) => {
    accessArchivePom = new AccessArchivePom(page);
    pom = new DownloadAndDecryptPom(page);
    mockBackend = new MockBackend();
    mockBackend.settingsMock.dead = true;
    mockBackend.settingsMock.archives = [
      {
        iv: TEST_FILE.iv,
        ipfsHash: TEST_FILE.hash,
        accessCode: "123-test",
        id: "",
        size: 0,
        creationDate: 0,
      },
    ];
    await mockBackend.initMocks(page);
  });

  const enterAccessCode = async () => {
    await accessArchivePom.navigateTo();
    await accessArchivePom.enterCode(
      mockBackend.settingsMock.archives[0].accessCode
    );
    await accessArchivePom.submitCode();
  };

  test("decryptFile", async ({ page }) => {
    await enterAccessCode();
    await pom.enterPassword(TEST_FILE.password);

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      pom.submit(),
    ]);

    const path = await download.path();
    expect(fs.readFileSync(path as string, "utf-8")).toEqual(
      fs.readFileSync(__dirname + "/assets/decrypted-archive.zip", "utf-8")
    );
  });

  test("decryptFile_wrong_pass", async () => {
    await enterAccessCode();
    await pom.enterPassword("bad password");
    await pom.submit();

    await pom.verifyError(
      "There was an error decrypting your file. Please check your password and iv"
    );
  });
});
