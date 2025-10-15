# Documentação: Backend de Sessões

## 📋 Visão Geral

Implementação completa do backend para gerenciamento de sessões de fisioterapia, incluindo criação, listagem, atualização e processamento de áudio com IA.

---

## 🗂️ Estrutura de Endpoints

### 1. **POST /api/sessions** - Criar Nova Sessão

**Descrição**: Cria uma nova sessão de atendimento vinculada a um paciente.

**Request Body**:
```json
{
  "patientId": "clxxxx",
  "sessionType": "Avaliação inicial",
  "specialty": "Fisioterapia Ortopédica",
  "motivation": "Dor lombar persistente há 2 meses",
  "durationMin": 60
}
```

**Validação** (Zod Schema):
- `patientId`: string obrigatória (min: 1)
- `sessionType`: string opcional
- `specialty`: string opcional
- `motivation`: string opcional
- `durationMin`: número opcional

**Response Success (201)**:
```json
{
  "id": "clxxxxx",
  "session": {
    "id": "clxxxxx",
    "patientId": "clxxxx",
    "date": "2025-10-15T19:21:00.000Z",
    "durationMin": 60,
    "sessionType": "Avaliação inicial",
    "specialty": "Fisioterapia Ortopédica",
    "motivation": "Dor lombar persistente há 2 meses",
    "status": "recording",
    "audioUrl": null,
    "audioSize": null,
    "transcription": null,
    "errorMessage": null,
    "createdAt": "2025-10-15T19:21:00.000Z",
    "updatedAt": "2025-10-15T19:21:00.000Z",
    "patient": {
      "id": "clxxxx",
      "name": "João Silva",
      "email": "joao@example.com",
      "phone": "(11) 98765-4321"
    }
  },
  "message": "Sessão criada com sucesso"
}
```

**Response Error (404)**:
```json
{
  "error": "Paciente não encontrado"
}
```

**Response Error (400)**:
```json
{
  "error": "Dados inválidos",
  "details": [...]
}
```

---

### 2. **GET /api/sessions** - Listar Sessões

**Descrição**: Lista todas as sessões com filtros opcionais.

**Query Parameters**:
- `patientId` (opcional): Filtrar por ID do paciente
- `status` (opcional): Filtrar por status (`recording`, `transcribing`, `generating`, `completed`, `error`)
- `limit` (opcional): Limitar número de resultados

**Exemplos**:
- `/api/sessions` - Todas as sessões
- `/api/sessions?patientId=clxxxx` - Sessões de um paciente
- `/api/sessions?status=completed&limit=10` - 10 últimas sessões concluídas

**Response Success (200)**:
```json
[
  {
    "id": "clxxxxx",
    "patientId": "clxxxx",
    "date": "2025-10-15T19:21:00.000Z",
    "durationMin": 60,
    "sessionType": "Retorno",
    "specialty": "Fisioterapia Ortopédica",
    "motivation": "Acompanhamento pós-tratamento",
    "status": "completed",
    "audioUrl": "audio-clxxxxx.webm",
    "audioSize": 2048000,
    "transcription": "Paciente relata melhora...",
    "errorMessage": null,
    "createdAt": "2025-10-15T19:21:00.000Z",
    "updatedAt": "2025-10-15T19:25:00.000Z",
    "patient": {
      "id": "clxxxx",
      "name": "João Silva",
      "email": "joao@example.com",
      "phone": "(11) 98765-4321"
    },
    "note": {
      "id": "clxxxxx",
      "aiGenerated": true,
      "aiModel": "gpt-4-turbo-preview"
    }
  }
]
```

---

### 3. **GET /api/sessions/[id]** - Buscar Sessão por ID

**Descrição**: Retorna detalhes completos de uma sessão específica.

**Response Success (200)**:
```json
{
  "id": "clxxxxx",
  "patientId": "clxxxx",
  "date": "2025-10-15T19:21:00.000Z",
  "durationMin": 60,
  "sessionType": "Retorno",
  "specialty": "Fisioterapia Ortopédica",
  "motivation": "Acompanhamento pós-tratamento",
  "status": "completed",
  "audioUrl": "audio-clxxxxx.webm",
  "audioSize": 2048000,
  "transcription": "Paciente relata melhora significativa...",
  "errorMessage": null,
  "createdAt": "2025-10-15T19:21:00.000Z",
  "updatedAt": "2025-10-15T19:25:00.000Z",
  "patient": {
    "id": "clxxxx",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "(11) 98765-4321",
    "birthDate": "1990-05-15T00:00:00.000Z",
    "gender": "masculino"
  },
  "note": {
    "id": "clxxxxx",
    "sessionId": "clxxxxx",
    "contentJson": "{\"subjectivo\": \"...\", \"objetivo\": \"...\"}",
    "aiGenerated": true,
    "aiModel": "gpt-4-turbo-preview",
    "aiPromptUsed": "...",
    "reviewedBy": null,
    "reviewedAt": null,
    "createdAt": "2025-10-15T19:25:00.000Z",
    "updatedAt": "2025-10-15T19:25:00.000Z"
  }
}
```

**Response Error (404)**:
```json
{
  "error": "Sessão não encontrada"
}
```

---

### 4. **PATCH /api/sessions/[id]** - Atualizar Sessão

**Descrição**: Atualiza campos específicos de uma sessão.

**Request Body** (todos campos opcionais):
```json
{
  "durationMin": 45,
  "status": "completed",
  "errorMessage": null
}
```

**Response Success (200)**:
```json
{
  "id": "clxxxxx",
  "patientId": "clxxxx",
  "durationMin": 45,
  "status": "completed",
  ...
}
```

**Response Error (404)**:
```json
{
  "error": "Sessão não encontrada"
}
```

---

### 5. **DELETE /api/sessions/[id]** - Deletar Sessão

**Descrição**: Remove uma sessão e sua nota associada (cascade).

**Response Success (200)**:
```json
{
  "message": "Sessão deletada com sucesso"
}
```

**Response Error (404)**:
```json
{
  "error": "Sessão não encontrada"
}
```

---

### 6. **POST /api/sessions/[id]/audio** - Upload de Áudio

**Descrição**: Faz upload do arquivo de áudio da sessão.

**Request**: `multipart/form-data`
- Campo `audio`: arquivo de áudio

**Validações**:
- Tamanho máximo: 25MB
- Formatos aceitos: `.mp3`, `.mp4`, `.wav`, `.webm`, `.m4a`

**Response Success (200)**:
```json
{
  "message": "Áudio enviado com sucesso",
  "session": {
    "id": "clxxxxx",
    "status": "transcribing",
    "audioUrl": "audio-clxxxxx.webm",
    "audioSize": 2048000,
    ...
  }
}
```

**Response Error (413)**:
```json
{
  "error": "Arquivo muito grande. Máximo: 25MB"
}
```

**Response Error (400)**:
```json
{
  "error": "Formato de áudio não suportado"
}
```

---

### 7. **POST /api/sessions/[id]/process** - Processar com IA

**Descrição**: Processa o áudio da sessão (transcrição + geração de nota).

**Fluxo**:
1. Valida se sessão existe e tem áudio
2. Atualiza status para `transcribing`
3. Transcreve áudio com Whisper API
4. Atualiza status para `generating`
5. Gera nota estruturada com GPT-4
6. Salva nota no banco
7. Atualiza status para `completed`

**Response Success (200)**:
```json
{
  "message": "Sessão processada com sucesso",
  "session": {
    "id": "clxxxxx",
    "status": "completed",
    "transcription": "Transcrição completa...",
    ...
  },
  "note": {
    "id": "clxxxxx",
    "contentJson": "{...}",
    "aiGenerated": true,
    "aiModel": "gpt-4-turbo-preview"
  }
}
```

**Response Error (400)**:
```json
{
  "error": "Sessão não possui áudio"
}
```

**Em caso de erro no processamento**:
- Status atualizado para `error`
- Campo `errorMessage` preenchido

---

### 8. **GET /api/patients/[id]/sessions** - Listar Sessões do Paciente

**Descrição**: Lista todas as sessões de um paciente específico.

**Response Success (200)**:
```json
{
  "patient": {
    "id": "clxxxx",
    "name": "João Silva"
  },
  "sessions": [...],
  "total": 15
}
```

**Response Error (404)**:
```json
{
  "error": "Paciente não encontrado"
}
```

---

## 🗄️ Schema do Banco de Dados

### Model Session
```prisma
model Session {
  id            String    @id @default(cuid())
  patientId     String
  date          DateTime  @default(now())
  durationMin   Int?
  sessionType   String?   // Tipo da sessão
  specialty     String?   // Especialidade
  motivation    String?   // Motivação/objetivo
  audioUrl      String?
  audioSize     Int?      // bytes
  transcription String?   // Texto completo
  status        String    @default("recording") 
                         // recording | transcribing | generating | completed | error
  errorMessage  String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  patient       Patient   @relation(fields: [patientId], references: [id])
  note          Note?

  @@index([patientId, date])
  @@index([status])
}
```

---

## 🔄 Fluxo Completo de uma Sessão

```
1. CRIAÇÃO
   POST /api/sessions
   └─> Status: recording
   └─> Retorna: session.id

2. GRAVAÇÃO DE ÁUDIO
   POST /api/sessions/[id]/audio
   └─> Status: transcribing
   └─> Salva: audioUrl, audioSize

3. PROCESSAMENTO IA
   POST /api/sessions/[id]/process
   ├─> Status: transcribing
   │   └─> Whisper API → transcription
   ├─> Status: generating
   │   └─> GPT-4 → note (JSON)
   └─> Status: completed

4. VISUALIZAÇÃO
   GET /api/sessions/[id]
   └─> Retorna: session completa com note
```

---

## 🎯 Status da Sessão

| Status | Descrição |
|--------|-----------|
| `recording` | Sessão criada, aguardando áudio |
| `transcribing` | Áudio recebido, transcrevendo com Whisper |
| `generating` | Transcrição concluída, gerando nota com GPT-4 |
| `completed` | Processamento concluído, nota gerada |
| `error` | Erro no processamento (ver `errorMessage`) |

---

## 🔐 Validações Implementadas

### Criação de Sessão
- ✅ `patientId` deve existir no banco
- ✅ Campos validados com Zod
- ✅ Data automática (now)

### Upload de Áudio
- ✅ Arquivo obrigatório
- ✅ Tamanho máximo: 25MB
- ✅ Formatos: mp3, mp4, wav, webm, m4a
- ✅ Sessão deve existir

### Processamento
- ✅ Sessão deve existir
- ✅ Sessão deve ter áudio
- ✅ Timeout: 5 minutos (300s)
- ✅ Tratamento de erros completo

---

## 📦 Dependências

```json
{
  "prisma": "^6.17.1",
  "@prisma/client": "^6.17.1",
  "zod": "^3.x.x",
  "openai": "^4.x.x"
}
```

---

## 🚀 Como Testar

### 1. Criar Sessão
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "clxxxx",
    "sessionType": "Avaliação inicial",
    "specialty": "Fisioterapia Ortopédica",
    "motivation": "Dor lombar"
  }'
```

### 2. Upload de Áudio
```bash
curl -X POST http://localhost:3000/api/sessions/SESSION_ID/audio \
  -F "audio=@audio.webm"
```

### 3. Processar com IA
```bash
curl -X POST http://localhost:3000/api/sessions/SESSION_ID/process
```

### 4. Buscar Sessão
```bash
curl http://localhost:3000/api/sessions/SESSION_ID
```

---

## ✅ Checklist de Implementação

- [x] Criar endpoint POST /api/sessions
- [x] Criar endpoint GET /api/sessions (com filtros)
- [x] Criar endpoint GET /api/sessions/[id]
- [x] Criar endpoint PATCH /api/sessions/[id]
- [x] Criar endpoint DELETE /api/sessions/[id]
- [x] Adicionar campos sessionType, specialty, motivation ao schema
- [x] Criar migration add_session_details
- [x] Validação com Zod
- [x] Tratamento de erros completo
- [x] Logs de debug
- [x] Integração com Patient
- [x] Integração com Note
- [x] Upload de áudio (já existia)
- [x] Processamento IA (já existia)
- [x] Documentação completa

---

## 📝 Notas Importantes

1. **Cascade Delete**: Ao deletar um paciente, todas as suas sessões são removidas
2. **Timestamps**: `createdAt` e `updatedAt` automáticos
3. **Índices**: Otimização para queries por `patientId` e `status`
4. **LGPD**: Campo `motivation` pode conter dados sensíveis
5. **Performance**: Timeout de 5 minutos para processamento IA

---

## 🔮 Próximos Passos

- [ ] Implementar soft delete para sessões
- [ ] Adicionar campo `deletedAt` opcional
- [ ] Implementar webhook para notificações
- [ ] Adicionar paginação no GET /api/sessions
- [ ] Implementar busca por texto na transcrição
- [ ] Adicionar export de nota em PDF

---

**Data**: 15/10/2025  
**Versão**: 1.0.0  
**Status**: ✅ Implementado e Testado
