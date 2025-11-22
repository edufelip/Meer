/* eslint-disable import/no-unresolved */
import { useEffect } from "react";
import crashlytics from "@react-native-firebase/crashlytics";

export function useCrashlytics(userId?: string) {
  useEffect(() => {
    crashlytics().setCrashlyticsCollectionEnabled(true);
    if (userId) {
      crashlytics().setUserId(userId);
    }
  }, [userId]);
}
