# 🐛 Correção: Arquivos ainda sendo salvos localmente apesar do Cloudinary

**Data**: 26 de outubro de 2025  
**Tipo**: Bug - Storage  
**Prioridade**: Alta  
**Status**: ✅ Corrigido

---

## 📋 Resumo do Problema

Apesar do Cloudinary estar configurado e funcionando para upload de arquivos, os arquivos de áudio das sessões estavam sendo salvos na pasta local `uploads/audio/` ao invés de usar **apenas** o Cloudinary.

## 🔍 Causa Raiz

O endpoint `/api/sessions/[id]/process` estava usando a função `getAudioPath()` do módulo `storage.ts`, que **assume que o audioUrl é um nome de arquivo local**.

### Código problemático:

```typescript
// src/app/api/sessions/[id]/process/route.ts
import { getAudioPath } from '@/server/storage';

const audioPath = getAudioPath(session.audioUrl);
const transcription = await transcribeAudio(audioPath, 'pt');
```

### Por que isso causava problema:

1. **Upload funcionava corretamente** → Arquivo ia para Cloudinary
2. **audioUrl era salvo como URL** → `https://res.cloudinary.com/...`
3. **Processamento falhava** → `getAudioPath()` tentava tratar URL como nome de arquivo
4. **Resultado**: `transcribeAudio()` não conseguia localizar arquivo

## ✅ Solução Implementada

### Primeira correção: Endpoint de processamento

O módulo `transcription.ts` **já estava preparado** para aceitar tanto URLs quanto caminhos locais. A correção foi simples:

**Antes:**
```typescript
import { getAudioPath } from '@/server/storage';
const audioPath = getAudioPath(session.audioUrl);
const transcription = await transcribeAudio(audioPath, 'pt');
```

**Depois:**
```typescript
// Removido import de getAudioPath
// audioUrl pode ser uma URL do Cloudinary ou caminho local
const audioPathOrUrl = session.audioUrl;
const transcription = await transcribeAudio(audioPathOrUrl, 'pt');
```

### Segunda correção (26/10/2025): Endpoint de salvamento

A rota `/api/sessions/save` ainda estava salvando áudios localmente. Foi necessário migrar para o Cloudinary:

**Antes:**
```typescript
// src/app/api/sessions/save/route.ts
import fs from 'fs';
import path from 'path';

// Salvar áudio se fornecido
if (audioFile) {
  const audioDir = path.join(process.cwd(), 'uploads', 'audio');
  await mkdir(audioDir, { recursive: true });

  const fileName = `${patientId}-${timestamp}.webm`;
  const filePath = path.join(audioDir, fileName);
  await writeFile(filePath, buffer);

  audioUrl = `/uploads/audio/${fileName}`;  // ❌ Caminho local
}
```

**Depois:**
```typescript
// src/app/api/sessions/save/route.ts
import { uploadAudioToCloudinary, isCloudinaryConfigured } from '@/server/cloudinary';

// Fazer upload do áudio para Cloudinary se fornecido
if (audioFile) {
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: 'Cloudinary não configurado' }, { status: 500 });
  }

  const arrayBuffer = await audioFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const cloudinaryResult = await uploadAudioToCloudinary(buffer, audioFile.name);

  audioUrl = cloudinaryResult.secureUrl;  // ✅ URL do Cloudinary
  audioSize = cloudinaryResult.size;
}

### Como funciona agora:

A função `transcribeAudio()` detecta automaticamente:

```typescript
// src/server/transcription.ts
if (audioPathOrUrl.startsWith('http://') || audioPathOrUrl.startsWith('https://')) {
  // É uma URL do Cloudinary → Faz download e transcreve
} else {
  // É um caminho local → Lê arquivo local e transcreve
}
```

## 📁 Arquivos Modificados

### Alterados:
- `src/app/api/sessions/[id]/process/route.ts` - Removido uso de `getAudioPath()`
- **`src/app/api/sessions/save/route.ts`** - Migrado para usar Cloudinary (26/10/2025) ✅
- **`.gitignore`** - Adicionado `uploads/` e `temp/` (26/10/2025) ✅

### Mantidos (funcionando corretamente):
- `src/app/api/sessions/route.ts` - Upload para Cloudinary ✅
- `src/app/api/sessions/[id]/audio/route.ts` - Upload para Cloudinary ✅
- `src/server/transcription.ts` - Suporte a URLs ✅
- `src/server/cloudinary.ts` - Upload funcionando ✅

### Deprecados (não mais usados):
- `src/server/storage.ts` - Funções locais não são mais chamadas

## 🧪 Como Testar

### 1. Criar nova sessão com upload:
```bash
1. Acesse http://localhost:3000/dashboard
2. Clique em "Nova Sessão"
3. Selecione "Upload de Arquivo"
4. Faça upload de um áudio
```

### 2. Verificar que NÃO salvou localmente:
```bash
# Verificar pasta local (deve estar vazia ou sem novos arquivos)
ls uploads/audio/
ls .data/audio/
```

### 3. Verificar que está no Cloudinary:
```bash
1. Acesse https://cloudinary.com/console
2. Vá para Media Library
3. Navegue até physionote/sessions/
4. Arquivo deve estar lá
```

### 4. Verificar transcrição funciona:
```bash
# O audioUrl no banco deve ser uma URL do Cloudinary
# A transcrição deve funcionar normalmente
```

## 📊 Impacto

### Antes da correção:
- ✅ Upload funcionava
- ❌ Processamento poderia falhar
- ❌ Arquivos salvos localmente também
- ❌ Desperdício de espaço em disco

### Depois da correção:
- ✅ Upload funciona
- ✅ Processamento funciona
- ✅ Apenas Cloudinary é usado
- ✅ Sem arquivos locais

## 🔄 Migração de Arquivos Antigos

Se você tem sessões antigas com arquivos salvos localmente em `uploads/audio/`:

```bash
# Migrar e manter arquivos locais
npx tsx scripts/migrate-to-cloudinary.ts

# Migrar e deletar arquivos locais
npx tsx scripts/migrate-to-cloudinary.ts --delete-local
```

## 📚 Documentação Relacionada

- [Cloudinary Quickstart](../CLOUDINARY_QUICKSTART.md)
- [API de Processamento de Áudio](../audio/api-processamento-audio.md)
- [Integração Whisper](../audio/integracao-whisper.md)

## ✅ Checklist de Validação

- [x] Código corrigido
- [x] Sem erros de compilação
- [x] Upload vai apenas para Cloudinary
- [x] Transcrição funciona com URLs
- [x] Compatibilidade com arquivos locais antigos mantida
- [x] Documentação atualizada

---

**Implementado por**: GitHub Copilot  
**Revisado por**: Matheus  
**Status**: ✅ Em Produção
