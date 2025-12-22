describe("Smoke", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it("shows app root", async () => {
    await expect(element(by.id("app-root"))).toBeVisible();
  });
});
