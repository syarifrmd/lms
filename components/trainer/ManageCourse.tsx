import { useApp } from '@/context/AppContext';
import { addModule, createCourse, getMyCourses, listModules, publishCourse } from '@/services/courseService';
import { uploadFileToDrive } from '@/services/driveService';
import { getAccessToken, getCurrentUser } from '@/services/googleOAuth';
import { uploadVideoToYouTube } from '@/services/youtubeService';
import { Course, Module } from '@/types';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RichTextEditor } from '../ui/RichTextEditor';

export const ManageCourse: React.FC = () => {
  const { currentUser } = useApp();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Google Auth
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Create course state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Selection
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const selectedCourse = useMemo(() => courses.find(c => c.id === selectedCourseId) ?? null, [courses, selectedCourseId]);

  // Modules
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);

  // Add module form
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleOrder, setModuleOrder] = useState('1');

  // Slate initial value
  const [moduleDescription, setModuleDescription] = useState<any[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  const [selectedVideo, setSelectedVideo] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  useEffect(() => {
    loadCourses();
    checkGoogleUser();
  }, []);

  async function checkGoogleUser() {
    const user = await getCurrentUser();
    if (user) {
      // If already signed in, we might need to refresh token silently, but let's just wait for user to hit upload or sign in again if needed.
      // For better UX, we could try getAccessToken() here but it might prompt.
      // We'll leave it to the explicit action.
    }
  }

  async function handleGoogleSignIn() {
    setIsSigningIn(true);
    try {
      const token = await getAccessToken();
      setGoogleToken(token);
    } catch (e: any) {
      Alert.alert("Google Sign-In Failed", e.message);
    } finally {
      setIsSigningIn(false);
    }
  }

  async function loadCourses() {
    setLoadingCourses(true);
    setError(null);
    setSuccessMessage(null);
    const res = await getMyCourses();
    if (res.error) setError(res.error);
    const mapped = (res.data ?? []).map(r => ({
      id: r.course_id,
      title: r.title,
      description: r.description ?? '',
      thumbnail: '',
      duration: '',
      modules: 0,
      enrolled: 0,
      rating: 0,
      category: r.category ?? '',
      trainer: currentUser?.name ?? 'Trainer',
      progress: 0,
    }));
    setCourses(mapped as any);
    setLoadingCourses(false);
  }

  async function onCreateCourse() {
    setError(null);
    setSuccessMessage(null);
    setLoadingCourses(true);
    try {
      const { data, error } = await createCourse({ title: newTitle, description: newDesc, category: newCategory });
      if (error) {
        setError(error);
        return;
      }
      if (data) {
        setSuccessMessage('Course created successfully');
        await loadCourses();
      }
      setNewTitle('');
      setNewDesc('');
      setNewCategory('');
    } finally {
      setLoadingCourses(false);
    }
  }

  async function loadModules() {
    if (!selectedCourseId) return;
    setLoadingModules(true);
    const { data, error } = await listModules(selectedCourseId);
    if (error) setError(error);
    const mapped = (data ?? []).map(m => ({
      id: m.module_id,
      courseId: m.course_id,
      title: m.title,
      description: m.content_text ?? '', // Using content_text for display if needed, but here we might want to check
      duration: (m.duration_minutes ? `${m.duration_minutes} min` : ''),
      videoUrl: m.video_url ?? undefined,
      docUrl: m.doc_url ?? undefined,
      isCompleted: false,
      order: m.order_sequence,
    }));
    setModules(mapped as any);
    setLoadingModules(false);
  }

  useEffect(() => { loadModules(); }, [selectedCourseId]);

  async function onPickVideo() {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['video/*'],
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setSelectedVideo(res.assets[0]);
      }
    } catch (e) { console.log('Picker error', e); }
  }

  async function onPickDoc() {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.google-apps.document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setSelectedDoc(res.assets[0]);
      }
    } catch (e) { console.log('Picker error', e); }
  }

  async function onAddModule() {
    if (!selectedCourseId) { setError('Choose a course first'); return; }

    // Check Google Token
    if (!googleToken && (selectedVideo || selectedDoc)) {
      Alert.alert("Authentication Required", "Please sign in with Google to upload videos or documents.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setUploadProgress('Starting upload...');

    let videoUrl: string | undefined = undefined;
    let docUrl: string | undefined = undefined;

    try {
      if (selectedVideo && googleToken) {
        setUploadProgress('Uploading video to YouTube...');
        // Use module title + course title as video title
        const vTitle = `${selectedCourse?.title} - ${moduleTitle}`;
        videoUrl = await uploadVideoToYouTube(selectedVideo.uri, googleToken, vTitle, JSON.stringify(moduleDescription));
        setUploadProgress('Video uploaded!');
      }

      if (selectedDoc && googleToken) {
        setUploadProgress('Uploading document to Drive...');
        docUrl = await uploadFileToDrive(selectedDoc.uri, googleToken, selectedDoc.name, selectedDoc.mimeType ?? 'application/pdf');
        setUploadProgress('Document uploaded!');
      }
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setIsSubmitting(false);
      setUploadProgress('');
      return;
    }

    setUploadProgress('Saving module...');
    const order_sequence = Number(moduleOrder) || 1;
    const contentText = JSON.stringify(moduleDescription);

    const { data, error } = await addModule(selectedCourseId, {
      title: moduleTitle,
      order_sequence,
      video_url: videoUrl,
      doc_url: docUrl,
      content_text: contentText,
    });

    if (error) setError(error);
    if (data) {
      await loadModules();
      setModuleTitle(''); setModuleOrder(String(order_sequence + 1));
      setModuleDescription([{ type: 'paragraph', children: [{ text: '' }] }]);
      setSelectedVideo(null);
      setSelectedDoc(null);
      setSuccessMessage('Module added successfully!');
    }
    setIsSubmitting(false);
    setUploadProgress('');
  }

  async function onPublish() {
    if (!selectedCourseId) return;
    const { error } = await publishCourse(selectedCourseId);
    if (error) setError(error); else await loadCourses();
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <View className="mb-6 flex-row justify-between items-start">
        <View>
          <Text className="text-2xl font-bold text-gray-800">Manage Courses</Text>
          <Text className="text-gray-600">Create course, add modules, upload content and publish.</Text>
        </View>
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          className={`px-3 py-2 rounded-lg ${googleToken ? 'bg-green-100 border border-green-500' : 'bg-white border border-gray-300'}`}
        >
          <Text className={googleToken ? 'text-green-700' : 'text-gray-700'}>
            {googleToken ? 'Googled Connected' : 'Connect Google'}
          </Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View className="bg-red-50 p-3 rounded-lg mb-6">
          <Text className="text-red-700 font-medium">Error</Text>
          <Text className="text-red-600 text-sm">{error}</Text>
        </View>
      )}

      {successMessage && (
        <View className="bg-green-50 p-3 rounded-lg mb-6">
          <Text className="text-green-800 font-medium">Success</Text>
          <Text className="text-green-700 text-sm">{successMessage}</Text>
        </View>
      )}

      {/* Create course */}
      <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <Text className="text-lg font-bold mb-4">Create Course</Text>
        <View className="gap-3">
          <TextInput placeholder="Title" value={newTitle} onChangeText={setNewTitle} className="border border-gray-300 rounded-lg px-3 py-2" />
          <TextInput placeholder="Category" value={newCategory} onChangeText={setNewCategory} className="border border-gray-300 rounded-lg px-3 py-2" />
          <TextInput placeholder="Description" value={newDesc} onChangeText={setNewDesc} className="border border-gray-300 rounded-lg px-3 py-2" multiline />
          <TouchableOpacity onPress={onCreateCourse} disabled={loadingCourses || !newTitle} className={`px-4 py-2 rounded-lg ${loadingCourses || !newTitle ? 'bg-gray-300' : 'bg-red-600'}`}>
            <Text className="text-white font-medium">{loadingCourses ? 'Creating...' : 'Create'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List & choose course */}
      <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <View className="flex-row justify-between mb-4 items-center">
          <Text className="text-lg font-bold">My Courses</Text>
          <TouchableOpacity onPress={loadCourses} className="px-3 py-2 bg-gray-100 rounded-lg"><Text>Refresh</Text></TouchableOpacity>
        </View>
        {loadingCourses && <ActivityIndicator />}
        <View className="gap-2">
          {courses.map(c => (
            <TouchableOpacity key={c.id} onPress={() => setSelectedCourseId(c.id)} className={`p-3 rounded-lg border ${selectedCourseId === c.id ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}>
              <Text className="font-medium">{c.title}</Text>
              <Text className="text-xs text-gray-500">{c.category}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedCourse && (
          <View className="mt-4 flex-row gap-2">
            <TouchableOpacity onPress={onPublish} className="px-4 py-2 bg-green-600 rounded-lg"><Text className="text-white font-medium">Publish</Text></TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modules management */}
      {selectedCourse && (
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <View className="flex-row justify-between mb-4 items-center">
            <Text className="text-lg font-bold">Modules for: {selectedCourse.title}</Text>
            <TouchableOpacity onPress={loadModules} className="px-3 py-2 bg-gray-100 rounded-lg"><Text>Refresh</Text></TouchableOpacity>
          </View>
          {loadingModules && <ActivityIndicator />}
          <View className="gap-2 mb-6">
            {modules.map(m => (
              <View key={m.id} className="p-3 rounded-lg border border-gray-200">
                <Text className="font-medium">{m.order}. {m.title}</Text>
                {!!m.videoUrl && <Text className="text-xs text-blue-600" numberOfLines={1}>Video: {m.videoUrl.split('?v=')[1] || 'YouTube'}</Text>}
                {!!(m as any).docUrl && <Text className="text-xs text-purple-600" numberOfLines={1}>Doc: Drive File</Text>}
              </View>
            ))}
            {modules.length === 0 && <Text className="text-gray-500">No modules yet.</Text>}
          </View>

          {/* Add module form */}
          <Text className="text-base font-bold mb-2">Add Module</Text>
          <View className="gap-3">
            <TextInput placeholder="Module title" value={moduleTitle} onChangeText={setModuleTitle} className="border border-gray-300 rounded-lg px-3 py-2" />
            <TextInput placeholder="Order (#)" value={moduleOrder} onChangeText={setModuleOrder} keyboardType="number-pad" className="border border-gray-300 rounded-lg px-3 py-2" />

            <View className="gap-2 my-2">
              <Text className="text-sm font-medium">Description (Rich Text)</Text>
              <RichTextEditor value={moduleDescription} onChange={setModuleDescription} />
            </View>

            <View className="flex-row gap-2">
              <View className="flex-1 gap-2 my-2">
                <Text className="text-sm font-medium">Video (YouTube)</Text>
                <TouchableOpacity onPress={onPickVideo} className="flex-row items-center justify-center border border-dashed border-gray-400 rounded-lg p-4 bg-gray-50">
                  <Text className="text-gray-600 text-xs text-center">{selectedVideo ? selectedVideo.name : 'Select Video'}</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-1 gap-2 my-2">
                <Text className="text-sm font-medium">Document (Drive)</Text>
                <TouchableOpacity onPress={onPickDoc} className="flex-row items-center justify-center border border-dashed border-gray-400 rounded-lg p-4 bg-gray-50">
                  <Text className="text-gray-600 text-xs text-center">{selectedDoc ? selectedDoc.name : 'Select Doc'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {uploadProgress ? <Text className="text-blue-600 text-center text-sm mb-2">{uploadProgress}</Text> : null}

            <TouchableOpacity onPress={onAddModule} disabled={isSubmitting || !moduleTitle} className={`px-4 py-2 rounded-lg ${isSubmitting || !moduleTitle ? 'bg-gray-300' : 'bg-blue-600'}`}>
              <Text className="text-white font-medium">{isSubmitting ? 'Processing...' : 'Add Module'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};
