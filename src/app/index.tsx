import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppProviders } from "./providers/AppProviders";
import { RootStack } from "./navigation/RootStack";
import { navigationRef } from "./navigation/navigationRef";

export function AppRoot() {
  return (
    <AppProviders>
      <NavigationContainer ref={navigationRef}>
        <RootStack />
      </NavigationContainer>
    </AppProviders>
  );
}
