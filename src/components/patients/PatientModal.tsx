'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, FileText, AlertTriangle } from 'lucide-react';
import { Patient } from './PatientsView';

interface PatientModalProps {
  patient: Patient | null;
  onClose: () => void;
  onSave: (patient: Omit<Patient, 'id' | 'createdAt' | 'totalSessions'>) => void;
}

const PatientModal: React.FC<PatientModalProps> = ({ patient, onClose, onSave }) => {
  // Classe comum para todos os inputs com texto legível e nova cor primária
  const inputClassName = "w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all text-[#111827] placeholder:text-gray-500";
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    gender: 'feminino' as 'masculino' | 'feminino' | 'outro',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    lastSession: ''
  });

  useEffect(() => {
    if (patient) {
      console.log('Preenchendo modal com dados do paciente:', patient);
      
      // Converter birthDate do formato ISO para YYYY-MM-DD se necessário
      let formattedBirthDate = '';
      if (patient.birthDate) {
        const date = new Date(patient.birthDate);
        if (!isNaN(date.getTime())) {
          formattedBirthDate = date.toISOString().split('T')[0];
        }
      }
      
      setFormData({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        cpf: patient.cpf || '',
        birthDate: formattedBirthDate,
        gender: (patient.gender as 'masculino' | 'feminino' | 'outro') || 'feminino',
        street: patient.street || '',
        number: patient.number || '',
        complement: patient.complement || '',
        neighborhood: patient.neighborhood || '',
        city: patient.city || '',
        state: patient.state || '',
        zipCode: patient.zipCode || '',
        lastSession: patient.lastSession || ''
      });
    } else {
      // Reset form when patient is null (creating new patient)
      setFormData({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        birthDate: '',
        gender: 'feminino',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        lastSession: ''
      });
    }
  }, [patient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enviar todos os campos do backend
    const validData = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      cpf: formData.cpf || undefined,
      birthDate: formData.birthDate || undefined,
      gender: formData.gender || undefined,
      street: formData.street || undefined,
      number: formData.number || undefined,
      complement: formData.complement || undefined,
      neighborhood: formData.neighborhood || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      zipCode: formData.zipCode || undefined,
    };
    
    onSave(validData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
          <h2 className="text-2xl font-bold text-[#111827]">
            {patient ? 'Editar Paciente' : 'Novo Paciente'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-[#6B7280]" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          {/* Aviso sobre campos não persistidos */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Aviso:</strong> Os campos CPF, Endereço e Histórico Médico ainda não são salvos no banco de dados. 
                Apenas Nome, Email, Telefone, Data de Nascimento e Gênero são persistidos atualmente.
              </div>
            </div>
          </div>

          {/* Informações Pessoais */}
          <div>
            <h3 className="text-lg font-semibold text-[#111827] mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-[#4F46E5]" />
              Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                  placeholder="Digite o nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-2">
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
                  className={inputClassName}
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-2">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-2">
                  Gênero *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className={inputClassName}
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
            <h3 className="text-lg font-semibold text-[#111827] mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-[#4F46E5]" />
              Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B7280] mb-2">
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
                  className={inputClassName}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-[#111827] mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-[#4F46E5]" />
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => {
                    const formatted = formatZipCode(e.target.value);
                    setFormData({
                      ...formData,
                      zipCode: formatted
                    });
                  }}
                  maxLength={9}
                  className={inputClassName}
                  placeholder="00000-000"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">
                  Rua
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="Nome da rua"
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">
                  Número
                </label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="N°"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  name="complement"
                  value={formData.complement}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="Apto, bloco, etc"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="Nome do bairro"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="Nome da cidade"
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  maxLength={2}
                  className={`${inputClassName} uppercase`}
                  placeholder="UF"
                />
              </div>
            </div>
          </div>

        </form>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="btn-cancel rounded-lg px-6 py-3"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-3 bg-[#4F46E5] text-white rounded-lg hover:bg-[#6366F1] transition-colors font-medium shadow-sm"
          >
            {patient ? 'Salvar Alterações' : 'Cadastrar Paciente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;
