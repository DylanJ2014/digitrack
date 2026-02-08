import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardHeader from './DashboardHeader';
import LostItemCard from './LostItemCard';
import LogItemForm from './LogItemForm';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function StaffDashboard({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [yearFilter, setYearFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: allLostItems = [], isLoading } = useQuery({
    queryKey: ['allLostItems'],
    queryFn: () => base44.entities.LostItem.filter({ status: 'lost' }, '-created_date'),
  });

  const markFoundMutation = useMutation({
    mutationFn: (itemId) => base44.entities.LostItem.update(itemId, { 
      status: 'found', 
      found_date: new Date().toISOString().split('T')[0],
      found_by: user.email 
    }),
    onSuccess: () => queryClient.invalidateQueries(['allLostItems']),
  });

  const createItemMutation = useMutation({
    mutationFn: (data) => base44.entities.LostItem.create({
      ...data,
      year_group: extractYearGroup(data.form_group),
      status: 'lost',
      reported_by: user.email
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['allLostItems']);
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

  const filteredItems = yearFilter === 'all' 
    ? allLostItems 
    : allLostItems.filter(item => item.year_group === yearFilter);

  const yearGroups = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#254B77' }}>
      <DashboardHeader user={user} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            Staff Dashboard
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
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="cards" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-white/10">
              <TabsTrigger value="cards" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#254B77]" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                Card View
              </TabsTrigger>
              <TabsTrigger value="report" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#254B77]" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                <FileText className="h-4 w-4 mr-2" />
                Report View
              </TabsTrigger>
            </TabsList>
            
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-40 bg-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                <SelectValue placeholder="Filter by Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {yearGroups.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="cards">
            {isLoading ? (
              <div className="text-white text-center py-8">Loading...</div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white/10 rounded-lg p-8 text-center">
                <p className="text-white text-lg" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  No lost items {yearFilter !== 'all' ? `for ${yearFilter}` : ''}.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <LostItemCard 
                    key={item.id} 
                    item={item} 
                    onMarkFound={() => markFoundMutation.mutate(item.id)}
                    isMarkingFound={markFoundMutation.isPending}
                    showStudentInfo
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="report">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold" style={{ color: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
                  Lost Property Report {yearFilter !== 'all' ? `- ${yearFilter}` : '- All Years'}
                </h3>
                <p className="text-sm text-gray-500" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  {filteredItems.length} item(s) currently missing
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ fontFamily: 'Gill Sans, sans-serif' }}>Student Name</TableHead>
                    <TableHead style={{ fontFamily: 'Gill Sans, sans-serif' }}>Form Group</TableHead>
                    <TableHead style={{ fontFamily: 'Gill Sans, sans-serif' }}>Item</TableHead>
                    <TableHead style={{ fontFamily: 'Gill Sans, sans-serif' }}>Date Lost</TableHead>
                    <TableHead style={{ fontFamily: 'Gill Sans, sans-serif' }}>Last Location</TableHead>
                    <TableHead style={{ fontFamily: 'Gill Sans, sans-serif' }}>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell style={{ fontFamily: 'Gill Sans, sans-serif' }}>{item.student_name}</TableCell>
                      <TableCell style={{ fontFamily: 'Gill Sans, sans-serif' }}>{item.form_group}</TableCell>
                      <TableCell style={{ fontFamily: 'Gill Sans, sans-serif' }}>{item.item_name}</TableCell>
                      <TableCell style={{ fontFamily: 'Gill Sans, sans-serif' }}>{item.date_lost}</TableCell>
                      <TableCell style={{ fontFamily: 'Gill Sans, sans-serif' }}>{item.last_location || '-'}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => markFoundMutation.mutate(item.id)}
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