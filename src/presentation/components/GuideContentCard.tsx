import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import type { GuideContent } from "../../domain/entities/GuideContent";

interface GuideContentCardProps {
  content: GuideContent;
  onPress?: () => void;
}

export function GuideContentCard({ content, onPress }: GuideContentCardProps) {
  return (
    <Pressable className="bg-white rounded-xl shadow-sm overflow-hidden" onPress={onPress}>
      <View className="flex-row">
        <Image source={{ uri: content.imageUrl }} className="w-1/3 h-full aspect-[4/5]" />
        <View className="p-4 flex-1">
          <Text className="font-bold text-[#374151] mb-1" numberOfLines={2}>
            {content.title}
          </Text>
          <Text className="text-sm text-[#6B7280] mb-2" numberOfLines={2}>
            {content.description}
          </Text>
          <View className="bg-[#B55D05] self-start rounded-full px-2 py-1">
            <Text className="text-xs font-semibold text-white uppercase">{content.categoryLabel}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
