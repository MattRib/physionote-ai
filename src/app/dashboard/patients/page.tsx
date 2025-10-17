'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import PatientsView from '@/components/patients/PatientsView';

const PatientsPage = () => {
  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        <div className="p-6 lg:p-8">
          <PatientsView />
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;
