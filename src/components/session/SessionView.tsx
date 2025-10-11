'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square,
  Play,
  Activity,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import PatientSelector from './PatientSelector';
import SessionSummary from './SessionSummary';

const SessionView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{id: string, name: string} | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const startRecordingRef = useRef<() => Promise<void> | void>();
  const shouldAutoStartRef = useRef(false);

  // Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    if (!selectedPatient) {
      alert('Por favor, selecione um paciente antes de iniciar a sessão.');
      return;
    }
    setSessionStarted(true);
    startRecording();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
        // Simular transcrição em tempo real
        simulateTranscription();
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        // Áudio gravado e pronto para upload
      };

      mediaRecorder.start(1000); // Captura dados a cada 1 segundo
      setIsRecording(true);
    } catch (error) {
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

  startRecordingRef.current = startRecording;

  useEffect(() => {
    const patientId = searchParams.get('patientId');
    const patientName = searchParams.get('patientName');

    if (!patientId || !patientName || shouldAutoStartRef.current) {
      return;
    }

    const decodedName = decodeURIComponent(patientName);
    setSelectedPatient({ id: patientId, name: decodedName });
    setSessionStarted(true);
    shouldAutoStartRef.current = true;

    setTimeout(() => {
      startRecordingRef.current?.();
    }, 0);
  }, [searchParams]);

  const simulateTranscription = () => {
    // Simulação de transcrição - substituir com API real
    const mockPhrases = [
      'Paciente relata dor na região lombar há aproximadamente 2 semanas.',
      'Dor aumenta ao realizar movimentos de flexão do tronco.',
      'Observada limitação de amplitude de movimento em flexão lombar.',
      'Aplicada técnica de mobilização articular grau 3.',
      'Paciente respondeu bem à técnica aplicada.',
      'Prescrito exercícios de fortalecimento para região do core.',
      'Orientações sobre postura durante atividades diárias.'
    ];

    // Adiciona uma frase aleatória a cada 5 segundos
    if (duration % 5 === 0 && duration > 0) {
      const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      setTranscription(prev => [...prev, randomPhrase]);
    }
  };

  const handleStopSession = async () => {
    setIsFinishing(true);
    
    // Parar gravação
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);

    // Animação de transição (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsFinishing(false);
    setShowSummary(true);
  };

  const handleSaveSession = () => {
    // Aqui você salvaria os dados no backend
    router.push('/dashboard');
  };

  const handleCancelSession = () => {
    if (confirm('Tem certeza que deseja cancelar esta sessão? Todos os dados serão perdidos.')) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      router.push('/dashboard');
    }
  };

  if (!sessionStarted) {
    return (
      <div className="h-full flex items-center justify-center p-6 animate-fade-in">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8 animate-slide-up-modal">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4F46E5] to-[#6366F1] rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce-gentle">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#111827] animate-fade-in-up">Nova Sessão</h1>
              <p className="text-[#6B7280] animate-fade-in-up-delay">
                Selecione um paciente para iniciar uma nova sessão de atendimento
              </p>
            </div>

            {/* Patient Selector */}
            <div className="animate-fade-in-up relative z-10" style={{ animationDelay: '0.2s' }}>
              <PatientSelector
                selectedPatient={selectedPatient}
                onSelectPatient={setSelectedPatient}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 animate-fade-in-up relative z-0" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={handleCancelSession}
                className="btn-cancel flex-1 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleStartSession}
                disabled={!selectedPatient}
                className="group flex-1 px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white rounded-lg hover:from-[#6366F1] hover:to-[#818CF8] transition-all duration-300 font-medium shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:translate-y-0 flex items-center justify-center space-x-2 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <Play className="w-5 h-5 transition-transform group-hover:scale-110 duration-300" />
                <span>Iniciar Sessão</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <SessionSummary
        patient={selectedPatient!}
        duration={duration}
        transcription={transcription}
        onSave={handleSaveSession}
        onCancel={handleCancelSession}
        showAIDisclaimer={true}
      />
    );
  }

  // Tela de gravação com enfoque minimalista e funcional
  return (
    <div className="relative flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#F4F3FF] px-6 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_55%)]"
      />

      <div className="relative flex w-full max-w-4xl flex-col items-center gap-12">
        <header className="flex w-full flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white/70 px-6 py-4 shadow-[0_24px_50px_-32px_rgba(15,23,42,0.25)] backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Gravando
            </span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6366F1]">Paciente</span>
              <span className="text-sm font-medium text-[#1E293B]">{selectedPatient?.name}</span>
            </div>
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="text-xs font-medium uppercase tracking-[0.24em] text-[#94A3B8]">Duração</span>
            <span className="font-mono text-3xl font-semibold text-[#0F172A]">{formatTime(duration)}</span>
          </div>
        </header>

        <section className="flex w-full flex-col items-center gap-6 rounded-3xl border border-white/70 bg-white/70 px-10 py-12 text-center shadow-[0_30px_60px_-40px_rgba(79,70,229,0.55)] backdrop-blur">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#4F46E5] to-[#6366F1] text-white shadow-[0_18px_38px_-18px_rgba(79,70,229,0.75)]">
            <Mic className="h-12 w-12" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-[#0F172A]">Microfone ativo</p>
            <p className="text-sm text-[#64748B]">
              A IA está acompanhando em tempo real. Evite interromper para manter a transcrição fiel ao atendimento.
            </p>
          </div>
        </section>

        <div className="flex w-full flex-col items-center gap-6">
          {!isFinishing ? (
            <button
              onClick={handleStopSession}
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#EF4444] to-[#F87171] px-10 py-4 text-base font-semibold text-white shadow-[0_22px_45px_-28px_rgba(239,68,68,0.65)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FECACA]"
            >
              <Square className="h-5 w-5" aria-hidden="true" />
              Finalizar consulta e gerar transcrição
            </button>
          ) : (
            <div className="flex w-full items-center justify-center gap-4 rounded-2xl border border-white/70 bg-white/80 px-10 py-5 shadow-[0_24px_50px_-32px_rgba(15,23,42,0.25)]">
              <Loader2 className="h-5 w-5 animate-spin text-[#4F46E5]" aria-hidden="true" />
              <div className="text-left">
                <p className="text-sm font-semibold text-[#0F172A]">Finalizando consulta...</p>
                <p className="text-xs text-[#64748B]">Gerando transcrição e preparando o resumo inteligente</p>
              </div>
            </div>
          )}

          {!isFinishing ? (
            <div className="flex w-full items-start gap-3 rounded-2xl border border-transparent bg-[#EEF2FF] px-4 py-3 text-sm text-[#4F46E5]">
              <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <p>Conduza a consulta como de costume. Você poderá revisar e editar a nota clínica antes de finalizar o prontuário.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SessionView;
