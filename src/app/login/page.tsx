'use client';

import Login from '@/components/Login';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('user/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Login />
    </div>
  );
}