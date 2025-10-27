import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { transcribeAudio } from '@/server/transcription';
import { generateNoteFromTranscription } from '@/server/note-generation';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutos (Whisper + GPT podem demorar)

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const sessionId = params.id;

    // Busca sessão com paciente
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { patient: true },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      );
    }

    if (!session.audioUrl) {
      return NextResponse.json(
        { error: 'Sessão não possui áudio' },
        { status: 400 }
      );
    }

    // audioUrl pode ser uma URL do Cloudinary ou caminho local
    // transcribeAudio() detecta automaticamente e processa corretamente
    const audioPathOrUrl = session.audioUrl;

    // Atualiza status para "transcribing"
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: 'transcribing' },
    });

    console.log(`[${sessionId}] Iniciando transcrição...`);

    // 1. Transcrição com Whisper
    const transcription = await transcribeAudio(audioPathOrUrl, 'pt');

    console.log(`[${sessionId}] Transcrição concluída: ${transcription.text.substring(0, 100)}...`);

    // Salva transcrição no banco
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        transcription: transcription.text,
        status: 'generating',
      },
    });

    console.log(`[${sessionId}] Gerando nota com IA...`);

    // 2. Geração de nota com GPT-4
    const { note, promptUsed, model } = await generateNoteFromTranscription({
      transcription: transcription.text,
      patientName: session.patient.name,
      patientAge: session.patient.birthDate
        ? Math.floor(
            (Date.now() - session.patient.birthDate.getTime()) /
              (365.25 * 24 * 60 * 60 * 1000)
          )
        : undefined,
      patientGender: session.patient.gender || undefined,
      sessionDate: session.date,
    });

    console.log(`[${sessionId}] Nota gerada com sucesso`);

    // 3. Salva nota no banco
    const createdNote = await prisma.note.upsert({
      where: { sessionId },
      create: {
        sessionId,
        contentJson: JSON.stringify(note),
        aiGenerated: true,
        aiModel: model,
        aiPromptUsed: promptUsed,
      },
      update: {
        contentJson: JSON.stringify(note),
        aiGenerated: true,
        aiModel: model,
        aiPromptUsed: promptUsed,
      },
    });

    // 4. Atualiza sessão para "completed"
    const finalSession = await prisma.session.update({
      where: { id: sessionId },
      data: { status: 'completed' },
      include: { note: true, patient: true },
    });

    console.log(`[${sessionId}] Processamento completo!`);

    return NextResponse.json({
      message: 'Processamento concluído com sucesso',
      session: finalSession,
      transcription: transcription.text,
      note: JSON.parse(createdNote.contentJson),
    });
  } catch (error: any) {
    console.error('Processing error:', error);

    const params = await context.params;
    // Marca sessão como erro
    await prisma.session.update({
      where: { id: params.id },
      data: {
        status: 'error',
        errorMessage: error.message,
      },
    });

    return NextResponse.json(
      { error: error.message || 'Erro ao processar sessão' },
      { status: 500 }
    );
  }
}
