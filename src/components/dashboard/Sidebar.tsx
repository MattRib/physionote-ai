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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#4F46E5] to-[#6366F1] shadow-xl z-50 flex flex-col">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">PhysioNote.AI</h1>
            <p className="text-xs text-white/80">Documentação Inteligente</p>
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                item.active 
                  ? 'bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/20 transform scale-[1.02]' 
                  : 'text-white/80 hover:bg-white/5 hover:text-white hover:backdrop-blur-sm'
              }`}
            >
              <Icon className={`w-5 h-5 ${item.active ? 'drop-shadow-lg' : ''}`} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/20 space-y-2">
        <button
          onClick={() => router.push('/dashboard/help')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
            pathname === '/dashboard/help' 
              ? 'bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/20 transform scale-[1.02]' 
              : 'text-white/80 hover:bg-white/5 hover:text-white hover:backdrop-blur-sm'
          }`}
        >
          <HelpCircle className={`w-5 h-5 ${pathname === '/dashboard/help' ? 'drop-shadow-lg' : ''}`} />
          <span className="font-medium">Ajuda</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:bg-[#EF4444]/30 hover:text-white hover:backdrop-blur-sm transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;