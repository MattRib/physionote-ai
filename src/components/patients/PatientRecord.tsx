'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Activity,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Sparkles,
  Stethoscope,
  Clipboard,
  Target,
  AlertCircle,
  TrendingUp,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NextPage } from 'next';

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

interface PatientRecordProps {
  patientId: string;
}

// Mock data completo - substituir com dados reais do backend
const getMockPatientData = (id: string) => {
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
    totalSessions: 12,
    sessions: [
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
    ] as FullSessionNote[]
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
    <div className="flex items-center space-x-2 mb-3">
      <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h4 className="font-semibold text-[#333333]">{title}</h4>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 rounded-lg shadow-lg border text-sm ${
          toast.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' :
          toast.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
          'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          {toast.message}
        </div>
      )}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-[#666666] hover:text-[#5A9BCF] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
          <button
            onClick={handleExportAll}
            className="flex items-center space-x-2 px-4 py-2 bg-[#5A9BCF] text-white rounded-lg hover:bg-[#4A8BBF] transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Prontuário Completo</span>
          </button>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fade-in">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#5A9BCF] to-[#4A8BBF] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {patient.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#333333]">{patient.name}</h1>
                <p className="text-[#666666] mt-1">
                  {calculateAge(patient.birthDate)} anos • {patient.gender}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                <Activity className="w-4 h-4 mr-2" />
                <span className="font-semibold">{patient.totalSessions} sessões</span>
              </div>
            </div>
          </div>

          {/* Contact and Personal Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#666666] uppercase">Contato</h3>
              <div className="flex items-center space-x-2 text-[#333333]">
                <Phone className="w-4 h-4 text-[#5A9BCF] flex-shrink-0" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#333333]">
                <Mail className="w-4 h-4 text-[#5A9BCF] flex-shrink-0" />
                <span className="truncate">{patient.email}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#666666] uppercase">Dados Pessoais</h3>
              <div className="flex items-center space-x-2 text-[#333333]">
                <Calendar className="w-4 h-4 text-[#5A9BCF] flex-shrink-0" />
                <span>{formatDate(patient.birthDate)}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#333333]">
                <FileText className="w-4 h-4 text-[#5A9BCF] flex-shrink-0" />
                <span>{patient.cpf}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#666666] uppercase">Endereço</h3>
              <div className="flex items-start space-x-2 text-[#333333]">
                <MapPin className="w-4 h-4 text-[#5A9BCF] flex-shrink-0 mt-0.5" />
                <span className="text-sm">
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
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#666666] uppercase">
                  Histórico Médico
                </h3>
                <button
                  onClick={handleSummarizeHistory}
                  disabled={summarizingHistory}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                >
                  {summarizingHistory ? (
                    <>
                      <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin" />
                      <span>Resumindo...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Resumir com IA</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[#333333] leading-relaxed">{patient.medicalHistory}</p>
              {aiSummary && (
                <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div className="text-sm font-semibold text-purple-800 mb-2">Resumo do Histórico (IA)</div>
                  <p className="text-sm text-purple-900 whitespace-pre-wrap">{aiSummary}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Session Notes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#333333] flex items-center space-x-2">
              <FileText className="w-6 h-6 text-[#5A9BCF]" />
              <span>Histórico de Sessões</span>
            </h2>
            <span className="text-[#666666]">
              {patient.sessions.length} {patient.sessions.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {/* Sessions Timeline */}
          <div className="space-y-4">
            {patient.sessions.slice(0, visibleCount).map((session, index) => {
              const isExpanded = expandedNotes.has(session.id);
              const isFirst = index === 0;

              return (
                <div
                  key={session.id}
                  className={`border border-gray-200 rounded-lg transition-all duration-300 ${
                    isFirst ? 'ring-2 ring-[#5A9BCF]/20' : ''
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
                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isFirst ? 'bg-[#5A9BCF]' : 'bg-gray-300'
                      }`}>
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-[#333333]">
                            {formatDate(session.date)}
                          </span>
                          {isFirst && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                              Mais Recente
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-[#666666]">
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
                        className="p-2 text-[#5A9BCF] hover:bg-[#5A9BCF]/10 rounded-lg transition-colors"
                        title="Exportar nota"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#666666]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#666666]" />
                      )}
                    </div>
                  </div>

                  {/* Full Note Details */}
                  {isExpanded && (
                    <div id={`session-${session.id}-details`} className="px-6 py-6 space-y-6 animate-fade-in border-t border-gray-200">
                      {/* Resumo Executivo */}
                      <div>
                        <SectionHeader icon={Activity} title="Resumo Executivo" color="bg-[#5A9BCF]" />
                        <div className="space-y-3">
                          <div className="bg-blue-50 border-l-4 border-[#5A9BCF] p-4 rounded-r-lg">
                            <div className="flex items-start space-x-2">
                              <AlertCircle className="w-5 h-5 text-[#5A9BCF] flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-medium text-[#333333] mb-1">Queixa Principal</div>
                                <p className="text-[#666666]">{session.resumoExecutivo.queixaPrincipal}</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                              <div className="text-xs text-red-600 font-medium mb-1">Nível de Dor (EVA)</div>
                              <div className="text-2xl font-bold text-red-600">{session.resumoExecutivo.nivelDor}/10</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                              <div className="text-xs text-green-600 font-medium mb-1">Evolução</div>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-semibold text-green-600">{session.resumoExecutivo.evolucao}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Anamnese */}
                      <div>
                        <SectionHeader icon={Clipboard} title="Anamnese" color="bg-purple-500" />
                        <div className="space-y-3 text-sm">
                          <div>
                            <h5 className="font-medium text-[#333333] mb-1">Histórico Atual</h5>
                            <p className="text-[#666666]">{session.anamnese.historicoAtual}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-[#333333] mb-1">Antecedentes Pessoais</h5>
                            <p className="text-[#666666]">{session.anamnese.antecedentesPessoais}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-[#333333] mb-1">Medicamentos</h5>
                            <p className="text-[#666666]">{session.anamnese.medicamentos}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-[#333333] mb-1">Objetivos</h5>
                            <p className="text-[#666666]">{session.anamnese.objetivos}</p>
                          </div>
                        </div>
                      </div>

                      {/* Diagnóstico */}
                      <div>
                        <SectionHeader icon={Stethoscope} title="Diagnóstico Fisioterapêutico" color="bg-orange-500" />
                        <div className="space-y-3">
                          <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r-lg">
                            <div className="font-medium text-[#333333] mb-1">Diagnóstico Principal</div>
                            <p className="text-[#666666]">{session.diagnosticoFisioterapeutico.principal}</p>
                          </div>
                          {session.diagnosticoFisioterapeutico.secundario.length > 0 && (
                            <div>
                              <h5 className="font-medium text-[#333333] mb-2 text-sm">Diagnósticos Secundários</h5>
                              <ul className="space-y-1">
                                {session.diagnosticoFisioterapeutico.secundario.map((diag, idx) => (
                                  <li key={idx} className="flex items-start space-x-2 text-sm">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                    <span className="text-[#666666]">{diag}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs font-medium text-[#666666] mb-1">CIF</div>
                            <p className="text-sm text-[#333333]">{session.diagnosticoFisioterapeutico.cif}</p>
                          </div>
                        </div>
                      </div>

                      {/* Intervenções */}
                      <div>
                        <SectionHeader icon={Activity} title="Intervenções Realizadas" color="bg-[#5A9BCF]" />
                        <div className="space-y-4">
                          {session.intervencoes.tecnicasManuais.length > 0 && (
                            <div>
                              <h5 className="font-medium text-[#333333] mb-2 flex items-center space-x-2 text-sm">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>Técnicas Manuais</span>
                              </h5>
                              <ul className="space-y-1 ml-4">
                                {session.intervencoes.tecnicasManuais.map((tecnica, idx) => (
                                  <li key={idx} className="text-sm text-[#666666]">• {tecnica}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {session.intervencoes.exerciciosTerapeuticos.length > 0 && (
                            <div>
                              <h5 className="font-medium text-[#333333] mb-2 flex items-center space-x-2 text-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Exercícios Terapêuticos</span>
                              </h5>
                              <ul className="space-y-1 ml-4">
                                {session.intervencoes.exerciciosTerapeuticos.map((exercicio, idx) => (
                                  <li key={idx} className="text-sm text-[#666666]">• {exercicio}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {session.intervencoes.recursosEletrotermofototerapeticos.length > 0 && (
                            <div>
                              <h5 className="font-medium text-[#333333] mb-2 flex items-center space-x-2 text-sm">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span>Recursos Eletrotermofototerapêuticos</span>
                              </h5>
                              <ul className="space-y-1 ml-4">
                                {session.intervencoes.recursosEletrotermofototerapeticos.map((recurso, idx) => (
                                  <li key={idx} className="text-sm text-[#666666]">• {recurso}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Resposta ao Tratamento */}
                      <div>
                        <SectionHeader icon={TrendingUp} title="Resposta ao Tratamento" color="bg-green-500" />
                        <div className="space-y-3">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h5 className="font-medium text-green-800 mb-1 text-sm">Resposta Imediata</h5>
                            <p className="text-sm text-[#666666]">{session.respostaTratamento.imediata}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-[#333333] mb-1 text-sm">Efeitos Adversos</h5>
                            <p className="text-sm text-[#666666]">{session.respostaTratamento.efeitos}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-[#333333] mb-1 text-sm">Feedback do Paciente</h5>
                            <p className="text-sm text-[#666666]">{session.respostaTratamento.feedback}</p>
                          </div>
                        </div>
                      </div>

                      {/* Orientações */}
                      <div>
                        <SectionHeader icon={Target} title="Orientações ao Paciente" color="bg-indigo-500" />
                        <div className="space-y-3">
                          {session.orientacoes.domiciliares.length > 0 && (
                            <div>
                              <h5 className="font-medium text-[#333333] mb-2 text-sm">Exercícios Domiciliares</h5>
                              <ul className="space-y-1">
                                {session.orientacoes.domiciliares.map((orientacao, idx) => (
                                  <li key={idx} className="flex items-start space-x-2 text-sm">
                                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-[#666666]">{orientacao}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {session.orientacoes.ergonomicas.length > 0 && (
                            <div>
                              <h5 className="font-medium text-[#333333] mb-2 text-sm">Orientações Ergonômicas</h5>
                              <ul className="space-y-1">
                                {session.orientacoes.ergonomicas.map((orientacao, idx) => (
                                  <li key={idx} className="flex items-start space-x-2 text-sm">
                                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-[#666666]">{orientacao}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {session.orientacoes.precaucoes.length > 0 && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r-lg">
                              <h5 className="font-medium text-yellow-800 mb-2 flex items-center space-x-2 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>Precauções</span>
                              </h5>
                              <ul className="space-y-1">
                                {session.orientacoes.precaucoes.map((precaucao, idx) => (
                                  <li key={idx} className="text-sm text-[#666666]">• {precaucao}</li>
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
