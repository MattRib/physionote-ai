'use client';

import React from 'react';
import { Calendar, User, Clock, FileText, Download, ShieldCheck, AlertCircle, Loader, ChevronRight } from 'lucide-react';

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
        <div className="w-24 h-24 bg-[#5A9BCF]/10 rounded-full flex items-center justify-center mb-6">
          <svg 
            className="w-12 h-12 text-[#5A9BCF]" 
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
        <h3 className="text-xl font-bold text-[#333333] mb-2">
          Nenhuma Sessão Encontrada
        </h3>
        <p className="text-[#666666] text-center max-w-md">
          Nenhuma sessão corresponde aos filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sessions.map((session, index) => {
        const { date, time } = formatDateTime(session.session_datetime);
        const config = statusConfig[session.status];
        const StatusIcon = config.icon;

        return (
          <div
            key={session.id}
            className="bg-white rounded-lg border-2 border-gray-100 
                     hover:border-[#5A9BCF] hover:shadow-md
                     transition-all duration-200
                     group cursor-pointer
                     animate-fade-in"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="px-6 py-4 flex items-center justify-between gap-4">
              
              {/* Left Section - Date/Time */}
              <div className="flex items-center space-x-4 min-w-[140px]">
                <div className="text-center">
                  <div className="text-sm font-bold text-[#333333]">{date}</div>
                  <div className="text-xs text-[#666666]">{time}</div>
                </div>
              </div>

              {/* Middle Section - Patient Info */}
              <div className="flex-1 flex items-center space-x-3 min-w-0">
                <User className="w-5 h-5 text-[#5A9BCF] flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#333333] group-hover:text-[#5A9BCF] 
                               transition-colors truncate">
                    {session.patient_name}
                  </h3>
                  {session.duration_minutes && (
                    <div className="flex items-center space-x-1 text-xs text-[#666666]">
                      <Clock className="w-3 h-3" />
                      <span>{session.duration_minutes} min</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${config.bgColor}`}>
                  <StatusIcon className={`w-4 h-4 ${config.textColor} ${session.status === 'processing' ? 'animate-spin' : ''}`} />
                  <span className={`text-sm font-medium ${config.textColor} hidden lg:inline`}>
                    {config.label}
                  </span>
                </div>
              </div>

              {/* LGPD Badge */}
              {session.is_anonymized && (
                <div className="hidden md:flex" title="LGPD Compliant">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  disabled={session.status !== 'completed'}
                  className="p-2 rounded-lg text-[#5A9BCF] hover:bg-[#5A9BCF]/10
                           disabled:text-gray-400 disabled:cursor-not-allowed
                           transition-all duration-200 group/btn"
                  title="Ver Nota"
                >
                  <FileText className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                </button>
                <button
                  disabled={session.status !== 'completed'}
                  className="p-2 rounded-lg text-[#5A9BCF] hover:bg-[#5A9BCF]/10
                           disabled:text-gray-400 disabled:cursor-not-allowed
                           transition-all duration-200 group/btn"
                  title="Download"
                >
                  <Download className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                </button>
                <ChevronRight className="w-5 h-5 text-[#666666] group-hover:text-[#5A9BCF] 
                                       group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SessionListView;
