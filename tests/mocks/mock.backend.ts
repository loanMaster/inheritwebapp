import { Page, Request, Route } from "@playwright/test";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Archive } from "@/entities/archive";
import { Settings } from "@/entities/settings";

export const TEST_FILE = {
  hash: "QmTqWdh8N9so14UBdZbBxBsbfh6xPmfyJgekRBgJ3eSrUR",
  iv: "666dbf92-635a-47fd-b64b-15da65950369",
  password: "supertestpassword",
};

export class MockBackend {
  settingsMock: Settings = {
    email: "john.due@example.com",
    intervalReminder: 3,
    archives: [],
    dueDate: Date.now(),
    triggerOnce: false,
    isReminder: false,
    contactAttempts: [],
    dead: false,
  };
  ipfsMocks = [
    {
      hash: TEST_FILE.hash,
      file: __dirname + "/../assets/encrypted-archive",
    },
  ];

  async initMocks(page: Page) {
    await this.initSettingsMocks(page);
    await this.initIpfsMocks(page);
    await this.initHealthCheckTriggerMock(page);
    await this.initArchiveMocks(page);
  }

  private async initIpfsMocks(page: Page) {
    await page.route(
      `https://gateway.pinata.cloud/ipfs/*`,
      (route, request) => {
        for (let idx = 0; idx < this.ipfsMocks.length; idx++) {
          const ipsfFileMock = this.ipfsMocks[idx];
          if (request.url().endsWith(ipsfFileMock.hash)) {
            route.fulfill({
              status: 200,
              body: fs.readFileSync(ipsfFileMock.file),
              headers: { "access-control-allow-origin": "*" },
              contentType: "text/plain",
            });
            return;
          }
        }
        route.fulfill({
          status: 404,
          body: JSON.stringify({ error: "Not found" }),
          headers: { "access-control-allow-origin": "*" },
          contentType: "text/plain",
        });
      }
    );
  }

  private async initSettingsMocks(page: Page) {
    await page.route(
      `${process.env.WEBSITE_PATH}/api/settings`,
      (route: Route, request: Request) => {
        if (request.method() === "GET") {
          route.fulfill({
            status: 200,
            body: JSON.stringify(this.settingsMock),
            headers: { "access-control-allow-origin": "*" },
            contentType: "application/json",
          });
        } else if (request.method() === "PUT") {
          const body = JSON.parse(request.postData() as string);
          this.settingsMock = {
            ...this.settingsMock,
            ...body.settings,
          };
          route.fulfill({
            status: 200,
            body: JSON.stringify(this.settingsMock),
            headers: { "access-control-allow-origin": "*" },
            contentType: "application/json",
          });
        }
      }
    );
  }

  private async initHealthCheckTriggerMock(page: Page) {
    await page.route(
      `${process.env.WEBSITE_PATH}/api/settings/health-check-trigger/*`,
      (route, request) => {
        const archives = this.settingsMock.archives.filter((a) =>
          request.url().endsWith(a.accessCode)
        );
        if (archives.length > 0) {
          const archive = archives[0];
          const response = {
            email: this.settingsMock.email,
            alreadyTriggered: false,
            intervalReminder: this.settingsMock.intervalReminder,
            contactAttempts: this.settingsMock.contactAttempts,
            dueDate: this.settingsMock.dueDate,
            dead: this.settingsMock.dead,
            archive,
          };
          route.fulfill({
            status: 200,
            body: JSON.stringify(response),
            headers: { "access-control-allow-origin": "*" },
            contentType: "application/json",
          });
        } else {
          route.fulfill({
            status: 400,
            body: JSON.stringify({ error: "Code incorrect" }),
            headers: { "access-control-allow-origin": "*" },
            contentType: "application/json",
          });
        }
      }
    );
  }

  private async initArchiveMocks(page: Page) {
    await page.route(
      `${process.env.WEBSITE_PATH}/api/archives`,
      async (route, request) => {
        switch (request.method()) {
          case "POST":
            const mockArchive: Archive = {
              iv: "1",
              ipfsHash: "2",
              id: uuidv4(),
              creationDate: Date.now(),
              size: 123,
              accessCode: uuidv4(),
            };
            this.settingsMock.archives.push(mockArchive);
            route.fulfill({
              status: 200,
              body: JSON.stringify({
                entry: this.settingsMock,
                archiveId: mockArchive.id,
              }),
              headers: { "access-control-allow-origin": "*" },
              contentType: "application/json",
            });
            break;
          case "PUT":
            const update: { archive: Archive } = request.postDataJSON();
            const archive = this.settingsMock.archives.find(
              (archive: Archive) => archive.id === update.archive.id
            ) as Archive;
            archive.archiveName = update.archive.archiveName;
            route.fulfill({
              status: 200,
              body: JSON.stringify(this.settingsMock),
              headers: { "access-control-allow-origin": "*" },
              contentType: "application/json",
            });
            break;
        }
      }
    );

    await page.route(
      `${process.env.WEBSITE_PATH}/api/archives/*`,
      async (route, request) => {
        const archiveId = request
          .url()
          .substring(request.url().lastIndexOf("/") + 1);
        this.settingsMock.archives = this.settingsMock.archives.filter(
          (a: Archive) => a.id !== archiveId
        );
        route.fulfill({
          status: 200,
          body: JSON.stringify(this.settingsMock),
          headers: { "access-control-allow-origin": "*" },
          contentType: "application/json",
        });
      }
    );
  }
}
