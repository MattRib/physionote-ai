'use client';

import React, { useState } from 'react';
import { Search, User, ChevronDown } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  lastSession?: string;
}

interface PatientSelectorProps {
  selectedPatient: { id: string; name: string } | null;
  onSelectPatient: (patient: { id: string; name: string } | null) => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({ selectedPatient, onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Mock patients - substituir com dados reais
  const mockPatients: Patient[] = [
    { id: '1', name: 'Maria Silva Santos', lastSession: '2024-03-20' },
    { id: '2', name: 'João Pedro Oliveira', lastSession: '2024-03-18' },
    { id: '3', name: 'Ana Carolina Ferreira', lastSession: '2024-03-19' },
    { id: '4', name: 'Carlos Eduardo Mendes', lastSession: '2024-03-15' },
    { id: '5', name: 'Fernanda Costa Lima', lastSession: '2024-03-17' }
  ];

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPatient = (patient: Patient) => {
    onSelectPatient({ id: patient.id, name: patient.name });
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-2 relative z-10">
      <label className="block text-sm font-medium text-[#6B7280]">
        Paciente *
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300 bg-white text-left flex items-center justify-between hover:border-[#4F46E5] hover:shadow-md"
        >
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-[#6B7280] transition-colors" />
            <span className={selectedPatient ? 'text-[#111827]' : 'text-[#9CA3AF]'}>
              {selectedPatient ? selectedPatient.name : 'Selecione um paciente'}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-hidden animate-slide-down">
            {/* Search */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent text-sm transition-all duration-300"
                  autoFocus
                />
              </div>
            </div>

            {/* Patient List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className="w-full px-4 py-3 hover:bg-indigo-50 transition-all duration-200 text-left flex items-center space-x-3 group animate-fade-in-item"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-10 h-10 bg-[#4F46E5]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4F46E5]/20 transition-all duration-300">
                      <User className="w-5 h-5 text-[#4F46E5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#111827] truncate group-hover:text-[#4F46E5] transition-colors duration-200">{patient.name}</div>
                      {patient.lastSession && (
                        <div className="text-xs text-[#6B7280] group-hover:text-[#4F46E5]/70 transition-colors duration-200">
                          Última sessão: {new Date(patient.lastSession).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-[#6B7280] animate-fade-in">
                  Nenhum paciente encontrado
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSelector;
