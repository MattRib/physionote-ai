# Sistema de Sessão de Fisioterapia

## 📋 Visão Geral

O módulo de Sessão do PhysioNote.AI permite realizar consultas de fisioterapia com gravação de áudio, transcrição em tempo real e geração automática de relatórios estruturados.

## 🎯 Funcionalidades Implementadas

### 1. **Seleção de Paciente**
- ✅ Seletor dropdown com busca
- ✅ Lista de pacientes com última sessão
- ✅ Busca em tempo real
- ✅ Interface intuitiva com avatares

### 2. **Gravação de Sessão**
- ✅ Gravação de áudio através do navegador
- ✅ Timer em tempo real (HH:MM:SS)
- ✅ Controles de pausar/retomar
- ✅ Botão de finalizar sessão
- ✅ Indicador visual de status (gravando/pausado)
- ✅ Animações suaves e feedback visual

### 3. **Transcrição em Tempo Real**
- ✅ Painel de transcrição ao vivo
- ✅ Segmentos numerados
- ✅ Auto-scroll para novos conteúdos
- ✅ Contador de segmentos transcritos
- ✅ Interface dividida (controles + transcrição)

### 4. **Resumo da Sessão**
- ✅ Visualização completa da transcrição
- ✅ Informações da sessão (paciente, duração, segmentos)
- ✅ Campos editáveis:
  - Diagnóstico/Avaliação
  - Tratamento Realizado
  - Orientações e Próximos Passos
  - Observações Gerais
- ✅ Exportação para PDF (preparado)
- ✅ Salvar ou descartar sessão

## 🎨 Interface e UX

### Layout Principal (Durante Gravação)

```
┌─────────────────────────────────────────────────┐
│ Header: Paciente | Timer | Cancelar            │
├──────────────────────┬──────────────────────────┤
│  Painel Esquerdo     │  Painel Direito         │
│  (Azul Gradiente)    │  (Transcrição)          │
│                      │                          │
│  ⏱️ 00:15:32         │  📝 Transcrição          │
│  🔴 Gravando         │                          │
│                      │  1. Texto...             │
│       🎤             │  2. Texto...             │
│    (Pulsando)        │  3. Texto...             │
│                      │                          │
│   ⏸️  ⏹️            │  Auto-scroll             │
│                      │                          │
└──────────────────────┴──────────────────────────┘
```

### Fluxo de Uso

```
1. Seleção de Paciente
   ↓
2. Iniciar Sessão
   ↓
3. Gravação + Transcrição
   ↓
4. Finalizar Sessão
   ↓
5. Revisar e Complementar
   ↓
6. Salvar Relatório
```

## 📁 Estrutura de Arquivos

```
src/
├── app/
│   └── dashboard/
│       └── session/
│           └── page.tsx              # Página principal de sessão
├── components/
│   └── session/
│       ├── SessionView.tsx           # Container principal
│       ├── PatientSelector.tsx       # Seletor de pacientes
│       ├── TranscriptionPanel.tsx    # Painel de transcrição
│       ├── SessionSummary.tsx        # Resumo final
│       └── index.ts                  # Exports
```

## 🔧 Componentes Detalhados

### **SessionView.tsx**
Container principal que gerencia todo o fluxo da sessão.

**Estados:**
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
