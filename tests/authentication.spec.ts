import { expect, Page, test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

const tryLogin = async (page: Page, username: string, password: string) => {
  await page.goto(`${process.env.WEBSITE_PATH}/login`);
  await page.fill('[test="login-email"]', username);
  await page.fill('[test="login-password"]', password);
  await page.click('[test="login-submit"]');
};

test("login-and-logout", async ({ page }) => {
  await tryLogin(page, "member@example.com", "testmodepassword");
  await page.waitForNavigation({ url: "**/dashboard" });

  await page.click('[test="btn-logout"]');
  await page.waitForNavigation({ url: "**/login" });
  await expect(page.url()).toContain("/login");
});

test("login-incorrect-password", async ({ page }) => {
  await tryLogin(page, "member@example.com", "incorrectpass");
  await expect(page.locator('[test="login-error-msg"]')).toContainText(
    "Incorrect email or password"
  );
});

const tryResetPassword = async (page: Page, email: string) => {
  await page.goto(`${process.env.WEBSITE_PATH}/login`);
  await page.click('[test="reset-password-link"]');
  await page.type('[test="reset-password-email"]', email);
  await expect(page.url()).toContain("/reset-password");
  await page.click('[test="reset-password-submit"]');
};

test("reset-password-success", async ({ page }) => {
  await tryResetPassword(page, "member@example.com");
  await expect(
    page.locator('[test="reset-password-success-msg"]')
  ).toContainText(
    "You will shortly receive an email with a link to reset your password."
  );
});

test("reset-password-incorrect-email", async ({ page }) => {
  await tryResetPassword(page, "i-do-not-exist@example.com");
  await expect(page.locator('[test="reset-password-error-msg"]')).toContainText(
    "User not found"
  );
});

const trySignup = async (page: Page, email: string, pass: string) => {
  await page.goto(process.env.WEBSITE_PATH as string);
  await page.click('[test="btn-signup"]');
  await page.type('[test="signup-email"]', email);
  await page.type('[test="signup-password"]', pass);
  await page.click('[test="signup-submit"]');
};

test("signup-success", async ({ page }) => {
  await trySignup(
    page,
    uuidv4() + "@example.com",
    "Th1s_P@assword_5hould_SuFfIcE"
  );
  await expect(page.locator('[test="signup-success-msg"]')).toContainText(
    "Thank you for signing up. To activate your account click on the link in the confirmation email you will receive shortly."
  );
});

test("signup-invalid-password", async ({ page }) => {
  await trySignup(page, uuidv4() + "@example.com", "easy pass");
  await expect(page.locator('[test="signup-error-msg"]')).toContainText(
    "Password must be at least 16 characters OR at least 8 characters including a number and a letter"
  );
});
