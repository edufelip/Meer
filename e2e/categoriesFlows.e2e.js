const { launchApp } = require("./utils/launchApp");
const { loginWithEmail } = require("./utils/auth");

describe("Categories flows", () => {
  beforeAll(async () => {
    await launchApp();
  });

  it("opens category and navigates to store list", async () => {
    await loginWithEmail();

    await waitFor(element(by.id("home-search-button")))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.text("Categorias")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.text("Categorias")).tap();

    await waitFor(element(by.id("category-card-cat-1")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("category-card-cat-1")).tap();

    await waitFor(element(by.text("Brechó de Casa")))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.id("category-store-store-1")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("category-stores-back")).tap();
  });
});
