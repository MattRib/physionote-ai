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
import { useRouter } from 'next/navigation';
import PatientSelector from './PatientSelector';
import SessionSummary from './SessionSummary';

const SessionView = () => {
  const router = useRouter();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{id: string, name: string} | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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
        console.log('Áudio gravado:', audioUrl);
      };

      mediaRecorder.start(1000); // Captura dados a cada 1 segundo
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

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
    console.log('Salvando sessão:', {
      patientId: selectedPatient?.id,
      patientName: selectedPatient?.name,
      duration,
      transcription
    });
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
              <div className="w-16 h-16 bg-gradient-to-br from-[#5A9BCF] to-[#4A8BBF] rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce-gentle">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#333333] animate-fade-in-up">Nova Sessão</h1>
              <p className="text-[#666666] animate-fade-in-up-delay">
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
                className="group flex-1 px-6 py-3 border border-gray-200 text-[#666666] rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium hover:shadow-md hover:-translate-y-0.5"
              >
                Cancelar
              </button>
              <button
                onClick={handleStartSession}
                disabled={!selectedPatient}
                className="group flex-1 px-6 py-3 bg-gradient-to-r from-[#5A9BCF] to-[#4A8BBF] text-white rounded-lg hover:from-[#4A8BBF] hover:to-[#3A7BAF] transition-all duration-300 font-medium shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:translate-y-0 flex items-center justify-center space-x-2 hover:-translate-y-1 relative overflow-hidden"
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

  // Tela de Gravação Limpa e Focada
  return (
    <div className="h-full relative overflow-hidden">
      {/* Liquid Glass Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A9BCF]/20 via-[#4A8BBF]/10 to-[#5A9BCF]/20 backdrop-blur-3xl">
        {/* Animated Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5A9BCF]/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#4A8BBF]/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-[#5A9BCF]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6">
        {/* Recording Message */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl shadow-xl border border-white/20">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-2xl font-semibold text-[#333333]">
              A consulta está sendo gravada
            </span>
          </div>
        </div>

        {/* Animated Microphone */}
        <div className="relative mb-16">
          {/* Sound Waves */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-[#5A9BCF]/20 animate-ping-slow"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center animation-delay-1000">
            <div className="w-80 h-80 rounded-full bg-[#5A9BCF]/10 animate-ping-slow"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center animation-delay-2000">
            <div className="w-96 h-96 rounded-full bg-[#5A9BCF]/5 animate-ping-slow"></div>
          </div>

          {/* Microphone Icon */}
          <div className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-br from-[#5A9BCF] to-[#4A8BBF] flex items-center justify-center shadow-2xl animate-pulse-gentle">
            <div className="w-44 h-44 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Mic className="w-24 h-24 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-12 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-md px-12 py-6 rounded-2xl shadow-xl border border-white/20">
            <div className="text-6xl font-bold font-mono text-[#333333] tracking-wider">
              {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <div className="mb-16 animate-fade-in">
          <div className="bg-white/60 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
            <p className="text-[#666666] text-sm">Paciente</p>
            <p className="text-xl font-semibold text-[#333333]">{selectedPatient?.name}</p>
          </div>
        </div>

        {/* Finish Button */}
        {!isFinishing ? (
          <button
            onClick={handleStopSession}
            className="group relative px-12 py-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 animate-fade-in"
          >
            <div className="flex items-center space-x-3">
              <Square className="w-7 h-7 fill-current" />
              <span>Finalizar Consulta e Gerar Transcrição</span>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-400 to-red-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10"></div>
          </button>
        ) : (
          /* Finishing Animation */
          <div className="animate-fade-in">
            <div className="bg-white/80 backdrop-blur-md px-12 py-6 rounded-2xl shadow-xl border border-white/20 flex items-center space-x-4">
              <Loader2 className="w-8 h-8 text-[#5A9BCF] animate-spin" />
              <div className="text-left">
                <p className="text-xl font-semibold text-[#333333]">Finalizando consulta...</p>
                <p className="text-sm text-[#666666]">Processando gravação e gerando transcrição</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Message */}
        {!isFinishing && (
          <div className="mt-8 animate-fade-in">
            <div className="bg-blue-50/80 backdrop-blur-md px-6 py-3 rounded-xl border border-blue-200/50 flex items-start space-x-2 max-w-md">
              <AlertCircle className="w-5 h-5 text-[#5A9BCF] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#666666]">
                Continue com o atendimento normalmente. A transcrição será gerada automaticamente ao finalizar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionView;
