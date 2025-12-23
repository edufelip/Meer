const { launchApp } = require("./utils/launchApp");
const { loginWithEmail } = require("./utils/auth");

describe("Favorites flows", () => {
  beforeAll(async () => {
    await launchApp();
  });

  it("opens a favorite store detail from Favorites tab", async () => {
    await loginWithEmail();

    await waitFor(element(by.id("home-search-button")))
      .toBeVisible()
      .withTimeout(10000);
    await waitFor(element(by.text("Favoritos")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.text("Favoritos")).tap();

    await waitFor(element(by.id("favorites-item-store-1")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("favorites-item-store-1")).tap();

    await waitFor(element(by.text("Brechó Aurora")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.label("Voltar")).tap();
  });
});
