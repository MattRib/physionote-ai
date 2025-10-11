import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { z } from 'zod';

export const runtime = 'nodejs';

const SessionCreate = z.object({
  date: z.string().optional(), // ISO
  durationMin: z.number().int().min(1).optional(),
});

export async function GET(_req: Request, context: any) {
  const id: string = context?.params?.id;
  const sessions = await prisma.session.findMany({
    where: { patientId: id },
    include: { note: true },
    orderBy: { date: 'desc' },
  });
  return NextResponse.json(sessions);
}

export async function POST(req: Request, context: any) {
  try {
    const id: string = context?.params?.id;
    const body = await req.json();
    const data = SessionCreate.parse(body);
    const session = await prisma.session.create({
      data: {
        patientId: id,
        date: data.date ? new Date(data.date) : undefined,
        durationMin: data.durationMin,
      },
    });
    return NextResponse.json(session, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Invalid data' }, { status: 400 });
  }
}