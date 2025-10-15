// Shared types for Dashboard components

export interface DashboardSession {
  id: string;
  session_datetime: string;
  patient_name: string;
  patient_id?: string;
  patient_email?: string | null;
  status: 'completed' | 'processing' | 'error' | 'recording' | 'transcribing' | 'generating';
  is_anonymized: boolean;
  duration_minutes?: number | null;
  main_complaint?: string | null;
  note_id?: string | null;
  note_status?: string | null;
}
