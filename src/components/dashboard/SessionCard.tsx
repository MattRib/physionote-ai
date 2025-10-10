'use client';

import React from 'react';
import { Calendar, User, Clock, FileText, Download, ShieldCheck, AlertCircle, Loader } from 'lucide-react';

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

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(session_datetime);

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl 
                 transition-all duration-300 
                 hover:-translate-y-2
                 group relative overflow-hidden
                 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Status Bar - Left Side */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config.color}`} />
      
      {/* LGPD Compliance Badge - Top Right */}
      {is_anonymized && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-green-50 rounded-full p-2 
                         group-hover:scale-110 transition-transform duration-300">
            <ShieldCheck className="w-6 h-6 text-green-600" />
          </div>
        </div>
      )}

      <div className="p-6 space-y-4">
        
        {/* Header - Date and Patient Name */}
        <div className="space-y-2 pr-12">
          <div className="flex items-center space-x-2 text-[#666666]">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{date}</span>
            <span className="text-sm">às {time}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-[#5A9BCF]" />
            <h3 className="text-lg font-bold text-[#333333] group-hover:text-[#5A9BCF] 
                          transition-colors duration-300">
              {patient_name}
            </h3>
          </div>
        </div>

        {/* Duration */}
        {duration_minutes && (
          <div className="flex items-center space-x-2 text-[#666666]">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{duration_minutes} minutos</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="flex items-center justify-between pt-2">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${config.bgColor}`}>
            <StatusIcon className={`w-4 h-4 ${config.textColor} ${status === 'processing' ? 'animate-spin' : ''}`} />
            <span className={`text-sm font-medium ${config.textColor}`}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onViewNote?.({ id, patient_name, session_datetime, duration_minutes })}
            disabled={status !== 'completed'}
            className="flex-1 flex items-center justify-center space-x-2 
                     px-4 py-2.5 rounded-lg
                     bg-[#5A9BCF]/10 text-[#5A9BCF]
                     hover:bg-[#5A9BCF] hover:text-white hover:scale-105
                     disabled:bg-gray-100 disabled:text-gray-400 
                     disabled:cursor-not-allowed disabled:hover:scale-100
                     transition-all duration-300
                     font-medium text-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Ver Nota</span>
          </button>

          <button
            disabled={status !== 'completed'}
            className="flex items-center justify-center
                     px-4 py-2.5 rounded-lg
                     border-2 border-[#5A9BCF]/20 text-[#5A9BCF]
                     hover:border-[#5A9BCF] hover:bg-[#5A9BCF]/5 hover:scale-105
                     disabled:border-gray-200 disabled:text-gray-400
                     disabled:cursor-not-allowed disabled:hover:scale-100
                     transition-all duration-300"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
