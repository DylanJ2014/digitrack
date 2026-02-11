import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
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


        <Card className="bg-white mb-6">
          <CardHeader>
            <CardTitle style={{ color: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
              What is DigiTrack?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            <p className="text-gray-700">
              DigiTrack is a comprehensive lost and found management system designed to help schools efficiently track and reunite students with their lost belongings.
            </p>
            <p className="text-gray-700">
              Our platform streamlines the process of reporting lost items, searching for found items, and managing the entire lost property workflow for the entire school community.
            </p>
            <p className="text-gray-700">
              Digitrack has been made possible by the wonderful support, encouragement and counsel from the teaching staff at Caterham School.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white mb-6">
          <CardHeader>
            <CardTitle style={{ color: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
              Lost Property Tips - Video
            </CardTitle>
          </CardHeader>
          <CardContent style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-500">Video will be inserted here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white mb-6">
          <CardHeader>
            <CardTitle style={{ color: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
              DigiTrack Founder - Dylan Jubraj
            </CardTitle>
          </CardHeader>
          <CardContent style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="md:w-1/3 flex-shrink-0">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988f8dff5282453314fa07b/0bf1d13a8_1-b26985f0.jpg" 
                  alt="Dylan Jubraj" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="md:w-2/3 space-y-4 text-gray-700">
                <p>
                  DigiTrack was founded in 2024 by Dylan Jubraj (current Caterham Senior School Student).
                </p>
                <p>
                  Dylan and his friends often lose their school belongings which are costly to replace and utilises a lot of time and effort from parents, children and staff to locate items.
                </p>
                <p>
                  Dylan was inspired to digitise reuniting lost property after seeing how SouthEastern trains used technology to locate customers with lost property. See the full case study here.
                </p>
                <p>
                  Dylan is passionate to bring the DigiTrack concept to life as he really does believe the use of technology will help to reduce the lost property challenges we have at Caterham School.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle style={{ color: '#254B77', fontFamily: 'Gill Sans, sans-serif' }}>
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">Easy item reporting for students</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">Real-time notifications when items are found</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">Comprehensive search functionality</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">Staff dashboard for efficient management</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">Status tracking from lost to located</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}