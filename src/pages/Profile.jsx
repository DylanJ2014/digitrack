import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
        display_name: currentUser.display_name || currentUser.full_name || '',
        school: currentUser.school || '',
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
    
    const updateData = {
      display_name: formData.display_name
    };
    
    if (user.user_type === 'student') {
      updateData.school = formData.school;
      updateData.form_group = formData.form_group;
      updateData.house = formData.house;
    } else if (user.user_type === 'parent') {
      updateData.child_name = formData.child_name;
      updateData.child_form_group = formData.child_form_group;
    } else if (user.user_type === 'staff') {
      updateData.staff_role = formData.staff_role;
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
      <div className="min-h-screen bg-gray-100">
        <div className="text-gray-700 text-center py-8 font-medium" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
      <DashboardHeader user={user} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Full Name</Label>
                <Input
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Email</Label>
                <Input value={user.email} disabled className="bg-gray-100" style={{ fontFamily: 'Gill Sans, sans-serif' }} />
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium" style={{ fontFamily: 'Gill Sans, sans-serif' }}>User Type</Label>
                <Input value={user.user_type} disabled className="capitalize bg-gray-100" style={{ fontFamily: 'Gill Sans, sans-serif' }} />
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Gill Sans, sans-serif' }}>User type cannot be changed</p>
              </div>

              {user.user_type === 'student' && (
                <>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>School</Label>
                    <Select value={formData.school} onValueChange={(value) => setFormData({ ...formData, school: value })}>
                      <SelectTrigger style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                        <SelectValue placeholder="Select your school" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pre-Prep">Pre-Prep</SelectItem>
                        <SelectItem value="Prep">Prep</SelectItem>
                        <SelectItem value="Senior School">Senior School</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                    <Select value={formData.house} onValueChange={(value) => setFormData({ ...formData, house: value })}>
                      <SelectTrigger style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                        <SelectValue placeholder="Select your house" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Viewpoint">Viewpoint</SelectItem>
                        <SelectItem value="Foxburrow">Foxburrow</SelectItem>
                        <SelectItem value="Pilgrims">Pilgrims</SelectItem>
                        <SelectItem value="Underwood">Underwood</SelectItem>
                        <SelectItem value="Lewisham">Lewisham</SelectItem>
                        <SelectItem value="Aldercombe">Aldercombe</SelectItem>
                        <SelectItem value="Newington">Newington</SelectItem>
                        <SelectItem value="Harestone">Harestone</SelectItem>
                        <SelectItem value="Ridgefield">Ridgefield</SelectItem>
                        <SelectItem value="Beech Hanger">Beech Hanger</SelectItem>
                        <SelectItem value="Townsend/Viney">Townsend/Viney</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <Select value={formData.staff_role} onValueChange={(value) => setFormData({ ...formData, staff_role: value })}>
                    <SelectTrigger style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lost Property Coordinator - Pre-Prep">Lost Property Coordinator - Pre-Prep</SelectItem>
                      <SelectItem value="Lost Property Coordinator - Prep">Lost Property Coordinator - Prep</SelectItem>
                      <SelectItem value="Lost Property Coordinator - Senior">Lost Property Coordinator - Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white border-0"
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.href = createPageUrl('Dashboard')}
                  className="border-gray-300"
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