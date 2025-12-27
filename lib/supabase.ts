import { Database } from "@/types/database";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

// Lazy load AsyncStorage to avoid window errors during bundling
const getAsyncStorage = async () => {
  if (Platform.OS !== 'web') {
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    return AsyncStorage.default;
  }
  return undefined;
};

const getWebStorage = () => {
  try {
    if (typeof window === 'undefined') return undefined;
    if (!('localStorage' in window)) return undefined;
    return window.localStorage;
  } catch {
    return undefined;
  }
};

// Custom storage adapter that handles lazy loading
const customStorageAdapter = {
  getItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        const storage = getWebStorage();
        return storage ? storage.getItem(key) : null;
      }
      const AsyncStorage = await getAsyncStorage();
      if (AsyncStorage) {
        return await AsyncStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.warn('Storage getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (Platform.OS === 'web') {
        const storage = getWebStorage();
        if (storage) storage.setItem(key, value);
        return;
      }
      const AsyncStorage = await getAsyncStorage();
      if (AsyncStorage) {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Storage setItem error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        const storage = getWebStorage();
        if (storage) storage.removeItem(key);
        return;
      }
      const AsyncStorage = await getAsyncStorage();
      if (AsyncStorage) {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Storage removeItem error:', error);
    }
  },
};

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: customStorageAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
