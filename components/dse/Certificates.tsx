import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { GraduationCap, Download, Share2, Award, Calendar } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Course } from '@/types';

export const Certificates: React.FC = () => {
  const { courses } = useApp();

  const completedCourses = courses.filter((c: Course) => c.isCompleted);

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-2xl font-bold text-gray-800">My Certificates</Text>
          <Text className="text-gray-600">View and download your earned certificates</Text>
        </View>
        <View className="flex-row items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
          <GraduationCap color="#DC1F2E" size={20} />
          <Text className="text-gray-700">{completedCourses.length} Certificates</Text>
        </View>
      </View>

      {/* Achievement Stats */}
      <View className="flex-row flex-wrap gap-4 mb-8">
        <View className="bg-red-600 rounded-xl p-6 w-full md:w-[31%]">
          <Award size={32} color="white" className="mb-3" />
          <Text className="text-3xl font-bold text-white mb-1">{completedCourses.length}</Text>
          <Text className="text-white/90">Total Certificates</Text>
        </View>

        <View className="bg-white rounded-xl p-6 shadow-sm w-full md:w-[31%]">
          <GraduationCap size={32} color="#FFC600" className="mb-3" />
          <Text className="text-3xl font-bold text-gray-800 mb-1">
            {completedCourses.length * 20}
          </Text>
          <Text className="text-gray-600">Learning Hours</Text>
        </View>

        <View className="bg-white rounded-xl p-6 shadow-sm w-full md:w-[31%]">
          <Calendar size={32} color="#16a34a" className="mb-3" />
          <Text className="text-3xl font-bold text-gray-800 mb-1">
            {new Date().getFullYear()}
          </Text>
          <Text className="text-gray-600">Year Achieved</Text>
        </View>
      </View>

      {/* Certificates List */}
      <View className="gap-6">
        {completedCourses.length > 0 ? (
          completedCourses.map((course: Course) => (
            <View
              key={course.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              <View className="flex-row border-l-4 border-l-red-600">
                <View className="p-6 flex-1">
                  <View className="flex-row justify-between items-start mb-4">
                    <View>
                      <Text className="text-xl font-bold text-gray-900 mb-1">{course.title}</Text>
                      <Text className="text-gray-500">Completed on {new Date().toLocaleDateString()}</Text>
                    </View>
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                      <Text className="text-green-700 font-medium text-xs">Verified</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-6 mb-6">
                    <View>
                      <Text className="text-xs text-gray-500 uppercase mb-1">Instructor</Text>
                      <Text className="font-medium text-gray-900">{course.trainer}</Text>
                    </View>
                    <View>
                      <Text className="text-xs text-gray-500 uppercase mb-1">Duration</Text>
                      <Text className="font-medium text-gray-900">{course.duration}</Text>
                    </View>
                    <View>
                      <Text className="text-xs text-gray-500 uppercase mb-1">Score</Text>
                      <Text className="font-medium text-gray-900">95%</Text>
                    </View>
                  </View>

                  <View className="flex-row gap-3 border-t border-gray-100 pt-4">
                    <TouchableOpacity className="flex-1 bg-red-600 py-2 rounded-lg flex-row items-center justify-center gap-2">
                      <Download size={18} color="white" />
                      <Text className="text-white font-medium">Download PDF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-gray-100 py-2 rounded-lg flex-row items-center justify-center gap-2">
                      <Share2 size={18} color="#374151" />
                      <Text className="text-gray-700 font-medium">Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Decorative Pattern */}
                <View className="w-24 bg-gray-50 border-l border-gray-100 items-center justify-center hidden md:flex">
                  <Award size={40} color="#e5e7eb" />
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className="bg-white rounded-xl p-12 items-center justify-center text-center border border-dashed border-gray-300">
            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Award size={32} color="#9ca3af" />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2">No Certificates Yet</Text>
            <Text className="text-gray-600 max-w-md text-center mb-6">
              Complete courses and pass the final assessments to earn your certificates.
            </Text>
            <TouchableOpacity className="bg-red-600 px-6 py-3 rounded-lg">
              <Text className="text-white font-bold">Browse Courses</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

