import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import ParentDashboard from '@/components/dashboard/ParentDashboard';
import StaffDashboard from '@/components/dashboard/StaffDashboard';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('Dashboard'));
        return;
      }
      const currentUser = await base44.auth.me();
      if (!currentUser.is_registered) {
        window.location.href = createPageUrl('Registration');
        return;
      }
      setUser(currentUser);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#254B77' }}>
        <div className="text-white text-xl" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
      {user?.user_type === 'student' && <StudentDashboard user={user} />}
      {user?.user_type === 'parent' && <ParentDashboard user={user} />}
      {user?.user_type === 'staff' && <StaffDashboard user={user} />}
    </div>
  );
}