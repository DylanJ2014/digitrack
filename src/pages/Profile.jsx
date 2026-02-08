import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createPageUrl } from '@/utils';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('Profile'));
        return;
      }
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setFormData({
        full_name: currentUser.full_name || '',
        form_group: currentUser.form_group || '',
        house: currentUser.house || '',
        child_name: currentUser.child_name || '',
        child_form_group: currentUser.child_form_group || '',
        staff_role: currentUser.staff_role || ''
      });
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const updateData = {};
    if (formData.full_name !== undefined) updateData.full_name = formData.full_name;
    if (user.user_type === 'student') {
      if (formData.form_group !== undefined) updateData.form_group = formData.form_group;
      if (formData.house !== undefined) updateData.house = formData.house;
    } else if (user.user_type === 'parent') {
      if (formData.child_name !== undefined) updateData.child_name = formData.child_name;
      if (formData.child_form_group !== undefined) updateData.child_form_group = formData.child_form_group;
    } else if (user.user_type === 'staff') {
      if (formData.staff_role !== undefined) updateData.staff_role = formData.staff_role;
    }
    
    try {
      await base44.auth.updateMe(updateData);
      alert('Profile updated successfully!');
      window.location.href = createPageUrl('Dashboard');
    } catch (error) {
      console.error('Failed to save:', error);
      alert(`Failed to save: ${error.message || 'Please try again.'}`);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#254B77' }}>
        <div className="text-white text-center py-8" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
      <DashboardHeader user={user} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Gill Sans, sans-serif' }}>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Full Name</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Email</Label>
                <Input value={user.email} disabled style={{ fontFamily: 'Gill Sans, sans-serif' }} />
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>User Type</Label>
                <Input value={user.user_type} disabled className="capitalize" style={{ fontFamily: 'Gill Sans, sans-serif' }} />
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Gill Sans, sans-serif' }}>User type cannot be changed</p>
              </div>

              {user.user_type === 'student' && (
                <>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Form Group</Label>
                    <Input
                      value={formData.form_group}
                      onChange={(e) => setFormData({ ...formData, form_group: e.target.value })}
                      placeholder="e.g. 9A"
                      style={{ fontFamily: 'Gill Sans, sans-serif' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>House</Label>
                    <Input
                      value={formData.house}
                      onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                      placeholder="e.g. Windsor"
                      style={{ fontFamily: 'Gill Sans, sans-serif' }}
                    />
                  </div>
                </>
              )}

              {user.user_type === 'parent' && (
                <>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Child's Full Name</Label>
                    <Input
                      value={formData.child_name}
                      onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                      style={{ fontFamily: 'Gill Sans, sans-serif' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Child's Form Group</Label>
                    <Input
                      value={formData.child_form_group}
                      onChange={(e) => setFormData({ ...formData, child_form_group: e.target.value })}
                      placeholder="e.g. 9A"
                      style={{ fontFamily: 'Gill Sans, sans-serif' }}
                    />
                  </div>
                </>
              )}

              {user.user_type === 'staff' && (
                <div className="space-y-2">
                  <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Staff Role</Label>
                  <Input
                    value={formData.staff_role}
                    onChange={(e) => setFormData({ ...formData, staff_role: e.target.value })}
                    placeholder="e.g. Teacher, Admin"
                    style={{ fontFamily: 'Gill Sans, sans-serif' }}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  style={{ backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.href = createPageUrl('Dashboard')}
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}