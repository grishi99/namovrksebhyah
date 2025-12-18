import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const envVars = {
            GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID ? 'SET' : 'MISSING',
            NEXT_PUBLIC_GOOGLE_SHEET_ID: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID ? 'SET' : 'MISSING',
            NODE_ENV: process.env.NODE_ENV,
            AllEnvKeys: Object.keys(process.env).filter(key => 
                key.includes('SHEET') || key.includes('GOOGLE_DRIVE') || key.includes('GOOGLE_SHEET')
            )
        };

        return NextResponse.json(envVars);
    } catch (error) {
        console.error('Debug env error:', error);
        return NextResponse.json({ error: 'Failed to read environment' });
    }
}