import React, { PropsWithChildren, useEffect, useState } from "react";
import { DependenciesProvider, useDependencies } from "./AppProvidersWithDI";
import { useCrashlytics } from "../../services/firebase/crashlyticsSetup";
import { useFirebaseMessaging } from "../../services/firebase/messagingSetup";

// Add cross-cutting providers (theme, auth, localization, etc.) here.
export function AppProviders(props: PropsWithChildren) {
  const { children } = props;

  return (
    <DependenciesProvider>
      <FirebaseBootstrap />
      {children}
    </DependenciesProvider>
  );
}

function FirebaseBootstrap() {
  const { getProfileUseCase } = useDependencies();
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useCrashlytics(userId); // enable by default and attach user if available

  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfileUseCase.execute();
        if (profile?.id) setUserId(profile.id);
      } catch {
        // ignore; crashlytics still enabled
      }
    })();
  }, [getProfileUseCase]);

  useFirebaseMessaging(() => {
    // placeholder handler; hook initialized for permissions/token
  });

  return null;
}
