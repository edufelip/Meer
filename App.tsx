import "react-native-gesture-handler";
import "./global.css";
import React from "react";
import { LogBox } from "react-native";
import { getMessaging, setBackgroundMessageHandler } from "@react-native-firebase/messaging";
import { AppRoot } from "./src/app";

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

const messaging = getMessaging();

setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  console.log("FCM background message:", remoteMessage);
});

export default function App() {
  return <AppRoot />;
}
