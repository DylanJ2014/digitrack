import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

export default function FAQs() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
          Frequently Asked Questions
        </h1>

        <Card className="bg-white shadow-lg border-0 p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                How do I report a lost item?
              </AccordionTrigger>
              <AccordionContent style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                Click the "Log Lost Item" button on your dashboard, fill in the details about your lost item including the item name, description, date lost, and last known location, then submit the form.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                What happens when someone finds my item?
              </AccordionTrigger>
              <AccordionContent style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                You'll receive an in-app notification alert when your item is marked as found. The item status will change to "Awaiting Collection" and you can proceed to collect it from the relevant lost property office at either the Prep, Pre-Prep or Senior School.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                What do the different statuses mean?
              </AccordionTrigger>
              <AccordionContent style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                <ul className="space-y-2">
                  <li><strong>Lost:</strong> The item has been reported as lost and is still missing.</li>
                  <li><strong>Awaiting Collection:</strong> The item has been found and is ready for you to collect.</li>
                  <li><strong>Located:</strong> The item has been successfully reunited with its owner.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                Can I search for items that others have lost?
              </AccordionTrigger>
              <AccordionContent style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                Yes! Go to the "Find Lost Items" tab on your dashboard. You can search by item name, description, student name, or location. If you find an item that belongs to someone, click "Mark as Found" to notify them.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                How long are items kept in lost property?
              </AccordionTrigger>
              <AccordionContent style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                Items are typically held for 90 days before being donated or disposed of. Please collect your items as soon as possible after being notified.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                What if my lost property item is unlabelled?
              </AccordionTrigger>
              <AccordionContent style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                We strongly encourage all students to label their belongings, no matter how big or small, and to regularly check that labels haven't come off over time. DigiTrack relies on student names to successfully reunite lost items with their owners. If your item is unlabelled, we recommend visiting the lost property office in person to check if your item is there.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                What if I can't find my item in the system?
              </AccordionTrigger>
              <AccordionContent style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                Try searching using different keywords or checking the "Find Lost Items" tab. If you still can't find it, make sure to log it as a lost item so you'll be notified if someone finds it. You can also visit the lost property office in person. Labelled items are generally reunited back with their owner and we encourage all items no matter how big or small to be labelled.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                Can parents or guardians access DigiTrack?
              </AccordionTrigger>
              <AccordionContent style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                Parents and guardians are welcome to help locate their child's lost property by logging in through their child's school account. This ensures all items remain linked to the correct student profile and notifications are delivered appropriately.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger className="text-gray-900" style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                Who can I contact for help?
              </AccordionTrigger>
              <AccordionContent style={{ fontFamily: 'Gill Sans, sans-serif' }}>
                If you need assistance, please contact the reception office or visit the lost property office during school hours. Staff members throughout the school are available to help you search for your items.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}