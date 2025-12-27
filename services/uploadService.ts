import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

export async function uploadToSupabase(fileUri: string, fileType: string, fileName: string): Promise<string> {
  const fileExt = fileName.split('.').pop();
  const filePath = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

  let fileBody;

  // Read file as base64
  const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: 'base64',
  });

  fileBody = decode(fileBase64);

  const { data, error } = await supabase.storage
    .from('modules')
    .upload(filePath, fileBody, {
      contentType: fileType,
      upsert: false,
    });

  if (error) {
    throw new Error('Supabase upload failed: ' + error.message);
  }

  const { data: publicData } = supabase.storage
    .from('modules')
    .getPublicUrl(filePath);

  return publicData.publicUrl;
}

