import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
    try {
        const sheetId = process.env.GOOGLE_SHEET_ID;
        if (!sheetId) {
            return NextResponse.json(
                { error: 'Server configuration error: GOOGLE_SHEET_ID is missing' },
                { status: 500 }
            );
        }

        const data = await request.json();

        // Configure Google OAuth2 client (reusing Drive credentials)
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_DRIVE_CLIENT_ID,
            process.env.GOOGLE_DRIVE_CLIENT_SECRET,
            process.env.GOOGLE_DRIVE_REDIRECT_URI
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
        });

        const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

        // Format the row data based on the submission
        // Helper to format a single row
        const formatRow = (data: any) => [
            data.status || 'pending',
            `${data.firstName} ${data.middleName || ''} ${data.lastName}`.trim(),
            data.email,
            data.phone,
            data.address,
            data.pan,
            new Date(data.submittedAt).toLocaleString('en-IN'),
            data.transactionId,
            data.totalAmount,
            data.finalContributionAmount || '',
            data.userEmail || '',
            data.plantingOption,
            data.oneTreeOption || '',
            data.bundlePlanOption || '',
            data.lifetimePlanOption || '',
            data.donationOption || '',
            data.verificationChoice || '',
            data.screenshotURL || ''
        ];

        let rows: any[][] = [];

        if (Array.isArray(data)) {
            rows = data.map(formatRow);
        } else {
            rows = [formatRow(data)];
        }

        // Append to Sheet 1
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Sheet1!A1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: rows,
            },
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Sheet Sync Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to sync to sheets' },
            { status: 500 }
        );
    }
}
