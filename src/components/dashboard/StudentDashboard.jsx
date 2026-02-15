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
      queryClient.invalidateQueries(['myLostItems', user.email]);
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
      queryClient.invalidateQueries(['myLostItems', user.email]);
      queryClient.invalidateQueries(['allLostItems']);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId) => {
      await base44.entities.LostItem.delete(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myLostItems', user.email]);
      queryClient.invalidateQueries(['allLostItems']);
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (data) => {
      const reportedByEmail = data.student_email || user.email;
      const studentName = data.student_name || user.display_name || user.full_name;
      
      const finalData = {
        ...data,
        student_name: studentName,
        status: 'lost',
        reported_by: reportedByEmail,
        date_logged: new Date().toISOString().split('T')[0]
      };
      
      // Only add form_group and year_group if logging for yourself
      if (!data.student_email || data.student_email === user.email) {
        finalData.form_group = user.form_group;
        finalData.year_group = extractYearGroup(user.form_group);
      }
      
      const item = await base44.entities.LostItem.create(finalData);
      
      // If logging for someone else, send notification
      if (data.student_email && data.student_email !== user.email) {
        const finderName = user.display_name || user.full_name;
        const message = `Your ${data.item_name} has been identified by ${finderName}. You will receive a further notification when to head to ${data.collection_location} to collect it.`;
        
        await base44.entities.Notification.create({
          user_email: data.student_email,
          message,
          item_name: data.item_name,
          item_id: item.id,
          is_read: false
        });
      }
      
      return item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['lostItems']);
      queryClient.invalidateQueries(['myLostItems', user.email]);
      queryClient.invalidateQueries(['allLostItems']);
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
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader user={user} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            {user.display_name || user.full_name}'s Lost Items
          </h2>
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <Button 
              variant="outline"
              className="flex-1 sm:flex-none border-gray-300" 
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
                <Button className="bg-teal-600 hover:bg-teal-700 text-white border-0 flex-1 sm:flex-none" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
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
          <TabsList className="bg-white border border-gray-200 mb-4">
            <TabsTrigger value="my-items" className="text-gray-700 data-[state=active]:bg-teal-600 data-[state=active]:text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              My Lost Items
            </TabsTrigger>
            <TabsTrigger value="find-items" className="text-gray-700 data-[state=active]:bg-teal-600 data-[state=active]:text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              <Search className="h-4 w-4 mr-2" />
              Find Lost Items
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-items">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <label className="text-gray-700 text-sm font-medium" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Filter by Status:</label>
              <Tabs value={statusFilter} onValueChange={setStatusFilter} className="bg-white border border-gray-200 rounded-lg">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="lost" className="text-gray-700 data-[state=active]:bg-red-500 data-[state=active]:text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                    Lost
                  </TabsTrigger>
                  <TabsTrigger value="awaiting_collection" className="text-gray-700 data-[state=active]:bg-amber-500 data-[state=active]:text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                    Awaiting Collection
                  </TabsTrigger>
                  <TabsTrigger value="found" className="text-gray-700 data-[state=active]:bg-green-500 data-[state=active]:text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                    Located
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {isLoadingMine ? (
              <div className="text-gray-700 text-center py-8 font-medium">Loading...</div>
            ) : myLostItems.filter(item => item.status === statusFilter).length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 text-lg" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
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
                    showOwnItemButtons={true}
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
                className="bg-white border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                style={{ fontFamily: 'Gill Sans, sans-serif' }}
              />
            </div>
            {isLoadingAll ? (
              <div className="text-gray-700 text-center py-8 font-medium">Loading...</div>
            ) : filteredAllItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 text-lg" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  No lost items found matching your search.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAllItems.map((item) => {
                  const isCreatedByMe = item.created_by === user.email;
                  return (
                    <LostItemCard 
                      key={item.id} 
                      item={item} 
                      onMarkFoundPrePrep={!isCreatedByMe ? () => markFoundMutation.mutate({ item, location: 'pre-prep' }) : undefined}
                      onMarkFoundPrep={!isCreatedByMe ? () => markFoundMutation.mutate({ item, location: 'prep' }) : undefined}
                      onMarkFoundSenior={!isCreatedByMe ? () => markFoundMutation.mutate({ item, location: 'senior' }) : undefined}
                      isMarkingFound={markFoundMutation.isPending}
                      onMarkLocated={!isCreatedByMe ? () => markLocatedMutation.mutate(item.id) : undefined}
                      isMarkingLocated={markLocatedMutation.isPending}
                      showStudentInfo
                      currentUserEmail={user.email}
                      showLocationButtons={!isCreatedByMe}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}