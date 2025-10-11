# API de Processamento de Áudio - PhysioNote.AI

## 🎯 Fluxo completo

```
1. Criar paciente → 2. Criar sessão → 3. Upload áudio → 4. Processar (Whisper + GPT-4) → 5. Buscar nota
```

## 📡 Endpoints implementados

### 1. Upload de áudio
**POST** `/api/sessions/{sessionId}/audio`

**Request:**
- Content-Type: `multipart/form-data`
- Body: campo `audio` com o arquivo

**Response:**
```json
{
  "message": "Áudio enviado com sucesso",
  "session": {
    "id": "...",
    "audioUrl": "filename.mp3",
    "audioSize": 1234567,
    "status": "transcribing"
  }
}
```

**Validações:**
- Tamanho máximo: 25MB
- Formatos aceitos: mp3, mp4, wav, webm, m4a

---

### 2. Processar sessão (transcrição + nota)
**POST** `/api/sessions/{sessionId}/process`

**Request:** (sem body)

**Response:**
```json
{
  "message": "Processamento concluído com sucesso",
  "session": { ... },
  "transcription": "texto completo da transcrição...",
  "note": {
    "resumoExecutivo": {
      "queixaPrincipal": "Dor lombar irradiando para MMII",
      "nivelDor": 7,
      "evolucao": "Melhora progressiva"
    },
    "anamnese": { ... },
    "diagnosticoFisioterapeutico": { ... },
    "intervencoes": {
      "tecnicasManuais": ["Mobilização articular grau 3"],
      "exerciciosTerapeuticos": ["Fortalecimento de core"]
    },
    ...
  }
}
```

**Estados da sessão:**
- `recording` - Inicial (sem áudio)
- `transcribing` - Upload feito, aguardando transcrição
- `generating` - Transcrição ok, gerando nota com IA
- `completed` - Nota gerada com sucesso
- `error` - Falha no processamento

---

## 🧪 Teste manual (Postman/Thunder Client)

### Setup inicial
```http
### 1. Criar paciente
POST http://localhost:3000/api/patients
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "birthDate": "1985-03-15",
  "gender": "Masculino"
}

### Resposta: copie o "id" do paciente
```

```http
### 2. Criar sessão
POST http://localhost:3000/api/patients/{PATIENT_ID}/sessions
Content-Type: application/json

{
  "date": "2024-03-20T14:30:00Z",
  "durationMin": 45
}

### Resposta: copie o "id" da sessão
```

```http
### 3. Upload de áudio
POST http://localhost:3000/api/sessions/{SESSION_ID}/audio
Content-Type: multipart/form-data

# No Thunder Client:
# - Add file field chamado "audio"
# - Selecione um arquivo .mp3/.wav/.m4a

### Resposta: status deve ser "transcribing"
```

```http
### 4. Processar (transcrição + nota)
POST http://localhost:3000/api/sessions/{SESSION_ID}/process

### IMPORTANTE: Pode demorar 30-60 segundos
### Resposta: retorna transcrição completa + nota estruturada
```

```http
### 5. Buscar nota gerada (opcional)
GET http://localhost:3000/api/sessions/{SESSION_ID}/note
```

---

## ⚙️ Configuração necessária

### 1. Instalar dependências
```bash
npm install openai
```

### 2. Configurar variáveis de ambiente
Adicione no arquivo `.env`:
```env
DATABASE_URL="file:./.data/dev.db"
OPENAI_API_KEY="sk-proj-..." # Sua chave da OpenAI
```

### 3. Rodar migration
```bash
npx prisma migrate dev --name add-transcription-fields
npx prisma generate
```

### 4. Criar diretório de áudio
```bash
mkdir -p .data/audio
```

---

## 🔍 Logs e debug

Os logs aparecem no console do servidor Next.js:

```
[session-123] Iniciando transcrição...
[session-123] Transcrição concluída: Paciente relata dor lombar há...
[session-123] Gerando nota com IA...
[session-123] Nota gerada com sucesso
[session-123] Processamento completo!
```

Em caso de erro, o campo `errorMessage` da sessão contém detalhes.

---

## 📊 Estrutura da nota gerada

```typescript
interface GeneratedNote {
  resumoExecutivo: {
    queixaPrincipal: string;
    nivelDor?: number; // 0-10
    evolucao?: string; // "melhora" | "estável" | "piora"
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

### 1. "OPENAI_API_KEY not found"
- Adicione a chave no `.env`
- Reinicie o servidor Next.js

### 2. "Arquivo muito grande"
- Whisper aceita até 25MB
- Comprima o áudio ou reduza a qualidade

### 3. "Formato de áudio não suportado"
- Use: mp3, wav, mp4, webm ou m4a
- Evite: ogg, flac, aac

### 4. Timeout na API /process
- Aumente `maxDuration` em `route.ts`
- Considere processamento assíncrono (queue)

---

## 🔐 Segurança

- [ ] Validar tamanho máximo (25MB)
- [ ] Validar tipo MIME
- [ ] Limpar arquivos antigos (GDPR)
- [ ] Rate limiting (evitar abuso da API OpenAI)
- [ ] Autenticação (JWT/sessions)
- [ ] Logs de auditoria

---

## 📈 Próximos passos

1. **Processamento assíncrono**
   - Usar queue (BullMQ/Inngest)
   - Webhook para notificar conclusão

2. **Melhorias na IA**
   - Permitir edição do prompt do GPT
   - Opção de re-gerar nota
   - Suporte a múltiplas línguas

3. **Storage em nuvem**
   - S3/R2 para arquivos de áudio
   - Transcodificação automática

4. **Análise de qualidade**
   - Confiança da transcrição
   - Score de completude da nota
