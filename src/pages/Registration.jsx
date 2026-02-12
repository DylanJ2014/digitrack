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
    full_name: '',
    email: '',
    school: '',
    form_group: '',
    house: '',
    child_name: '',
    child_form_group: '',
    staff_role: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

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
    
    // Validate email domain
    const emailPattern = /^[a-zA-Z]+\.[a-zA-Z]+@caterhamschool\.co\.uk$/;
    if (!emailPattern.test(formData.email)) {
      setEmailError('Email must be in the format: firstname.surname@caterhamschool.co.uk');
      return;
    }
    
    setSubmitting(true);
    
    const updateData = {
      display_name: formData.full_name,
      email: formData.email,
      user_type: userType,
      is_registered: true
    };

    if (userType === 'student') {
      updateData.school = formData.school;
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0F2236', fontFamily: 'Gill Sans, sans-serif' }}>
      <Card className="w-full max-w-md" style={{ backgroundColor: '#254B77', color: 'white' }}>
        <CardHeader className="text-center">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988f8dff5282453314fa07b/a3cd37e81_DigiTrack.png" 
            alt="DigiTrack Logo" 
            className="h-16 mx-auto mb-4"
          />
          <CardTitle className="text-2xl text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Complete Your Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Full Name</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
                required
                style={{ fontFamily: 'Gill Sans, sans-serif' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>School Email Address</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setEmailError('');
                }}
                placeholder="firstname.surname@caterhamschool.co.uk"
                required
                style={{ fontFamily: 'Gill Sans, sans-serif' }}
              />
              {emailError && <p className="text-red-300 text-sm">{emailError}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>I am a...</Label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="staff">School Staff Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {userType === 'student' && (
              <>
                <div className="space-y-2">
                  <Label className="text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>School</Label>
                  <Select value={formData.school} onValueChange={(value) => setFormData({ ...formData, school: value })}>
                    <SelectTrigger>
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
                  <Label className="text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Form Group</Label>
                  <Input
                    value={formData.form_group}
                    onChange={(e) => setFormData({ ...formData, form_group: e.target.value })}
                    placeholder="e.g. 9A"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>House</Label>
                  <Select value={formData.house} onValueChange={(value) => setFormData({ ...formData, house: value })}>
                    <SelectTrigger>
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

            {userType === 'parent' && (
              <>
                <div className="space-y-2">
                  <Label className="text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Child's Full Name</Label>
                  <Input
                    value={formData.child_name}
                    onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                    placeholder="Enter your child's full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Child's Form Group</Label>
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
                <Label className="text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Staff Role</Label>
                <Select value={formData.staff_role} onValueChange={(value) => setFormData({ ...formData, staff_role: value })}>
                  <SelectTrigger>
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

            {userType && (
              <Button 
                type="submit" 
                className="w-full"
                style={{ backgroundColor: '#0F2236', fontFamily: 'Gill Sans, sans-serif' }}
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