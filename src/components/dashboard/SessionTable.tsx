'use client';

import React from 'react';
import { Calendar, User, Clock, FileText, Download, ShieldCheck, AlertCircle, Loader } from 'lucide-react';
import { DashboardSession } from './types';

interface SessionTableProps {
  sessions: DashboardSession[];
}

const SessionTable: React.FC<SessionTableProps> = ({ sessions }) => {
  
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
    },
    recording: {
      color: 'bg-blue-500',
      textColor: 'text-blue-800',
      bgColor: 'bg-blue-50',
      label: 'Gravando',
      icon: Loader
    },
    transcribing: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-800',
      bgColor: 'bg-yellow-50',
      label: 'Transcrevendo',
      icon: Loader
    },
    generating: {
      color: 'bg-indigo-500',
      textColor: 'text-indigo-800',
      bgColor: 'bg-indigo-50',
      label: 'Gerando nota',
      icon: Loader
    }
  } as const;

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
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

  return (
    <div className="bg-white rounded-lg border-2 border-[#E2E8F0] overflow-hidden shadow-lg shadow-[#0F172A]/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-[#F1F5F9] border-b-2 border-[#E2E8F0]">
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider whitespace-nowrap">
                Data
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider whitespace-nowrap">
                Hora
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider whitespace-nowrap">
                Paciente
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider whitespace-nowrap">
                Duração
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#111827] uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-[#111827] uppercase tracking-wider whitespace-nowrap">
                LGPD
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-[#111827] uppercase tracking-wider whitespace-nowrap">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {sessions.map((session, index) => {
              const { date, time } = formatDateTime(session.session_datetime);
              const config = statusConfig[session.status];
              const StatusIcon = config.icon;

              return (
                <tr
                  key={session.id}
                  className="hover:bg-[#4F46E5]/5 transition-colors cursor-pointer
                           animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Data */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-[#6366F1]" />
                      <span className="text-sm font-medium text-[#111827]">{date}</span>
                    </div>
                  </td>

                  {/* Hora */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[#6366F1]" />
                      <span className="text-sm text-[#6B7280]">{time}</span>
                    </div>
                  </td>

                  {/* Paciente */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-[#6366F1] flex-shrink-0" />
                      <span className="text-sm font-semibold text-[#111827] truncate max-w-xs">
                        {session.patient_name}
                      </span>
                    </div>
                  </td>

                  {/* Duração */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.duration_minutes ? (
                      <span className="text-sm text-[#6B7280]">
                        {session.duration_minutes} min
                      </span>
                    ) : (
                      <span className="text-sm text-[#94A3B8]">-</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full ${config.bgColor}`}>
                      <StatusIcon className={`w-4 h-4 ${config.textColor} ${session.status === 'processing' ? 'animate-spin' : ''}`} />
                      <span className={`text-sm font-medium ${config.textColor}`}>
                        {config.label}
                      </span>
                    </div>
                  </td>

                  {/* LGPD */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {session.is_anonymized ? (
                      <div title="LGPD Compliant">
                        <ShieldCheck className="w-5 h-5 text-green-600 mx-auto" />
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        disabled={session.status !== 'completed'}
                        className="p-2 rounded-lg text-[#4F46E5] hover:bg-[#4F46E5]/10
                                 disabled:text-gray-400 disabled:cursor-not-allowed
                                 transition-all duration-200 group"
                        title="Ver Nota"
                      >
                        <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        disabled={session.status !== 'completed'}
                        className="p-2 rounded-lg text-[#4F46E5] hover:bg-[#4F46E5]/10
                                 disabled:text-gray-400 disabled:cursor-not-allowed
                                 transition-all duration-200 group"
                        title="Download"
                      >
                        <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionTable;
