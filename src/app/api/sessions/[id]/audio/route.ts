import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { uploadAudioToCloudinary, isCloudinaryConfigured } from '@/server/cloudinary';
import { MAX_AUDIO_SIZE } from '@/server/openai';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 segundos de timeout

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const sessionId = params.id;

    // Verifica se a sessão existe
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      );
    }

    // Pega o arquivo do FormData
    const formData = await req.formData();
    const file = formData.get('audio') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo de áudio não fornecido' },
        { status: 400 }
      );
    }

    // Valida tamanho
    if (file.size > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Máximo: ${MAX_AUDIO_SIZE / 1024 / 1024}MB` },
        { status: 413 }
      );
    }

    // Valida tipo
    const validTypes = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/x-m4a'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato de áudio não suportado' },
        { status: 400 }
      );
    }

    // Verifica se Cloudinary está configurado
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: 'Cloudinary não está configurado. Verifique as variáveis de ambiente.' },
        { status: 500 }
      );
    }

    // Converte para Buffer e faz upload para Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cloudinaryResult = await uploadAudioToCloudinary(buffer, file.name);

    // Atualiza sessão com URL do Cloudinary
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        audioUrl: cloudinaryResult.secureUrl,
        audioSize: cloudinaryResult.size,
        status: 'transcribing',
      },
    });

    return NextResponse.json({
      message: 'Áudio enviado com sucesso',
      session: updatedSession,
    });
  } catch (error: any) {
    console.error('Audio upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar áudio' },
      { status: 500 }
    );
  }
}
