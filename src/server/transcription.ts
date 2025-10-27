import 'server-only';
import { openai, WHISPER_MODEL } from './openai';
import fs from 'fs';

export interface TranscriptionResult {
  text: string;
  duration?: number;
  language?: string;
}

/**
 * Transcreve áudio usando OpenAI Whisper API
 * @param audioPathOrUrl Caminho local do arquivo ou URL do Cloudinary
 * @param language Idioma do áudio (padrão: português)
 * @returns Resultado da transcrição
 */
export async function transcribeAudio(
  audioPathOrUrl: string,
  language?: string
): Promise<TranscriptionResult> {
  try {
    let audioFile: fs.ReadStream | Response;

    // Verificar se é uma URL (Cloudinary) ou caminho local
    if (audioPathOrUrl.startsWith('http://') || audioPathOrUrl.startsWith('https://')) {
      // É uma URL do Cloudinary
      console.log(`[Transcription] Downloading audio from URL: ${audioPathOrUrl}`);

      // Fazer download do arquivo do Cloudinary
      const response = await fetch(audioPathOrUrl);
      if (!response.ok) {
        throw new Error(`Failed to download audio from Cloudinary: ${response.statusText}`);
      }

      // Converter para formato aceito pelo OpenAI
      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer]);
      const file = new File([blob], 'audio.webm', { type: 'audio/webm' });

      const transcription = await openai.audio.transcriptions.create({
        file: file as any,
        model: WHISPER_MODEL,
        language: language || 'pt',
        response_format: 'verbose_json',
      });

      return {
        text: transcription.text,
        duration: (transcription as any).duration,
        language: (transcription as any).language,
      };
    } else {
      // É um caminho local (fallback para arquivos antigos)
      console.log(`[Transcription] Reading local file: ${audioPathOrUrl}`);
      audioFile = fs.createReadStream(audioPathOrUrl);

      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: WHISPER_MODEL,
        language: language || 'pt',
        response_format: 'verbose_json',
      });

      return {
        text: transcription.text,
        duration: (transcription as any).duration,
        language: (transcription as any).language,
      };
    }
  } catch (error: any) {
    console.error('Transcription error:', error);
    throw new Error(`Falha na transcrição: ${error.message}`);
  }
}
