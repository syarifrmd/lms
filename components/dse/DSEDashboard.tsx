import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import {
  BookOpen,
  Award,
  TrendingUp,
  Zap,
  Play,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Course } from '@/types';

export const DSEDashboard: React.FC = () => {
  const { currentUser, courses } = useApp();

  const stats = [
    {
      label: 'Courses In Progress',
      value: courses.filter((c) => c.progress && c.progress > 0 && c.progress < 100).length,
      icon: BookOpen,
      color: 'bg-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Completed',
      value: courses.filter((c) => c.isCompleted).length,
      icon: Award,
      color: 'bg-green-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Points',
      value: currentUser?.points || 0,
      icon: Zap,
      color: 'bg-yellow-500',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Current Level',
      value: currentUser?.level || 1,
      icon: TrendingUp,
      color: 'bg-purple-500',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <View className="mb-8">
        <Text className="text-2xl font-bold text-gray-800">Welcome back, {currentUser?.name}!</Text>
        <Text className="text-gray-600">Continue your learning journey</Text>
      </View>

      {/* Stats Grid */}
      <View className="flex-row flex-wrap gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <View
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm w-full md:w-[48%] lg:w-[23%]"
            >
              <View className="flex-row justify-between items-start mb-4">
                <View className={`p-3 rounded-lg ${stat.iconBg}`}>
                  <Icon size={24} color={stat.color.replace('bg-', '').replace('-500', '').replace('-600', '') === 'red' ? '#DC1F2E' : stat.color.replace('bg-', '').replace('-500', '')} />
                </View>
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</Text>
              <Text className="text-sm text-gray-600">{stat.label}</Text>
            </View>
          );
        })}
      </View>

      <View className="flex-row flex-wrap gap-8">
        {/* Continue Learning */}
        <View className="flex-1 min-w-[300px]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-bold text-gray-800">Continue Learning</Text>
            <TouchableOpacity>
              <Text className="text-red-600 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-6">
            {courses.slice(0, 3).map((course: Course) => (
              <View
                key={course.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
              >
                <View className="flex-row">
                  <Image
                    source={{ uri: course.thumbnail }}
                    className="w-32 h-32"
                    resizeMode="cover"
                  />
                  <View className="flex-1 p-4">
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="bg-blue-100 px-2 py-1 rounded text-xs font-medium text-blue-600 self-start">
                        <Text className="text-blue-600 text-xs">{course.category}</Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Award size={14} color="#eab308" />
                        <Text className="text-xs font-bold text-gray-700">{course.rating}</Text>
                      </View>
                    </View>
                    <Text className="font-bold text-gray-900 mb-2" numberOfLines={1}>{course.title}</Text>

                    <View className="mb-3">
                      <View className="flex-row justify-between text-xs text-gray-500 mb-1">
                        <Text className="text-xs text-gray-500">Progress</Text>
                        <Text className="text-xs text-gray-500">{course.progress}%</Text>
                      </View>
                      <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <View
                          className="h-full bg-red-600 rounded-full"
                          style={{ width: `${course.progress || 0}%` }}
                        />
                      </View>
                    </View>

                    <TouchableOpacity className="flex-row items-center gap-2">
                      <Play size={16} color="#DC1F2E" fill="#DC1F2E" />
                      <Text className="text-sm font-medium text-red-600">Continue</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Leaderboard Preview */}
        <View className="w-full lg:w-80">
          <View className="bg-white rounded-xl shadow-sm p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg font-bold text-gray-800">Top Performers</Text>
              <Award color="#eab308" size={20} />
            </View>

            <View className="gap-4">
              {[1, 2, 3, 4, 5].map((rank) => (
                <View key={rank} className="flex-row items-center gap-3">
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center font-bold ${
                      rank === 1
                        ? 'bg-yellow-100 text-yellow-600'
                        : rank === 2
                        ? 'bg-gray-100 text-gray-600'
                        : rank === 3
                        ? 'bg-orange-100 text-orange-600'
                        : 'text-gray-400'
                    }`}
                  >
                    <Text className={
                       rank === 1
                        ? 'text-yellow-600 font-bold'
                        : rank === 2
                        ? 'text-gray-600 font-bold'
                        : rank === 3
                        ? 'text-orange-600 font-bold'
                        : 'text-gray-400 font-bold'
                    }>{rank}</Text>
                  </View>
                  <Image
                    source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${rank}` }}
                    className="w-10 h-10 rounded-full bg-gray-50"
                  />
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900">User {rank}</Text>
                    <Text className="text-xs text-gray-500">{1000 - rank * 50} pts</Text>
                  </View>
                  {rank === 1 && <Award size={16} color="#eab308" />}
                </View>
              ))}
            </View>

            <TouchableOpacity className="w-full mt-6 py-2 border border-gray-200 rounded-lg items-center">
              <Text className="text-gray-600 font-medium">View Full Leaderboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

