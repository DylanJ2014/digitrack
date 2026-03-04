import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Calendar, CheckCircle, Trash2, ImageIcon, User, Tag } from 'lucide-react';
import { format } from 'date-fns';

function ItemDetailDialog({ item, open, onOpenChange, currentUserEmail, onMarkFound, isMarkingFound, onMarkLocated, isMarkingLocated }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Gill Sans, sans-serif' }} className="text-xl">
            {item.item_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge */}
          <div>
            {item.status === 'awaiting_collection' ? (
              <Badge className="bg-amber-500 hover:bg-amber-600" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Awaiting Collection</Badge>
            ) : item.status === 'found' ? (
              <Badge className="bg-green-500 hover:bg-green-600" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Returned</Badge>
            ) : (
              <Badge variant="destructive" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Lost</Badge>
            )}
          </div>

          {/* Photo */}
          {item.photo_url && (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img src={item.photo_url} alt={item.item_name} className="w-full object-contain max-h-64" />
            </div>
          )}

          {/* Details */}
          <div className="space-y-3 text-sm">
            {item.student_name && (
              <div className="flex items-start gap-2 text-gray-700">
                <User className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                <div style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  <p className="font-medium">{item.student_name}</p>
                  {item.form_group && <p className="text-gray-500">{item.form_group}</p>}
                </div>
              </div>
            )}

            {item.description && (
              <div className="flex items-start gap-2 text-gray-700">
                <Tag className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                <p style={{ fontFamily: 'Gill Sans, sans-serif' }}>{item.description}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="h-4 w-4 shrink-0" />
              <span style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                Lost on {format(new Date(item.date_lost), 'dd-MM-yyyy')}
              </span>
            </div>

            {item.date_logged && (
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="h-4 w-4 shrink-0" />
                <span style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                  Logged on {format(new Date(item.date_logged), 'dd-MM-yyyy')}
                </span>
              </div>
            )}

            {item.last_location && (
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4 shrink-0" />
                <span style={{ fontFamily: 'Gill Sans, sans-serif' }}>{item.last_location}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {item.status === 'lost' && onMarkFound && (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white border-0"
              style={{ fontFamily: 'Gill Sans, sans-serif' }}
              onClick={onMarkFound}
              disabled={isMarkingFound}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Located
            </Button>
          )}
          {item.status === 'lost' && onMarkLocated && (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white border-0"
              style={{ fontFamily: 'Gill Sans, sans-serif' }}
              onClick={onMarkLocated}
              disabled={isMarkingLocated}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Returned
            </Button>
          )}
          {item.status === 'awaiting_collection' && onMarkLocated && (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white border-0"
              style={{ fontFamily: 'Gill Sans, sans-serif' }}
              onClick={onMarkLocated}
              disabled={isMarkingLocated}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Returned
            </Button>
          )}
          {item.status === 'found' && (
            <div className="p-3 bg-green-50 rounded-md border border-green-200">
              <p className="text-sm text-green-700 font-medium" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                ✓ {item.reported_by === currentUserEmail ? 'Item successfully found' : 'Item successfully claimed'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LostItemCard({ item, onMarkFound, isMarkingFound, showStudentInfo, onDelete, canDelete, currentUserEmail, onMarkLocated, isMarkingLocated, showOwnItemButtons }) {
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <>
      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-0">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <CardTitle
                className="text-lg text-gray-900 cursor-pointer hover:text-teal-700 transition-colors"
                style={{ fontFamily: 'Gill Sans, sans-serif' }}
                onClick={() => setDetailOpen(true)}
              >
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
              <Badge className="bg-green-500 hover:bg-green-600" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Returned</Badge>
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
          {/* Photo thumbnail */}
          {item.photo_url && (
            <div
              className="cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity"
              onClick={() => setDetailOpen(true)}
            >
              <img src={item.photo_url} alt={item.item_name} className="w-full h-36 object-cover" />
            </div>
          )}

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

          {/* View details link if photo exists */}
          {item.photo_url && (
            <button
              className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 transition-colors"
              style={{ fontFamily: 'Gill Sans, sans-serif' }}
              onClick={() => setDetailOpen(true)}
            >
              <ImageIcon className="h-3 w-3" />
              View full details & photo
            </button>
          )}

          {item.status === 'lost' && onMarkFound && (
            <Button
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white border-0"
              style={{ fontFamily: 'Gill Sans, sans-serif' }}
              onClick={onMarkFound}
              disabled={isMarkingFound}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Located
            </Button>
          )}
          {item.status === 'lost' && onMarkLocated && (
            <Button
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white border-0"
              style={{ fontFamily: 'Gill Sans, sans-serif' }}
              onClick={onMarkLocated}
              disabled={isMarkingLocated}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Returned
            </Button>
          )}
          {item.status === 'awaiting_collection' && onMarkLocated && (
            <Button
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white border-0"
              style={{ fontFamily: 'Gill Sans, sans-serif' }}
              onClick={onMarkLocated}
              disabled={isMarkingLocated}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Returned
            </Button>
          )}
          {item.status === 'found' && (
            <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
              <p className="text-sm text-green-700 font-medium" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                ✓ {item.reported_by === currentUserEmail ? 'Item successfully found' : 'Item successfully claimed'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <ItemDetailDialog
        item={item}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        currentUserEmail={currentUserEmail}
        onMarkFound={onMarkFound}
        isMarkingFound={isMarkingFound}
        onMarkLocated={onMarkLocated}
        isMarkingLocated={isMarkingLocated}
      />
    </>
  );
}