'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [envData, setEnvData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch from our debug API route
    fetch('/api/debug-env')
      .then(res => res.json())
      .then(data => setEnvData(data))
      .catch(err => setError('Failed to fetch environment variables: ' + err.message));
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!envData) {
    return <div className="p-4">Loading environment variables...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Environment Variables Debug</h1>
      <div className="space-y-2">
        <div><strong>GOOGLE_SHEET_ID:</strong> {envData.GOOGLE_SHEET_ID}</div>
        <div><strong>NEXT_PUBLIC_GOOGLE_SHEET_ID:</strong> {envData.NEXT_PUBLIC_GOOGLE_SHEET_ID}</div>
        <div><strong>NODE_ENV:</strong> {envData.NODE_ENV}</div>
        <div><strong>Related Env Keys:</strong> {envData.AllEnvKeys?.join(', ')}</div>
      </div>
      <div className="mt-4">
        <h2 className="font-bold">Test API Endpoint</h2>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={async () => {
            try {
              const response = await fetch('/api/sync-sheets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ test: true })
              });
              const result = await response.json();
              alert(`API Response: ${JSON.stringify(result, null, 2)}`);
            } catch (err) {
              alert(`Error: ${err.message}`);
            }
          }}
        >
          Test Sync Sheets API
        </button>
      </div>
    </div>
  );
}