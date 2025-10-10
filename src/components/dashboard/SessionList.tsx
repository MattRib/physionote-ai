'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Download, Shield, Check, MoreVertical, Plus } from 'lucide-react';

interface Session {
  id: string;
  session_datetime: string;
  patient_name: string;
  status: 'completed' | 'processing' | 'error';
  is_anonymized: boolean;
  duration_minutes: number;
}

const SessionList = () => {
  const router = useRouter();
  
  // Mock data - substituir com fetch real
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      session_datetime: '2025-10-08T10:30:00',
      patient_name: 'Maria Silva',
      status: 'completed',
      is_anonymized: true,
      duration_minutes: 45
    },
    {
      id: '2',
      session_datetime: '2025-10-08T14:00:00',
      patient_name: 'João Santos',
      status: 'processing',
      is_anonymized: true,
      duration_minutes: 60
    },
    {
      id: '3',
      session_datetime: '2025-10-07T09:15:00',
      patient_name: 'Ana Rodrigues',
      status: 'completed',
      is_anonymized: true,
      duration_minutes: 30
    },
    {
      id: '4',
      session_datetime: '2025-10-07T11:30:00',
      patient_name: 'Carlos Oliveira',
      status: 'error',
      is_anonymized: false,
      duration_minutes: 0
    },
    {
      id: '5',
      session_datetime: '2025-10-06T16:00:00',
      patient_name: 'Beatriz Lima',
      status: 'completed',
      is_anonymized: true,
      duration_minutes: 50
    }
  ]);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const getStatusBadge = (status: Session['status']) => {
    const statusConfig = {
      completed: {
        bg: 'bg-green-500',
        text: 'Concluída',
        textColor: 'text-white'
      },
      processing: {
        bg: 'bg-yellow-500',
        text: 'Processando',
        textColor: 'text-white'
      },
      error: {
        bg: 'bg-red-500',
        text: 'Erro',
        textColor: 'text-white'
      }
    };

    const config = statusConfig[status];

    return (
      <span className={`${config.bg} ${config.textColor} px-3 py-1 rounded-full text-xs font-medium`}>
        {config.text}
      </span>
    );
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleNewSession = () => {
    // Redirecionar para página de nova sessão
    router.push('/dashboard/session');
  };

  const handleViewNote = (sessionId: string) => {
    // Implementar visualização de nota
    console.log('Ver nota:', sessionId);
  };

  const handleExport = (sessionId: string) => {
    // Implementar exportação
    console.log('Exportar:', sessionId);
  };

  return (
    <div className="flex-1 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-[#333333] mb-2">
              Minhas Sessões
            </h1>
            <p className="text-[#666666] text-sm">
              Mostrando {sessions.length} de {sessions.length} sessões
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleNewSession}
            className="flex items-center space-x-2 text-white px-6 py-3 rounded-lg
                     btn-gradient-animated
                     hover:scale-105 transition-transform duration-300 
                     shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Sessão</span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden animate-slide-up">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#333333] uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#333333] uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#333333] uppercase tracking-wider">
                  Duração
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#333333] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#333333] uppercase tracking-wider">
                  Conformidade
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#333333] uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sessions.map((session, index) => {
                const { date, time } = formatDateTime(session.session_datetime);
                return (
                  <tr 
                    key={session.id} 
                    className="hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-[#333333]">{date}</div>
                        <div className="text-[#666666]">{time}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#333333]">
                        {session.patient_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#666666]">
                        {session.duration_minutes > 0 ? `${session.duration_minutes} min` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(session.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {session.is_anonymized ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <Shield className="w-5 h-5" />
                          <span className="text-sm font-medium">LGPD</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Shield className="w-5 h-5" />
                          <span className="text-sm">Pendente</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewNote(session.id)}
                          disabled={session.status !== 'completed'}
                          className="text-[#5A9BCF] hover:text-[#2C5F8D] disabled:text-gray-300 
                                   disabled:cursor-not-allowed transition-colors p-2 rounded-lg
                                   hover:bg-[#5A9BCF]/10"
                          title="Ver Nota"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleExport(session.id)}
                          disabled={session.status !== 'completed'}
                          className="text-[#5A9BCF] hover:text-[#2C5F8D] disabled:text-gray-300 
                                   disabled:cursor-not-allowed transition-colors p-2 rounded-lg
                                   hover:bg-[#5A9BCF]/10"
                          title="Exportar"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {sessions.map((session, index) => {
            const { date, time } = formatDateTime(session.session_datetime);
            return (
              <div
                key={session.id}
                className="bg-white rounded-xl shadow-lg p-6 space-y-4 animate-fade-in
                         hover:shadow-xl transition-shadow duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-[#333333] text-lg">
                      {session.patient_name}
                    </h3>
                    <p className="text-[#666666] text-sm mt-1">
                      {date} às {time}
                    </p>
                  </div>
                  {getStatusBadge(session.status)}
                </div>

                {/* Details */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    {session.is_anonymized ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-medium">LGPD</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs">Pendente</span>
                      </div>
                    )}
                    {session.duration_minutes > 0 && (
                      <span className="text-sm text-[#666666]">
                        {session.duration_minutes} min
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewNote(session.id)}
                      disabled={session.status !== 'completed'}
                      className="text-[#5A9BCF] hover:text-[#2C5F8D] disabled:text-gray-300 
                               disabled:cursor-not-allowed transition-colors p-2 rounded-lg
                               hover:bg-[#5A9BCF]/10"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleExport(session.id)}
                      disabled={session.status !== 'completed'}
                      className="text-[#5A9BCF] hover:text-[#2C5F8D] disabled:text-gray-300 
                               disabled:cursor-not-allowed transition-colors p-2 rounded-lg
                               hover:bg-[#5A9BCF]/10"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SessionList;
