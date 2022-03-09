import { Page } from "@playwright/test";

export const mockToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NDQzMzAzNTUsImV4cCI6NDgzMTUzOTk1NSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoiZHVtbXlAbXktbGVnYWN5LnJvY2tzIiwiY3JlYXRlZEF0IjoiMjAyMC0wOS0xMVQyMTo1Mzo1MS4zNjFaIiwiR2l2ZW5OYW1lIjoiSm9obm55IiwiaXNDb25maXJtZWQiOnRydWUsIlN1cm5hbWUiOiJSb2NrZXQiLCJlbWFpbCI6Im1lbWJlckBleGFtcGxlLmNvbSIsIlJvbGUiOlsiTWFuYWdlciIsIlByb2plY3QgQWRtaW5pc3RyYXRvciJdfQ.X9EGehlhb3wEHTD6jNw7qno8Bx_Gp1ybb_T_cVmnQuw";

export const mockTokenEmailNotConfirmed =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NDQzMzAzNTUsImV4cCI6NDgzMTUzOTk1NSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJlbWFpbCI6ImludGVncmF0aW9udGVzdEBleGFtcGxlLmNvbSIsIlJvbGUiOlsiTWFuYWdlciIsIlByb2plY3QgQWRtaW5pc3RyYXRvciJdfQ.w0reA6ZSGhB-8PXDXGjnxtEPYgalKjwwgemjo4FTe0U";

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

export const mockLoginEmailNotConfirmed = async (page: Page) => {
  const context = await page.context();
  await context.addCookies([
    {
      name: "access.demo1234",
      value: mockToken,
      url: "http://localhost",
    },
    {
      name: "id.demo1234",
      value: mockTokenEmailNotConfirmed,
      url: "http://localhost",
    },
  ]);
};
