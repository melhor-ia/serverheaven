"use client";

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCallFunction = async () => {
    setLoading(true);
    setMessage('');
    try {
      // The URL of your function will be different in production
      const functionUrl = 'http://localhost:5001/server-heaven-c6fb1/us-central1/getGreeting';
      const response = await fetch(functionUrl);
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error calling function:", error);
      setMessage('Failed to get message. Check console.');
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        <button
          onClick={handleCallFunction}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {loading ? 'Calling...' : 'Call Backend Function'}
        </button>
      </div>
      {message && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-800">{message}</p>
        </div>
      )}
    </main>
  );
}
