import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardHeader from './DashboardHeader';
import LostItemCard from './LostItemCard';
import LogItemForm from './LogItemForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StudentDashboard({ user }) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: myLostItems = [], isLoading: isLoadingMine } = useQuery({
    queryKey: ['myLostItems', user.email],
    queryFn: async () => {
      const allItems = await base44.entities.LostItem.list('-created_date');
      return allItems.filter(item => 
        item.reported_by === user.email ||
        (item.student_name?.toLowerCase() === (user.display_name || user.full_name)?.toLowerCase() &&
         item.form_group?.toLowerCase() === user.form_group?.toLowerCase())
      );
    },
  });

  const { data: allLostItems = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['allLostItems'],
    queryFn: () => base44.entities.LostItem.filter({ status: 'lost' }, '-created_date'),
  });

  const filteredAllItems = allLostItems.filter(item => 
    item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.last_location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markFoundMutation = useMutation({
    mutationFn: (itemId) => base44.entities.LostItem.update(itemId, { 
      status: 'found', 
      found_date: new Date().toISOString().split('T')[0],
      found_by: user.email 
    }),
    onSuccess: () => queryClient.invalidateQueries(['lostItems']),
  });

  const deleteItemMutation = useMutation({
    mutationFn: (itemId) => base44.entities.LostItem.delete(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries(['myLostItems']);
      queryClient.invalidateQueries(['allLostItems']);
    },
  });

  const createItemMutation = useMutation({
    mutationFn: (data) => base44.entities.LostItem.create({
      ...data,
      student_name: user.display_name || user.full_name,
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
            {user.display_name || user.full_name}'s Lost Items
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
                studentName={user.display_name || user.full_name}
                formGroup={user.form_group}
                hideStudentFields
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="my-items" className="w-full">
          <TabsList className="bg-white/10 mb-4">
            <TabsTrigger value="my-items" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#254B77]" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              My Lost Items
            </TabsTrigger>
            <TabsTrigger value="find-items" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#254B77]" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              <Search className="h-4 w-4 mr-2" />
              Find Lost Items
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-items">
            <div className="mb-4 flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                style={statusFilter === 'all' ? { backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' } : { fontFamily: 'Gill Sans, sans-serif' }}
              >
                All Items
              </Button>
              <Button
                variant={statusFilter === 'lost' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('lost')}
                style={statusFilter === 'lost' ? { backgroundColor: '#dc2626', fontFamily: 'Gill Sans, sans-serif' } : { fontFamily: 'Gill Sans, sans-serif' }}
              >
                Lost
              </Button>
              <Button
                variant={statusFilter === 'found' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('found')}
                style={statusFilter === 'found' ? { backgroundColor: '#22c55e', fontFamily: 'Gill Sans, sans-serif' } : { fontFamily: 'Gill Sans, sans-serif' }}
              >
                Located
              </Button>
            </div>
            {isLoadingMine ? (
              <div className="text-white text-center py-8">Loading...</div>
            ) : myLostItems.filter(item => statusFilter === 'all' || item.status === statusFilter).length === 0 ? (
              <div className="bg-white/10 rounded-lg p-8 text-center">
                <p className="text-white text-lg" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  {statusFilter === 'all' 
                    ? "No lost items reported. Click \"Log Lost Item\" to report a missing item."
                    : `No ${statusFilter === 'lost' ? 'Lost' : 'Located'} items.`}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myLostItems.filter(item => statusFilter === 'all' || item.status === statusFilter).map((item) => (
                  <LostItemCard 
                    key={item.id} 
                    item={item} 
                    onMarkFound={() => markFoundMutation.mutate(item.id)}
                    isMarkingFound={markFoundMutation.isPending}
                    onDelete={() => deleteItemMutation.mutate(item.id)}
                    canDelete={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="find-items">
            <div className="mb-4">
              <Input
                placeholder="Search by item name, description, student name, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white"
                style={{ fontFamily: 'Gill Sans, sans-serif' }}
              />
            </div>
            {isLoadingAll ? (
              <div className="text-white text-center py-8">Loading...</div>
            ) : filteredAllItems.length === 0 ? (
              <div className="bg-white/10 rounded-lg p-8 text-center">
                <p className="text-white text-lg" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  No lost items found matching your search.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAllItems.map((item) => (
                  <LostItemCard 
                    key={item.id} 
                    item={item} 
                    onMarkFound={() => markFoundMutation.mutate(item.id)}
                    isMarkingFound={markFoundMutation.isPending}
                    showStudentInfo
                    currentUserEmail={user.email}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}