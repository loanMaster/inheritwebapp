import { expect, test } from "@playwright/test";
import {
  MOCK_FILE_SERVER_LOCATION,
  MockBackend,
  TEST_FILE,
} from "./mocks/mock.backend";
import { AccessArchivePom } from "./poms/access-archive.pom";
import { Archive } from "@/entities/archive";
import { formatDateTime } from "@/util/format-date";
import { DownloadAndDecryptPom } from "./poms/download-and-decrypt.pom";
import fs from "fs";

const MINUTE = 60 * 1000;

test.describe("health-check-and-decrypt", () => {
  let mockBackend: MockBackend;

  test.describe("health-check", () => {
    let accessArchivePom: AccessArchivePom;

    test.beforeEach(async ({ page }) => {
      mockBackend = new MockBackend();
      accessArchivePom = new AccessArchivePom(page);
      await mockBackend.initMocks(page);
    });

    test.describe("trigger-health-check-successfully", () => {
      const code = "123";

      test.beforeEach(() => {
        mockBackend.settingsMock.archives = [{ accessCode: code } as Archive];
      });

      test("trigger-health-check-success", async () => {
        await accessArchivePom.navigateTo();
        await accessArchivePom.enterCode(code);
        await accessArchivePom.submitCode();
        await accessArchivePom.verifyHealthCheckTriggeredMsgVisible();
      });

      test("verify-already-triggered-msg", async () => {
        mockBackend.settingsMock.contactAttempts = [Date.now()];
        await accessArchivePom.navigateTo();
        await accessArchivePom.enterCode(code);
        await accessArchivePom.submitCode();
        await accessArchivePom.verifyTriggeredAlreadyMsgVisible();
      });

      test("verify-date", async () => {
        await accessArchivePom.navigateTo();
        await accessArchivePom.enterCode(code);
        await accessArchivePom.submitCode();
        const expectedDate =
          mockBackend.settingsMock.dueDate +
          4 * mockBackend.settingsMock.intervalReminder * MINUTE;
        expect(await accessArchivePom.getExpectedAccessDateMsg()).toContain(
          formatDateTime(expectedDate)
        );
      });
    });

    test("triggerHealthCheckError", async ({ page }) => {
      await accessArchivePom.navigateTo();
      await accessArchivePom.enterCode("bla");
      await accessArchivePom.submitCode();
      await expect(page.locator('[test="error-msg"]')).toContainText(
        "Code incorrect"
      );
    });
  });

  test.describe("access-and-decrypt-archive", () => {
    let downloadAndDecryptPom: DownloadAndDecryptPom;
    let accessArchivePom: AccessArchivePom;

    test.beforeEach(async ({ page }) => {
      accessArchivePom = new AccessArchivePom(page);
      downloadAndDecryptPom = new DownloadAndDecryptPom(page);
      mockBackend = new MockBackend();
      mockBackend.settingsMock.dead = true;
      mockBackend.settingsMock.archives = [
        {
          iv: TEST_FILE.iv,
          file: {
            id: TEST_FILE.hash,
            size: 0,
            ipfs: true,
            location: MOCK_FILE_SERVER_LOCATION + TEST_FILE.hash,
          },
          accessCode: "123-test",
          id: "",
          creationDate: 0,
          lastModified: 0,
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
      await downloadAndDecryptPom.enterPassword(TEST_FILE.password);

      const [download] = await Promise.all([
        page.waitForEvent("download"),
        downloadAndDecryptPom.submit(),
      ]);

      const path = await download.path();
      expect(fs.readFileSync(path as string, "utf-8")).toEqual(
        fs.readFileSync(__dirname + "/assets/decrypted-archive.zip", "utf-8")
      );
    });

    test("decryptFile_wrong_pass", async () => {
      await enterAccessCode();
      await downloadAndDecryptPom.enterPassword("bad password");
      await downloadAndDecryptPom.submit();

      await downloadAndDecryptPom.verifyError(
        "There was an error decrypting your file. Please verify your password."
      );
    });
  });
});
