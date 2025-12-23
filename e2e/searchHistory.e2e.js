const { launchApp } = require("./utils/launchApp");
const { loginWithEmail } = require("./utils/auth");

describe("Search history flows", () => {
  beforeAll(async () => {
    await launchApp();
  });

  it("saves, removes, and clears recent searches", async () => {
    await loginWithEmail();

    await waitFor(element(by.id("home-search-button")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("home-search-button")).tap();

    await waitFor(element(by.id("search-input")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("search-input")).replaceText("Vestidos");
    await element(by.id("search-input")).typeText("\n");

    await element(by.label("Voltar")).tap();
    await element(by.id("home-search-button")).tap();

    await waitFor(element(by.text("Pesquisas Recentes")))
      .toBeVisible()
      .withTimeout(10000);
    await expect(element(by.text("Vestidos"))).toBeVisible();

    await element(by.id("search-recent-remove-Vestidos")).tap();
    await waitFor(element(by.text("Pesquisas Recentes")))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id("search-input")).replaceText("Acessórios");
    await element(by.id("search-input")).typeText("\n");
    await element(by.label("Voltar")).tap();
    await element(by.id("home-search-button")).tap();

    await waitFor(element(by.id("search-clear-history")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("search-clear-history")).tap();
  });
});
