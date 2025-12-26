import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { GraduationCap, Award, Users, ChevronRight, Play, BookOpen, Trophy, Zap, Target } from 'lucide-react-native';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Learning',
      description: 'Access to structured courses designed specifically for Direct Sales Executives',
    },
    {
      icon: Trophy,
      title: 'Gamification & Rewards',
      description: 'Earn badges, climb leaderboards, and get certified as you progress',
    },
    {
      icon: Zap,
      title: 'Interactive Training',
      description: 'Video tutorials, quizzes, and hands-on exercises for better learning',
    },
    {
      icon: Target,
      title: 'Track Your Progress',
      description: 'Monitor your learning journey with detailed analytics and insights',
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Learners' },
    { value: '50+', label: 'Training Modules' },
    { value: '95%', label: 'Completion Rate' },
    { value: '4.8/5', label: 'Average Rating' },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Navigation */}
      <View className="bg-white/80 shadow-sm z-50 px-4 py-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <View className="w-10 h-10 bg-red-600 rounded-lg items-center justify-center">
              <GraduationCap color="white" size={24} />
            </View>
            <View>
              <Text className="font-bold text-xl text-gray-800">Indosat LMS</Text>
              <Text className="text-xs text-gray-600">Learning Management System</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onGetStarted}
            className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
          >
            <Text className="text-white font-semibold">Get Started</Text>
            <ChevronRight color="white" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View className="pt-12 pb-12 px-4">
        <View className="items-center">
          <View className="bg-red-50 px-4 py-2 rounded-full mb-6">
            <Text className="text-sm font-semibold text-red-600">
              🚀 Empowering Direct Sales Excellence
            </Text>
          </View>

          <Text className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Master Your Skills,
            {'\n'}
            <Text className="text-red-600">
              Elevate Your Career
            </Text>
          </Text>

          <Text className="text-lg text-gray-600 mb-8 text-center">
            Join Indosat Ooredoo Hutchison&apos;s comprehensive learning platform designed exclusively
            for Direct Sales Executives. Learn at your own pace, earn certifications, and become
            a sales champion.
          </Text>

          <View className="flex-col gap-4 w-full max-w-sm">
            <TouchableOpacity
              onPress={onGetStarted}
              className="bg-red-600 py-4 rounded-xl flex-row items-center justify-center gap-2 shadow-lg"
            >
              <Text className="text-white font-semibold text-lg">Start Learning Now</Text>
              <ChevronRight color="white" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white border-2 border-gray-300 py-4 rounded-xl flex-row items-center justify-center gap-2"
            >
              <Play color="#374151" size={20} />
              <Text className="text-gray-700 font-semibold text-lg">Watch Demo</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row flex-wrap justify-center gap-6 mt-12">
            {stats.map((stat, index) => (
              <View key={index} className="items-center w-[40%]">
                <Text className="text-2xl font-bold text-red-600">
                  {stat.value}
                </Text>
                <Text className="text-xs text-gray-600 mt-1">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View className="py-12 px-4 bg-gray-50">
        <View className="mb-12">
          <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Why Choose Indosat LMS?
          </Text>
          <Text className="text-lg text-gray-600 text-center">
            Everything you need to excel as a Direct Sales Executive, all in one platform
          </Text>
        </View>

        <View className="gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <View
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <View className="w-14 h-14 bg-red-100 rounded-xl items-center justify-center mb-4">
                  <Icon color="#DC1F2E" size={28} />
                </View>
                <Text className="text-xl font-bold text-gray-900 mb-3">{feature.title}</Text>
                <Text className="text-gray-600 leading-relaxed">{feature.description}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* How it Works Section */}
      <View className="py-12 px-4">
        <View className="mb-12">
          <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
            How It Works
          </Text>
          <Text className="text-lg text-gray-600 text-center">
            Start your learning journey in three simple steps
          </Text>
        </View>

        <View className="gap-8">
          {[
            {
              step: '01',
              title: 'Sign Up & Explore',
              description: 'Create your account and browse through our comprehensive course catalog tailored for DSE professionals.',
              icon: Users,
            },
            {
              step: '02',
              title: 'Learn & Practice',
              description: 'Watch video tutorials, complete interactive modules, and take quizzes to reinforce your knowledge.',
              icon: BookOpen,
            },
            {
              step: '03',
              title: 'Earn & Achieve',
              description: 'Get certified, earn badges, compete on leaderboards, and advance your career with proven skills.',
              icon: Award,
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <View key={index} className="items-center">
                <View className="mb-6 relative items-center justify-center">
                  <View className="w-20 h-20 bg-red-600 rounded-full items-center justify-center z-10">
                    <Icon color="white" size={32} />
                  </View>
                  <Text className="text-7xl font-bold text-gray-100 absolute -top-4 -z-10">
                    {item.step}
                  </Text>
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">{item.title}</Text>
                <Text className="text-gray-600 text-center leading-relaxed">{item.description}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* CTA Section */}
      <View className="py-12 px-4 bg-red-600">
        <View className="items-center">
          <Text className="text-3xl font-bold text-white mb-6 text-center">
            Ready to Transform Your Career?
          </Text>
          <Text className="text-lg text-white/90 mb-8 text-center">
            Join hundreds of Direct Sales Executives who are already advancing their careers with Indosat LMS
          </Text>
          <TouchableOpacity
            onPress={onGetStarted}
            className="bg-white px-8 py-4 rounded-xl flex-row items-center justify-center gap-2 shadow-lg"
          >
            <Text className="text-red-600 font-bold text-lg">Get Started for Free</Text>
            <ChevronRight color="#DC1F2E" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View className="bg-gray-900 py-8 px-4">
        <View className="gap-8 mb-8">
          <View>
            <Text className="font-bold text-white mb-4 text-lg">About</Text>
            <View className="gap-2">
              <Text className="text-gray-400">About Us</Text>
              <Text className="text-gray-400">Careers</Text>
              <Text className="text-gray-400">Contact</Text>
            </View>
          </View>
          <View>
            <Text className="font-bold text-white mb-4 text-lg">Resources</Text>
            <View className="gap-2">
              <Text className="text-gray-400">Help Center</Text>
              <Text className="text-gray-400">Documentation</Text>
              <Text className="text-gray-400">FAQs</Text>
            </View>
          </View>
        </View>
        <View className="border-t border-gray-800 pt-8 items-center">
          <Text className="text-gray-400 text-center">&copy; 2024 Indosat Ooredoo Hutchison. All rights reserved.</Text>
        </View>
      </View>
    </ScrollView>
  );
};
