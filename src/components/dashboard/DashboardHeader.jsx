import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu } from 'lucide-react';
import { createPageUrl } from '@/utils';
import NotificationBell from './NotificationBell';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function DashboardHeader({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="shadow-md border-b border-gray-200" style={{ backgroundColor: '#0F2236' }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-white/50">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64" style={{ backgroundColor: '#0F2236' }}>
              <SheetHeader>
                <SheetTitle className="text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={() => {
                    window.location.href = createPageUrl('Dashboard');
                    setSidebarOpen(false);
                  }}
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={() => {
                    window.location.href = createPageUrl('Profile');
                    setSidebarOpen(false);
                  }}
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                >
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={handleLogout}
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
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