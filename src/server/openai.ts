import 'server-only';
import OpenAI from 'openai';

// Configurações padrão
export const WHISPER_MODEL = 'whisper-1';
export const GPT_MODEL = 'gpt-4o'; 
export const MAX_AUDIO_SIZE = 25 * 1024 * 1024;

// Get API key with fallback for build time
const getApiKey = () => {
  const key = process.env.OPENAI_API_KEY;
  
  // During build time, use a placeholder if key is not set
  if (!key && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ OPENAI_API_KEY not found - using placeholder for build');
    return 'sk-build-placeholder';
  }
  
  if (!key) {
    throw new Error('OPENAI_API_KEY not found in environment variables');
  }
  
  return key;
};

// Lazy initialization - only create client when first accessed
let _openai: OpenAI | null = null;

export const openai = new Proxy({} as OpenAI, {
  get(target, prop) {
    if (!_openai) {
      _openai = new OpenAI({
        apiKey: getApiKey(),
      });
    }
    return _openai[prop as keyof OpenAI];
  }
}); 
