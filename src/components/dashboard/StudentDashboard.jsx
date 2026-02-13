import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardHeader from './DashboardHeader';
import LostItemCard from './LostItemCard';
import LogItemForm from './LogItemForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StudentDashboard({ user }) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('lost');

  const { data: myLostItems = [], isLoading: isLoadingMine } = useQuery({
    queryKey: ['myLostItems', user.email],
    queryFn: async () => {
      const allItems = await base44.entities.LostItem.list('-created_date');
      return allItems.filter(item => item.reported_by === user.email);
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
    mutationFn: async ({ item, location }) => {
      await base44.entities.LostItem.update(item.id, { 
        status: 'awaiting_collection', 
        found_date: new Date().toISOString().split('T')[0],
        found_by: user.email 
      });

      if (item.reported_by !== user.email) {
        let studentEmail = item.reported_by;
        try {
          const allUsers = await base44.entities.User.list();
          const studentUser = allUsers.find(u => 
            u.display_name?.toLowerCase() === item.student_name.toLowerCase() &&
            u.form_group?.toLowerCase() === item.form_group.toLowerCase()
          );
          if (studentUser) studentEmail = studentUser.email;
        } catch (error) {
          console.log('Could not fetch student email');
        }

        const locationText = location === 'pre-prep' ? 'Pre-Prep Lost Property' : 
                            location === 'prep' ? 'Prep Lost Property' : 
                            'Senior Lost Property';
        const finderName = user.display_name || user.full_name;
        const message = `Good News, your ${item.item_name} has been found by ${finderName}. Please head to the ${locationText} office to locate your item`;
        
        await base44.entities.Notification.create({
          user_email: studentEmail,
          message,
          item_name: item.item_name,
          item_id: item.id,
          is_read: false
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['lostItems']);
      queryClient.invalidateQueries(['myLostItems']);
      queryClient.invalidateQueries(['allLostItems']);
    },
  });

  const markLocatedMutation = useMutation({
    mutationFn: (itemId) => base44.entities.LostItem.update(itemId, { 
      status: 'found', 
      found_date: new Date().toISOString().split('T')[0]
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['lostItems']);
      queryClient.invalidateQueries(['myLostItems']);
      queryClient.invalidateQueries(['allLostItems']);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId) => {
      await base44.entities.LostItem.delete(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myLostItems']);
      queryClient.invalidateQueries(['allLostItems']);
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (data) => {
      const reportedByEmail = data.student_email || user.email;
      const studentName = data.student_name || user.display_name || user.full_name;
      const formGroupValue = data.form_group || user.form_group;
      
      const finalData = {
        ...data,
        student_name: studentName,
        form_group: formGroupValue,
        year_group: extractYearGroup(formGroupValue),
        status: 'lost',
        reported_by: reportedByEmail
      };
      return base44.entities.LostItem.create(finalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['lostItems']);
      queryClient.invalidateQueries(['myLostItems']);
      setShowForm(false);
    },
    onError: (error) => {
      alert(error.message);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            {user.display_name || user.full_name}'s Lost Items
          </h2>
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white flex-1 sm:flex-none" 
              style={{ fontFamily: 'Gill Sans, sans-serif' }}
              onClick={() => {
                queryClient.invalidateQueries(['myLostItems']);
                queryClient.invalidateQueries(['allLostItems']);
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="bg-white hover:bg-gray-100 flex-1 sm:flex-none" style={{ color: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
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
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <label className="text-white text-sm" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Filter by Status:</label>
              <Tabs value={statusFilter} onValueChange={setStatusFilter} className="bg-white/10 rounded-lg">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="lost" className="text-white data-[state=active]:bg-red-500 data-[state=active]:text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                    Lost
                  </TabsTrigger>
                  <TabsTrigger value="awaiting_collection" className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                    Awaiting Collection
                  </TabsTrigger>
                  <TabsTrigger value="found" className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                    Located
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {isLoadingMine ? (
              <div className="text-white text-center py-8">Loading...</div>
            ) : myLostItems.filter(item => item.status === statusFilter).length === 0 ? (
              <div className="bg-white/10 rounded-lg p-8 text-center">
                <p className="text-white text-lg" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  No {statusFilter === 'lost' ? 'Lost' : statusFilter === 'awaiting_collection' ? 'Awaiting Collection' : 'Located'} items.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myLostItems.filter(item => item.status === statusFilter).map((item) => (
                  <LostItemCard 
                    key={item.id} 
                    item={item} 
                    onMarkLocated={() => markLocatedMutation.mutate(item.id)}
                    isMarkingLocated={markLocatedMutation.isPending}
                    onDelete={() => deleteItemMutation.mutate(item.id)}
                    canDelete={true}
                    currentUserEmail={user.email}
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
                    onMarkFoundPrePrep={() => markFoundMutation.mutate({ item, location: 'pre-prep' })}
                    onMarkFoundPrep={() => markFoundMutation.mutate({ item, location: 'prep' })}
                    onMarkFoundSenior={() => markFoundMutation.mutate({ item, location: 'senior' })}
                    isMarkingFound={markFoundMutation.isPending}
                    onMarkLocated={() => markLocatedMutation.mutate(item.id)}
                    isMarkingLocated={markLocatedMutation.isPending}
                    showStudentInfo
                    currentUserEmail={user.email}
                    showLocationButtons
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