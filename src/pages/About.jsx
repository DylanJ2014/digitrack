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
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
            About
          </h1>
          <img 
            src="https://ucarecdn.com/c47e7224-5e36-4f0e-acd6-a6e82e3f6a15/DigiTracklogonobg.png" 
            alt="DigiTrack Logo" 
            className="h-16"
          />
        </div>

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
              Our platform streamlines the process of reporting lost items, searching for found items, and managing the entire lost property workflow for staff members.
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
            <p className="text-gray-700">
              Information about the founder will be added here.
            </p>
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