import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Video() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        window.location.href = createPageUrl('Home');
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
      setLoading(false);
    };
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#254B77' }}>
        <p className="text-white text-xl" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#254B77' }}>
      <DashboardHeader user={user} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
          Lost Property Video Tutorial
        </h1>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle style={{ color: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
              How to Use DigiTrack
            </CardTitle>
          </CardHeader>
          <CardContent style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="DigiTrack Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
            <p className="text-gray-700 mb-4">
              Watch this comprehensive tutorial to learn how to effectively use DigiTrack for managing lost and found items.
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Topics covered:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>How to report a lost item</li>
                <li>Searching for lost items</li>
                <li>Marking items as found</li>
                <li>Understanding item statuses</li>
                <li>Collecting your items</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}