import { test } from "@playwright/test";
import { mockLogin } from "./mocks/mock.login";
import { MockBackend } from "./mocks/mock.backend";
import { ServiceSettingsPom } from "./poms/service-settings.pom";

const DAY = 1440;
const POSSIBLE_INTERVAL_VALUES = [
  5,
  10,
  30,
  60,
  180,
  600,
  DAY,
  2 * DAY,
  3 * DAY,
  5 * DAY,
  7 * DAY,
  10 * DAY,
  14 * DAY,
];

const settingUpdate = {
  intervalReminder: 3 * DAY,
};

test.describe("service-settings", async () => {
  let pom: ServiceSettingsPom;
  let mockBackend: MockBackend;

  test.beforeEach(async ({ page }) => {
    pom = new ServiceSettingsPom(page);
    await mockLogin(page);
    mockBackend = new MockBackend();
    await mockBackend.initMocks(page);
  });

  test("display-settings", async () => {
    const settingsMock = mockBackend.settingsMock;

    await pom.navigateTo();
    await pom.verifyIntervalReminder(
      POSSIBLE_INTERVAL_VALUES.indexOf(settingsMock.intervalReminder)
    );
    await pom.verifyAlive(true);
  });

  test("update-settings", async ({ page }) => {
    await pom.navigateTo();
    await pom.setIntervalReminder(
      POSSIBLE_INTERVAL_VALUES.indexOf(settingUpdate.intervalReminder)
    );
    await pom.uncheckAliveCheckbox();

    await pom.submit();
    await pom.verifySettingsUpdateSuccessful();
    await page.reload();

    await pom.verifyIntervalReminder(
      POSSIBLE_INTERVAL_VALUES.indexOf(settingUpdate.intervalReminder)
    );
    await pom.verifyAlive(false);
  });
});
