import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { getAccessToken, revokeToken } from '@/services/googleOAuth';

const DEFAULT_SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

export const YoutubeOAuthDebug: React.FC = () => {
  const [scopes, setScopes] = useState(DEFAULT_SCOPES.join(' '));
  const [token, setToken] = useState<string | null>(null);
  const [grantedScopes, setGrantedScopes] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);

  async function signIn() {
    setLoading(true);
    setError(null);
    try {
      const resp = await getAccessToken(scopes.split(/\s+/).filter(Boolean));
      setToken(resp.access_token);
      setGrantedScopes(resp.scope ?? null);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function callMyPlaylists() {
    if (!token) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const url = new URL('https://www.googleapis.com/youtube/v3/playlists');
      url.searchParams.set('part', 'snippet,contentDetails');
      url.searchParams.set('mine', 'true');
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`HTTP ${res.status}: ${t}`);
      }
      setResult(await res.json());
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <Text className="text-lg font-bold mb-4">YouTube OAuth Debug</Text>

        <View className="mb-4">
          <Text className="mb-2 text-gray-700">Scopes (space separated)</Text>
          <TextInput
            value={scopes}
            onChangeText={setScopes}
            className="border border-gray-300 rounded-lg px-3 py-2"
            multiline
          />
        </View>

        <View className="flex-row gap-2 mb-4">
          <TouchableOpacity
            onPress={signIn}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded-lg justify-center flex-1"
          >
            <Text className="text-white font-medium text-center">Sign In with Google</Text>
          </TouchableOpacity>

          {token && (
            <TouchableOpacity
              onPress={() => {
                revokeToken(token);
                setToken(null);
                setGrantedScopes(null);
              }}
              disabled={loading}
              className="bg-red-600 px-4 py-2 rounded-lg justify-center"
            >
              <Text className="text-white font-medium">Revoke</Text>
            </TouchableOpacity>
          )}
        </View>

        {token && (
          <View className="bg-green-50 p-4 rounded-lg mb-4">
            <Text className="text-green-800 font-bold mb-2">Token Active</Text>
            <Text className="text-xs font-mono text-green-700 mb-2" numberOfLines={2}>
              {token}
            </Text>
            <Text className="text-xs text-green-700">
              Granted Scopes: {grantedScopes}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={callMyPlaylists}
          disabled={!token || loading}
          className={`px-4 py-2 rounded-lg justify-center mb-4 ${
            !token || loading ? 'bg-gray-300' : 'bg-purple-600'
          }`}
        >
          <Text className="text-white font-medium text-center">Test API: Get My Playlists</Text>
        </TouchableOpacity>
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

