'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square,
  Play,
  Activity,
  AlertCircle,
  Radio,
  Clock,
  User,
  Pause,
  Volume2
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Lottie from 'lottie-react';
import audioRecordingAnimation from '@/../../public/animations/audio-recording.json';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PatientSelector from './PatientSelector';
import SessionSummary from './SessionSummary';

const SessionView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{id: string, name: string} | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [generatedNote, setGeneratedNote] = useState<any>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
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

  const handleStartSession = async () => {
    if (!selectedPatient) {
      alert('Por favor, selecione um paciente antes de iniciar a sessão.');
      return;
    }

    // NÃO criar sessão no banco ainda - apenas iniciar gravação
    // A sessão será criada apenas quando o usuário clicar em "Salvar"
    setSessionStarted(true);
    startRecording();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Áudio será processado no handleStopSession
      };

      mediaRecorder.start(1000); // Captura dados a cada 1 segundo
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

  startRecordingRef.current = startRecording;

  useEffect(() => {
    const sessionIdParam = searchParams.get('sessionId');
    const patientId = searchParams.get('patientId');
    const patientName = searchParams.get('patientName');

    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }

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

  const handleStopSession = async () => {
    setIsFinishing(true);
    setProcessingStatus('Finalizando gravação...');
    
    // Parar gravação
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);

    // Aguardar um pouco para garantir que todos os chunks foram coletados
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // 1. Criar blob de áudio
      setProcessingStatus('Preparando áudio...');
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      if (audioBlob.size === 0) {
        throw new Error('Nenhum áudio foi gravado');
      }

      console.log(`Audio size: ${(audioBlob.size / 1024 / 1024).toFixed(2)}MB`);

      // 2. Processar áudio localmente (sem salvar no banco ainda)
      setProcessingStatus('Transcrevendo com IA...');
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('patientId', selectedPatient!.id);
      formData.append('sessionType', 'Atendimento');
      formData.append('specialty', 'Fisioterapia');
      formData.append('processOnly', 'true'); // Flag para processar sem salvar

      const processResponse = await fetch('/api/sessions/process-temp', {
        method: 'POST',
        body: formData,
      });

      if (!processResponse.ok) {
        const error = await processResponse.json();
        throw new Error(error.error || 'Falha no processamento');
      }

      const result = await processResponse.json();
      console.log('Processing complete:', result);

      // 3. Armazenar dados em memória para revisão
      if (result.transcription) {
        const sentences = result.transcription
          .split(/[.!?]+/)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
        setTranscription(sentences);
      }

      if (result.note) {
        console.log('Nota gerada pela IA:', result.note);
        setGeneratedNote(result.note);
      }

      // Armazenar blob de áudio para salvar depois
      audioChunksRef.current = [audioBlob];

      setProcessingStatus('Concluído!');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsFinishing(false);
      setShowSummary(true);
    } catch (error: any) {
      console.error('Error processing session:', error);
      setIsFinishing(false);
      alert(`Erro ao processar sessão: ${error.message}\n\nTente novamente ou entre em contato com o suporte.`);
      
      // Perguntar se deseja tentar novamente
      if (confirm('Deseja tentar processar novamente?')) {
        handleStopSession();
      }
    }
  };

  const handleSaveSession = async () => {
    if (!selectedPatient) {
      alert('Erro: Paciente não selecionado');
      return;
    }

    if (!generatedNote) {
      alert('Erro: Nota não foi gerada');
      return;
    }

    try {
      console.log('[Save Session] Criando sessão no banco de dados...');

      // ⚠️ IMPORTANTE: Esta é a ÚNICA vez que criamos a sessão no banco de dados
      // Não existe sessão prévia - ela é criada aqui quando o usuário clica em "Salvar"
      // Isso evita duplicação de sessões no prontuário do paciente
      const formData = new FormData();
      
      // Dados da sessão
      formData.append('patientId', selectedPatient.id);
      formData.append('sessionType', 'Atendimento');
      formData.append('specialty', 'Fisioterapia');
      formData.append('durationMin', Math.floor(duration / 60).toString());
      
      // Áudio gravado
      if (audioChunksRef.current.length > 0) {
        const audioBlob = audioChunksRef.current[0] as Blob;
        formData.append('audio', audioBlob, 'recording.webm');
      }
      
      // Transcrição
      formData.append('transcription', transcription.join('. '));
      
      // Nota gerada pela IA (JSON)
      formData.append('note', JSON.stringify(generatedNote));

      const response = await fetch('/api/sessions/save', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Falha ao salvar sessão');
      }

      const result = await response.json();
      console.log('[Session Saved] ID:', result.sessionId, 'Status: completed');
      
      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error saving session:', error);
      alert(`Não foi possível salvar a sessão: ${error.message}\n\nTente novamente.`);
    }
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
        generatedNote={generatedNote}
        onSave={handleSaveSession}
        onCancel={handleCancelSession}
        showAIDisclaimer={true}
      />
    );
  }

  // Tela de gravação com enfoque minimalista e funcional
  return (
    <div className="relative flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#F4F3FF] px-6 py-8 overflow-hidden">
      {/* Background Effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(99,102,241,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative flex w-full max-w-5xl flex-col items-center gap-8">
        {/* Header Card - Calm & Professional Design */}
        <header className="w-full rounded-3xl border border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_24px_50px_-32px_rgba(15,23,42,0.3)] overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6">
            {/* Left Section - Patient & Session Status */}
            <div className="flex items-center gap-4">
              {/* Subtle Recording Indicator */}
              <div className="relative flex items-center justify-center">
                <span className="absolute h-14 w-14 rounded-full bg-[#4F46E5]/10 animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#4F46E5] to-[#6366F1] shadow-md">
                  <Radio className="h-5 w-5 text-white" style={{ animation: 'gentle-opacity 4s ease-in-out infinite' }} />
                </div>
              </div>

              {/* Patient Info */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#EEF2FF] to-[#E0E7FF] border border-[#C7D2FE] px-3 py-1 text-xs font-semibold tracking-wide text-[#4338CA]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" style={{ animation: 'gentle-opacity 4s ease-in-out infinite' }} />
                    Em Sessão
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#1E293B]">
                  <User className="h-4 w-4 text-[#6366F1]" />
                  <span className="text-sm font-semibold">{selectedPatient?.name}</span>
                </div>
              </div>
            </div>

            {/* Right Section - Timer (Prominent) */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
                <Clock className="h-3.5 w-3.5" />
                Duração
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-5xl font-bold text-[#0F172A] tabular-nums tracking-tight">
                  {formatTime(duration)}
                </span>
              </div>
              <div className="text-xs text-[#64748B] font-medium">
                {duration < 60 ? 'Iniciando...' : duration < 300 ? 'Em andamento' : 'Sessão longa detectada'}
              </div>
            </div>
          </div>

          {/* Progress Bar - Subtle gradient */}
          <div className="h-1 bg-gradient-to-r from-[#4F46E5]/80 via-[#6366F1]/60 to-[#4F46E5]/80" 
               style={{ backgroundSize: '200% 100%', animation: 'shimmer 8s linear infinite' }} 
          />
        </header>

        {/* Main Recording Card - Compact & Focused */}
        <section className="w-full rounded-[2rem] border-2 border-white/70 bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl px-10 py-12 text-center shadow-[0_30px_60px_-20px_rgba(79,70,229,0.25)]">
          {/* Animation Container - Smaller */}
          <div className="mb-6 flex items-center justify-center">
            <div className="relative">
              {/* Softer outer glow rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-36 w-36 rounded-full bg-gradient-to-r from-[#4F46E5]/8 to-[#6366F1]/8 animate-pulse" 
                     style={{ animationDuration: '4s' }} 
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-28 w-28 rounded-full bg-gradient-to-r from-[#4F46E5]/15 to-[#6366F1]/15 animate-pulse" 
                     style={{ animationDuration: '3s', animationDelay: '0.5s' }} 
                />
              </div>
              
              {/* Lottie Animation - Reduced size */}
              <div className="relative z-10">
                <Lottie 
                  animationData={audioRecordingAnimation} 
                  loop={true}
                  className="h-28 w-auto drop-shadow-xl"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Status Text - Calm reassurance */}
          <div className="space-y-3">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center justify-center gap-2.5">
                <Volume2 className="h-5 w-5 text-[#6366F1]" style={{ animation: 'gentle-opacity 4s ease-in-out infinite' }} />
                IA Ativa - Gravando
              </h2>
              <p className="text-sm text-[#64748B] max-w-xl mx-auto leading-relaxed">
                A IA está acompanhando e transcrevendo a sessão em tempo real. Continue o atendimento naturalmente.
              </p>
            </div>

            {/* Real-time Stats - Maintained for confidence */}
            <div className="flex items-center justify-center gap-8 pt-3">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                  <Activity className="h-3.5 w-3.5" />
                  Status
                </div>
                <span className="text-base font-bold text-[#10B981]">Capturando</span>
              </div>
              
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-[#E2E8F0] to-transparent" />
              
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                  <Mic className="h-3.5 w-3.5" />
                  Qualidade
                </div>
                <span className="text-base font-bold text-[#10B981]">Excelente</span>
              </div>
            </div>
          </div>
        </section>

        {/* Actions Section - Clear CTA */}
        <div className="flex w-full flex-col items-center gap-5">
          {!isFinishing ? (
            <button
              onClick={handleStopSession}
              className="group relative inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#EF4444] via-[#F87171] to-[#EF4444] bg-[length:200%_100%] px-12 py-5 text-lg font-bold text-white shadow-[0_20px_40px_-15px_rgba(239,68,68,0.5)] transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(239,68,68,0.6)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FECACA]"
              style={{ animation: 'shimmer 3s linear infinite' }}
            >
              <Square className="h-6 w-6 transition-transform group-hover:scale-110" aria-hidden="true" />
              Finalizar Sessão e Gerar Notas
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" 
                   style={{ transform: 'translateX(-100%)', animation: 'shimmer 2s linear infinite' }} 
              />
            </button>
          ) : (
            <div className="flex w-full items-center justify-center gap-5 rounded-2xl border-2 border-[#E0E7FF] bg-gradient-to-br from-white to-[#F8FAFF] px-10 py-6 shadow-[0_24px_50px_-32px_rgba(99,102,241,0.3)]">
              <div className="relative flex items-center justify-center">
                <LoadingSpinner size="md" />
                <div className="absolute h-12 w-12 rounded-full border-2 border-[#4F46E5]/20 animate-ping" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-base font-bold text-[#0F172A] mb-1">{processingStatus || 'Processando sessão...'}</p>
                <p className="text-sm text-[#64748B]">
                  {processingStatus.includes('Transcrevendo') 
                    ? 'Convertendo áudio em texto com IA avançada. Isso pode levar alguns minutos.'
                    : 'Analisando transcrição e gerando nota clínica personalizada'}
                </p>
              </div>
            </div>
          )}

          {/* Info Banner - Enhanced */}
          {!isFinishing && (
            <div className="flex w-full items-start gap-4 rounded-2xl border border-[#C7D2FE] bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] px-6 py-4 text-sm shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] shadow-lg">
                <AlertCircle className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-[#3730A3]">Dica profissional</p>
                <p className="text-[#4338CA] leading-relaxed">
                  Conduza a consulta naturalmente. Após finalizar, você poderá revisar, editar e aprovar a nota clínica gerada pela IA antes de salvá-la no prontuário.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keyframes for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes gentle-opacity {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default SessionView;
