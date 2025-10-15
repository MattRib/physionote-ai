'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import PatientsList from './PatientsList';
import PatientModal from './PatientModal';

export interface Patient {
  id: string;
  name: string;
  email?: string;        // Opcional (como no Prisma)
  phone?: string;        // Opcional (como no Prisma)
  cpf?: string;          // Campo extra (não existe no Prisma)
  birthDate?: string;    // Opcional (como no Prisma)
  gender?: string;       // Opcional (como no Prisma)
  address?: {            // Campo extra (não existe no Prisma)
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  medicalHistory?: string; // Campo extra (não existe no Prisma)
  createdAt: string;
  lastSession?: string;    // Computed field
  totalSessions: number;   // Computed field
}

const PatientsView = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Buscar pacientes da API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/patients');
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar pacientes: ${response.status}`);
        }
        
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleAddPatient = () => {
    setEditingPatient(null);
    setIsModalOpen(true);
  };

  const handleEditPatient = async (patient: Patient) => {
    try {
      // Buscar dados completos do paciente da API
      const response = await fetch(`/api/patients/${patient.id}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dados do paciente');
      }
      
      const fullPatientData = await response.json();
      console.log('Dados do paciente carregados:', fullPatientData);
      
      setEditingPatient(fullPatientData);
      setIsModalOpen(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao carregar paciente');
      console.error('Erro ao carregar paciente:', err);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!confirm('Tem certeza que deseja excluir este paciente?')) {
      return;
    }

    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir paciente');
      }

      setPatients(patients.filter(p => p.id !== patientId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir paciente');
      console.error('Erro ao excluir paciente:', err);
    }
  };

  const handleSavePatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'totalSessions'>) => {
    try {
      console.log('Salvando paciente:', patientData);
      
      if (editingPatient) {
        // Editar paciente existente (Iteração 3)
        const response = await fetch(`/api/patients/${editingPatient.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patientData)
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Erro PUT response:', errorData);
          
          // Tratar erro específico de email duplicado
          if (errorData.includes('Unique constraint failed on the fields: (`email`)')) {
            throw new Error('Este email já está cadastrado. Por favor, use um email diferente.');
          }
          
          throw new Error(`Erro ao atualizar paciente: ${response.status}`);
        }

        const updatedPatient = await response.json();
        console.log('Paciente atualizado:', updatedPatient);
        setPatients(patients.map(p => p.id === editingPatient.id ? updatedPatient : p));
      } else {
        // Criar novo paciente (Iteração 2)
        const response = await fetch('/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patientData)
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Erro POST response:', errorData);
          
          // Tratar erro específico de email duplicado
          if (errorData.includes('Unique constraint failed on the fields: (`email`)')) {
            throw new Error('Este email já está cadastrado. Por favor, use um email diferente.');
          }
          
          throw new Error(`Erro ao criar paciente: ${response.status}`);
        }

        const newPatient = await response.json();
        console.log('Novo paciente criado:', newPatient);
        setPatients([newPatient, ...patients]);
      }

      setIsModalOpen(false);
      setEditingPatient(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar paciente');
      console.error('Erro ao salvar paciente:', err);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (patient.phone && patient.phone.includes(searchTerm)) ||
    (patient.cpf && patient.cpf.includes(searchTerm))
  );

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="rounded-[32px] border border-white/60 bg-white/70 px-8 py-7 shadow-[0_25px_60px_-40px_rgba(79,70,229,0.45)] backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#4F46E5]">
                Área de Contatos
              </span>
              <h1 className="mt-4 text-3xl font-bold text-[#0F172A] lg:text-4xl">Pacientes</h1>
              <p className="mt-2 max-w-xl text-sm text-[#64748B]">
                Visualize dados completos dos seus pacientes, acompanhe sessões recentes e mantenha o relacionamento sempre atualizado.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-[#E0E7FF] bg-white/90 px-5 py-3 text-center shadow-inner">
                <p className="text-xs uppercase tracking-[0.18em] text-[#94A3B8]">Pacientes ativos</p>
                <p className="text-2xl font-semibold text-[#4F46E5]">{patients.filter(p => p.lastSession).length}</p>
              </div>
              <button
                onClick={handleAddPatient}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_45px_-28px_rgba(79,70,229,0.6)] transition-transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                Novo Paciente
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-[26px] border border-white/70 bg-white/95 px-6 py-5 shadow-[0_20px_45px_-36px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Total de pacientes</p>
                <p className="mt-3 text-3xl font-semibold text-[#0F172A]">{patients.length}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FDE68A] via-[#FBCFE8] to-[#A5B4FC] text-2xl">
                👥
              </div>
            </div>
          </div>
          <div className="rounded-[26px] border border-white/70 bg-white/95 px-6 py-5 shadow-[0_20px_45px_-36px_rgba(34,197,94,0.35)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Pacientes ativos</p>
                <p className="mt-3 text-3xl font-semibold text-[#16A34A]">{patients.filter(p => p.lastSession).length}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DCFCE7] text-2xl">
                ✓
              </div>
            </div>
          </div>
          <div className="rounded-[26px] border border-white/70 bg-white/95 px-6 py-5 shadow-[0_20px_45px_-36px_rgba(37,99,235,0.35)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">Novos este mês</p>
                <p className="mt-3 text-3xl font-semibold text-[#1D4ED8]">
                  {patients.filter(p => {
                    const created = new Date(p.createdAt);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DBEAFE] text-2xl">
                📈
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-4 rounded-[26px] border border-white/70 bg-white/95 p-5 shadow-[0_18px_45px_-38px_rgba(79,70,229,0.35)] sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Buscar paciente por nome, email, telefone ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-transparent bg-white/90 pl-12 pr-4 py-3 text-sm font-medium text-[#0F172A] shadow-inner focus:border-[#C7D2FE] focus:outline-none focus:ring-2 focus:ring-[#C7D2FE]"
            />
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E2E8F0] px-5 py-3 text-sm font-semibold text-[#475569] transition-colors hover:border-[#C7D2FE] hover:bg-[#EEF2FF]">
            <Filter className="h-5 w-5" />
            Filtros
          </button>
        </div>

      {/* Loading State */}
      {loading && (
        <div className="rounded-[26px] border border-white/70 bg-white/90 p-16 text-center shadow-[0_22px_55px_-42px_rgba(79,70,229,0.45)]">
          <div className="mx-auto mb-5 h-16 w-16 animate-spin rounded-full border-4 border-[#4F46E5] border-t-transparent"></div>
          <p className="text-sm font-medium text-[#475569]">Carregando pacientes...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-[26px] border border-red-100 bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] p-8 shadow-[0_22px_55px_-42px_rgba(248,113,113,0.35)]">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-red-500 shadow-inner">!</div>
            <div>
              <h3 className="text-base font-semibold text-[#B91C1C]">Erro ao carregar pacientes</h3>
              <p className="mt-1 text-sm text-[#7F1D1D]">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Patients List */}
      {!loading && !error && (
        <PatientsList
          patients={filteredPatients}
          onEdit={handleEditPatient}
          onDelete={handleDeletePatient}
        />
      )}

      {/* Patient Modal */}
      {isModalOpen && (
        <PatientModal
          patient={editingPatient}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPatient(null);
          }}
          onSave={handleSavePatient}
        />
      )}
    </div>
    </div>
    );
};

export default PatientsView;
