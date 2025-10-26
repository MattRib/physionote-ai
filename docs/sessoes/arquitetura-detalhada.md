# 🏗️ Arquitetura Detalhada - Módulo de Sessões

**Última atualização:** 26 de outubro de 2025

---

## 🗄️ Modelos de Dados (Prisma)

### Session

```prisma
model Session {
  id            String   @id @default(cuid())
  patientId     String
  date          DateTime @default(now())
  durationMin   Int?
  sessionType   String?  // Ex: "Avaliação inicial", "Retorno"
  specialty     String?  // Ex: "Fisioterapia Ortopédica"
  motivation    String?  // Motivação/objetivo da consulta
  audioUrl      String?  // Caminho: /uploads/audio/[patientId]-[timestamp].webm
  audioSize     Int?     // Tamanho em bytes
  transcription String?  // Texto completo da transcrição
  status        String   @default("recording")
                         // Valores: recording | transcribing | generating | completed | error
  errorMessage  String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relações
  patient       Patient  @relation(fields: [patientId], references: [id])
  note          Note?    // 1:1 com Note
  
  @@index([patientId, date])
  @@index([status])
}
```

**Status Workflow:**
- `recording`: Em gravação (NÃO USADO com process-temp)
- `transcribing`: Transcrevendo com Whisper (NÃO USADO com process-temp)
- `generating`: Gerando nota com GPT (NÃO USADO com process-temp)
- **`completed`**: ✅ Sessão salva no prontuário (ÚNICO status real após save)
- `error`: Erro no processamento

**Observação:** Com o fluxo de duas fases, sessões criadas sempre têm `status='completed'` porque só são criadas após processamento bem-sucedido.

---

### Note

```prisma
model Note {
  id           String    @id @default(cuid())
  sessionId    String    @unique  // 1:1 com Session
  contentJson  String    // JSON estruturado da nota clínica
  aiGenerated  Boolean   @default(false)
  aiModel      String?   // Ex: "gpt-4o"
  aiPromptUsed String?   // Prompt usado (auditoria)
  reviewedBy   String?   // userId que revisou (futuro)
  reviewedAt   DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  session      Session   @relation(fields: [sessionId], references: [id])
}
```

**Estrutura do contentJson:**

```typescript
{
  "resumoExecutivo": {
    "queixaPrincipal": string,
    "nivelDor": number (0-10),
    "evolucao": string
  },
  "anamnese": {
    "historicoAtual": string,
    "antecedentesPessoais": string,
    "medicamentos": string,
    "objetivos": string
  },
  "diagnosticoFisioterapeutico": {
    "principal": string,
    "secundarios": string[],  // ⚠️ API retorna "secundarios", não "secundario"
    "cif": string
  },
  "intervencoes": {
    "tecnicasManuais": string[],
    "exerciciosTerapeuticos": string[],
    "recursosEletrotermo": string[]  // ⚠️ API usa nome abreviado
  },
  "respostaTratamento": {
    "imediata": string,
    "efeitos": string,
    "feedback": string
  },
  "orientacoes": {
    "domiciliares": string[],
    "ergonomicas": string[],
    "precaucoes": string[]
  },
  "planoTratamento": {
    "frequencia": string,
    "duracaoPrevista": string,
    "objetivosCurtoPrazo": string[],
    "objetivosLongoPrazo": string[],
    "criteriosAlta": string[]
  },
  "observacoesAdicionais": string,
  "proximaSessao": {
    "data": string,
    "foco": string
  }
}
```

---

## 🔌 APIs Implementadas

### 1. POST /api/sessions/process-temp

**Função:** Processar áudio temporariamente SEM criar no banco  
**Runtime:** nodejs  
**Max Duration:** 300 segundos (5 minutos)  
**Autenticação:** Não implementada

**Request (FormData):**
```
audio: File (audio/webm)
patientId: string
sessionType: string (opcional)
specialty: string (opcional)
processOnly: "true" (flag)
```

**Response Success (200):**
```json
{
  "success": true,
  "transcription": "Texto completo transcrito...",
  "note": {
    "resumoExecutivo": { ... },
    "anamnese": { ... },
    // ... estrutura completa
  },
  "message": "Processamento temporário concluído. Dados não foram salvos no banco."
}
```

**Response Error (400):**
```json
{
  "error": "Arquivo de áudio é obrigatório"
}
```

**Response Error (500):**
```json
{
  "error": "Erro ao processar áudio temporariamente",
  "details": "..."
}
```

**Fluxo Interno:**
1. Valida presença de audio e patientId
2. Cria diretório `/temp` se não existir
3. Salva audio como `temp-audio-[timestamp].webm`
4. Chama OpenAI Whisper API:
   ```typescript
   openai.audio.transcriptions.create({
     file: fs.createReadStream(tempAudioPath),
     model: 'whisper-1',
     language: 'pt',
     response_format: 'verbose_json'
   })
   ```
5. Chama OpenAI Chat API (GPT-4o):
   ```typescript
   openai.chat.completions.create({
     model: 'gpt-4o',
     messages: [
       { role: 'system', content: '...' },
       { role: 'user', content: prompt }
     ],
     temperature: 0.3,
     response_format: { type: 'json_object' }
   })
   ```
6. Deleta arquivo temporário (`fs.unlink`)
7. Retorna dados processados (não salva no DB)

**Logs:**
```
[Process Temp] Starting temporary processing...
[Process Temp] Audio: recording.webm, Size: 2.34MB
[Process Temp] Audio saved temporarily
[Process Temp] Starting Whisper transcription...
[Process Temp] Transcription completed: Paciente relata...
[Process Temp] Generating clinical note with GPT-4...
[Process Temp] Clinical note generated successfully
[Process Temp] Temporary file deleted
```

---

### 2. POST /api/sessions/save

**Função:** ÚNICA rota que cria Session + Note no banco  
**Runtime:** nodejs  
**Autenticação:** Não implementada

**Request (FormData):**
```
patientId: string (obrigatório)
transcription: string (obrigatório)
note: string (JSON stringified, obrigatório)
sessionType: string (opcional)
specialty: string (opcional)
durationMin: number (string, obrigatório)
audio: File (audio/webm, opcional mas recomendado)
```

**Response Success (201):**
```json
{
  "success": true,
  "sessionId": "cm2fvqk3k0000ywp37pv0n6b2",
  "noteId": "cm2fvqk3k0001ywp37pv0n6b3",
  "message": "Sessão salva com sucesso no prontuário do paciente"
}
```

**Response Error (400):**
```json
{
  "error": "Transcrição é obrigatória"
}
```

**Response Error (404):**
```json
{
  "error": "Paciente não encontrado"
}
```

**Fluxo Interno:**
1. Valida campos obrigatórios (patientId, transcription, note)
2. Busca paciente no banco (`prisma.patient.findUnique`)
3. **Se áudio fornecido:**
   - Cria diretório `/uploads/audio`
   - Salva como `[patientId]-[timestamp].webm`
   - Define audioUrl = `/uploads/audio/[filename]`
4. **Cria Session:**
   ```typescript
   const session = await prisma.session.create({
     data: {
       patientId,
       date: new Date(),
       durationMin,
       sessionType,
       specialty,
       audioUrl,
       audioSize,
       transcription,
       status: 'completed',  // 👈 Status final
       createdAt: new Date(),
       updatedAt: new Date()
     }
   });
   ```
5. **Cria Note:**
   ```typescript
   const note = await prisma.note.create({
     data: {
       sessionId: session.id,
       contentJson: noteJson,
       aiGenerated: true,
       aiModel: 'gpt-4o',
       aiPromptUsed: 'Geração de nota clínica fisioterapêutica estruturada',
       createdAt: new Date(),
       updatedAt: new Date()
     }
   });
   ```
6. Retorna sucesso com IDs criados

**⚠️ Observação Crítica:** Esta rota NÃO valida se o áudio já foi processado. Confia que o frontend só chama após `process-temp` bem-sucedido.

**Logs:**
```
[Save Session] Starting save process...
[Save Session] Patient ID: cm2..., Duration: 30min
[Save Session] Audio saved: /uploads/audio/cm2...-1730000000000.webm
[Save Session] Session created: cm2...
[Save Session] Note created: cm2...
[Save Session] ✅ Session saved successfully in patient record
```

---

### 3. GET /api/sessions

**Função:** Listar sessões com filtros  
**Query Params:**
- `patientId` (string): Filtrar por paciente
- `status` (string): Filtrar por status (recording | transcribing | generating | completed | error | all)
- `limit` (number): Limitar resultados
- `dateRange` (string): Filtrar por período (today | yesterday | week | month | all)
- `search` (string): Buscar por nome do paciente

**Response (200):**
```json
[
  {
    "id": "cm2...",
    "patientId": "cm2...",
    "date": "2025-10-26T14:30:00.000Z",
    "durationMin": 30,
    "sessionType": "Retorno",
    "specialty": "Fisioterapia Ortopédica",
    "motivation": null,
    "audioUrl": "/uploads/audio/...",
    "audioSize": 2457600,
    "transcription": "...",
    "status": "completed",
    "errorMessage": null,
    "createdAt": "2025-10-26T14:30:00.000Z",
    "updatedAt": "2025-10-26T14:30:00.000Z",
    "patient": {
      "id": "cm2...",
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "(11) 98765-4321"
    },
    "note": {
      "id": "cm2...",
      "aiGenerated": true,
      "aiModel": "gpt-4o"
    }
  }
]
```

**Ordenação:** `date desc` (mais recentes primeiro)

---

### 4. GET /api/sessions/[id]

**Função:** Buscar sessão específica por ID  
**Include:** patient (dados completos), note (contentJson completo)

**Response (200):**
```json
{
  "id": "cm2...",
  "patientId": "cm2...",
  "date": "2025-10-26T14:30:00.000Z",
  // ... todos os campos da sessão
  "patient": {
    "id": "cm2...",
    "name": "João Silva",
    // ... dados completos do paciente
  },
  "note": {
    "id": "cm2...",
    "sessionId": "cm2...",
    "contentJson": "{ ... }", // JSON stringified
    "aiGenerated": true,
    "aiModel": "gpt-4o",
    "aiPromptUsed": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Response Error (404):**
```json
{
  "error": "Sessão não encontrada"
}
```

---

### 5. PUT /api/sessions/[id]

**Função:** Atualizar sessão existente  
**Permite atualizar:** durationMin, sessionType, specialty, motivation, transcription, status

**Request Body:**
```json
{
  "durationMin": 45,
  "sessionType": "Retorno",
  "specialty": "Fisioterapia Esportiva",
  "motivation": "Dor no joelho após corrida"
}
```

**Response (200):** Sessão atualizada completa

---

### 6. DELETE /api/sessions/[id]

**Função:** Excluir sessão (e nota vinculada automaticamente por cascade)

**Response Success (200):**
```json
{
  "message": "Sessão deletada com sucesso"
}
```

**Response Error (404):**
```json
{
  "error": "Sessão não encontrada"
}
```

---

## 📁 Estrutura de Arquivos Completa

```
src/
├── app/
│   ├── dashboard/
│   │   ├── new-session/
│   │   │   └── page.tsx           # Seleção de paciente (NewSessionFlow)
│   │   └── session/
│   │       └── page.tsx           # Gravação de sessão (SessionView)
│   └── api/
│       └── sessions/
│           ├── route.ts           # GET (lista) + POST (criar - NÃO USADO)
│           ├── process-temp/
│           │   └── route.ts       # ⭐ POST - Processar SEM salvar
│           ├── save/
│           │   └── route.ts       # ⭐ POST - Salvar no banco (ÚNICO)
│           └── [id]/
│               ├── route.ts       # GET + PUT + DELETE
│               ├── audio/
│               │   └── route.ts   # POST - Upload de áudio adicional
│               └── process/
│                   └── route.ts   # POST - Processar sessão existente
│
├── components/
│   └── session/
│       ├── SessionView.tsx        # Container principal (542 linhas)
│       ├── PatientSelector.tsx    # Dropdown de pacientes
│       ├── TranscriptionPanel.tsx # Painel de transcrição (NÃO USADO atualmente)
│       ├── SessionSummary.tsx     # Export wrapper
│       ├── SessionSummary_fullscreen.tsx  # ⭐ Tela de revisão (1060 linhas)
│       ├── NoteAIDisclaimer.tsx   # Disclaimer sobre IA
│       └── index.ts               # Exports
│
├── server/
│   ├── openai.ts                  # Cliente OpenAI singleton
│   ├── transcription.ts           # Funções auxiliares Whisper (se houver)
│   └── note-generation.ts         # Funções auxiliares GPT (se houver)
│
└── public/
    └── animations/
        └── audio-recording.json   # Animação Lottie (microfone pulsando)
```

---

## 🎨 Design e UX

### Estados da Interface

#### 1. Seleção de Paciente (`NewSessionFlow`)
```
┌─────────────────────────────────────────┐
│  Selecione o Paciente                   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔍 Buscar paciente...           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  👤 João Silva                          │
│     Última sessão: 20/10/2025          │
│                                         │
│  👤 Maria Santos                        │
│     Última sessão: 18/10/2025          │
│                                         │
│  [Iniciar Sessão] [Cancelar]           │
└─────────────────────────────────────────┘
```

#### 2. Gravação (`SessionView`)
```
┌──────────────────────────────────────────────────┐
│ 👤 João Silva          ⏱️ 00:15:32  [X] Cancelar │
├──────────────────────────────────────────────────┤
│                                                  │
│              🎙️ (Animação Lottie)              │
│                   Gravando...                    │
│                                                  │
│            [⏹️ Parar Gravação]                   │
│                                                  │
│  Status: Capturando áudio...                    │
│  Tamanho: 2.34 MB                               │
└──────────────────────────────────────────────────┘
```

#### 3. Processando
```
┌──────────────────────────────────────────────────┐
│          ⏳ Processando sessão...               │
│                                                  │
│  ✓ Finalizando gravação                         │
│  ✓ Preparando áudio                             │
│  ⏳ Transcrevendo com IA...                      │
│  ⏸️ Gerando nota clínica...                      │
│                                                  │
│  [Aguarde, isso pode levar alguns minutos]      │
└──────────────────────────────────────────────────┘
```

#### 4. Revisão de Nota (`SessionSummary_fullscreen`)
```
┌──────────────────────────────────────────────────┐
│ 📋 Sessão com João Silva - 30 minutos           │
├──────────────────────────────────────────────────┤
│                                                  │
│  ⚠️ Nota Gerada por IA - Revisão Obrigatória   │
│                                                  │
│  ▼ Resumo Executivo                             │
│    Queixa Principal: [editável]                 │
│    Nível de Dor: 7/10                           │
│    Evolução: [editável]                         │
│                                                  │
│  ▼ Anamnese                                     │
│    Histórico Atual: [editável]                  │
│    ...                                          │
│                                                  │
│  ▼ Diagnóstico Fisioterapêutico                 │
│  ▼ Intervenções                                 │
│  ▼ Resposta ao Tratamento                       │
│  ▼ Orientações                                  │
│  ▼ Plano de Tratamento                          │
│  ▼ Observações Adicionais                       │
│  ▼ Próxima Sessão                               │
│  ▼ Transcrição Completa                         │
│                                                  │
│  [💾 Salvar Sessão] [🗑️ Descartar]             │
└──────────────────────────────────────────────────┘
```

---

## ⚠️ Regras de Negócio Críticas

### 1. Duas Fases Obrigatórias

**Regra:** Sessões **NÃO podem** ser criadas diretamente no banco. Devem passar por:
1. Processamento temporário (`process-temp`)
2. Revisão do usuário
3. Salvamento definitivo (`save`)

**Validação:** Frontend não chama `save` sem dados do `process-temp`

**Motivo:** Garantir qualidade e precisão das notas clínicas no prontuário

---

### 2. Status 'completed' Único

**Regra:** Com fluxo de duas fases, todas as sessões salvas têm `status='completed'`

**Motivo:** Não há estados intermediários (recording, transcribing, generating) porque processamento acontece fora do banco

**Exceção:** `status='error'` pode ser usado no futuro para sessões que falharam após salvamento

---

### 3. Nota Sempre Revisável

**Regra:** Nota gerada pela IA é um **rascunho** que DEVE ser revisado

**Implementação:**
- Componente `NoteAIDisclaimer` exibe aviso
- Todos os campos são editáveis
- Arrays podem ter itens adicionados/removidos
- Usuário pode reescrever completamente

**Responsabilidade:** Fisioterapeuta é responsável pela precisão final da nota

---

### 4. Áudio Permanente

**Regra:** Áudio salvo em `/uploads/audio/` é permanente

**Estrutura:** `[patientId]-[timestamp].webm`

**Motivo:** Permitir reprocessamento futuro ou auditoria

**Consideração:** Espaço em disco cresce com o tempo (planejar backup/archiving)

---

### 5. Transcrição Imutável Após Salvamento

**Regra:** `transcription` no banco é a original do Whisper

**Motivo:** Preservar registro exato do que foi dito

**Edição:** Notas podem ser editadas, mas transcrição permanece inalterada

---

## 🧪 Testes Necessários

### Testes de Integração

```typescript
describe('POST /api/sessions/process-temp', () => {
  it('should process audio and return transcription + note', async () => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'test.webm');
    formData.append('patientId', 'cm2test123');
    
    const response = await fetch('/api/sessions/process-temp', {
      method: 'POST',
      body: formData
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.transcription).toBeDefined();
    expect(data.note).toBeDefined();
    expect(data.note.resumoExecutivo).toBeDefined();
  });

  it('should reject request without audio', async () => {
    const formData = new FormData();
    formData.append('patientId', 'cm2test123');
    
    const response = await fetch('/api/sessions/process-temp', {
      method: 'POST',
      body: formData
    });
    
    expect(response.status).toBe(400);
  });
});

describe('POST /api/sessions/save', () => {
  it('should create session + note in database', async () => {
    const formData = new FormData();
    formData.append('patientId', 'cm2test123');
    formData.append('transcription', 'Teste de transcrição');
    formData.append('note', JSON.stringify(mockNote));
    formData.append('durationMin', '30');
    formData.append('audio', audioBlob, 'test.webm');
    
    const response = await fetch('/api/sessions/save', {
      method: 'POST',
      body: formData
    });
    
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.sessionId).toBeDefined();
    expect(data.noteId).toBeDefined();
    
    // Verificar no banco
    const session = await prisma.session.findUnique({
      where: { id: data.sessionId },
      include: { note: true }
    });
    expect(session).toBeDefined();
    expect(session.status).toBe('completed');
    expect(session.note).toBeDefined();
  });

  it('should reject save without required fields', async () => {
    const formData = new FormData();
    formData.append('patientId', 'cm2test123');
    // Faltando transcription e note
    
    const response = await fetch('/api/sessions/save', {
      method: 'POST',
      body: formData
    });
    
    expect(response.status).toBe(400);
  });
});
```

---

## 📚 Documentação Relacionada

- 📁 `docs/sessoes/fluxo-sessoes.md` - Fluxo detalhado das duas fases
- 📁 `docs/sessoes/api-sessoes.md` - Documentação completa de todos os endpoints
- 📁 `docs/audio/` - Integração Whisper e processamento de áudio
- 📁 `docs/pacientes/` - Relação com módulo de pacientes
- 📁 `docs/prontuario/` - Visualização das sessões no prontuário

---

**Status:** ✅ Documentação completa e atualizada  
**Última verificação:** 26 de outubro de 2025
