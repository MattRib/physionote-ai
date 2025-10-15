'use client';

import React from 'react';
import { LayoutDashboard, Users, Settings, HelpCircle, LogOut, Activity } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

// Define navigation links structure for dynamic rendering
interface NavLink {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Navigation links array for easy maintenance and future additions
  const navLinks: NavLink[] = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      name: 'Pacientes',
      icon: Users,
      path: '/dashboard/patients',
    },
    {
      name: 'Configurações',
      icon: Settings,
      path: '/dashboard/settings',
    },
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  // Check if the current path is active
  const isActivePath = (path: string) => pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white z-50 flex flex-col overflow-hidden">
      {/* Floating Blur Elements - Inspired by Hero.tsx */}
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#4f46e5]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-32 h-64 w-64 rounded-full bg-[#a855f7]/8 blur-[120px]" />

      {/* Header/Brand Section with Glassmorphism */}
      <div className="relative z-10 m-4 rounded-[28px] border border-white/60 bg-white/70 px-6 py-5 shadow-[0_8px_20px_-12px_rgba(99,102,241,0.2)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#6366f1] text-white shadow-[0_6px_15px_-8px_rgba(79,70,229,0.4)]">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0F172A] leading-tight">PhysioNote.AI</h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#4f46e5]">Gestão Inteligente</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="relative z-10 flex-1 px-4 mt-6 space-y-2 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = isActivePath(link.path);

          return (
            <button
              key={link.path}
              onClick={() => router.push(link.path)}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-[16px] font-semibold text-sm transition-colors duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-[0_6px_15px_-8px_rgba(79,70,229,0.4)]'
                  : 'text-[#475569] hover:bg-white/80 hover:shadow-[0_4px_12px_-6px_rgba(79,70,229,0.15)]'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{link.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="relative z-10 space-y-3 p-4">
        {/* User Info Card - Glassmorphism pattern from PatientsView */}
        <div className="rounded-[22px] border border-white/60 bg-white/70 px-5 py-4 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.15)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FDE68A] via-[#FBCFE8] to-[#A5B4FC] text-lg font-bold text-[#4f46e5]">
              F
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#0F172A] truncate">Fisioterapeuta</p>
              <p className="text-[10px] text-[#64748B] truncate">Sessão ativa</p>
            </div>
          </div>
        </div>

        {/* Help & Support Card - Compact */}
        <div className="rounded-[22px] border border-[#4f46e5]/20 bg-gradient-to-br from-white/95 to-[#EEF2FF]/80 p-4 shadow-[0_6px_18px_-10px_rgba(79,70,229,0.25)] backdrop-blur-xl">
          <div className="space-y-2.5">
            {/* Header with Icon and Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#6366f1] shadow-[0_4px_12px_-6px_rgba(79,70,229,0.4)]">
                  <HelpCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#0F172A]">Ajuda & Suporte</h3>
                  <p className="text-[9px] text-[#64748B]">Estamos aqui por você</p>
                </div>
              </div>
              <span className="rounded-full bg-[#DCFCE7] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#16A34A]">
                24/7
              </span>
            </div>

            {/* Action Button */}
            <button
              onClick={() => router.push('/dashboard/help')}
              className={`group w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                isActivePath('/dashboard/help')
                  ? 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-[0_6px_15px_-8px_rgba(79,70,229,0.5)]'
                  : 'border-2 border-[#C7D2FE] bg-white text-[#4f46e5] hover:border-[#4f46e5] hover:bg-[#4f46e5] hover:text-white hover:shadow-[0_4px_12px_-6px_rgba(79,70,229,0.3)]'
              }`}
            >
              <span>Acessar Central</span>
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isActivePath('/dashboard/help') ? '' : 'group-hover:translate-x-1'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-[18px] border border-red-200/60 bg-gradient-to-r from-red-50 to-red-100/50 px-4 py-3 text-sm font-semibold text-red-600 shadow-[0_4px_12px_-6px_rgba(220,38,38,0.2)] backdrop-blur-sm transition-all duration-200 hover:shadow-[0_6px_15px_-8px_rgba(220,38,38,0.3)]"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair da conta</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;