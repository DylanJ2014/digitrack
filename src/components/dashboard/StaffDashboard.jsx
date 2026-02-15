import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardHeader from './DashboardHeader';
import LostItemCard from './LostItemCard';
import LogItemForm from './LogItemForm';
import BulkLogItemForm from './BulkLogItemForm';
import { Button } from '@/components/ui/button';
import { Plus, FileText, ListPlus, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

export default function StaffDashboard({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('lost');
  const queryClient = useQueryClient();

  const { data: allLostItems = [], isLoading } = useQuery({
    queryKey: ['allLostItems'],
    queryFn: () => base44.entities.LostItem.list('-created_date'),
  });

  const markFoundMutation = useMutation({
    mutationFn: async (item) => {
      await base44.entities.LostItem.update(item.id, { 
        status: 'awaiting_collection', 
        found_date: new Date().toISOString().split('T')[0],
        found_by: user.email 
      });
      
      const studentEmail = item.reported_by;
      
      let locationMessage = '';
      if (user.staff_role === 'Lost Property Coordinator - Prep') {
        locationMessage = 'Head to Prep Lost Property';
      } else if (user.staff_role === 'Lost Property Coordinator - Pre-Prep') {
        locationMessage = 'Head to Pre-Prep Lost Property';
      } else if (user.staff_role === 'Lost Property Coordinator - Senior') {
        locationMessage = 'Head to Senior Lost Property';
      }
      
      const finderName = user.display_name || user.full_name;
      const notificationMessage = `Great news! Your ${item.item_name} has been found by ${finderName} and is ready for collection. ${locationMessage}`;
      
      await base44.entities.Notification.create({
        user_email: studentEmail,
        message: notificationMessage,
        item_name: item.item_name,
        item_id: item.id,
        is_read: false
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['allLostItems']),
  });

  const deleteItemMutation = useMutation({
    mutationFn: (itemId) => base44.entities.LostItem.delete(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries(['allLostItems']);
    },
  });

  const markLocatedMutation = useMutation({
    mutationFn: async (item) => {
      await base44.entities.LostItem.update(item.id, { 
        status: 'found', 
        found_date: new Date().toISOString().split('T')[0]
      });
      
      const studentEmail = item.reported_by;
      
      const notificationMessage = `Your ${item.item_name} has been collected and is now marked as located.`;
      
      await base44.entities.Notification.create({
        user_email: studentEmail,
        message: notificationMessage,
        item_name: item.item_name,
        item_id: item.id,
        is_read: false
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['allLostItems']),
  });

  const createItemMutation = useMutation({
    mutationFn: async (data) => {
      // Check if user exists
      const allUsers = await base44.entities.User.list();
      const userExists = allUsers.find(u => 
        u.display_name?.toLowerCase() === data.student_name.toLowerCase() &&
        u.form_group?.toLowerCase() === data.form_group.toLowerCase()
      );
      
      if (!userExists) {
        throw new Error('User does not exist in DigiTrack');
      }
      
      const allItems = await base44.entities.LostItem.list();
      const existingItem = allItems.find(existing => 
        existing.student_name.toLowerCase() === data.student_name.toLowerCase() &&
        existing.item_name.toLowerCase() === data.item_name.toLowerCase() &&
        existing.reported_by?.toLowerCase() === data.student_email.toLowerCase() &&
        existing.status === 'lost'
      );
      
      const reportedByEmail = data.student_email;
      
      if (existingItem) {
        await base44.entities.LostItem.update(existingItem.id, {
          status: 'awaiting_collection',
          found_date: new Date().toISOString().split('T')[0],
          found_by: user.email,
          last_location: data.last_location || existingItem.last_location
        });
        
        const studentEmail = existingItem.reported_by;
        
        let locationMessage = '';
        if (user.staff_role === 'Lost Property Coordinator - Prep') {
          locationMessage = 'Head to Prep Lost Property';
        } else if (user.staff_role === 'Lost Property Coordinator - Pre-Prep') {
          locationMessage = 'Head to Pre-Prep Lost Property';
        } else if (user.staff_role === 'Lost Property Coordinator - Senior') {
          locationMessage = 'Head to Senior Lost Property';
        }
        
        const finderName = user.display_name || user.full_name;
        const notificationMessage = `Great news! Your ${existingItem.item_name} has been located by ${finderName} and is ready for collection. ${locationMessage}`;
        
        await base44.entities.Notification.create({
          user_email: studentEmail,
          message: notificationMessage,
          item_name: existingItem.item_name,
          item_id: existingItem.id,
          is_read: false
        });
        
        return { matched: true };
      } else {
        await base44.entities.LostItem.create({
          ...data,
          year_group: extractYearGroup(data.form_group),
          status: 'lost',
          reported_by: reportedByEmail,
          date_logged: new Date().toISOString().split('T')[0]
        });
        return { matched: false };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries(['allLostItems']);
      setShowForm(false);
      if (result.matched) {
        alert('✓ Item matched with existing lost item and marked as located!');
      }
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const bulkCreateMutation = useMutation({
    mutationFn: async (items) => {
      const allItems = await base44.entities.LostItem.list();
      const allUsers = await base44.entities.User.list();
      const results = { matched: 0, created: 0, errors: [] };
      
      for (const item of items) {
        // Check if user exists
        const userExists = allUsers.find(u => 
          u.display_name?.toLowerCase() === item.student_name.toLowerCase() &&
          u.form_group?.toLowerCase() === item.form_group.toLowerCase()
        );
        
        if (!userExists) {
          results.errors.push(`${item.student_name} (${item.form_group}) does not exist in DigiTrack`);
          continue;
        }
        
        const existingItem = allItems.find(existing => 
          existing.student_name.toLowerCase() === item.student_name.toLowerCase() &&
          existing.item_name.toLowerCase() === item.item_name.toLowerCase() &&
          existing.reported_by?.toLowerCase() === item.student_email.toLowerCase() &&
          existing.status === 'lost'
        );
        
        const reportedByEmail = item.student_email;
        
        if (existingItem) {
          await base44.entities.LostItem.update(existingItem.id, {
            status: 'awaiting_collection',
            found_date: new Date().toISOString().split('T')[0],
            found_by: user.email,
            last_location: item.last_location || existingItem.last_location
          });
          
          const studentEmail = existingItem.reported_by;
          
          let locationMessage = '';
          if (user.staff_role === 'Lost Property Coordinator - Prep') {
            locationMessage = 'Head to Prep Lost Property';
          } else if (user.staff_role === 'Lost Property Coordinator - Pre-Prep') {
            locationMessage = 'Head to Pre-Prep Lost Property';
          } else if (user.staff_role === 'Lost Property Coordinator - Senior') {
            locationMessage = 'Head to Senior Lost Property';
          }
          
          const finderName = user.display_name || user.full_name;
          const notificationMessage = `Great news! Your ${existingItem.item_name} has been located by ${finderName} and is ready for collection. ${locationMessage}`;
          
          await base44.entities.Notification.create({
            user_email: studentEmail,
            message: notificationMessage,
            item_name: existingItem.item_name,
            item_id: existingItem.id,
            is_read: false
          });
          
          results.matched++;
        } else {
          await base44.entities.LostItem.create({
            ...item,
            year_group: extractYearGroup(item.form_group),
            status: 'lost',
            reported_by: reportedByEmail,
            date_logged: new Date().toISOString().split('T')[0]
          });
          results.created++;
        }
      }
      
      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries(['allLostItems']);
      setShowBulkForm(false);
      let message = `✓ ${results.matched} item(s) marked as located\n✓ ${results.created} new item(s) logged`;
      if (results.errors.length > 0) {
        message += `\n\n⚠️ Errors:\n${results.errors.join('\n')}`;
      }
      alert(message);
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

  const filteredItems = allLostItems.filter(item => {
    if (statusFilter === 'lost') return item.status === 'lost';
    if (statusFilter === 'awaiting_collection') return item.status === 'awaiting_collection';
    if (statusFilter === 'located') return item.status === 'found';
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader user={user} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 whitespace-nowrap" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            Staff Dashboard
          </h2>
          <div className="flex gap-3 flex-wrap">
            <Button 
              variant="outline"
              className="border-gray-300" 
              style={{ fontFamily: 'Gill Sans, sans-serif' }}
              onClick={() => queryClient.invalidateQueries(['allLostItems'])}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white border-0" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Single Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle style={{ fontFamily: 'Gill Sans, sans-serif' }}>Log a Lost Item</DialogTitle>
                </DialogHeader>
                <LogItemForm 
                  onSubmit={(data) => createItemMutation.mutate(data)}
                  isLoading={createItemMutation.isPending}
                  hideLastLocation
                />
              </DialogContent>
            </Dialog>

            <Dialog open={showBulkForm} onOpenChange={setShowBulkForm}>
              <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white border-0" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  <ListPlus className="h-4 w-4 mr-2" />
                  Log Multiple Items
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle style={{ fontFamily: 'Gill Sans, sans-serif' }}>Log Multiple Lost Items</DialogTitle>
                </DialogHeader>
                <BulkLogItemForm 
                  onSubmit={(items) => bulkCreateMutation.mutate(items)}
                  isLoading={bulkCreateMutation.isPending}
                  hideLastLocation
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

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
              <TabsTrigger value="located" className="text-gray-700 data-[state=active]:bg-green-500 data-[state=active]:text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                Located
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="bg-white border border-gray-200 mb-4">
            <TabsTrigger value="cards" className="text-gray-700 data-[state=active]:bg-teal-600 data-[state=active]:text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              Card View
            </TabsTrigger>
            <TabsTrigger value="report" className="text-gray-700 data-[state=active]:bg-teal-600 data-[state=active]:text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              <FileText className="h-4 w-4 mr-2" />
              Report View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            {isLoading ? (
              <div className="text-gray-700 text-center py-8 font-medium">Loading...</div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 text-lg" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  No items found.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <LostItemCard 
                    key={item.id} 
                    item={item} 
                    onMarkFound={item.status === 'lost' ? () => markFoundMutation.mutate(item) : undefined}
                    isMarkingFound={markFoundMutation.isPending}
                    onMarkLocated={item.status === 'awaiting_collection' ? () => markLocatedMutation.mutate(item) : undefined}
                    isMarkingLocated={markLocatedMutation.isPending}
                    showStudentInfo
                    onDelete={() => deleteItemMutation.mutate(item.id)}
                    canDelete={true}
                    currentUserEmail={user.email}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="report">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-0">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  Lost Property Report - All Years
                </h3>
                <p className="text-sm text-gray-500" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  {filteredItems.length} item(s) with status: {statusFilter.replace('_', ' ')}
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ fontFamily: 'Gill Sans, sans-serif' }}>Student Name</TableHead>
                    <TableHead style={{ fontFamily: 'Gill Sans, sans-serif' }}>Form Group</TableHead>
                    <TableHead style={{ fontFamily: 'Gill Sans, sans-serif' }}>Item</TableHead>
                    <TableHead style={{ fontFamily: 'Gill Sans, sans-serif' }}>Date Lost</TableHead>
                    <TableHead style={{ fontFamily: 'Gill Sans, sans-serif' }}>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell style={{ fontFamily: 'Gill Sans, sans-serif' }}>{item.student_name}</TableCell>
                      <TableCell style={{ fontFamily: 'Gill Sans, sans-serif' }}>{item.form_group}</TableCell>
                      <TableCell style={{ fontFamily: 'Gill Sans, sans-serif' }}>{item.item_name}</TableCell>
                      <TableCell style={{ fontFamily: 'Gill Sans, sans-serif' }}>{format(new Date(item.date_lost), 'dd-MM-yyyy')}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          className="bg-teal-600 hover:bg-teal-700 text-white border-0"
                          onClick={() => markFoundMutation.mutate(item)}
                          disabled={markFoundMutation.isPending}
                          style={{ fontFamily: 'Gill Sans, sans-serif' }}
                        >
                          Mark Found
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}