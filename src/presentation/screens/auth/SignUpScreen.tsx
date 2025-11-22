import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../app/navigation/RootStack";
import { theme } from "../../../shared/theme";

export function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 24, alignItems: "center", flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-md items-center">
            <View className="flex-row items-center w-full mb-6">
              <Pressable
                className="p-2 rounded-full"
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel="Voltar"
              >
                <Ionicons name="arrow-back" size={22} color={theme.colors.highlight} />
              </Pressable>
              <View className="flex-1 items-center">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="storefront" size={28} color={theme.colors.accent} />
                  <Text className="text-xl font-bold text-[#374151]">Guia Brechó</Text>
                </View>
              </View>
              <View style={{ width: 38 }} />
            </View>

            <Text className="text-[32px] font-bold text-center text-[#374151] leading-tight">
              Crie sua conta
            </Text>
            <Text className="text-base text-center text-[#374151]/80 pt-1 pb-8">
              Comece a explorar achados incríveis!
            </Text>

            <View className="w-full space-y-4">
              <View>
                <Text className="text-base font-medium text-[#374151] pb-2">Nome Completo</Text>
                <TextInput
                  placeholder="Seu nome completo"
                  placeholderTextColor="#9CA3AF"
                  className="h-14 rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] px-4 text-base text-[#374151]"
                />
              </View>

              <View>
                <Text className="text-base font-medium text-[#374151] pb-2">E-mail</Text>
                <TextInput
                  placeholder="seuemail@dominio.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="h-14 rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] px-4 text-base text-[#374151]"
                />
              </View>

              <View>
                <Text className="text-base font-medium text-[#374151] pb-2">Senha</Text>
                <View className="relative w-full">
                  <TextInput
                    placeholder="Crie uma senha"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!passwordVisible}
                    className="h-14 rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] px-4 pr-12 text-base text-[#374151]"
                  />
                  <Pressable
                    className="absolute inset-y-0 right-0 px-4 flex-row items-center"
                    onPress={() => setPasswordVisible((v) => !v)}
                  >
                    <Ionicons
                      name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </Pressable>
                </View>
              </View>

              <View>
                <Text className="text-base font-medium text-[#374151] pb-2">Confirme sua Senha</Text>
                <View className="relative w-full">
                  <TextInput
                    placeholder="Repita a senha"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!confirmVisible}
                    className="h-14 rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] px-4 pr-12 text-base text-[#374151]"
                  />
                  <Pressable
                    className="absolute inset-y-0 right-0 px-4 flex-row items-center"
                    onPress={() => setConfirmVisible((v) => !v)}
                  >
                    <Ionicons
                      name={confirmVisible ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </Pressable>
                </View>
              </View>
            </View>

            <View className="w-full pt-6">
              <Pressable
                className="h-14 rounded-lg bg-[#B55D05] items-center justify-center"
                onPress={() => navigation.navigate("tabs")}
              >
                <Text className="text-base font-bold text-white">Cadastrar</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
