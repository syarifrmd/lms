import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { getAccessToken } from '@/services/googleOAuth';

const DEFAULT_SCOPE = 'https://www.googleapis.com/auth/youtube.upload';


export const YoutubeUploadDebug: React.FC = () => {
  const [title, setTitle] = useState('Sample Upload');
  const [description, setDescription] = useState('Uploaded from LMS debug');
  const [tags, setTags] = useState('lms,indosat,debug');
  const [privacy, setPrivacy] = useState<'public' | 'unlisted' | 'private'>('unlisted');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const [progressPct, setProgressPct] = useState(0);

  async function signIn() {
    setError(null);
    setLoading(true);
    try {
      const resp = await getAccessToken([DEFAULT_SCOPE]);
      setToken(resp.access_token);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function upload() {
    if (!token) {
      setError('No access token. Sign in first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setProgressPct(0);

    try {
      // Stub for upload logic
      throw new Error("Video upload not implemented for React Native yet. Requires expo-file-system and background upload task.");
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <Text className="text-lg font-bold mb-4">YouTube Upload Debug</Text>

        <View className="mb-4">
          <Text className="mb-2 text-gray-700">Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-gray-700">Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            className="border border-gray-300 rounded-lg px-3 py-2"
            multiline
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-gray-700">Tags</Text>
          <TextInput
            value={tags}
            onChangeText={setTags}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-gray-700">Privacy Status</Text>
          <View className="flex-row gap-2">
            {(['public', 'unlisted', 'private'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPrivacy(p)}
                className={`px-3 py-2 rounded-lg border ${
                  privacy === p ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
                }`}
              >
                <Text className={privacy === p ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <TouchableOpacity
            onPress={() => setError("File selection not implemented in debug view")}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center justify-center bg-gray-50"
          >
            <Text className="text-gray-500 font-medium">Select Video File</Text>
            <Text className="text-xs text-gray-400 mt-1">(Not implemented)</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-2 mb-4">
          <TouchableOpacity
            onPress={signIn}
            disabled={loading || !!token}
            className={`px-4 py-2 rounded-lg justify-center flex-1 ${
              token ? 'bg-green-600' : 'bg-blue-600'
            }`}
          >
            <Text className="text-white font-medium text-center">
              {token ? 'Signed In' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={upload}
            disabled={loading || !token}
            className={`px-4 py-2 rounded-lg justify-center flex-1 ${
              loading || !token ? 'bg-gray-300' : 'bg-red-600'
            }`}
          >
            <Text className="text-white font-medium text-center">Upload</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View className="mb-4">
            <ActivityIndicator size="small" color="#0000ff" />
            <Text className="text-center text-xs text-gray-500 mt-2">
              Progress: {progressPct}%
            </Text>
          </View>
        )}
      </View>

      {error && (
        <View className="bg-red-50 p-4 rounded-lg mb-6">
          <Text className="text-red-600 font-bold">Error:</Text>
          <Text className="text-red-600">{error}</Text>
        </View>
      )}

      {result !== null && (
        <View className="bg-gray-100 p-4 rounded-lg mb-6">
          <Text className="font-bold mb-2">Result:</Text>
          <Text className="font-mono text-xs">{JSON.stringify(result, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
};
