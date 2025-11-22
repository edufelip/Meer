import { useEffect } from "react";

// No-op placeholder to avoid native messaging dependency in Expo Go.
export function useFirebaseMessaging(_onMessage: (msg: unknown) => void) {
  useEffect(() => {
    return () => {};
  }, [_onMessage]);
}
