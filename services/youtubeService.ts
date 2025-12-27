import * as FileSystem from 'expo-file-system';

// Define locally to avoid version mismatch issues
const FileSystemUploadType = {
    BINARY_CONTENT: 0,
    MULTIPART: 1,
};

export async function uploadVideoToYouTube(fileUri: string, accessToken: string, title: string, description: string): Promise<string> {
    try {
        // 1. Initiate Resumable Upload Session
        const metadata = {
            snippet: {
                title,
                description,
                tags: ['lms', 'course'],
                categoryId: '27', // Education
            },
            status: {
                privacyStatus: 'unlisted', // Default to unlisted for LMS
                selfDeclaredMadeForKids: false,
            },
        };

        const initiateResponse = await fetch(
            'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Upload-Content-Type': 'video/*',
                },
                body: JSON.stringify(metadata),
            }
        );

        if (!initiateResponse.ok) {
            const errText = await initiateResponse.text();
            throw new Error(`Failed to initiate YouTube upload: ${initiateResponse.status} ${errText}`);
        }

        const uploadUrl = initiateResponse.headers.get('Location');
        if (!uploadUrl) {
            throw new Error("No upload URL returned from YouTube");
        }

        // 2. Upload the file content
        // For React Native Expo, we can use FileSystem.uploadAsync handling 'PUT' if supported, 
        // or standard fetch with blob if we can read it.
        // FileSystem.uploadAsync supports PATCH/POST/PUT

        // We'll use expo-file-system uploadAsync.
        // Note: YouTube resumable upload expects PUT for the bytes.

        const uploadResult = await FileSystem.uploadAsync(uploadUrl, fileUri, {
            httpMethod: 'PUT',
            headers: {
                // Authorization is implicit in the uploadUrl for resumable, 
                // but sometimes nice to keep. Actually for the binary phase, JUST the binary.
                // Content-Length is handled by expo.
                'Content-Type': 'video/*',
            },
            uploadType: FileSystemUploadType.BINARY_CONTENT,
        });

        if (uploadResult.status !== 200 && uploadResult.status !== 201) {
            throw new Error(`Failed to upload video data: ${uploadResult.status} ${uploadResult.body}`);
        }

        const responseBody = JSON.parse(uploadResult.body);
        const videoId = responseBody.id;
        return `https://www.youtube.com/watch?v=${videoId}`;

    } catch (error: any) {
        console.error("YouTube Upload Error:", error);
        throw new Error(error.message || "YouTube upload failed");
    }
}
