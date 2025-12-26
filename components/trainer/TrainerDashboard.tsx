import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import {
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Video,
  FileText,
  Award,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { User, Course } from '@/types';

export const TrainerDashboard: React.FC = () => {
  const { courses, users } = useApp();

  const dseUsers = users.filter((u: User) => u.role === 'dse');
  const totalEnrollments = courses.reduce((acc: number, c: Course) => acc + c.enrolled, 0);
  const avgRating =
    courses.reduce((acc: number, c: Course) => acc + c.rating, 0) / courses.length;

  const stats = [
    {
      label: 'My Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Students',
      value: dseUsers.length,
      icon: Users,
      color: 'bg-green-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Enrollments',
      value: totalEnrollments,
      icon: TrendingUp,
      color: 'bg-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      label: 'Avg. Rating',
      value: avgRating.toFixed(1),
      icon: Award,
      color: 'bg-yellow-500',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-2xl font-bold text-gray-800">Trainer Dashboard</Text>
          <Text className="text-gray-600">Manage your courses and track student progress</Text>
        </View>
        <TouchableOpacity className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center gap-2">
          <Plus color="white" size={20} />
          <Text className="text-white font-medium">Create Course</Text>
        </TouchableOpacity>
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

      {/* Charts Section Placeholder */}
      <View className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <Text className="text-lg font-bold text-gray-800 mb-6">Student Performance</Text>
        <View className="h-80 items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Text className="text-gray-400">Chart Component Placeholder</Text>
        </View>
      </View>

      {/* Recent Courses */}
      <View className="bg-white rounded-xl shadow-sm p-6">
        <Text className="text-lg font-bold text-gray-800 mb-6">My Courses</Text>
        <View className="gap-4">
          {courses.map((course: Course) => (
            <View
              key={course.id}
              className="flex-row items-center gap-4 p-4 border border-gray-100 rounded-lg"
            >
              <View className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center">
                <Video color="#6b7280" size={24} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-900">{course.title}</Text>
                <View className="flex-row items-center gap-4 mt-1">
                  <View className="flex-row items-center gap-1">
                    <Users size={14} color="#6b7280" />
                    <Text className="text-xs text-gray-500">{course.enrolled} students</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Award size={14} color="#eab308" />
                    <Text className="text-xs text-gray-500">{course.rating} rating</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity className="p-2 hover:bg-gray-100 rounded-lg">
                <FileText size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

