import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Trophy, Crown, TrendingUp } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { User } from '@/types';

export const Leaderboard: React.FC = () => {
  const { users, currentUser } = useApp();
  const leaderboard = [...users]
    .filter((u) => u.points && u.points > 0)
    .sort((a: User, b: User) => (b.points || 0) - (a.points || 0))
    .map((u, idx) => ({ ...u, rank: idx + 1 })) as (User & { rank: number })[];

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-2xl font-bold text-gray-800">Leaderboard</Text>
          <Text className="text-gray-600">See how you rank among other DSE professionals</Text>
        </View>
        <View className="flex-row items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
          <Trophy color="#DC1F2E" size={20} />
          <Text className="text-gray-700">Monthly Rankings</Text>
        </View>
      </View>

      {/* Top 3 Podium */}
      <View className="flex-row justify-center items-end gap-4 mb-12 h-64">
        {/* 2nd Place */}
        <View className="items-center w-1/3 max-w-[120px]">
          <View className="relative mb-4">
            <Image
              source={{ uri: leaderboard[1]?.avatar }}
              className="w-20 h-20 rounded-full border-4 border-gray-300"
            />
            <View className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-300 w-8 h-8 rounded-full items-center justify-center border-2 border-white">
              <Text className="font-bold text-white">2</Text>
            </View>
          </View>
          <View className="bg-white w-full p-4 rounded-t-xl shadow-sm items-center h-40 justify-end border-t-4 border-gray-300">
            <Text className="font-bold text-gray-900 text-center mb-1" numberOfLines={1}>{leaderboard[1]?.name}</Text>
            <Text className="text-gray-500 text-xs mb-2">{leaderboard[1]?.department}</Text>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="font-bold text-gray-700">{leaderboard[1]?.points} pts</Text>
            </View>
          </View>
        </View>

        {/* 1st Place */}
        <View className="items-center w-1/3 max-w-[140px] z-10">
          <View className="relative mb-4">
            <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400" size={32} color="#FFC600" fill="#FFC600" />
            <Image
              source={{ uri: leaderboard[0]?.avatar }}
              className="w-24 h-24 rounded-full border-4 border-yellow-400"
            />
            <View className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 w-8 h-8 rounded-full items-center justify-center border-2 border-white">
              <Text className="font-bold text-white">1</Text>
            </View>
          </View>
          <View className="bg-white w-full p-4 rounded-t-xl shadow-lg items-center h-48 justify-end border-t-4 border-yellow-400">
            <Text className="font-bold text-gray-900 text-lg text-center mb-1" numberOfLines={1}>{leaderboard[0]?.name}</Text>
            <Text className="text-gray-500 text-xs mb-2">{leaderboard[0]?.department}</Text>
            <View className="bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
              <Text className="font-bold text-yellow-700">{leaderboard[0]?.points} pts</Text>
            </View>
          </View>
        </View>

        {/* 3rd Place */}
        <View className="items-center w-1/3 max-w-[120px]">
          <View className="relative mb-4">
            <Image
              source={{ uri: leaderboard[2]?.avatar }}
              className="w-20 h-20 rounded-full border-4 border-orange-400"
            />
            <View className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-400 w-8 h-8 rounded-full items-center justify-center border-2 border-white">
              <Text className="font-bold text-white">3</Text>
            </View>
          </View>
          <View className="bg-white w-full p-4 rounded-t-xl shadow-sm items-center h-32 justify-end border-t-4 border-orange-400">
            <Text className="font-bold text-gray-900 text-center mb-1" numberOfLines={1}>{leaderboard[2]?.name}</Text>
            <Text className="text-gray-500 text-xs mb-2">{leaderboard[2]?.department}</Text>
            <View className="bg-orange-50 px-3 py-1 rounded-full">
              <Text className="font-bold text-orange-700">{leaderboard[2]?.points} pts</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Full List */}
      <View className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <View className="p-4 border-b border-gray-100 flex-row justify-between items-center bg-gray-50">
          <Text className="font-bold text-gray-700 w-12 text-center">Rank</Text>
          <Text className="font-bold text-gray-700 flex-1 ml-4">User</Text>
          <Text className="font-bold text-gray-700 w-24 text-right">Points</Text>
          <Text className="font-bold text-gray-700 w-16 text-center">Level</Text>
        </View>

        {leaderboard.slice(3).map((user: User & { rank: number }, index: number) => (
          <View
            key={user.id}
            className={`flex-row items-center p-4 border-b border-gray-50 ${
              user.id === currentUser?.id ? 'bg-red-50' : 'bg-white'
            }`}
          >
            <View className="w-12 items-center justify-center">
              <Text className="font-bold text-gray-500">{index + 4}</Text>
            </View>

            <View className="flex-1 flex-row items-center gap-3 ml-4">
              <Image
                source={{ uri: user.avatar }}
                className="w-10 h-10 rounded-full bg-gray-100"
              />
              <View>
                <View className="flex-row items-center gap-2">
                  <Text className={`font-bold ${
                    user.id === currentUser?.id ? 'text-red-900' : 'text-gray-900'
                  }`}>
                    {user.name}
                  </Text>
                  {user.id === currentUser?.id && (
                    <View className="bg-red-100 px-2 py-0.5 rounded">
                      <Text className="text-[10px] font-bold text-red-600">YOU</Text>
                    </View>
                  )}
                </View>
                <Text className="text-xs text-gray-500">{user.department}</Text>
              </View>
            </View>

            <View className="w-24 items-end">
              <Text className="font-bold text-gray-900">{user.points}</Text>
              <View className="flex-row items-center gap-1">
                <TrendingUp size={12} color="#16a34a" />
                <Text className="text-xs text-green-600">+{Math.floor(Math.random() * 50)}</Text>
              </View>
            </View>

            <View className="w-16 items-center">
              <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                <Text className="font-bold text-gray-700">{user.level}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

