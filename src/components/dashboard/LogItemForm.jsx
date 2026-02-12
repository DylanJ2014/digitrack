import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LogItemForm({ onSubmit, isLoading, studentName, formGroup, hideStudentFields, hideLastLocation }) {
  const [loggingFor, setLoggingFor] = useState('myself'); // 'myself' or 'someone-else'
  const [formData, setFormData] = useState({
    student_name: studentName || '',
    form_group: formGroup || '',
    student_email: '',
    item_name: '',
    item_category: '',
    description: '',
    date_lost: new Date().toISOString().split('T')[0],
    last_location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.item_category) {
      alert('Please select an item name');
      return;
    }
    if (formData.item_category === 'Other' && !formData.item_name) {
      alert('Please enter a custom item name');
      return;
    }
    if (!formData.description) {
      alert('Please enter a description');
      return;
    }
    if (!formData.date_lost) {
      alert('Please select a date lost');
      return;
    }
    
    const submitData = {
      ...formData,
      item_name: formData.item_category === 'Other' ? formData.item_name : formData.item_category
    };
    onSubmit(submitData);
  };

  const showStudentFields = !hideStudentFields || loggingFor === 'someone-else';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {hideStudentFields && (
        <div className="space-y-2">
          <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Who are you logging this for?</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={loggingFor === 'myself' ? 'default' : 'outline'}
              onClick={() => {
                setLoggingFor('myself');
                setFormData({ ...formData, student_name: studentName, form_group: formGroup, student_email: '' });
              }}
              style={loggingFor === 'myself' ? { backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' } : { fontFamily: 'Gill Sans, sans-serif' }}
              className="flex-1"
            >
              Myself
            </Button>
            <Button
              type="button"
              variant={loggingFor === 'someone-else' ? 'default' : 'outline'}
              onClick={() => {
                setLoggingFor('someone-else');
                setFormData({ ...formData, student_name: '', form_group: '', student_email: '' });
              }}
              style={loggingFor === 'someone-else' ? { backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' } : { fontFamily: 'Gill Sans, sans-serif' }}
              className="flex-1"
            >
              Someone Else
            </Button>
          </div>
        </div>
      )}
      
      {showStudentFields && (
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
          <div className="space-y-2">
            <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Student Email</Label>
            <Input
              type="email"
              value={formData.student_email}
              onChange={(e) => setFormData({ ...formData, student_email: e.target.value })}
              placeholder="student@caterhamschool.co.uk"
              required
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Item Name *</Label>
        <Select 
          value={formData.item_category} 
          onValueChange={(value) => setFormData({ ...formData, item_category: value, item_name: '' })}
          required
        >
          <SelectTrigger style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            <SelectValue placeholder="Select item type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Prep Blazer">Prep Blazer</SelectItem>
            <SelectItem value="Senior Blazer">Senior Blazer</SelectItem>
            <SelectItem value="Prep Winter Coat">Prep Winter Coat</SelectItem>
            <SelectItem value="Prep Rain Jacket">Prep Rain Jacket</SelectItem>
            <SelectItem value="Senior Black Coat">Senior Black Coat</SelectItem>
            <SelectItem value="Senior Festival Coat">Senior Festival Coat</SelectItem>
            <SelectItem value="Shirt">Shirt</SelectItem>
            <SelectItem value="Girls Blouse">Girls Blouse</SelectItem>
            <SelectItem value="Trousers">Trousers</SelectItem>
            <SelectItem value="Shorts">Shorts</SelectItem>
            <SelectItem value="Socks">Socks</SelectItem>
            <SelectItem value="Sports Top">Sports Top</SelectItem>
            <SelectItem value="Sports Shorts">Sports Shorts</SelectItem>
            <SelectItem value="Tracksuit Bottoms">Tracksuit Bottoms</SelectItem>
            <SelectItem value="iPad">iPad</SelectItem>
            <SelectItem value="iPad Stylus">iPad Stylus</SelectItem>
            <SelectItem value="Water Bottle">Water Bottle</SelectItem>
            <SelectItem value="Pencil Case">Pencil Case</SelectItem>
            <SelectItem value="Sports Equipment">Sports Equipment</SelectItem>
            <SelectItem value="Back Pack">Back Pack</SelectItem>
            <SelectItem value="Prep Sports Bag">Prep Sports Bag</SelectItem>
            <SelectItem value="Senior Sports Bag">Senior Sports Bag</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.item_category === 'Other' && (
        <div className="space-y-2">
          <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Custom Item Name</Label>
          <Input
            value={formData.item_name}
            onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
            placeholder="Enter item name"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Description *</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the item (colour, brand, size, label text and any distinguishing features)"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Date Lost *</Label>
        <Input
          type="date"
          value={formData.date_lost}
          onChange={(e) => setFormData({ ...formData, date_lost: e.target.value })}
          required
        />
      </div>

      {!hideLastLocation && (
        <div className="space-y-2">
          <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Last Known Location</Label>
          <Input
            value={formData.last_location}
            onChange={(e) => setFormData({ ...formData, last_location: e.target.value })}
            placeholder="e.g. Science Block, Room 12"
          />
        </div>
      )}

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