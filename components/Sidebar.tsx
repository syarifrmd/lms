import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Award,
  Trophy,
  GraduationCap,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bug,
  UploadCloud,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { currentUser, setCurrentUser } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  const getMenuItems = () => {
    switch (currentUser?.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
          { id: 'users', label: 'Manage Users', icon: Users, path: '/dashboard/users' },
          { id: 'courses', label: 'Courses', icon: BookOpen, path: '/dashboard/courses' },
          { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
        ];
      case 'trainer':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
          { id: 'courses', label: 'My Courses', icon: BookOpen, path: '/dashboard/courses' },
          { id: 'create', label: 'Create Module', icon: FileText, path: '/dashboard/create' },
          { id: 'assessments', label: 'Assessments', icon: Award, path: '/dashboard/assessments' },
          { id: 'students', label: 'Students', icon: Users, path: '/dashboard/students' },
        ];
      case 'dse':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
          { id: 'learning', label: 'My Learning', icon: BookOpen, path: '/dashboard/learning' },
          { id: 'certificates', label: 'Certificates', icon: GraduationCap, path: '/dashboard/certificates' },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/dashboard/leaderboard' },
          { id: 'badges', label: 'My Badges', icon: Award, path: '/dashboard/badges' },
        ];
      default:
        return [];
    }
  };

  const menuItems = [
    ...getMenuItems(),
    { id: 'yt-debug', label: 'YouTube Debug', icon: Bug, path: '/debug/yt-api' },
    { id: 'yt-oauth', label: 'YouTube OAuth', icon: Bug, path: '/debug/yt-oauth' },
    { id: 'yt-upload', label: 'YouTube Upload', icon: UploadCloud, path: '/debug/yt-upload' },
  ];

  const handleLogout = () => {
    setCurrentUser(null);
    setIsMobileOpen(false);
    router.replace('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <View className="p-6 border-b border-gray-700">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 bg-red-600 rounded-lg items-center justify-center">
            <GraduationCap color="white" size={24} />
          </View>
          <View>
            <Text className="text-white font-bold">Indosat LMS</Text>
            <Text className="text-gray-400 text-xs capitalize">{currentUser?.role} Portal</Text>
          </View>
        </View>
      </View>

      {/* User Profile */}
      <View className="p-6 border-b border-gray-700">
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default' }}
            className="w-12 h-12 rounded-full border-2 border-yellow-400"
          />
          <View className="flex-1">
            <Text className="text-white font-medium" numberOfLines={1}>{currentUser?.name}</Text>
            <Text className="text-gray-400 text-sm" numberOfLines={1}>{currentUser?.email}</Text>
            {currentUser?.role === 'dse' && (
              <View className="flex-row items-center gap-2 mt-1">
                <Text className="text-yellow-400 text-xs">Level {currentUser?.level}</Text>
                <Text className="text-gray-400">•</Text>
                <Text className="text-gray-400 text-xs">{currentUser?.points} pts</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Navigation */}
      <ScrollView className="flex-1 p-4">
        <View className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <View key={item.id}>
                <TouchableOpacity
                  onPress={() => {
                    router.push(item.path as any);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex-row items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive
                      ? 'bg-red-600'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon size={20} color={isActive ? 'white' : '#d1d5db'} />
                  <Text className={isActive ? 'text-white' : 'text-gray-300'}>{item.label}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Logout */}
      <View className="p-4 border-t border-gray-700">
        <TouchableOpacity
          onPress={handleLogout}
          className="w-full flex-row items-center gap-3 px-4 py-3 rounded-lg"
        >
          <LogOut size={20} color="#d1d5db" />
          <Text className="text-gray-300">Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <TouchableOpacity
        onPress={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-red-600 rounded-lg"
      >
        {isMobileOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
      </TouchableOpacity>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsMobileOpen(false)}
          className="lg:hidden absolute inset-0 bg-black/50 z-40"
        />
      )}

      {/* Desktop Sidebar */}
      <View className="hidden lg:flex flex-col w-64 bg-[#1a1a1a] h-full">
        <SidebarContent />
      </View>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
         <View className="lg:hidden absolute left-0 top-0 bottom-0 w-64 bg-[#1a1a1a] z-40 flex-col h-full">
            <SidebarContent />
         </View>
      )}
    </>
  );
};
