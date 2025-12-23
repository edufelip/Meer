const { launchApp } = require("./utils/launchApp");

describe("Smoke", () => {
  beforeAll(async () => {
    await launchApp({ newInstance: true });
  });

  it("shows app root", async () => {
    await waitFor(element(by.id("app-root")))
      .toBeVisible()
      .withTimeout(20000);
  });
});
