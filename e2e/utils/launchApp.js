const DEFAULT_SCHEME = "meer";
const DEV_MENU_COPY =
  "This is the developer menu. It gives you access to useful tools in your development builds.";

const buildDevClientUrls = () => {
  const serverUrl = process.env.DETOX_DEV_SERVER_URL || process.env.EXPO_DEV_CLIENT_SERVER_URL;
  if (!serverUrl) return [];
  const scheme = process.env.EXPO_DEV_CLIENT_SCHEME || DEFAULT_SCHEME;
  const slug = process.env.EXPO_DEV_CLIENT_SLUG || DEFAULT_SCHEME;
  const encodedUrl = encodeURIComponent(serverUrl);
  const urls = [`${scheme}://expo-development-client/?url=${encodedUrl}`];
  if (scheme !== `exp+${slug}`) {
    urls.push(`exp+${slug}://expo-development-client/?url=${encodedUrl}`);
  }
  return urls;
};

async function launchApp(options = {}) {
  const urls = buildDevClientUrls();
  const launchOptions = { newInstance: true, ...options };
  if (urls.length > 0) {
    launchOptions.url = urls[0];
  }
  await device.launchApp(launchOptions);
  for (const url of urls) {
    await device.openURL({ url });
  }
  await maybeDismissDevMenu();
}

async function maybeDismissDevMenu() {
  const dismissTestId = process.env.DEV_MENU_DISMISS_TESTID;
  if (dismissTestId) {
    try {
      await element(by.id(dismissTestId)).tap();
      return;
    } catch {
      // fall through to heuristic dismissal
    }
  }

  try {
    await waitFor(element(by.text(DEV_MENU_COPY)))
      .toBeVisible()
      .withTimeout(2000);
  } catch {
    return;
  }

  const buttons = ["Continue", "Close", "Dismiss", "Got it", "OK"];
  for (const label of buttons) {
    try {
      await element(by.text(label)).tap();
      return;
    } catch {
      // keep trying
    }
  }

  try {
    await element(by.text(DEV_MENU_COPY)).swipe("down", "fast");
  } catch {
    // ignore if swipe is not supported
  }

  try {
    await device.tap({ x: 20, y: 20 });
  } catch {
    // ignore if tap fallback fails
  }
}

module.exports = { launchApp };
