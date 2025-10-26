import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';

export const runtime = 'nodejs';

type SessionWithNote = {
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
  note: {
    id: string;
    sessionId: string;
    contentJson: string;
    aiGenerated: boolean;
    aiModel: string | null;
    aiPromptUsed: string | null;
    reviewedBy: string | null;
    reviewedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

/**
 * GET /api/patients/[id]/record
 * 
 * Retorna o prontuário completo do paciente incluindo:
 * - Dados cadastrais completos
 * - Todas as sessões ordenadas por data (mais recente primeiro)
 * - Notas clínicas de cada sessão parseadas do JSON
 * - Estatísticas do tratamento
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const patientId = params.id;

    // Busca paciente com todas as sessões e notas
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        sessions: {
          include: {
            note: true,
          },
          orderBy: {
            date: 'desc', // Mais recente primeiro
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      );
    }

    // Processa as sessões para incluir notas parseadas
    const sessionsWithParsedNotes = patient.sessions.map((session: SessionWithNote) => {
      let parsedNote = null;

      if (session.note && session.note.contentJson) {
        try {
          parsedNote = JSON.parse(session.note.contentJson);
        } catch (error) {
          console.error(`Erro ao parsear nota da sessão ${session.id}:`, error);
          parsedNote = null;
        }
      }

      return {
        id: session.id,
        date: session.date,
        durationMin: session.durationMin,
        sessionType: session.sessionType,
        specialty: session.specialty,
        motivation: session.motivation,
        status: session.status,
        transcription: session.transcription,
        note: parsedNote
          ? {
              id: session.note!.id,
              aiGenerated: session.note!.aiGenerated,
              aiModel: session.note!.aiModel,
              createdAt: session.note!.createdAt,
              updatedAt: session.note!.updatedAt,
              content: parsedNote, // JSON parseado
            }
          : null,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      };
    });

    // Calcula estatísticas
    const totalSessions = patient.sessions.length;
    const completedSessions = patient.sessions.filter(
      (s: SessionWithNote) => s.status === 'completed'
    ).length;
    const totalDuration = patient.sessions.reduce(
      (acc: number, s: SessionWithNote) => acc + (s.durationMin || 0),
      0
    );

    // Monta resposta do prontuário
    const record = {
      patient: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        cpf: patient.cpf,
        birthDate: patient.birthDate,
        gender: patient.gender,
        address: {
          street: patient.street,
          number: patient.number,
          complement: patient.complement,
          neighborhood: patient.neighborhood,
          city: patient.city,
          state: patient.state,
          zipCode: patient.zipCode,
        },
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      },
      statistics: {
        totalSessions,
        completedSessions,
        totalDurationMinutes: totalDuration,
        averageDurationMinutes:
          totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0,
        firstSessionDate:
          patient.sessions.length > 0
            ? patient.sessions[patient.sessions.length - 1].date
            : null,
        lastSessionDate:
          patient.sessions.length > 0 ? patient.sessions[0].date : null,
      },
      sessions: sessionsWithParsedNotes,
    };

    return NextResponse.json(record);
  } catch (error: any) {
    console.error('Error fetching patient record:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar prontuário do paciente' },
      { status: 500 }
    );
  }
}
