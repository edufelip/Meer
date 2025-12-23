async function waitForLoginScreen(timeout = 20000) {
  await waitFor(element(by.id("login-email-input")))
    .toBeVisible()
    .withTimeout(timeout);
}

async function loginWithEmail(email = "user@meer.app", password = "123456") {
  await waitForLoginScreen();
  await element(by.id("login-email-input")).replaceText(email);
  await element(by.id("login-password-input")).replaceText(password);
  await element(by.id("login-submit-button")).tap();
}

module.exports = { waitForLoginScreen, loginWithEmail };
