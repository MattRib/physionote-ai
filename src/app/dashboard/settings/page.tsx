'use client';

import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Mic, 
  FileText, 
  Globe,
  Save,
  X,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';

type SettingsSection = 'profile' | 'notifications' | 'security' | 'appearance' | 'data' | 'audio' | 'transcription' | 'language';

interface NotificationSettings {
  emailNotifications: boolean;
  sessionReminders: boolean;
  weeklyReports: boolean;
  systemUpdates: boolean;
}

interface AudioSettings {
  autoSave: boolean;
  noiseReduction: boolean;
  audioQuality: 'low' | 'medium' | 'high';
  microphoneGain: number;
}

interface TranscriptionSettings {
  autoCorrect: boolean;
  medicalTerms: boolean;
  punctuation: boolean;
  speakerDetection: boolean;
}

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: 'Dr. Fisioterapeuta',
    email: 'fisio@exemplo.com',
    phone: '(11) 98765-4321',
    crm: 'CREFITO-3/123456',
    specialty: 'Fisioterapia Ortopédica',
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    sessionReminders: true,
    weeklyReports: false,
    systemUpdates: true,
  });

  // Audio settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    autoSave: true,
    noiseReduction: true,
    audioQuality: 'high',
    microphoneGain: 75,
  });

  // Transcription settings
  const [transcriptionSettings, setTranscriptionSettings] = useState<TranscriptionSettings>({
    autoCorrect: true,
    medicalTerms: true,
    punctuation: true,
    speakerDetection: false,
  });

  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [language, setLanguage] = useState('pt-BR');

  const sections = [
    { id: 'profile' as SettingsSection, name: 'Perfil', icon: User },
    { id: 'notifications' as SettingsSection, name: 'Notificações', icon: Bell },
    { id: 'security' as SettingsSection, name: 'Segurança', icon: Shield },
    { id: 'appearance' as SettingsSection, name: 'Aparência', icon: Palette },
    { id: 'audio' as SettingsSection, name: 'Áudio', icon: Mic },
    { id: 'transcription' as SettingsSection, name: 'Transcrição', icon: FileText },
    { id: 'language' as SettingsSection, name: 'Idioma', icon: Globe },
    { id: 'data' as SettingsSection, name: 'Dados', icon: Database },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-2">
            Email
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-2">
            Telefone
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-2">
            CREFITO
          </label>
          <input
            type="text"
            value={profileData.crm}
            onChange={(e) => setProfileData({ ...profileData, crm: e.target.value })}
            className="w-full"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#0F172A] mb-2">
            Especialidade
          </label>
          <input
            type="text"
            value={profileData.specialty}
            onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
            className="w-full"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-blue-200/60 bg-gradient-to-r from-blue-50 to-blue-100/50 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Informações do Perfil
            </p>
            <p className="text-xs text-blue-700">
              Essas informações serão exibidas nos relatórios e documentos gerados pelo sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 rounded-2xl border border-white/60 bg-white/70 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">
                {key === 'emailNotifications' && 'Notificações por Email'}
                {key === 'sessionReminders' && 'Lembretes de Sessão'}
                {key === 'weeklyReports' && 'Relatórios Semanais'}
                {key === 'systemUpdates' && 'Atualizações do Sistema'}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {key === 'emailNotifications' && 'Receba atualizações importantes por email'}
                {key === 'sessionReminders' && 'Lembretes antes das sessões agendadas'}
                {key === 'weeklyReports' && 'Resumo semanal de atividades'}
                {key === 'systemUpdates' && 'Notificações sobre novas funcionalidades'}
              </p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, [key]: !value })}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                value ? 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-2">
            Senha Atual
          </label>
          <input
            type="password"
            placeholder="Digite sua senha atual"
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-2">
            Nova Senha
          </label>
          <input
            type="password"
            placeholder="Digite sua nova senha"
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-2">
            Confirmar Nova Senha
          </label>
          <input
            type="password"
            placeholder="Confirme sua nova senha"
            className="w-full"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-100/50 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-1">
              Segurança da Senha
            </p>
            <p className="text-xs text-amber-700">
              Use uma senha forte com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Autenticação em Dois Fatores</h3>
        <div className="flex items-center justify-between p-4 rounded-2xl border border-white/60 bg-white/70 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">Ativar 2FA</p>
            <p className="text-xs text-[#64748B] mt-1">Adicione uma camada extra de segurança</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-shadow">
            Configurar
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-[#0F172A] mb-4">
          Tema do Sistema
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['light', 'dark', 'auto'] as const).map((themeOption) => (
            <button
              key={themeOption}
              onClick={() => setTheme(themeOption)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                theme === themeOption
                  ? 'border-[#4F46E5] bg-gradient-to-br from-[#EEF2FF] to-white shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#0F172A] capitalize">
                  {themeOption === 'light' && 'Claro'}
                  {themeOption === 'dark' && 'Escuro'}
                  {themeOption === 'auto' && 'Automático'}
                </span>
                {theme === themeOption && (
                  <Check className="h-5 w-5 text-[#4F46E5]" />
                )}
              </div>
              <p className="text-xs text-[#64748B] text-left">
                {themeOption === 'light' && 'Tema claro para o dia'}
                {themeOption === 'dark' && 'Tema escuro para a noite'}
                {themeOption === 'auto' && 'Ajusta automaticamente'}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-purple-200/60 bg-gradient-to-r from-purple-50 to-purple-100/50 p-4">
        <div className="flex gap-3">
          <Palette className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-900 mb-1">
              Personalização Visual
            </p>
            <p className="text-xs text-purple-700">
              Mais opções de personalização estarão disponíveis em breve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAudioSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(audioSettings).map(([key, value]) => {
          if (key === 'audioQuality') {
            return (
              <div key={key} className="p-4 rounded-2xl border border-white/60 bg-white/70 shadow-sm">
                <label className="block text-sm font-semibold text-[#0F172A] mb-3">
                  Qualidade do Áudio
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as const).map((quality) => (
                    <button
                      key={quality}
                      onClick={() => setAudioSettings({ ...audioSettings, audioQuality: quality })}
                      className={`py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
                        value === quality
                          ? 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {quality === 'low' && 'Baixa'}
                      {quality === 'medium' && 'Média'}
                      {quality === 'high' && 'Alta'}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
          
          if (key === 'microphoneGain') {
            return (
              <div key={key} className="p-4 rounded-2xl border border-white/60 bg-white/70 shadow-sm">
                <label className="block text-sm font-semibold text-[#0F172A] mb-3">
                  Ganho do Microfone: {value}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => setAudioSettings({ ...audioSettings, microphoneGain: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
                />
              </div>
            );
          }
          
          return (
            <div key={key} className="flex items-center justify-between p-4 rounded-2xl border border-white/60 bg-white/70 shadow-sm hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  {key === 'autoSave' && 'Salvamento Automático'}
                  {key === 'noiseReduction' && 'Redução de Ruído'}
                </p>
                <p className="text-xs text-[#64748B] mt-1">
                  {key === 'autoSave' && 'Salvar gravações automaticamente'}
                  {key === 'noiseReduction' && 'Filtrar ruídos de fundo'}
                </p>
              </div>
              <button
                onClick={() => setAudioSettings({ ...audioSettings, [key]: !value })}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  value ? 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTranscriptionSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(transcriptionSettings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 rounded-2xl border border-white/60 bg-white/70 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">
                {key === 'autoCorrect' && 'Correção Automática'}
                {key === 'medicalTerms' && 'Termos Médicos'}
                {key === 'punctuation' && 'Pontuação Automática'}
                {key === 'speakerDetection' && 'Detecção de Falantes'}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {key === 'autoCorrect' && 'Corrigir erros de digitação automaticamente'}
                {key === 'medicalTerms' && 'Reconhecer terminologia médica'}
                {key === 'punctuation' && 'Adicionar pontuação automaticamente'}
                {key === 'speakerDetection' && 'Identificar diferentes falantes'}
              </p>
            </div>
            <button
              onClick={() => setTranscriptionSettings({ ...transcriptionSettings, [key]: !value })}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                value ? 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLanguageSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-[#0F172A] mb-4">
          Idioma do Sistema
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full"
        >
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en-US">English (US)</option>
          <option value="es-ES">Español</option>
        </select>
      </div>

      <div className="rounded-2xl border border-green-200/60 bg-gradient-to-r from-green-50 to-green-100/50 p-4">
        <div className="flex gap-3">
          <Globe className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-900 mb-1">
              Idioma da Interface
            </p>
            <p className="text-xs text-green-700">
              As alterações de idioma serão aplicadas após recarregar a página.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 rounded-2xl border border-white/60 bg-white/70 shadow-sm">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-2">Exportar Dados</h3>
          <p className="text-xs text-[#64748B] mb-4">
            Baixe uma cópia de todos os seus dados em formato JSON
          </p>
          <button className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-shadow">
            Exportar Dados
          </button>
        </div>

        <div className="p-4 rounded-2xl border border-white/60 bg-white/70 shadow-sm">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-2">Limpar Cache</h3>
          <p className="text-xs text-[#64748B] mb-4">
            Remover dados temporários para melhorar o desempenho
          </p>
          <button className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-700 text-sm font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all">
            Limpar Cache
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-red-200/60 bg-gradient-to-r from-red-50 to-red-100/50 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900 mb-1">
              Zona de Perigo
            </p>
            <p className="text-xs text-red-700 mb-3">
              Ações irreversíveis que afetam permanentemente seus dados
            </p>
            <button className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
              Excluir Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'security':
        return renderSecuritySection();
      case 'appearance':
        return renderAppearanceSection();
      case 'audio':
        return renderAudioSection();
      case 'transcription':
        return renderTranscriptionSection();
      case 'language':
        return renderLanguageSection();
      case 'data':
        return renderDataSection();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="px-6 py-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="rounded-[32px] border border-white/60 bg-white/70 px-8 py-7 shadow-[0_25px_30px_-40px_rgba(79,70,229,0.45)] backdrop-blur-sm mb-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#4F46E5]">
                    Configurações
                  </span>
                  <h1 className="mt-4 text-3xl font-bold text-[#0F172A] lg:text-4xl">
                    Configurações do Sistema
                  </h1>
                  <p className="mt-2 max-w-xl text-sm text-[#64748B]">
                    Personalize sua experiência e gerencie suas preferências
                  </p>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_45px_-28px_rgba(79,70,229,0.6)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Salvando...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Salvo!</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Settings Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <div className="rounded-[26px] border border-white/70 bg-white/95 p-4 shadow-[0_20px_45px_-36px_rgba(15,23,42,0.35)] sticky top-8">
                  <nav className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-sm font-semibold transition-all ${
                            activeSection === section.id
                              ? 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-md'
                              : 'text-[#475569] hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span>{section.name}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Content Area */}
              <div className="lg:col-span-3">
                <div className="rounded-[26px] border border-white/70 bg-white/95 p-8 shadow-[0_20px_45px_-36px_rgba(15,23,42,0.35)]">
                  <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
                    {sections.find(s => s.id === activeSection)?.name}
                  </h2>
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
