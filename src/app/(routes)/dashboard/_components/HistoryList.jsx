'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react'; 
import AddNewSessionDialog from './AddNewSessionDialog';


const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);

  const handleStartConsultation = () => {
    // This should route or trigger action to start a new consultation
    console.log('Starting consultation...');
  };

  const hasHistory = historyList.length > 0;

  return (
    <div className="mt-10 w-full max-w-3xl mx-auto px-4">
      {!hasHistory ? (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <MessageSquare className="w-12 h-12 text-gray-400" />
          <h2 className="text-2xl font-semibold">No History</h2>
          <p className="text-gray-500">You haven’t started any consultations yet.</p>
          <AddNewSessionDialog />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-2">History</h2>
          <p className="text-gray-500 mb-6">Your past consultations are listed below.</p>
          <ul className="space-y-4">
            {historyList.map((item, index) => (
              <li
                key={index}
                className="p-4 rounded-lg shadow hover:shadow-md transition bg-white border"
              >
                {/* Replace below with actual item display */}
                <p className="font-medium">Consultation #{index + 1}</p>
                <p className="text-sm text-gray-600">Placeholder summary or timestamp</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HistoryList;
