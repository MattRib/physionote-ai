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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up-modal">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5A9BCF] to-[#4A8BBF] p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Nota de Evolução</h2>
                <p className="text-blue-100 text-sm">Resumo Inteligente da Sessão</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Resumo Executivo */}
          <div className="space-y-2">
            <SectionHeader id="resumo" icon={Activity} title="Resumo Executivo" color="bg-[#5A9BCF]" />
            {expandedSections.has('resumo') && (
              <div className="p-4 space-y-4 animate-fade-in">
                <div className="bg-blue-50 border-l-4 border-[#5A9BCF] p-4 rounded-r-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-[#5A9BCF] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#333333] mb-1">Queixa Principal</div>
                      <p className="text-[#666666]">{mockNote.resumoExecutivo.queixaPrincipal}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="text-sm text-red-600 font-medium mb-1">Nível de Dor (EVA)</div>
                    <div className="text-3xl font-bold text-red-600">{mockNote.resumoExecutivo.nivelDor}/10</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-sm text-green-600 font-medium mb-1">Evolução</div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                      <span className="text-lg font-semibold text-green-600">{mockNote.resumoExecutivo.evolucao}</span>
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
                  <h4 className="font-semibold text-[#333333] mb-2">Histórico Atual</h4>
                  <p className="text-[#666666] leading-relaxed">{mockNote.anamnese.historicoAtual}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333] mb-2">Antecedentes Pessoais</h4>
                  <p className="text-[#666666]">{mockNote.anamnese.antecedentesPessoais}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333] mb-2">Medicamentos em Uso</h4>
                  <p className="text-[#666666]">{mockNote.anamnese.medicamentos}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333] mb-2">Objetivos do Paciente</h4>
                  <p className="text-[#666666]">{mockNote.anamnese.objetivos}</p>
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
                  <div className="font-semibold text-[#333333] mb-1">Diagnóstico Principal</div>
                  <p className="text-[#666666] text-lg">{mockNote.diagnosticoFisioterapeutico.principal}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333] mb-2">Diagnósticos Secundários</h4>
                  <ul className="space-y-2">
                    {mockNote.diagnosticoFisioterapeutico.secundario.map((diag, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-[#666666]">{diag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-[#666666]">CIF (Classificação Internacional de Funcionalidade)</div>
                  <p className="text-[#333333] mt-1">{mockNote.diagnosticoFisioterapeutico.cif}</p>
                </div>
              </div>
            )}
          </div>

          {/* Intervenções Realizadas */}
          <div className="space-y-2">
            <SectionHeader id="intervencoes" icon={Activity} title="Intervenções Realizadas" color="bg-[#5A9BCF]" />
            {expandedSections.has('intervencoes') && (
              <div className="p-4 space-y-4 animate-fade-in">
                <div>
                  <h4 className="font-semibold text-[#333333] mb-3 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Técnicas Manuais</span>
                  </h4>
                  <ul className="space-y-2 ml-4">
                    {mockNote.intervencoes.tecnicasManuais.map((tecnica, index) => (
                      <li key={index} className="text-[#666666] leading-relaxed">• {tecnica}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333] mb-3 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Exercícios Terapêuticos</span>
                  </h4>
                  <ul className="space-y-2 ml-4">
                    {mockNote.intervencoes.exerciciosTerapeuticos.map((exercicio, index) => (
                      <li key={index} className="text-[#666666] leading-relaxed">• {exercicio}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333] mb-3 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Recursos Eletrotermofototerapêuticos</span>
                  </h4>
                  <ul className="space-y-2 ml-4">
                    {mockNote.intervencoes.recursosEletrotermofototerapeticos.map((recurso, index) => (
                      <li key={index} className="text-[#666666] leading-relaxed">• {recurso}</li>
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
                  <p className="text-[#666666]">{mockNote.respostaTratamento.imediata}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333] mb-2">Efeitos Adversos</h4>
                  <p className="text-[#666666]">{mockNote.respostaTratamento.efeitos}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333] mb-2">Feedback do Paciente</h4>
                  <p className="text-[#666666]">{mockNote.respostaTratamento.feedback}</p>
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
                  <h4 className="font-semibold text-[#333333] mb-3">Exercícios Domiciliares</h4>
                  <ul className="space-y-2">
                    {mockNote.orientacoes.domiciliares.map((orientacao, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-[#666666]">{orientacao}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#333333] mb-3">Orientações Ergonômicas</h4>
                  <ul className="space-y-2">
                    {mockNote.orientacoes.ergonomicas.map((orientacao, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-[#666666]">{orientacao}</span>
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
                      <li key={index} className="text-[#666666]">• {precaucao}</li>
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
                    <p className="text-[#333333]">{mockNote.planoTratamento.frequencia}</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <div className="text-sm text-teal-600 font-medium mb-1">Duração Prevista</div>
                    <p className="text-[#333333]">{mockNote.planoTratamento.duracaoPrevista}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#333333] mb-3">Objetivos de Curto Prazo (2-3 semanas)</h4>
                  <ul className="space-y-2">
                    {mockNote.planoTratamento.objetivosCurtoPrazo.map((objetivo, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-[#666666] mt-0.5">{objetivo}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-[#333333] mb-3">Objetivos de Longo Prazo (6-12 semanas)</h4>
                  <ul className="space-y-2">
                    {mockNote.planoTratamento.objetivosLongoPrazo.map((objetivo, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-[#666666] mt-0.5">{objetivo}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#333333] mb-3">Critérios de Alta</h4>
                  <ul className="space-y-2">
                    {mockNote.planoTratamento.criteriosAlta.map((criterio, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-[#666666]">{criterio}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Observações Adicionais */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-[#333333] mb-2 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#5A9BCF]" />
              <span>Observações Adicionais</span>
            </h4>
            <p className="text-[#666666] leading-relaxed">{mockNote.observacoesAdicionais}</p>
          </div>

          {/* Próxima Sessão */}
          <div className="bg-gradient-to-r from-[#5A9BCF]/10 to-[#4A8BBF]/10 p-4 rounded-lg border-2 border-[#5A9BCF]/20">
            <h4 className="font-semibold text-[#333333] mb-2 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#5A9BCF]" />
              <span>Próxima Sessão</span>
            </h4>
            <div className="space-y-1">
              <p className="text-[#666666]"><strong>Retorno em:</strong> {mockNote.proximaSessao.data}</p>
              <p className="text-[#666666]"><strong>Foco:</strong> {mockNote.proximaSessao.foco}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-[#666666]">
            <span className="font-medium">ID da Sessão:</span> {sessionData.id}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCopyNote}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-[#666666] rounded-lg hover:bg-gray-100 transition-colors"
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
            
            {/* Mostrar botão Salvar apenas quando solicitado (após gravação) */}
            {showSaveButton && onSaveSession ? (
              <button
                onClick={onSaveSession}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg font-semibold"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Sessão</span>
              </button>
            ) : null}
            
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-[#666666] rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showSaveButton ? 'Descartar' : 'Fechar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteViewModal;
