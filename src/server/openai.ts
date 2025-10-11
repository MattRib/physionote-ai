import 'server-only';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY not found in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configurações padrão
export const WHISPER_MODEL = 'whisper-1';
export const GPT_MODEL = 'gpt-4o'; 
export const MAX_AUDIO_SIZE = 25 * 1024 * 1024; 
