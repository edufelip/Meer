import { initializeApp, getApps, getApp } from "firebase/app";
import { getRemoteConfig, fetchAndActivate, getValue } from "firebase/remote-config";

const firebaseConfig = {
  apiKey: "YOUR_WEB_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  appId: "YOUR_WEB_APP_ID"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const rc = getRemoteConfig(app);

rc.defaultConfig = {
  welcome_message: "Hello from default config"
};

rc.settings = {
  minimumFetchIntervalMillis: 60000
};

export async function loadRemoteConfig() {
  await fetchAndActivate(rc);
}

export function getStringConfig(key: string) {
  return getValue(rc, key).asString();
}
