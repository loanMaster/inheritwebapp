import { expect, test } from "@playwright/test";
import { MockBackend } from "./mocks/mock.backend";
import { AccessArchivePom } from "./poms/access-archive.pom";
import { Archive } from "@/entities/archive";
import { formatDateTime } from "@/util/format-date";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

test.describe("health check trigger", () => {
  let mockBackend: MockBackend;
  let pom: AccessArchivePom;

  test.beforeEach(async ({ page }) => {
    mockBackend = new MockBackend();
    pom = new AccessArchivePom(page);
    await mockBackend.initMocks(page);
  });

  test.describe("trigger-health-check-successfully", () => {
    const code = "123";

    test.beforeEach(() => {
      mockBackend.settingsMock.archives = [{ accessCode: code } as Archive];
    });

    test("trigger-health-check-success", async () => {
      await pom.navigateTo();
      await pom.enterCode(code);
      await pom.submitCode();
      await pom.verifyHealthCheckTriggeredMsgVisible();
    });

    test("verify-already-triggered-msg", async () => {
      mockBackend.settingsMock.contactAttempts = [Date.now()];
      await pom.navigateTo();
      await pom.enterCode(code);
      await pom.submitCode();
      await pom.verifyTriggeredAlreadyMsgVisible();
    });

    test("verify-date", async () => {
      await pom.navigateTo();
      await pom.enterCode(code);
      await pom.submitCode();
      const expectedDate =
        mockBackend.settingsMock.dueDate +
        4 * mockBackend.settingsMock.intervalReminder * DAY;
      expect(await pom.getExpectedAccessDateMsg()).toContain(
        formatDateTime(expectedDate)
      );
    });
  });

  test("triggerHealthCheckError", async ({ page }) => {
    await pom.navigateTo();
    await pom.enterCode("bla");
    await pom.submitCode();
    await expect(page.locator('[test="error-msg"]')).toContainText(
      "Code incorrect"
    );
  });
});
