"use client";

import Link from 'next/link';
import Auth from "./components/Auth";
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-md text-center">
      <Auth />
      {user && (
        <div className="mt-8">
          <Link href="/servers/create" className="text-indigo-400 hover:text-indigo-300">
            Create a New Server
          </Link>
        </div>
      )}
    </div>
  );
}
