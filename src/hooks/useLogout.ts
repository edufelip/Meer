import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { clearAuthSession } from "../api/client";
import { navigationRef } from "../app/navigation/navigationRef";
import { resetAllStores } from "../presentation/state/resetAllStores";
import { triggerPushRegistration } from "../services/pushRegistration";
import { useDependencies } from "../app/providers/AppProvidersWithDI";
import { resolvePushEnvironment } from "../shared/pushEnvironment";
import { setGuestMode } from "../storage/authStorage";
import { useAuthModeStore } from "../presentation/state/authModeStore";

export function useLogout() {
  const queryClient = useQueryClient();
  const { unregisterPushTokenUseCase } = useDependencies();

  return useCallback(async () => {
    await clearAuthSession();
    await setGuestMode(false);
    useAuthModeStore.getState().setMode("none");
    triggerPushRegistration();
    resetAllStores();
    queryClient.clear();
    if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: "login" }] });
    }
  }, [queryClient, unregisterPushTokenUseCase]);
}
