import { expect, test } from "@playwright/test";
import { mockLogin, mockLoginEmailNotConfirmed } from "./mocks/mock.login";
import { DashboardPom } from "./poms/dashboard.pom";
import { VerificationPendingPom } from "./poms/verificiation-pending.pom";
import { MockBackend } from "./mocks/mock.backend";
import { ServiceSettingsPom } from "./poms/service-settings.pom";

test.describe("dashboard", async () => {
  let pom: DashboardPom;
  let mockBackend: MockBackend;

  test.beforeEach(async ({ page }) => {
    pom = new DashboardPom(page);
    mockBackend = new MockBackend();
    await mockBackend.initMocks(page);
  });

  test("user-not-confirmed", async ({ page }) => {
    await mockLoginEmailNotConfirmed(page);
    await pom.navigateTo();
    await expect(page.url()).toBe(
      `${process.env.WEBSITE_PATH}/verification-pending`
    );

    const verificationPendingPom = new VerificationPendingPom(page);
    await verificationPendingPom.resendEmail();
    await verificationPendingPom.verifySuccessMsgShown();
  });

  test("first-access-to-dashboard", async ({ page }) => {
    mockBackend.settingsMock.justCreated = true;
    await mockLogin(page);
    await pom.navigateTo();
    await pom.verifyWelcomeModalShown(true);
    await pom.closeWelcomeModal();
    await page.goto(`${process.env.WEBSITE_PATH}/`);
    await pom.navigateTo();
    await pom.verifyWelcomeModalShown(false);
  });

  test("not-first-access-to-dashboard", async ({ page }) => {
    mockBackend.settingsMock.justCreated = false;
    await mockLogin(page);
    await pom.navigateTo();
    await pom.verifyWelcomeModalShown(false);
  });

  test.describe("user-info-box", () => {
    test("toggle-alive-switch", async ({ page }) => {
      mockBackend.settingsMock.justCreated = false;
      await mockLogin(page);
      await pom.navigateTo();

      await pom.verifyUserInfoTextContains(
        "You are still alive. The access to your archives is blocked."
      );

      const settingsPom = new ServiceSettingsPom(page);
      await settingsPom.navigateTo();
      await settingsPom.uncheckAliveCheckbox();
      await settingsPom.submit();
      await pom.verifyUserInfoTextContains(
        "You are dead. Your heirs can access your archives."
      );
    });

    test("user-dead", async ({ page }) => {
      mockBackend.settingsMock.dead = true;
      await mockLogin(page);
      await pom.navigateTo();
      await pom.verifyUserInfoTextContains(
        "You are dead. Your heirs can access your archives."
      );
    });
  });
});
