import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutos

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/sessions/process-temp
 * 
 * Processa áudio temporariamente SEM criar registro no banco de dados.
 * Usado para gerar transcrição e nota que serão revisadas antes do salvamento.
 */
export async function POST(req: NextRequest) {
  let tempAudioPath: string | null = null;

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const patientId = formData.get('patientId') as string;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'Arquivo de áudio é obrigatório' },
        { status: 400 }
      );
    }

    if (!patientId) {
      return NextResponse.json(
        { error: 'ID do paciente é obrigatório' },
        { status: 400 }
      );
    }

    console.log('[Process Temp] Starting temporary processing...');
    console.log(`[Process Temp] Audio: ${audioFile.name}, Size: ${(audioFile.size / 1024 / 1024).toFixed(2)}MB`);

    // 1. Salvar arquivo temporariamente
    const tempDir = path.join(process.cwd(), 'temp');
    await mkdir(tempDir, { recursive: true });
    
    const timestamp = Date.now();
    const tempFileName = `temp-audio-${timestamp}.webm`;
    tempAudioPath = path.join(tempDir, tempFileName);

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(tempAudioPath, buffer);

    console.log('[Process Temp] Audio saved temporarily');

    // 2. Transcrever com Whisper
    console.log('[Process Temp] Starting Whisper transcription...');
    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempAudioPath),
      model: 'whisper-1',
      language: 'pt',
      response_format: 'verbose_json',
    });

    const transcriptionText = transcription.text;
    console.log('[Process Temp] Transcription completed:', transcriptionText.substring(0, 100) + '...');

    // 3. Gerar nota clínica com GPT-4
    console.log('[Process Temp] Generating clinical note with GPT-4...');
    
    const notePrompt = `Você é um assistente de inteligência artificial especializado em documentação clínica fisioterapêutica.

Sua tarefa é analisar a transcrição de uma sessão de fisioterapia e gerar uma nota clínica estruturada seguindo as melhores práticas da profissão.

TRANSCRIÇÃO DA SESSÃO:
"""
${transcriptionText}
"""

INSTRUÇÕES:
1. Extraia SOMENTE informações que foram claramente mencionadas na transcrição
2. Se alguma informação não foi mencionada, deixe o campo vazio ou use "Não relatado"
3. Seja objetivo e use terminologia técnica apropriada
4. Organize as informações de forma lógica e profissional

Gere uma nota clínica estruturada no seguinte formato JSON:

{
  "resumoExecutivo": {
    "queixaPrincipal": "descrição da queixa principal",
    "nivelDor": número de 0-10,
    "evolucao": "descrição da evolução desde última sessão"
  },
  "anamnese": {
    "historicoAtual": "descrição do histórico atual",
    "antecedentesPessoais": "antecedentes relevantes",
    "medicamentos": "medicamentos em uso",
    "objetivos": "objetivos do paciente"
  },
  "diagnosticoFisioterapeutico": {
    "principal": "diagnóstico principal",
    "secundarios": ["diagnósticos secundários"],
    "cif": "classificação CIF se mencionada"
  },
  "intervencoes": {
    "tecnicasManuais": ["técnicas manuais aplicadas"],
    "exerciciosTerapeuticos": ["exercícios realizados"],
    "recursosEletrotermofototerapeticos": ["recursos utilizados"]
  },
  "respostaTratamento": {
    "imediata": "resposta imediata observada",
    "efeitos": "efeitos relatados",
    "feedback": "feedback do paciente"
  },
  "orientacoes": {
    "domiciliares": ["orientações para casa"],
    "ergonomicas": ["orientações ergonômicas"],
    "precaucoes": ["precauções e contra-indicações"]
  },
  "planoTratamento": {
    "frequencia": "frequência recomendada",
    "duracaoPrevista": "duração prevista do tratamento",
    "objetivosCurtoPrazo": ["objetivos de curto prazo"],
    "objetivosLongoPrazo": ["objetivos de longo prazo"],
    "criteriosAlta": ["critérios para alta"]
  },
  "observacoesAdicionais": "observações relevantes",
  "proximaSessao": {
    "data": "data ou período sugerido",
    "foco": "foco da próxima sessão"
  }
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente especializado em documentação clínica fisioterapêutica. Retorne sempre JSON válido.',
        },
        {
          role: 'user',
          content: notePrompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const noteContent = completion.choices[0].message.content;
    const note = JSON.parse(noteContent || '{}');

    console.log('[Process Temp] Clinical note generated successfully');

    // 4. Limpar arquivo temporário
    if (tempAudioPath) {
      await unlink(tempAudioPath);
      console.log('[Process Temp] Temporary file deleted');
    }

    // 5. Retornar dados processados (SEM salvar no banco)
    return NextResponse.json({
      success: true,
      transcription: transcriptionText,
      note: note,
      message: 'Processamento temporário concluído. Dados não foram salvos no banco.',
    });

  } catch (error: any) {
    console.error('[Process Temp] Error:', error);

    // Limpar arquivo temporário em caso de erro
    if (tempAudioPath) {
      try {
        await unlink(tempAudioPath);
      } catch (e) {
        console.error('[Process Temp] Error deleting temp file:', e);
      }
    }

    return NextResponse.json(
      { 
        error: error.message || 'Erro ao processar áudio temporariamente',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
