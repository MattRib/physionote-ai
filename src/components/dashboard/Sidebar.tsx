'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Activity,
  Sparkles,
  LucideProps
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface NavLink {
  name: string;
  icon: React.ComponentType<LucideProps>;
  path: string;
}

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

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

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-white via-white to-gray-50/50 z-50 flex flex-col border-r border-gray-200/60 shadow-[4px_0_24px_-8px_rgba(0,0,0,0.08)]">
      {/* Ambient Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-br from-[#4f46e5]/8 via-[#6366f1]/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-gradient-to-tl from-[#a855f7]/6 via-[#8b5cf6]/4 to-transparent blur-3xl" />
      </div>

      {/* Header/Brand Section */}
      <div className="relative z-10 px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4f46e5] to-[#6366f1] rounded-2xl blur-md opacity-40" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#6366f1] shadow-lg">
              <Activity className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#0F172A] leading-tight tracking-tight">
              PhysioNote<span className="text-[#4f46e5]">.AI</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Sparkles className="h-3 w-3 text-[#4f46e5]" />
              <p className="text-[10px] font-semibold text-[#64748B] tracking-wide">
                Powered by AI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="relative z-10 flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="mb-4">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
            Menu Principal
          </p>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isActivePath(link.path);

            return (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-lg shadow-indigo-500/25'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-gray-100'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}
                
                {/* Icon with background */}
                <div className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 group-hover:bg-white'
                }`}>
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                
                <span className="flex-1 text-left">{link.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="relative z-10 p-4 space-y-3 border-t border-gray-200/60 bg-gradient-to-t from-gray-50/80 to-transparent">
        {/* Support Card */}
        <div className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 to-purple-50/60 p-4 shadow-sm">
          <div className="flex items-start gap-2.5 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#6366f1] shadow-sm flex-shrink-0">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#0F172A] mb-1">Precisa de Ajuda?</h3>
              <p className="text-[10px] text-[#64748B] leading-relaxed">
                Nossa equipe está pronta para te auxiliar com qualquer dúvida.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/support')}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-white border border-indigo-200 px-3 py-2 text-xs font-semibold text-[#4f46e5] hover:bg-indigo-50 hover:border-indigo-300 transition-colors duration-200"
          >
            <span>Acessar Suporte</span>
          </button>
        </div>

        {/* User Profile Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FDE68A] via-[#FBCFE8] to-[#A5B4FC] rounded-full blur-sm opacity-60" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#FDE68A] via-[#FBCFE8] to-[#A5B4FC] text-base font-bold text-[#4f46e5] shadow-md">
                F
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0F172A] truncate">Fisioterapeuta</p>
              <p className="text-xs text-[#64748B] truncate">Online agora</p>
            </div>
            <Settings className="h-4 w-4 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="group flex w-full items-center justify-center gap-2.5 rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50/80 to-red-100/60 px-4 py-3 text-sm font-semibold text-red-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-red-300 hover:shadow-md hover:shadow-red-500/10 hover:-translate-y-0.5"
        >
          <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" strokeWidth={2.2} />
          <span>Sair da Conta</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;