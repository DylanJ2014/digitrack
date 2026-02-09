import React from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { createPageUrl } from '@/utils';
import NotificationBell from './NotificationBell';

export default function DashboardHeader({ user }) {
  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="shadow-md border-b border-gray-200" style={{ backgroundColor: '#0F2236' }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988f8dff5282453314fa07b/a3cd37e81_DigiTrack.png" 
            alt="DigiTrack Logo" 
            className="h-14"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right mr-2">
            <p className="font-semibold text-gray-800" style={{ fontFamily: 'Gill Sans, sans-serif' }}>{user?.display_name || user?.full_name}</p>
            <p className="text-xs text-gray-600 capitalize" style={{ fontFamily: 'Gill Sans, sans-serif' }}>{user?.user_type}</p>
          </div>
          {user?.user_type === 'student' && <NotificationBell userEmail={user.email} />}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => window.location.href = createPageUrl('Profile')}
            className="hover:bg-white/50"
          >
            <User className="h-5 w-5 text-white" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="hover:bg-white/50"
          >
            <LogOut className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}