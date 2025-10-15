import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { z } from 'zod';

// Schema de validação
const updatePatientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  // Address fields
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

// GET /api/patients/:id - Buscar paciente por ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        sessions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      );
    }

    // Calcular totalSessions e lastSession
    const totalSessions = await prisma.session.count({
      where: { patientId: id },
    });

    const lastSession = patient.sessions[0]?.createdAt.toISOString().split('T')[0];

    return NextResponse.json({
      ...patient,
      totalSessions,
      lastSession,
      sessions: undefined, // Remove sessions do response
    });
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar paciente' },
      { status: 500 }
    );
  }
}

// PUT /api/patients/:id - Atualizar paciente
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Validar dados
    const validatedData = updatePatientSchema.parse(body);

    // Verificar se paciente existe
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar paciente
    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        cpf: validatedData.cpf,
        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : undefined,
        gender: validatedData.gender,
        street: validatedData.street,
        number: validatedData.number,
        complement: validatedData.complement,
        neighborhood: validatedData.neighborhood,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
      },
    });

    // Calcular totalSessions e lastSession
    const totalSessions = await prisma.session.count({
      where: { patientId: id },
    });

    const lastSessionRecord = await prisma.session.findFirst({
      where: { patientId: id },
      orderBy: { createdAt: 'desc' },
    });

    const lastSession = lastSessionRecord?.createdAt.toISOString().split('T')[0];

    return NextResponse.json({
      ...updatedPatient,
      totalSessions,
      lastSession,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Erro ao atualizar paciente:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar paciente' },
      { status: 500 }
    );
  }
}

// DELETE /api/patients/:id - Deletar paciente
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Verificar se paciente existe
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      );
    }

    // Deletar paciente (sessions serão deletadas em cascata)
    await prisma.patient.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Paciente deletado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar paciente' },
      { status: 500 }
    );
  }
}
