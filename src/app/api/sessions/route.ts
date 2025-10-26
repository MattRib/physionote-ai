import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { z } from 'zod';

export const runtime = 'nodejs';

type SessionWithPatientAndNote = {
  id: string;
  patientId: string;
  date: Date;
  durationMin: number | null;
  sessionType: string | null;
  specialty: string | null;
  motivation: string | null;
  audioUrl: string | null;
  audioSize: number | null;
  transcription: string | null;
  status: string;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  patient: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
  note: {
    id: string;
    aiGenerated: boolean;
    aiModel: string | null;
  } | null;
};

// Schema de validação para criação de sessão
const SessionCreateSchema = z.object({
  patientId: z.string().min(1, 'ID do paciente é obrigatório'),
  sessionType: z.string().optional(),
  specialty: z.string().optional(),
  motivation: z.string().optional(),
  durationMin: z.number().optional(),
});

// GET /api/sessions - Listar todas as sessões
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const dateRange = searchParams.get('dateRange');
    const search = searchParams.get('search');

    // Construir filtros
    const where: any = {};
    
    if (patientId) {
      where.patientId = patientId;
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }

    // Date range filter
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (dateRange) {
        case 'today':
          where.date = {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          };
          break;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          where.date = {
            gte: yesterday,
            lt: today
          };
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          where.date = {
            gte: weekAgo
          };
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          where.date = {
            gte: monthAgo
          };
          break;
      }
    }

    // Search filter (by patient name)
    if (search && search.trim() !== '') {
      where.patient = {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      };
    }

    // Buscar sessões com informações do paciente
    const sessions = await prisma.session.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        note: {
          select: {
            id: true,
            aiGenerated: true,
            aiModel: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });

    // Transform data to match frontend expectations
    const transformedSessions = sessions.map((session: SessionWithPatientAndNote) => ({
      id: session.id,
      session_datetime: session.date.toISOString(),
      patient_name: session.patient.name,
      patient_id: session.patient.id,
      patient_email: session.patient.email,
      status: session.status,
      is_anonymized: true, // TODO: Add isAnonymized field to schema if needed
      duration_minutes: session.durationMin,
      main_complaint: session.motivation || null,
      note_id: session.note?.id || null,
      note_status: null // Note model doesn't have status field
    }));

    return NextResponse.json(transformedSessions);
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar sessões' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sessions - Criar sessão temporária para processamento
 * 
 * ⚠️ ATENÇÃO: Esta rota cria sessões com status 'recording' ou 'processing'
 * que são TEMPORÁRIAS e usadas apenas para upload de áudio.
 * 
 * Para gravação ao vivo (live recording), NÃO use esta rota.
 * Use apenas /api/sessions/save quando o usuário clicar em "Salvar".
 * 
 * Fluxo correto:
 * 1. Live Recording: Não criar sessão → Processar com /api/sessions/process-temp → Salvar com /api/sessions/save
 * 2. Upload: Criar sessão temporária aqui → Processar → Atualizar ou salvar nova
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let validatedData;
    let audioFile: File | null = null;
    let recordingMode: 'live' | 'upload' = 'live';

    // Verificar se é FormData (upload de arquivo) ou JSON (gravação ao vivo)
    if (contentType.includes('multipart/form-data')) {
      // Processar FormData
      const formData = await req.formData();
      
      const patientId = formData.get('patientId') as string;
      const sessionType = formData.get('sessionType') as string;
      const specialty = formData.get('specialty') as string;
      const motivation = formData.get('motivation') as string;
      recordingMode = (formData.get('recordingMode') as 'live' | 'upload') || 'upload';
      audioFile = formData.get('audio') as File | null;

      // Validar dados básicos
      validatedData = SessionCreateSchema.parse({
        patientId,
        sessionType,
        specialty,
        motivation,
      });

      // Validar arquivo de áudio
      if (!audioFile) {
        return NextResponse.json(
          { error: 'Arquivo de áudio é obrigatório para upload' },
          { status: 400 }
        );
      }

      // Validar tipo de arquivo
      const acceptedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/ogg', 'audio/webm'];
      if (!acceptedTypes.includes(audioFile.type)) {
        return NextResponse.json(
          { error: 'Tipo de arquivo não suportado. Use MP3, WAV, M4A ou OGG.' },
          { status: 400 }
        );
      }

      // Validar tamanho (25MB max)
      const maxSize = 25 * 1024 * 1024;
      if (audioFile.size > maxSize) {
        return NextResponse.json(
          { error: 'Arquivo muito grande. Tamanho máximo: 25MB.' },
          { status: 400 }
        );
      }
    } else {
      // Processar JSON (modo de gravação ao vivo)
      const body = await req.json();
      recordingMode = body.recordingMode || 'live';
      
      // Validar dados
      validatedData = SessionCreateSchema.parse(body);
    }

    // Verificar se o paciente existe
    const patient = await prisma.patient.findUnique({
      where: { id: validatedData.patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      );
    }

    // Criar sessão com status inicial baseado no modo
    const session = await prisma.session.create({
      data: {
        patientId: validatedData.patientId,
        date: new Date(),
        durationMin: validatedData.durationMin,
        sessionType: validatedData.sessionType,
        specialty: validatedData.specialty,
        motivation: validatedData.motivation,
        status: recordingMode === 'upload' ? 'processing' : 'recording',
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Se for upload, salvar o arquivo e iniciar processamento
    if (recordingMode === 'upload' && audioFile) {
      // TODO: Implementar salvamento do arquivo e iniciar processamento
      // 1. Salvar arquivo no storage (filesystem ou cloud)
      // 2. Criar registro de transcrição
      // 3. Iniciar processamento assíncrono (transcrição + geração de nota)
      console.log(`[Audio Upload] Session: ${session.id}, File: ${audioFile.name}, Size: ${audioFile.size} bytes`);
      
      // Por enquanto, apenas log - implementação completa será feita posteriormente
      console.warn('[TODO] Implement audio file storage and processing');
    }

    console.log(`[Session Created] ID: ${session.id}, Patient: ${patient.name}, Mode: ${recordingMode}`);

    return NextResponse.json(
      {
        id: session.id,
        session,
        message: 'Sessão criada com sucesso',
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao criar sessão' },
      { status: 500 }
    );
  }
}
