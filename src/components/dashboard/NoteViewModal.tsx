'use client';

import React, { useState } from 'react';
import {
  X,
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
  Save
} from 'lucide-react';

interface NoteViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: {
    id: string;
    patient_name: string;
    session_datetime: string;
    duration_minutes?: number;
  };
  onSaveSession?: () => void;
  showSaveButton?: boolean;
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

    avaliacaoFisica: {
      inspecao: "Postura antálgica com inclinação lateral direita. Hiperlordose lombar acentuada. Musculatura paravertebral com tensão aumentada bilateral, maior à direita.",
      palpacao: "Pontos dolorosos em L4-L5 e L5-S1, com tensão muscular aumentada em quadrado lombar direito e piriforme direito.",
      amplitudeMovimento: {
        flexaoTronco: "60° (limitado por dor - normal: 90°)",
        extensaoTronco: "15° (limitado - normal: 30°)",
        flexaoLateralD: "20° (com dor)",
        flexaoLateralE: "25° (normal: 30°)",
        rotacaoD: "30° (limitado)",
        rotacaoE: "35° (normal: 45°)"
      },
      testeEspeciais: {
        lasegue: "Positivo à 45° em MID (sugere comprometimento de raiz nervosa)",
        slumpTest: "Positivo",
        fabere: "Negativo bilateralmente",
        thomas: "Encurtamento de psoas bilateral"
      },
      testeMuscular: {
        abdominais: "3/5 (fraqueza moderada)",
        paravertebrais: "4/5",
        gluteoMaximo: "3/5 D, 4/5 E",
        gluteoMedio: "3/5 D, 4/5 E"
      }
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

const NoteViewModal: React.FC<NoteViewModalProps> = ({
  isOpen,
  onClose,
  sessionData,
  onSaveSession,
  showSaveButton = false
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['resumo', 'diagnostico', 'intervencoes']));

  if (!isOpen) return null;

  const mockNote = getMockSessionNote(sessionData.patient_name);

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(sessionData.session_datetime);

  const handleCopyNote = () => {
    // Aqui você montaria o texto completo da nota para copiar
    const noteText = `
NOTA DE EVOLUÇÃO FISIOTERAPÊUTICA
Paciente: ${sessionData.patient_name}
Data: ${date} às ${time}
Duração: ${sessionData.duration_minutes} minutos

QUEIXA PRINCIPAL: ${mockNote.resumoExecutivo.queixaPrincipal}
DOR: ${mockNote.resumoExecutivo.nivelDor}/10
...
    `;
    
    navigator.clipboard.writeText(noteText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        className="group w-full flex items-center justify-between p-5 bg-white/80 hover:bg-white/90 rounded-2xl transition-all duration-300 border border-white/60 hover:border-white/80 shadow-sm hover:shadow-lg backdrop-blur-sm"
      >
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors duration-300">{title}</h3>
        </div>
        <div className="flex items-center space-x-3">
          {isExpanded && (
            <span className="text-xs font-medium text-[#4F46E5] bg-[#EEF2FF] px-3 py-1 rounded-full">
              Expandido
            </span>
          )}
          <div className="w-8 h-8 bg-gray-100 group-hover:bg-[#EEF2FF] rounded-lg flex items-center justify-center transition-colors duration-300">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-[#94A3B8] group-hover:text-[#4F46E5] transition-colors duration-300" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#94A3B8] group-hover:text-[#4F46E5] transition-colors duration-300" />
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up-modal border border-white/20">
        
        {/* Header aprimorado */}
        <div className="relative bg-gradient-to-br from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] p-8 text-white overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_70%)]" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-2xl blur-md" />
                  <div className="relative w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">Nota de Evolução</h2>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-white/20 text-white/90 text-sm font-medium rounded-full backdrop-blur-sm">
                      🤖 Resumo Inteligente da Sessão
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="relative p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Session Info aprimorado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/70 font-medium uppercase tracking-wider">Paciente</div>
                    <div className="font-semibold text-white text-lg">{sessionData.patient_name}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/70 font-medium uppercase tracking-wider">Data</div>
                    <div className="font-semibold text-white text-lg">{date}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/70 font-medium uppercase tracking-wider">Duração</div>
                    <div className="font-semibold text-white text-lg">{sessionData.duration_minutes} min</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content aprimorado */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#F4F3FF] relative">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.08),transparent_50%)]" />
          
          <div className="relative z-10 p-8 space-y-6">
          
          {/* Resumo Executivo */}
          <div className="space-y-3">
            <SectionHeader id="resumo" icon={Activity} title="Resumo Executivo" color="bg-gradient-to-br from-[#4F46E5] to-[#6366F1]" />
            {expandedSections.has('resumo') && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 p-6 space-y-6 animate-fade-in shadow-lg">
                <div className="bg-gradient-to-r from-[#EEF2FF] to-[#E0E7FF] border-l-4 border-[#4F46E5] p-5 rounded-r-2xl">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[#111827] mb-2 text-lg">Queixa Principal</div>
                      <p className="text-[#64748B] leading-relaxed">{mockNote.resumoExecutivo.queixaPrincipal}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nível de dor aprimorado */}
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border border-red-200 shadow-sm">
                    <div className="text-sm text-red-600 font-bold mb-3 uppercase tracking-wider">Nível de Dor (EVA)</div>
                    <div className="space-y-4">
                      <div className="flex items-end gap-3">
                        <div className="text-4xl font-black text-red-600">{mockNote.resumoExecutivo.nivelDor}</div>
                        <div className="text-2xl font-bold text-red-500 pb-1">/10</div>
                      </div>
                      {/* Barra de progresso visual */}
                      <div className="space-y-2">
                        <div className="w-full bg-red-100 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                            style={{ width: `${(mockNote.resumoExecutivo.nivelDor / 10) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-red-500 font-semibold">
                          <span>Sem dor</span>
                          <span>Dor severa</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Evolução aprimorada */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 shadow-sm">
                    <div className="text-sm text-green-600 font-bold mb-3 uppercase tracking-wider">Evolução do Paciente</div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-green-800 font-semibold leading-relaxed">{mockNote.resumoExecutivo.evolucao}</p>
                        </div>
                      </div>
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
              <div className="p-4 space-y-3 animate-fade-in">
                <div>
                  <h4 className="font-semibold text-[#111827] mb-2">Histórico Atual</h4>
                  <p className="text-[#64748B] leading-relaxed">{mockNote.anamnese.historicoAtual}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#111827] mb-2">Antecedentes Pessoais</h4>
                  <p className="text-[#64748B]">{mockNote.anamnese.antecedentesPessoais}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#111827] mb-2">Medicamentos em Uso</h4>
                  <p className="text-[#64748B]">{mockNote.anamnese.medicamentos}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#111827] mb-2">Objetivos do Paciente</h4>
                  <p className="text-[#64748B]">{mockNote.anamnese.objetivos}</p>
                </div>
              </div>
            )}
          </div>

          {/* Diagnóstico Fisioterapêutico */}
          <div className="space-y-2">
            <SectionHeader id="diagnostico" icon={Stethoscope} title="Diagnóstico Fisioterapêutico" color="bg-orange-500" />
            {expandedSections.has('diagnostico') && (
              <div className="p-4 space-y-3 animate-fade-in">
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                  <div className="font-semibold text-[#111827] mb-1">Diagnóstico Principal</div>
                  <p className="text-[#64748B] text-lg">{mockNote.diagnosticoFisioterapeutico.principal}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#111827] mb-2">Diagnósticos Secundários</h4>
                  <ul className="space-y-2">
                    {mockNote.diagnosticoFisioterapeutico.secundario.map((diag, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-[#64748B]">{diag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded-lg">
                  <div className="text-sm font-medium text-[#64748B]">CIF (Classificação Internacional de Funcionalidade)</div>
                  <p className="text-[#111827] mt-1">{mockNote.diagnosticoFisioterapeutico.cif}</p>
                </div>
              </div>
            )}
          </div>

          {/* Intervenções Realizadas */}
          <div className="space-y-2">
            <SectionHeader id="intervencoes" icon={Activity} title="Intervenções Realizadas" color="bg-gradient-to-br from-[#4F46E5] to-[#6366F1]" />
            {expandedSections.has('intervencoes') && (
              <div className="p-4 space-y-4 animate-fade-in">
                <div>
                  <h4 className="font-semibold text-[#111827] mb-3 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Técnicas Manuais</span>
                  </h4>
                  <ul className="space-y-2 ml-4">
                    {mockNote.intervencoes.tecnicasManuais.map((tecnica, index) => (
                      <li key={index} className="text-[#64748B] leading-relaxed">• {tecnica}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#111827] mb-3 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Exercícios Terapêuticos</span>
                  </h4>
                  <ul className="space-y-2 ml-4">
                    {mockNote.intervencoes.exerciciosTerapeuticos.map((exercicio, index) => (
                      <li key={index} className="text-[#64748B] leading-relaxed">• {exercicio}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#111827] mb-3 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Recursos Eletrotermofototerapêuticos</span>
                  </h4>
                  <ul className="space-y-2 ml-4">
                    {mockNote.intervencoes.recursosEletrotermofototerapeticos.map((recurso, index) => (
                      <li key={index} className="text-[#64748B] leading-relaxed">• {recurso}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Resposta ao Tratamento */}
          <div className="space-y-2">
            <SectionHeader id="resposta" icon={TrendingUp} title="Resposta ao Tratamento" color="bg-green-500" />
            {expandedSections.has('resposta') && (
              <div className="p-4 space-y-3 animate-fade-in">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Resposta Imediata</h4>
                  <p className="text-[#64748B]">{mockNote.respostaTratamento.imediata}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#111827] mb-2">Efeitos Adversos</h4>
                  <p className="text-[#64748B]">{mockNote.respostaTratamento.efeitos}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#111827] mb-2">Feedback do Paciente</h4>
                  <p className="text-[#64748B]">{mockNote.respostaTratamento.feedback}</p>
                </div>
              </div>
            )}
          </div>

          {/* Orientações */}
          <div className="space-y-2">
            <SectionHeader id="orientacoes" icon={Target} title="Orientações ao Paciente" color="bg-indigo-500" />
            {expandedSections.has('orientacoes') && (
              <div className="p-4 space-y-4 animate-fade-in">
                <div>
                  <h4 className="font-semibold text-[#111827] mb-3">Exercícios Domiciliares</h4>
                  <ul className="space-y-2">
                    {mockNote.orientacoes.domiciliares.map((orientacao, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-[#64748B]">{orientacao}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#111827] mb-3">Orientações Ergonômicas</h4>
                  <ul className="space-y-2">
                    {mockNote.orientacoes.ergonomicas.map((orientacao, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-[#64748B]">{orientacao}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-yellow-800 mb-3 flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Precauções</span>
                  </h4>
                  <ul className="space-y-2">
                    {mockNote.orientacoes.precaucoes.map((precaucao, index) => (
                      <li key={index} className="text-[#64748B]">• {precaucao}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Plano de Tratamento */}
          <div className="space-y-2">
            <SectionHeader id="plano" icon={Target} title="Plano de Tratamento" color="bg-teal-500" />
            {expandedSections.has('plano') && (
              <div className="p-4 space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <div className="text-sm text-teal-600 font-medium mb-1">Frequência</div>
                    <p className="text-[#111827]">{mockNote.planoTratamento.frequencia}</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <div className="text-sm text-teal-600 font-medium mb-1">Duração Prevista</div>
                    <p className="text-[#111827]">{mockNote.planoTratamento.duracaoPrevista}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#111827] mb-3">Objetivos de Curto Prazo (2-3 semanas)</h4>
                  <ul className="space-y-2">
                    {mockNote.planoTratamento.objetivosCurtoPrazo.map((objetivo, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-[#64748B] mt-0.5">{objetivo}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-[#111827] mb-3">Objetivos de Longo Prazo (6-12 semanas)</h4>
                  <ul className="space-y-2">
                    {mockNote.planoTratamento.objetivosLongoPrazo.map((objetivo, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-[#64748B] mt-0.5">{objetivo}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#F8FAFC] p-4 rounded-lg">
                  <h4 className="font-semibold text-[#111827] mb-3">Critérios de Alta</h4>
                  <ul className="space-y-2">
                    {mockNote.planoTratamento.criteriosAlta.map((criterio, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-[#64748B]">{criterio}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Observações Adicionais */}
          <div className="bg-[#EEF2FF] p-4 rounded-lg border border-[#C7D2FE]">
            <h4 className="font-semibold text-[#111827] mb-2 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#4F46E5]" />
              <span>Observações Adicionais</span>
            </h4>
            <p className="text-[#64748B] leading-relaxed">{mockNote.observacoesAdicionais}</p>
          </div>

          {/* Próxima Sessão */}
          <div className="bg-gradient-to-r from-[#4F46E5]/10 via-[#6366F1]/10 to-[#8B5CF6]/10 p-4 rounded-lg border-2 border-[#6366F1]/20">
            <h4 className="font-semibold text-[#111827] mb-2 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#4F46E5]" />
              <span>Próxima Sessão</span>
            </h4>
            <div className="space-y-1">
              <p className="text-[#64748B]"><strong className="text-[#4F46E5] font-semibold">Retorno em:</strong> {mockNote.proximaSessao.data}</p>
              <p className="text-[#64748B]"><strong className="text-[#4F46E5] font-semibold">Foco:</strong> {mockNote.proximaSessao.foco}</p>
            </div>
          </div>
          </div>
        </div>

        {/* Footer aprimorado */}
        <div className="border-t border-gray-200/60 bg-white/95 backdrop-blur-xl">
          {/* Header do footer */}
          <div className="px-8 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-gray-700">Nota processada</span>
                </div>
                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-md">
                  ID: {sessionData.id.slice(-8)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Gerada automaticamente pela IA
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Ações secundárias */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopyNote}
                  className="flex items-center space-x-2 px-5 py-3 border border-gray-200 bg-gray-50 text-gray-700 rounded-2xl hover:bg-gray-100 hover:shadow-md transition-all duration-200 font-medium"
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
                <button className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white rounded-2xl hover:from-[#6366F1] hover:to-[#8B5CF6] transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-semibold">
                  <Download className="w-4 h-4" />
                  <span>Exportar PDF</span>
                </button>
              </div>

              {/* Ações primárias */}
              <div className="flex gap-3">
                {/* Mostrar botão Salvar apenas quando solicitado (após gravação) */}
                {showSaveButton && onSaveSession ? (
                  <button
                    onClick={onSaveSession}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-bold"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Sessão</span>
                  </button>
                ) : null}
                
                <button
                  onClick={onClose}
                  className="px-5 py-3 border border-gray-200 bg-white text-gray-700 rounded-2xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium"
                >
                  {showSaveButton ? 'Descartar' : 'Fechar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteViewModal;
