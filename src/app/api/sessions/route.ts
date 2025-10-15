import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { z } from 'zod';

export const runtime = 'nodejs';

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

    // Construir filtros
    const where: any = {};
    if (patientId) {
      where.patientId = patientId;
    }
    if (status) {
      where.status = status;
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
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(sessions);
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar sessões' },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Criar nova sessão
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validar dados
    const validatedData = SessionCreateSchema.parse(body);

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

    // Criar sessão com status inicial "recording"
    // Os campos sessionType, specialty e motivation estão definidos no schema.prisma
    const session = await prisma.session.create({
      data: {
        patientId: validatedData.patientId,
        date: new Date(),
        durationMin: validatedData.durationMin,
        sessionType: validatedData.sessionType,
        specialty: validatedData.specialty,
        motivation: validatedData.motivation,
        status: 'recording',
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

    console.log(`[Session Created] ID: ${session.id}, Patient: ${patient.name}`);

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
