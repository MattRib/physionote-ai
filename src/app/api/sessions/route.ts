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
    const transformedSessions = sessions.map((session) => ({
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
