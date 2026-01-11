import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import type { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import type { RootStackParamList } from "../../../app/navigation/RootStack";
import type { RootTabParamList } from "../../../app/navigation/RootTabs";
import { useDependencies } from "../../../app/providers/AppProvidersWithDI";
import { theme } from "../../../shared/theme";
import { getTokens } from "../../../storage/authStorage";
import { Buffer } from "buffer";
import { useProfileSummaryStore } from "../../state/profileSummaryStore";
import { useAuthModeStore } from "../../state/authModeStore";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { LinearGradient } from "expo-linear-gradient";

type ProfileNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, "profile">,
  NativeStackNavigationProp<RootStackParamList>
>;

const AVATAR_SIZE = 128;
const AVATAR_BORDER_COLOR = "#EC4899";
const AVATAR_GRADIENT_COLORS = ["#FDE68A", "#F59E0B"];

const getInitials = (name: string | null | undefined, fallback: string) => {
  const trimmed = name?.trim();
  if (!trimmed) return fallback;
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  const initials = `${first}${last}`.trim();
  return initials ? initials.toUpperCase() : fallback;
};

export function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProp>();
  const route = useRoute<RouteProp<RootTabParamList, "profile">>();
  const insets = useSafeAreaInsets();
  const { getCachedProfileUseCase, getProfileUseCase } = useDependencies();
  const profile = useProfileSummaryStore((state) => state.profile);
  const setProfile = useProfileSummaryStore((state) => state.setProfile);
  const authMode = useAuthModeStore((state) => state.mode);
  const isGuest = authMode === "guest";
  const authGuard = useAuthGuard();
  const [hasArticles, setHasArticles] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(12)).current;
  const toastHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const decodeJwtPayload = (token: string | null | undefined) => {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
      return payload;
    } catch {
      return null;
    }
  };

  const loadCachedProfile = useCallback(async () => {
    if (isGuest) {
      setProfile(null);
      setHasArticles(false);
      return;
    }
    const cached = await getCachedProfileUseCase.execute();
    if (cached) {
      setProfile(cached);
      setHasArticles(Boolean(cached.ownedThriftStore && (cached as any).articlesCount > 0));
      // If critical fields are missing (owned store or avatar), fetch a fresh profile to hydrate them.
      if (!cached.ownedThriftStore || !cached.avatarUrl) {
        try {
          const fresh = await getProfileUseCase.execute();
          setProfile(fresh);
          setHasArticles(Boolean(fresh.ownedThriftStore && (fresh as any).articlesCount > 0));
        } catch {
          // ignore network error; keep cached
        }
      }
      return;
    }

    // Fallback: derive minimal profile from JWT payload if cache is missing
    const { token } = await getTokens();
    const payload = decodeJwtPayload(token);
    if (payload?.sub && payload?.name && payload?.email) {
      const fallbackProfile = {
        id: String(payload.sub),
        name: payload.name,
        email: payload.email,
        avatarUrl: payload.avatarUrl,
        ownedThriftStore: payload.ownedThriftStore ?? null,
        bio: payload.bio,
        notifyNewStores: payload.notifyNewStores ?? false,
        notifyPromos: payload.notifyPromos ?? false
      };
      setProfile(fallbackProfile);
    } else {
      setProfile(null);
      setHasArticles(false);
    }
  }, [getCachedProfileUseCase, getProfileUseCase, isGuest, setProfile]);

  // Load once on mount
  useEffect(() => {
    loadCachedProfile();
  }, [loadCachedProfile]);

  // Refresh cached data when screen regains focus (no network call, just storage)
  useFocusEffect(
    useCallback(() => {
      loadCachedProfile();
      return () => {};
    }, [loadCachedProfile])
  );

  useEffect(() => {
    return () => {
      if (toastHideTimeoutRef.current) {
        clearTimeout(toastHideTimeoutRef.current);
        toastHideTimeoutRef.current = null;
      }
      if (toastClearTimeoutRef.current) {
        clearTimeout(toastClearTimeoutRef.current);
        toastClearTimeoutRef.current = null;
      }
    };
  }, []);

  const showToast = useCallback(
    (message: string) => {
      setToastMessage(message);
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true
      }).start();
      Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true
      }).start();

      if (toastHideTimeoutRef.current) {
        clearTimeout(toastHideTimeoutRef.current);
      }
      if (toastClearTimeoutRef.current) {
        clearTimeout(toastClearTimeoutRef.current);
      }
      toastHideTimeoutRef.current = setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true
        }).start();
        Animated.timing(toastTranslateY, {
          toValue: 12,
          duration: 180,
          useNativeDriver: true
        }).start();
        toastClearTimeoutRef.current = setTimeout(() => setToastMessage(null), 220);
      }, 2200);
    },
    [toastOpacity, toastTranslateY]
  );

  useEffect(() => {
    const message = route.params?.toast?.message;
    if (!message) return;
    showToast(message);
    navigation.setParams({ toast: undefined });
  }, [navigation, route.params?.toast?.message, showToast]);

  const displayUser = profile;
  const shouldShowAvatarPlaceholder = isGuest || !displayUser?.avatarUrl;
  const avatarInitials = getInitials(displayUser?.name, isGuest ? "V" : "GB");
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" />
      {toastMessage ? (
        <Animated.View
          pointerEvents="none"
          className="bg-[#111827] px-4 py-3 rounded-xl shadow-lg"
          style={[
            {
              position: "absolute",
              top: insets.top + 12,
              left: 16,
              right: 16,
              zIndex: 50,
              elevation: 6,
              opacity: toastOpacity,
              transform: [{ translateY: toastTranslateY }]
            }
          ]}
        >
          <Text className="text-white font-semibold text-center">{toastMessage}</Text>
        </Animated.View>
      ) : null}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <Text className="text-center text-lg font-bold text-[#1F2937]">Perfil</Text>
      </View>

      <ScrollView
        className="flex-1 bg-[#F3F4F6]"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="bg-white">
          <View className="flex-col items-center p-6 space-y-4">
            <View className="relative">
              {!shouldShowAvatarPlaceholder ? (
                <Image
                  source={{ uri: displayUser.avatarUrl }}
                  className="w-32 h-32 rounded-full"
                  style={{ borderWidth: 4, borderColor: AVATAR_BORDER_COLOR }}
                />
              ) : (
                <LinearGradient
                  colors={AVATAR_GRADIENT_COLORS}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    borderRadius: AVATAR_SIZE / 2,
                    borderWidth: 4,
                    borderColor: AVATAR_BORDER_COLOR,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text className="text-3xl font-bold" style={{ color: "#92400E", letterSpacing: 1 }}>
                    {avatarInitials}
                  </Text>
                </LinearGradient>
              )}
            </View>
            {isGuest ? (
              <View className="items-center mt-2">
                <Text className="text-2xl font-bold text-[#1F2937]">Visitante</Text>
                <Text className="text-gray-500 text-center">
                  Faça login para personalizar seu perfil.
                </Text>
                <View className="flex-row gap-3 mt-4">
                  <Pressable
                    className="px-4 py-2 rounded-lg bg-[#B55D05]"
                    onPress={() => navigation.navigate("login")}
                    testID="profile-guest-login-cta"
                  >
                    <Text className="text-white font-bold">Entrar</Text>
                  </Pressable>
                  <Pressable
                    className="px-4 py-2 rounded-lg bg-[#F3F4F6]"
                    onPress={() => navigation.navigate("signup")}
                    testID="profile-guest-signup-cta"
                  >
                    <Text className="text-[#374151] font-bold">Criar conta</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View className="items-center mt-2">
                <Text className="text-2xl font-bold text-[#1F2937]">{displayUser?.name ?? ""}</Text>
                <Text className="text-gray-500">{displayUser?.email ?? ""}</Text>
                {displayUser?.bio?.trim() ? (
                  <Text className="text-sm text-gray-500 mt-1 text-center">{displayUser.bio.trim()}</Text>
                ) : null}
              </View>
            )}
          </View>
        </View>

        <View className="px-4 py-4">
          <Text className="text-lg font-bold mb-2 text-[#1F2937]">Conta</Text>
          {isGuest ? (
            <View className="mb-3 rounded-lg border border-[#F59E0B]/30 bg-[#FEF3C7] px-3 py-2">
              <View className="flex-row items-start gap-2">
                <Ionicons name="lock-closed" size={16} color="#B45309" />
                <Text className="text-sm text-[#92400E] flex-1" style={{ flexShrink: 1 }}>
                  Faça login para editar seu perfil e acessar recursos da conta.
                </Text>
              </View>
            </View>
          ) : null}
          <View className="bg-white rounded-lg shadow-sm">
            <Pressable
              className="flex-row items-center justify-between p-4 border-b border-gray-200"
              onPress={() => {
                if (!authGuard("Faça login para editar seu perfil.")) return;
                if (!displayUser) return;
                navigation.navigate("editProfile", {
                  profile: {
                    ...displayUser,
                    bio: profile?.bio,
                    notifyNewStores: profile?.notifyNewStores ?? false,
                    notifyPromos: profile?.notifyPromos ?? false,
                    avatarUrl: profile?.avatarUrl
                  }
                });
              }}
              testID="profile-edit-button"
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-[#374151]">Editar Perfil</Text>
                {isGuest ? (
                  <View className="px-2 py-0.5 rounded-full bg-[#E5E7EB]">
                    <Text className="text-xs text-[#6B7280] font-semibold">Bloqueado</Text>
                  </View>
                ) : null}
              </View>
              <Ionicons name={isGuest ? "lock-closed" : "chevron-forward"} size={18} color={theme.colors.highlight} />
            </Pressable>
            <Pressable
              className="flex-row items-center justify-between p-4 border-t border-gray-200"
              onPress={() => navigation.navigate("contact")}
            >
              <Text className="text-[#374151]">Fale Conosco</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.highlight} />
            </Pressable>
          </View>
        </View>

        {(() => {
          const ownedStore = profile?.ownedThriftStore ?? null;
          if (ownedStore) {
            return (
              <View className="px-4 pt-0 pb-4">
                <Text className="text-lg font-bold mb-2 text-[#1F2937]">Brechó</Text>
                <View className="bg-white rounded-lg shadow-sm">
                  <Pressable
                    className="flex-row items-center justify-between p-4 border-b border-gray-200"
                    onPress={() =>
                      navigation.navigate("brechoForm", {
                        thriftStore: ownedStore
                      })
                    }
                  >
                    <Text className="text-[#374151]">Meu brechó</Text>
                    <Ionicons name="chevron-forward" size={18} color={theme.colors.highlight} />
                  </Pressable>
                  <Pressable
                    className="flex-row items-center justify-between p-4 border-b border-gray-200"
                    onPress={() => navigation.navigate("myContents", { storeId: ownedStore.id })}
                    testID="profile-create-content-button"
                  >
                    <Text className="text-[#374151]">Criar Conteúdo</Text>
                    <Ionicons name="chevron-forward" size={18} color={theme.colors.highlight} />
                  </Pressable>
                  {hasArticles ? (
                    <Pressable
                      className="flex-row items-center justify-between p-4"
                      onPress={() => navigation.navigate("myContents", { storeId: ownedStore.id })}
                    >
                      <Text className="text-[#374151]">Meus Conteúdos</Text>
                      <Ionicons name="chevron-forward" size={18} color={theme.colors.highlight} />
                    </Pressable>
                  ) : null}
                </View>
              </View>
            );
          }
          if (isGuest) return null;
          return (
            <View className="px-4 pt-0 pb-4">
              <Text className="text-lg font-bold mb-2 text-[#1F2937]">Brechó</Text>
              <View className="bg-white rounded-lg shadow-sm">
                <Pressable
                  className="flex-row items-center justify-between p-4"
                  onPress={() =>
                    navigation.navigate("brechoForm", {
                      thriftStore: null
                    })
                  }
                >
                  <Text className="text-[#374151]">Criar brechó</Text>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.highlight} />
                </Pressable>
              </View>
            </View>
          );
        })()}

      </ScrollView>
    </SafeAreaView>
  );
}
