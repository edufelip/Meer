import { useEffect, useState } from "react";
import { loadRemoteConfig, getStringConfig } from "./remoteConfig";

export function useRemoteWelcomeMessage() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    (async () => {
      await loadRemoteConfig();
      setMessage(getStringConfig("welcome_message"));
    })();
  }, []);

  return message;
}
