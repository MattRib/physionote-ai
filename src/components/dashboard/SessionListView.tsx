'use client';

import React from 'react';
import {
  User,
  FileText,
  Download,
  AlertCircle,
  Loader,
  ChevronRight,
  Activity,
  PiggyBank,
  Calendar,
  ShieldCheck
} from 'lucide-react';

interface Session {
  id: string;
  session_datetime: string;
  patient_name: string;
  status: 'completed' | 'processing' | 'error';
  is_anonymized: boolean;
  duration_minutes?: number;
}

interface SessionListViewProps {
  sessions: Session[];
}

const SessionListView: React.FC<SessionListViewProps> = ({ sessions }) => {
  
  const statusConfig = {
    completed: {
      color: 'bg-green-500',
      textColor: 'text-green-800',
      bgColor: 'bg-green-50',
      label: 'Concluída',
      icon: ShieldCheck
    },
    processing: {
      color: 'bg-amber-500',
      textColor: 'text-amber-800',
      bgColor: 'bg-amber-50',
      label: 'Processando',
      icon: Loader
    },
    error: {
      color: 'bg-red-500',
      textColor: 'text-red-800',
      bgColor: 'bg-red-50',
      label: 'Erro',
      icon: AlertCircle
    }
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 bg-[#4F46E5]/10 rounded-full flex items-center justify-center mb-6">
          <svg 
            className="w-12 h-12 text-[#6366F1]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#111827] mb-2">
          Nenhuma Sessão Encontrada
        </h3>
        <p className="text-[#6B7280] text-center max-w-md">
          Nenhuma sessão corresponde aos filtros aplicados.
        </p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return 'PT';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  return (
    <div className="space-y-4">
      {sessions.map((session, index) => {
        const { date, time } = formatDateTime(session.session_datetime);
        const config = statusConfig[session.status];
        const StatusIcon = config.icon;

        return (
          <div
            key={session.id}
            className="group flex items-center justify-between gap-6 rounded-[28px] border border-white/70 bg-white/95 px-6 py-4 shadow-[0_20px_45px_-32px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_28px_60px_-36px_rgba(79,70,229,0.45)]"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#FDE68A] via-[#F9A8D4] to-[#818CF8] p-[2px] shadow-[0_12px_24px_-16px_rgba(79,70,229,0.4)]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-[#1E293B]">
                  {getInitials(session.patient_name)}
                </div>
              </div>
              <div>
                <div className="text-base font-semibold text-[#0F172A]">
                  {session.patient_name}
                </div>
                <div className="text-sm text-[#64748B]">Sessão #{session.id}</div>
              </div>
            </div>

            <div className="hidden flex-col items-start text-sm text-[#475569] sm:flex">
              <span className="font-semibold text-[#0F172A]">{date}</span>
              <span>{time}</span>
            </div>

            <div className="hidden items-center gap-3 text-sm text-[#475569] md:flex">
              <div className="flex items-center gap-2 rounded-full bg-[#FEF3C7] px-3 py-1 text-[#CA8A04]">
                <User className="h-4 w-4" />
                <span>{session.duration_minutes ? `${session.duration_minutes} min` : 'Paciente'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#FEE2E2] px-3 py-1 text-[#DC2626]">
                <Activity className="h-4 w-4" />
                <span>{session.is_anonymized ? 'LGPD ativa' : 'Sem LGPD'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#DBEAFE] px-3 py-1 text-[#1D4ED8]">
                <PiggyBank className="h-4 w-4" />
                <span>Valor em aberto</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#D1FAE5] px-3 py-1 text-[#047857]">
                <Calendar className="h-4 w-4" />
                <span>Próximo retorno</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${config.bgColor}`}>
                <StatusIcon
                  className={`h-4 w-4 ${config.textColor} ${session.status === 'processing' ? 'animate-spin' : ''}`}
                />
                <span className={`${config.textColor}`}>{config.label}</span>
              </div>

              <div className="ml-2 flex items-center gap-2">
                <button
                  disabled={session.status !== 'completed'}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#E0E7FF] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                  title="Ver nota"
                >
                  <FileText className="h-5 w-5" />
                </button>
                <button
                  disabled={session.status !== 'completed'}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ECFDF5] text-[#16A34A] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#D1FAE5] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </button>
                <ChevronRight className="h-5 w-5 text-[#94A3B8] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#4F46E5]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SessionListView;
