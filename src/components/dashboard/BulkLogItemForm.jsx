import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Camera, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function BulkLogItemForm({ onSubmit, isLoading, hideLastLocation }) {
  const [items, setItems] = useState([
    { student_name: '', student_email: '', item_name: '', item_category: '', description: '', date_lost: '', last_location: '', photo_url: '', photo_preview: '', uploading_photo: false }
  ]);
  const fileInputRefs = useRef([]);
  const cameraInputRefs = useRef([]);

  const handlePhotoUpload = async (index, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    updateItem(index, 'photo_preview', preview);
    updateItem(index, 'uploading_photo', true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    updateItem(index, 'photo_url', file_url);
    updateItem(index, 'uploading_photo', false);
  };

  const addItem = () => {
    setItems([...items, { student_name: '', student_email: '', item_name: '', item_category: '', description: '', date_lost: '', last_location: '', photo_url: '', photo_preview: '', uploading_photo: false }]);
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
    
    // Validate all items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.item_category) {
        alert(`Item ${i + 1}: Please select an item name`);
        return;
      }
      if (item.item_category === 'Other' && !item.item_name) {
        alert(`Item ${i + 1}: Please enter a custom item name`);
        return;
      }
      if (!item.description) {
        alert(`Item ${i + 1}: Please enter a description`);
        return;
      }
      if (!item.date_lost) {
        alert(`Item ${i + 1}: Please select a date lost`);
        return;
      }
    }
    
    const processedItems = items.map(item => ({
      ...item,
      item_name: item.item_category === 'Other' ? item.item_name : item.item_category
    }));
    onSubmit(processedItems);
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
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Student Name</Label>
                <Input
                  value={item.student_name}
                  onChange={(e) => updateItem(index, 'student_name', e.target.value)}
                  placeholder="Full name"
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Student Email *</Label>
                <Input
                  type="email"
                  value={item.student_email}
                  onChange={(e) => updateItem(index, 'student_email', e.target.value)}
                  placeholder="student@caterhamschool.co.uk"
                  required
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Item Name *</Label>
                <Select 
                  value={item.item_category} 
                  onValueChange={(value) => {
                    updateItem(index, 'item_category', value);
                    if (value !== 'Other') updateItem(index, 'item_name', '');
                  }}
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

              {item.item_category === 'Other' && (
                <div className="space-y-2">
                  <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Custom Item Name *</Label>
                  <Input
                    value={item.item_name}
                    onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                    placeholder="Enter item name"
                    required
                    style={{ fontFamily: 'Gill Sans, sans-serif' }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Date Logged</Label>
                <Input
                  type="date"
                  value={new Date().toISOString().split('T')[0]}
                  disabled
                  className="bg-gray-100"
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                />
              </div>

              <div className="space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Date Lost *</Label>
                <Input
                  type="date"
                  value={item.date_lost}
                  onChange={(e) => updateItem(index, 'date_lost', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Description *</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Details about the item"
                  className="h-20"
                  style={{ fontFamily: 'Gill Sans, sans-serif' }}
                  required
                />
              </div>

              {!hideLastLocation && (
                <div className="col-span-2 space-y-2">
                  <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Last Known Location</Label>
                  <Input
                    value={item.last_location}
                    onChange={(e) => updateItem(index, 'last_location', e.target.value)}
                    placeholder="e.g. Gym, Science Lab"
                    style={{ fontFamily: 'Gill Sans, sans-serif' }}
                  />
                </div>
              )}

              <div className="col-span-2 space-y-2">
                <Label style={{ fontFamily: 'Gill Sans, sans-serif' }}>Photo of Item (optional)</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-gray-300"
                    style={{ fontFamily: 'Gill Sans, sans-serif' }}
                    onClick={() => fileInputRefs.current[index]?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-gray-300"
                    style={{ fontFamily: 'Gill Sans, sans-serif' }}
                    onClick={() => cameraInputRefs.current[index]?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
                <input
                  ref={el => fileInputRefs.current[index] = el}
                  type="file" accept="image/*" className="hidden"
                  onChange={(e) => handlePhotoUpload(index, e.target.files[0])}
                />
                <input
                  ref={el => cameraInputRefs.current[index] = el}
                  type="file" accept="image/*" capture="environment" className="hidden"
                  onChange={(e) => handlePhotoUpload(index, e.target.files[0])}
                />
                {item.uploading_photo && <p className="text-sm text-gray-500" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Uploading photo...</p>}
                {item.photo_preview && !item.uploading_photo && (
                  <div className="relative inline-block mt-2">
                    <img src={item.photo_preview} alt="Item preview" className="h-32 w-32 object-cover rounded-lg border border-gray-200" />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                      onClick={() => { updateItem(index, 'photo_preview', ''); updateItem(index, 'photo_url', ''); }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
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
          className="bg-teal-600 hover:bg-teal-700 text-white border-0"
          style={{ fontFamily: 'Gill Sans, sans-serif' }}
        >
          {isLoading ? 'Logging Items...' : `Log ${items.length} Item${items.length > 1 ? 's' : ''}`}
        </Button>
      </div>
    </form>
  );
}