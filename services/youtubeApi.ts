/*
  YouTube Data API v3 service for Expo React Native app.
  Reads API key from process.env.EXPO_PUBLIC_YOUTUBE_API_KEY.
*/

export type YouTubeAPIConfig = {
  apiKey: string;
  baseUrl?: string;
  debug?: boolean;
};

const API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = process.env.EXPO_PUBLIC_YOUTUBE_API_BASE ??
  'https://www.googleapis.com/youtube/v3';
const DEBUG = String(process.env.EXPO_PUBLIC_YOUTUBE_API_DEBUG ?? 'false') === 'true';

function logDebug(...args: unknown[]) {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.debug('[YouTubeAPI]', ...args);
  }
}

function ensureApiKey() {
  if (!API_KEY || API_KEY.length === 0) {
    throw new Error('YouTube API key is missing. Set EXPO_PUBLIC_YOUTUBE_API_KEY in .env');
  }
}

function buildUrl(endpoint: string, params: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  const merged = { key: API_KEY, prettyPrint: false, ...params };
  Object.entries(merged).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      url.searchParams.set(k, String(v));
    }
  });
  return url.toString();
}

async function request<T>(endpoint: string, params: Record<string, string | number | boolean | undefined>): Promise<T> {
  ensureApiKey();
  const url = buildUrl(endpoint, params);
  logDebug('GET', url);
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text();
    logDebug('Error response', res.status, text);
    throw new Error(`YouTube API error ${res.status}: ${text}`);
  }
  const json = (await res.json()) as T;
  logDebug('Response JSON', json);
  return json;
}

// Types (minimal) based on API responses
export type YouTubeSearchItem = {
  kind: string;
  etag: string;
  id: { kind: string; videoId?: string; channelId?: string; playlistId?: string };
  snippet?: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<string, { url: string; width?: number; height?: number }>;
    channelTitle: string;
  };
};

export type YouTubeSearchResponse = {
  kind: string;
  etag: string;
  nextPageToken?: string;
  regionCode?: string;
  pageInfo?: { totalResults: number; resultsPerPage: number };
  items: YouTubeSearchItem[];
};

export type YouTubeVideoResponse = {
  items: Array<{ id: string; snippet?: unknown; statistics?: unknown }>;
};

export type YouTubeChannelResponse = {
  items: Array<{ id: string; snippet?: unknown; statistics?: unknown }>;
};

export type YouTubePlaylistItemsResponse = {
  items: Array<{ id: string; snippet?: unknown }>;
  nextPageToken?: string;
};

export const YouTubeAPI = {
  searchVideos: async (q: string, maxResults = 10, pageToken?: string): Promise<YouTubeSearchResponse> => {
    return request<YouTubeSearchResponse>('search', {
      part: 'snippet',
      type: 'video',
      q,
      maxResults,
      pageToken,
    });
  },

  getVideoDetails: async (videoId: string, part = 'snippet,contentDetails,statistics'): Promise<YouTubeVideoResponse> => {
    return request<YouTubeVideoResponse>('videos', {
      part,
      id: videoId,
    });
  },

  getChannelDetails: async (channelId: string, part = 'snippet,contentDetails,statistics'): Promise<YouTubeChannelResponse> => {
    return request<YouTubeChannelResponse>('channels', {
      part,
      id: channelId,
    });
  },

  listPlaylistItems: async (playlistId: string, maxResults = 10, pageToken?: string): Promise<YouTubePlaylistItemsResponse> => {
    return request<YouTubePlaylistItemsResponse>('playlistItems', {
      part: 'snippet,contentDetails',
      playlistId,
      maxResults,
      pageToken,
    });
  },
};

export function getYouTubeApiStatus() {
  return {
    hasKey: Boolean(API_KEY && API_KEY.length > 0),
    baseUrl: BASE_URL,
    debug: DEBUG,
  };
}
