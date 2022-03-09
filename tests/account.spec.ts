import { test } from "@playwright/test";
import { mockLogin } from "./mocks/mock.login";
import { AccountPom } from "./poms/account.pom";
import { MockBackend } from "./mocks/mock.backend";

test.describe("account", async () => {
  let pom: AccountPom;
  let mockBackend: MockBackend;

  test.beforeEach(async ({ page }) => {
    pom = new AccountPom(page);
    await mockLogin(page);
    mockBackend = new MockBackend();
    await mockBackend.initMocks(page);
  });

  test("show-data", async () => {
    await pom.navigateTo();
    await pom.verifyEmailShown("member@example.com");
    await pom.verifyCreationDate("Friday, September 11, 2020, 11:53 PM");
  });

  test("reset-email", async () => {
    await pom.navigateTo();
    await pom.resetPassword();
    await pom.verifySuccessMsgShown();
  });
});
