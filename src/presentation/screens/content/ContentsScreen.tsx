import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StatusBar,
  Text,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDependencies } from "../../../app/providers/AppProvidersWithDI";
import type { GuideContent } from "../../../domain/entities/GuideContent";
import { theme } from "../../../shared/theme";

const PAGE_SIZE = 10;
const GRID_GAP = 12;

function ContentGridCard({
  content,
  onPress
}: {
  content: GuideContent;
  onPress: () => void;
}) {
  const author = content.thriftStoreName?.trim() || "Guia Brechó";
  return (
    <Pressable
      className="bg-white rounded-xl shadow-sm overflow-hidden"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={content.title}
    >
      <Image source={{ uri: content.imageUrl }} className="w-full h-40" resizeMode="cover" />
      <View className="p-3">
        <Text className="text-sm font-semibold text-[#1F2937]" numberOfLines={2}>
          {content.title}
        </Text>
        <View className="flex-row items-center gap-2 mt-2">
          <View className="w-6 h-6 rounded-full bg-gray-200 items-center justify-center">
            <Ionicons name="person" size={14} color="#6B7280" />
          </View>
          <Text className="text-xs text-gray-500" numberOfLines={1}>
            {author}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function ContentsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { getGuideContentUseCase } = useDependencies();

  const [items, setItems] = useState<GuideContent[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      if (mode === "replace") {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const res = await getGuideContentUseCase.execute({ page: nextPage, pageSize: PAGE_SIZE });
        const newItems = res?.items ?? [];
        setHasNext(!!res?.hasNext);
        setPage(res?.page ?? nextPage);
        setItems((prev) => (mode === "append" ? [...prev, ...newItems] : newItems));
      } catch {
        if (mode === "replace") setItems([]);
        setError("Não foi possível carregar os conteúdos agora.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [getGuideContentUseCase]
  );

  useEffect(() => {
    void loadPage(0, "replace");
  }, [loadPage]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPage(0, "replace");
    setRefreshing(false);
  }, [loadPage]);

  const onEndReached = useCallback(() => {
    if (loading || loadingMore || !hasNext) return;
    void loadPage(page + 1, "append");
  }, [hasNext, loadPage, loading, loadingMore, page]);

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4F6]" edges={["left", "right", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <View className="bg-white/90 border-b border-gray-200" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between p-4">
          <Pressable
            className="w-8 h-8 items-center justify-center"
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={22} color={theme.colors.highlight} />
          </Pressable>
          <Text className="text-lg font-bold text-[#1F2937]">Conteúdo e Dicas</Text>
          <Pressable
            className="w-8 h-8 items-center justify-center"
            onPress={() => {
              // Intentionally no-op for now (UI only)
            }}
            accessibilityRole="button"
            accessibilityLabel="Buscar conteúdo"
          >
            <Ionicons name="search" size={22} color={theme.colors.highlight} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        renderItem={({ item, index }) => {
          const isLeft = index % 2 === 0;
          return (
            <View style={{ flex: 1, marginRight: isLeft ? GRID_GAP : 0, marginBottom: GRID_GAP }}>
              <ContentGridCard
                content={item}
                onPress={() => navigation.navigate("contentDetail" as never, { content: item } as never)}
              />
            </View>
          );
        }}
        ListFooterComponent={
          loadingMore ? (
            <View className="py-4 items-center">
              <ActivityIndicator color={theme.colors.highlight} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ marginTop: 8 }}>
              <View className="flex-row flex-wrap justify-between">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <View
                    key={idx}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                    style={{
                      width: "48%",
                      height: 220,
                      opacity: 0.7,
                      marginBottom: GRID_GAP
                    }}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View className="items-center justify-center py-12">
              <Text className="text-[#6B7280] text-center">
                {error ? error : "Nenhum conteúdo disponível no momento."}
              </Text>
              {error ? (
                <Pressable
                  className="mt-4 bg-[#B55D05] rounded-full px-5 py-2"
                  onPress={() => loadPage(0, "replace")}
                  accessibilityRole="button"
                  accessibilityLabel="Tentar novamente"
                >
                  <Text className="text-white font-bold">Tentar novamente</Text>
                </Pressable>
              ) : null}
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
