/* eslint-disable import/no-unresolved */
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";

export function useFirebaseMessaging(onMessage: (msg: unknown) => void) {
  useEffect(() => {
    (async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
      }
    })();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      onMessage(remoteMessage);
    });

    return unsubscribe;
  }, [onMessage]);
}
