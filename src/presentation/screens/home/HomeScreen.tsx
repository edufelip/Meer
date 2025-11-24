import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StatusBar,
  View,
  Text,
  Pressable,
  Image,
  Animated,
  Easing
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SectionTitle } from "../../components/SectionTitle";
import { FeaturedThriftCarousel } from "../../components/FeaturedThriftCarousel";
import { NearbyMapCard } from "../../components/NearbyMapCard";
import { NearbyThriftListItem } from "../../components/NearbyThriftListItem";
import type { ThriftStore } from "../../../domain/entities/ThriftStore";
import type { GuideContent } from "../../../domain/entities/GuideContent";
import { useDependencies } from "../../../app/providers/AppProvidersWithDI";
import { theme } from "../../../shared/theme";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../app/navigation/RootStack";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { getFeaturedThriftStoresUseCase, getNearbyThriftStoresUseCase, getGuideContentUseCase } =
    useDependencies();
  const [featured, setFeatured] = useState<ThriftStore[]>([]);
  const [nearby, setNearby] = useState<ThriftStore[]>([]);
  const [allStores, setAllStores] = useState<ThriftStore[]>([]);
  const [guides, setGuides] = useState<GuideContent[]>([]);
  const [activeFilter, setActiveFilter] = useState("Próximo a mim");
  const [loading, setLoading] = useState(true);
  const [locationLabel, setLocationLabel] = useState("São Paulo, SP");
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [offline, setOffline] = useState(false);

  const shimmer = useRef(new Animated.Value(0)).current;

  const startShimmer = useCallback(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, [shimmer]);

  useEffect(() => {
    startShimmer();
  }, [startShimmer]);

  const shimmerStyle = {
    opacity: shimmer.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1, 0.5] })
  };

  const fetchData = useCallback(async () => {
    try {
      const [featuredStores, nearbyStores, guideItems] = await Promise.all([
        getFeaturedThriftStoresUseCase.execute(),
        getNearbyThriftStoresUseCase.execute(),
        getGuideContentUseCase.execute()
      ]);
      setFeatured(featuredStores);
      setNearby(nearbyStores);
      setAllStores([...featuredStores, ...nearbyStores]);
      setGuides(guideItems);
      const hoods = new Set<string>();
      [...featuredStores, ...nearbyStores].forEach((s) => {
        if (s.neighborhood) {
          hoods.add(s.neighborhood);
        }
      });
      setNeighborhoods(["Próximo a mim", ...Array.from(hoods)]);
      setLoading(false);
    } catch (e) {
      // Stay in loading shimmer if offline; offline banner will show
      setLoading(true);
    }
  }, [getFeaturedThriftStoresUseCase, getNearbyThriftStoresUseCase, getGuideContentUseCase]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = !!state.isConnected;
      setOffline(!connected);
      if (connected) {
        fetchData();
      }
    });

    fetchData();

    return () => {
      unsubscribe();
    };
  }, [fetchData]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted" || !active) return;
      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        if (!active) return;
        const [place] = await Location.reverseGeocodeAsync(position.coords);
        if (active && place) {
          const city = place.subregion ?? place.city ?? place.region ?? "Sua região";
          const country = place.isoCountryCode ?? "";
          setLocationLabel(country ? `${city}, ${country}` : city);
        }
      } catch {
        // keep default label
      }
    })();
    return () => {
      active = false;
    };
  }, []);

          </View>

          <View className="px-4 py-6 bg-[#F3F4F6]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-[#374151]">Conteúdos e Dicas</Text>
              <Text className="text-sm font-semibold text-[#B55D05]">Ver todos</Text>
            </View>
            {guides[0] ? (
              <View className="bg-white rounded-xl shadow-sm overflow-hidden">
                <View className="flex-row">
                  <Image source={{ uri: guides[0].imageUrl }} className="w-1/3 h-full aspect-[4/5]" />
                  <View className="p-4 flex-1">
                    <Text className="font-bold text-[#374151] mb-1" numberOfLines={2}>
                      {guides[0].title}
                    </Text>
                    <Text className="text-sm text-[#6B7280] mb-2" numberOfLines={2}>
                      {guides[0].description}
                    </Text>
                    <View className="bg-[#B55D05] self-start rounded-full px-2 py-1">
                      <Text className="text-xs font-semibold text-white uppercase">
                        {guides[0].categoryLabel}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
