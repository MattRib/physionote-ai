'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Info,
  Mic,
  Plus,
  Search,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NewSessionFlowProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

type SessionStatus = 'Concluída' | 'Processando' | 'Erro';

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
  lastSession?: {
    date: string;
    duration: string;
    status: SessionStatus;
  };
  recentSessions: Array<{
    date: string;
    status: SessionStatus;
  }>;
}

const MOCK_PATIENTS: PatientSummary[] = [
  {
    id: 'p1',
    name: 'Maria Fernanda Souza',
    initials: 'MF',
    avatarColor: '#E0EAFF',
    consentActive: true,
    hasPendingData: false,
    primaryGoal: 'Retomar rotina sem dores lombares',
    treatmentFocus: 'Fortalecimento do core e mobilização lombar',
    nextReview: '15/10/2025',
    lastSession: {
      date: '08/10/2025 • 16:00',
      duration: '45 min',
      status: 'Concluída'
    },
    recentSessions: [
      { date: '08/10/2025', status: 'Concluída' },
      { date: '01/10/2025', status: 'Concluída' },
      { date: '24/09/2025', status: 'Processando' }
    ]
  },
  {
    id: 'p2',
    name: 'João Pedro Carvalho',
    initials: 'JP',
    avatarColor: '#E9D5FF',
    consentActive: true,
    hasPendingData: true,
    primaryGoal: 'Recuperar estabilidade de joelho pós-cirúrgico',
    treatmentFocus: 'Reeducação proprioceptiva e fortalecimento',
    nextReview: '18/10/2025',
    lastSession: {
      date: '03/10/2025 • 10:30',
      duration: '50 min',
      status: 'Processando'
    },
    recentSessions: [
      { date: '03/10/2025', status: 'Processando' },
      { date: '26/09/2025', status: 'Concluída' },
      { date: '19/09/2025', status: 'Concluída' }
    ]
  },
  {
    id: 'p3',
    name: 'Ana Luiza Melo',
    initials: 'AL',
    avatarColor: '#FDE7E9',
    consentActive: false,
    hasPendingData: false,
    primaryGoal: 'Reduzir espasticidade em membro superior',
    treatmentFocus: 'Terapia manual e treino funcional',
    nextReview: '22/10/2025',
    lastSession: {
      date: '20/09/2025 • 15:15',
      duration: '35 min',
      status: 'Erro'
    },
    recentSessions: [
      { date: '20/09/2025', status: 'Erro' },
      { date: '13/09/2025', status: 'Concluída' },
      { date: '06/09/2025', status: 'Concluída' }
    ]
  }
];

const SESSION_TYPES = ['Avaliação', 'Evolução', 'Revisão'];
const SPECIALTIES = [
  'Ortopedia Funcional',
  'Neurologia Adulto',
  'Pediatria',
  'Pélvica',
  'Cardiorrespiratória',
  'Esportiva'
];

const statusBadgeStyles: Record<SessionStatus, { bg: string; text: string }> = {
  Concluída: { bg: 'bg-[#D1FADF]', text: 'text-[#166534]' },
  Processando: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' },
  Erro: { bg: 'bg-[#FEE2E2]', text: 'text-[#B91C1C]' }
};

const NewSessionFlow: React.FC<NewSessionFlowProps> = ({ onSuccess, onCancel, isModal = false }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);
  const [motivation, setMotivation] = useState('');
  const [sessionType, setSessionType] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');
  const [notesTooltipVisible, setNotesTooltipVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredPatients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return MOCK_PATIENTS;
    return MOCK_PATIENTS.filter((patient) => patient.name.toLowerCase().includes(normalized));
  }, [query]);

  const patientNotFound = query.trim().length > 0 && filteredPatients.length === 0;

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = setTimeout(() => setToastMessage(null), 3800);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  const allChecksPassed = Boolean(
    selectedPatient &&
      selectedPatient.consentActive &&
      !selectedPatient.hasPendingData
  );

  const handleStartSession = (event: React.FormEvent<HTMLFormElement>) => {
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

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage(`Sessão iniciada com sucesso para ${selectedPatient.name}.`);
      onSuccess?.();
      const params = new URLSearchParams({
        patientId: selectedPatient.id,
        patientName: selectedPatient.name
      });

      router.push(`/dashboard/session?${params.toString()}`);
    }, 900);
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
              <p className="text-sm text-[#64748B]">Digite o nome completo para carregar os dados e revisar o histórico antes de iniciar.</p>
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
            {query ? (
              patientNotFound ? (
                <p className="mt-2 text-xs font-medium text-[#DC2626]">
                  Nenhum paciente encontrado com esse nome. Verifique a grafia ou cadastre um novo paciente.
                </p>
              ) : (
                <div className="mt-3 grid gap-2 rounded-2xl border border-[#E2E8F0] bg-white p-3">
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
                              Última sessão {patient.lastSession.date} — {patient.lastSession.duration}
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
              )
            ) : null}
          </div>

          {selectedPatient ? (
            <div className="animate-fade-in-up rounded-2xl border border-[#E0E7FF] bg-[#F8FAFF] p-5 shadow-inner">
              <div className="flex flex-wrap items-center justify-between gap-4">
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
                {selectedPatient.recentSessions.map((session) => {
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
                })}
              </div>
            </div>
          ) : null}
        </section>

        {selectedPatient ? (
          <section className="mt-8 space-y-5 rounded-2xl border border-[#E2E8F0] bg-white/70 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">2. Detalhes da Sessão</h2>
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
                  onChange={(event) => setSessionType(event.target.value)}
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#111827] focus:border-[#6366F1] focus:outline-none"
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
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#374151]" htmlFor="specialty">
                  Especialidade
                </label>
                <select
                  id="specialty"
                  value={specialty}
                  onChange={(event) => setSpecialty(event.target.value)}
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#111827] focus:border-[#6366F1] focus:outline-none"
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
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#374151]" htmlFor="motivation">
                  Motivo da sessão / Observações iniciais
                </label>
                <textarea
                  id="motivation"
                  value={motivation}
                  onChange={(event) => setMotivation(event.target.value)}
                  rows={5}
                  placeholder="Ex.: Revisar exercícios de fortalecimento prescritos na última consulta, monitorar evolução da dor lombar..."
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#111827] transition-all focus:border-[#6366F1] focus:outline-none"
                />
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-8 space-y-6 rounded-2xl border border-[#E2E8F0] bg-white/80 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#111827]">3. Confirmação</h2>
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
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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