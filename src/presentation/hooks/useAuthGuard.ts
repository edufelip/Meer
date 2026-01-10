import { useCallback } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../app/navigation/RootStack";
import { useAuthModeStore } from "../state/authModeStore";

export function useAuthGuard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mode = useAuthModeStore((state) => state.mode);

  return useCallback(
    (message: string) => {
      if (mode === "authenticated") return true;
      Alert.alert("Faça login", message, [
        { text: "Agora não", style: "cancel" },
        { text: "Entrar", onPress: () => navigation.navigate("login") }
      ]);
      return false;
    },
    [mode, navigation]
  );
}
