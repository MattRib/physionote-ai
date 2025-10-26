# 🎉 Backend de Processamento de Áudio - IMPLEMENTADO

## ✅ O que foi implementado

### 1. **Serviços principais** (`src/server/`)

#### `openai.ts` - Configuração OpenAI
- Client singleton
- Constantes: `WHISPER_MODEL`, `GPT_MODEL`, `MAX_AUDIO_SIZE`

#### `storage.ts` - Gerenciamento de arquivos
- `saveAudioFile()` - Salva áudio em `.data/audio/`
- `readAudioFile()` - Lê arquivo
- `deleteAudioFile()` - Remove arquivo
- `getAudioPath()` - Retorna caminho completo
- `ensureAudioDir()` - Cria diretório se não existir

#### `transcription.ts` - Transcrição com Whisper
- `transcribeAudio()` - Envia áudio para Whisper API
- Retorna: texto, duração, idioma detectado
- Formato verbose_json para metadados

#### `note-generation.ts` - Geração de nota com GPT-4
- `generateNoteFromTranscription()` - Processa transcrição
- Prompt estruturado com contexto do paciente
- Retorna JSON estruturado (12 seções)
- Temperature 0.3 (baixa criatividade)
- response_format: json_object

---

### 2. **APIs implementadas** (`src/app/api/`)

#### `POST /api/sessions/:id/audio`
**Função:** Upload de arquivo de áudio

**Features:**
- Validação de tamanho (25MB max)
- Validação de formato (mp3, wav, mp4, webm, m4a)
- Salva em `.data/audio/` com UUID
- Atualiza status da sessão para "transcribing"

**Request:**
```http
POST /api/sessions/{sessionId}/audio
Content-Type: multipart/form-data

audio: [arquivo]
```

**Response:**
```json
{
  "message": "Áudio enviado com sucesso",
  "session": {
    "id": "...",
    "audioUrl": "uuid.mp3",
    "audioSize": 1234567,
    "status": "transcribing"
  }
}
```

---

#### `POST /api/sessions/:id/process`
**Função:** Transcrição + geração de nota

**Fluxo:**
1. Busca sessão + paciente
2. Valida que áudio existe
3. **Whisper:** Transcreve áudio (pt-BR)
4. Salva transcrição no banco
5. **GPT-4:** Gera nota estruturada
6. Salva nota no banco (upsert)
7. Marca sessão como "completed"

**Estados:**
- `recording` → `transcribing` → `generating` → `completed`
- Em caso de erro: `error` + `errorMessage`

**Response:**
```json
{
  "message": "Processamento concluído com sucesso",
  "session": { ... },
  "transcription": "texto completo...",
  "note": {
    "resumoExecutivo": {
      "queixaPrincipal": "...",
      "nivelDor": 7,
      "evolucao": "melhora"
    },
    "anamnese": { ... },
    "diagnosticoFisioterapeutico": { ... },
    "intervencoes": {
      "tecnicasManuais": ["..."],
      "exerciciosTerapeuticos": ["..."]
    },
    "respostaTratamento": { ... },
    "orientacoes": { ... },
    "planoTratamento": { ... },
    "observacoesAdicionais": "...",
    "proximaSessao": { ... }
  }
}
```

---

### 3. **Schema Prisma** (atualizado)

#### Model Session
```prisma
model Session {
  id            String    @id @default(cuid())
  patientId     String
  date          DateTime  @default(now())
  durationMin   Int?
  audioUrl      String?       // 🆕 Nome do arquivo
  audioSize     Int?          // 🆕 Tamanho em bytes
  transcription String?       // 🆕 Texto da transcrição
  status        String    @default("recording") // 🆕 Estado
  errorMessage  String?       // 🆕 Erro se houver
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  patient       Patient   @relation(...)
  note          Note?

  @@index([patientId, date])
  @@index([status])           // 🆕 Índice
}
```

#### Model Note
```prisma
model Note {
  id           String    @id @default(cuid())
  sessionId    String    @unique
  contentJson  String
  aiGenerated  Boolean   @default(false)
  aiModel      String?
  aiPromptUsed String?   // 🆕 Auditoria do prompt
  reviewedBy   String?   // 🆕 Futuro: quem revisou
  reviewedAt   DateTime? // 🆕 Quando foi revisado
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  session      Session   @relation(...)
}
```

---

## 🧪 Como testar (passo a passo)

### 1. Configurar ambiente

```bash
# Copiar .env.example para .env
cp .env.example .env

# Editar .env e adicionar sua chave OpenAI
# OPENAI_API_KEY="sk-proj-..."

# Migration já foi aplicada, mas para garantir:
npx prisma migrate dev
npx prisma generate

# Criar diretório de áudio
mkdir .data\audio
```

---

### 2. Iniciar servidor

```bash
npm run dev
```

Servidor estará em: http://localhost:3000

---

### 3. Testar com Postman/Thunder Client

#### Passo 1: Criar paciente
```http
POST http://localhost:3000/api/patients
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@test.com",
  "birthDate": "1985-03-15",
  "gender": "Masculino"
}
```

**Copie o `id` do paciente retornado!**

---

#### Passo 2: Criar sessão
```http
POST http://localhost:3000/api/patients/{PATIENT_ID}/sessions
Content-Type: application/json

{
  "durationMin": 45
}
```

**Copie o `id` da sessão retornado!**

---

#### Passo 3: Upload de áudio
```http
POST http://localhost:3000/api/sessions/{SESSION_ID}/audio
Content-Type: multipart/form-data

# No Postman/Thunder Client:
# - Adicione um campo "audio" do tipo File
# - Selecione um arquivo .mp3/.wav/.m4a
```

**Resposta esperada:**
```json
{
  "message": "Áudio enviado com sucesso",
  "session": {
    "status": "transcribing",
    "audioUrl": "abc123.mp3"
  }
}
```

---

#### Passo 4: Processar (transcrição + nota)
```http
POST http://localhost:3000/api/sessions/{SESSION_ID}/process
```

**⏱️ Pode demorar 30-60 segundos!**

**Resposta esperada:**
```json
{
  "message": "Processamento concluído com sucesso",
  "transcription": "Paciente relata dor lombar há 3 semanas...",
  "note": {
    "resumoExecutivo": { ... },
    "anamnese": { ... },
    ...
  }
}
```

---

#### Passo 5: Buscar nota (opcional)
```http
GET http://localhost:3000/api/sessions/{SESSION_ID}/note
```

---

## 📊 Estrutura da nota gerada (JSON)

```typescript
{
  resumoExecutivo: {
    queixaPrincipal: string;
    nivelDor?: number; // 0-10
    evolucao?: "melhora" | "estável" | "piora";
  };
  anamnese?: {
    historicoAtual?: string;
    antecedentesPessoais?: string;
    medicamentos?: string;
    objetivos?: string;
  };
  diagnosticoFisioterapeutico?: {
    principal?: string;
    secundarios?: string[];
    cif?: string; // Código CIF
  };
  intervencoes?: {
    tecnicasManuais?: string[];
    exerciciosTerapeuticos?: string[];
    recursosEletrotermo?: string[];
  };
  respostaTratamento?: {
    imediata?: string;
    efeitos?: string;
    feedback?: string;
  };
  orientacoes?: {
    domiciliares?: string[];
    ergonomicas?: string[];
    precaucoes?: string[];
  };
  planoTratamento?: {
    frequencia?: string;
    duracaoPrevista?: string;
    objetivosCurtoPrazo?: string[];
    objetivosLongoPrazo?: string[];
    criteriosAlta?: string[];
  };
  observacoesAdicionais?: string;
  proximaSessao?: {
    data?: string; // ISO date
    foco?: string;
  };
}
```

---

## 🚨 Erros comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `OPENAI_API_KEY not found` | Chave não configurada | Adicionar no `.env` e reiniciar servidor |
| `Arquivo muito grande` | Áudio > 25MB | Comprimir ou reduzir qualidade |
| `Formato não suportado` | Tipo MIME inválido | Usar: mp3, wav, mp4, webm, m4a |
| `Sessão não possui áudio` | Tentou processar sem upload | Fazer upload primeiro |
| Timeout em `/process` | Áudio muito longo | Aumentar `maxDuration` ou usar queue |

---

## 📁 Arquivos criados/modificados

### Criados:
```
src/server/
├── openai.ts              ✅ Client OpenAI
├── storage.ts             ✅ Gerenciamento de áudio
├── transcription.ts       ✅ Whisper API
└── note-generation.ts     ✅ GPT-4 prompt

src/app/api/sessions/[id]/
├── audio/
│   └── route.ts          ✅ Upload de áudio
└── process/
    └── route.ts          ✅ Transcrição + nota

docs/
└── AUDIO_PROCESSING_API.md  ✅ Documentação completa
```

### Modificados:
```
prisma/schema.prisma       ✅ Novos campos Session/Note
.env.example               ✅ OPENAI_API_KEY
```

---

## ✅ Status atual

- [x] Instalado `openai` npm package
- [x] Configuração OpenAI (`src/server/openai.ts`)
- [x] Storage de áudio (`src/server/storage.ts`)
- [x] Serviço de transcrição (`src/server/transcription.ts`)
- [x] Serviço de geração de nota (`src/server/note-generation.ts`)
- [x] Schema Prisma atualizado
- [x] Migration aplicada
- [x] API de upload (`/api/sessions/:id/audio`)
- [x] API de processamento (`/api/sessions/:id/process`)
- [x] `.env.example` atualizado
- [x] Documentação completa
- [x] **Build passa sem erros** ✅

---

## 🚀 Próximos passos

### Integração com frontend:
1. Capturar áudio no browser (MediaRecorder API)
2. Fazer upload via `fetch()` + FormData
3. Polling ou SSE para status da sessão
4. Exibir transcrição + nota gerada
5. Permitir edição da nota antes de salvar

### Melhorias backend:
1. Processamento assíncrono (queue: BullMQ/Inngest)
2. Webhook para notificar conclusão
3. Storage em nuvem (S3/R2)
4. Streaming de transcrição (SSE)
5. Retry automático em caso de erro
6. Rate limiting

Quer que eu comece a integração com o frontend agora?
