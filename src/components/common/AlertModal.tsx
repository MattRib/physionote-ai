'use client';

import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type?: AlertType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type = 'info',
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancelar',
  showCancel = false,
}) => {
  if (!isOpen) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          buttonBg: 'from-green-500 to-green-600',
          borderColor: 'border-green-200',
        };
      case 'error':
        return {
          icon: AlertCircle,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          buttonBg: 'from-red-500 to-red-600',
          borderColor: 'border-red-200',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          buttonBg: 'from-yellow-500 to-yellow-600',
          borderColor: 'border-yellow-200',
        };
      case 'info':
      default:
        return {
          icon: Info,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          buttonBg: 'from-blue-500 to-blue-600',
          borderColor: 'border-blue-200',
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md animate-in fade-in zoom-in duration-200 rounded-[28px] border-2 ${config.borderColor} bg-white shadow-[0_32px_70px_-20px_rgba(0,0,0,0.3)] p-8`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${config.iconBg}`}>
            <Icon className={`h-8 w-8 ${config.iconColor}`} />
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-center text-xl font-bold text-[#0F172A]">
          {title}
        </h3>

        {/* Message */}
        <p className="mb-8 text-center text-sm leading-relaxed text-[#64748B] whitespace-pre-line">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          {showCancel && (
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`flex-1 rounded-2xl bg-gradient-to-r ${config.buttonBg} px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
