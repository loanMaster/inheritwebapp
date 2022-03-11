import { Page, Request, Route } from "@playwright/test";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Archive } from "@/entities/archive";
import { Settings } from "@/entities/settings";
import { parseFormData } from "./form-data.parser";
import { EventHistory } from "@/entities/history";

export const TEST_FILE = {
  hash: "QmTqWdh8N9so14UBdZbBxBsbfh6xPmfyJgekRBgJ3eSrUR",
  iv: "666dbf92-635a-47fd-b64b-15da65950369",
  password: "supertestpassword",
};

export const MOCK_FILE_SERVER_LOCATION = "https://gateway.pinata.cloud/ipfs/";

export class MockBackend {
  settingsMock: Settings = {
    email: "john.due@example.com",
    intervalReminder: 1440,
    archives: [],
    dueDate: Date.now(),
    triggerOnce: false,
    isReminder: false,
    contactAttempts: [],
    dead: false,
    justCreated: false,
  };
  fileMocks: {
    hash: string;
    file: string | undefined;
    content: string | undefined;
  }[] = [
    {
      hash: TEST_FILE.hash,
      file: __dirname + "/../assets/encrypted-archive",
      content: undefined,
    },
  ];
  historyMock: EventHistory = {
    hasMore: false,
    history: [
      {
        name: "Archive deleted",
        fileId: "bfc893e9-a50d-4dce-a4a9-a5d641e557b4",
        date: 1646552344468,
      },
      { name: "Resurrection", date: 1646551980433 },
      {
        name: 'Deactivated "alive" switch',
        date: 1646551977119,
      },
      {
        name: "Archive content replaced",
        fileId: "QmQ714DRsvmDp9vg4gtXYuuzC1DnogGEHgAWdcR7Xc7bgn",
        previousFileId: "693db0db-2306-43b6-9f71-45feee47c668",
        date: 1646551756540,
      },
      {
        name: "Access code changed",
        fileId: "QmY5ojdvhxjMQuVt3oPBp9K5Myn22x1wtrh5GPfjENN8cF",
        date: 1646551686651,
      },
      {
        name: "Health check sent",
        email: "member@example.com",
        date: 1646551137115,
      },
      {
        name: "Health check triggered",
        accessCode: "e0fe0c5e-4365-46f1-a164-763a34c6efa1",
        date: 1646551085998,
      },
      {
        name: "Archive created",
        fileId: "693db0db-2306-43b6-9f71-45feee47c668",
        date: 1646551043357,
      },
      {
        name: "First access to dashboard",
        date: 1645781849850,
      },
    ],
  };

  async initMocks(page: Page) {
    await this.initSettingsMocks(page);
    await this.initFileMocks(page);
    await this.initHealthCheckTriggerMock(page);
    await this.initArchiveMocks(page);
    await this.initHistoryMocks(page);
  }

  private async initFileMocks(page: Page) {
    await page.route(`${MOCK_FILE_SERVER_LOCATION}*`, (route, request) => {
      for (let idx = 0; idx < this.fileMocks.length; idx++) {
        const ipsfFileMock = this.fileMocks[idx];
        if (request.url().endsWith(ipsfFileMock.hash)) {
          route.fulfill({
            status: 200,
            body:
              ipsfFileMock.content ||
              fs.readFileSync(ipsfFileMock.file as string),
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
    });
  }

  private async initSettingsMocks(page: Page) {
    await page.route(
      `${process.env.WEBSITE_PATH}/api/settings`,
      (route: Route, request: Request) => {
        if (request.method() === "GET") {
          route.fulfill({
            status: 200,
            body: JSON.stringify(this.settingsMock),
            contentType: "application/json",
          });
        } else if (request.method() === "PUT") {
          const body = JSON.parse(request.postData() as string);
          this.settingsMock = {
            ...this.settingsMock,
            ...body,
          };
          route.fulfill({
            status: 200,
            body: JSON.stringify(this.settingsMock),
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
            archive: this.settingsMock.dead ? archive : undefined,
          };
          route.fulfill({
            status: 200,
            body: JSON.stringify(response),
            contentType: "application/json",
          });
        } else {
          route.fulfill({
            status: 400,
            body: JSON.stringify({ error: "Code incorrect" }),
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
            const createArchiveData = parseFormData(
              request.headers()["content-type"] as string,
              request.postData() as string
            );
            const fileId = uuidv4();
            this.fileMocks.push({
              content: createArchiveData.file?.content,
              hash: fileId,
              file: undefined,
            });
            const newArchive = {
              id: uuidv4(),
              archiveName: createArchiveData.values.archiveName,
              accessCode: uuidv4(),
              iv: createArchiveData.values.iv,
              file: {
                ipfs: !!createArchiveData.values.ipfs,
                size: createArchiveData.file?.size || 0,
                id: fileId,
                location: MOCK_FILE_SERVER_LOCATION + fileId,
              },
              creationDate: Date.now(),
              lastModified: Date.now(),
            };
            this.settingsMock.archives.push(newArchive);
            route.fulfill({
              status: 200,
              body: JSON.stringify({
                settings: this.settingsMock,
                archiveId: newArchive.id,
              }),
              contentType: "application/json",
            });
            break;
          case "PUT":
            const formData = parseFormData(
              request.headers()["content-type"] as string,
              request.postData() as string
            );
            const archive = this.settingsMock.archives.find(
              (a) => a.id === formData.values.archiveId
            ) as Archive;
            archive.accessCode = formData.values.accessCode;
            archive.archiveName = formData.values.archiveName;
            archive.iv = formData.values.iv;
            route.fulfill({
              status: 200,
              body: JSON.stringify({
                settings: this.settingsMock,
                archiveId: archive.id,
              }),
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
          contentType: "application/json",
        });
      }
    );
  }

  private async initHistoryMocks(page: Page) {
    await page.route(
      `${process.env.WEBSITE_PATH}/api/history`,
      async (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify(this.historyMock),
          contentType: "application/json",
        });
      }
    );
  }
}
