import React from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function DashboardHeader({ user }) {
  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
              DigiTrack
            </h1>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              Log, Locate, Love Lost Property
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium" style={{ fontFamily: 'Gill Sans, sans-serif' }}>{user?.full_name}</p>
            <p className="text-sm text-gray-500 capitalize" style={{ fontFamily: 'Gill Sans, sans-serif' }}>{user?.user_type}</p>
          </div>
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}