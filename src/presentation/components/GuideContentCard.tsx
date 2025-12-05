import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import type { GuideContent } from "../../domain/entities/GuideContent";

interface GuideContentCardProps {
  content: GuideContent;
  onPress?: () => void;
}

export function GuideContentCard({ content, onPress }: GuideContentCardProps) {
  const createdAtLabel = content.createdAt ? new Date(content.createdAt).toLocaleDateString() : undefined;
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
          <View className="flex-row items-center justify-between mt-auto pt-2">
            <Text className="text-xs text-[#4B5563]" numberOfLines={1}>
              {content.thriftStoreName ?? ""}
            </Text>
            {createdAtLabel ? (
              <Text className="text-xs text-[#9CA3AF]" numberOfLines={1}>
                {createdAtLabel}
              </Text>
            ) : (
              <View />
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
