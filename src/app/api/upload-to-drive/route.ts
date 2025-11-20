import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const submissionId = formData.get('submissionId') as string;
        const userId = formData.get('userId') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Configure Google Drive OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_DRIVE_CLIENT_ID,
            process.env.GOOGLE_DRIVE_CLIENT_SECRET,
            process.env.GOOGLE_DRIVE_REDIRECT_URI
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
        });

        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create file metadata
        const fileMetadata = {
            name: `${submissionId}_${file.name}`,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
        };

        const media = {
            mimeType: file.type,
            body: Readable.from(buffer),
        };

        // Upload file to Google Drive
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, webViewLink, webContentLink',
        });

        // Make the file publicly accessible
        await drive.permissions.create({
            fileId: response.data.id!,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Get the file's public URL
        const fileUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;

        return NextResponse.json({
            success: true,
            fileId: response.data.id,
            fileUrl: fileUrl,
            webViewLink: response.data.webViewLink,
        });

    } catch (error: any) {
        console.error('Google Drive upload error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upload to Google Drive' },
            { status: 500 }
        );
    }
}
