'use client';

import React from 'react';
import { LayoutDashboard, Users, Settings, HelpCircle, LogOut, Activity } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      active: pathname === '/dashboard'
    },
    {
      name: 'Pacientes',
      icon: Users,
      path: '/dashboard/patients',
      active: pathname === '/dashboard/patients'
    },
    {
      name: 'Configurações',
      icon: Settings,
      path: '/dashboard/settings',
      active: pathname === '/dashboard/settings'
    }
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#5A9BCF] rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#333333]">PhysioNote.AI</h1>
            <p className="text-xs text-[#666666]">Documentação Inteligente</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${item.active ? 'bg-[#5A9BCF]/10 text-[#5A9BCF]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#5A9BCF]'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={() => router.push('/dashboard/help')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/dashboard/help' ? 'bg-[#5A9BCF]/10 text-[#5A9BCF]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#5A9BCF]'}`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Ajuda</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;