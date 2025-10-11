import 'server-only';
import { openai, WHISPER_MODEL } from './openai';
import fs from 'fs';

export interface TranscriptionResult {
  text: string;
  duration?: number;
  language?: string;
}

export async function transcribeAudio(
  audioPath: string,
  language?: string
): Promise<TranscriptionResult> {
  try {
    // Whisper API aceita File ou ReadStream
    const audioFile = fs.createReadStream(audioPath);
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: WHISPER_MODEL,
      language: language || 'pt', // português por padrão
      response_format: 'verbose_json', // retorna metadados extras
    });

    return {
      text: transcription.text,
      duration: (transcription as any).duration,
      language: (transcription as any).language,
    };
  } catch (error: any) {
    console.error('Transcription error:', error);
    throw new Error(`Falha na transcrição: ${error.message}`);
  }
}
