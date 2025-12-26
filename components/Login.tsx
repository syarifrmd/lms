import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LogIn, User, Lock } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { useRouter } from 'expo-router';

export const Login: React.FC = () => {
  const { setCurrentUser, users } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    setError('');

    // Mock authentication
    const user = users.find((u) => u.email === email && u.role === selectedRole);

    if (user) {
      setCurrentUser(user);
      router.replace('/dashboard' as any);
    } else {
      setError('Invalid credentials or role mismatch');
    }
  };

  const quickLogin = (role: UserRole) => {
    const user = users.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      router.replace('/dashboard' as any);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 bg-red-600 items-center justify-center p-4">
        <View className="w-full max-w-md">
          {/* Logo Section */}
          <View className="items-center mb-8">
            <View className="bg-white rounded-2xl p-6 mb-4 shadow-lg">
              <Text className="text-3xl font-bold text-red-600">Indosat LMS</Text>
              <Text className="text-gray-600 mt-2">Learning Management System</Text>
            </View>
          </View>

          {/* Login Card */}
          <View className="bg-white rounded-2xl shadow-lg p-8">
            <Text className="text-2xl mb-6 text-center text-gray-800 font-bold">Welcome Back</Text>

            <View className="space-y-4">
              {/* Role Selection */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Select Role</Text>
                <View className="flex-row gap-2 justify-between">
                  {(['admin', 'trainer', 'dse'] as const).map((role) => (
                    <TouchableOpacity
                      key={role}
                      onPress={() => setSelectedRole(role)}
                      className={`flex-1 py-3 px-2 rounded-lg border-2 items-center ${
                        selectedRole === role
                          ? 'border-red-600 bg-red-600'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <Text className={`capitalize font-medium ${
                        selectedRole === role ? 'text-white' : 'text-gray-700'
                      }`}>
                        {role === 'dse' ? 'DSE' : role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Email Input */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <User color="#9ca3af" size={20} />
                  </View>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600"
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Lock color="#9ca3af" size={20} />
                  </View>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600"
                    placeholder="Enter your password"
                    secureTextEntry
                  />
                </View>
              </View>

              {error ? (
                <View className="bg-red-50 p-3 rounded-lg">
                  <Text className="text-red-600 text-sm">{error}</Text>
                </View>
              ) : null}

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                className="w-full bg-red-600 py-3 rounded-lg flex-row items-center justify-center gap-2"
              >
                <LogIn size={20} color="white" />
                <Text className="text-white font-bold text-lg">Login</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Login Demo */}
            <View className="mt-6 pt-6 border-t border-gray-200">
              <Text className="text-sm text-gray-600 text-center mb-3">Quick Demo Login:</Text>
              <View className="space-y-2">
                <TouchableOpacity
                  onPress={() => quickLogin('admin')}
                  className="w-full py-2 px-4 bg-gray-100 rounded-lg items-center"
                >
                  <Text className="text-sm text-gray-800">Login as Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => quickLogin('trainer')}
                  className="w-full py-2 px-4 bg-gray-100 rounded-lg items-center"
                >
                  <Text className="text-sm text-gray-800">Login as Trainer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => quickLogin('dse')}
                  className="w-full py-2 px-4 bg-gray-100 rounded-lg items-center"
                >
                  <Text className="text-sm text-gray-800">Login as DSE</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-500 text-center mt-4">
                Demo: admin@indosat.com, ahmad@indosat.com, budi@indosat.com
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
