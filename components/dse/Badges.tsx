import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Award, Lock } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/types';

export const Badges: React.FC = () => {
  const { badges } = useApp();

  // Simulate earned badges (first 2 badges are earned)
  const earnedBadges = badges.slice(0, 2).map((b) => ({
    ...b,
    earnedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  const lockedBadges = badges.slice(2);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500';
      case 'rare':
        return 'bg-blue-500';
      case 'epic':
        return 'bg-purple-500';
      case 'legendary':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-400';
      case 'rare':
        return 'border-blue-400';
      case 'epic':
        return 'border-purple-400';
      case 'legendary':
        return 'border-yellow-400';
      default:
        return 'border-gray-400';
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-2xl font-bold text-gray-800">My Badges</Text>
          <Text className="text-gray-600">Track your achievements and milestones</Text>
        </View>
        <View className="flex-row items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
          <Award color="#DC1F2E" size={20} />
          <Text className="text-gray-700">{earnedBadges.length} Earned</Text>
        </View>
      </View>

      {/* Earned Badges */}
      <View className="mb-10">
        <Text className="text-lg font-bold text-gray-800 mb-4">Earned Badges</Text>
        <View className="flex-row flex-wrap gap-4">
          {earnedBadges.map((badge) => (
            <View
              key={badge.id}
              className={`bg-white rounded-xl p-4 shadow-sm border-2 w-full md:w-[48%] lg:w-[31%] ${getRarityBorder(badge.rarity)}`}
            >
              <View className="flex-row gap-4">
                <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center">
                  <Image
                    source={{ uri: badge.icon }}
                    className="w-12 h-12"
                    resizeMode="contain"
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <Text className="font-bold text-gray-900 text-lg">{badge.name}</Text>
                    <View className={`px-2 py-0.5 rounded text-xs ${getRarityColor(badge.rarity)}`}>
                      <Text className="text-white text-[10px] uppercase font-bold">{badge.rarity}</Text>
                    </View>
                  </View>
                  <Text className="text-gray-600 text-sm mt-1">{badge.description}</Text>
                  <Text className="text-xs text-gray-400 mt-2">
                    Earned on {new Date(badge.earnedAt!).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Locked Badges */}
      <View>
        <Text className="text-lg font-bold text-gray-800 mb-4">Available Badges</Text>
        <View className="flex-row flex-wrap gap-4">
          {lockedBadges.map((badge: Badge) => (
            <View
              key={badge.id}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200 w-full md:w-[48%] lg:w-[31%] opacity-70"
            >
              <View className="flex-row gap-4">
                <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center relative">
                  <Image
                    source={{ uri: badge.icon }}
                    className="w-12 h-12 opacity-50 grayscale"
                    resizeMode="contain"
                  />
                  <View className="absolute inset-0 items-center justify-center bg-black/10 rounded-full">
                    <Lock size={20} color="#4b5563" />
                  </View>
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <Text className="font-bold text-gray-600 text-lg">{badge.name}</Text>
                    <View className="bg-gray-200 px-2 py-0.5 rounded">
                      <Text className="text-gray-500 text-[10px] uppercase font-bold">{badge.rarity}</Text>
                    </View>
                  </View>
                  <Text className="text-gray-500 text-sm mt-1">{badge.description}</Text>
                  <View className="mt-3 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <View className="bg-gray-400 h-full w-[30%]" />
                  </View>
                  <Text className="text-xs text-gray-400 mt-1">Progress: 30%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

