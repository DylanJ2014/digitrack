import React from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu, BookOpen, Play, MessageSquare } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DashboardHeader({ user }) {
  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="shadow-md border-b border-gray-200" style={{ backgroundColor: '#0F2236' }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-white/50">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link to={createPageUrl('About')} className="cursor-pointer" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  About DigiTrack
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={createPageUrl('FAQs')} className="cursor-pointer" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  FAQs
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={createPageUrl('Profile')} className="cursor-pointer" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  <User className="h-4 w-4 mr-2" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to={createPageUrl('Dashboard')} className="cursor-pointer">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988f8dff5282453314fa07b/a3cd37e81_DigiTrack.png" 
              alt="DigiTrack Logo" 
              className="h-14 hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right mr-2">
            <p className="font-semibold text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>{user?.display_name || user?.full_name}</p>
            <p className="text-xs text-white capitalize" style={{ fontFamily: 'Gill Sans, sans-serif' }}>{user?.user_type}</p>
          </div>
          {user?.user_type === 'student' && <NotificationBell userEmail={user.email} />}
        </div>
      </div>
    </div>
  );
}