'use client';

import React from 'react';
import {
  Edit,
  Trash2,
  FileText,
  Phone,
  Mail,
  CalendarCheck,
  ClipboardList
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Patient } from './PatientsView';

interface PatientsListProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: string) => void;
}

const PatientsList: React.FC<PatientsListProps> = ({ patients, onEdit, onDelete }) => {
  const router = useRouter();

  const handleViewRecord = (patientId: string) => {
    router.push(`/dashboard/patients/${patientId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderBadge = (classes: string, icon: React.ReactNode, label: string) => (
    <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${classes}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  const getInitials = (name: string) => {
    if (!name) return 'PT';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  if (patients.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#C7D2FE] bg-white/70 px-10 py-16 text-center shadow-[0_22px_60px_-40px_rgba(79,70,229,0.45)]">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#A5B4FC] to-[#818CF8] text-3xl text-white shadow-[0_18px_40px_-24px_rgba(79,70,229,0.55)]">
          👥
        </div>
        <h3 className="text-xl font-semibold text-[#111827]">Nenhum paciente encontrado</h3>
        <p className="mt-2 text-sm text-[#6B7280]">
          Clique em “Novo Paciente” e cadastre seu primeiro contato.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div
          key={patient.id}
          className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/95 px-6 py-5 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_32px_70px_-48px_rgba(79,70,229,0.45)] md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#FDE68A] via-[#FBCFE8] to-[#A5B4FC] p-[2px] shadow-[0_16px_38px_-26px_rgba(244,114,182,0.55)]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-[#1E293B]">
                {getInitials(patient.name)}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#0F172A]">{patient.name}</h3>
              <p className="text-sm text-[#64748B]">{patient.cpf || 'CPF não informado'}</p>
            </div>
          </div>

          <div className="flex flex-1 flex-wrap items-center gap-3 md:justify-end">
            {renderBadge(
              'bg-[#FEF3C7] text-[#B45309]',
              <Phone className="h-4 w-4" />,
              patient.phone || 'Sem telefone'
            )}
            {renderBadge(
              'bg-[#FCE7F3] text-[#BE185D]',
              <Mail className="h-4 w-4" />,
              patient.email || 'Sem e-mail'
            )}
            {renderBadge(
              'bg-[#DBEAFE] text-[#1E3A8A]',
              <ClipboardList className="h-4 w-4" />,
              patient.totalSessions ? `${patient.totalSessions} sessões` : 'Sem sessões'
            )}
            {renderBadge(
              patient.lastSession ? 'bg-[#D1FAE5] text-[#047857]' : 'bg-[#E2E8F0] text-[#475569]',
              <CalendarCheck className="h-4 w-4" />,
              patient.lastSession ? `Última: ${formatDate(patient.lastSession)}` : 'Sem sessões recentes'
            )}
          </div>

          <div className="flex items-center gap-3 md:ml-4">
            <button
              onClick={() => handleViewRecord(patient.id)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#E0E7FF]"
              title="Prontuário"
            >
              <FileText className="h-5 w-5" />
            </button>
            <button
              onClick={() => onEdit(patient)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8FAFC] text-[#0F172A] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white"
              title="Editar"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(patient.id)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF2F2] text-[#DC2626] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#FEE2E2]"
              title="Excluir"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientsList;
