import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProviders } from "./providers/AppProviders";
import { RootStack } from "./navigation/RootStack";
import { navigationRef } from "./navigation/navigationRef";
import { linking } from "./navigation/linking";
import { IS_LOCAL_API_BASE_URL } from "../network/config";

export function AppRoot() {
  return (
    <AppProviders>
      <GestureHandlerRootView style={{ flex: 1 }} testID="app-root">
        {IS_LOCAL_API_BASE_URL ? (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              paddingVertical: 6,
              paddingHorizontal: 12,
              backgroundColor: "#FDE68A",
              zIndex: 1000
            }}
          >
            <Text style={{ fontSize: 12, color: "#92400E", textAlign: "center", fontWeight: "700" }}>
              MODO TESTE: API LOCAL
            </Text>
          </View>
        ) : null}
        <NavigationContainer ref={navigationRef} linking={linking}>
          <RootStack />
        </NavigationContainer>
      </GestureHandlerRootView>
    </AppProviders>
  );
}
