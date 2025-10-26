# Fluxo de Sessões - PhysioNote.AI

**Última atualização:** 26 de outubro de 2025  
**Status:** ✅ Implementado e funcionando

---

## 🎯 Visão Geral

O sistema implementa um **fluxo de duas fases** para criação de sessões, garantindo que o usuário possa revisar e editar as notas geradas pela IA antes de salvar definitivamente no prontuário do paciente.

---

## 📋 Arquitetura da Solução

### Princípio Fundamental

**Sessões só são salvas no banco de dados após confirmação do usuário.**

Isso evita:
- ❌ Sessões duplicadas
- ❌ Notas não revisadas no prontuário
- ❌ Poluição do banco com sessões incompletas
- ✅ Garante qualidade e precisão dos registros

---

## 🔄 Fluxo Completo (Gravação ao Vivo)

### Fase 1: Processamento Temporário (SEM salvar no banco)

```
1. Usuário acessa /dashboard/new-session
   ↓
2. Seleciona paciente no NewSessionFlow
   - NÃO cria sessão no banco ainda
   ↓
3. NewSessionFlow redireciona para /dashboard/session
   - Passa: patientId, patientName via URL params
   ↓
4. SessionView inicia gravação de áudio (MediaRecorder API)
   - Captura áudio em chunks
   - Timer conta duração
   ↓
5. Usuário clica em "Parar Gravação"
   ↓
6. SessionView chama POST /api/sessions/process-temp
   - Envia: audioBlob + patientId + sessionType + specialty
   - Backend:
     a) Salva áudio em /temp (temporário)
     b) Transcreve com Whisper-1
     c) Gera nota com GPT-4o
     d) NÃO salva no banco de dados
     e) Retorna: transcrição + nota + áudio temporário
   ↓
7. SessionView exibe SessionSummary_fullscreen
   - Mostra nota estruturada (editável)
   - Exibe transcrição completa
   - Usuário pode editar todos os campos
   ↓
```

### Fase 2: Salvamento Definitivo (Criação no banco)

```
8. Usuário revisa e edita a nota
   ↓
9. Usuário clica em "Salvar Sessão"
   ↓
10. SessionView chama POST /api/sessions/save
    - Envia: patientId + note + transcription + sessionData
    - Backend:
      a) Move áudio de /temp para /uploads/audio/
      b) Cria Session com status 'completed'
      c) Cria Note vinculada
      d) Tudo em transação única
    - ✅ ÚNICA criação de sessão no banco
   ↓
11. Redireciona para /dashboard
    - Sessão aparece no prontuário do paciente
```

---

## 🚫 Fluxo Incorreto (EVITAR)

```
❌ NÃO FAZER:
1. Criar sessão com POST /api/sessions antes da gravação
2. Atualizar sessão com PUT /api/sessions após processamento
3. Resultado: sessão fica no banco mesmo se usuário descartar
```

---

## 🔌 APIs Utilizadas

### 1. `/api/sessions/process-temp` (POST)

**Propósito:** Processar áudio temporariamente SEM salvar no banco

**Request:**
```typescript
FormData {
  audio: Blob,           // Arquivo de áudio
  patientId: string,     // ID do paciente
  sessionType: string,   // Ex: "Avaliação inicial"
  specialty: string,     // Ex: "Fisioterapia Ortopédica"
  motivation?: string    // Motivação da consulta
}
```

**Response:**
```json
{
  "transcription": "Texto completo da transcrição...",
  "note": {
    "resumoExecutivo": { ... },
    "anamnese": { ... },
    // ... campos estruturados
  },
  "audioUrl": "/temp/uuid.webm",  // Temporário
  "duration": 1800,  // segundos
  "model": "gpt-4o"
}
```

**Características:**
- ✅ Não cria registros no banco
- ✅ Salva áudio em `/temp` (limpeza automática)
- ✅ Timeout: 300 segundos (5 minutos)
- ✅ Retorna dados para revisão

### 2. `/api/sessions/save` (POST)

**Propósito:** Criar sessão completa no prontuário (ÚNICA criação no banco)

**Request:**
```typescript
{
  patientId: string,
  date: string,          // ISO date
  durationMin: number,
  sessionType: string,
  specialty: string,
  motivation?: string,
  audioBlob: string,     // Base64 ou URL do temp
  transcription: string,
  note: {
    // ... objeto completo da nota
  }
}
```

**Response:**
```json
{
  "message": "Sessão salva com sucesso",
  "session": {
    "id": "session_clxxxx",
    "patientId": "patient_clxxxx",
    "status": "completed",
    "audioUrl": "uuid.webm",
    "transcription": "...",
    ...
  },
  "note": {
    "id": "note_clxxxx",
    "sessionId": "session_clxxxx",
    "contentJson": "{...}",
    "aiGenerated": true,
    "aiModel": "gpt-4o"
  }
}
```

**Características:**
- ✅ Cria Session + Note em transação
- ✅ Move áudio de /temp para /uploads/audio/
- ✅ Status final: `completed`
- ✅ Sessão visível no prontuário

### 3. `/api/sessions` (POST) - ⚠️ Uso Limitado

**Propósito:** Criar sessão temporária para upload de áudio (modo assíncrono)

**Quando usar:**
- Upload de arquivo de áudio pré-gravado
- Processamento em background com webhook

**Quando NÃO usar:**
- ❌ Gravação ao vivo
- ❌ Fluxo com revisão de nota

---

## 📊 Estados da Sessão

```
┌─────────────────┐
│ Não existe      │ ← Estado inicial (nada no banco)
└────────┬────────┘
         │
         │ Usuário grava áudio
         ↓
┌─────────────────┐
│ Processando     │ ← /process-temp (em memória)
│ - Transcrevendo │
│ - Gerando nota  │
└────────┬────────┘
         │
         │ Retorna dados para revisão
         ↓
┌─────────────────┐
│ Revisão         │ ← SessionSummary (usuário edita)
│ (em memória)    │
└────────┬────────┘
         │
         │ Usuário confirma
         ↓
┌─────────────────┐
│ Completed       │ ← /save (criação no banco)
│ (no banco)      │   Status: 'completed'
└─────────────────┘
```

---

## 🗂️ Arquivos Modificados

### **src/components/session/SessionView.tsx**

**Mudanças principais:**
- Removida criação de sessão antes da gravação
- Chama `/process-temp` ao finalizar gravação
- Chama `/save` apenas quando usuário confirma
- Gerencia estados: gravando → processando → revisando → salvo

**Código relevante:**
```typescript
const handleStopSession = async () => {
  // 1. Para gravação
  mediaRecorderRef.current?.stop();
  
  // 2. Cria blob de áudio
  const audioBlob = new Blob(audioChunksRef.current, { 
    type: 'audio/webm' 
  });
  
  // 3. Processa temporariamente (SEM salvar)
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  formData.append('patientId', selectedPatient.id);
  // ... outros campos
  
  const response = await fetch('/api/sessions/process-temp', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  // 4. Exibe para revisão
  setShowSummary(true);
};

const handleSaveSession = async (editedNote) => {
  // Salva definitivamente no banco
  await fetch('/api/sessions/save', {
    method: 'POST',
    body: JSON.stringify({
      patientId: selectedPatient.id,
      note: editedNote,
      transcription: transcription.join(' '),
      // ... outros campos
    })
  });
  
  router.push('/dashboard');
};
```

### **src/app/api/sessions/process-temp/route.ts**

**Responsabilidades:**
- Receber áudio via FormData
- Salvar temporariamente em `/temp`
- Transcrever com Whisper-1
- Gerar nota com GPT-4o
- Retornar tudo (NÃO salva no banco)

**Configuração:**
```typescript
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutos
```

### **src/app/api/sessions/save/route.ts**

**Responsabilidades:**
- Receber dados completos da sessão
- Mover áudio de /temp para /uploads/audio/
- Criar Session no banco (status: `completed`)
- Criar Note vinculada
- Usar transação Prisma

**Código relevante:**
```typescript
export async function POST(req: NextRequest) {
  const data = await req.json();
  
  // Transação atômica
  const result = await prisma.$transaction(async (tx) => {
    // 1. Criar sessão
    const session = await tx.session.create({
      data: {
        patientId: data.patientId,
        status: 'completed',
        audioUrl: movedAudioPath,
        transcription: data.transcription,
        // ...
      }
    });
    
    // 2. Criar nota
    const note = await tx.note.create({
      data: {
        sessionId: session.id,
        contentJson: JSON.stringify(data.note),
        aiGenerated: true,
        aiModel: 'gpt-4o'
      }
    });
    
    return { session, note };
  });
  
  return NextResponse.json(result);
}
```

---

## ✅ Verificação de Funcionamento

### Como testar:

1. **Iniciar nova sessão:**
   ```
   http://localhost:3000/dashboard/new-session
   ```

2. **Selecionar paciente e gravar 10 segundos**

3. **Verificar banco ANTES de salvar:**
   ```bash
   npx prisma studio
   # Tabela Session deve estar VAZIA (ou sem nova sessão)
   ```

4. **Parar gravação e aguardar processamento**
   - Deve exibir tela de resumo

5. **Verificar banco AINDA SEM sessão**

6. **Clicar em "Salvar Sessão"**

7. **Verificar banco APÓS salvar:**
   ```bash
   npx prisma studio
   # Tabela Session: 1 nova sessão (status: completed)
   # Tabela Note: 1 nova nota vinculada
   ```

8. **Resultado esperado: 1 sessão criada apenas**

---

## 🚀 Benefícios da Arquitetura

### ✅ Vantagens:

1. **Zero duplicação:** Sessão criada apenas uma vez
2. **Qualidade:** Usuário revisa antes de salvar
3. **Flexibilidade:** Pode descartar sem poluir banco
4. **Performance:** Processamento em memória é rápido
5. **UX:** Feedback imediato, salvamento explícito

### 🎯 Casos de uso suportados:

- ✅ Gravação ao vivo com revisão
- ✅ Edição de campos antes de salvar
- ✅ Descarte de sessões (sem registro no banco)
- ✅ Processamento de 5+ minutos de áudio
- ✅ Múltiplas tentativas (retry) sem criar duplicatas

---

## 🔮 Melhorias Futuras

- [ ] Cache de áudios temporários (redis)
- [ ] Processamento em queue para áudios longos (>10 min)
- [ ] Webhook para notificar conclusão assíncrona
- [ ] Rascunhos salvos localmente (localStorage)
- [ ] Versionamento de notas editadas
- [ ] Histórico de revisões

---

**Documentado por:** GitHub Copilot  
**Data:** 26 de outubro de 2025  
**Versão:** 3.0 - Fluxo de Duas Fases
