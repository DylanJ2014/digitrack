import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const user = await base44.auth.me();
        if (user.is_registered) {
          window.location.href = createPageUrl('Dashboard');
        } else {
          window.location.href = createPageUrl('Registration');
        }
      } else {
        setChecking(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl('Dashboard'));
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-700 text-xl font-medium" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
      <div className="text-center max-w-2xl">
        <div className="flex items-center justify-center gap-6 mb-8">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988f8dff5282453314fa07b/a3cd37e81_DigiTrack.png" 
            alt="DigiTrack Logo" 
            className="h-28"
          />
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988f8dff5282453314fa07b/c704f0cd0_CaterhamLogo1.png" 
            alt="Caterham School Logo" 
            className="h-28"
          />
        </div>
        
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to DigiTrack</h1>
          <p className="text-2xl text-gray-700 mb-3">Log, Locate, Love Lost Property</p>
          <p className="text-lg text-gray-600">Caterham School's digital lost property management system</p>
        </div>
        
        <Button 
          onClick={handleLogin}
          className="w-full max-w-sm text-lg py-7 shadow-lg hover:shadow-xl transition-all bg-teal-600 hover:bg-teal-700 text-white border-0"
          style={{ fontFamily: 'Gill Sans, sans-serif' }}
        >
          Login / Register
        </Button>

        <div className="mt-12 text-gray-500 text-sm">
          <p className="mb-2">For Students • Parents • Staff</p>
          <p className="text-xs text-gray-400">Please use your @caterhamschool.co.uk email address</p>
        </div>
      </div>
    </div>
  );
}