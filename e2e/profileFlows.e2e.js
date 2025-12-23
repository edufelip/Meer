const { launchApp } = require("./utils/launchApp");
const { loginWithEmail } = require("./utils/auth");

describe("Profile flows", () => {
  beforeAll(async () => {
    await launchApp();
  });

  it("edits profile name and saves", async () => {
    await loginWithEmail();

    await waitFor(element(by.id("home-search-button")))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.text("Perfil")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.text("Perfil")).tap();

    await waitFor(element(by.id("profile-edit-button")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("profile-edit-button")).tap();

    await waitFor(element(by.id("edit-profile-name-input")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("edit-profile-name-input")).replaceText("Maria Teste");
    await element(by.id("edit-profile-save-button")).tap();

    await waitFor(element(by.text("Perfil")))
      .toBeVisible()
      .withTimeout(10000);
  });

  it("logs out from edit profile", async () => {
    await launchApp();
    await loginWithEmail();

    await waitFor(element(by.id("home-search-button")))
      .toBeVisible()
      .withTimeout(10000);
    await waitFor(element(by.id("profile-edit-button")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("profile-edit-button")).tap();

    await waitFor(element(by.id("edit-profile-logout-button")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("edit-profile-logout-button")).tap();

    await waitFor(element(by.text("Sair")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.text("Sair")).tap();

    await waitFor(element(by.id("login-submit-button")))
      .toBeVisible()
      .withTimeout(10000);
  });
});
