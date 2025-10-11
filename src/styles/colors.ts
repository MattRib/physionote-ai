/**
 * PhysioNote.AI - Nova Identidade Visual
 * Paleta de Cores Centralizada
 * Data: 11 de Outubro de 2025
 */

export const colors = {
  // Cor Primária (Marca)
  primary: {
    main: '#4F46E5',      // Azul arroxeado moderno
    light: '#6366F1',     // Variação clara
    dark: '#4338CA',      // Variação escura
    gradient: 'linear-gradient(90deg, #4F46E5 0%, #6366F1 100%)',
  },

  // Cores de Apoio (Feedback)
  success: {
    main: '#22C55E',
    light: '#4ADE80',
    dark: '#16A34A',
  },

  warning: {
    main: '#F59E0B',
    light: '#FCD34D',
    dark: '#D97706',
  },

  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
  },

  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
  },

  // Neutros (Base)
  neutral: {
    bg: '#F9FAFB',           // Fundo principal
    card: '#FFFFFF',         // Fundo de cards
    textPrimary: '#111827',  // Texto primário
    textSecondary: '#6B7280',// Texto secundário
    border: '#E5E7EB',       // Bordas e divisores
  },

  // Hover e Interações
  interaction: {
    hover: '#EEF2FF',        // Fundo hover
    activeBorder: '#6366F1', // Borda ativa
  },

  // Gradientes
  gradients: {
    primary: 'linear-gradient(90deg, #4F46E5 0%, #6366F1 100%)',
    sidebar: 'linear-gradient(180deg, #4F46E5 0%, #6366F1 100%)',
    card: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
  },
} as const;

// Utilitários de cores
export const getColorWithOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

// Classes Tailwind correspondentes (para referência)
export const tailwindColors = {
  primary: {
    main: '[#4F46E5]',
    light: '[#6366F1]',
    dark: '[#4338CA]',
  },
  success: {
    main: '[#22C55E]',
  },
  warning: {
    main: '[#F59E0B]',
  },
  error: {
    main: '[#EF4444]',
  },
  info: {
    main: '[#3B82F6]',
  },
  neutral: {
    bg: '[#F9FAFB]',
    card: '[#FFFFFF]',
    textPrimary: '[#111827]',
    textSecondary: '[#6B7280]',
    border: '[#E5E7EB]',
  },
  interaction: {
    hover: '[#EEF2FF]',
    activeBorder: '[#6366F1]',
  },
} as const;

export default colors;
