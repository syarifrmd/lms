import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { YouTubeAPI, getYouTubeApiStatus } from '@/services/youtubeApi';

export const YoutubeApiDebug: React.FC = () => {
  const status = getYouTubeApiStatus();
  const [query, setQuery] = useState('indosat');
  const [videoId, setVideoId] = useState('');
  const [channelId, setChannelId] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run<T>(fn: () => Promise<T>) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fn();
      setResult(res);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <Text className="text-lg font-bold mb-4">YouTube API Debug</Text>
        <View className="space-y-2">
          <Text>Status: {status.hasKey ? 'API key detected' : 'No API key found'}</Text>
          <Text>Base URL: {status.baseUrl}</Text>
          <Text>Debug logs: {status.debug ? 'enabled' : 'disabled'}</Text>
          {!status.hasKey && (
            <Text className="text-red-600">Set EXPO_PUBLIC_YOUTUBE_API_KEY in .env</Text>
          )}
        </View>
      </View>

      <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <Text className="text-lg font-bold mb-4">Search Videos</Text>
        <View className="flex-row gap-2 mb-4">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search query..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
          />
          <TouchableOpacity
            onPress={() => run(() => YouTubeAPI.searchVideos(query))}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded-lg justify-center"
          >
            <Text className="text-white font-medium">Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <Text className="text-lg font-bold mb-4">Video Details</Text>
        <View className="flex-row gap-2 mb-4">
          <TextInput
            value={videoId}
            onChangeText={setVideoId}
            placeholder="Video ID..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
          />
          <TouchableOpacity
            onPress={() => run(() => YouTubeAPI.getVideoDetails(videoId))}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded-lg justify-center"
          >
            <Text className="text-white font-medium">Get Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <Text className="text-lg font-bold mb-4">Channel Videos</Text>
        <View className="flex-row gap-2 mb-4">
          <TextInput
            value={channelId}
            onChangeText={setChannelId}
            placeholder="Channel ID..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
          />
          <TouchableOpacity
            onPress={() => run(() => YouTubeAPI.getChannelDetails(channelId))}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded-lg justify-center"
          >
            <Text className="text-white font-medium">Get Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <Text className="text-lg font-bold mb-4">Playlist Items</Text>
        <View className="flex-row gap-2 mb-4">
          <TextInput
            value={playlistId}
            onChangeText={setPlaylistId}
            placeholder="Playlist ID..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
          />
          <TouchableOpacity
            onPress={() => run(() => YouTubeAPI.listPlaylistItems(playlistId))}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded-lg justify-center"
          >
            <Text className="text-white font-medium">Get Items</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

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

