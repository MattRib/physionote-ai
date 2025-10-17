'use client';

import React, { useState } from 'react';
import { Activity, Menu, X } from 'lucide-react';
import { NewSessionFlow } from '@/components/dashboard';
import Sidebar from '@/components/dashboard/Sidebar';

export default function NewSessionPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div
        className={`fixed left-0 top-0 z-50 h-screen w-72 transform bg-white shadow-lg transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      <main className="min-h-screen lg:ml-72">
        <div className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between bg-white px-4 py-3 shadow-md lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6 text-[#111827]" />
            ) : (
              <Menu className="h-6 w-6 text-[#111827]" />
            )}
          </button>
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#111827]">PhysioNote.AI</span>
          </div>
          <div className="w-10" />
        </div>

        <div className="px-4 pb-12 pt-20 md:px-8 lg:px-10 lg:pt-10">
          <NewSessionFlow />
        </div>
      </main>
    </div>
  );
}
