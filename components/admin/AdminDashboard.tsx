import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Activity,
  Clock,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { User, Course } from '@/types';

export const AdminDashboard: React.FC = () => {
  const { users, courses } = useApp();

  const dseUsers = users.filter((u: User) => u.role === 'dse');
  const totalEnrollments = courses.reduce((acc: number, c: Course) => acc + c.enrolled, 0);
  const avgCompletion = Math.round(
    courses.reduce((acc: number, c: Course) => acc + (c.progress || 0), 0) / courses.length
  );

  const stats = [
    {
      label: 'Total DSE Users',
      value: dseUsers.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up',
    },
    {
      label: 'Active Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'bg-green-500',
      change: '+3',
      trend: 'up',
    },
    {
      label: 'Total Enrollments',
      value: totalEnrollments,
      icon: TrendingUp,
      color: 'bg-red-600',
      change: '+25%',
      trend: 'up',
    },
    {
      label: 'Avg. Completion',
      value: `${avgCompletion}%`,
      icon: Award,
      color: 'bg-yellow-500',
      change: '+5%',
      trend: 'up',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <View className="mb-8">
        <Text className="text-2xl font-bold text-gray-800">Admin Dashboard</Text>
        <Text className="text-gray-600">Overview of system performance and learning metrics</Text>
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
                <View className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon color="white" size={24} />
                </View>
                <View className="flex-row items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp color="#16a34a" size={14} />
                  <Text className="text-xs font-medium text-green-600">{stat.change}</Text>
                </View>
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</Text>
              <Text className="text-sm text-gray-600">{stat.label}</Text>
            </View>
          );
        })}
      </View>

      {/* Charts Section Placeholder */}
      <View className="flex-row flex-wrap gap-6 mb-8">
        <View className="bg-white p-6 rounded-xl shadow-sm w-full lg:w-[65%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-bold text-gray-800">Learning Activity</Text>
            <View className="flex-row gap-2">
              {['Week', 'Month', 'Year'].map((period) => (
                <TouchableOpacity
                  key={period}
                  className="px-3 py-1 rounded-lg bg-gray-100"
                >
                  <Text className="text-sm text-gray-600">{period}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="h-80 items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
             <Text className="text-gray-400">Chart Component Placeholder</Text>
          </View>
        </View>

        <View className="bg-white p-6 rounded-xl shadow-sm w-full lg:w-[32%]">
          <Text className="text-lg font-bold text-gray-800 mb-6">Course Distribution</Text>
          <View className="h-80 items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
             <Text className="text-gray-400">Pie Chart Placeholder</Text>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View className="bg-white rounded-xl shadow-sm p-6">
        <Text className="text-lg font-bold text-gray-800 mb-6">Recent Activity</Text>
        <View className="gap-4">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <View key={i} className="flex-row items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                <Activity color="#6b7280" size={20} />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-900">New course &quot;Advanced Sales Techniques&quot; published</Text>
                <Text className="text-sm text-gray-500">2 hours ago • by Trainer Ahmad</Text>
              </View>
              <View className="flex-row items-center gap-1 text-gray-400">
                <Clock size={14} color="#9ca3af" />
                <Text className="text-xs text-gray-400">2h ago</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
