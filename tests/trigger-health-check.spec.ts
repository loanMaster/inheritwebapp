import { expect, test } from "@playwright/test";
import { MockBackend } from "./mocks/mock.backend";

test.describe("health check trigger", () => {
  let mockBackend: MockBackend;

  test.beforeEach(async ({ page }) => {
    mockBackend = new MockBackend();
    await mockBackend.initMocks(page);
  });

  test("triggerHealthCheckSuccess", async ({ page }) => {
    await page.goto(`${process.env.WEBSITE_PATH}/trigger-health-check`);
    await page.fill(
      '[test="input-code"]',
      mockBackend.settingsMock.healthCheckTriggerCode
    );
    await page.click('[test="btn-submit"]');
    await expect(page.locator('[test="success-msg"]')).toHaveText(
      "A health check email will be sent shortly to john.doe@gmail.com."
    );
  });

  test("triggerHealthCheckError", async ({ page }) => {
    await page.goto(`${process.env.WEBSITE_PATH}/trigger-health-check`);
    await page.fill('[test="input-code"]', "bla");
    await page.click('[test="btn-submit"]');
    await expect(page.locator('[test="error-msg"]')).toContainText(
      "Code incorrect"
    );
  });
});
