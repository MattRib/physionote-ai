import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface NoteAIDisclaimerProps {
  show?: boolean;
  className?: string;
}

const NoteAIDisclaimer: React.FC<NoteAIDisclaimerProps> = ({ show = false, className }) => {
  if (!show) return null;
  return (
    <div
      role="note"
      aria-live="polite"
      className={
        'rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800 flex items-start gap-2 ' +
        (className ?? '')
      }
    >
      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <p>
        Esta nota foi gerada automaticamente com auxílio de IA e pode conter erros ou omissões. Revise todo o conteúdo
        antes de salvar.
      </p>
    </div>
  );
};

export default NoteAIDisclaimer;
