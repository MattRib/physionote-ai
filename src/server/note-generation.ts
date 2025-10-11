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

const SYSTEM_PROMPT = `Você é um assistente especializado em fisioterapia que transforma transcrições de consultas em notas clínicas estruturadas.

IMPORTANTE:
- Extraia APENAS informações PRESENTES na transcrição
- NÃO invente ou assuma dados não mencionados
- Use linguagem técnica e objetiva
- Mantenha sigilo profissional
- Retorne APENAS o JSON, sem texto adicional

Estrutura JSON esperada:
{
  "resumoExecutivo": {
    "queixaPrincipal": "descrição breve",
    "nivelDor": 0-10 ou null,
    "evolucao": "melhora/estável/piora ou null"
  },
  "anamnese": {
    "historicoAtual": "texto ou null",
    "antecedentesPessoais": "texto ou null",
    "medicamentos": "texto ou null",
    "objetivos": "texto ou null"
  },
  "diagnosticoFisioterapeutico": {
    "principal": "texto ou null",
    "secundarios": ["item1", "item2"] ou [],
    "cif": "código CIF ou null"
  },
  "intervencoes": {
    "tecnicasManuais": ["técnica1", "técnica2"] ou [],
    "exerciciosTerapeuticos": ["exercício1"] ou [],
    "recursosEletrotermo": ["recurso1"] ou []
  },
  "respostaTratamento": {
    "imediata": "descrição ou null",
    "efeitos": "descrição ou null",
    "feedback": "descrição ou null"
  },
  "orientacoes": {
    "domiciliares": ["orientação1"] ou [],
    "ergonomicas": ["orientação1"] ou [],
    "precaucoes": ["precaução1"] ou []
  },
  "planoTratamento": {
    "frequencia": "ex: 2x/semana ou null",
    "duracaoPrevista": "ex: 4 semanas ou null",
    "objetivosCurtoPrazo": ["objetivo1"] ou [],
    "objetivosLongoPrazo": ["objetivo1"] ou [],
    "criteriosAlta": ["critério1"] ou []
  },
  "observacoesAdicionais": "texto livre ou null",
  "proximaSessao": {
    "data": "ISO date string ou null",
    "foco": "texto ou null"
  }
}`;

export async function generateNoteFromTranscription(
  input: GenerateNoteInput
): Promise<{ note: GeneratedNote; promptUsed: string; model: string }> {
  const userPrompt = `
Paciente: ${input.patientName}${input.patientAge ? `, ${input.patientAge} anos` : ''}${input.patientGender ? `, ${input.patientGender}` : ''}
Data da sessão: ${input.sessionDate.toLocaleDateString('pt-BR')}

TRANSCRIÇÃO DA CONSULTA:
${input.transcription}

Gere a nota clínica estruturada em JSON com base APENAS nas informações presentes na transcrição acima.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: GPT_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // baixa criatividade, mais fiel ao texto
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
