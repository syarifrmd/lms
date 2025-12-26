import React from 'react';
import { View, Text } from 'react-native';

export default function PlaceholderPage() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-xl font-bold text-gray-800">Coming Soon</Text>
      <Text className="text-gray-600 mt-2">This page is under construction.</Text>
    </View>
  );
}

