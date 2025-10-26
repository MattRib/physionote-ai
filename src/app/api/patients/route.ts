import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { z } from 'zod';

export const runtime = 'nodejs';

type PatientWithSessions = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  birthDate: Date | null;
  gender: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  sessions: {
    date: Date;
  }[];
};

const PatientCreate = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  birthDate: z.string().optional(), // ISO
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

export async function GET() {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      sessions: {
        orderBy: { date: 'desc' },
        take: 1,
        select: {
          date: true,
        },
      },
    },
  });

  // Transformar dados para incluir totalSessions e lastSession
  const patientsWithStats = await Promise.all(
    patients.map(async (patient: PatientWithSessions) => {
      const totalSessions = await prisma.session.count({
        where: { patientId: patient.id },
      });

      const lastSession = patient.sessions[0]?.date.toISOString() || null;

      return {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        cpf: patient.cpf,
        birthDate: patient.birthDate,
        gender: patient.gender,
        street: patient.street,
        number: patient.number,
        complement: patient.complement,
        neighborhood: patient.neighborhood,
        city: patient.city,
        state: patient.state,
        zipCode: patient.zipCode,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
        totalSessions,
        lastSession,
      };
    })
  );

  return NextResponse.json(patientsWithStats);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = PatientCreate.parse(body);
    const patient = await prisma.patient.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        gender: data.gender,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
    });
    return NextResponse.json(patient, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Invalid data' }, { status: 400 });
  }
}