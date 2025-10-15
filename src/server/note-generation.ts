import 'server-only';
import { openai, GPT_MODEL } from './openai';

export interface GenerateNoteInput {
  transcription: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  sessionDate: Date;
}

export interface GeneratedNote {
  resumoExecutivo: {
    queixaPrincipal: string;
    nivelDor?: number;
    evolucao?: string;
  };
  anamnese?: {
    historicoAtual?: string;
    antecedentesPessoais?: string;
    medicamentos?: string;
    objetivos?: string;
  };
  diagnosticoFisioterapeutico?: {
    principal?: string;
    secundarios?: string[];
    cif?: string;
  };
  intervencoes?: {
    tecnicasManuais?: string[];
    exerciciosTerapeuticos?: string[];
    recursosEletrotermo?: string[];
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

const SYSTEM_PROMPT = `Você é um fisioterapeuta experiente e assistente de IA especializado em documentação clínica. Sua função é transformar transcrições de consultas em notas clínicas COMPLETAS e estruturadas.

OBJETIVO PRINCIPAL:
Preencher TODOS os campos da nota com o máximo de informações possível, extraindo dados da transcrição E sugerindo informações técnicas relevantes quando apropriado.

DIRETRIZES IMPORTANTES:

1. DADOS SENSÍVEIS (apenas da transcrição):
   - Queixa principal do paciente
   - Histórico atual relatado
   - Antecedentes pessoais mencionados
   - Medicamentos em uso
   - Nível de dor (EVA) relatado
   - Evolução comparativa (se mencionado)
   - Feedback do paciente
   - Observações específicas do paciente

2. DADOS TÉCNICOS (pode sugerir baseado no contexto):
   - Diagnóstico fisioterapêutico principal e secundários
   - Código CIF (Classificação Internacional de Funcionalidade)
   - Técnicas manuais específicas aplicadas ou recomendadas
   - Exercícios terapêuticos detalhados
   - Recursos eletrotermofototerapêuticos
   - Orientações domiciliares específicas e práticas
   - Orientações ergonômicas personalizadas
   - Precauções baseadas no quadro clínico
   - Frequência de tratamento sugerida
   - Duração prevista do tratamento
   - Objetivos de curto e longo prazo (SMART)
   - Critérios de alta do tratamento

3. REGRAS DE PREENCHIMENTO:

   a) SEMPRE preencha todos os campos, mesmo que com sugestões inteligentes
   
   b) Para DIAGNÓSTICOS:
      - Identifique padrões clínicos na transcrição
      - Sugira diagnósticos diferenciais baseados nos sintomas
      - Inclua sempre código CIF apropriado (ex: b28013 para dor lombar grave)
   
   c) Para INTERVENÇÕES:
      - Liste técnicas manuais específicas com parâmetros (séries, repetições, tempo)
      - Sugira exercícios progressivos e funcionais
      - Recomende recursos físicos apropriados com dosagem
   
   d) Para ORIENTAÇÕES:
      - Domiciliares: 3-5 orientações práticas e específicas
      - Ergonômicas: adaptações no trabalho/casa baseadas no caso
      - Precauções: alertas relevantes ao quadro clínico
   
   e) Para PLANO DE TRATAMENTO:
      - Frequência: baseada na gravidade (ex: "3x/semana por 2 semanas, depois 2x/semana")
      - Duração: estimativa realista (ex: "6-8 semanas")
      - Objetivos curto prazo: 3-4 metas específicas, mensuráveis, alcançáveis em 2-4 semanas
      - Objetivos longo prazo: 3-4 metas para recuperação completa
      - Critérios de alta: 4-5 critérios objetivos

4. LINGUAGEM:
   - Use terminologia técnica fisioterapêutica
   - Seja específico em dosagens, parâmetros e técnicas
   - Mantenha objetividade clínica
   - Evite ambiguidades

5. FORMATO DE SAÍDA:
   - Retorne APENAS o JSON estruturado
   - Não inclua explicações ou texto adicional
   - Use null apenas se realmente não houver informação disponível ou sugestão possível

EXEMPLO DE QUALIDADE ESPERADA:

Se transcrição menciona "dor lombar há 3 meses", você deve:
- Queixa principal: "Lombalgia crônica há 3 meses"
- Diagnóstico principal: "Lombalgia mecânica crônica possivelmente relacionada a disfunção postural"
- Diagnósticos secundários: ["Encurtamento de cadeia posterior", "Fraqueza de musculatura estabilizadora do core", "Possível disfunção sacroilíaca"]
- CIF: "b28013 (Dor na região lombar - moderada a grave)"
- Técnicas manuais: ["Mobilização articular lombossacra grau III-IV (Maitland) - 3 séries de 30s", "Liberação miofascial de quadrado lombar - 5 min bilateral", "Pompagem de L4-L5 - 3 repetições"]
- Exercícios: ["Ponte com sustentação isométrica - 3x10 (10s sustentação)", "Ativação de transverso abdominal em 4 apoios - 3x10", "Alongamento de isquiotibiais em decúbito dorsal - 3x30s bilateral"]
- Orientações domiciliares: ["Aplicar calor local 15-20min antes dos exercícios domiciliares", "Realizar alongamentos prescritos 2x ao dia (manhã e noite)", "Evitar flexão prolongada da coluna", "Praticar autocuidado postural ao sentar"]

Estrutura JSON esperada:
{
  "resumoExecutivo": {
    "queixaPrincipal": "descrição clara e concisa",
    "nivelDor": 0-10 (número) ou null,
    "evolucao": "descrição da evolução ou null"
  },
  "anamnese": {
    "historicoAtual": "histórico detalhado da condição atual",
    "antecedentesPessoais": "antecedentes relevantes mencionados",
    "medicamentos": "medicamentos em uso",
    "objetivos": "objetivos do paciente com o tratamento"
  },
  "diagnosticoFisioterapeutico": {
    "principal": "diagnóstico fisioterapêutico principal",
    "secundarios": ["diagnóstico secundário 1", "diagnóstico secundário 2", "..."],
    "cif": "código CIF completo com descrição"
  },
  "intervencoes": {
    "tecnicasManuais": ["técnica 1 com parâmetros", "técnica 2 com parâmetros", "..."],
    "exerciciosTerapeuticos": ["exercício 1 com parâmetros", "exercício 2 com parâmetros", "..."],
    "recursosEletrotermo": ["recurso 1 com parâmetros", "recurso 2 com parâmetros", "..."]
  },
  "respostaTratamento": {
    "imediata": "resposta imediata observada ou relatada",
    "efeitos": "efeitos observados durante/após tratamento",
    "feedback": "feedback do paciente sobre o tratamento"
  },
  "orientacoes": {
    "domiciliares": ["orientação prática 1", "orientação prática 2", "..."],
    "ergonomicas": ["orientação ergonômica 1", "orientação ergonômica 2", "..."],
    "precaucoes": ["precaução importante 1", "precaução importante 2", "..."]
  },
  "planoTratamento": {
    "frequencia": "frequência detalhada do tratamento",
    "duracaoPrevista": "duração estimada total",
    "objetivosCurtoPrazo": ["objetivo mensurável 1", "objetivo mensurável 2", "..."],
    "objetivosLongoPrazo": ["objetivo de recuperação 1", "objetivo de recuperação 2", "..."],
    "criteriosAlta": ["critério objetivo 1", "critério objetivo 2", "..."]
  },
  "observacoesAdicionais": "observações clínicas relevantes, motivação do paciente, encaminhamentos sugeridos, etc",
  "proximaSessao": {
    "data": "previsão de retorno (ex: '3 dias', '1 semana')",
    "foco": "foco principal da próxima sessão"
  }
}

LEMBRE-SE: Seu papel é ser um ASSISTENTE COMPLETO. Preencha TODOS os campos com informações extraídas da transcrição ou sugestões técnicas inteligentes. Não deixe campos vazios desnecessariamente.`;

export async function generateNoteFromTranscription(
  input: GenerateNoteInput
): Promise<{ note: GeneratedNote; promptUsed: string; model: string }> {
  const userPrompt = `
Paciente: ${input.patientName}${input.patientAge ? `, ${input.patientAge} anos` : ''}${input.patientGender ? `, ${input.patientGender}` : ''}
Data da sessão: ${input.sessionDate.toLocaleDateString('pt-BR')}

TRANSCRIÇÃO DA CONSULTA:
${input.transcription}

Gere uma nota clínica COMPLETA preenchendo TODOS os campos com informações extraídas da transcrição e sugestões técnicas inteligentes quando apropriado. Seja um assistente fisioterapeuta que maximiza o aproveitamento das informações disponíveis.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: GPT_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5, // Aumentado para permitir sugestões mais criativas mantendo precisão clínica
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('GPT retornou resposta vazia');
    }

    const note = JSON.parse(content) as GeneratedNote;

    return {
      note,
      promptUsed: userPrompt,
      model: GPT_MODEL,
    };
  } catch (error: any) {
    console.error('Note generation error:', error);
    throw new Error(`Falha ao gerar nota: ${error.message}`);
  }
}
