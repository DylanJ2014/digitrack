import React from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function DashboardHeader({ user }) {
  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="shadow-sm" style={{ backgroundColor: '#BCCAF0' }}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988f8dff5282453314fa07b/a3cd37e81_DigiTrack.png" 
              alt="DigiTrack Logo" 
              className="h-12 mb-1"
            />
            <p className="text-sm text-black" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              Log, Locate, Love Lost Property
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium" style={{ fontFamily: 'Gill Sans, sans-serif' }}>{user?.full_name}</p>
            <p className="text-sm text-black capitalize" style={{ fontFamily: 'Gill Sans, sans-serif' }}>{user?.user_type}</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => window.location.href = createPageUrl('Profile')}>
            <User className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}