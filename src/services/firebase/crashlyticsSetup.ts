import { useEffect } from "react";

// No-op placeholder to keep API stable without native crashlytics dependency in Expo Go.
export function useCrashlytics(_userId?: string) {
  useEffect(() => {
    // intentionally empty
  }, [_userId]);
}
