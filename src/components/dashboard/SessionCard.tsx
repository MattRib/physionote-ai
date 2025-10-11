'use client';

'use client';

import React from 'react';
import {
  Calendar,
  User,
  Clock,
  FileText,
  Download,
  ShieldCheck,
  AlertCircle,
  Loader
} from 'lucide-react';

interface SessionCardProps {
  id: string;
  session_datetime: string;
  patient_name: string;
  status: 'completed' | 'processing' | 'error';
  is_anonymized: boolean;
  duration_minutes?: number;
  delay?: number;
  onViewNote?: (sessionData: { id: string; patient_name: string; session_datetime: string; duration_minutes?: number }) => void;
}

const STATUS_STYLES = {
  completed: {
    badgeBg: 'bg-[#D1FADF]',
    badgeText: 'text-[#166534]',
    icon: ShieldCheck,
    label: 'Concluída'
  },
  processing: {
    badgeBg: 'bg-[#FEF3C7]',
    badgeText: 'text-[#92400E]',
    icon: Loader,
    label: 'Processando'
  },
  error: {
    badgeBg: 'bg-[#FEE2E2]',
    badgeText: 'text-[#B91C1C]',
    icon: AlertCircle,
    label: 'Erro'
  }
} satisfies Record<SessionCardProps['status'], {
  badgeBg: string;
  badgeText: string;
  icon: typeof ShieldCheck;
  label: string;
}>;

const formatDateTime = (datetime: string) => {
  const date = new Date(datetime);
  return {
    date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
};

const SessionCard: React.FC<SessionCardProps> = ({
  id,
  session_datetime,
  patient_name,
  status,
  is_anonymized,
  duration_minutes,
  delay = 0,
  onViewNote
}) => {
  const { badgeBg, badgeText, icon: StatusIcon, label } = STATUS_STYLES[status];
  const { date, time } = formatDateTime(session_datetime);
  const isCompleted = status === 'completed';

  const primaryButtonClasses = `flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1] ${
    isCompleted
      ? 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-[0_12px_30px_-16px_rgba(79,70,229,0.55)] hover:shadow-[0_18px_40px_-18px_rgba(79,70,229,0.6)] hover:brightness-110'
      : 'cursor-not-allowed bg-slate-200 text-slate-400 shadow-none'
  }`;

  const secondaryButtonClasses = `inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1] ${
    isCompleted
      ? 'border-[#C7D2FE] text-[#4F46E5] hover:border-[#818CF8] hover:bg-[#EEF2FF] hover:text-[#3730A3]'
      : 'cursor-not-allowed border-slate-200 text-slate-400'
  }`;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-transparent bg-white/95 shadow-[0_20px_55px_-28px_rgba(79,70,229,0.45)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#C7D2FE] hover:shadow-[0_28px_70px_-28px_rgba(79,70,229,0.55)] focus-within:border-[#A5B4FC] focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-[#64748B]">
              <Calendar className="h-4 w-4 text-[#6366F1]" />
              <span className="font-medium text-[#111827]">{date}</span>
              <span className="text-[#94A3B8]">•</span>
              <span>{time}</span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <User className="h-5 w-5 text-[#4F46E5]" />
              <h3 className="text-lg font-semibold text-[#0F172A] transition-colors duration-300 group-hover:text-[#4F46E5]">
                {patient_name}
              </h3>
            </div>
          </div>

          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${badgeBg} ${badgeText}`}>
            <StatusIcon className={`h-4 w-4 ${status === 'processing' ? 'animate-spin' : ''}`} />
            {label}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#64748B]">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#6366F1]" />
            <span>{duration_minutes ? `${duration_minutes} minutos` : 'Duração não informada'}</span>
          </div>

          {is_anonymized ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-medium text-[#047857]">
              <ShieldCheck className="h-4 w-4 text-[#10B981]" />
              LGPD Ativo
            </span>
          ) : null}
        </div>

        <div className="mt-2 flex items-center gap-3 border-t border-[#E2E8F0]/70 pt-5">
          <button
            onClick={() => onViewNote?.({ id, patient_name, session_datetime, duration_minutes })}
            disabled={!isCompleted}
            className={primaryButtonClasses}
          >
            <FileText className="h-4 w-4" />
            <span>Ver Nota</span>
          </button>

          <button
            disabled={!isCompleted}
            className={secondaryButtonClasses}
            title="Download"
          >
            <Download className="h-4 w-4" />
            <span>Baixar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
