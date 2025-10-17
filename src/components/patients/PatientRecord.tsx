'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Clock,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Pin,
  PinOff,
  Trash2,
  RefreshCw,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import AlertModal from '@/components/common/AlertModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Tipos para a resposta da API
interface NoteContent {
  resumoExecutivo?: {
    queixaPrincipal?: string;
    nivelDor?: number | null;
    evolucao?: string | null;
  };
  anamnese?: {
    historicoAtual?: string;
    antecedentesPessoais?: string;
    medicamentos?: string;
    objetivos?: string;
  };
  diagnosticoFisioterapeutico?: {
    principal?: string;
    secundarios?: string[]; // API retorna "secundarios", não "secundario"
    cif?: string;
  };
  intervencoes?: {
    tecnicasManuais?: string[];
    exerciciosTerapeuticos?: string[];
    recursosEletrotermo?: string[]; // API retorna este nome
  };
  respostaTratamento?: {
    imediata?: string;
    efeitos?: string;
    feedback?: string;
  };
  orientacoes?: {
    domiciliares?: string[];
    ergonomicas?: string[];
    precaucoes?: string[];
  };
  planoTratamento?: {
    frequencia?: string;
    duracaoPrevista?: string;
    objetivosCurtoPrazo?: string[];
    objetivosLongoPrazo?: string[];
    criteriosAlta?: string[];
  };
  observacoesAdicionais?: string;
  proximaSessao?: {
    data?: string;
    foco?: string;
  };
}

interface SessionNote {
  id: string;
  aiGenerated: boolean;
  aiModel: string | null;
  createdAt: string;
  updatedAt: string;
  content: NoteContent;
}

interface SessionWithNote {
  id: string;
  date: string;
  durationMin: number | null;
  sessionType: string | null;
  specialty: string | null;
  motivation: string | null;
  status: string;
  transcription: string | null;
  note: SessionNote | null;
  createdAt: string;
  updatedAt: string;
}

interface HistorySummary {
  id: string;
  content: string;
  isPinned: boolean;
  sessionsIds: string[];
  aiModel: string;
  createdAt: string;
  updatedAt: string;
}

interface PatientRecordResponse {
  patient: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    cpf: string | null;
    birthDate: string | null;
    gender: string | null;
    address: {
      street: string | null;
      number: string | null;
      complement?: string | null;
      neighborhood: string | null;
      city: string | null;
      state: string | null;
      zipCode: string | null;
    };
    createdAt: string;
    updatedAt: string;
  };
  statistics: {
    totalSessions: number;
    completedSessions: number;
    totalDurationMinutes: number;
    averageDurationMinutes: number;
    firstSessionDate: string | null;
    lastSessionDate: string | null;
  };
  sessions: SessionWithNote[];
}

interface PatientRecordProps {
  patientId: string;
}

const PatientRecord: React.FC<PatientRecordProps> = ({ patientId }) => {
  const router = useRouter();
  
  // Estados
  const [recordData, setRecordData] = useState<PatientRecordResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [summarizingHistory, setSummarizingHistory] = useState(false);
  const [historySummary, setHistorySummary] = useState<HistorySummary | null>(null);
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [editedResumeContent, setEditedResumeContent] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
    showCancel?: boolean;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  // Busca dados do prontuário ao montar o componente
  useEffect(() => {
    const fetchPatientRecord = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [recordResponse, summaryResponse] = await Promise.all([
          fetch(`/api/patients/${patientId}/record`),
          fetch(`/api/patients/${patientId}/history-summary`)
        ]);
        
        if (!recordResponse.ok) {
          throw new Error('Erro ao buscar prontuário do paciente');
        }
        
        const recordData: PatientRecordResponse = await recordResponse.json();
        setRecordData(recordData);
        setVisibleCount(Math.min(5, recordData.sessions.length));

        // Summary pode não existir, não é erro
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          if (summaryData.summary) {
            setHistorySummary(summaryData.summary);
          }
        }
      } catch (err: any) {
        console.error('Erro ao buscar prontuário:', err);
        setError(err.message || 'Erro ao carregar prontuário');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientRecord();
  }, [patientId]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const toggleNote = (noteId: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  };

  const handleSummarizeHistory = async () => {
    // Verificar se já existe resumo
    if (historySummary) {
      setAlertModal({
        isOpen: true,
        type: 'warning',
        title: 'Substituir resumo existente?',
        message: 'Já existe um resumo do histórico. Deseja gerar um novo resumo com base nas sessões atualizadas? Esta ação não pode ser desfeita.',
        confirmText: 'Sim, gerar novo resumo',
        showCancel: true,
        onConfirm: () => generateNewSummary()
      });
      return;
    }

    generateNewSummary();
  };

  const generateNewSummary = async () => {
    try {
      setSummarizingHistory(true);
      
      const response = await fetch(`/api/patients/${patientId}/history-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Falha ao gerar resumo');
      }

      const data = await response.json();
      setHistorySummary(data.summary);
      showToast('success', 'Resumo do histórico gerado com sucesso!');
    } catch (e: any) {
      console.error(e);
      setAlertModal({
        isOpen: true,
        type: 'error',
        title: 'Erro ao gerar resumo',
        message: e.message || 'Não foi possível gerar o resumo com IA agora. Tente novamente.'
      });
    } finally {
      setSummarizingHistory(false);
    }
  };

  const handleTogglePin = async () => {
    if (!historySummary) return;

    try {
      const response = await fetch(`/api/patients/${patientId}/history-summary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !historySummary.isPinned })
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar fixação');
      }

      const data = await response.json();
      setHistorySummary(data.summary);
      showToast('success', data.summary.isPinned ? 'Resumo fixado!' : 'Resumo desfixado');
    } catch (e: any) {
      console.error(e);
      showToast('error', 'Erro ao atualizar fixação do resumo');
    }
  };

  const handleDeleteSummary = () => {
    setAlertModal({
      isOpen: true,
      type: 'warning',
      title: 'Excluir resumo?',
      message: 'Tem certeza que deseja excluir o resumo do histórico? Esta ação não pode ser desfeita.',
      confirmText: 'Sim, excluir',
      showCancel: true,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/patients/${patientId}/history-summary`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            throw new Error('Falha ao excluir resumo');
          }

          setHistorySummary(null);
          showToast('success', 'Resumo excluído com sucesso');
        } catch (e: any) {
          console.error(e);
          setAlertModal({
            isOpen: true,
            type: 'error',
            title: 'Erro',
            message: 'Não foi possível excluir o resumo. Tente novamente.'
          });
        }
      }
    });
  };

  const handleEditSummary = () => {
    if (!historySummary) return;
    setEditedResumeContent(historySummary.content);
    setIsEditingResume(true);
  };

  const handleSaveEditedSummary = async () => {
    if (!historySummary) return;

    try {
      const response = await fetch(`/api/patients/${patientId}/history-summary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedResumeContent })
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar edição');
      }

      const data = await response.json();
      setHistorySummary(data.summary);
      setIsEditingResume(false);
      showToast('success', 'Resumo atualizado com sucesso!');
    } catch (e: any) {
      console.error(e);
      showToast('error', 'Erro ao salvar edição do resumo');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingResume(false);
    setEditedResumeContent('');
  };

  const buildSessionText = (session: SessionWithNote) => {
    const note = session.note?.content;
    if (!note) return 'Nota não disponível';

    return `NOTA DE EVOLUÇÃO FISIOTERAPÊUTICA\n` +
`Paciente: ${patient.name}\n` +
`Data: ${formatDate(session.date)} às ${formatTime(session.date)}\n` +
`Duração: ${session.durationMin || 'N/A'} minutos\n` +
(session.sessionType ? `Tipo de Sessão: ${session.sessionType}\n` : '') +
(session.specialty ? `Especialidade: ${session.specialty}\n` : '') +
`\n` +
`RESUMO EXECUTIVO\n` +
`Queixa Principal: ${note.resumoExecutivo?.queixaPrincipal || 'N/A'}\n` +
`Nível de Dor: ${note.resumoExecutivo?.nivelDor || 'N/A'}/10\n` +
`Evolução: ${note.resumoExecutivo?.evolucao || 'N/A'}\n\n` +
`ANAMNESE\n` +
`${note.anamnese?.historicoAtual || 'N/A'}\n` +
`Antecedentes: ${note.anamnese?.antecedentesPessoais || 'N/A'}\n` +
`Medicamentos: ${note.anamnese?.medicamentos || 'N/A'}\n` +
`Objetivos: ${note.anamnese?.objetivos || 'N/A'}\n\n` +
`DIAGNÓSTICO\n` +
`${note.diagnosticoFisioterapeutico?.principal || 'N/A'}\n` +
`${(note.diagnosticoFisioterapeutico?.secundarios || []).map((s: string)=>'- '+s).join('\n')}\n` +
`CIF: ${note.diagnosticoFisioterapeutico?.cif || 'N/A'}\n\n` +
`INTERVENÇÕES\n` +
`${(note.intervencoes?.tecnicasManuais || []).map((i: string)=>'- '+i).join('\n')}\n` +
`${(note.intervencoes?.exerciciosTerapeuticos || []).map((i: string)=>'- '+i).join('\n')}\n` +
`${(note.intervencoes?.recursosEletrotermo || []).map((i: string)=>'- '+i).join('\n')}\n\n` +
`RESPOSTA AO TRATAMENTO\n` +
`${note.respostaTratamento?.imediata || 'N/A'}\n` +
`Efeitos: ${note.respostaTratamento?.efeitos || 'N/A'}\n` +
`Feedback: ${note.respostaTratamento?.feedback || 'N/A'}\n\n` +
`ORIENTAÇÕES\n` +
`${(note.orientacoes?.domiciliares || []).map((i: string)=>'- '+i).join('\n')}\n` +
`${(note.orientacoes?.ergonomicas || []).map((i: string)=>'- '+i).join('\n')}\n` +
`Precauções:\n${(note.orientacoes?.precaucoes || []).map((i: string)=>'- '+i).join('\n')}\n\n` +
`PLANO\n` +
`Frequência: ${note.planoTratamento?.frequencia || 'N/A'}\n` +
`Duração prevista: ${note.planoTratamento?.duracaoPrevista || 'N/A'}\n` +
`Objetivos CP: ${(note.planoTratamento?.objetivosCurtoPrazo || []).join('; ')}\n` +
`Objetivos LP: ${(note.planoTratamento?.objetivosLongoPrazo || []).join('; ')}\n` +
`Critérios de alta: ${(note.planoTratamento?.criteriosAlta || []).join('; ')}\n\n` +
`OBSERVAÇÕES\n${note.observacoesAdicionais || 'N/A'}\n` +
`PRÓXIMA SESSÃO\n${note.proximaSessao?.data || 'N/A'} — ${note.proximaSessao?.foco || 'N/A'}\n`;
  };

  const handleExportNote = async (session: SessionWithNote) => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const margin = 14;
      const maxWidth = 180;

      const drawHeader = () => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(`PhysioNotes.AI — ${patient.name}`, margin, 12);
        doc.setDrawColor(200);
        doc.line(margin, 15, 200 - margin, 15);
      };
      const drawFooter = () => {
        const page = doc.getNumberOfPages();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(`Página ${page}`, 200 - margin - 20, 290);
        doc.setTextColor(0);
      };

      drawHeader();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('NOTA DE EVOLUÇÃO FISIOTERAPÊUTICA', margin, 24);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(buildSessionText(session), maxWidth);
      doc.text(lines, margin, 34);
      drawFooter();
      doc.save(`nota-${patient.name.replace(/\s+/g,'_')}-${formatDate(session.date)}.pdf`);
      showToast('success', 'Nota exportada em PDF.');
    } catch (e) {
      console.error(e);
      showToast('error', 'Não foi possível exportar a nota agora. Tente novamente.');
    }
  };

  const handleExportAll = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const margin = 14;
      const maxWidth = 180;
      const pageHeight = 297; // A4 height in mm

      const drawHeader = () => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(`PhysioNotes.AI — ${patient.name}`, margin, 12);
        doc.setDrawColor(200);
        doc.line(margin, 15, 200 - margin, 15);
      };
      const drawFooter = () => {
        const page = doc.getNumberOfPages();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(`Página ${page}`, 200 - margin - 20, 290);
        doc.setTextColor(0);
      };

      drawHeader();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(`Prontuário de ${patient.name}`, margin, 24);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      let cursorY = 32;
      const addBlock = (text: string) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, margin, cursorY);
        cursorY += lines.length * 6 + 8;
        if (cursorY > pageHeight - 24) {
          doc.addPage();
          drawHeader();
          cursorY = 22;
        }
      };
      addBlock(`Dados do paciente: CPF ${patient.cpf || 'N/A'} • Nasc.: ${patient.birthDate ? formatDate(patient.birthDate) : 'N/A'} • ${patient.gender || 'N/A'}`);
      doc.setDrawColor(220);
      doc.line(margin, cursorY - 4, 200 - margin, cursorY - 4);
      
      // Histórico Médico foi removido do schema
      
      sessions.forEach((s: SessionWithNote, idx: number) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`\nSessão ${idx + 1} — ${formatDate(s.date)} ${formatTime(s.date)}`, margin, cursorY);
        cursorY += 10;
        
        // Adicionar tipo de sessão e especialidade se existirem
        if (s.sessionType || s.specialty) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(9);
          const sessionInfo = [];
          if (s.sessionType) sessionInfo.push(`Tipo: ${s.sessionType}`);
          if (s.specialty) sessionInfo.push(`Especialidade: ${s.specialty}`);
          doc.text(sessionInfo.join(' | '), margin, cursorY);
          cursorY += 6;
          doc.setFontSize(10);
        }
        
        doc.setFont('helvetica', 'normal');
        addBlock(buildSessionText(s));
        doc.setDrawColor(230);
        doc.line(margin, cursorY - 4, 200 - margin, cursorY - 4);
      });
      drawFooter();
      doc.save(`prontuario-${patient.name.replace(/\s+/g,'_')}.pdf`);
      showToast('success', 'Prontuário exportado em PDF.');
    } catch (e) {
      console.error(e);
      showToast('error', 'Não foi possível exportar o prontuário agora. Tente novamente.');
    }
  };

  const SectionHeader = ({ icon: Icon, title, color }: { icon: any, title: string, color: string }) => (
    <div className="mb-4 flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-[0_16px_35px_-24px_rgba(79,70,229,0.45)] ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <h4 className="text-base font-semibold text-[#0F172A]">{title}</h4>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] via-[#FFFFFF] to-[#F8FAFF] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-lg font-medium text-[#475569]">Carregando prontuário...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !recordData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] via-[#FFFFFF] to-[#F8FAFF] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Erro ao carregar prontuário</h2>
          <p className="text-[#475569] mb-6">{error || 'Não foi possível carregar os dados do paciente'}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-6 py-3 text-white font-semibold hover:-translate-y-0.5 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar para pacientes
          </button>
        </div>
      </div>
    );
  }

  // Destructure data for easier access
  const { patient, statistics, sessions } = recordData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] via-[#FFFFFF] to-[#F8FAFF] px-6 py-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed left-1/2 top-6 z-[200] -translate-x-1/2 rounded-full px-6 py-2 text-sm font-medium shadow-[0_12px_30px_-18px_rgba(15,23,42,0.45)] ${
            toast.type === 'success'
              ? 'border border-emerald-100 bg-emerald-50 text-emerald-700'
              : toast.type === 'error'
                ? 'border border-rose-100 bg-rose-50 text-rose-700'
                : 'border border-indigo-100 bg-indigo-50 text-indigo-700'
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/60 bg-white/70 px-6 py-5 shadow-[0_28px_65px_-46px_rgba(79,70,229,0.45)] backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#475569] transition-colors hover:text-[#4F46E5]"
            >
              <ArrowLeft className="h-5 w-5" />
              Voltar para pacientes
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSummarizeHistory}
                disabled={summarizingHistory}
                className="inline-flex items-center gap-2 rounded-full border border-[#E0E7FF] bg-white/90 px-4 py-2 text-sm font-semibold text-[#4F46E5] transition-all hover:-translate-y-0.5 hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {summarizingHistory ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Gerando resumo...
                  </>
                ) : historySummary ? (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Atualizar resumo
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Resumir histórico
                  </>
                )}
              </button>
              <button
                onClick={handleExportAll}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_22px_45px_-28px_rgba(79,70,229,0.6)] transition-transform hover:-translate-y-0.5"
              >
                <Download className="h-4 w-4" />
                Exportar prontuário
              </button>
            </div>
          </div>
        </div>

        {/* Patient Info Card */}
        <div className="animate-fade-in rounded-[32px] border border-white/70 bg-white/95 p-8 shadow-[0_28px_65px_-46px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#4F46E5] via-[#818CF8] to-[#A855F7] text-3xl font-semibold text-white shadow-[0_20px_40px_-22px_rgba(79,70,229,0.6)]">
                {patient.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#0F172A]">{patient.name}</h1>
                <p className="mt-1 text-sm text-[#475569]">
                  {patient.birthDate && `${calculateAge(patient.birthDate)} anos`} {patient.gender && `• ${patient.gender}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-[#F3F4F6] bg-[#F8FAFC] px-4 py-3 text-sm text-[#475569] shadow-inner">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">Paciente desde</span>
                <span className="mt-1 block text-base font-semibold text-[#0F172A]">{formatDate(patient.createdAt)}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#DCFCE7] px-4 py-2 text-sm font-semibold text-[#047857]">
                <Activity className="h-4 w-4" />
                {statistics.totalSessions} sessões
              </div>
            </div>
          </div>

          {/* Contact and Personal Info Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#E0E7FF] bg-[#EEF2FF] px-5 py-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6366F1]">Contato</h3>
              <div className="mt-3 space-y-2 text-sm text-[#1E293B]">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#4F46E5]" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#4F46E5]" />
                  <span className="truncate">{patient.email}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#F8E7FB] bg-[#FDF2FE] px-5 py-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C026D3]">Dados pessoais</h3>
              <div className="mt-3 space-y-2 text-sm text-[#1E293B]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#C026D3]" />
                  <span>{patient.birthDate ? formatDate(patient.birthDate) : 'Não informado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#C026D3]" />
                  <span>{patient.cpf || 'Não informado'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#C7D2FE] bg-white px-5 py-4 shadow-[0_16px_35px_-28px_rgba(15,23,42,0.35)]">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#475569]">Endereço</h3>
              <div className="mt-3 flex items-start gap-2 text-sm text-[#1E293B]">
                <MapPin className="mt-0.5 h-4 w-4 text-[#4F46E5]" />
                <span>
                  {patient.address.street}, {patient.address.number}
                  {patient.address.complement && ` - ${patient.address.complement}`}
                  <br />
                  {patient.address.neighborhood}, {patient.address.city}/{patient.address.state}
                  <br />
                  CEP: {patient.address.zipCode}
                </span>
              </div>
            </div>
          </div>

          {/* History Summary - Only show if NOT pinned */}
          {historySummary && !historySummary.isPinned && (
            <div className="mt-6 pt-6 border-t border-white/60">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
                    Resumo Clínico do Histórico
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#F5F3FF] px-3 py-1 text-xs font-medium text-[#6D28D9]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Gerado por IA
                  </span>
                  {!isEditingResume && (
                    <>
                      <button
                        onClick={handleEditSummary}
                        className="rounded-full border border-[#E0E7FF] bg-white px-3 py-1.5 text-xs font-medium text-[#4F46E5] transition-all hover:bg-[#EEF2FF]"
                        title="Editar resumo"
                      >
                        <Edit3 className="h-3.5 w-3.5 inline mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={handleTogglePin}
                        className="rounded-full border border-[#E0E7FF] bg-white px-3 py-1.5 text-xs font-medium text-[#4F46E5] transition-all hover:bg-[#EEF2FF]"
                        title={historySummary.isPinned ? 'Desfixar resumo' : 'Fixar resumo no topo'}
                      >
                        {historySummary.isPinned ? (
                          <>
                            <PinOff className="h-3.5 w-3.5 inline mr-1" />
                            Desfixar
                          </>
                        ) : (
                          <>
                            <Pin className="h-3.5 w-3.5 inline mr-1" />
                            Fixar
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleDeleteSummary}
                        className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-50"
                        title="Excluir resumo"
                      >
                        <Trash2 className="h-3.5 w-3.5 inline mr-1" />
                        Excluir
                      </button>
                    </>
                  )}
                  {isEditingResume && (
                    <>
                      <button
                        onClick={handleSaveEditedSummary}
                        className="rounded-full border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-green-600 transition-all hover:bg-green-50"
                        title="Salvar edição"
                      >
                        <Save className="h-3.5 w-3.5 inline mr-1" />
                        Salvar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:bg-gray-50"
                        title="Cancelar edição"
                      >
                        <X className="h-3.5 w-3.5 inline mr-1" />
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {isEditingResume ? (
                <div className="rounded-2xl border border-[#DDD6FE] bg-white p-4">
                  <textarea
                    value={editedResumeContent}
                    onChange={(e) => setEditedResumeContent(e.target.value)}
                    className="w-full min-h-[400px] p-4 text-sm text-[#4338CA] border border-[#E0E7FF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-y font-mono"
                    placeholder="Edite o resumo aqui..."
                  />
                  <p className="mt-2 text-xs text-[#94A3B8]">
                    💡 Dica: Use Markdown para formatar o texto (## para títulos, **negrito**, - para listas)
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#DDD6FE] bg-gradient-to-br from-[#F5F3FF] to-white p-6 shadow-[0_16px_35px_-24px_rgba(109,40,217,0.45)]">
                  <div 
                    className="prose prose-sm max-w-none text-[#4338CA]"
                    dangerouslySetInnerHTML={{ 
                      __html: historySummary.content
                        .replace(/\n/g, '<br />')
                        .replace(/##\s+(.+)/g, '<h3 class="text-base font-bold text-[#4F46E5] mt-4 mb-2 first:mt-0">$1</h3>')
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/- (.+)/g, '<li class="ml-4">$1</li>')
                    }}
                  />
                  <div className="mt-4 pt-4 border-t border-[#DDD6FE]/50 flex items-center justify-between text-xs text-[#94A3B8]">
                    <span>
                      Baseado em {historySummary.sessionsIds.length} {historySummary.sessionsIds.length === 1 ? 'sessão' : 'sessões'}
                    </span>
                    <span>
                      Atualizado em {new Date(historySummary.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pinned Summary (if pinned, show at top of history) */}
        {historySummary?.isPinned && !isEditingResume && (
          <div className="rounded-[32px] border-2 border-[#C7D2FE] bg-gradient-to-br from-[#EEF2FF] via-white to-[#F8FAFF] p-6 shadow-[0_28px_65px_-46px_rgba(79,70,229,0.35)]">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] shadow-[0_8px_20px_-8px_rgba(79,70,229,0.6)]">
                  <Pin className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-[#4F46E5]">Resumo Fixado</h3>
              </div>
              <span className="text-xs text-[#94A3B8]">
                {historySummary.sessionsIds.length} {historySummary.sessionsIds.length === 1 ? 'sessão' : 'sessões'}
              </span>
            </div>
            <div 
              className="prose prose-sm max-w-none text-[#4338CA]"
              dangerouslySetInnerHTML={{ 
                __html: historySummary.content
                  .replace(/\n/g, '<br />')
                  .replace(/##\s+(.+)/g, '<h4 class="text-sm font-bold text-[#4F46E5] mt-3 mb-1.5 first:mt-0">$1</h4>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/- (.+)/g, '<li class="ml-4 text-sm">$1</li>')
              }}
            />
          </div>
        )}

        {/* Session Notes */}
        <div className="rounded-[32px] border border-white/70 bg-white/95 p-8 shadow-[0_28px_65px_-46px_rgba(15,23,42,0.28)]">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-[#0F172A]">
              <FileText className="h-6 w-6 text-[#4F46E5]" />
              Histórico de Sessões
            </h2>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E0E7FF] bg-[#F8FAFF] px-4 py-1.5 text-sm font-medium text-[#475569]">
              {sessions.length} {sessions.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {/* Sessions Timeline */}
          <div className="space-y-5">
            {sessions.slice(0, visibleCount).map((session: SessionWithNote, index: number) => {
              const isExpanded = expandedNotes.has(session.id);
              const isFirst = index === 0;
              const noteContent = session.note?.content;

              return (
                <div
                  key={session.id}
                  className={`rounded-[24px] border border-[#E2E8F0] bg-white/90 shadow-[0_22px_45px_-40px_rgba(15,23,42,0.35)] transition-all duration-300 ${
                    isFirst ? 'ring-2 ring-[#C7D2FE]' : ''
                  }`}
                >
                  {/* Session Header */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-controls={`session-${session.id}-details`}
                    onClick={() => toggleNote(session.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleNote(session.id);
                      }
                    }}
                    className="flex w-full items-center justify-between rounded-[24px] bg-[#F8FAFF] px-6 py-4 transition-colors hover:bg-[#EEF2FF]"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isFirst ? 'bg-gradient-to-br from-[#4F46E5] to-[#6366F1]' : 'bg-[#E2E8F0]'
                      }`}>
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-[#0F172A]">
                            {formatDate(session.date)}
                          </span>
                          {isFirst && (
                            <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-xs font-medium text-[#047857]">
                              Mais Recente
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-[#64748B]">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(session.date)}</span>
                          </span>
                          <span>•</span>
                          <span>{session.durationMin ? `${session.durationMin} minutos` : 'Duração não registrada'}</span>
                        </div>
                        {/* Tipo de Sessão e Especialidade */}
                        {(session.sessionType || session.specialty) && (
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            {session.sessionType && (
                              <span className="inline-flex items-center rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-xs font-medium text-[#4F46E5] border border-[#C7D2FE]">
                                <FileText className="w-3 h-3 mr-1" />
                                {session.sessionType}
                              </span>
                            )}
                            {session.specialty && (
                              <span className="inline-flex items-center rounded-full bg-[#F0FDFA] px-2.5 py-0.5 text-xs font-medium text-[#0F766E] border border-[#99F6E4]">
                                <Stethoscope className="w-3 h-3 mr-1" />
                                {session.specialty}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportNote(session);
                        }}
                        className="rounded-full p-2 text-[#4F46E5] transition-colors hover:bg-[#EEF2FF]"
                        title="Exportar nota"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#94A3B8]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#94A3B8]" />
                      )}
                    </div>
                  </div>

                  {/* Full Note Details */}
                  {isExpanded && noteContent && (
                    <div id={`session-${session.id}-details`} className="border-t border-[#E2E8F0] px-6 py-6 animate-fade-in space-y-6">
                      {/* Resumo Executivo */}
                      <div>
                        <SectionHeader icon={Activity} title="Resumo Executivo" color="bg-[#5A9BCF]" />
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF]/80 p-4 shadow-inner">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#4F46E5]" />
                              <div>
                                <div className="mb-1 text-sm font-semibold text-[#1E293B]">Queixa principal</div>
                                <p className="text-sm leading-relaxed text-[#475569]">{noteContent.resumoExecutivo?.queixaPrincipal || 'Não informado'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] p-4 text-[#7F1D1D] shadow-[0_16px_35px_-28px_rgba(248,113,113,0.45)]">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em]">Nível de dor (EVA)</div>
                              <div className="mt-2 text-3xl font-bold">{noteContent.resumoExecutivo?.nivelDor || 'N/A'}/10</div>
                            </div>
                            <div className="rounded-2xl bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] p-4 text-[#047857] shadow-[0_16px_35px_-28px_rgba(34,197,94,0.45)]">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em]">Evolução</div>
                              <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                                <TrendingUp className="h-5 w-5" />
                                {noteContent.resumoExecutivo?.evolucao || 'Não informado'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Anamnese */}
                      <div>
                        <SectionHeader icon={Clipboard} title="Anamnese" color="bg-[#8B5CF6]" />
                        <div className="space-y-3 text-sm">
                          <div className="rounded-2xl border border-[#DDD6FE] bg-[#F5F3FF]/80 p-4">
                            <h5 className="mb-1 text-sm font-semibold text-[#3730A3]">Histórico atual</h5>
                            <p className="leading-relaxed text-[#4338CA]">{noteContent.anamnese?.historicoAtual || 'Não informado'}</p>
                          </div>
                          <div className="rounded-2xl border border-[#DDD6FE] bg-white p-4 shadow-[0_12px_30px_-24px_rgba(129,140,248,0.35)]">
                            <h5 className="mb-1 text-sm font-semibold text-[#3730A3]">Antecedentes pessoais</h5>
                            <p className="leading-relaxed text-[#4338CA]">{noteContent.anamnese?.antecedentesPessoais || 'Não informado'}</p>
                          </div>
                          <div className="rounded-2xl border border-[#E9D5FF] bg-[#FAF5FF] p-4">
                            <h5 className="mb-1 text-sm font-semibold text-[#6B21A8]">Medicamentos</h5>
                            <p className="leading-relaxed text-[#6B21A8]">{noteContent.anamnese?.medicamentos || 'Não informado'}</p>
                          </div>
                          <div className="rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF] p-4">
                            <h5 className="mb-1 text-sm font-semibold text-[#1E3A8A]">Objetivos</h5>
                            <p className="leading-relaxed text-[#1E3A8A]">{noteContent.anamnese?.objetivos || 'Não informado'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Diagnóstico */}
                      <div>
                        <SectionHeader icon={Stethoscope} title="Diagnóstico Fisioterapêutico" color="bg-[#F97316]" />
                        <div className="space-y-4 text-sm">
                          <div className="rounded-2xl border border-[#FED7AA] bg-gradient-to-br from-[#FFF7ED] to-[#FFE4D6] p-4">
                            <div className="mb-1 text-sm font-semibold text-[#9A3412]">Diagnóstico principal</div>
                            <p className="leading-relaxed text-[#7C2D12]">{noteContent.diagnosticoFisioterapeutico?.principal || 'Não informado'}</p>
                          </div>
                          {(noteContent.diagnosticoFisioterapeutico?.secundarios?.length || 0) > 0 && (
                            <div className="rounded-2xl border border-[#FED7AA] bg-white/90 p-4 shadow-[0_12px_30px_-24px_rgba(251,191,36,0.35)]">
                              <h5 className="mb-2 text-sm font-semibold text-[#9A3412]">Diagnósticos secundários</h5>
                              <ul className="space-y-1">
                                {noteContent.diagnosticoFisioterapeutico!.secundarios!.map((diag: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2 text-[#7C2D12]">
                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#FB923C]"></span>
                                    <span>{diag}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">CIF</div>
                            <p className="mt-1 text-base font-medium text-[#0F172A]">{noteContent.diagnosticoFisioterapeutico?.cif || 'Não informado'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Intervenções */}
                      <div>
                        <SectionHeader icon={Activity} title="Intervenções Realizadas" color="bg-[#0EA5E9]" />
                        <div className="space-y-4 text-sm">
                          {(noteContent.intervencoes?.tecnicasManuais?.length || 0) > 0 && (
                            <div className="rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] p-4">
                              <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0369A1]">
                                <span className="h-2 w-2 rounded-full bg-[#0EA5E9]"></span>
                                Técnicas manuais
                              </h5>
                              <ul className="flex flex-wrap gap-2">
                                {noteContent.intervencoes!.tecnicasManuais!.map((tecnica: string, idx: number) => (
                                  <li key={idx} className="rounded-full bg-white/80 px-3 py-1 text-[#0F172A] shadow-sm">
                                    {tecnica}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(noteContent.intervencoes?.exerciciosTerapeuticos?.length || 0) > 0 && (
                            <div className="rounded-2xl border border-[#BBF7D0] bg-[#ECFDF5] p-4">
                              <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#047857]">
                                <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                                Exercícios terapêuticos
                              </h5>
                              <ul className="flex flex-wrap gap-2">
                                {noteContent.intervencoes!.exerciciosTerapeuticos!.map((exercicio: string, idx: number) => (
                                  <li key={idx} className="rounded-full bg-white/80 px-3 py-1 text-[#065F46] shadow-sm">
                                    {exercicio}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(noteContent.intervencoes?.recursosEletrotermo?.length || 0) > 0 && (
                            <div className="rounded-2xl border border-[#E9D5FF] bg-[#FAF5FF] p-4">
                              <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#7C3AED]">
                                <span className="h-2 w-2 rounded-full bg-[#8B5CF6]"></span>
                                Recursos eletrotermofototerapêuticos
                              </h5>
                              <ul className="flex flex-wrap gap-2">
                                {noteContent.intervencoes!.recursosEletrotermo!.map((recurso: string, idx: number) => (
                                  <li key={idx} className="rounded-full bg-white/80 px-3 py-1 text-[#5B21B6] shadow-sm">
                                    {recurso}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Resposta ao Tratamento */}
                      <div>
                        <SectionHeader icon={TrendingUp} title="Resposta ao Tratamento" color="bg-[#22C55E]" />
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] p-4 text-[#065F46] shadow-[0_16px_35px_-28px_rgba(34,197,94,0.4)]">
                            <h5 className="text-xs font-semibold uppercase tracking-[0.18em]">Resposta imediata</h5>
                            <p className="mt-2 text-sm leading-relaxed">{noteContent.respostaTratamento?.imediata || 'Não informado'}</p>
                          </div>
                          <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-[#7F1D1D]">
                            <h5 className="text-xs font-semibold uppercase tracking-[0.18em]">Efeitos adversos</h5>
                            <p className="mt-2 text-sm leading-relaxed">{noteContent.respostaTratamento?.efeitos || 'Não informado'}</p>
                          </div>
                          <div className="rounded-2xl border border-[#C7D2FE] bg-white p-4 shadow-[0_12px_30px_-24px_rgba(59,130,246,0.35)] text-[#1E3A8A]">
                            <h5 className="text-xs font-semibold uppercase tracking-[0.18em]">Feedback</h5>
                            <p className="mt-2 text-sm leading-relaxed">{noteContent.respostaTratamento?.feedback || 'Não informado'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Orientações */}
                      <div>
                        <SectionHeader icon={Target} title="Orientações ao Paciente" color="bg-[#4F46E5]" />
                        <div className="grid gap-3 sm:grid-cols-3">
                          {(noteContent.orientacoes?.domiciliares?.length || 0) > 0 && (
                            <div className="rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF] p-4">
                              <h5 className="mb-2 text-sm font-semibold text-[#4338CA]">Domiciliares</h5>
                              <ul className="flex flex-col gap-2 text-sm text-[#3730A3]">
                                {noteContent.orientacoes!.domiciliares!.map((orientacao: string, idx: number) => (
                                  <li key={idx} className="rounded-full bg-white/80 px-3 py-1 shadow-sm">
                                    {orientacao}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(noteContent.orientacoes?.ergonomicas?.length || 0) > 0 && (
                            <div className="rounded-2xl border border-[#FBCFE8] bg-[#FDF2F8] p-4">
                              <h5 className="mb-2 text-sm font-semibold text-[#BE185D]">Ergonômicas</h5>
                              <ul className="flex flex-col gap-2 text-sm text-[#9D174D]">
                                {noteContent.orientacoes!.ergonomicas!.map((orientacao: string, idx: number) => (
                                  <li key={idx} className="rounded-full bg-white/80 px-3 py-1 shadow-sm">
                                    {orientacao}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(noteContent.orientacoes?.precaucoes?.length || 0) > 0 && (
                            <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-4">
                              <h5 className="mb-2 text-sm font-semibold text-[#B45309]">Precauções</h5>
                              <ul className="flex flex-col gap-2 text-sm text-[#92400E]">
                                {noteContent.orientacoes!.precaucoes!.map((orientacao: string, idx: number) => (
                                  <li key={idx} className="rounded-full bg-white/80 px-3 py-1 shadow-sm">
                                    {orientacao}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Plano de Tratamento */}
                      <div>
                        <SectionHeader icon={Target} title="Plano de Tratamento" color="bg-teal-500" />
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-teal-50 p-3 rounded-lg">
                              <div className="text-xs text-teal-600 font-medium mb-1">Frequência</div>
                              <p className="text-sm text-[#333333]">{noteContent.planoTratamento?.frequencia || 'Não informado'}</p>
                            </div>
                            <div className="bg-teal-50 p-3 rounded-lg">
                              <div className="text-xs text-teal-600 font-medium mb-1">Duração Prevista</div>
                              <p className="text-sm text-[#333333]">{noteContent.planoTratamento?.duracaoPrevista || 'Não informado'}</p>
                            </div>
                          </div>
                          {(noteContent.planoTratamento?.objetivosCurtoPrazo?.length || 0) > 0 && (
                            <div>
                              <h5 className="font-medium text-[#333333] mb-2 text-sm">Objetivos de Curto Prazo</h5>
                              <ul className="space-y-1">
                                {noteContent.planoTratamento!.objetivosCurtoPrazo!.map((objetivo: string, idx: number) => (
                                  <li key={idx} className="flex items-start space-x-2 text-sm">
                                    <span className="w-5 h-5 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                      {idx + 1}
                                    </span>
                                    <span className="text-[#666666] mt-0.5">{objetivo}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(noteContent.planoTratamento?.objetivosLongoPrazo?.length || 0) > 0 && (
                            <div>
                              <h5 className="font-medium text-[#333333] mb-2 text-sm">Objetivos de Longo Prazo</h5>
                              <ul className="space-y-1">
                                {noteContent.planoTratamento!.objetivosLongoPrazo!.map((objetivo: string, idx: number) => (
                                  <li key={idx} className="flex items-start space-x-2 text-sm">
                                    <span className="w-5 h-5 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                      {idx + 1}
                                    </span>
                                    <span className="text-[#666666] mt-0.5">{objetivo}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(noteContent.planoTratamento?.criteriosAlta?.length || 0) > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h5 className="font-medium text-[#333333] mb-2 text-sm">Critérios de Alta</h5>
                              <ul className="space-y-1">
                                {noteContent.planoTratamento!.criteriosAlta!.map((criterio: string, idx: number) => (
                                  <li key={idx} className="flex items-start space-x-2 text-sm">
                                    <Check className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-[#666666]">{criterio}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Observações Adicionais */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-[#333333] mb-2 flex items-center space-x-2 text-sm">
                          <FileText className="w-4 h-4 text-[#5A9BCF]" />
                          <span>Observações Adicionais</span>
                        </h5>
                        <p className="text-sm text-[#666666]">{noteContent.observacoesAdicionais || 'Nenhuma observação adicional registrada.'}</p>
                      </div>

                      {/* Próxima Sessão */}
                      <div className="bg-gradient-to-r from-[#5A9BCF]/10 to-[#4A8BBF]/10 p-4 rounded-lg border-2 border-[#5A9BCF]/20">
                        <h5 className="font-medium text-[#333333] mb-2 flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-[#5A9BCF]" />
                          <span>Próxima Sessão</span>
                        </h5>
                        <div className="space-y-1 text-sm">
                          <p className="text-[#666666]"><strong>Retorno em:</strong> {noteContent.proximaSessao?.data || 'Não definido'}</p>
                          <p className="text-[#666666]"><strong>Foco:</strong> {noteContent.proximaSessao?.foco || 'Não definido'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {visibleCount < sessions.length && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => Math.min(c + 5, sessions.length))}
                className="px-4 py-2 text-sm font-medium text-[#5A9BCF] bg-[#5A9BCF]/10 hover:bg-[#5A9BCF]/20 rounded-lg transition-colors"
              >
                Carregar mais
              </button>
            </div>
          )}

          {sessions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-[#333333] mb-2">
                Nenhuma sessão registrada
              </h3>
              <p className="text-[#666666]">
                As notas das sessões aparecerão aqui quando forem criadas.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        onConfirm={alertModal.onConfirm}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        confirmText={alertModal.confirmText}
        showCancel={alertModal.showCancel}
      />
    </div>
  );
};

export default PatientRecord;
