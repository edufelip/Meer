import React from "react";
import { Image, Text, View } from "react-native";
import type { ThriftStore } from "../../domain/entities/ThriftStore";

interface ThriftAvatarProps {
  store: ThriftStore;
}

export function ThriftAvatar({ store }: ThriftAvatarProps) {
  const isHighlighted = !!store.badgeLabel;
  return (
    <View className="flex flex-col items-center space-y-2 w-20">
      <View className="relative">
        <Image
          source={{ uri: store.imageUrl }}
          className={`w-16 h-16 rounded-full border-2 ${isHighlighted ? "border-pink-500" : "border-gray-300"}`}
        />
      </View>
      <Text className="text-xs font-medium text-[#374151] text-center truncate w-full">{store.name}</Text>
    </View>
  );
}
