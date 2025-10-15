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

    try {
      // Criar sessão no backend
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          sessionType: 'Atendimento',
          specialty: 'Fisioterapia',
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar sessão');
      }

      const data = await response.json();
      setSessionId(data.id);
      setSessionStarted(true);
      startRecording();
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Não foi possível criar a sessão. Tente novamente.');
    }
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
    if (!sessionId) {
      alert('Erro: ID da sessão não encontrado');
      return;
    }

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

      // 2. Upload do áudio
      setProcessingStatus('Enviando áudio...');
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const uploadResponse = await fetch(`/api/sessions/${sessionId}/audio`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Falha no upload do áudio');
      }

      console.log('Audio uploaded successfully');

      // 3. Processar com IA (Whisper + GPT-4)
      setProcessingStatus('Transcrevendo com IA...');
      const processResponse = await fetch(`/api/sessions/${sessionId}/process`, {
        method: 'POST',
      });

      if (!processResponse.ok) {
        const error = await processResponse.json();
        throw new Error(error.error || 'Falha no processamento');
      }

      const result = await processResponse.json();
      console.log('Processing complete:', result);

      // 4. Atualizar estado com transcrição e nota gerada
      if (result.session?.transcription) {
        // Dividir transcrição em frases
        const sentences = result.session.transcription
          .split(/[.!?]+/)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
        setTranscription(sentences);
      }

      // Armazenar nota gerada pela IA
      if (result.note) {
        console.log('Nota gerada pela IA:', result.note);
        setGeneratedNote(result.note);
      }

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
        generatedNote={generatedNote}
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
                <p className="text-sm font-semibold text-[#0F172A]">{processingStatus || 'Processando...'}</p>
                <p className="text-xs text-[#64748B]">
                  {processingStatus.includes('Transcrevendo') 
                    ? 'Isso pode levar alguns minutos dependendo do tamanho do áudio'
                    : 'Gerando transcrição e preparando o resumo inteligente'}
                </p>
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
