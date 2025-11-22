import { FirebaseApp, initializeApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import perf from "@react-native-firebase/perf";
import crashlytics from "@react-native-firebase/crashlytics";
import messaging from "@react-native-firebase/messaging";

let app: FirebaseApp | undefined;

export function getFirebaseApp() {
  if (!app) {
    app = initializeApp();
  }
  return app;
}

export const firebaseAuth = auth;
export const firebasePerf = perf;
export const firebaseCrashlytics = crashlytics;
export const firebaseMessaging = messaging;
