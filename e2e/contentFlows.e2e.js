const { launchApp } = require("./utils/launchApp");
const { loginWithEmail } = require("./utils/auth");

describe("Content flows", () => {
  beforeAll(async () => {
    await launchApp();
  });

  it("edits an existing content item and saves", async () => {
    await loginWithEmail();

    await waitFor(element(by.id("home-search-button")))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.text("Perfil")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.text("Perfil")).tap();

    await waitFor(element(by.id("profile-create-content-button")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("profile-create-content-button")).tap();

    await waitFor(element(by.id("my-contents-item-content-1")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("my-contents-item-content-1")).tap();

    await waitFor(element(by.id("edit-content-title-input")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("edit-content-title-input")).replaceText("Atualizado pelo Detox");
    await element(by.id("edit-content-save-button")).tap();

    await waitFor(element(by.text("Meus Conteúdos")))
      .toBeVisible()
      .withTimeout(10000);
  });

  it("deletes a content item", async () => {
    await launchApp();
    await loginWithEmail();

    await waitFor(element(by.text("Perfil")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.text("Perfil")).tap();

    await waitFor(element(by.id("profile-create-content-button")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("profile-create-content-button")).tap();

    await waitFor(element(by.id("my-contents-item-content-1")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("my-contents-item-content-1")).tap();

    await waitFor(element(by.label("Excluir Conteúdo")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.label("Excluir Conteúdo")).tap();
    await element(by.text("Excluir")).tap();

    await waitFor(element(by.text("Meus Conteúdos")))
      .toBeVisible()
      .withTimeout(10000);
  });
});
