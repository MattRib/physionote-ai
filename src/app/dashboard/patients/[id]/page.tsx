'use client';

import React from 'react';
import { use } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { PatientRecord } from '@/components/patients';

interface PageProps {
  params: Promise<{ id: string }>;
}

const PatientRecordPage = ({ params }: PageProps) => {
  const { id } = use(params);

  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <PatientRecord patientId={id} />
      </div>
    </div>
  );
};

export default PatientRecordPage;
