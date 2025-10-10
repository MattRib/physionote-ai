'use client';

import React from 'react';
import SessionCard from './SessionCard';

interface Session {
  id: string;
  session_datetime: string;
  patient_name: string;
  status: 'completed' | 'processing' | 'error';
  is_anonymized: boolean;
  duration_minutes?: number;
}

interface SessionCardsProps {
  sessions: Session[];
  onViewNote?: (sessionData: { id: string; patient_name: string; session_datetime: string; duration_minutes?: number }) => void;
}

const SessionCards: React.FC<SessionCardsProps> = ({ sessions, onViewNote }) => {
  
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
          Você ainda não criou nenhuma sessão. Clique em &quot;Nova Sessão&quot; para começar a documentar seus atendimentos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session, index) => (
        <SessionCard
          key={session.id}
          {...session}
          delay={index * 100} // Staggered animation
          onViewNote={onViewNote}
        />
      ))}
    </div>
  );
};

export default SessionCards;
