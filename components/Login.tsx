import { useApp } from '@/context/AppContext';
import { signInWithEmail, signInWithGoogle, signUpWithEmail, useGoogleAuth } from '@/services/authService';
import { useRouter } from 'expo-router';
import { Lock, LogIn, Mail, User, UserPlus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export const Login: React.FC = () => {
  const { setCurrentProfile } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Google OAuth setup
  const { request, response, promptAsync } = useGoogleAuth();

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response);
    }
  }, [response]);

  const handleGoogleResponse = async (response: any) => {
    try {
      setLoading(true);
      setError('');
      
      const { id_token } = response.params;
      const result = await signInWithGoogle(id_token);

      if (result.success && result.profile) {
        setCurrentProfile(result.profile);
        router.replace('/dashboard' as any);
      } else {
        setError(result.error || 'Google sign in failed');
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signInWithEmail(email, password);

      if (result.success && result.profile) {
        setCurrentProfile(result.profile);
        router.replace('/dashboard' as any);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signUpWithEmail(email, password, fullName, employeeId || undefined);

      if (result.success && result.profile) {
        setCurrentProfile(result.profile);
        router.replace('/dashboard' as any);
      } else {
        setError(result.error || 'Sign up failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (isSignUp) {
      handleSignUp();
    } else {
      handleLogin();
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setEmployeeId('');
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await promptAsync();
    } catch (err: any) {
      setError(err.message || 'Google sign in error');
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
            {/* Toggle Tabs */}
            <View className="flex-row mb-6 bg-gray-100 rounded-lg p-1">
              <TouchableOpacity
                onPress={() => !loading && setIsSignUp(false)}
                className={`flex-1 py-3 rounded-lg ${!isSignUp ? 'bg-white shadow-sm' : ''}`}
              >
                <Text className={`text-center font-semibold ${!isSignUp ? 'text-red-600' : 'text-gray-500'}`}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => !loading && setIsSignUp(true)}
                className={`flex-1 py-3 rounded-lg ${isSignUp ? 'bg-white shadow-sm' : ''}`}
              >
                <Text className={`text-center font-semibold ${isSignUp ? 'text-red-600' : 'text-gray-500'}`}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-2xl mb-6 text-center text-gray-800 font-bold">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>

            <View className="space-y-4">
              {/* Full Name Input (Sign Up Only) */}
              {isSignUp && (
                <View>
                  <Text className="text-gray-700 mb-2 font-medium">Full Name *</Text>
                  <View className="relative">
                    <View className="absolute left-3 top-3 z-10">
                      <User color="#9ca3af" size={20} />
                    </View>
                    <TextInput
                      value={fullName}
                      onChangeText={setFullName}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600"
                      placeholder="Enter your full name"
                      editable={!loading}
                    />
                  </View>
                </View>
              )}

              {/* Employee ID Input (Sign Up Only - Optional) */}
              {isSignUp && (
                <View>
                  <Text className="text-gray-700 mb-2 font-medium">Employee ID (Optional)</Text>
                  <View className="relative">
                    <View className="absolute left-3 top-3 z-10">
                      <Text className="text-gray-400">🆔</Text>
                    </View>
                    <TextInput
                      value={employeeId}
                      onChangeText={setEmployeeId}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600"
                      placeholder="Enter employee ID"
                      editable={!loading}
                    />
                  </View>
                </View>
              )}

              {/* Email Input */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Email *</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Mail color="#9ca3af" size={20} />
                  </View>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600"
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Password *</Text>
                <View className="relative">
                  <View className="absolute left-3 top-3 z-10">
                    <Lock color="#9ca3af" size={20} />
                  </View>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600"
                    placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
                    secureTextEntry
                    editable={!loading}
                    onSubmitEditing={!isSignUp ? handleSubmit : undefined}
                  />
                </View>
              </View>

              {/* Confirm Password Input (Sign Up Only) */}
              {isSignUp && (
                <View>
                  <Text className="text-gray-700 mb-2 font-medium">Confirm Password *</Text>
                  <View className="relative">
                    <View className="absolute left-3 top-3 z-10">
                      <Lock color="#9ca3af" size={20} />
                    </View>
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-600"
                      placeholder="Confirm your password"
                      secureTextEntry
                      editable={!loading}
                      onSubmitEditing={handleSubmit}
                    />
                  </View>
                </View>
              )}

              {error ? (
                <View className="bg-red-50 p-3 rounded-lg">
                  <Text className="text-red-600 text-sm">{error}</Text>
                </View>
              ) : null}

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className={`w-full py-3 rounded-lg flex-row items-center justify-center gap-2 ${
                  loading ? 'bg-red-400' : 'bg-red-600'
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    {isSignUp ? <UserPlus size={20} color="white" /> : <LogIn size={20} color="white" />}
                    <Text className="text-white font-bold text-lg">
                      {isSignUp ? 'Sign Up' : 'Login'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="px-4 text-gray-500 text-sm">OR</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              {/* Google Sign In Button */}
              <TouchableOpacity
                onPress={handleGoogleLogin}
                disabled={!request || loading}
                className={`w-full py-3 rounded-lg flex-row items-center justify-center gap-2 border-2 ${
                  !request || loading ? 'border-gray-200 bg-gray-100' : 'border-gray-300 bg-white'
                }`}
              >
                <View className="w-5 h-5">
                  <Text>🔍</Text>
                </View>
                <Text className={`font-semibold ${!request || loading ? 'text-gray-400' : 'text-gray-700'}`}>
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </View>

            {/* Info Text */}
            <View className="mt-6 pt-6 border-t border-gray-200">
              {isSignUp ? (
                <>
                  <Text className="text-xs text-gray-500 text-center">
                    By signing up, you agree to our Terms of Service
                  </Text>
                  <TouchableOpacity onPress={toggleMode} className="mt-3">
                    <Text className="text-sm text-red-600 text-center font-medium">
                      Already have an account? Sign In
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text className="text-xs text-gray-500 text-center">
                    Use your Indosat email credentials to sign in
                  </Text>
                  <TouchableOpacity onPress={toggleMode} className="mt-3">
                    <Text className="text-sm text-red-600 text-center font-medium">
                      Don't have an account? Sign Up
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
