import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, CheckCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function LostItemCard({ item, onMarkFound, onMarkFoundPrePrep, onMarkFoundPrep, onMarkFoundSenior, isMarkingFound, showStudentInfo, onDelete, canDelete, currentUserEmail, onMarkLocated, isMarkingLocated, showLocationButtons }) {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg" style={{ color: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
              {item.item_name}
            </CardTitle>
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          {item.status === 'awaiting_collection' ? (
            <Badge className="bg-amber-500 hover:bg-amber-600" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Awaiting Collection</Badge>
          ) : item.status === 'found' ? (
            <Badge className="bg-green-500 hover:bg-green-600" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Located</Badge>
          ) : (
            <Badge variant="destructive" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Lost</Badge>
          )}
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
          <span style={{ fontFamily: 'Gill Sans, sans-serif' }}>Lost on {format(new Date(item.date_lost), 'dd-MM-yyyy')}</span>
        </div>
        {item.last_location && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span style={{ fontFamily: 'Gill Sans, sans-serif' }}>{item.last_location}</span>
          </div>
        )}
        {item.status === 'lost' && showLocationButtons && (
          <div className="space-y-2 mt-4">
            <Button 
              className="w-full" 
              size="xs"
              style={{ backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}
              onClick={onMarkFoundPrePrep}
              disabled={isMarkingFound}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Drop to Pre-Prep Lost Property
            </Button>
            <Button 
              className="w-full" 
              size="xs"
              style={{ backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}
              onClick={onMarkFoundPrep}
              disabled={isMarkingFound}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Drop to Prep Lost Property
            </Button>
            <Button 
              className="w-full" 
              size="xs"
              style={{ backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}
              onClick={onMarkFoundSenior}
              disabled={isMarkingFound}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Drop to Senior Lost Property
            </Button>
          </div>
        )}
        {item.status === 'lost' && onMarkFound && !showLocationButtons && (
          <Button 
            className="w-full mt-4" 
            style={{ backgroundColor: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}
            onClick={onMarkFound}
            disabled={isMarkingFound}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Found
          </Button>
        )}
        {item.status === 'awaiting_collection' && onMarkLocated && (
          <Button 
            className="w-full mt-4 bg-green-600 hover:bg-green-700" 
            style={{ fontFamily: 'Gill Sans, sans-serif' }}
            onClick={onMarkLocated}
            disabled={isMarkingLocated}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Located
          </Button>
        )}
        {item.status === 'found' && (
          <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
            <p className="text-sm text-green-700 font-medium" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              ✓ {item.found_by === currentUserEmail && item.reported_by === currentUserEmail ? 'Successfully Located' : 'Item successfully claimed'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}