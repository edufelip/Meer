import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface FilterChipsProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}

export function FilterChips({ options, active, onChange }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      className="-mx-4 px-4"
    >
      <View className="flex-row space-x-2 pb-2">
        {options.map((opt) => {
          const isActive = opt === active;
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              className={`px-4 py-2 rounded-full ${
                isActive ? "bg-[#B55D05]" : "bg-gray-200"
              }`}
            >
              <Text className={`text-sm font-semibold ${isActive ? "text-white" : "text-[#374151]"}`}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
