import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createPageUrl } from '@/utils';

export default function Registration() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    form_group: '',
    house: '',
    child_name: '',
    child_form_group: '',
    staff_role: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(createPageUrl('Registration'));
        return;
      }
      const currentUser = await base44.auth.me();
      if (currentUser.is_registered) {
        window.location.href = createPageUrl('Dashboard');
        return;
      }
      setUser(currentUser);
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const updateData = {
      user_type: userType,
      is_registered: true
    };

    if (userType === 'student') {
      updateData.form_group = formData.form_group;
      updateData.house = formData.house;
    } else if (userType === 'parent') {
      updateData.child_name = formData.child_name;
      updateData.child_form_group = formData.child_form_group;
    } else if (userType === 'staff') {
      updateData.staff_role = formData.staff_role;
    }

    await base44.auth.updateMe(updateData);
    window.location.href = createPageUrl('Dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#254B77' }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Complete Your Registration</CardTitle>
          <p className="text-sm text-gray-600 mt-2">Welcome, {user?.full_name}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>I am a...</Label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {userType === 'student' && (
              <>
                <div className="space-y-2">
                  <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Form Group</Label>
                  <Input
                    value={formData.form_group}
                    onChange={(e) => setFormData({ ...formData, form_group: e.target.value })}
                    placeholder="e.g. 9A"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>House</Label>
                  <Input
                    value={formData.house}
                    onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                    placeholder="e.g. Windsor"
                    required
                  />
                </div>
              </>
            )}

            {userType === 'parent' && (
              <>
                <div className="space-y-2">
                  <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Child's Full Name</Label>
                  <Input
                    value={formData.child_name}
                    onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                    placeholder="Enter your child's full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Child's Form Group</Label>
                  <Input
                    value={formData.child_form_group}
                    onChange={(e) => setFormData({ ...formData, child_form_group: e.target.value })}
                    placeholder="e.g. 9A"
                    required
                  />
                </div>
              </>
            )}

            {userType === 'staff' && (
              <div className="space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Staff Role</Label>
                <Input
                  value={formData.staff_role}
                  onChange={(e) => setFormData({ ...formData, staff_role: e.target.value })}
                  placeholder="e.g. Teacher, Admin, Receptionist"
                  required
                />
              </div>
            )}

            {userType && (
              <Button 
                type="submit" 
                className="w-full"
                style={{ backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}
                disabled={submitting}
              >
                {submitting ? 'Completing Registration...' : 'Complete Registration'}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}