import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Platform, StatusBar, Text, UIManager, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDependencies } from "../../../app/providers/AppProvidersWithDI";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../app/navigation/RootStack";
import type { Category } from "../../../domain/entities/Category";
import { CategoryCard, getCategoryDisplayName } from "../../components/CategoryCard";
import { theme } from "../../../shared/theme";

export function CategoriesScreen() {
  const { getCachedCategoriesUseCase } = useDependencies();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Enable layout animation on Android
  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const cached = await getCachedCategoriesUseCase.execute();
      if (isMounted && cached) {
        setCategories(cached);
      }
      if (isMounted) setLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, [getCachedCategoriesUseCase]);

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
      ) : categories.length === 0 ? (
        <View className="flex-1 items-center justify-center bg-[#F3F4F6] px-6">
          <Text className="text-sm text-[#6B7280] text-center">
            Nenhuma categoria em cache. Abra a tela inicial com conexão para atualizar.
          </Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 16 }}
          contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onPress={() =>
                navigation.navigate("categoryStores", {
                  categoryId: item.id,
                  title: getCategoryDisplayName(item.nameStringId)
                })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          className="bg-[#F3F4F6]"
        />
      )}
    </SafeAreaView>
  );
}
