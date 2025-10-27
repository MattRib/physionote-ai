/**
 * Script de migração para mover arquivos de áudio locais para o Cloudinary
 *
 * Este script:
 * 1. Busca todas as sessões com audioUrl local (não começa com http)
 * 2. Faz upload dos arquivos para o Cloudinary
 * 3. Atualiza o audioUrl no banco de dados
 * 4. Opcionalmente remove os arquivos locais
 *
 * Uso:
 * npx tsx scripts/migrate-to-cloudinary.ts [--delete-local]
 */

import { prisma } from '../src/server/db';
import { uploadAudioToCloudinary, isCloudinaryConfigured } from '../src/server/cloudinary';
import fs from 'fs/promises';
import path from 'path';

const DELETE_LOCAL_FILES = process.argv.includes('--delete-local');
const AUDIO_DIRS = [
  path.join(process.cwd(), '.data', 'audio'),
  path.join(process.cwd(), 'uploads', 'audio'),
];

async function migrateAudioFiles() {
  console.log('🚀 Iniciando migração de arquivos de áudio para Cloudinary...\n');

  // Verificar configuração do Cloudinary
  if (!isCloudinaryConfigured()) {
    console.error('❌ Cloudinary não está configurado!');
    console.error('Configure as variáveis de ambiente:');
    console.error('  - CLOUDINARY_CLOUD_NAME');
    console.error('  - CLOUDINARY_API_KEY');
    console.error('  - CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  // Buscar todas as sessões com audioUrl local
  const sessions = await prisma.session.findMany({
    where: {
      audioUrl: {
        not: null,
      },
    },
  });

  const localSessions = sessions.filter(
    (session) =>
      session.audioUrl &&
      !session.audioUrl.startsWith('http://') &&
      !session.audioUrl.startsWith('https://')
  );

  console.log(`📊 Total de sessões: ${sessions.length}`);
  console.log(`📁 Sessões com arquivos locais: ${localSessions.length}\n`);

  if (localSessions.length === 0) {
    console.log('✅ Nenhuma sessão precisa ser migrada!');
    return;
  }

  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ sessionId: string; error: string }> = [];

  for (const session of localSessions) {
    const audioFilename = session.audioUrl!;
    console.log(`\n📤 Processando sessão ${session.id}...`);
    console.log(`   Arquivo: ${audioFilename}`);

    try {
      // Tentar encontrar o arquivo em qualquer um dos diretórios
      let audioPath: string | null = null;
      let audioBuffer: Buffer | null = null;

      for (const dir of AUDIO_DIRS) {
        const testPath = path.join(dir, audioFilename);
        try {
          audioBuffer = await fs.readFile(testPath);
          audioPath = testPath;
          console.log(`   ✓ Arquivo encontrado em: ${dir}`);
          break;
        } catch {
          // Arquivo não existe neste diretório, tentar o próximo
          continue;
        }
      }

      if (!audioBuffer || !audioPath) {
        throw new Error(`Arquivo não encontrado: ${audioFilename}`);
      }

      // Upload para Cloudinary
      console.log('   📤 Fazendo upload para Cloudinary...');
      const cloudinaryResult = await uploadAudioToCloudinary(audioBuffer, audioFilename);
      console.log(`   ✓ Upload concluído: ${cloudinaryResult.secureUrl}`);

      // Atualizar banco de dados
      await prisma.session.update({
        where: { id: session.id },
        data: {
          audioUrl: cloudinaryResult.secureUrl,
          audioSize: cloudinaryResult.size,
        },
      });
      console.log('   ✓ Banco de dados atualizado');

      // Deletar arquivo local se solicitado
      if (DELETE_LOCAL_FILES) {
        await fs.unlink(audioPath);
        console.log('   ✓ Arquivo local deletado');
      }

      successCount++;
      console.log('   ✅ Migração concluída com sucesso!');
    } catch (error: any) {
      errorCount++;
      const errorMsg = error.message || 'Erro desconhecido';
      errors.push({ sessionId: session.id, error: errorMsg });
      console.error(`   ❌ Erro: ${errorMsg}`);
    }
  }

  // Resumo final
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO DA MIGRAÇÃO');
  console.log('='.repeat(50));
  console.log(`✅ Sucesso: ${successCount}`);
  console.log(`❌ Erros: ${errorCount}`);
  console.log(`📁 Total processado: ${localSessions.length}`);

  if (errors.length > 0) {
    console.log('\n❌ Erros detalhados:');
    errors.forEach(({ sessionId, error }) => {
      console.log(`   - Sessão ${sessionId}: ${error}`);
    });
  }

  if (DELETE_LOCAL_FILES && successCount > 0) {
    console.log(`\n🗑️  ${successCount} arquivo(s) local(is) foram deletados`);
  }

  console.log('\n✨ Migração finalizada!');
}

// Executar migração
migrateAudioFiles()
  .catch((error) => {
    console.error('\n❌ Erro fatal na migração:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
