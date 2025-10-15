import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { z } from 'zod';

export const runtime = 'nodejs';

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
  const patients = await prisma.patient.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(patients);
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