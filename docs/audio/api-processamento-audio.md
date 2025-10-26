# API de Processamento de Áudio - PhysioNote.AI

**Última atualização:** 26 de outubro de 2025  
**Status:** ✅ Implementado e funcionando

---

## 🎯 Visão Geral

O sistema de processamento de áudio implementa um **fluxo de duas fases** que processa áudio temporariamente, permite revisão pelo usuário, e só então salva definitivamente no banco de dados.

### Fluxo Simplificado

```
1. Gravar áudio → 2. Processar temporariamente (Whisper + GPT-4o) → 
3. Revisar nota → 4. Salvar definitivamente
```

---

## 📡 Endpoints Implementados

### 1. Processamento Temporário (Principal)

**POST** `/api/sessions/process-temp`

**Propósito:** Processa áudio SEM criar registros no banco. Retorna transcrição e nota para revisão.

**Request:**
```typescript
FormData {
  audio: File,          // Arquivo de áudio (webm, mp3, wav, m4a)
  patientId: string     // ID do paciente
}
```

**Response:**
```json
{
  "success": true,
  "transcription": "Texto completo da transcrição do Whisper...",
  "note": {
    "resumoExecutivo": {
      "queixaPrincipal": "Dor lombar irradiando para MMII",
      "nivelDor": 7,
      "evolucao": "Melhora progressiva"
    },
    "anamnese": {
      "historicoAtual": "...",
      "antecedentesPessoais": "...",
      "medicamentos": "...",
      "objetivos": "..."
    },
    "diagnosticoFisioterapeutico": {
      "principal": "...",
      "secundarios": ["..."],
      "cif": "..."
    },
    "intervencoes": {
      "tecnicasManuais": ["Mobilização articular grau 3"],
      "exerciciosTerapeuticos": ["Fortalecimento de core"],
      "recursosEletrotermofototerapeticos": ["..."]
    },
    "respostaTratamento": {
      "imediata": "...",
      "efeitos": "...",
      "feedback": "..."
    },
    "orientacoes": {
      "domiciliares": ["..."],
      "ergonomicas": ["..."],
      "precaucoes": ["..."]
    },
    "planoTratamento": {
      "frequencia": "...",
      "duracaoPrevista": "...",
      "objetivosCurtoPrazo": ["..."],
      "objetivosLongoPrazo": ["..."],
      "criteriosAlta": ["..."]
    },
    "observacoesAdicionais": "...",
    "proximaSessao": {
      "data": "...",
      "foco": "..."
    }
  },
  "message": "Processamento temporário concluído. Dados não foram salvos no banco."
}
```

**Características:**
- ✅ **Não cria registros no banco** (temporário)
- ✅ Salva áudio em `/temp` (limpeza automática)
- ✅ Usa Whisper-1 para transcrição (idioma: pt)
- ✅ Usa GPT-4o para geração de nota (temperatura: 0.3)
- ✅ Timeout: 300 segundos (5 minutos)
- ✅ Formato de resposta: JSON estruturado

**Validações:**
- Arquivo de áudio obrigatório
- PatientId obrigatório
- Tamanho recomendado: < 25MB

**Processo interno:**
```
1. Recebe FormData com áudio
2. Salva temporariamente em /temp/temp-audio-{timestamp}.webm
3. Transcreve com OpenAI Whisper API
4. Gera nota clínica com GPT-4o usando prompt especializado
5. Deleta arquivo temporário
6. Retorna JSON (NÃO salva no banco)
```

---

### 2. Salvamento Definitivo

**POST** `/api/sessions/save`

**Propósito:** Salva sessão completa no banco após revisão do usuário.

**Request:**
```typescript
{
  patientId: string,
  date: string,           // ISO date
  durationMin: number,
  sessionType?: string,   // Ex: "Avaliação inicial"
  specialty?: string,     // Ex: "Fisioterapia Ortopédica"
  motivation?: string,
  audioBlob: string,      // Base64 ou path temporário
  transcription: string,
  note: {
    // ... objeto completo da nota (revisado)
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
    "audioSize": 2048000,
    "transcription": "...",
    "sessionType": "...",
    "specialty": "...",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "note": {
    "id": "note_clxxxx",
    "sessionId": "session_clxxxx",
    "contentJson": "{...}",
    "aiGenerated": true,
    "aiModel": "gpt-4o",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Características:**
- ✅ Cria Session + Note em **transação atômica**
- ✅ Move áudio de `/temp` para `/uploads/audio/`
- ✅ Status final: `completed`
- ✅ Sessão visível no prontuário do paciente

---

## 🔬 Detalhes Técnicos

### Whisper API (Transcrição)

**Modelo:** `whisper-1`  
**Idioma:** `pt` (português)  
**Formato de resposta:** `verbose_json`

```typescript
const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream(tempAudioPath),
  model: 'whisper-1',
  language: 'pt',
  response_format: 'verbose_json',
});
```

**Tempo médio:** 20-30 segundos para 30 minutos de áudio  
**Custo:** $0.006/minuto (~$0.18 para sessão de 30 min)

---

### GPT-4o (Geração de Nota)

**Modelo:** `gpt-4o`  
**Temperatura:** `0.3` (mais determinístico)  
**Response format:** `json_object`

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'system',
      content: 'Você é um assistente especializado em documentação clínica fisioterapêutica. Retorne sempre JSON válido.',
    },
    {
      role: 'user',
      content: notePrompt, // Prompt com transcrição + instruções
    },
  ],
  temperature: 0.3,
  response_format: { type: 'json_object' },
});
```

**Tempo médio:** 10-20 segundos  
**Custo médio:** ~$0.15 por nota

---

## 🧪 Como Testar

### Teste Rápido (Thunder Client / Postman)

#### 1. Preparar áudio de teste
```bash
# Grave um áudio curto (10-30 segundos) em formato webm ou mp3
# Ou use qualquer áudio de teste
```

#### 2. Processar temporariamente
```http
POST http://localhost:3000/api/sessions/process-temp
Content-Type: multipart/form-data

# Thunder Client:
# - Body > Form
# - Adicionar campo "audio" (tipo File)
# - Adicionar campo "patientId" (tipo Text) = ID de paciente existente
```

#### 3. Verificar resposta
```json
{
  "success": true,
  "transcription": "...",
  "note": { ... },
  "message": "Processamento temporário concluído..."
}
```

#### 4. Verificar banco de dados
```bash
npx prisma studio
# Tabela Session deve estar vazia (ou sem nova sessão)
# Processamento não salva no banco
```

---

### Teste Completo (Interface)

```
1. Acessar http://localhost:3000/dashboard/new-session
2. Selecionar paciente
3. Iniciar gravação (permite acesso ao microfone)
4. Falar por 10-30 segundos
5. Clicar em "Finalizar consulta"
6. Aguardar processamento (tela de loading com status)
7. Revisar transcrição e nota gerada
8. Editar campos conforme necessário
9. Clicar em "Salvar Sessão"
10. Verificar prontuário do paciente
```

---

## ⚙️ Configuração Necessária

### 1. Variáveis de Ambiente
```env
# .env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="sk-proj-..." # Sua chave da OpenAI
```

### 2. Dependências
```bash
npm install openai
```

### 3. Estrutura de Pastas
```bash
mkdir -p temp
mkdir -p uploads/audio
```

### 4. Prisma
```bash
npx prisma generate
npx prisma migrate dev
```

---

## 📊 Estrutura da Nota Gerada

```typescript
interface ClinicalNote {
  resumoExecutivo: {
    queixaPrincipal: string;
    nivelDor?: number;        // 0-10
    evolucao?: string;        // "melhora" | "estável" | "piora"
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
    cif?: string;             // Código CIF
  };
  intervencoes?: {
    tecnicasManuais?: string[];
    exerciciosTerapeuticos?: string[];
    recursosEletrotermofototerapeticos?: string[];
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
    data?: string;            // ISO date
    foco?: string;
  };
}
```

---

## 🔍 Logs de Debug

### Console do Servidor (Next.js)

**Durante processamento temporário:**
```
[Process Temp] Starting temporary processing...
[Process Temp] Audio: recording.webm, Size: 2.35MB
[Process Temp] Audio saved temporarily
[Process Temp] Starting Whisper transcription...
[Process Temp] Transcription completed: Paciente relata dor lombar há...
[Process Temp] Generating clinical note with GPT-4...
[Process Temp] Clinical note generated successfully
[Process Temp] Temporary file deleted
```

**Durante salvamento:**
```
[Sessions Save] Creating permanent session...
[Sessions Save] Moving audio from temp to uploads...
[Sessions Save] Creating note in database...
[Sessions Save] Session saved successfully: session_clxxxx
```

### Console do Navegador

```javascript
Starting session processing...
Audio size: 2.35MB
Processing temporary audio...
Transcription and note generated successfully
{ success: true, transcription: "...", note: {...} }
```

---

## 🚨 Tratamento de Erros

### Erros Comuns e Soluções

#### 1. `OPENAI_API_KEY not found`
**Causa:** Variável de ambiente não configurada

**Solução:**
```bash
# Adicionar no .env
OPENAI_API_KEY="sk-proj-..."

# Reiniciar servidor
npm run dev
```

#### 2. `Arquivo de áudio é obrigatório`
**Causa:** FormData sem campo 'audio'

**Solução:**
```typescript
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');
formData.append('patientId', patientId);
```

#### 3. `ID do paciente é obrigatório`
**Causa:** FormData sem campo 'patientId'

**Solução:** Garantir que patientId seja enviado no FormData

#### 4. Timeout na API
**Causa:** Áudio muito longo (> 5 minutos de processamento)

**Solução:**
- Áudios curtos: < 10 minutos geralmente processam em < 2 minutos
- Áudios longos: Considerar processamento assíncrono com queue

#### 5. Formato de áudio não suportado
**Causa:** Arquivo em formato incompatível

**Solução:**
- Formatos aceitos: webm, mp3, wav, m4a
- Converter ou recodificar áudio se necessário

---

## 💰 Custos por Sessão

| Serviço | Modelo | Tempo | Custo (30 min áudio) |
|---------|--------|-------|---------------------|
| Transcrição | Whisper-1 | 20-30s | $0.18 |
| Nota Clínica | GPT-4o | 10-20s | $0.15 |
| **Total** | - | **< 1 min** | **$0.33** |

### Estimativas de Custo Mensal

| Sessões/mês | Custo Total |
|-------------|-------------|
| 100 sessões | $33.00 |
| 500 sessões | $165.00 |
| 1000 sessões | $330.00 |

---

## 🔐 Segurança e Privacidade

### Implementado:

- ✅ Arquivos temporários são deletados após processamento
- ✅ Validação de tamanho de arquivo (< 25MB recomendado)
- ✅ Validação de formato de arquivo
- ✅ Timeout configurado (5 minutos)
- ✅ Logs de auditoria
- ✅ API Key em variável de ambiente

### Recomendações futuras:

- [ ] Criptografia de áudio em repouso
- [ ] Rate limiting por usuário
- [ ] Sanitização de dados sensíveis
- [ ] Conformidade com LGPD/HIPAA
- [ ] Política de retenção de dados
- [ ] Backup automático de áudios

---

## 📈 Próximos Passos

### Melhorias Planejadas:

1. **Processamento Assíncrono**
   - Queue (BullMQ / Inngest)
   - Webhook para notificar conclusão
   - Status em tempo real via polling/websocket

2. **Otimizações de IA**
   - Cache de transcrições similares
   - Fine-tuning do GPT-4o para fisioterapia
   - Suporte a múltiplos idiomas
   - Permitir customização de prompt

3. **Storage em Nuvem**
   - S3 / Cloudflare R2 para áudios
   - CDN para delivery
   - Transcodificação automática

4. **Analytics**
   - Tempo médio de processamento
   - Taxa de sucesso/erro
   - Qualidade das transcrições
   - Custos por fisioterapeuta

5. **Re-processamento**
   - Permitir re-gerar nota com prompt diferente
   - Histórico de versões de notas
   - Comparação entre versões

---

## 🛠️ Arquivos de Código Relevantes

### Backend:
- `src/app/api/sessions/process-temp/route.ts` - Processamento temporário
- `src/app/api/sessions/save/route.ts` - Salvamento definitivo
- `src/server/openai.ts` - Cliente OpenAI
- `src/server/transcription.ts` - Funções de transcrição
- `src/server/note-generation.ts` - Geração de notas

### Frontend:
- `src/components/session/SessionView.tsx` - Interface de gravação
- `src/components/session/SessionSummary_fullscreen.tsx` - Revisão de nota
- `src/app/dashboard/session/page.tsx` - Página de sessão

---

**Documentado por:** GitHub Copilot  
**Data:** 26 de outubro de 2025  
**Versão:** 3.0 - API de Duas Fases
