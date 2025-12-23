const { launchApp } = require("./utils/launchApp");
const { loginWithEmail, waitForLoginScreen } = require("./utils/auth");

describe("Auth flows", () => {
  beforeEach(async () => {
    await launchApp({ delete: true });
  });

  it("logs in with email and reaches home", async () => {
    await loginWithEmail();

    await waitFor(element(by.id("home-search-button")))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id("home-search-button")).tap();
    await expect(element(by.id("search-input"))).toBeVisible();
    await element(by.label("Voltar")).tap();
    await expect(element(by.id("home-search-button"))).toBeVisible();
  });

  it("creates an account and lands on home", async () => {
    await waitForLoginScreen();
    await expect(element(by.id("login-signup-cta"))).toBeVisible();
    await element(by.id("login-signup-cta")).tap();

    await expect(element(by.id("signup-name-input"))).toBeVisible();
    await element(by.id("signup-name-input")).replaceText("Detox User");
    await element(by.id("signup-email-input")).replaceText("detox@meer.app");
    await element(by.id("signup-password-input")).replaceText("123456");
    await element(by.id("signup-confirm-input")).replaceText("123456");
    await element(by.id("signup-submit-button")).tap();

    await waitFor(element(by.id("home-search-button")))
      .toBeVisible()
      .withTimeout(10000);
  });

  it("opens a thrift detail from nearby list", async () => {
    await loginWithEmail();

    await waitFor(element(by.id("home-nearby-store-1")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id("home-nearby-store-1")).tap();

    await waitFor(element(by.text("Brechó Aurora")))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.label("Voltar")).tap();
    await expect(element(by.id("home-search-button"))).toBeVisible();
  });
});
