'use client';

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
  Mic,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  FileAudio,
  X,
  File,
  Music
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';

type RecordingMode = 'live' | 'upload';

type PatientSessionStatus = 'Concluída' | 'Agendada' | 'Em andamento' | 'Pendente';

const statusBadgeStyles: Record<PatientSessionStatus, { bg: string; text: string }> = {
  Concluída: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Agendada: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  'Em andamento': { bg: 'bg-sky-50', text: 'text-sky-700' },
  Pendente: { bg: 'bg-amber-50', text: 'text-amber-700' }
};

const AVATAR_COLORS = [
  '#EEF2FF',
  '#FCE7F3',
  '#DBEAFE',
  '#DCFCE7',
  '#FFE4E6',
  '#FEF3C7'
];

const SESSION_TYPES = [
  'Avaliação inicial',
  'Retorno',
  'Teleconsulta',
  'Acompanhamento',
  'Reavaliação'
];

const SPECIALTIES = [
  'Fisioterapia Ortopédica',
  'Fisioterapia Neurológica',
  'Fisioterapia Esportiva',
  'Fisioterapia Respiratória',
  'Pilates Clínico'
];

const MIN_MOTIVATION_LENGTH = 18;

type ApiPatient = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  createdAt: string;
  totalSessions: number;
  lastSession: string | null;
};

interface PatientSessionSummary {
  date: string;
  status: PatientSessionStatus;
  duration?: string;
}

interface PatientSummary {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  consentActive: boolean;
  hasPendingData: boolean;
  primaryGoal: string;
  treatmentFocus: string;
  nextReview: string;
  lastSession: {
    date: string;
    duration?: string;
    status: PatientSessionStatus;
  } | null;
  recentSessions: PatientSessionSummary[];
}

interface NewSessionFlowProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .join('');
};

const formatLastSession = (
  isoDate: string | null | undefined
): PatientSummary['lastSession'] => {
  if (!isoDate) {
    return null;
  }

  const dateObj = new Date(isoDate);
  if (Number.isNaN(dateObj.getTime())) {
    return null;
  }

  const dateStr = dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const timeStr = dateObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return {
    date: `${dateStr} • ${timeStr}`,
    duration: '—',
    status: 'Concluída'
  };
};

const buildPatientSummary = (patient: ApiPatient, index: number): PatientSummary => {
  const lastSession = formatLastSession(patient.lastSession);
  const nextReview = patient.lastSession
    ? new Date(patient.lastSession).toLocaleDateString('pt-BR')
    : 'Agendar';

  const recentSessions = lastSession
    ? [
        {
          date: lastSession.date.split(' • ')[0],
          status: lastSession.status,
          duration: lastSession.duration
        }
      ]
    : [];

  return {
    id: patient.id,
    name: patient.name,
    initials: getInitials(patient.name) || patient.name.slice(0, 2).toUpperCase(),
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    consentActive: true,
    hasPendingData: false,
    primaryGoal: 'Objetivo a definir com o paciente',
    treatmentFocus: 'Personalizar plano terapêutico',
    nextReview,
    lastSession,
    recentSessions
  };
};

const NewSessionFlow: React.FC<NewSessionFlowProps> = ({ onSuccess, onCancel, isModal = false }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);
  const [motivation, setMotivation] = useState('');
  const [sessionType, setSessionType] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');
  const [detailsTouched, setDetailsTouched] = useState({
    sessionType: false,
    specialty: false,
    motivation: false
  });
  const [notesTooltipVisible, setNotesTooltipVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Estados para upload de áudio
  const [recordingMode, setRecordingMode] = useState<RecordingMode>('live');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPatients = useCallback(async () => {
    try {
      setPatientsLoading(true);
      setPatientsError(null);
      const response = await fetch('/api/patients');

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? 'Não foi possível carregar os pacientes.');
      }

      const data = (await response.json()) as ApiPatient[];
      const summaries = data.map((patient, index) => buildPatientSummary(patient, index));

      setPatients(summaries);
    } catch (error: any) {
      setPatientsError(error?.message ?? 'Erro inesperado ao carregar pacientes.');
      setPatients([]);
    } finally {
      setPatientsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPatients();
  }, [loadPatients]);

  const filteredPatients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return patients;
    }
    return patients.filter((patient) => patient.name.toLowerCase().includes(normalized));
  }, [patients, query]);

  const sessionTypeValid = Boolean(sessionType);
  const specialtyValid = Boolean(specialty);
  const motivationLength = motivation.trim().length;
  const motivationValid = motivationLength >= MIN_MOTIVATION_LENGTH;
  const showSessionTypeError = detailsTouched.sessionType && !sessionTypeValid;
  const showSpecialtyError = detailsTouched.specialty && !specialtyValid;
  const showMotivationError = detailsTouched.motivation && !motivationValid;

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = setTimeout(() => setToastMessage(null), 3800);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  const allChecksPassed = Boolean(
    selectedPatient &&
      selectedPatient.consentActive &&
      !selectedPatient.hasPendingData &&
      sessionTypeValid &&
      specialtyValid &&
      motivationValid
  );

  const handleStartSession = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedPatient) {
      setToastMessage('Selecione um paciente para iniciar a sessão.');
      return;
    }

    if (!selectedPatient.consentActive) {
      setToastMessage('É necessário registrar o consentimento LGPD do paciente.');
      return;
    }

    if (selectedPatient.hasPendingData) {
      setToastMessage('Complete os dados cadastrais do paciente antes de iniciar.');
      return;
    }

    if (!sessionTypeValid || !specialtyValid || !motivationValid) {
      setDetailsTouched({ sessionType: true, specialty: true, motivation: true });
      setToastMessage('Preencha os detalhes da sessão antes de iniciar.');
      return;
    }

    // Validar upload se o modo for 'upload'
    if (recordingMode === 'upload' && !selectedFile) {
      setToastMessage('Selecione um arquivo de áudio para fazer upload.');
      return;
    }

    setIsSubmitting(true);
    try {
      let response;

      // Se for upload, enviar com FormData
      if (recordingMode === 'upload' && selectedFile) {
        const formData = new FormData();
        formData.append('patientId', selectedPatient.id);
        formData.append('sessionType', sessionType);
        formData.append('specialty', specialty);
        formData.append('motivation', motivation.trim());
        formData.append('audio', selectedFile);
        formData.append('recordingMode', 'upload');

        response = await fetch('/api/sessions', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Modo gravação ao vivo (mantém comportamento anterior)
        response = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            patientId: selectedPatient.id,
            sessionType,
            specialty,
            motivation: motivation.trim(),
            recordingMode: 'live'
          })
        });
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? 'Falha ao iniciar a sessão.');
      }

      const payload = (await response.json()) as { id: string };

      onSuccess?.();
      const params = new URLSearchParams({
        sessionId: payload.id,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name
      });

      router.push(`/dashboard/session?${params.toString()}`);
    } catch (error: any) {
      console.error('Failed to start session', error);
      setToastMessage(error?.message ?? 'Não foi possível iniciar a sessão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isModal) {
      onCancel?.();
    } else {
      router.push('/dashboard');
    }
  };

  const handleNewPatient = () => {
    setToastMessage('Fluxo de “Novo Paciente” em desenvolvimento.');
  };

  const handleViewAISummary = () => {
    setToastMessage('Resumo inteligente gerado automaticamente (em breve).');
  };

  // Funções para upload de arquivo
  const ACCEPTED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/ogg', 'audio/webm'];
  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
      return 'Formato não suportado. Use MP3, WAV, M4A ou OGG.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Arquivo muito grande. Tamanho máximo: 25MB.';
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setToastMessage(error);
      return;
    }
    setSelectedFile(file);
    setUploadProgress(0);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const containerClasses = isModal ? 'w-full' : 'min-h-screen bg-[#F8FAFC] p-6 md:p-10';
  const cardClasses = `mx-auto w-full max-w-5xl rounded-3xl bg-white/95 shadow-[0_24px_72px_-32px_rgba(15,23,42,0.25)] backdrop-blur-md ${
    isModal ? 'p-6 md:p-8' : 'p-8 md:p-10'
  }`;

  return (
    <div className={containerClasses}>
      {toastMessage ? (
        <div className="mx-auto mb-4 flex max-w-5xl items-center justify-between rounded-xl bg-[#EEF2FF] px-6 py-3 text-sm font-medium text-[#3730A3] shadow-sm">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[#6366F1] transition-colors hover:text-[#312E81]"
          >
            Fechar
          </button>
        </div>
      ) : null}

      <form onSubmit={handleStartSession} className={cardClasses}>
        <header className="mb-10 flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] text-white shadow-[0_20px_45px_-28px_rgba(79,70,229,0.65)]">
            <Mic className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-[#0F172A]">Nova Sessão</h1>
            <p className="text-sm text-[#64748B]">
              Selecione um paciente e personalize os detalhes para automatizar a nota clínica.
            </p>
          </div>
        </header>

        <section className="space-y-4 rounded-2xl border border-[#E2E8F0] bg-white/60 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#111827]">1. Selecionar Paciente</h2>
              <p className="text-sm text-[#64748B]">
                Digite o nome completo para carregar os dados e revisar o histórico antes de iniciar.
              </p>
            </div>
            <button
              type="button"
              onClick={handleNewPatient}
              className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5F5] px-4 py-2 text-sm font-medium text-[#4F46E5] transition-all hover:border-[#A5B4FC] hover:bg-[#EEF2FF]"
            >
              <Plus className="h-4 w-4" />
              Novo Paciente
            </button>
          </div>

          <div>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedPatient(null);
                }}
                placeholder="Buscar paciente pelo nome"
                className="w-full rounded-2xl border border-[#E2E8F0] bg-white px-12 py-3 text-sm text-[#111827] shadow-[0_14px_30px_-24px_rgba(79,70,229,0.35)] transition-all placeholder:text-[#94A3B8] focus:border-[#6366F1] focus:shadow-[0_22px_45px_-28px_rgba(79,70,229,0.45)] focus:outline-none"
              />
            </div>

            <div className="mt-3 min-h-[3rem]">
              {patientsLoading ? (
                <div className="flex items-center gap-2 rounded-2xl border border-dashed border-[#C7D2FE] bg-[#EEF2FF] px-4 py-3 text-sm text-[#4F46E5]">
                  <LoadingSpinner size="sm" />
                  Carregando pacientes...
                </div>
              ) : patientsError ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-[#FCA5A5] bg-[#FEE2E2] px-4 py-3 text-sm text-[#B91C1C]">
                  <span>{patientsError}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setSelectedPatient(null);
                      void loadPatients();
                    }}
                    className="inline-flex w-max items-center gap-2 rounded-full border border-[#FCA5A5] px-3 py-1.5 text-xs font-semibold text-[#B91C1C] transition hover:bg-[#FEE2E2]/80"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Tentar novamente
                  </button>
                </div>
              ) : filteredPatients.length === 0 ? (
                query.trim() ? (
                  <p className="text-xs font-medium text-[#DC2626]">
                    Nenhum paciente encontrado com esse nome. Verifique a grafia ou cadastre um novo paciente.
                  </p>
                ) : (
                  <p className="text-xs font-medium text-[#64748B]">
                    Nenhum paciente cadastrado ainda. Utilize o botão Novo Paciente para começar.
                  </p>
                )
              ) : (
                <div className="grid gap-2 rounded-2xl border border-[#E2E8F0] bg-white p-3">
                  {filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setQuery(patient.name);
                      }}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
                        selectedPatient?.id === patient.id
                          ? 'border border-[#C7D2FE] bg-[#EEF2FF] text-[#4F46E5]'
                          : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-[#0F172A]"
                          style={{ backgroundColor: patient.avatarColor }}
                        >
                          {patient.initials}
                        </div>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium text-[#0F172A]">{patient.name}</span>
                          {patient.lastSession ? (
                            <span className="text-xs text-[#64748B]">
                              Última sessão {patient.lastSession.date}
                            </span>
                          ) : (
                            <span className="text-xs text-[#CBD5E1]">Sem histórico de sessões</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#CBD5E1]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedPatient ? (
            <>
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-semibold text-[#0F172A]"
                  style={{ backgroundColor: selectedPatient.avatarColor }}
                >
                  {selectedPatient.initials}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A]">{selectedPatient.name}</h3>
                  {selectedPatient.lastSession ? (
                    <p className="text-sm text-[#64748B]">
                      Última sessão {selectedPatient.lastSession.date} · {selectedPatient.lastSession.duration}
                    </p>
                  ) : (
                    <p className="text-sm text-[#CBD5E1]">Sem sessões registradas</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {selectedPatient.consentActive ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#047857]">
                    <ShieldCheck className="h-4 w-4" />
                    LGPD ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#92400E]">
                    <AlertTriangle className="h-4 w-4" />
                    Sem consentimento
                  </span>
                )}

                {selectedPatient.hasPendingData ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#92400E]">
                    <AlertCircle className="h-4 w-4" />
                    Pendências cadastrais
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#3730A3]">
                    <CheckCircle2 className="h-4 w-4" />
                    Dados completos
                  </span>
                )}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Objetivo principal</span>
                  <p className="mt-1 text-sm font-medium text-[#1E293B]">{selectedPatient.primaryGoal}</p>
                </div>
                <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Foco terapêutico</span>
                  <p className="mt-1 text-sm font-medium text-[#1E293B]">{selectedPatient.treatmentFocus}</p>
                </div>
                <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Próxima revisão</span>
                  <p className="mt-1 text-sm font-medium text-[#1E293B]">{selectedPatient.nextReview}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h4 className="text-sm font-semibold text-[#1E293B]">Histórico recente de sessões</h4>
                <button
                  type="button"
                  onClick={handleViewAISummary}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#C7D2FE] bg-white px-4 py-2 text-sm font-semibold text-[#4F46E5] transition-all hover:border-[#A5B4FC] hover:bg-[#EEF2FF]"
                >
                  <Sparkles className="h-4 w-4" />
                  Ver resumo inteligente
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {selectedPatient.recentSessions.length > 0 ? (
                  selectedPatient.recentSessions.map((session) => {
                    const styles = statusBadgeStyles[session.status];
                    return (
                      <div
                        key={`${session.date}-${session.status}`}
                        className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-sm"
                      >
                        <span className="block text-sm font-semibold text-[#0F172A]">{session.date}</span>
                        <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles.bg} ${styles.text}`}>
                          {session.status}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white px-4 py-6 text-center text-sm text-[#94A3B8]">
                    Nenhuma sessão registrada ainda.
                  </div>
                )}
              </div>
            </>
          ) : null}
        </section>

        {selectedPatient ? (
          <>
            {/* Seção 2: Método de Captura */}
            <section className="mt-8 space-y-5 rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white/90 to-[#F8FAFF] p-6">
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">2. Método de Captura de Áudio</h2>
                <p className="text-sm text-[#64748B]">Escolha como deseja fornecer o áudio da sessão para transcrição.</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRecordingMode('live');
                    setSelectedFile(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 font-semibold transition-all duration-300 ${
                    recordingMode === 'live'
                      ? 'border-[#4F46E5] bg-gradient-to-br from-[#4F46E5] to-[#6366F1] text-white shadow-[0_16px_35px_-24px_rgba(79,70,229,0.65)]'
                      : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#C7D2FE] hover:bg-[#EEF2FF] hover:text-[#4F46E5]'
                  }`}
                >
                  <Mic className="h-5 w-5" />
                  <span>Gravar Agora</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRecordingMode('upload')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 font-semibold transition-all duration-300 ${
                    recordingMode === 'upload'
                      ? 'border-[#4F46E5] bg-gradient-to-br from-[#4F46E5] to-[#6366F1] text-white shadow-[0_16px_35px_-24px_rgba(79,70,229,0.65)]'
                      : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#C7D2FE] hover:bg-[#EEF2FF] hover:text-[#4F46E5]'
                  }`}
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload de Arquivo</span>
                </button>
              </div>

              {/* Conteúdo do modo selecionado */}
              {recordingMode === 'live' ? (
                <div className="rounded-xl border border-[#E0E7FF] bg-[#F8FAFF] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5]">
                      <Mic className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#111827]">Gravação ao Vivo</h3>
                  </div>
                  <p className="text-sm text-[#64748B] mb-4">
                    A gravação será iniciada automaticamente quando você avançar para a próxima etapa. 
                    Certifique-se de que seu microfone está funcionando corretamente.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[#6366F1]">
                    <Info className="h-4 w-4" />
                    <span>Duração máxima: 2 horas • Formato: WAV/WebM</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {!selectedFile ? (
                    <div
                      onDrop={handleFileDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`rounded-xl border-2 border-dashed transition-all duration-300 ${
                        isDragging
                          ? 'border-[#4F46E5] bg-[#EEF2FF]'
                          : 'border-[#E2E8F0] bg-white hover:border-[#C7D2FE] hover:bg-[#F8FAFF]'
                      }`}
                    >
                      <div className="p-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE]">
                          <FileAudio className="h-8 w-8 text-[#4F46E5]" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-[#111827]">
                          {isDragging ? 'Solte o arquivo aqui' : 'Arraste um arquivo de áudio'}
                        </h3>
                        <p className="mb-4 text-sm text-[#64748B]">
                          ou clique para selecionar do seu computador
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_-24px_rgba(79,70,229,0.65)] transition-transform hover:-translate-y-0.5"
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar Arquivo
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="audio/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                        <p className="mt-4 text-xs text-[#94A3B8]">
                          Formatos suportados: MP3, WAV, M4A, OGG • Máximo: 25MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[#D1FAE5] bg-gradient-to-br from-[#ECFDF5] to-white p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]">
                            <Music className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#111827] truncate">{selectedFile.name}</h4>
                            <p className="text-sm text-[#64748B] mt-1">{formatFileSize(selectedFile.size)}</p>
                            <div className="mt-3 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                              <span className="text-xs font-medium text-[#059669]">Arquivo pronto para upload</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
                          title="Remover arquivo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Seção 3: Detalhes da Sessão */}
            <section className="mt-8 space-y-5 rounded-2xl border border-[#E2E8F0] bg-white/70 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#111827]">3. Detalhes da Sessão</h2>
                  <p className="text-sm text-[#64748B]">Personalize o encontro com informações que aceleram a documentação.</p>
                </div>
              <button
                type="button"
                onMouseEnter={() => setNotesTooltipVisible(true)}
                onMouseLeave={() => setNotesTooltipVisible(false)}
                className="relative text-[#94A3B8]"
              >
                <Info className="h-5 w-5" />
                {notesTooltipVisible ? (
                  <span className="absolute right-0 top-8 w-60 rounded-xl border border-[#E0E7FF] bg-white px-4 py-3 text-left text-xs text-[#475569] shadow-lg">
                    Essas informações ajudam a personalizar a nota clínica automaticamente.
                  </span>
                ) : null}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#374151]" htmlFor="sessionType">
                  Tipo de sessão
                </label>
                <select
                  id="sessionType"
                  value={sessionType}
                  onChange={(event) => {
                    setSessionType(event.target.value);
                    setDetailsTouched((prev) => ({ ...prev, sessionType: true }));
                  }}
                  onBlur={() =>
                    setDetailsTouched((prev) => ({ ...prev, sessionType: true }))
                  }
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#111827] focus:outline-none ${
                    showSessionTypeError
                      ? 'border-[#FCA5A5] focus:border-[#EF4444]'
                      : 'border-[#E2E8F0] focus:border-[#6366F1]'
                  }`}
                >
                  <option value="" className="text-[#94A3B8]">
                    Selecionar
                  </option>
                  {SESSION_TYPES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {showSessionTypeError ? (
                  <p className="mt-1 text-xs text-[#DC2626]">Selecione o tipo de sessão.</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#374151]" htmlFor="specialty">
                  Especialidade
                </label>
                <select
                  id="specialty"
                  value={specialty}
                  onChange={(event) => {
                    setSpecialty(event.target.value);
                    setDetailsTouched((prev) => ({ ...prev, specialty: true }));
                  }}
                  onBlur={() =>
                    setDetailsTouched((prev) => ({ ...prev, specialty: true }))
                  }
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#111827] focus:outline-none ${
                    showSpecialtyError
                      ? 'border-[#FCA5A5] focus:border-[#EF4444]'
                      : 'border-[#E2E8F0] focus:border-[#6366F1]'
                  }`}
                >
                  <option value="" className="text-[#94A3B8]">
                    Selecione uma especialidade
                  </option>
                  {SPECIALTIES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {showSpecialtyError ? (
                  <p className="mt-1 text-xs text-[#DC2626]">Informe a especialidade desta sessão.</p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#374151]" htmlFor="motivation">
                  Motivo da sessão / Observações iniciais
                </label>
                <textarea
                  id="motivation"
                  value={motivation}
                  onChange={(event) => {
                    setMotivation(event.target.value);
                    setDetailsTouched((prev) => ({ ...prev, motivation: true }));
                  }}
                  onBlur={() =>
                    setDetailsTouched((prev) => ({ ...prev, motivation: true }))
                  }
                  rows={5}
                  placeholder="Ex.: Revisar exercícios de fortalecimento prescritos na última consulta, monitorar evolução da dor lombar..."
                  className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#111827] transition-all focus:outline-none ${
                    showMotivationError
                      ? 'border-[#FCA5A5] focus:border-[#EF4444]'
                      : 'border-[#E2E8F0] focus:border-[#6366F1]'
                  }`}
                />
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className={showMotivationError ? 'text-[#DC2626]' : 'text-[#94A3B8]'}>
                    {showMotivationError
                      ? `Descreva com pelo menos ${MIN_MOTIVATION_LENGTH} caracteres.`
                      : `Mínimo de ${MIN_MOTIVATION_LENGTH} caracteres para personalizar a nota.`}
                  </span>
                  <span
                    className={`font-medium ${
                      motivationValid ? 'text-[#6366F1]' : 'text-[#CBD5E1]'
                    }`}
                  >
                    {motivationLength}
                  </span>
                </div>
              </div>
            </div>
          </section>
          </>
        ) : null}

        <section className="mt-8 space-y-6 rounded-2xl border border-[#E2E8F0] bg-white/80 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#111827]">4. Confirmação</h2>
            <p className="text-sm text-[#94A3B8]">Revise antes de iniciar a sessão</p>
          </div>

          <div className="space-y-3">
            <ChecklistItem
              label="Paciente selecionado"
              success={Boolean(selectedPatient)}
            />
            <ChecklistItem
              label="Consentimento LGPD ativo"
              success={Boolean(selectedPatient?.consentActive)}
            />
            <ChecklistItem
              label="Dados cadastrais completos"
              success={Boolean(selectedPatient && !selectedPatient.hasPendingData)}
              warnMessage="Revise o cadastro do paciente antes de seguir"
            />
            <ChecklistItem
              label="Detalhes da sessão preenchidos"
              success={sessionTypeValid && specialtyValid && motivationValid}
              warnMessage="Complete a etapa 2 para automatizar a nota"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 md:flex-row">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-cancel flex-1 rounded-xl px-6 py-3 text-sm font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!allChecksPassed || isSubmitting}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-20px_rgba(79,70,229,0.65)] transition-all hover:shadow-[0_24px_50px_-22px_rgba(79,70,229,0.75)] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Abrindo consulta...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Ir para consulta
                </>
              )}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};

interface ChecklistItemProps {
  label: string;
  success: boolean;
  warnMessage?: string;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ label, success, warnMessage }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm">
      <div className="flex items-center gap-3">
        {success ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ECFDF5] text-[#047857]">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FEF3C7] text-[#92400E]">
            <AlertTriangle className="h-4 w-4" />
          </div>
        )}
        <span className="font-medium text-[#0F172A]">{label}</span>
      </div>
      {!success && warnMessage ? (
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
          {warnMessage}
        </span>
      ) : null}
    </div>
  );
};

export default NewSessionFlow;