'use client';

import React, { Suspense } from 'react';
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
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-sm text-[#4F46E5]">
                Carregando sessão...
              </div>
            }
          >
            <SessionView />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default NewSessionPage;
