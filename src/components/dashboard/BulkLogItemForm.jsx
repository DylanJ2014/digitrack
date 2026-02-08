import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';

export default function BulkLogItemForm({ onSubmit, isLoading }) {
  const [items, setItems] = useState([
    { student_name: '', form_group: '', item_name: '', description: '', date_lost: '', last_location: '' }
  ]);

  const addItem = () => {
    setItems([...items, { student_name: '', form_group: '', item_name: '', description: '', date_lost: '', last_location: '' }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(items);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-2">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 relative bg-gray-50">
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeItem(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            <h4 className="font-semibold mb-3" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              Item {index + 1}
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Student Name *</Label>
                <Input
                  value={item.student_name}
                  onChange={(e) => updateItem(index, 'student_name', e.target.value)}
                  placeholder="Full name"
                  required
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Form Group *</Label>
                <Input
                  value={item.form_group}
                  onChange={(e) => updateItem(index, 'form_group', e.target.value)}
                  placeholder="e.g. 9A"
                  required
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Item Name *</Label>
                <Input
                  value={item.item_name}
                  onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                  placeholder="e.g. Water Bottle"
                  required
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Date Lost *</Label>
                <Input
                  type="date"
                  value={item.date_lost}
                  onChange={(e) => updateItem(index, 'date_lost', e.target.value)}
                  required
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Details about the item"
                  className="h-20"
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Last Known Location</Label>
                <Input
                  value={item.last_location}
                  onChange={(e) => updateItem(index, 'last_location', e.target.value)}
                  placeholder="e.g. Gym, Science Lab"
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          style={{ fontFamily: 'Gill Sans, sans-serif' }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Item
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}
        >
          {isLoading ? 'Logging Items...' : `Log ${items.length} Item${items.length > 1 ? 's' : ''}`}
        </Button>
      </div>
    </form>
  );
}