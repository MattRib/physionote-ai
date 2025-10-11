import 'server-only';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const AUDIO_DIR = path.join(process.cwd(), '.data', 'audio');

// Garante que o diretório existe
export async function ensureAudioDir() {
  try {
    await fs.mkdir(AUDIO_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create audio directory:', err);
  }
}

// Salva arquivo de áudio
export async function saveAudioFile(
  buffer: Buffer,
  originalName: string
): Promise<{ filename: string; path: string; size: number }> {
  await ensureAudioDir();
  
  const ext = path.extname(originalName);
  const filename = `${randomUUID()}${ext}`;
  const filepath = path.join(AUDIO_DIR, filename);
  
  await fs.writeFile(filepath, buffer);
  
  return {
    filename,
    path: filepath,
    size: buffer.length,
  };
}

// Lê arquivo de áudio
export async function readAudioFile(filename: string): Promise<Buffer> {
  const filepath = path.join(AUDIO_DIR, filename);
  return fs.readFile(filepath);
}

// Remove arquivo de áudio
export async function deleteAudioFile(filename: string): Promise<void> {
  const filepath = path.join(AUDIO_DIR, filename);
  try {
    await fs.unlink(filepath);
  } catch (err) {
    console.error('Failed to delete audio file:', err);
  }
}

// Obtém caminho completo do arquivo
export function getAudioPath(filename: string): string {
  return path.join(AUDIO_DIR, filename);
}
