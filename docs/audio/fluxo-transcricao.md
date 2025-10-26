# Fluxo de Transcrição - PhysioNote.AI

## ✅ Status da Implementação: CONCLUÍDO

O sistema está **totalmente funcional**. Após a gravação, a transcrição do Whisper gera automaticamente a nota estruturada com GPT-4 e redireciona para a página `SessionSummary` onde o usuário pode revisar e editar todos os campos.

## 📋 Visão Geral

O sistema de transcrição foi projetado para minimizar distrações durante o atendimento, permitindo que o fisioterapeuta foque totalmente no paciente. A transcrição acontece silenciosamente em segundo plano e só é apresentada após a finalização da consulta.

---

## 🔄 Fluxo Completo

### 1️⃣ **Antes da Gravação** (`sessionStarted = false`)

**Tela Exibida:** Seleção de Paciente

**Interface:**
- Card centralizado com logo PhysioNote.AI
- Dropdown de busca de pacientes
- Botões: "Cancelar" e "Iniciar Sessão"

**Comportamento:**
- Usuário deve selecionar um paciente antes de prosseguir
- Botão "Iniciar Sessão" desabilitado até seleção de paciente
- Ao clicar em "Iniciar Sessão": inicia gravação e muda para tela focada

---

### 2️⃣ **Durante a Gravação** (`isRecording = true`)

**Tela Exibida:** Interface Focada com Liquid Glass

**Interface Visível:**
- ✅ Fundo com efeito liquid glass (blobs animados)
- ✅ Mensagem: "A consulta está sendo gravada" (com ponto vermelho pulsante)
- ✅ Ícone de microfone grande e pulsante no centro
- ✅ Ondas sonoras animadas ao redor do microfone
- ✅ Timer (HH:MM:SS) mostrando duração da gravação
- ✅ Nome do paciente discreto
- ✅ Botão vermelho: "Finalizar Consulta e Gerar Transcrição"
- ✅ Alerta informativo: "Continue com o atendimento normalmente..."

**Interface Oculta:**
- ❌ Painel de transcrição em tempo real
- ❌ Texto da transcrição
- ❌ Controles de pausa/retomar
- ❌ Barras laterais ou menus

**Processo em Background:**
1. **Captura de Áudio:**
   - MediaRecorder captura áudio do microfone
   - Dados coletados a cada 1 segundo
   - Stream armazenado como Blob

2. **Simulação de Transcrição:**
   - Função `simulateTranscription()` adiciona frases a cada 5 segundos
   - Array `transcription` armazena segmentos
   - **Importante:** Transcrição NÃO é exibida ao usuário durante gravação

3. **Timer:**
   - Contador incrementa a cada 1 segundo
   - Exibido em formato HH:MM:SS

---

### 3️⃣ **Finalizando a Gravação** (`isFinishing = true`)

**Tela Exibida:** Animação de Transição

**Interface:**
- Tela mantém efeito liquid glass
- Spinner animado (Loader2)
- Mensagem: "Finalizando consulta..."
- Submensagem: "Processando gravação e gerando transcrição"

**Processo:**
1. Botão "Finalizar" clicado
2. Estado `isFinishing = true`
3. MediaRecorder para gravação
4. Stream de áudio encerrado
5. Aguarda 2 segundos (animação de transição)
6. Muda para tela de resumo (`showSummary = true`)

**Duração:** 2 segundos

---

### 4️⃣ **Após Finalização** (`showSummary = true`)

**Tela Exibida:** Resumo da Sessão (SessionSummary)

**Seção 1: Header**
- ✅ Ícone de check verde: "Sessão Finalizada"
- ✅ Informações da sessão:
  - Nome do paciente
  - Duração da consulta (HH:MM:SS)
  - Número de segmentos transcritos

**Seção 2: Transcrição Completa** (⭐ NOVIDADE)

**Funcionalidades:**

1. **Visualização por padrão (Ocultar/Exibir)**
   - Transcrição aparece expandida automaticamente
   - Botão "Ocultar" permite esconder se necessário
   - Botão "Exibir" mostra novamente quando oculta

2. **Modo de Visualização:**
   - Transcrição exibida em cards numerados
   - Cada segmento em uma linha separada
   - Background branco com bordas para melhor legibilidade
   - Scroll vertical para transcrições longas (max-height: 500px)
   - **Botões disponíveis:**
     - 📋 **Copiar:** Copia toda transcrição para área de transferência
     - ✏️ **Editar Transcrição:** Entra em modo de edição
     - 📥 **Exportar PDF:** Gera documento PDF

3. **Modo de Edição:**
   - Textarea grande com toda transcrição (20 linhas)
   - Fonte monoespaçada para melhor leitura
   - Alerta azul explicando o modo de edição
   - **Botões disponíveis:**
     - ❌ **Cancelar:** Descarta alterações e volta ao modo visualização
     - 💾 **Salvar Alterações:** Salva edições e volta ao modo visualização

**Seção 3: Informações Adicionais**

Campos de texto para complementar a documentação:
- 🔍 **Diagnóstico / Avaliação:** Diagnóstico clínico e avaliação inicial
- 💊 **Tratamento Realizado:** Procedimentos e técnicas aplicadas
- 📝 **Orientações e Próximos Passos:** Planejamento de continuidade
- 📌 **Observações Gerais:** Notas adicionais relevantes

**Seção 4: Ações Finais**
- ❌ **Descartar:** Cancela sessão (com confirmação)
- 💾 **Salvar Sessão:** Salva todos os dados e volta ao dashboard

---

## 🎯 Benefícios da Abordagem

### ✅ Durante a Gravação:
1. **Zero Distrações:** Profissional foca 100% no paciente
2. **Interface Limpa:** Design minimalista e focado
3. **Feedback Visual:** Animações indicam que sistema está funcionando
4. **Confiança:** Timer e indicadores mostram que está gravando

### ✅ Após a Gravação:
1. **Revisão Completa:** Transcrição inteira disponível para análise
2. **Edição Fácil:** Corrigir erros de transcrição automaticamente
3. **Flexibilidade:** Ocultar/exibir conforme necessidade
4. **Exportação:** Múltiplas opções de saída (PDF, cópia)
5. **Contextualização:** Adicionar diagnóstico, tratamento e orientações

---

## 🔧 Componentes Técnicos

### `SessionView.tsx`
**Responsabilidades:**
- Gerenciar estados da sessão (não iniciada, gravando, finalizando, resumo)
- Capturar áudio com MediaRecorder API
- Coletar transcrição em background (simulação)
- Renderizar interface focada durante gravação
- **NÃO exibe transcrição durante gravação**

**Estados Principais:**
```typescript
const [sessionStarted, setSessionStarted] = useState(false);
const [isRecording, setIsRecording] = useState(false);
const [isFinishing, setIsFinishing] = useState(false);
const [showSummary, setShowSummary] = useState(false);
const [transcription, setTranscription] = useState<string[]>([]); // Oculta do usuário
```

### `SessionSummary.tsx`
**Responsabilidades:**
- Exibir transcrição completa após finalização
- Permitir ocultar/exibir transcrição
- Modo de edição de transcrição
- Copiar transcrição para clipboard
- Campos para informações adicionais
- Salvar ou descartar sessão

**Estados Principais:**
```typescript
const [showTranscription, setShowTranscription] = useState(true);
const [isEditingTranscription, setIsEditingTranscription] = useState(false);
const [editedTranscription, setEditedTranscription] = useState(string);
const [copied, setCopied] = useState(false);
```

---

## 🤖 Processamento com IA (Whisper + GPT-4)

### Etapa 1: Finalizar Gravação
**Função:** `handleStopSession()` em `SessionView.tsx`

```typescript
// 1. Para MediaRecorder
mediaRecorderRef.current.stop();
setIsRecording(false);

// 2. Cria Blob de áudio
const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
```

### Etapa 2: Upload do Áudio
**Endpoint:** `POST /api/sessions/[id]/audio`

```typescript
// Upload FormData com arquivo de áudio
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');

await fetch(`/api/sessions/${sessionId}/audio`, {
  method: 'POST',
  body: formData
});

// Validações:
- Tamanho máximo: 25MB
- Formatos: webm, mp3, wav, m4a
- Salva em: uploads/audio/[sessionId].webm
- Atualiza: session.audioUrl no banco
```

### Etapa 3: Processar com IA
**Endpoint:** `POST /api/sessions/[id]/process`

#### 3.1. Transcrição com Whisper
```typescript
// Status: "transcribing"
const transcription = await transcribeAudio(audioPath, 'pt');

// Salva no banco
await prisma.session.update({
  data: {
    transcription: transcription.text,
    status: 'generating'
  }
});
```

**API Utilizada:**
- Modelo: `whisper-1` (OpenAI)
- Idioma: Português (`pt`)
- Custo: $0.006/minuto
- Tempo médio: 20-30 segundos para 30 min de áudio

#### 3.2. Geração de Nota com GPT-4
```typescript
// Status: "generating"
const { note, model } = await generateNoteFromTranscription({
  transcription: text,
  patientName: session.patient.name,
  patientAge: calculatedAge,
  patientGender: session.patient.gender,
  sessionDate: session.date
});
```

**API Utilizada:**
- Modelo: `gpt-4o` (OpenAI)
- Prompt: Especializado para fisioterapia
- Formato: JSON estruturado (baseado em SOAP)
- Custo médio: $0.15 por nota
- Tempo médio: 10-20 segundos

**Estrutura da Nota Gerada:**
```json
{
  "resumoExecutivo": {
    "queixaPrincipal": "string",
    "nivelDor": 0-10,
    "evolucao": "string"
  },
  "anamnese": {
    "historicoAtual": "string",
    "antecedentesPessoais": "string",
    "medicamentos": "string",
    "objetivos": "string"
  },
  "diagnosticoFisioterapeutico": {
    "principal": "string",
    "secundario": ["string[]"],
    "cif": "string"
  },
  "intervencoes": {
    "tecnicasManuais": ["string[]"],
    "exerciciosTerapeuticos": ["string[]"],
    "recursosEletrotermofototerapeticos": ["string[]"]
  },
  "respostaTratamento": {
    "imediata": "string",
    "efeitos": "string",
    "feedback": "string"
  },
  "orientacoes": {
    "domiciliares": ["string[]"],
    "ergonomicas": ["string[]"],
    "precaucoes": ["string[]"]
  },
  "planoTratamento": {
    "frequencia": "string",
    "duracaoPrevista": "string",
    "objetivosCurtoPrazo": ["string[]"],
    "objetivosLongoPrazo": ["string[]"],
    "criteriosAlta": ["string[]"]
  },
  "observacoesAdicionais": "string",
  "proximaSessao": {
    "data": "string",
    "foco": "string"
  }
}
```

#### 3.3. Salvamento da Nota
```typescript
// Cria ou atualiza nota no banco
await prisma.note.upsert({
  where: { sessionId },
  create: {
    contentJson: JSON.stringify(note),
    aiGenerated: true,
    aiModel: 'gpt-4o',
    aiPromptUsed: prompt
  }
});

// Marca sessão como completa
await prisma.session.update({
  data: { status: 'completed' }
});
```

### Etapa 4: Redirecionamento para SessionSummary
**Volta para:** `SessionView.tsx`

```typescript
// Após sucesso do processamento
const result = await processResponse.json();

// Atualiza transcrição (dividida em frases)
if (result.session?.transcription) {
  const sentences = result.session.transcription
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  setTranscription(sentences);
}

// 🎯 REDIRECIONA PARA SESSIONSUMMARY
setShowSummary(true);
```

### Etapa 5: Renderização do SessionSummary
**Componente:** `SessionSummary_fullscreen.tsx`

```typescript
// SessionView renderiza SessionSummary quando showSummary=true
if (showSummary) {
  return (
    <SessionSummary
      patient={selectedPatient!}
      duration={duration}
      transcription={transcription}  // ← Texto do Whisper
      onSave={handleSaveSession}
      onCancel={handleCancelSession}
      showAIDisclaimer={true}
    />
  );
}
```

**O SessionSummary exibe:**
- ✅ Informações da sessão (paciente, data, duração)
- ✅ Nota estruturada em seções colapsáveis (dados do GPT-4)
- ✅ Transcrição original (texto do Whisper)
- ✅ Todos os campos são **editáveis**
- ✅ Botões: Copiar, Exportar PDF, Salvar, Descartar

---

## 📊 Estados da Sessão

```
recording      → Gravando áudio
  ↓
uploaded       → Áudio enviado
  ↓
transcribing   → Whisper processando (~20-30s)
  ↓
generating     → GPT-4 gerando nota (~10-20s)
  ↓
completed      → ✅ Nota gerada e salva
  ↓
(showSummary=true) → SessionSummary renderizado
```

**Feedback Visual Durante Processamento:**
```
"Finalizando gravação..."
"Preparando áudio..."
"Enviando áudio..."
"Transcrevendo com IA..."  ← Whisper
"Concluído!"               ← Pronto!
```

---

## 💰 Custos por Sessão (30 minutos)

| Serviço | Modelo | Custo |
|---------|--------|-------|
| Whisper | whisper-1 | $0.18 |
| GPT-4 | gpt-4o | $0.15 |
| **Total** | - | **$0.33** |

---

## 🚀 Próximas Melhorias

### Transcrição Real
- [ ] Integrar API de Speech-to-Text (Google Cloud, Azure, AWS)
- [ ] Implementar streaming de transcrição em tempo real (backend)
- [ ] Adicionar suporte para múltiplos idiomas
- [ ] Detectar termos médicos e fisioterapêuticos

### Edição Avançada
- [ ] Timestamps para cada segmento
- [ ] Marcação de tópicos/seções
- [ ] Busca dentro da transcrição
- [ ] Destaque de termos-chave

### Exportação
- [ ] Geração real de PDF com formatação profissional
- [ ] Exportar para Word (.docx)
- [ ] Envio por email direto ao paciente
- [ ] Integração com prontuário eletrônico

### IA Generativa
- [ ] Sugestões automáticas de diagnóstico baseadas na transcrição
- [ ] Auto-preenchimento de tratamentos comuns
- [ ] Resumo automático da consulta
- [ ] Geração de relatório técnico

---

## 📊 Fluxograma Visual

```
┌─────────────────────┐
│  Seleção Paciente   │
│  (sessionStarted=F) │
└──────────┬──────────┘
           │ Clicar "Iniciar Sessão"
           ▼
┌─────────────────────┐
│  Gravando Consulta  │◄──┐
│  (isRecording=T)    │   │ Transcrição em
│  🎙️ Interface Focada│   │ background (oculta)
│  ❌ SEM Transcrição │   │
└──────────┬──────────┘   │
           │ Clicar "Finalizar"
           ▼               │
┌─────────────────────┐   │
│  Finalizando...     │───┘
│  (isFinishing=T)    │ Processa dados
│  ⏳ 2 segundos      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Resumo da Sessão   │
│  (showSummary=T)    │
│  ✅ Transcrição     │──► Exibir/Ocultar
│  ✏️  Editar         │──► Modo Edição
│  📋 Copiar          │──► Clipboard
│  📥 Exportar        │──► PDF
│  💾 Salvar          │──► Dashboard
└─────────────────────┘
```

---

## 💡 Observações Importantes

1. **Privacidade:** Transcrição oculta durante gravação protege privacidade do paciente
2. **Experiência:** Interface limpa melhora experiência do profissional
3. **Flexibilidade:** Edição posterior permite correção de erros de IA
4. **Compliance:** Documentação completa facilita auditoria e regulamentações
5. **Eficiência:** Menos cliques e distrações = mais foco no atendimento

---

**Última Atualização:** Outubro 2025  
**Versão:** 2.0 - Transcrição Focada e Editável
