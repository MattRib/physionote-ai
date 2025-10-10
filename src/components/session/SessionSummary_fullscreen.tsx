'use client';

import React, { useState } from 'react';
import {
  User,
  Calendar,
  Clock,
  FileText,
  Activity,
  Stethoscope,
  Clipboard,
  Target,
  AlertCircle,
  TrendingUp,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Save,
  X
} from 'lucide-react';
import NoteAIDisclaimer from './NoteAIDisclaimer';

interface SessionSummaryProps {
  patient: { id: string; name: string };
  duration: number;
  transcription: string[];
  onSave: () => void;
  onCancel: () => void;
  showAIDisclaimer?: boolean;
}

// Mock data de uma consulta típica de fisioterapia
const getMockSessionNote = (patientName: string) => {
  return {
    resumoExecutivo: {
      queixaPrincipal: "Dor lombar crônica há aproximadamente 3 meses, com intensificação nos últimos 15 dias",
      nivelDor: 7,
      evolucao: "Paciente apresentou melhora de 30% em relação à última sessão"
    },
    
    anamnese: {
      historicoAtual: "Paciente relata início insidioso de dor na região lombar há 3 meses, sem trauma aparente. Dor tipo queimação, intensidade 7/10, com irradiação para membro inferior direito até joelho. Piora com permanência prolongada em pé e melhora parcial com repouso. Paciente trabalha como vendedor, permanecendo 8h em pé diariamente.",
      antecedentesPessoais: "Sedentário, sobrepeso (IMC 28), sem histórico de cirurgias prévias na coluna",
      medicamentos: "Dipirona 1g SOS para dor (uso irregular)",
      objetivos: "Retornar às atividades de trabalho sem limitações e poder praticar caminhada recreativa"
    },

    diagnosticoFisioterapeutico: {
      principal: "Lombalgia mecânica crônica com radiculopatia L5-S1 à direita",
      secundario: [
        "Desequilíbrio muscular da região lombopélvica",
        "Fraqueza da musculatura estabilizadora do core",
        "Encurtamento de musculatura posterior de membros inferiores",
        "Hiperlordose lombar postural"
      ],
      cif: "b28013 (Dor na região lombar - grave) + b7101 (Mobilidade das articulações da coluna lombar - limitação moderada)"
    },

    intervencoes: {
      tecnicasManuais: [
        "Mobilização articular de L4-L5 grau III (Maitland) - 3 séries de 30 segundos",
        "Liberação miofascial de quadrado lombar bilateral - 5 minutos cada lado",
        "Massagem de deslizamento profundo em paravertebrais - 8 minutos",
        "Técnica de energia muscular para piriforme direito - 3 repetições"
      ],
      exerciciosTerapeuticos: [
        "Exercício de estabilização segmentar - ponte com sustentação isométrica 10s x 10 repetições",
        "Ativação de transverso abdominal em 4 apoios - 3 séries de 10 repetições",
        "Alongamento de isquiotibiais em decúbito dorsal - 3 séries de 30s cada perna",
        "Mobilização neural do nervo ciático - 2 séries de 10 repetições"
      ],
      recursosEletrotermofototerapeticos: [
        "TENS modo burst na região lombar - 20 minutos (analgesia)",
        "Compressa quente em região lombar - 10 minutos (pré-tratamento)"
      ]
    },

    respostaTratamento: {
      imediata: "Paciente refere diminuição da dor de 7/10 para 4/10 após sessão. Melhora de 30% na amplitude de flexão do tronco. Relata sensação de 'leveza' e melhor mobilidade.",
      efeitos: "Sem efeitos adversos relatados. Paciente tolerou bem todas as intervenções.",
      feedback: "Paciente muito satisfeito com resultado imediato, motivado para continuar tratamento"
    },

    orientacoes: {
      domiciliares: [
        "Aplicar bolsa de água morna na região lombar por 15-20 minutos, 2x ao dia",
        "Realizar alongamento de isquiotibiais 3x ao dia (manhã, tarde e noite)",
        "Praticar exercício de ativação do transverso abdominal em casa - 2 séries de 10 repetições pela manhã",
        "Evitar permanecer mais de 2 horas na mesma posição"
      ],
      ergonomicas: [
        "Utilizar apoio lombar na cadeira do trabalho",
        "Fazer pausas de 5 minutos a cada 1 hora para alongamentos",
        "Ao pegar objetos do chão, agachar flexionando joelhos (não curvar coluna)",
        "Dormir em decúbito lateral com travesseiro entre os joelhos"
      ],
      precaucoes: [
        "Evitar movimentos de rotação combinada com flexão do tronco",
        "Não carregar peso acima de 5kg por enquanto",
        "Caso dor aumente significativamente ou apareça formigamento intenso, entrar em contato"
      ]
    },

    planoTratamento: {
      frequencia: "3x por semana nas próximas 2 semanas, depois reavaliar para 2x por semana",
      duracaoPrevista: "8-12 semanas para recuperação funcional completa",
      objetivosCurtoPrazo: [
        "Reduzir dor para 3/10 ou menos em 2 semanas",
        "Aumentar ADM de flexão do tronco para 75° em 2 semanas",
        "Melhorar força de abdominais para 4/5 em 3 semanas"
      ],
      objetivosLongoPrazo: [
        "Retorno ao trabalho sem limitações em 6-8 semanas",
        "Iniciar programa de caminhada recreativa em 8 semanas",
        "Recuperação completa da ADM lombar em 10-12 semanas",
        "Força muscular 5/5 em toda musculatura do core em 12 semanas"
      ],
      criteriosAlta: [
        "Ausência de dor ou dor mínima (≤2/10)",
        "ADM completa e indolor",
        "Força muscular 5/5",
        "Retorno às atividades funcionais sem limitações",
        "Paciente capaz de realizar programa de exercícios domiciliares de manutenção"
      ]
    },

    observacoesAdicionais: "Paciente demonstra boa compreensão das orientações e alta motivação para tratamento. Reforçada importância da adesão aos exercícios domiciliares e modificações ergonômicas para sucesso do tratamento. Enfatizada necessidade de perda de peso gradual para diminuir sobrecarga lombar (encaminhamento para nutricionista sugerido).",

    proximaSessao: {
      data: "2 dias",
      foco: "Progressão de exercícios de estabilização, continuidade de técnicas manuais e reavaliação da dor"
    }
  };
};

const SessionSummary: React.FC<SessionSummaryProps> = ({
  patient,
  duration,
  transcription,
  onSave,
  onCancel,
  showAIDisclaimer = true
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['resumo', 'anamnese', 'diagnostico', 'intervencoes', 'resposta', 'orientacoes', 'plano']));
  const [editMode] = useState(true); // por padrão, já vem em modo de edição antes de salvar

  // Estado da nota editável (inicialmente preenchido pela IA)
  const [note, setNote] = useState(getMockSessionNote(patient.name));

  const sessionData = {
    id: `session-${Date.now()}`,
    patient_name: patient.name,
    session_datetime: new Date().toISOString(),
    duration_minutes: Math.floor(duration / 60)
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(sessionData.session_datetime);

  const handleCopyNote = () => {
    const noteText = `
NOTA DE EVOLUÇÃO FISIOTERAPÊUTICA
Paciente: ${sessionData.patient_name}
Data: ${date} às ${time}
Duração: ${sessionData.duration_minutes} minutos

QUEIXA PRINCIPAL: ${note.resumoExecutivo.queixaPrincipal}
DOR: ${note.resumoExecutivo.nivelDor}/10
EVOLUÇÃO: ${note.resumoExecutivo.evolucao}

ANAMNESE:
- Histórico Atual: ${note.anamnese.historicoAtual}
- Antecedentes Pessoais: ${note.anamnese.antecedentesPessoais}
- Medicamentos: ${note.anamnese.medicamentos}
- Objetivos: ${note.anamnese.objetivos}

DIAGNÓSTICO PRINCIPAL: ${note.diagnosticoFisioterapeutico.principal}
SECUNDÁRIOS:
${note.diagnosticoFisioterapeutico.secundario.map((d: string)=>`- ${d}`).join('\n')}
CIF: ${note.diagnosticoFisioterapeutico.cif}

INTERVENÇÕES:
- Técnicas Manuais:\n${note.intervencoes.tecnicasManuais.map((i: string)=>`  • ${i}`).join('\n')}
- Exercícios Terapêuticos:\n${note.intervencoes.exerciciosTerapeuticos.map((i: string)=>`  • ${i}`).join('\n')}
- Recursos Eletrotermofototerapêuticos:\n${note.intervencoes.recursosEletrotermofototerapeticos.map((i: string)=>`  • ${i}`).join('\n')}

RESPOSTA IMEDIATA: ${note.respostaTratamento.imediata}
EFEITOS ADVERSOS: ${note.respostaTratamento.efeitos}
FEEDBACK: ${note.respostaTratamento.feedback}

ORIENTAÇÕES DOMICILIARES:\n${note.orientacoes.domiciliares.map((i: string)=>`• ${i}`).join('\n')}
ERGONÔMICAS:\n${note.orientacoes.ergonomicas.map((i: string)=>`• ${i}`).join('\n')}
PRECAUÇÕES:\n${note.orientacoes.precaucoes.map((i: string)=>`• ${i}`).join('\n')}

PLANO:
- Frequência: ${note.planoTratamento.frequencia}
- Duração Prevista: ${note.planoTratamento.duracaoPrevista}
- Objetivos (Curto Prazo):\n${note.planoTratamento.objetivosCurtoPrazo.map((i: string)=>`  ${i}`).join('\n')}
- Objetivos (Longo Prazo):\n${note.planoTratamento.objetivosLongoPrazo.map((i: string)=>`  ${i}`).join('\n')}
- Critérios de Alta:\n${note.planoTratamento.criteriosAlta.map((i: string)=>`  ${i}`).join('\n')}

OBSERVAÇÕES ADICIONAIS: ${note.observacoesAdicionais}
PRÓXIMA SESSÃO: Retorno em ${note.proximaSessao.data} | Foco: ${note.proximaSessao.foco}
    `;
    
    navigator.clipboard.writeText(noteText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveClick = () => {
    // Até termos backend, registramos a nota editada no console para avaliação.
    console.log('Nota editada (revisada pelo usuário):', note);
    onSave();
  };

  const handleClose = () => {
    if (confirm('Tem certeza que deseja descartar esta sessão? Todos os dados serão perdidos.')) {
      onCancel();
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const SectionHeader = ({ id, icon: Icon, title, color }: { id: string, icon: any, title: string, color: string }) => {
    const isExpanded = expandedSections.has(id);
    return (
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#333333]">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-[#666666]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#666666]" />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header Fixo */}
      <div className="bg-gradient-to-r from-[#5A9BCF] to-[#4A8BBF] shadow-lg">
        <div className="max-w-7xl mx-auto p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Sessão Finalizada</h1>
                <p className="text-blue-100 text-sm">Revise o resumo inteligente gerado</p>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-200" />
              <div>
                <div className="text-xs text-blue-200">Paciente</div>
                <div className="font-semibold">{sessionData.patient_name}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-200" />
              <div>
                <div className="text-xs text-blue-200">Data</div>
                <div className="font-semibold">{date}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-200" />
              <div>
                <div className="text-xs text-blue-200">Duração</div>
                <div className="font-semibold">{sessionData.duration_minutes} minutos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6 pb-32">
        {/* Aviso discreto de IA (apenas quando gerado por IA) */}
        <NoteAIDisclaimer show={showAIDisclaimer} />
        
        {/* Resumo Executivo */}
        <div className="space-y-2">
          <SectionHeader id="resumo" icon={Activity} title="Resumo Executivo" color="bg-[#5A9BCF]" />
          {expandedSections.has('resumo') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4 animate-fade-in">
              <div className="bg-blue-50 border-l-4 border-[#5A9BCF] p-4 rounded-r-lg">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-[#5A9BCF] flex-shrink-0" />
                    <h4 className="font-semibold text-[#333333] text-base md:text-lg">Queixa Principal</h4>
                  </div>
                  <textarea
                    className="w-full text-[#333333] bg-white border border-blue-200 rounded-md p-3 resize-y focus:outline-none focus:ring-2 focus:ring-[#5A9BCF]"
                    value={note.resumoExecutivo.queixaPrincipal}
                    onChange={(e) => setNote({
                      ...note,
                      resumoExecutivo: { ...note.resumoExecutivo, queixaPrincipal: e.target.value }
                    })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-sm text-red-600 font-medium mb-1 md:text-base">Nível de Dor (EVA)</div>
                  <div className="flex items-baseline space-x-2">
                    <input
                      type="number"
                      min={0}
                      max={10}
                      className="w-20 text-3xl font-bold text-red-600 bg-transparent focus:outline-none"
                      value={note.resumoExecutivo.nivelDor}
                      onChange={(e) => setNote({
                        ...note,
                        resumoExecutivo: { ...note.resumoExecutivo, nivelDor: Number(e.target.value) }
                      })}
                    />
                    <span className="text-red-600 text-2xl">/10</span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 font-medium mb-1 md:text-base">Evolução</div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <input
                      className="flex-1 text-lg font-semibold text-green-700 bg-transparent border-b border-green-300 focus:outline-none"
                      value={note.resumoExecutivo.evolucao}
                      onChange={(e) => setNote({
                        ...note,
                        resumoExecutivo: { ...note.resumoExecutivo, evolucao: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Anamnese */}
        <div className="space-y-2">
          <SectionHeader id="anamnese" icon={Clipboard} title="Anamnese" color="bg-purple-500" />
          {expandedSections.has('anamnese') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3 animate-fade-in">
              <div>
                <h4 className="font-semibold text-[#333333] mb-2">Histórico Atual</h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={note.anamnese.historicoAtual}
                  onChange={(e) => setNote({
                    ...note,
                    anamnese: { ...note.anamnese, historicoAtual: e.target.value }
                  })}
                  rows={4}
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#333333] mb-2">Antecedentes Pessoais</h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={note.anamnese.antecedentesPessoais}
                  onChange={(e) => setNote({
                    ...note,
                    anamnese: { ...note.anamnese, antecedentesPessoais: e.target.value }
                  })}
                  rows={3}
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#333333] mb-2">Medicamentos em Uso</h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={note.anamnese.medicamentos}
                  onChange={(e) => setNote({
                    ...note,
                    anamnese: { ...note.anamnese, medicamentos: e.target.value }
                  })}
                  rows={2}
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#333333] mb-2">Objetivos do Paciente</h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={note.anamnese.objetivos}
                  onChange={(e) => setNote({
                    ...note,
                    anamnese: { ...note.anamnese, objetivos: e.target.value }
                  })}
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>

        {/* Diagnóstico */}
        <div className="space-y-2">
          <SectionHeader id="diagnostico" icon={Stethoscope} title="Diagnóstico Fisioterapêutico" color="bg-orange-500" />
          {expandedSections.has('diagnostico') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3 animate-fade-in">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <div className="font-semibold text-[#333333] mb-1">Diagnóstico Principal</div>
                <textarea
                  className="w-full text-[#333333] bg-white border border-orange-200 rounded-md p-3 resize-y focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={note.diagnosticoFisioterapeutico.principal}
                  onChange={(e) => setNote({
                    ...note,
                    diagnosticoFisioterapeutico: { ...note.diagnosticoFisioterapeutico, principal: e.target.value }
                  })}
                  rows={2}
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#333333] mb-2">Diagnósticos Secundários</h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none"
                  placeholder={"Uma linha por diagnóstico"}
                  value={note.diagnosticoFisioterapeutico.secundario.join('\n')}
                  onChange={(e) => setNote({
                    ...note,
                    diagnosticoFisioterapeutico: { ...note.diagnosticoFisioterapeutico, secundario: e.target.value.split('\n').filter(Boolean) }
                  })}
                  rows={4}
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-[#666666]">CIF (Classificação Internacional de Funcionalidade)</div>
                <input
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-2 focus:outline-none"
                  value={note.diagnosticoFisioterapeutico.cif}
                  onChange={(e) => setNote({
                    ...note,
                    diagnosticoFisioterapeutico: { ...note.diagnosticoFisioterapeutico, cif: e.target.value }
                  })}
                />
              </div>
            </div>
          )}
        </div>

        {/* Intervenções */}
        <div className="space-y-2">
          <SectionHeader id="intervencoes" icon={Activity} title="Intervenções Realizadas" color="bg-[#5A9BCF]" />
          {expandedSections.has('intervencoes') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4 animate-fade-in">
              <div>
                <h4 className="font-semibold text-[#333333] mb-3 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Técnicas Manuais</span>
                </h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none"
                  placeholder={"Uma linha por técnica"}
                  value={note.intervencoes.tecnicasManuais.join('\n')}
                  onChange={(e) => setNote({
                    ...note,
                    intervencoes: { ...note.intervencoes, tecnicasManuais: e.target.value.split('\n').filter(Boolean) }
                  })}
                  rows={4}
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#333333] mb-3 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Exercícios Terapêuticos</span>
                </h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none"
                  placeholder={"Uma linha por exercício"}
                  value={note.intervencoes.exerciciosTerapeuticos.join('\n')}
                  onChange={(e) => setNote({
                    ...note,
                    intervencoes: { ...note.intervencoes, exerciciosTerapeuticos: e.target.value.split('\n').filter(Boolean) }
                  })}
                  rows={4}
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#333333] mb-3 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Recursos Eletrotermofototerapêuticos</span>
                </h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none"
                  placeholder={"Uma linha por recurso"}
                  value={note.intervencoes.recursosEletrotermofototerapeticos.join('\n')}
                  onChange={(e) => setNote({
                    ...note,
                    intervencoes: { ...note.intervencoes, recursosEletrotermofototerapeticos: e.target.value.split('\n').filter(Boolean) }
                  })}
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>

        {/* Resposta ao Tratamento */}
        <div className="space-y-2">
          <SectionHeader id="resposta" icon={TrendingUp} title="Resposta ao Tratamento" color="bg-green-500" />
          {expandedSections.has('resposta') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3 animate-fade-in">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Resposta Imediata</h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-green-200 rounded-md p-3 resize-y focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={note.respostaTratamento.imediata}
                  onChange={(e) => setNote({
                    ...note,
                    respostaTratamento: { ...note.respostaTratamento, imediata: e.target.value }
                  })}
                  rows={3}
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#333333] mb-2">Efeitos Adversos</h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none"
                  value={note.respostaTratamento.efeitos}
                  onChange={(e) => setNote({
                    ...note,
                    respostaTratamento: { ...note.respostaTratamento, efeitos: e.target.value }
                  })}
                  rows={2}
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#333333] mb-2">Feedback do Paciente</h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none"
                  value={note.respostaTratamento.feedback}
                  onChange={(e) => setNote({
                    ...note,
                    respostaTratamento: { ...note.respostaTratamento, feedback: e.target.value }
                  })}
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>

        {/* Orientações */}
        <div className="space-y-2">
          <SectionHeader id="orientacoes" icon={Target} title="Orientações ao Paciente" color="bg-indigo-500" />
          {expandedSections.has('orientacoes') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4 animate-fade-in">
              <div>
                <h4 className="font-semibold text-[#333333] mb-3">Exercícios Domiciliares</h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none"
                  placeholder={"Uma linha por orientação"}
                  value={note.orientacoes.domiciliares.join('\n')}
                  onChange={(e) => setNote({
                    ...note,
                    orientacoes: { ...note.orientacoes, domiciliares: e.target.value.split('\n').filter(Boolean) }
                  })}
                  rows={4}
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#333333] mb-3">Orientações Ergonômicas</h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none"
                  placeholder={"Uma linha por orientação"}
                  value={note.orientacoes.ergonomicas.join('\n')}
                  onChange={(e) => setNote({
                    ...note,
                    orientacoes: { ...note.orientacoes, ergonomicas: e.target.value.split('\n').filter(Boolean) }
                  })}
                  rows={4}
                />
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <h4 className="font-semibold text-yellow-800 mb-3 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Precauções</span>
                </h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-yellow-200 rounded-md p-3 resize-y focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder={"Uma linha por precaução"}
                  value={note.orientacoes.precaucoes.join('\n')}
                  onChange={(e) => setNote({
                    ...note,
                    orientacoes: { ...note.orientacoes, precaucoes: e.target.value.split('\n').filter(Boolean) }
                  })}
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>

        {/* Plano de Tratamento */}
        <div className="space-y-2">
          <SectionHeader id="plano" icon={Target} title="Plano de Tratamento" color="bg-teal-500" />
          {expandedSections.has('plano') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="text-sm text-teal-600 font-medium mb-1">Frequência</div>
                  <input
                    className="w-full text-[#333333] bg-white border border-teal-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={note.planoTratamento.frequencia}
                    onChange={(e) => setNote({
                      ...note,
                      planoTratamento: { ...note.planoTratamento, frequencia: e.target.value }
                    })}
                  />
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="text-sm text-teal-600 font-medium mb-1">Duração Prevista</div>
                  <input
                    className="w-full text-[#333333] bg-white border border-teal-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={note.planoTratamento.duracaoPrevista}
                    onChange={(e) => setNote({
                      ...note,
                      planoTratamento: { ...note.planoTratamento, duracaoPrevista: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#333333] mb-3">Objetivos de Curto Prazo (2-3 semanas)</h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none"
                  placeholder={"Uma linha por objetivo"}
                  value={note.planoTratamento.objetivosCurtoPrazo.join('\n')}
                  onChange={(e) => setNote({
                    ...note,
                    planoTratamento: { ...note.planoTratamento, objetivosCurtoPrazo: e.target.value.split('\n').filter(Boolean) }
                  })}
                  rows={4}
                />
              </div>

              <div>
                <h4 className="font-semibold text-[#333333] mb-3">Objetivos de Longo Prazo (6-12 semanas)</h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none"
                  placeholder={"Uma linha por objetivo"}
                  value={note.planoTratamento.objetivosLongoPrazo.join('\n')}
                  onChange={(e) => setNote({
                    ...note,
                    planoTratamento: { ...note.planoTratamento, objetivosLongoPrazo: e.target.value.split('\n').filter(Boolean) }
                  })}
                  rows={4}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-[#333333] mb-3">Critérios de Alta</h4>
                <textarea
                  className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none"
                  placeholder={"Uma linha por critério"}
                  value={note.planoTratamento.criteriosAlta.join('\n')}
                  onChange={(e) => setNote({
                    ...note,
                    planoTratamento: { ...note.planoTratamento, criteriosAlta: e.target.value.split('\n').filter(Boolean) }
                  })}
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>

        {/* Observações Adicionais */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-[#333333] mb-2 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#5A9BCF]" />
            <span>Observações Adicionais</span>
          </h4>
          <textarea
            className="w-full text-[#333333] bg-white border border-gray-200 rounded-md p-3 resize-y focus:outline-none"
            value={note.observacoesAdicionais}
            onChange={(e) => setNote({
              ...note,
              observacoesAdicionais: e.target.value
            })}
            rows={4}
          />
        </div>

        {/* Próxima Sessão */}
        <div className="bg-gradient-to-r from-[#5A9BCF]/10 to-[#4A8BBF]/10 rounded-lg border-2 border-[#5A9BCF]/20 p-6">
          <h4 className="font-semibold text-[#333333] mb-2 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#5A9BCF]" />
            <span>Próxima Sessão</span>
          </h4>
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
              <label className="text-[#666666] font-medium min-w-[90px]">Retorno em:</label>
              <input
                className="flex-1 text-[#333333] bg-white border border-blue-200 rounded-md p-2 focus:outline-none"
                value={note.proximaSessao.data}
                onChange={(e) => setNote({
                  ...note,
                  proximaSessao: { ...note.proximaSessao, data: e.target.value }
                })}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
              <label className="text-[#666666] font-medium min-w-[90px]">Foco:</label>
              <input
                className="flex-1 text-[#333333] bg-white border border-blue-200 rounded-md p-2 focus:outline-none"
                value={note.proximaSessao.foco}
                onChange={(e) => setNote({
                  ...note,
                  proximaSessao: { ...note.proximaSessao, foco: e.target.value }
                })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-[#666666]">
            <span className="font-medium">ID da Sessão:</span> {sessionData.id}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCopyNote}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-[#666666] rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Nota</span>
                </>
              )}
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-[#5A9BCF] text-white rounded-lg hover:bg-[#4A8BBF] transition-colors">
              <Download className="w-4 h-4" />
              <span>Exportar PDF</span>
            </button>
            <button
              onClick={handleSaveClick}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg font-semibold"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Sessão</span>
            </button>
            <button
              onClick={handleClose}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-[#666666] rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Descartar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;
