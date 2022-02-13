import { Page } from "@playwright/test";

export const mockToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NDQzMzAzNTUsImV4cCI6NDgzMTUzOTk1NSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJlbWFpbCI6ImludGVncmF0aW9udGVzdEBleGFtcGxlLmNvbSIsIlJvbGUiOlsiTWFuYWdlciIsIlByb2plY3QgQWRtaW5pc3RyYXRvciJdfQ.fp6_IUx8plmuPHS0AZGzOeZR75IHb3wfNg0-2muwYLs";

export const mockLogin = async (page: Page) => {
  const context = await page.context();
  await context.addCookies([
    {
      name: "access.demo1234",
      value: mockToken,
      url: "http://localhost",
    },
    {
      name: "id.demo1234",
      value: mockToken,
      url: "http://localhost",
    },
  ]);
};
