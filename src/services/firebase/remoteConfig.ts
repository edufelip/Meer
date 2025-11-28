// eslint-disable-next-line import/no-unresolved
import { initializeApp, getApps, getApp } from "firebase/app";
// eslint-disable-next-line import/no-unresolved
import { getRemoteConfig, fetchAndActivate, getValue } from "firebase/remote-config";
import { firebaseConfig } from "./firebaseConfig";

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
