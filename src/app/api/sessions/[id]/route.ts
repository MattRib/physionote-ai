import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';

export const runtime = 'nodejs';

// GET /api/sessions/[id] - Buscar sessão por ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            birthDate: true,
            gender: true,
          },
        },
        note: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error: any) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar sessão' },
      { status: 500 }
    );
  }
}

// DELETE /api/sessions/[id] - Deletar sessão
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Verificar se sessão existe
    const existingSession = await prisma.session.findUnique({
      where: { id },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      );
    }

    // Deletar sessão (nota será deletada em cascata se configurado)
    await prisma.session.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Sessão deletada com sucesso' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao deletar sessão' },
      { status: 500 }
    );
  }
}

// PATCH /api/sessions/[id] - Atualizar sessão
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Verificar se sessão existe
    const existingSession = await prisma.session.findUnique({
      where: { id },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      );
    }

    // Atualizar apenas campos permitidos
    const updateData: any = {};
    
    if (body.durationMin !== undefined) {
      updateData.durationMin = body.durationMin;
    }
    if (body.status !== undefined) {
      updateData.status = body.status;
    }
    if (body.errorMessage !== undefined) {
      updateData.errorMessage = body.errorMessage;
    }

    const updatedSession = await prisma.session.update({
      where: { id },
      data: updateData,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        note: true,
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error: any) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar sessão' },
      { status: 500 }
    );
  }
}
