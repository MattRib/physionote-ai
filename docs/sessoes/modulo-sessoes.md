# 📝 Módulo de Sessões - PhysioNote.AI

**Última atualização:** 26 de outubro de 2025  
**Status:** ✅ **COMPLETO E FUNCIONAL**

---

## 📋 Visão Geral

O módulo de Sessões é o **core do sistema PhysioNote.AI**. Permite realizar consultas de fisioterapia com gravação de áudio ao vivo, transcrição automática com Whisper-1, geração de notas clínicas estruturadas com GPT-4o, e salvamento no prontuário do paciente.

### ⚠️ Arquitetura Crítica: Fluxo de Duas Fases

**PRINCÍPIO FUNDAMENTAL:** Sessões só são salvas no banco de dados **APÓS revisão e confirmação do usuário**.

```
Fase 1: PROCESSAR (process-temp) → Gera nota temporária
Fase 2: SALVAR (save) → Cria Session + Note no banco
```

**Motivo:** Garantir que apenas notas revisadas e precisas sejam registradas no prontuário do paciente.

---

## 🎯 Funcionalidades Implementadas

### 1. **Seleção de Paciente** ✅ Completo
- ✅ Componente PatientSelector com dropdown e busca
- ✅ Lista de pacientes com última sessão exibida
- ✅ Busca em tempo real (filtra por nome)
- ✅ Interface com avatares (iniciais coloridas)
- ✅ Auto-seleção via URL params (patientId + patientName)
- ✅ Validação: não permite iniciar sem paciente selecionado

### 2. **Gravação de Áudio** ✅ Completo
- ✅ MediaRecorder API (WebRTC) - formato: `audio/webm;codecs=opus`
- ✅ Captura em chunks a cada 1 segundo
- ✅ Timer em tempo real (formato HH:MM:SS)
- ✅ Botão "Parar Gravação" (finaliza e processa)
- ✅ Indicador visual de status (animação Lottie pulsando)
- ✅ Animações suaves e feedback visual
- ✅ Tratamento de permissões de microfone
- ✅ Auto-início após seleção de paciente (via URL params)

### 3. **Processamento com IA** ✅ Completo
**Endpoint:** `POST /api/sessions/process-temp`

**Fluxo:**
1. Recebe audioBlob + metadados (patientId, sessionType, specialty)
2. Salva áudio em `/temp` (temporário)
3. **Transcreve com Whisper-1** (OpenAI Audio API)
   - Modelo: `whisper-1`
   - Idioma: `pt` (português)
   - Response format: `verbose_json`
4. **Gera nota com GPT-4o** (OpenAI Chat API)
   - Modelo: `gpt-4o`
   - Temperature: `0.3` (baixa = mais preciso)
   - Response format: `json_object` (structured output)
   - Prompt: Geração de nota clínica fisioterapêutica estruturada
5. Deleta arquivo temporário
6. Retorna: `{ transcription, note, success: true }`
7. **NÃO salva no banco de dados**

**Custo estimado:** ~$0.33 por sessão de 30 minutos

### 4. **Visualização e Edição de Nota** ✅ Completo
**Componente:** `SessionSummary_fullscreen.tsx` (1060 linhas)

**Estrutura da nota clínica:**
- ✅ **Resumo Executivo**: Queixa principal, nível de dor (0-10), evolução
- ✅ **Anamnese**: Histórico atual, antecedentes, medicamentos, objetivos
- ✅ **Diagnóstico Fisioterapêutico**: Principal, secundários, CIF
- ✅ **Intervenções**: Técnicas manuais, exercícios terapêuticos, recursos eletrotermofototerapêuticos
- ✅ **Resposta ao Tratamento**: Imediata, efeitos, feedback
- ✅ **Orientações**: Domiciliares, ergonômicas, precauções
- ✅ **Plano de Tratamento**: Frequência, duração, objetivos (curto/longo prazo), critérios de alta
- ✅ **Observações Adicionais**: Campo livre para anotações
- ✅ **Próxima Sessão**: Data sugerida, foco

**Features:**
- ✅ Todas as seções expansíveis/colapsáveis
- ✅ Todos os campos editáveis (inline editing)
- ✅ Arrays editáveis (adicionar/remover itens)
- ✅ Transcrição completa exibida em seção separada
- ✅ Normalização automática da nota da API (compatibilidade)
- ✅ Fallback para mock data se API falhar
- ✅ Disclaimer de IA (aviso sobre revisão obrigatória)

### 5. **Salvamento no Prontuário** ✅ Completo
**Endpoint:** `POST /api/sessions/save`

**Fluxo:**
1. Recebe dados revisados: patientId, transcription, note (JSON), sessionData, audioBlob
2. Verifica se paciente existe
3. **Move áudio de `/temp` para `/uploads/audio/`** (storage permanente)
4. Cria `Session` no banco:
   - `status: 'completed'` (visível no prontuário)
   - Inclui: audioUrl, audioSize, transcription, durationMin, sessionType, specialty
5. Cria `Note` no banco vinculada à sessão:
   - `contentJson`: nota estruturada em JSON
   - `aiGenerated: true`
   - `aiModel: 'gpt-4o'`
   - `aiPromptUsed`: registro do prompt para auditoria
6. **Transação atômica:** Session + Note criados juntos ou falha total
7. Retorna: `{ success: true, sessionId, noteId }`

**⚠️ CRÍTICO:** Esta é a **ÚNICA rota** que cria registros de sessão no banco de dados.

### 6. **Cancelamento de Sessão** ✅ Completo
- ✅ Botão "Cancelar" em cada tela
- ✅ Confirmação antes de descartar
- ✅ Limpeza de estados e memória
- ✅ Redirecionamento para `/dashboard`
- ✅ Áudio temporário é descartado (não salvo)

---

## 🗄️ Modelos de Dados (Prisma)

### Session
```typescript
- sessionStarted: boolean          // Sessão foi iniciada?
- selectedPatient: Patient | null  // Paciente selecionado
- isRecording: boolean             // Está gravando?
- isPaused: boolean                // Está pausado?
- duration: number                 // Duração em segundos
- transcription: string[]          // Segmentos transcritos
- showSummary: boolean             // Mostrar resumo?
```

**Funcionalidades:**
- Gerenciamento do timer
- Controle de gravação de áudio via Web Audio API
- Simulação de transcrição (substituir com API real)
- Navegação entre telas

### **PatientSelector.tsx**
Dropdown inteligente para seleção de paciente.

**Features:**
- Busca em tempo real
- Lista scrollável
- Informação de última sessão
- Design limpo e acessível

### **TranscriptionPanel.tsx**
Painel lateral com transcrição ao vivo.

**Features:**
- Auto-scroll automático
- Segmentos numerados
- Indicador de status ativo
- Estado vazio informativo

### **SessionSummary.tsx**
Tela final de revisão e complementação.

**Features:**
- Visualização completa da transcrição
- 4 campos de texto para complementar
- Exportação para PDF (preparado)
- Ações de salvar/descartar

## 🎨 Design System Aplicado

### Cores
```typescript
Primary: #5A9BCF        // Azul principal (gradiente nos controles)
Background: #F7F7F7     // Fundo da página
White: #FFFFFF          // Painéis
Success: green-600      // Sessão finalizada
Warning: yellow-400     // Pausado
Danger: red-500         // Gravando/Parar
```

### Estados Visuais
- **Gravando**: Dot vermelho pulsante + ícone microfone animado
- **Pausado**: Dot amarelo + ícone microfone off
- **Finalizado**: Check verde + resumo completo

## 🚀 Tecnologias Utilizadas

- **Web Audio API** - Gravação de áudio nativo
- **MediaRecorder API** - Captura de stream de áudio
- **React Hooks** - useEffect, useRef, useState
- **Next.js 14** - App Router e Client Components
- **Tailwind CSS** - Estilização e animações
- **Lucide React** - Ícones

## 📱 Responsividade

✅ **Desktop**: Layout em duas colunas (controles | transcrição)
✅ **Mobile/Tablet**: Layout empilhado verticalmente
✅ **Componentes adaptáveis**: Todos os painéis se ajustam ao tamanho da tela

## ⚡ Funcionalidades Técnicas

### Gravação de Áudio
```typescript
// Solicitação de permissão do microfone
navigator.mediaDevices.getUserMedia({ audio: true })

// Configuração do MediaRecorder
const mediaRecorder = new MediaRecorder(stream);
mediaRecorder.start(1000); // Chunks a cada 1s

// Captura de dados
mediaRecorder.ondataavailable = (event) => {
  // Processar chunk de áudio
  // Enviar para API de transcrição
}
```

### Timer Preciso
```typescript
// Intervalo de 1 segundo
useEffect(() => {
  if (isRecording && !isPaused) {
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  }
  return () => clearInterval(timerRef.current);
}, [isRecording, isPaused]);
```

### Auto-scroll Inteligente
```typescript
useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }
}, [transcription]);
```

## 🔮 Integrações Futuras

### API de Transcrição
```typescript
// Substituir simulação por API real (ex: OpenAI Whisper)
const transcribeAudio = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  
  const response = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
};
```

### Salvamento no Backend
```typescript
// Endpoint para salvar sessão completa
POST /api/sessions
{
  patientId: string;
  duration: number;
  transcription: string[];
  audioUrl: string;
  diagnosis: string;
  treatment: string;
  nextSteps: string;
  notes: string;
}
```

### Exportação PDF
```typescript
// Biblioteca sugerida: jsPDF ou react-pdf
import { jsPDF } from 'jspdf';

const generatePDF = (sessionData) => {
  const doc = new jsPDF();
  doc.text('Relatório de Sessão', 10, 10);
  // ... adicionar conteúdo
  doc.save('sessao.pdf');
};
```

## 🎓 Boas Práticas Implementadas

✅ **Gerenciamento de Estado**: Estados bem organizados e isolados
✅ **Cleanup de Recursos**: Parar stream de áudio ao desmontar
✅ **UX Feedback**: Indicadores visuais claros de cada estado
✅ **Confirmações**: Alertas antes de ações destrutivas
✅ **Acessibilidade**: Aria-labels e títulos descritivos
✅ **Performance**: useRef para evitar re-renders desnecessários
✅ **Código Limpo**: Componentes modulares e reutilizáveis

## 🐛 Tratamento de Erros

### Permissão do Microfone
```typescript
try {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  // Continuar com gravação
} catch (error) {
  console.error('Erro ao acessar microfone:', error);
  alert('Não foi possível acessar o microfone. Verifique as permissões.');
}
```

### Compatibilidade do Navegador
```typescript
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  alert('Seu navegador não suporta gravação de áudio.');
}
```

## 📊 Métricas e Analytics (Futuro)

- Tempo médio de sessão por fisioterapeuta
- Taxa de uso da transcrição automática
- Campos mais preenchidos no resumo
- Exportações de PDF realizadas

## 🔐 Segurança

- ✅ Solicitação de permissão explícita do usuário
- ✅ Áudio processado localmente
- 🔄 Implementar: Criptografia de dados sensíveis
- 🔄 Implementar: Conformidade com LGPD/HIPAA

## 🚦 Status de Desenvolvimento

| Funcionalidade | Status |
|---------------|--------|
| Seleção de Paciente | ✅ Completo |
| Gravação de Áudio | ✅ Completo |
| Timer | ✅ Completo |
| Controles (Play/Pause/Stop) | ✅ Completo |
| Transcrição (Mock) | ✅ Completo |
| Resumo da Sessão | ✅ Completo |
| Campos Adicionais | ✅ Completo |
| Integração API Transcrição | 🔄 Pendente |
| Salvamento Backend | 🔄 Pendente |
| Exportação PDF | 🔄 Pendente |

---

**Sistema 100% funcional e pronto para uso com dados simulados!**
**Preparado para integração com APIs reais de transcrição e backend.**
