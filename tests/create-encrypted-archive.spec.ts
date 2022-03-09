import { test, expect } from "@playwright/test";
import { mockLogin } from "./mocks/mock.login";
import { MockBackend } from "./mocks/mock.backend";
import { CreateEncryptedArchivePom } from "./poms/create-encrypted-archive.pom";

const INPUT_FILE = __dirname + "/assets/upload-file.txt";

test.describe("create-encrypted-archive", async () => {
  let mockBackend: MockBackend;
  let pom: CreateEncryptedArchivePom;
  const DEFAULT_PASS = "tops1cretLongpassword";

  const fillCreateArchiveForm = async (
    password: string = DEFAULT_PASS,
    passwordVerify: string = DEFAULT_PASS,
    file = INPUT_FILE
  ) => {
    await pom.navigateTo();
    await pom.setInputFile(file);
    await pom.inputArchiveName("my-test-archive");
    await pom.inputPassword(password);
    await pom.inputPasswordVerify(passwordVerify);
    await pom.clickDisclaimerCheckbox();
    await pom.clickPasswordCheckbox();
    await pom.clickHeirsCheckbox();
  };

  test.beforeEach(async ({ page }) => {
    pom = new CreateEncryptedArchivePom(page);
    await mockLogin(page);
    mockBackend = new MockBackend();
    await mockBackend.initMocks(page);
  });

  test("create-archive-and-decrypt-again", async () => {
    await fillCreateArchiveForm();
    await pom.submit();
    await pom.verifyCreateArchiveSuccessful();
    await pom.verifyAccessCodeShown(
      mockBackend.settingsMock.archives[0].accessCode
    );
  });

  test("create-archive-multiple-files", async () => {
    await fillCreateArchiveForm();
    expect(await pom.getFileCount()).toBe(1);
    await pom.setInputFile(__dirname + "/assets/upload-file2.txt");
    expect(await pom.getFileCount()).toBe(2);
    await pom.submit();
    await pom.verifyCreateArchiveSuccessful();

    await pom.navigateTo();
    expect(await pom.getFileCount()).toBe(0);
  });

  test("create-archive-bad-password", async () => {
    await fillCreateArchiveForm("simplepass1234", "simplepass1234");
    await pom.submit();
    await pom.verifyErrorMsg("Your password is to weak");

    await fillCreateArchiveForm(
      "G0odPass125434534",
      "DifferentG0odPass125434534"
    );
    await pom.submit();
    await pom.verifyErrorMsg("Passwords are not identical");
  });

  test("create-archive-verify-required-fields", async () => {
    await pom.navigateTo();
    await pom.verifySubmitDisabled(true);

    await fillCreateArchiveForm("simplepass1234", "simplepass1234");
    await pom.verifySubmitDisabled(false);
    await pom.inputArchiveName("");
    await pom.verifySubmitDisabled(false);

    await pom.clickDisclaimerCheckbox();
    await pom.verifySubmitDisabled(true);
    await pom.clickDisclaimerCheckbox();
    await pom.verifySubmitDisabled(false);

    await pom.clickHeirsCheckbox();
    await pom.verifySubmitDisabled(true);
    await pom.clickHeirsCheckbox();
    await pom.verifySubmitDisabled(false);

    await pom.clickPasswordCheckbox();
    await pom.verifySubmitDisabled(true);
    await pom.clickPasswordCheckbox();
    await pom.verifySubmitDisabled(false);

    await pom.navigateTo();
    await pom.inputPassword("bla");
    await pom.inputPasswordVerify("foo");
    await pom.clickDisclaimerCheckbox();
    await pom.clickPasswordCheckbox();
    await pom.clickHeirsCheckbox();
    await pom.verifySubmitDisabled(true);
    await pom.setInputFile(INPUT_FILE);
    await pom.verifySubmitDisabled(false);
  });

  test("create-multiple-archives", async () => {
    await fillCreateArchiveForm();
    await pom.submit();
    await pom.verifyCreateArchiveSuccessful();

    await pom.startCreateAnotherArchive();
    await fillCreateArchiveForm();
    await pom.submit();
    await pom.verifyCreateArchiveSuccessful();
    await expect(mockBackend.settingsMock.archives.length).toBe(2);
  });
});
