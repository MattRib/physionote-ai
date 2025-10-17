import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export const runtime = 'nodejs';

/**
 * POST /api/sessions/save
 * 
 * Cria uma nova sessão completa no banco de dados com status 'completed'.
 * ESTA É A ÚNICA ROTA QUE CRIA REGISTROS NO PRONTUÁRIO.
 * 
 * Chamada APENAS quando o usuário clica em "Salvar sessão" após revisar a nota.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const patientId = formData.get('patientId') as string;
    const sessionType = formData.get('sessionType') as string;
    const specialty = formData.get('specialty') as string;
    const durationMin = parseInt(formData.get('durationMin') as string);
    const transcription = formData.get('transcription') as string;
    const noteJson = formData.get('note') as string;
    const audioFile = formData.get('audio') as File | null;

    // Validações
    if (!patientId) {
      return NextResponse.json(
        { error: 'ID do paciente é obrigatório' },
        { status: 400 }
      );
    }

    if (!transcription) {
      return NextResponse.json(
        { error: 'Transcrição é obrigatória' },
        { status: 400 }
      );
    }

    if (!noteJson) {
      return NextResponse.json(
        { error: 'Nota clínica é obrigatória' },
        { status: 400 }
      );
    }

    console.log('[Save Session] Starting save process...');
    console.log(`[Save Session] Patient ID: ${patientId}, Duration: ${durationMin}min`);

    // Verificar se paciente existe
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      );
    }

    let audioUrl: string | null = null;
    let audioSize: number | null = null;

    // Salvar áudio se fornecido
    if (audioFile) {
      const audioDir = path.join(process.cwd(), 'uploads', 'audio');
      await mkdir(audioDir, { recursive: true });

      const timestamp = Date.now();
      const fileName = `${patientId}-${timestamp}.webm`;
      const filePath = path.join(audioDir, fileName);

      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await writeFile(filePath, buffer);

      audioUrl = `/uploads/audio/${fileName}`;
      audioSize = audioFile.size;

      console.log('[Save Session] Audio saved:', audioUrl);
    }

    // Criar sessão no banco de dados com status 'completed'
    const session = await prisma.session.create({
      data: {
        patientId,
        date: new Date(),
        durationMin,
        sessionType,
        specialty,
        audioUrl,
        audioSize,
        transcription,
        status: 'completed', // 👈 STATUS FINAL - Visível no prontuário
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('[Save Session] Session created:', session.id);

    // Criar nota clínica vinculada à sessão
    const note = await prisma.note.create({
      data: {
        sessionId: session.id,
        contentJson: noteJson,
        aiGenerated: true,
        aiModel: 'gpt-4o',
        aiPromptUsed: 'Geração de nota clínica fisioterapêutica estruturada',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('[Save Session] Note created:', note.id);
    console.log('[Save Session] ✅ Session saved successfully in patient record');

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      noteId: note.id,
      message: 'Sessão salva com sucesso no prontuário do paciente',
    }, { status: 201 });

  } catch (error: any) {
    console.error('[Save Session] Error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao salvar sessão',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
