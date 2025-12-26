import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import {
  BookOpen,
  Play,
  CircleCheck,
  Clock,
  Star,
  ArrowLeft,
  FileText,
  Users,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Course, Module } from '@/types';
import { QuizComponent } from '../shared';

export const Learning: React.FC = () => {
  const { courses, modules, updateModuleProgress, updateCourseProgress } = useApp();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  const filteredCourses = courses.filter((course: Course) => {
    if (filter === 'in-progress') {
      return course.progress && course.progress > 0 && course.progress < 100;
    }
    if (filter === 'completed') {
      return course.isCompleted;
    }
    return true;
  });

  const handleModuleComplete = (moduleId: string, courseId: string) => {
    updateModuleProgress(moduleId, true);
    updateCourseProgress(courseId);
    setShowQuiz(true);
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    setSelectedModule(null);
  };

  if (showQuiz && selectedModule) {
    return (
      <QuizComponent
        moduleId={selectedModule.id}
        onComplete={handleQuizComplete}
        onBack={() => setShowQuiz(false)}
      />
    );
  }

  if (selectedCourse) {
    const courseModules = modules.filter((m: Module) => m.courseId === selectedCourse.id).sort((a: Module, b: Module) => a.order - b.order);

    return (
      <View className="flex-1 bg-gray-50">
        {/* Course Header */}
        <View className="bg-white border-b border-gray-200">
          <View className="p-4">
            <TouchableOpacity
              onPress={() => setSelectedCourse(null)}
              className="flex-row items-center gap-2 mb-4"
            >
              <ArrowLeft size={20} color="#374151" />
              <Text className="text-gray-600 font-medium">Back to Courses</Text>
            </TouchableOpacity>

            <View className="flex-row gap-4">
              <Image
                source={{ uri: selectedCourse.thumbnail }}
                className="w-24 h-24 rounded-lg bg-gray-200"
              />
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900 mb-2">{selectedCourse.title}</Text>
                <View className="flex-row flex-wrap gap-4 text-sm text-gray-600">
                  <View className="flex-row items-center gap-1">
                    <Clock size={14} color="#4b5563" />
                    <Text className="text-gray-600 text-xs">{selectedCourse.duration}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <BookOpen size={14} color="#4b5563" />
                    <Text className="text-gray-600 text-xs">{selectedCourse.modules} Modules</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Star size={14} color="#eab308" fill="#eab308" />
                    <Text className="text-gray-600 text-xs">{selectedCourse.rating}</Text>
                  </View>
                </View>
                <View className="mt-3">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-xs text-gray-500">Course Progress</Text>
                    <Text className="text-xs font-medium text-gray-900">{selectedCourse.progress}%</Text>
                  </View>
                  <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${selectedCourse.progress || 0}%` }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="flex-row px-4 border-t border-gray-100">
            <TouchableOpacity className="px-4 py-3 border-b-2 border-red-600">
              <Text className="text-red-600 font-medium">Modules</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-3">
              <Text className="text-gray-600 font-medium">Resources</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-3">
              <Text className="text-gray-600 font-medium">Discussion</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modules List */}
        <ScrollView className="flex-1 p-4">
          <View className="gap-4">
            {courseModules.map((module: Module, index: number) => (
              <TouchableOpacity
                key={module.id}
                onPress={() => setSelectedModule(module)}
                className={`bg-white p-4 rounded-xl border-2 transition-all ${
                  module.isCompleted
                    ? 'border-green-100 bg-green-50/30'
                    : selectedModule?.id === module.id
                    ? 'border-red-600 shadow-md'
                    : 'border-transparent shadow-sm'
                }`}
              >
                <View className="flex-row gap-4">
                  <View className={`w-10 h-10 rounded-full items-center justify-center shrink-0 ${
                    module.isCompleted
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    {module.isCompleted ? (
                      <CircleCheck size={20} color="#16a34a" />
                    ) : (
                      <Text className="font-bold text-gray-600">{index + 1}</Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-gray-900 mb-1">{module.title}</Text>
                    <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
                      {module.description}
                    </Text>
                    <View className="flex-row items-center gap-4">
                      <View className="flex-row items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                        <Clock size={12} color="#4b5563" />
                        <Text className="text-xs text-gray-600">{module.duration}</Text>
                      </View>
                      <View className="flex-row items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                        <FileText size={12} color="#4b5563" />
                        <Text className="text-xs text-gray-600">Quiz Available</Text>
                      </View>
                    </View>
                  </View>
                  <View className="justify-center">
                    <View className="w-8 h-8 rounded-full bg-red-50 items-center justify-center">
                      <Play size={16} color="#DC1F2E" fill="#DC1F2E" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Video Player Modal/Overlay would go here */}
        {selectedModule && !showQuiz && (
          <View className="absolute inset-0 bg-black/90 z-50 justify-center p-4">
            <View className="bg-white rounded-xl overflow-hidden w-full max-w-4xl mx-auto h-[80%]">
              <View className="bg-black flex-1 items-center justify-center relative">
                {/* Placeholder for Video Player */}
                <Image
                  source={{ uri: `https://img.youtube.com/vi/${selectedModule.videoUrl}/maxresdefault.jpg` }}
                  className="w-full h-full opacity-50"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => handleModuleComplete(selectedModule.id, selectedCourse.id)}
                  className="absolute bg-red-600 px-6 py-3 rounded-full flex-row items-center gap-2"
                >
                  <Play size={20} color="white" fill="white" />
                  <Text className="text-white font-bold">Start Quiz</Text>
                </TouchableOpacity>
              </View>
              <View className="p-4 flex-row justify-between items-center bg-white">
                <View>
                  <Text className="font-bold text-lg text-gray-900">{selectedModule.title}</Text>
                  <Text className="text-gray-600">{selectedModule.duration}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedModule(null)}
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  <Text className="text-gray-700 font-medium">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-2xl font-bold text-gray-800">My Learning</Text>
          <Text className="text-gray-600">Access your enrolled courses and track progress</Text>
        </View>
      </View>

      {/* Filters */}
      <View className="flex-row gap-2 mb-6">
        {(['all', 'in-progress', 'completed'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`px-4 py-2 rounded-full border ${
              filter === f
                ? 'bg-red-600 border-red-600'
                : 'bg-white border-gray-200'
            }`}
          >
            <Text className={`capitalize ${
              filter === f ? 'text-white font-medium' : 'text-gray-600'
            }`}>
              {f.replace('-', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Course Grid */}
      <View className="flex-row flex-wrap gap-6">
        {filteredCourses.map((course: Course) => (
          <TouchableOpacity
            key={course.id}
            onPress={() => setSelectedCourse(course)}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 w-full md:w-[48%] lg:w-[31%]"
          >
            <View className="relative h-48">
              <Image
                source={{ uri: course.thumbnail }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-800">
                <Text className="text-xs font-bold text-gray-800">{course.category}</Text>
              </View>
            </View>

            <View className="p-5">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold text-gray-900 flex-1 mr-2" numberOfLines={2}>
                  {course.title}
                </Text>
                <View className="flex-row items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                  <Star size={14} color="#eab308" fill="#eab308" />
                  <Text className="text-xs font-bold text-yellow-700">{course.rating}</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-4 text-sm text-gray-500 mb-4">
                <View className="flex-row items-center gap-1">
                  <Users size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-500">{course.enrolled}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Clock size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-500">{course.duration}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <BookOpen size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-500">{course.modules} Modules</Text>
                </View>
              </View>

              <View className="mb-4">
                <View className="flex-row justify-between text-xs text-gray-500 mb-1">
                  <Text className="text-xs text-gray-500">Progress</Text>
                  <Text className="text-xs font-medium text-gray-900">{course.progress}%</Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${course.progress || 0}%` }}
                  />
                </View>
              </View>

              <View className="w-full py-2 bg-gray-50 hover:bg-gray-100 rounded-lg items-center border border-gray-200">
                <Text className="text-gray-700 font-medium">
                  {course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

