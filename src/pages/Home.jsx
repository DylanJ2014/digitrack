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
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
      <div className="text-center max-w-md">
        <div className="mb-8">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988f8dff5282453314fa07b/a3cd37e81_DigiTrack.png" 
            alt="DigiTrack Logo" 
            className="h-24 mx-auto mb-6"
          />
          <p className="text-xl text-white/80 mb-2">Log, Locate, Love Lost Property</p>
          <p className="text-white/60">Your school's lost property management system</p>
        </div>
        
        <Button 
          onClick={handleLogin}
          className="w-full max-w-xs bg-white hover:bg-gray-100 text-lg py-6"
          style={{ color: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}
        >
          Login / Register
        </Button>

        <div className="mt-8 text-white/60 text-sm">
          <p>Students • Parents • Staff</p>
        </div>
      </div>
    </div>
  );
}