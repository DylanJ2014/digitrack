import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Bell, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function NotificationBell({ userEmail }) {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', userEmail],
    queryFn: () => base44.entities.Notification.filter({ user_email: userEmail }, '-created_date'),
    refetchInterval: 10000,
  });

  const markReadMutation = useMutation({
    mutationFn: (notificationId) => base44.entities.Notification.update(notificationId, { is_read: true }),
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-white/50">
          <Bell className="h-5 w-5 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <h3 className="font-semibold" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Notifications</h3>
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-gray-50 ${!notification.is_read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                      {notification.message}
                    </p>
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => markReadMutation.mutate(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                    {new Date(notification.created_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}