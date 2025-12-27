import * as FileSystem from 'expo-file-system';

// Define locally to avoid version mismatch issues
const FileSystemUploadType = {
    BINARY_CONTENT: 0,
    MULTIPART: 1,
};

export async function uploadFileToDrive(fileUri: string, accessToken: string, fileName: string, mimeType: string): Promise<string> {
    try {
        // 1. Multipart Upload for Drive (Metadata + Content)
        // Construct the multipart body manually or use resumable if file is large.
        // For simplicity, we'll use Resumable similar to YouTube as it is more robust.

        const metadata = {
            name: fileName,
            description: 'Uploaded from LMS',
            parents: [], // Upload to root or specific folder if needed
        };

        const initiateResponse = await fetch(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(metadata),
            }
        );

        if (!initiateResponse.ok) {
            const txt = await initiateResponse.text();
            throw new Error(`Failed to initiate Drive upload: ${initiateResponse.status} ${txt}`);
        }

        const uploadUrl = initiateResponse.headers.get('Location');
        if (!uploadUrl) throw new Error("No upload URL returned from Drive");

        // 2. Upload Content
        const uploadResult = await FileSystem.uploadAsync(uploadUrl, fileUri, {
            httpMethod: 'PUT',
            headers: {
                'Content-Type': mimeType,
            },
            uploadType: FileSystemUploadType.BINARY_CONTENT,
        });

        if (uploadResult.status !== 200 && uploadResult.status !== 201) {
            throw new Error(`Failed to upload file data: ${uploadResult.status} ${uploadResult.body}`);
        }

        const fileData = JSON.parse(uploadResult.body);
        const fileId = fileData.id;

        // 3. Make public (user requested "anyone with link")
        // POST https://www.googleapis.com/drive/v3/files/fileId/permissions

        const permRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: 'reader',
                type: 'anyone',
            }),
        });

        if (!permRes.ok) {
            console.warn("Failed to set public permissions on Drive file");
        }

        // 4. Get the WebViewLink
        const getFileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=webViewLink,webContentLink`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const finalData = await getFileRes.json();

        return finalData.webViewLink || finalData.webContentLink;

    } catch (error: any) {
        console.error("Drive Upload Error:", error);
        throw new Error(error.message || "Drive upload failed");
    }
}
