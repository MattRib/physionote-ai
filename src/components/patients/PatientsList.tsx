'use client';

import React from 'react';
import { Edit, Trash2, FileText } from 'lucide-react';
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

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">👥</span>
        </div>
        <h3 className="text-lg font-semibold text-[#333333] mb-2">
          Nenhum paciente encontrado
        </h3>
        <p className="text-[#666666]">
          Clique em &quot;Novo Paciente&quot; para adicionar seu primeiro paciente.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Contato
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Idade
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Sessões
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Última Sessão
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-[#333333]">{patient.name}</div>
                    <div className="text-sm text-[#666666]">{patient.cpf}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#666666]">
                    <div>{patient.email}</div>
                    <div>{patient.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666]">
                  {calculateAge(patient.birthDate)} anos
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#5A9BCF]/10 text-[#5A9BCF]">
                    {patient.totalSessions}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666]">
                  {patient.lastSession ? formatDate(patient.lastSession) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewRecord(patient.id)}
                      className="p-2 text-[#5A9BCF] hover:bg-[#5A9BCF]/10 rounded-lg transition-all duration-200 hover:scale-110"
                      title="Prontuário"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(patient)}
                      className="p-2 text-[#666666] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(patient.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsList;
