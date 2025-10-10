'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, User, CheckCircle, Mic, AlertCircle, X, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NewSessionFlowProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

const NewSessionFlow: React.FC<NewSessionFlowProps> = ({ 
  onSuccess, 
  onCancel,
  isModal = false 
}) => {
  const router = useRouter();
  const [sessionDateTime, setSessionDateTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [briefDescription, setBriefDescription] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const specialtyOptions = [
    { value: '', label: 'Selecione uma especialidade' },
    { value: 'geral', label: 'Consulta Geral de Fisioterapia' },
    { value: 'neurofuncional', label: 'Neurofuncional' },
    { value: 'traumato-ortopedica', label: 'Traumato Ortopédica' },
    { value: 'cardiorrespiratoria', label: 'Fisioterapia Cardiorrespiratória' },
    { value: 'dermato-funcional', label: 'Dermato Funcional' },
    { value: 'desportiva', label: 'Desportiva' }
  ];

  useEffect(() => {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 16);
    setSessionDateTime(formatted);
  }, []);

  const handleStartRecording = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consentChecked) {
      alert('Por favor, confirme que o consentimento foi obtido.');
      return;
    }

    if (!specialty) {
      alert('Por favor, selecione a especialidade da consulta.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      console.log('Starting recording session:', {
        sessionDateTime,
        patientName,
        specialty,
        briefDescription,
        consentChecked
      });
      
      if (isModal && onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard');
      }
    }, 1500);
  };

  const handleCancel = () => {
    if (isModal && onCancel) {
      onCancel();
    } else {
      router.push('/dashboard');
    }
  };

  const containerClasses = isModal 
    ? "" 
    : "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8";

  const formWrapperClasses = isModal
    ? ""
    : "max-w-3xl mx-auto";

  const formClasses = isModal
    ? "space-y-6"
    : "bg-white rounded-2xl shadow-xl p-8 space-y-8";

  return (
    <div className={containerClasses}>
      {!isModal && (
        <div className="max-w-3xl mx-auto mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
            Voltar ao Dashboard
          </button>
        </div>
      )}

      <div className={formWrapperClasses}>
        <form onSubmit={handleStartRecording} className={formClasses}>
          {!isModal && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-4">
                <Mic className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Nova Sessão de Atendimento
              </h1>
              <p className="text-gray-600">
                Configure os detalhes da sessão antes de iniciar a gravação
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="sessionDateTime" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Data e Hora da Sessão
              </label>
              <input
                type="datetime-local"
                id="sessionDateTime"
                value={sessionDateTime}
                onChange={(e) => setSessionDateTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nome do Paciente
              </label>
              <input
                type="text"
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Digite o nome completo do paciente"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                <Stethoscope className="w-4 h-4 inline mr-2" />
                Especialidade da Consulta
              </label>
              <select
                id="specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all bg-white text-gray-900"
                required
              >
                {specialtyOptions.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    className={option.value === '' ? 'text-gray-400' : 'text-gray-900'}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="briefDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição Breve (Opcional)
              </label>
              <textarea
                id="briefDescription"
                value={briefDescription}
                onChange={(e) => setBriefDescription(e.target.value)}
                placeholder="Adicione notas ou observações relevantes sobre esta sessão..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all resize-none text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-amber-900 mb-1">
                    Consentimento do Paciente
                  </h3>
                  <p className="text-sm text-amber-800 mb-3">
                    Certifique-se de que o paciente está ciente e consentiu com a gravação da sessão
                    para fins de registro médico e documentação.
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-2 focus:ring-primary-blue"
                      required
                    />
                    <span className="text-sm font-medium text-amber-900">
                      Confirmo que o consentimento foi obtido
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border-2 border-primary-blue text-primary-blue rounded-lg hover:bg-primary-blue hover:text-white transition-all font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !consentChecked}
              className="flex-1 px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Iniciando...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Iniciar Gravação
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSessionFlow;