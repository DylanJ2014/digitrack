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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#254B77' }}>
        <div className="text-white text-xl" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#0F2236', fontFamily: 'Gill Sans, sans-serif' }}>
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
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to DigiTrack</h1>
          <p className="text-2xl text-white/90 mb-3">Log, Locate, Love Lost Property</p>
          <p className="text-lg text-white/70">Caterham School's digital lost property management system</p>
        </div>
        
        <Button 
          onClick={handleLogin}
          className="w-full max-w-sm text-lg py-7 shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: '#254B77', color: 'white', fontFamily: 'Gill Sans, sans-serif' }}
        >
          Login / Register
        </Button>

        <div className="mt-12 text-white/60 text-sm">
          <p className="mb-2">For Students • Parents • Staff</p>
          <p className="text-xs text-white/50">Please use your @caterhamschool.co.uk email address</p>
        </div>
      </div>
    </div>
  );
}