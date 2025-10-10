# Fluxo de Transcrição - PhysioNote.AI

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
