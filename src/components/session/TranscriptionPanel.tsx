'use client';

import React, { useEffect, useRef } from 'react';
import { FileText, Clock } from 'lucide-react';

interface TranscriptionPanelProps {
  transcription: string[];
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({ transcription }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll para o final quando nova transcrição chegar
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcription]);

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-[#5A9BCF]" />
          <h2 className="text-lg font-semibold text-[#333333]">Transcrição em Tempo Real</h2>
        </div>
        <p className="text-sm text-[#666666] mt-1">
          {transcription.length} {transcription.length === 1 ? 'segmento' : 'segmentos'} transcritos
        </p>
      </div>

      {/* Transcription Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {transcription.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-[#666666]" />
              </div>
              <p className="text-[#666666]">
                Aguardando início da transcrição...
              </p>
              <p className="text-sm text-[#999999]">
                Comece a falar para ver a transcrição aqui
              </p>
            </div>
          </div>
        ) : (
          transcription.map((text, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-[#5A9BCF]/30 transition-colors animate-fade-in"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#5A9BCF]/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-[#5A9BCF]">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-[#333333] leading-relaxed">{text}</p>
                  <div className="flex items-center space-x-1 mt-2 text-xs text-[#999999]">
                    <Clock className="w-3 h-3" />
                    <span>Agora</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 px-6 py-3 bg-blue-50">
        <div className="flex items-center space-x-2 text-sm text-[#5A9BCF]">
          <div className="w-2 h-2 rounded-full bg-[#5A9BCF] animate-pulse" />
          <span>Transcrição ativa - Processando áudio...</span>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPanel;
