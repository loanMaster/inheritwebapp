import { test, expect } from "@playwright/test";
import { mockLogin } from "./mocks/mock.login";
import { MockBackend } from "./mocks/mock.backend";
import { ServiceInfoPom } from "./poms/service-info.pom";
import { formatDate, formatDateTime } from "@/util/format-date";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * 60 * MINUTE;

test.describe("service-info", async () => {
  let pom: ServiceInfoPom;
  let mockBackend: MockBackend;

  test.beforeEach(async ({ page }) => {
    await mockLogin(page);
    mockBackend = new MockBackend();
    await mockBackend.initMocks(page);
    pom = new ServiceInfoPom(page);
  });

  test("service-not-active", async () => {
    mockBackend.settingsMock.triggerOnce = false;
    await pom.navigateTo();
    await pom.verifyNoHealthCheckTriggeredTextVisible();
    const text = await pom.getNoHealthCheckTriggeredText();
    const expectedData =
      Date.now() + 4 * mockBackend.settingsMock.intervalReminder * MINUTE;
    expect(text).toContain(formatDate(expectedData));
  });

  test("health-check-triggered-manually", async () => {
    mockBackend.settingsMock.triggerOnce = true;
    await pom.navigateTo();
    await pom.verifyHealthCheckManuallyTriggeredVisible();
  });

  test.describe("active-settings", () => {
    test.beforeEach(() => {
      mockBackend.settingsMock.triggerOnce = true;
    });

    test("pending-health-check-confirmation", async () => {
      mockBackend.settingsMock.contactAttempts = [Date.now()];
      await pom.navigateTo();
      await expect(await pom.getInfoText()).toContain(
        `⚠ You have not confirmed the reception of your last health check email yet. The message was sent on ${formatDateTime(
          mockBackend.settingsMock.contactAttempts[0]
        )}. Please click on the confirmation link in the email.`
      );

      mockBackend.settingsMock.contactAttempts = [1, Date.now()];
      await pom.navigateTo();
      await expect(await pom.getInfoText()).toContain(
        formatDateTime(mockBackend.settingsMock.contactAttempts[1])
      );
    });

    test("next-health-check-date", async () => {
      mockBackend.settingsMock.dueDate = 0;
      await pom.navigateTo();
      await expect(await pom.getInfoText()).toContain(
        `The next health check email will be sent in`
      );
      await expect(await pom.getInfoText()).toContain(`less than 5 min.`);

      const smallExtraTime = 20 * 1000;
      mockBackend.settingsMock.dueDate =
        Date.now() + 3 * MINUTE + 17 * HOUR + smallExtraTime;
      await pom.navigateTo();
      await expect(await pom.getInfoText()).toContain(
        `0 day(s), 17 hour(s), 3 minute(s)`
      );

      mockBackend.settingsMock.dueDate =
        Date.now() + 57 * MINUTE + 5 * HOUR + 25 * DAY + smallExtraTime;
      await pom.navigateTo();
      await expect(await pom.getInfoText()).toContain(
        `25 day(s), 5 hour(s), 57 minute(s)`
      );

      mockBackend.settingsMock.contactAttempts = [1, 2, 3, 4];
      mockBackend.settingsMock.dueDate =
        Date.now() + 57 * MINUTE + 5 * HOUR + 25 * DAY + smallExtraTime;
      await pom.navigateTo();
      await expect(await pom.getInfoText()).toContain(
        `⚠ my-legacy will conclude that you are dead in`
      );
    });

    test("display-expected-messages-send-date", async () => {
      mockBackend.settingsMock.intervalReminder = 1440;
      mockBackend.settingsMock.dueDate = Date.now();

      let expectedDate = formatDate(
        mockBackend.settingsMock.dueDate +
          4 * MINUTE * mockBackend.settingsMock.intervalReminder
      );
      await pom.navigateTo();
      await expect(await pom.getInfoText()).toContain(
        `In case you die today, access to the archives you prepared will be granted on ${expectedDate} to your heirs.`
      );

      mockBackend.settingsMock.triggerOnce = false;
      mockBackend.settingsMock.dueDate = Date.now() - 0.5 * DAY;
      await pom.navigateTo();
      expectedDate = formatDate(
        Date.now() + 4 * MINUTE * mockBackend.settingsMock.intervalReminder
      );
      await expect(await pom.getInfoText()).toContain(expectedDate);

      mockBackend.settingsMock.triggerOnce = true;

      await pom.navigateTo();
      expectedDate = formatDate(
        mockBackend.settingsMock.dueDate +
          4 * MINUTE * mockBackend.settingsMock.intervalReminder
      );
      await expect(await pom.getInfoText()).toContain(expectedDate);

      mockBackend.settingsMock.dueDate = Date.now() + HOUR;
      mockBackend.settingsMock.contactAttempts = [1, 2, 3];
      await pom.navigateTo();
      expectedDate = formatDate(
        mockBackend.settingsMock.dueDate +
          MINUTE * mockBackend.settingsMock.intervalReminder
      );
      await expect(await pom.getInfoText()).toContain(expectedDate);

      mockBackend.settingsMock.dueDate = Date.now() + HOUR;
      mockBackend.settingsMock.contactAttempts = [1, 2];
      await pom.navigateTo();
      expectedDate = formatDate(
        mockBackend.settingsMock.dueDate +
          2 * MINUTE * mockBackend.settingsMock.intervalReminder
      );
      await expect(await pom.getInfoText()).toContain(expectedDate);
    });
  });
});
