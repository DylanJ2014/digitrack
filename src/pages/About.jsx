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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-xl font-medium" style={{ fontFamily: 'Gill Sans, sans-serif' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader user={user} />
      <div className="max-w-4xl mx-auto px-4 py-8">


        <Card className="bg-white shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
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

        <Card className="bg-white shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
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
                <span className="text-gray-700">Status tracking from lost to returned</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
              Lost Property Tips - Video
            </CardTitle>
          </CardHeader>
          <CardContent style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/_kDXiU7kHns"
                title="Lost Property Tips Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
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
                  DigiTrack was founded in 2024 by Dylan Jubraj (current Caterham School student).
                </p>
                <p>
                  Dylan and his friends often lose their school belongings which are costly to replace and utilises a lot of time and effort from parents, children and staff to locate items.
                </p>
                <p>
                  Dylan was inspired to digitise reuniting lost property after seeing how SouthEastern trains used technology to locate customers with lost property. <a href="https://newsroom.southeasternrailway.co.uk/news/southeasterns-new-lost-property-scheme-sees-144-percent-boost-in-reunited-items" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">See the full case study here</a>.
                </p>
                <p>
                  Dylan is passionate to help schools limit their lost property challenges as he really does believe the use of technology will help to unlock current challenges and speed up reuniting lost property with its rightful owner.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}