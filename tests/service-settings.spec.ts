import { test } from "@playwright/test";
import { mockLogin } from "./mocks/mock.login";
import { MockBackend } from "./mocks/mock.backend";
import { ServiceSettingsPom } from "./poms/service-settings.pom";

const settingUpdate = {
  intervalReminder: 7,
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
    await pom.verifyIntervalReminder(settingsMock.intervalReminder);
    await pom.verifyAlive("on");
  });

  test("update-settings", async ({ page }) => {
    await pom.navigateTo();
    await pom.setIntervalReminder(settingUpdate.intervalReminder);

    await pom.submit();
    await pom.verifySettingsUpdateSuccessful();
    await page.reload();

    await pom.verifyIntervalReminder(settingUpdate.intervalReminder);
  });
});
