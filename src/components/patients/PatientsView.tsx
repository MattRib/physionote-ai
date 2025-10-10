'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import PatientsList from './PatientsList';
import PatientModal from './PatientModal';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  gender: 'masculino' | 'feminino' | 'outro';
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  medicalHistory?: string;
  createdAt: string;
  lastSession?: string;
  totalSessions: number;
}

const PatientsView = () => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Maria Silva Santos',
      email: 'maria.silva@email.com',
      phone: '(11) 98765-4321',
      cpf: '123.456.789-00',
      birthDate: '1985-03-15',
      gender: 'feminino',
      address: {
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      medicalHistory: 'Histórico de dores lombares',
      createdAt: '2024-01-15',
      lastSession: '2024-03-20',
      totalSessions: 12
    },
    {
      id: '2',
      name: 'João Pedro Oliveira',
      email: 'joao.pedro@email.com',
      phone: '(11) 97654-3210',
      cpf: '987.654.321-00',
      birthDate: '1990-07-22',
      gender: 'masculino',
      address: {
        street: 'Av. Paulista',
        number: '1000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      },
      medicalHistory: 'Recuperação de lesão no joelho',
      createdAt: '2024-02-10',
      lastSession: '2024-03-18',
      totalSessions: 8
    },
    {
      id: '3',
      name: 'Ana Carolina Ferreira',
      email: 'ana.ferreira@email.com',
      phone: '(11) 96543-2109',
      cpf: '456.789.123-00',
      birthDate: '1978-11-30',
      gender: 'feminino',
      address: {
        street: 'Rua Augusta',
        number: '500',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01305-000'
      },
      createdAt: '2024-03-01',
      lastSession: '2024-03-19',
      totalSessions: 5
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const handleAddPatient = () => {
    setEditingPatient(null);
    setIsModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleDeletePatient = (patientId: string) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      setPatients(patients.filter(p => p.id !== patientId));
    }
  };

  const handleSavePatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'totalSessions'>) => {
    if (editingPatient) {
      // Editar paciente existente
      setPatients(patients.map(p => 
        p.id === editingPatient.id 
          ? { ...p, ...patientData }
          : p
      ));
    } else {
      // Adicionar novo paciente
      const newPatient: Patient = {
        ...patientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        totalSessions: 0
      };
      setPatients([newPatient, ...patients]);
    }
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.cpf.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Pacientes</h1>
          <p className="text-[#666666] mt-1">
            Gerencie seus pacientes cadastrados
          </p>
        </div>
        <button
          onClick={handleAddPatient}
          className="flex items-center justify-center space-x-2 bg-[#5A9BCF] text-white px-6 py-3 rounded-lg hover:bg-[#4A8BBF] transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Paciente</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#666666]">Total de Pacientes</p>
              <p className="text-3xl font-bold text-[#333333] mt-2">{patients.length}</p>
            </div>
            <div className="w-12 h-12 bg-[#5A9BCF]/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#666666]">Pacientes Ativos</p>
              <p className="text-3xl font-bold text-[#333333] mt-2">
                {patients.filter(p => p.lastSession).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#666666]">Novos este Mês</p>
              <p className="text-3xl font-bold text-[#333333] mt-2">
                {patients.filter(p => {
                  const created = new Date(p.createdAt);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && 
                         created.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar paciente por nome, email, telefone ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all"
          />
        </div>
        <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5 text-[#666666]" />
          <span className="text-[#666666] font-medium">Filtros</span>
        </button>
      </div>

      {/* Patients List */}
      <PatientsList
        patients={filteredPatients}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
      />

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
  );
};

export default PatientsView;
