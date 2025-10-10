'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, FileText } from 'lucide-react';
import { Patient } from './PatientsView';

interface PatientModalProps {
  patient: Patient | null;
  onClose: () => void;
  onSave: (patient: Omit<Patient, 'id' | 'createdAt' | 'totalSessions'>) => void;
}

const PatientModal: React.FC<PatientModalProps> = ({ patient, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    gender: 'feminino' as 'masculino' | 'feminino' | 'outro',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    medicalHistory: '',
    lastSession: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        cpf: patient.cpf,
        birthDate: patient.birthDate,
        gender: patient.gender,
        address: {
          street: patient.address.street,
          number: patient.address.number,
          complement: patient.address.complement || '',
          neighborhood: patient.address.neighborhood,
          city: patient.address.city,
          state: patient.address.state,
          zipCode: patient.address.zipCode
        },
        medicalHistory: patient.medicalHistory || '',
        lastSession: patient.lastSession || ''
      });
    }
  }, [patient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatZipCode = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        {/* Modal Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-2xl font-bold text-[#333333]">
            {patient ? 'Editar Paciente' : 'Novo Paciente'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-[#666666]" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          {/* Informações Pessoais */}
          <div>
            <h3 className="text-lg font-semibold text-[#333333] mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-[#5A9BCF]" />
              Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all"
                  placeholder="Digite o nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    setFormData({ ...formData, cpf: formatted });
                  }}
                  required
                  maxLength={14}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all"
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  Gênero *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all"
                >
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold text-[#333333] mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-[#5A9BCF]" />
              Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setFormData({ ...formData, phone: formatted });
                  }}
                  required
                  maxLength={15}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-[#333333] mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-[#5A9BCF]" />
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => {
                    const formatted = formatZipCode(e.target.value);
                    setFormData({
                      ...formData,
                      address: { ...formData.address, zipCode: formatted }
                    });
                  }}
                  maxLength={9}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all"
                  placeholder="00000-000"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  Rua
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all"
                  placeholder="Nome da rua"
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  Número
                </label>
                <input
                  type="text"
                  name="address.number"
                  value={formData.address.number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all"
                  placeholder="N°"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  name="address.complement"
                  value={formData.address.complement}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all"
                  placeholder="Apto, bloco, etc"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  name="address.neighborhood"
                  value={formData.address.neighborhood}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all"
                  placeholder="Nome do bairro"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all"
                  placeholder="Nome da cidade"
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  maxLength={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all uppercase"
                  placeholder="UF"
                />
              </div>
            </div>
          </div>

          {/* Histórico Médico */}
          <div>
            <h3 className="text-lg font-semibold text-[#333333] mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[#5A9BCF]" />
              Histórico Médico
            </h3>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A9BCF] focus:border-transparent transition-all resize-none"
              placeholder="Descreva o histórico médico relevante do paciente..."
            />
          </div>

        </form>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-200 text-[#666666] rounded-lg hover:bg-white transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-3 bg-[#5A9BCF] text-white rounded-lg hover:bg-[#4A8BBF] transition-colors font-medium shadow-sm"
          >
            {patient ? 'Salvar Alterações' : 'Cadastrar Paciente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;
