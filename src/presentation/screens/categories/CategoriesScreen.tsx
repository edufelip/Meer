import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Platform, RefreshControl, StatusBar, Text, UIManager, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDependencies } from "../../../app/providers/AppProvidersWithDI";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../app/navigation/RootStack";
import type { Category } from "../../../domain/entities/Category";
import { CategoryCard, getCategoryDisplayName } from "../../components/CategoryCard";
import { theme } from "../../../shared/theme";

export function CategoriesScreen() {
  const { getCachedCategoriesUseCase, getCategoriesUseCase } = useDependencies();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Enable layout animation on Android
  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const cached = await getCachedCategoriesUseCase.execute();
        if (isMountedRef.current && cached) {
          setCategories(cached);
        }
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    })();
  }, [getCachedCategoriesUseCase]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const fresh = await getCategoriesUseCase.execute();
      if (isMountedRef.current) {
        setCategories(fresh ?? []);
      }
    } finally {
      if (isMountedRef.current) {
        setRefreshing(false);
        setLoading(false);
      }
    }
  }, [getCategoriesUseCase]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" />
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <Text className="text-center text-lg font-bold text-[#1F2937]">Categorias</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center bg-[#F3F4F6]">
          <ActivityIndicator size="large" color={theme.colors.highlight} />
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 16 }}
          contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32, flexGrow: 1 }}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onPress={() =>
                navigation.navigate("categoryStores", {
                  categoryId: item.id,
                  title: getCategoryDisplayName(item.nameStringId)
                })
              }
              testID={`category-card-${item.id}`}
            />
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center bg-[#F3F4F6] px-6">
              <Text className="text-sm text-[#6B7280] text-center">
                Nenhuma categoria em cache. Abra a tela inicial com conexão para atualizar.
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.highlight}
              colors={[theme.colors.highlight]}
            />
          }
          showsVerticalScrollIndicator={false}
          className="bg-[#F3F4F6]"
        />
      )}
    </SafeAreaView>
  );
}
