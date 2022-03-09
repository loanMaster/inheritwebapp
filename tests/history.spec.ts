import { test } from "@playwright/test";
import { mockLogin } from "./mocks/mock.login";
import { MockBackend } from "./mocks/mock.backend";
import { HistoryPom } from "./poms/history.pom";

const formatDate = (date: number) => {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(date).toLocaleDateString("en", options as any);
};

test.describe("account", async () => {
  let pom: HistoryPom;
  let mockBackend: MockBackend;

  test.beforeEach(async ({ page }) => {
    pom = new HistoryPom(page);
    await mockLogin(page);
    mockBackend = new MockBackend();
    await mockBackend.initMocks(page);
  });

  test("show-empty-list", async () => {
    mockBackend.historyMock.history = [];
    await pom.navigateTo();
    await pom.verifyHistoryEventCount(0);
    await pom.verifyEmptyListShown();
  });

  test("display-history", async () => {
    await pom.navigateTo();
    await pom.verifyHistoryEventCount(mockBackend.historyMock.history.length);

    for (let i = 0; i < mockBackend.historyMock.history.length; i++) {
      const event = mockBackend.historyMock.history[i];
      await pom.verifyName(i, event.name);
      await pom.verifyDate(i, formatDate(event.date));
      if (event.fileId && event.previousFileId) {
        await pom.verifyAdditional(
          i,
          `${event.previousFileId} -> ${event.fileId}`
        );
      } else if (event.fileId || event.email || event.accessCode) {
        await pom.verifyAdditional(
          i,
          event.fileId || event.email || (event.accessCode as string)
        );
      }
    }
  });
});
