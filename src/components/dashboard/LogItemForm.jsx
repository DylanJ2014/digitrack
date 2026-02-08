import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function LogItemForm({ onSubmit, isLoading, studentName, formGroup, hideStudentFields }) {
  const [formData, setFormData] = useState({
    student_name: studentName || '',
    form_group: formGroup || '',
    item_name: '',
    description: '',
    date_lost: new Date().toISOString().split('T')[0],
    last_location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!hideStudentFields && (
        <>
          <div className="space-y-2">
            <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Student Full Name</Label>
            <Input
              value={formData.student_name}
              onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
              placeholder="Enter student's full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Form Group</Label>
            <Input
              value={formData.form_group}
              onChange={(e) => setFormData({ ...formData, form_group: e.target.value })}
              placeholder="e.g. 9A"
              required
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Item Name</Label>
        <Input
          value={formData.item_name}
          onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
          placeholder="e.g. Blue Water Bottle"
          required
        />
      </div>

      <div className="space-y-2">
        <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the item (colour, brand, any distinguishing features)"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Date Lost</Label>
        <Input
          type="date"
          value={formData.date_lost}
          onChange={(e) => setFormData({ ...formData, date_lost: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Last Known Location</Label>
        <Input
          value={formData.last_location}
          onChange={(e) => setFormData({ ...formData, last_location: e.target.value })}
          placeholder="e.g. Science Block, Room 12"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        style={{ backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}
        disabled={isLoading}
      >
        {isLoading ? 'Logging Item...' : 'Log Lost Item'}
      </Button>
    </form>
  );
}