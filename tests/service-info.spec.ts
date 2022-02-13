import { test, expect } from "@playwright/test";
import { mockLogin } from "./mocks/mock.login";
import { MockBackend, TEST_FILE } from "./mocks/mock.backend";
import { ServiceInfoPom } from "./poms/service-info.pom";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

test.describe("service-info", async () => {
  let pom: ServiceInfoPom;
  let mockBackend: MockBackend;

  const mockArchive = {
    archiveName: "my-awesome-archive",
    ipfsHash: TEST_FILE.hash,
    iv: TEST_FILE.iv,
    recipients: [{ email: "someheir@example.com" }],
    id: "1",
    creationDate: Date.now(),
    size: 999,
  };

  const formatDate = (date: number) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("en", options);
  };

  const formatDateTime = (date: number) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(date).toLocaleDateString("en", options);
  };

  test.beforeEach(async ({ page }) => {
    await mockLogin(page);
    mockBackend = new MockBackend();
    await mockBackend.initMocks(page);
    pom = new ServiceInfoPom(page);
  });

  test("service-not-active", async () => {
    mockBackend.settingsMock.active = false;
    await pom.navigateTo();
    const infoText = await pom.getInfoText();
    expect(infoText).toBe("Periodic health checks are currently disabled.");
  });

  test("service-active-but-no-archives", async () => {
    mockBackend.settingsMock.active = true;
    mockBackend.settingsMock.archives = [];
    await pom.navigateTo();
    expect(await pom.getInfoText()).toBe(
      "The service is not active yet. Create at least one archive with heir to activate the service."
    );
  });

  test("service-active-but-no-archives-with-heirs", async () => {
    mockBackend.settingsMock.active = true;
    mockBackend.settingsMock.archives = [
      {
        ...mockArchive,
        recipients: [],
      },
    ];
    await pom.navigateTo();
    expect(await pom.getInfoText()).toBe(
      "The service is not active yet. Create at least one archive with heir to activate the service."
    );
  });

  test("health-check-triggered-manually", async () => {
    mockBackend.settingsMock.triggerOnce = true;
    mockBackend.settingsMock.archives = [
      {
        ...mockArchive,
        recipients: [],
      },
    ];
    await pom.navigateTo();
    await pom.verifyHealthCheckManuallyTriggeredVisible();
  });

  test.describe("active-settings", () => {
    test.beforeEach(() => {
      mockBackend.settingsMock.active = true;
      mockBackend.settingsMock.archives = [
        {
          ...mockArchive,
          recipients: [{ email: "someguy@example.com" }],
        },
      ];
    });

    test("pending-health-check-confirmation", async () => {
      mockBackend.settingsMock.contactAttempts = [Date.now()];
      await pom.navigateTo();
      await expect(await pom.getInfoText()).toContain(
        `⚠ You have not confirmed the reception of your last health check email yet. The message was sent on ${formatDateTime(
          mockBackend.settingsMock.contactAttempts[0]
        )}. Please click on the confirmation link in the email.`
      );

      mockBackend.settingsMock.contactAttempts = [1, 2, 3, 4];
      await pom.navigateTo();
      await pom.verifySendMessagesWarningsVisible();
    });

    test("next-health-check-date", async () => {
      mockBackend.settingsMock.dueDate = 0;
      await pom.navigateTo();
      await expect(await pom.getInfoText()).toContain(
        `The next health check email will be sent in ~ 0 day(s), 0 hour(s), 0 minute(s) and 0 second(s).`
      );

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
    });

    test("display-expected-messages-send-date", async ({ page }) => {
      mockBackend.settingsMock.interval = 30;
      mockBackend.settingsMock.intervalReminder = 1;
      mockBackend.settingsMock.dueDate = Date.now();

      let expectedDate = formatDate(
        mockBackend.settingsMock.dueDate +
          4 * DAY * mockBackend.settingsMock.intervalReminder
      );
      await pom.navigateTo();
      await expect(await pom.getInfoText()).toContain(
        `In case you die today, a link to the archive(s) you prepared will be sent on ${expectedDate} to your heirs.`
      );

      mockBackend.settingsMock.dueDate = Date.now() - 2 * DAY;
      await page.reload();
      expectedDate = formatDate(
        mockBackend.settingsMock.dueDate +
          4 * DAY * mockBackend.settingsMock.intervalReminder
      );
      await expect(await pom.getInfoText()).toContain(expectedDate);

      mockBackend.settingsMock.dueDate = Date.now() + HOUR;
      mockBackend.settingsMock.contactAttempts = [1, 2, 3];
      await page.reload();
      expectedDate = formatDate(
        mockBackend.settingsMock.dueDate +
          DAY * mockBackend.settingsMock.intervalReminder
      );
      await expect(await pom.getInfoText()).toContain(expectedDate);

      mockBackend.settingsMock.dueDate = Date.now() + HOUR;
      mockBackend.settingsMock.contactAttempts = [1, 2];
      await page.reload();
      expectedDate = formatDate(
        mockBackend.settingsMock.dueDate +
          2 * DAY * mockBackend.settingsMock.intervalReminder
      );
      await expect(await pom.getInfoText()).toContain(expectedDate);
    });
  });
});
