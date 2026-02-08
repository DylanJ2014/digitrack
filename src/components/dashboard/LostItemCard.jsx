import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, CheckCircle } from 'lucide-react';

export default function LostItemCard({ item, onMarkFound, isMarkingFound, showStudentInfo }) {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg" style={{ color: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
            {item.item_name}
          </CardTitle>
          <Badge variant="destructive" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Lost</Badge>
        </div>
        {showStudentInfo && (
          <div className="text-sm text-gray-600" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            <p className="font-medium">{item.student_name}</p>
            <p>{item.form_group}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {item.description && (
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span style={{ fontFamily: 'Gill Sans, sans-serif' }}>Lost on {item.date_lost}</span>
        </div>
        {item.last_location && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span style={{ fontFamily: 'Gill Sans, sans-serif' }}>{item.last_location}</span>
          </div>
        )}
        <Button 
          className="w-full mt-4" 
          style={{ backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}
          onClick={onMarkFound}
          disabled={isMarkingFound}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark as Found
        </Button>
      </CardContent>
    </Card>
  );
}