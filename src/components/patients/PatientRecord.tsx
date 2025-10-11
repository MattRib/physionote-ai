'use client';

import React, { useState } from 'react';
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
  TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FullSessionNote {
  id: string;
  date: string;
  duration: number;
  resumoExecutivo: {
    queixaPrincipal: string;
    nivelDor: number;
    evolucao: string;
  };
  anamnese: {
    historicoAtual: string;
    antecedentesPessoais: string;
    medicamentos: string;
    objetivos: string;
  };
  diagnosticoFisioterapeutico: {
    principal: string;
    secundario: string[];
    cif: string;
  };
  intervencoes: {
    tecnicasManuais: string[];
    exerciciosTerapeuticos: string[];
    recursosEletrotermofototerapeticos: string[];
  };
  respostaTratamento: {
    imediata: string;
    efeitos: string;
    feedback: string;
  };
  orientacoes: {
    domiciliares: string[];
    ergonomicas: string[];
    precaucoes: string[];
  };
  planoTratamento: {
    frequencia: string;
    duracaoPrevista: string;
    objetivosCurtoPrazo: string[];
    objetivosLongoPrazo: string[];
    criteriosAlta: string[];
  };
  observacoesAdicionais: string;
  proximaSessao: {
    data: string;
    foco: string;
  };
}

interface PatientRecordData {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  gender: string;
  address: {
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  medicalHistory: string;
  createdAt: string;
  totalSessions: number;
  sessions: FullSessionNote[];
}

interface PatientRecordProps {
  patientId: string;
}

const getMockPatientData = (id: string): PatientRecordData => {
  const sessions: FullSessionNote[] = [
    {
      id: '1',
      date: '2024-03-20T14:30:00',
      duration: 45,
      resumoExecutivo: {
        queixaPrincipal: 'Dor lombar crônica há aproximadamente 3 meses, com intensificação nos últimos 15 dias',
        nivelDor: 7,
        evolucao: 'Paciente apresentou melhora de 30% em relação à última sessão'
      },
      anamnese: {
        historicoAtual: 'Paciente relata início insidioso de dor na região lombar há 3 meses, sem trauma aparente. Dor tipo queimação, intensidade 7/10, com irradiação para membro inferior direito até joelho. Piora com permanência prolongada em pé e melhora parcial com repouso.',
        antecedentesPessoais: 'Sedentário, sobrepeso (IMC 28), sem histórico de cirurgias prévias na coluna',
        medicamentos: 'Dipirona 1g SOS para dor (uso irregular)',
        objetivos: 'Retornar às atividades de trabalho sem limitações e poder praticar caminhada recreativa'
      },
      diagnosticoFisioterapeutico: {
        principal: 'Lombalgia mecânica crônica com radiculopatia L5-S1 à direita',
        secundario: [
          'Desequilíbrio muscular da região lombopélvica',
          'Fraqueza da musculatura estabilizadora do core',
          'Encurtamento de musculatura posterior de membros inferiores'
        ],
        cif: 'b28013 (Dor na região lombar - grave) + b7101 (Mobilidade das articulações da coluna lombar - limitação moderada)'
      },
      intervencoes: {
        tecnicasManuais: [
          'Mobilização articular de L4-L5 grau III (Maitland) - 3 séries de 30 segundos',
          'Liberação miofascial de quadrado lombar bilateral - 5 minutos cada lado',
          'Massagem de deslizamento profundo em paravertebrais - 8 minutos'
        ],
        exerciciosTerapeuticos: [
          'Exercício de estabilização segmentar - ponte com sustentação isométrica 10s x 10 repetições',
          'Ativação de transverso abdominal em 4 apoios - 3 séries de 10 repetições',
          'Alongamento de isquiotibiais em decúbito dorsal - 3 séries de 30s cada perna'
        ],
        recursosEletrotermofototerapeticos: [
          'TENS modo burst na região lombar - 20 minutos (analgesia)',
          'Compressa quente em região lombar - 10 minutos (pré-tratamento)'
        ]
      },
      respostaTratamento: {
        imediata: 'Paciente refere diminuição da dor de 7/10 para 4/10 após sessão. Melhora de 30% na amplitude de flexão do tronco.',
        efeitos: 'Sem efeitos adversos relatados. Paciente tolerou bem todas as intervenções.',
        feedback: 'Paciente muito satisfeito com resultado imediato, motivado para continuar tratamento'
      },
      orientacoes: {
        domiciliares: [
          'Aplicar bolsa de água morna na região lombar por 15-20 minutos, 2x ao dia',
          'Realizar alongamento de isquiotibiais 3x ao dia',
          'Praticar exercício de ativação do transverso abdominal em casa'
        ],
        ergonomicas: [
          'Utilizar apoio lombar na cadeira do trabalho',
          'Fazer pausas de 5 minutos a cada 1 hora para alongamentos',
          'Ao pegar objetos do chão, agachar flexionando joelhos'
        ],
        precaucoes: [
          'Evitar movimentos de rotação combinada com flexão do tronco',
          'Não carregar peso acima de 5kg por enquanto'
        ]
      },
      planoTratamento: {
        frequencia: '3x por semana nas próximas 2 semanas',
        duracaoPrevista: '8-12 semanas para recuperação funcional completa',
        objetivosCurtoPrazo: [
          'Reduzir dor para 3/10 ou menos em 2 semanas',
          'Aumentar ADM de flexão do tronco para 75° em 2 semanas'
        ],
        objetivosLongoPrazo: [
          'Retorno ao trabalho sem limitações em 6-8 semanas',
          'Iniciar programa de caminhada recreativa em 8 semanas'
        ],
        criteriosAlta: [
          'Ausência de dor ou dor mínima (≤2/10)',
          'ADM completa e indolor',
          'Força muscular 5/5'
        ]
      },
      observacoesAdicionais: 'Paciente demonstra boa compreensão das orientações e alta motivação para tratamento.',
      proximaSessao: {
        data: '2 dias',
        foco: 'Progressão de exercícios de estabilização e reavaliação da dor'
      }
    },
    {
      id: '2',
      date: '2024-03-18T15:00:00',
      duration: 50,
      resumoExecutivo: {
        queixaPrincipal: 'Dor lombar persistente, dificuldade para dormir',
        nivelDor: 6,
        evolucao: 'Redução da dor noturna em 20%'
      },
      anamnese: {
        historicoAtual: 'Paciente relata melhora parcial após sessão anterior, porém dor ainda interfere no sono. Acorda 2-3x durante a noite devido à dor.',
        antecedentesPessoais: 'Mesmo histórico anterior',
        medicamentos: 'Dipirona 1g SOS',
        objetivos: 'Melhorar qualidade do sono'
      },
      diagnosticoFisioterapeutico: {
        principal: 'Lombalgia mecânica com espasmo muscular paravertebral',
        secundario: ['Distúrbio do sono secundário à dor'],
        cif: 'b28013 + b134 (Funções do sono)'
      },
      intervencoes: {
        tecnicasManuais: [
          'Massagem de deslizamento profundo em paravertebrais - 10 minutos',
          'Liberação de pontos gatilho em quadrado lombar'
        ],
        exerciciosTerapeuticos: [
          'Exercícios de estabilização segmentar',
          'Alongamento de isquiotibiais'
        ],
        recursosEletrotermofototerapeticos: [
          'TENS convencional - 20 minutos'
        ]
      },
      respostaTratamento: {
        imediata: 'Redução da tensão muscular palpável. Dor 6/10 para 4/10.',
        efeitos: 'Sem efeitos adversos',
        feedback: 'Paciente relatou melhora da mobilidade'
      },
      orientacoes: {
        domiciliares: [
          'Posição para dormir: decúbito lateral com travesseiro entre os joelhos',
          'Aplicar calor antes de dormir'
        ],
        ergonomicas: [
          'Evitar sofá muito macio',
          'Usar colchão de firmeza média'
        ],
        precaucoes: [
          'Evitar dormir em pronação'
        ]
      },
      planoTratamento: {
        frequencia: '3x por semana',
        duracaoPrevista: '8-10 semanas',
        objetivosCurtoPrazo: ['Melhorar qualidade do sono em 50%'],
        objetivosLongoPrazo: ['Sono sem interrupções por dor'],
        criteriosAlta: ['Qualidade de sono normalizada']
      },
      observacoesAdicionais: 'Paciente aderente ao tratamento.',
      proximaSessao: {
        data: '2 dias',
        foco: 'Continuidade do tratamento e reavaliação do sono'
      }
    }
  ];

  return {
    id,
    name: 'Maria Silva Santos',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    birthDate: '1985-03-15',
    gender: 'Feminino',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    medicalHistory: 'Histórico de dores lombares crônicas desde 2020. Sedentária. Trabalha como vendedora permanecendo 8h em pé diariamente. Sobrepeso (IMC 28). Sem histórico de cirurgias na coluna. Relata episódios anteriores de lombalgia que melhoravam com repouso. Nega doenças cardiovasculares, diabetes ou hipertensão. Não pratica atividade física regular.',
    createdAt: '2024-01-15',
    totalSessions: sessions.length,
    sessions,
  };
};

const PatientRecord: React.FC<PatientRecordProps> = ({ patientId }) => {
  const router = useRouter();
  const patient = getMockPatientData(patientId);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [summarizingHistory, setSummarizingHistory] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };
  const [visibleCount, setVisibleCount] = useState(Math.min(5, patient.sessions.length));

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
    try {
      setSummarizingHistory(true);
      setAiSummary(null);
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicalHistory: patient.medicalHistory, sessions: patient.sessions }),
      });
      if (!res.ok) throw new Error('Falha ao gerar resumo');
      const data = await res.json();
      setAiSummary(data.summary);
      showToast('success', 'Resumo do histórico gerado.');
    } catch (e) {
      console.error(e);
      showToast('error', 'Não foi possível gerar o resumo com IA agora. Tente novamente.');
    } finally {
      setSummarizingHistory(false);
    }
  };

  const buildSessionText = (session: FullSessionNote) => {
    return `NOTA DE EVOLUÇÃO FISIOTERAPÊUTICA\n` +
`Paciente: ${patient.name}\n` +
`Data: ${formatDate(session.date)} às ${formatTime(session.date)}\n` +
`Duração: ${session.duration} minutos\n\n` +
`RESUMO EXECUTIVO\n` +
`Queixa Principal: ${session.resumoExecutivo.queixaPrincipal}\n` +
`Nível de Dor: ${session.resumoExecutivo.nivelDor}/10\n` +
`Evolução: ${session.resumoExecutivo.evolucao}\n\n` +
`ANAMNESE\n` +
`${session.anamnese.historicoAtual}\n` +
`Antecedentes: ${session.anamnese.antecedentesPessoais}\n` +
`Medicamentos: ${session.anamnese.medicamentos}\n` +
`Objetivos: ${session.anamnese.objetivos}\n\n` +
`DIAGNÓSTICO\n` +
`${session.diagnosticoFisioterapeutico.principal}\n` +
`${session.diagnosticoFisioterapeutico.secundario.map((s)=>'- '+s).join('\n')}\n` +
`CIF: ${session.diagnosticoFisioterapeutico.cif}\n\n` +
`INTERVENÇÕES\n` +
`${session.intervencoes.tecnicasManuais.map((i)=>'- '+i).join('\n')}\n` +
`${session.intervencoes.exerciciosTerapeuticos.map((i)=>'- '+i).join('\n')}\n` +
`${session.intervencoes.recursosEletrotermofototerapeticos.map((i)=>'- '+i).join('\n')}\n\n` +
`RESPOSTA AO TRATAMENTO\n` +
`${session.respostaTratamento.imediata}\n` +
`Efeitos: ${session.respostaTratamento.efeitos}\n` +
`Feedback: ${session.respostaTratamento.feedback}\n\n` +
`ORIENTAÇÕES\n` +
`${session.orientacoes.domiciliares.map((i)=>'- '+i).join('\n')}\n` +
`${session.orientacoes.ergonomicas.map((i)=>'- '+i).join('\n')}\n` +
`Precauções:\n${session.orientacoes.precaucoes.map((i)=>'- '+i).join('\n')}\n\n` +
`PLANO\n` +
`Frequência: ${session.planoTratamento.frequencia}\n` +
`Duração prevista: ${session.planoTratamento.duracaoPrevista}\n` +
`Objetivos CP: ${session.planoTratamento.objetivosCurtoPrazo.join('; ')}\n` +
`Objetivos LP: ${session.planoTratamento.objetivosLongoPrazo.join('; ')}\n` +
`Critérios de alta: ${session.planoTratamento.criteriosAlta.join('; ')}\n\n` +
`OBSERVAÇÕES\n${session.observacoesAdicionais}\n` +
`PRÓXIMA SESSÃO\n${session.proximaSessao.data} — ${session.proximaSessao.foco}\n`;
  };

  const handleExportNote = async (session: FullSessionNote) => {
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
      addBlock(`Dados do paciente: CPF ${patient.cpf} • Nasc.: ${formatDate(patient.birthDate)} • ${patient.gender}`);
      doc.setDrawColor(220);
      doc.line(margin, cursorY - 4, 200 - margin, cursorY - 4);
      addBlock(`Histórico Médico:\n${patient.medicalHistory}`);
      doc.setDrawColor(220);
      doc.line(margin, cursorY - 6, 200 - margin, cursorY - 6);
      patient.sessions.forEach((s, idx) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`\nSessão ${idx + 1} — ${formatDate(s.date)} ${formatTime(s.date)}`, margin, cursorY);
        cursorY += 10;
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
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#4F46E5] border-t-transparent" />
                    Resumindo...
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
                  {calculateAge(patient.birthDate)} anos • {patient.gender}
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
                {patient.totalSessions} sessões
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
                  <span>{formatDate(patient.birthDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#C026D3]" />
                  <span>{patient.cpf}</span>
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

          {/* Medical History with AI Summary */}
          {patient.medicalHistory && (
            <div className="mt-6 pt-6 border-t border-white/60">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
                  Histórico Médico
                </h3>
                {aiSummary && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#F5F3FF] px-3 py-1 text-xs font-medium text-[#6D28D9]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Resumo disponível
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-[#334155]">{patient.medicalHistory}</p>
              {aiSummary && (
                <div className="mt-4 rounded-2xl border border-[#DDD6FE] bg-[#F5F3FF]/80 p-4 shadow-inner">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6D28D9]">Resumo Inteligente</div>
                  <p className="text-sm text-[#4338CA] whitespace-pre-wrap">{aiSummary}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Session Notes */}
        <div className="rounded-[32px] border border-white/70 bg-white/95 p-8 shadow-[0_28px_65px_-46px_rgba(15,23,42,0.28)]">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-[#0F172A]">
              <FileText className="h-6 w-6 text-[#4F46E5]" />
              Histórico de Sessões
            </h2>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E0E7FF] bg-[#F8FAFF] px-4 py-1.5 text-sm font-medium text-[#475569]">
              {patient.sessions.length} {patient.sessions.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {/* Sessions Timeline */}
          <div className="space-y-5">
            {patient.sessions.slice(0, visibleCount).map((session, index) => {
              const isExpanded = expandedNotes.has(session.id);
              const isFirst = index === 0;

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
                          <span>{session.duration} minutos</span>
                        </div>
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
                  {isExpanded && (
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
                                <p className="text-sm leading-relaxed text-[#475569]">{session.resumoExecutivo.queixaPrincipal}</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] p-4 text-[#7F1D1D] shadow-[0_16px_35px_-28px_rgba(248,113,113,0.45)]">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em]">Nível de dor (EVA)</div>
                              <div className="mt-2 text-3xl font-bold">{session.resumoExecutivo.nivelDor}/10</div>
                            </div>
                            <div className="rounded-2xl bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] p-4 text-[#047857] shadow-[0_16px_35px_-28px_rgba(34,197,94,0.45)]">
                              <div className="text-xs font-semibold uppercase tracking-[0.18em]">Evolução</div>
                              <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                                <TrendingUp className="h-5 w-5" />
                                {session.resumoExecutivo.evolucao}
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
                            <p className="leading-relaxed text-[#4338CA]">{session.anamnese.historicoAtual}</p>
                          </div>
                          <div className="rounded-2xl border border-[#DDD6FE] bg-white p-4 shadow-[0_12px_30px_-24px_rgba(129,140,248,0.35)]">
                            <h5 className="mb-1 text-sm font-semibold text-[#3730A3]">Antecedentes pessoais</h5>
                            <p className="leading-relaxed text-[#4338CA]">{session.anamnese.antecedentesPessoais}</p>
                          </div>
                          <div className="rounded-2xl border border-[#E9D5FF] bg-[#FAF5FF] p-4">
                            <h5 className="mb-1 text-sm font-semibold text-[#6B21A8]">Medicamentos</h5>
                            <p className="leading-relaxed text-[#6B21A8]">{session.anamnese.medicamentos}</p>
                          </div>
                          <div className="rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF] p-4">
                            <h5 className="mb-1 text-sm font-semibold text-[#1E3A8A]">Objetivos</h5>
                            <p className="leading-relaxed text-[#1E3A8A]">{session.anamnese.objetivos}</p>
                          </div>
                        </div>
                      </div>

                      {/* Diagnóstico */}
                      <div>
                        <SectionHeader icon={Stethoscope} title="Diagnóstico Fisioterapêutico" color="bg-[#F97316]" />
                        <div className="space-y-4 text-sm">
                          <div className="rounded-2xl border border-[#FED7AA] bg-gradient-to-br from-[#FFF7ED] to-[#FFE4D6] p-4">
                            <div className="mb-1 text-sm font-semibold text-[#9A3412]">Diagnóstico principal</div>
                            <p className="leading-relaxed text-[#7C2D12]">{session.diagnosticoFisioterapeutico.principal}</p>
                          </div>
                          {session.diagnosticoFisioterapeutico.secundario.length > 0 && (
                            <div className="rounded-2xl border border-[#FED7AA] bg-white/90 p-4 shadow-[0_12px_30px_-24px_rgba(251,191,36,0.35)]">
                              <h5 className="mb-2 text-sm font-semibold text-[#9A3412]">Diagnósticos secundários</h5>
                              <ul className="space-y-1">
                                {session.diagnosticoFisioterapeutico.secundario.map((diag, idx) => (
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
                            <p className="mt-1 text-base font-medium text-[#0F172A]">{session.diagnosticoFisioterapeutico.cif}</p>
                          </div>
                        </div>
                      </div>

                      {/* Intervenções */}
                      <div>
                        <SectionHeader icon={Activity} title="Intervenções Realizadas" color="bg-[#0EA5E9]" />
                        <div className="space-y-4 text-sm">
                          {session.intervencoes.tecnicasManuais.length > 0 && (
                            <div className="rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] p-4">
                              <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0369A1]">
                                <span className="h-2 w-2 rounded-full bg-[#0EA5E9]"></span>
                                Técnicas manuais
                              </h5>
                              <ul className="flex flex-wrap gap-2">
                                {session.intervencoes.tecnicasManuais.map((tecnica, idx) => (
                                  <li key={idx} className="rounded-full bg-white/80 px-3 py-1 text-[#0F172A] shadow-sm">
                                    {tecnica}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {session.intervencoes.exerciciosTerapeuticos.length > 0 && (
                            <div className="rounded-2xl border border-[#BBF7D0] bg-[#ECFDF5] p-4">
                              <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#047857]">
                                <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                                Exercícios terapêuticos
                              </h5>
                              <ul className="flex flex-wrap gap-2">
                                {session.intervencoes.exerciciosTerapeuticos.map((exercicio, idx) => (
                                  <li key={idx} className="rounded-full bg-white/80 px-3 py-1 text-[#065F46] shadow-sm">
                                    {exercicio}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {session.intervencoes.recursosEletrotermofototerapeticos.length > 0 && (
                            <div className="rounded-2xl border border-[#E9D5FF] bg-[#FAF5FF] p-4">
                              <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#7C3AED]">
                                <span className="h-2 w-2 rounded-full bg-[#8B5CF6]"></span>
                                Recursos eletrotermofototerapêuticos
                              </h5>
                              <ul className="flex flex-wrap gap-2">
                                {session.intervencoes.recursosEletrotermofototerapeticos.map((recurso, idx) => (
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
                            <p className="mt-2 text-sm leading-relaxed">{session.respostaTratamento.imediata}</p>
                          </div>
                          <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-[#7F1D1D]">
                            <h5 className="text-xs font-semibold uppercase tracking-[0.18em]">Efeitos adversos</h5>
                            <p className="mt-2 text-sm leading-relaxed">{session.respostaTratamento.efeitos}</p>
                          </div>
                          <div className="rounded-2xl border border-[#C7D2FE] bg-white p-4 shadow-[0_12px_30px_-24px_rgba(59,130,246,0.35)] text-[#1E3A8A]">
                            <h5 className="text-xs font-semibold uppercase tracking-[0.18em]">Feedback</h5>
                            <p className="mt-2 text-sm leading-relaxed">{session.respostaTratamento.feedback}</p>
                          </div>
                        </div>
                      </div>

                      {/* Orientações */}
                      <div>
                        <SectionHeader icon={Target} title="Orientações ao Paciente" color="bg-[#4F46E5]" />
                        <div className="grid gap-3 sm:grid-cols-3">
                          {session.orientacoes.domiciliares.length > 0 && (
                            <div className="rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF] p-4">
                              <h5 className="mb-2 text-sm font-semibold text-[#4338CA]">Domiciliares</h5>
                              <ul className="flex flex-col gap-2 text-sm text-[#3730A3]">
                                {session.orientacoes.domiciliares.map((orientacao, idx) => (
                                  <li key={idx} className="rounded-full bg-white/80 px-3 py-1 shadow-sm">
                                    {orientacao}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {session.orientacoes.ergonomicas.length > 0 && (
                            <div className="rounded-2xl border border-[#FBCFE8] bg-[#FDF2F8] p-4">
                              <h5 className="mb-2 text-sm font-semibold text-[#BE185D]">Ergonômicas</h5>
                              <ul className="flex flex-col gap-2 text-sm text-[#9D174D]">
                                {session.orientacoes.ergonomicas.map((orientacao, idx) => (
                                  <li key={idx} className="rounded-full bg-white/80 px-3 py-1 shadow-sm">
                                    {orientacao}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {session.orientacoes.precaucoes.length > 0 && (
                            <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-4">
                              <h5 className="mb-2 text-sm font-semibold text-[#B45309]">Precauções</h5>
                              <ul className="flex flex-col gap-2 text-sm text-[#92400E]">
                                {session.orientacoes.precaucoes.map((orientacao, idx) => (
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
                              <p className="text-sm text-[#333333]">{session.planoTratamento.frequencia}</p>
                            </div>
                            <div className="bg-teal-50 p-3 rounded-lg">
                              <div className="text-xs text-teal-600 font-medium mb-1">Duração Prevista</div>
                              <p className="text-sm text-[#333333]">{session.planoTratamento.duracaoPrevista}</p>
                            </div>
                          </div>
                          {session.planoTratamento.objetivosCurtoPrazo.length > 0 && (
                            <div>
                              <h5 className="font-medium text-[#333333] mb-2 text-sm">Objetivos de Curto Prazo</h5>
                              <ul className="space-y-1">
                                {session.planoTratamento.objetivosCurtoPrazo.map((objetivo, idx) => (
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
                          {session.planoTratamento.objetivosLongoPrazo.length > 0 && (
                            <div>
                              <h5 className="font-medium text-[#333333] mb-2 text-sm">Objetivos de Longo Prazo</h5>
                              <ul className="space-y-1">
                                {session.planoTratamento.objetivosLongoPrazo.map((objetivo, idx) => (
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
                          {session.planoTratamento.criteriosAlta.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h5 className="font-medium text-[#333333] mb-2 text-sm">Critérios de Alta</h5>
                              <ul className="space-y-1">
                                {session.planoTratamento.criteriosAlta.map((criterio, idx) => (
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
                        <p className="text-sm text-[#666666]">{session.observacoesAdicionais}</p>
                      </div>

                      {/* Próxima Sessão */}
                      <div className="bg-gradient-to-r from-[#5A9BCF]/10 to-[#4A8BBF]/10 p-4 rounded-lg border-2 border-[#5A9BCF]/20">
                        <h5 className="font-medium text-[#333333] mb-2 flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-[#5A9BCF]" />
                          <span>Próxima Sessão</span>
                        </h5>
                        <div className="space-y-1 text-sm">
                          <p className="text-[#666666]"><strong>Retorno em:</strong> {session.proximaSessao.data}</p>
                          <p className="text-[#666666]"><strong>Foco:</strong> {session.proximaSessao.foco}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {visibleCount < patient.sessions.length && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => Math.min(c + 5, patient.sessions.length))}
                className="px-4 py-2 text-sm font-medium text-[#5A9BCF] bg-[#5A9BCF]/10 hover:bg-[#5A9BCF]/20 rounded-lg transition-colors"
              >
                Carregar mais
              </button>
            </div>
          )}

          {patient.sessions.length === 0 && (
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
    </div>
  );
};

export default PatientRecord;
