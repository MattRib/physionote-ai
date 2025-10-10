'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import SessionView from '@/components/session/SessionView';

const NewSessionPage = () => {
  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="h-screen">
          <SessionView />
        </div>
      </div>
    </div>
  );
};

export default NewSessionPage;
