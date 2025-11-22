import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";

let app: FirebaseApp | undefined;

export function getFirebaseApp() {
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export const firebaseAuth = () => getAuth(getFirebaseApp());
export const googleAuthProvider = new GoogleAuthProvider();
