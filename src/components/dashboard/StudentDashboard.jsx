import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardHeader from './DashboardHeader';
import LostItemCard from './LostItemCard';
import LogItemForm from './LogItemForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function StudentDashboard({ user }) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: lostItems = [], isLoading } = useQuery({
    queryKey: ['lostItems', user.email],
    queryFn: () => base44.entities.LostItem.filter({ reported_by: user.email, status: 'lost' }, '-created_date'),
  });

  const markFoundMutation = useMutation({
    mutationFn: (itemId) => base44.entities.LostItem.update(itemId, { 
      status: 'found', 
      found_date: new Date().toISOString().split('T')[0],
      found_by: user.email 
    }),
    onSuccess: () => queryClient.invalidateQueries(['lostItems']),
  });

  const createItemMutation = useMutation({
    mutationFn: (data) => base44.entities.LostItem.create({
      ...data,
      student_name: user.full_name,
      form_group: user.form_group,
      year_group: extractYearGroup(user.form_group),
      status: 'lost',
      reported_by: user.email
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['lostItems']);
      setShowForm(false);
    },
  });

  const extractYearGroup = (formGroup) => {
    const match = formGroup?.match(/(\d+)/);
    if (match) {
      const year = parseInt(match[1]);
      if (year >= 7 && year <= 13) return `Year ${year}`;
    }
    return 'Year 7';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#254B77' }}>
      <DashboardHeader user={user} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            My Lost Items
          </h2>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="bg-white hover:bg-gray-100" style={{ color: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
                <Plus className="h-4 w-4 mr-2" />
                Log Lost Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: 'Gill Sans, sans-serif' }}>Log a Lost Item</DialogTitle>
              </DialogHeader>
              <LogItemForm 
                onSubmit={(data) => createItemMutation.mutate(data)}
                isLoading={createItemMutation.isPending}
                studentName={user.full_name}
                formGroup={user.form_group}
                hideStudentFields
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-white text-center py-8">Loading...</div>
        ) : lostItems.length === 0 ? (
          <div className="bg-white/10 rounded-lg p-8 text-center">
            <p className="text-white text-lg" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              No lost items reported. Click "Log Lost Item" to report a missing item.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lostItems.map((item) => (
              <LostItemCard 
                key={item.id} 
                item={item} 
                onMarkFound={() => markFoundMutation.mutate(item.id)}
                isMarkingFound={markFoundMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}