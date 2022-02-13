import { expect, test } from "@playwright/test";
import * as fs from "fs";
import { MockBackend, TEST_FILE } from "./mocks/mock.backend";
import { DownloadAndDecryptPom } from "./poms/download-and-decrypt.pom";

test.describe("download and decrypt", async () => {
  let pom: DownloadAndDecryptPom;

  test.beforeEach(async ({ page }) => {
    pom = new DownloadAndDecryptPom(page);
    const mockBackend = new MockBackend();
    await mockBackend.initMocks(page);
  });

  test("decryptFile", async ({ page }) => {
    const { hash, iv, pass } = {
      pass: TEST_FILE.password,
      iv: TEST_FILE.iv,
      hash: TEST_FILE.hash,
    };
    await pom.navigateToDecryptPage(iv, hash);
    await pom.enterPassword(pass);

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
    const { hash, iv, pass } = {
      pass: "bad_password",
      iv: TEST_FILE.iv,
      hash: TEST_FILE.hash,
    };
    await pom.navigateToDecryptPage(iv, hash);
    await pom.enterPassword(pass);
    await pom.submit();

    await pom.verifyError(
      "There was an error decrypting your file. Please check your password and iv"
    );
  });

  test("decryptFile_wrong_iv", async () => {
    const { hash, iv, pass } = {
      pass: TEST_FILE.password,
      iv: "111dbf92-235a-47fd-b64b-55da65950369",
      hash: TEST_FILE.hash,
    };
    await pom.navigateToDecryptPage(iv, hash);
    await pom.enterPassword(pass);
    await pom.submit();

    await pom.verifyError(
      "There was an error decrypting your file. Please check your password and iv"
    );
  });

  test("decryptFile_wrong_hash", async () => {
    const { hash, iv, pass } = {
      pass: TEST_FILE.password,
      iv: TEST_FILE.iv,
      hash: "INVALIDHASH",
    };
    await pom.navigateToDecryptPage(iv, hash);
    await pom.enterPassword(pass);
    await pom.submit();

    await pom.verifyError(
      "The archive could not be downloaded. Please verify the ipfs hash"
    );
  });
});
