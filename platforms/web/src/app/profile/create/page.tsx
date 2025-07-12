'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase-config'; // Use the initialized app

function VerifyTokenComponent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('Verifying your invitation...');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setMessage('No verification token found. Please use the link from your email.');
      return;
    }

    const verify = async () => {
      try {
        const functions = getFunctions(app); // Get functions instance from the app
        const verifyBetaToken = httpsCallable(functions, 'verifyBetaToken');
        
        const result: any = await verifyBetaToken({ token });

        if (result.data.success) {
          setMessage('Invitation verified successfully! You can create a profile for:');
          setEmail(result.data.email);
        } else {
          // This case might not be reached if the function throws an error instead
          setError('Verification failed. The link may be invalid.');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unknown error occurred. The link may have expired or been used already.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-center text-emerald-400">Beta Access Verification</h1>
        {error ? (
          <div className="text-center text-red-400">
            <p><strong>Error</strong></p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-300">{message}</p>
            {email && <p className="mt-2 text-xl font-mono p-3 bg-gray-900 border border-emerald-500 rounded-md text-emerald-300">{email}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap the component in Suspense as required by Next.js when using useSearchParams
export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>}>
            <VerifyTokenComponent />
        </Suspense>
    );
} 