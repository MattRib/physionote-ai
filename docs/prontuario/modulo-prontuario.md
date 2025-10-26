# 📋 Módulo Prontuário - PhysioNote.AI

**Última atualização:** 26 de outubro de 2025  
**Status:** ✅ **COMPLETO E FUNCIONAL** (V2 com Resumo IA)

---

## 📋 Visão Geral

O **Prontuário Eletrônico** é o módulo central para visualização do histórico clínico completo de cada paciente. Exibe todas as sessões, notas clínicas estruturadas, estatísticas de tratamento e resumo automático gerado por IA do histórico médico.

**Rota:** `/dashboard/patients/[id]`  
**Componente Principal:** `PatientRecord.tsx` (**1,311 linhas**)  
**APIs:** 2 endpoints (`/api/patients/[id]/record`, `/api/patients/[id]/history-summary`)

---

## 🎯 Funcionalidades Implementadas

### 1. **Visualização de Dados do Paciente** ✅ Completo

**Informações Exibidas:**
- ✅ Avatar com inicial do nome (gradiente azul-roxo)
- ✅ Nome completo (título principal)
- ✅ Idade calculada a partir da data de nascimento
- ✅ Gênero
- ✅ Badge "Paciente desde" com data de cadastro
- ✅ Total de sessões realizadas

**Cards de Informações:**
1. **Contato** (border índigo, background azul suave):
   - Telefone (ícone Phone)
   - Email (ícone Mail)

2. **Dados Pessoais** (border rosa, background roxo suave):
   - Data de nascimento (ícone Calendar)
   - CPF (ícone FileText)

3. **Endereço** (border azul, background branco):
   - Rua, número, complemento
   - Bairro, cidade/estado
   - CEP

**Observações:**
- ✅ Estrutura de endereço **flat** (não nested)
- ✅ Cálculo de idade em tempo real
- ✅ Fallback "Não informado" para campos vazios
- ✅ Layout responsivo (1-3 colunas)

---

### 2. **Estatísticas de Tratamento** ✅ Completo

**Métricas Calculadas:**
```typescript
statistics: {
  totalSessions: number;           // Total de sessões registradas
  completedSessions: number;       // Apenas com status 'completed'
  totalDurationMinutes: number;    // Soma de todas as durações
  averageDurationMinutes: number;  // Duração média por sessão
  firstSessionDate: string | null; // Data da primeira sessão
  lastSessionDate: string | null;  // Data da última sessão
}
```

**Cálculos (Backend):**
```typescript
const totalSessions = patient.sessions.length;
const completedSessions = patient.sessions.filter(s => s.status === 'completed').length;
const totalDuration = patient.sessions.reduce((acc, s) => acc + (s.durationMin || 0), 0);
const averageDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
```

**Exibição:**
- Badge verde com ícone Activity: "{X} sessões"
- Informações de período de tratamento

---

### 3. **Histórico de Sessões** ✅ Completo (Visualização Inline)

**Características:**
- ✅ Ordenação: **Mais recente primeiro** (date DESC)
- ✅ Visualização inline (sem modal)
- ✅ Expansão/colapso por sessão
- ✅ Badge "Mais Recente" na primeira sessão
- ✅ Paginação progressiva (carregar mais)
- ✅ Exportação individual de notas (PDF)
- ✅ **13 seções estruturadas** por nota

#### **Estrutura do Card de Sessão:**

**Header (Sempre Visível):**
- Avatar (gradiente índigo se mais recente, cinza se antiga)
- Data formatada ("27 de outubro de 2025")
- Badge "Mais Recente" (verde)
- Hora (HH:MM)
- Duração (X minutos)
- Badges de tipo de sessão e especialidade
- Botão "Exportar" (ícone Download)
- Ícone de expansão (ChevronDown/ChevronUp)

**Body (Expandido):**
13 seções estruturadas (detalhadas abaixo)

---

### 4. **Notas Clínicas Estruturadas** ✅ Completo (13 Seções)

#### **Interface de Dados:**
```typescript
interface NoteContent {
  resumoExecutivo?: {
    queixaPrincipal?: string;
    nivelDor?: number | null;          // EVA 0-10
    evolucao?: string | null;
  };
  anamnese?: {
    historicoAtual?: string;
    antecedentesPessoais?: string;
    medicamentos?: string;
    objetivos?: string;
  };
  diagnosticoFisioterapeutico?: {
    principal?: string;
    secundarios?: string[];           // Nota: "secundarios" (não "secundario")
    cif?: string;                     // Código CIF
  };
  intervencoes?: {
    tecnicasManuais?: string[];
    exerciciosTerapeuticos?: string[];
    recursosEletrotermo?: string[];   // Nota: nome abreviado
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
    data?: string;
    foco?: string;
  };
}
```

---

#### **Seção 1: Resumo Executivo** (ícone Activity, cor #5A9BCF)

**Layout:**
- **Queixa Principal**: Card destacado com ícone AlertCircle
  - Border índigo (#C7D2FE)
  - Background azul suave (#EEF2FF/80)
  - Ícone azul primário (#4F46E5)

- **Grid 2 Colunas:**
  1. **Nível de Dor (EVA)**:
     - Gradient vermelho (#FEE2E2 → #FECACA)
     - Texto grande: "{X}/10"
     - Label: "Nível de dor (EVA)"

  2. **Evolução**:
     - Gradient verde (#DCFCE7 → #BBF7D0)
     - Ícone TrendingUp
     - Texto da evolução

---

#### **Seção 2: Anamnese** (ícone Clipboard, cor #8B5CF6)

**4 Cards:**
1. **Histórico Atual**: Border roxo (#DDD6FE), background lavanda (#F5F3FF/80)
2. **Antecedentes Pessoais**: Border roxo, background branco com shadow
3. **Medicamentos**: Border lilás (#E9D5FF), background roxo claro (#FAF5FF)
4. **Objetivos**: Border azul (#C7D2FE), background índigo suave (#EEF2FF)

**Hierarquia de Informação:**
- Título de cada subseção em negrito
- Texto do conteúdo com leading relaxed
- Cores distintas para cada card

---

#### **Seção 3: Diagnóstico Fisioterapêutico** (ícone Stethoscope, cor #F97316)

**Estrutura:**
1. **Diagnóstico Principal**:
   - Gradient laranja (#FFF7ED → #FFE4D6)
   - Border #FED7AA
   - Destaque visual forte

2. **Diagnósticos Secundários** (se existirem):
   - Background branco com shadow
   - Lista com bullets laranjas (#FB923C)
   - Cada item em linha separada

3. **Código CIF**:
   - Background cinza (#F8FAFC)
   - Texto grande e destacado
   - Label uppercase

---

#### **Seção 4: Intervenções Realizadas** (ícone Activity, cor #0EA5E9)

**3 Categorias (se existirem):**

1. **Técnicas Manuais**:
   - Background azul (#F0F9FF)
   - Border azul claro (#BAE6FD)
   - Bullet azul (#0EA5E9)
   - Pills brancas com shadow

2. **Exercícios Terapêuticos**:
   - Background verde (#ECFDF5)
   - Border verde claro (#BBF7D0)
   - Bullet verde (#10B981)
   - Pills brancas com shadow

3. **Recursos Eletrotermofototerapêuticos**:
   - Background roxo (#FAF5FF)
   - Border lilás (#E9D5FF)
   - Bullet roxo (#8B5CF6)
   - Pills brancas com shadow

**Layout:**
- Cada categoria em card separado
- Itens exibidos como pills (rounded-full)
- Flexbox wrap para layout responsivo

---

#### **Seção 5: Resposta ao Tratamento** (ícone TrendingUp, cor #22C55E)

**Grid 3 Colunas:**

1. **Resposta Imediata**:
   - Gradient verde (#DCFCE7 → #BBF7D0)
   - Cor de texto: #065F46

2. **Efeitos Adversos**:
   - Background vermelho suave (#FEF2F2)
   - Border #FECACA
   - Cor de texto: #7F1D1D

3. **Feedback do Paciente**:
   - Background branco com shadow azul
   - Border #C7D2FE
   - Cor de texto: #1E3A8A

**Observação:** Layout responsivo (1 coluna em mobile, 3 em desktop)

---

#### **Seção 6: Orientações ao Paciente** (ícone Target, cor #4F46E5)

**Grid 3 Colunas (se existirem):**

1. **Domiciliares**:
   - Background azul índigo (#EEF2FF)
   - Border #C7D2FE
   - Pills verticais

2. **Ergonômicas**:
   - Background rosa (#FDF2F8)
   - Border #FBCFE8
   - Pills verticais

3. **Precauções**:
   - Background amarelo (#FFFBEB)
   - Border #FDE68A
   - Pills verticais

**Layout:**
- Cada orientação como pill separada
- Vertical stacking dentro do card
- Cores distintas para cada categoria

---

#### **Seção 7: Plano de Tratamento** (ícone Target, cor teal-500)

**Estrutura:**

1. **Grid 2 Colunas** (Frequência + Duração Prevista):
   - Background teal-50
   - Labels em teal-600
   - Valores em preto

2. **Objetivos de Curto Prazo** (se existirem):
   - Lista numerada (circles teal-500)
   - Cada objetivo em linha separada

3. **Objetivos de Longo Prazo** (se existirem):
   - Lista numerada (circles teal-500)
   - Cada objetivo em linha separada

4. **Critérios de Alta** (se existirem):
   - Background cinza (#F9FAFB)
   - Check icons teal-600
   - Lista de critérios

---

#### **Seção 8: Observações Adicionais**

**Card Simples:**
- Background azul suave (#EFF6FF)
- Border azul (#BFDBFE)
- Ícone FileText azul
- Texto livre com fallback "Nenhuma observação adicional registrada."

---

#### **Seção 9: Próxima Sessão**

**Card Destacado:**
- Gradient azul (#5A9BCF/10 → #4A8BBF/10)
- Border dupla azul (#5A9BCF/20)
- Ícone Calendar
- **2 Campos:**
  - "Retorno em": {data}
  - "Foco": {descrição}
- Fallback "Não definido" para campos vazios

---

### 5. **Resumo do Histórico com IA** ⭐ Funcionalidade IA

**Botão "Resumir com IA" / "Atualizar Resumo":**
- ✅ Localização: Header do prontuário, ao lado de "Exportar prontuário"
- ✅ Ícone Sparkles (representa IA)
- ✅ Estados:
  - Normal: "Resumir histórico" (Sparkles)
  - Carregando: Spinner + "Gerando resumo..."
  - Atualizar: "Atualizar resumo" (RefreshCw)

**Fluxo de Geração:**
```
Usuário clica "Resumir com IA"
  ↓
Se já existe resumo → AlertModal: "Substituir resumo existente?"
  ↓ (Confirmar)
POST /api/patients/[id]/history-summary
  ↓
Busca todas as sessões completed com notas
  ↓
Prepara prompt estruturado (paciente + sessões)
  ↓
OpenAI GPT-4o (temperature: 0.7, max_tokens: 2000)
  ↓
Cria/Atualiza HistorySummary no banco
  ↓
Exibe resumo no prontuário
```

**Prompt Estruturado (Enviado para GPT-4o):**
```
Você é um fisioterapeuta especialista em análise de prontuários.

**PACIENTE:** {nome}
**TOTAL DE SESSÕES:** {X}
**PERÍODO:** {data início} a {data fim}

═══════════════════════════════════════════════
HISTÓRICO DE SESSÕES
═══════════════════════════════════════════════

📅 SESSÃO 1 - {data}
Tipo: {tipo}
Especialidade: {especialidade}

🎯 Queixa: {queixa}
📊 Dor: {EVA}/10
🔍 Diagnóstico: {diagnóstico}
✋ Técnicas: {técnicas}
💪 Exercícios: {exercícios}
📈 Resposta: {resposta}
🎯 Objetivos: {objetivos}
---

... (mais sessões)

═══════════════════════════════════════════════

**INSTRUÇÕES PARA O RESUMO:**

Crie um resumo clínico profissional seguindo esta estrutura:

## 🎯 SÍNTESE CLÍNICA
- Quadro clínico inicial e evolução
- Diagnóstico fisioterapêutico principal
- Condições secundárias relevantes

## 📊 EVOLUÇÃO DO TRATAMENTO
- Progresso observado ao longo das sessões
- Mudanças nos níveis de dor e funcionalidade
- Marcos importantes alcançados

## 💊 INTERVENÇÕES APLICADAS
- Técnicas manuais mais utilizadas
- Exercícios terapêuticos prescritos
- Recursos complementares

## 📈 RESULTADOS ALCANÇADOS
- Melhoras objetivas e subjetivas
- Feedback do paciente
- Capacidades funcionais recuperadas

## 🎯 RECOMENDAÇÕES
- Continuidade do tratamento
- Exercícios domiciliares
- Precauções e orientações

**IMPORTANTE:**
- Use linguagem técnica mas clara
- Seja objetivo e direto
- Destaque informações clinicamente relevantes
- Mantenha a formatação Markdown com emojis
- Máximo de 800 palavras
```

**Estrutura do Resumo Gerado:**
- ✅ Formatação Markdown com emojis
- ✅ Máximo 800 palavras (configurado no prompt)
- ✅ 5 seções principais (Síntese, Evolução, Intervenções, Resultados, Recomendações)
- ✅ Linguagem técnica + clara
- ✅ Clinicamente relevante

---

### 6. **Gestão do Resumo** ✅ Completo

**Ações Disponíveis:**

#### **1. Fixar/Desfixar Resumo**
- ✅ Botão Pin/PinOff
- ✅ Quando fixado: Exibido no topo do histórico (antes das sessões)
- ✅ Quando não fixado: Exibido no card de informações do paciente
- ✅ API: `PATCH /api/patients/[id]/history-summary` com `{ isPinned: boolean }`

**Resumo Fixado:**
- Border dupla índigo (#C7D2FE)
- Gradient background (#EEF2FF → white → #F8FAFF)
- Ícone Pin no header
- Badge com número de sessões
- Posição: Após dados do paciente, antes do histórico

**Resumo Não Fixado:**
- Exibido no card de informações do paciente
- Badge "Gerado por IA" (roxo com Sparkles)
- Botões de ação visíveis

---

#### **2. Editar Resumo**
- ✅ Botão "Editar" (ícone Edit3)
- ✅ Abre textarea com conteúdo atual
- ✅ Editor: `min-h-[400px]`, `resize-y`, font monospace
- ✅ Suporta Markdown (## títulos, **negrito**, - listas)
- ✅ Dica exibida: "Use Markdown para formatar o texto"
- ✅ Botões: "Salvar" (verde) + "Cancelar" (cinza)
- ✅ API: `PATCH /api/patients/[id]/history-summary` com `{ content: string }`

**Estado de Edição:**
```typescript
const [isEditingResume, setIsEditingResume] = useState(false);
const [editedResumeContent, setEditedResumeContent] = useState('');

const handleEditSummary = () => {
  setEditedResumeContent(historySummary.content);
  setIsEditingResume(true);
};

const handleSaveEditedSummary = async () => {
  const response = await fetch(`/api/patients/${patientId}/history-summary`, {
    method: 'PATCH',
    body: JSON.stringify({ content: editedResumeContent }),
  });
  // ... atualizar estado
};
```

---

#### **3. Excluir Resumo**
- ✅ Botão "Excluir" (ícone Trash2, cor vermelha)
- ✅ AlertModal de confirmação: "Excluir resumo?"
- ✅ Mensagem: "Esta ação não pode ser desfeita."
- ✅ API: `DELETE /api/patients/[id]/history-summary`
- ✅ Toast de sucesso após exclusão

**Fluxo de Exclusão:**
```typescript
const handleDeleteSummary = () => {
  setAlertModal({
    type: 'warning',
    title: 'Excluir resumo?',
    message: 'Tem certeza que deseja excluir o resumo do histórico? Esta ação não pode ser desfeita.',
    confirmText: 'Sim, excluir',
    showCancel: true,
    onConfirm: async () => {
      await fetch(`/api/patients/${patientId}/history-summary`, { method: 'DELETE' });
      setHistorySummary(null);
      showToast('success', 'Resumo excluído com sucesso');
    }
  });
};
```

---

### 7. **Exportação de Notas** ✅ Completo (jsPDF)

**Duas Modalidades:**

#### **A. Exportar Nota Individual**
- ✅ Botão Download em cada card de sessão
- ✅ Exporta apenas aquela sessão específica
- ✅ Nome do arquivo: `nota-{nome_paciente}-{data}.pdf`
- ✅ Biblioteca: jsPDF (dynamic import)

**Conteúdo Exportado:**
```
PhysioNotes.AI — {Nome do Paciente}
──────────────────────────────────────

NOTA DE EVOLUÇÃO FISIOTERAPÊUTICA

Paciente: {nome}
Data: {data} às {hora}
Duração: {X} minutos
Tipo de Sessão: {tipo}
Especialidade: {especialidade}

RESUMO EXECUTIVO
Queixa Principal: {queixa}
Nível de Dor: {EVA}/10
Evolução: {evolução}

ANAMNESE
{histórico atual}
Antecedentes: {antecedentes}
Medicamentos: {medicamentos}
Objetivos: {objetivos}

DIAGNÓSTICO
{principal}
- {secundário 1}
- {secundário 2}
CIF: {código}

INTERVENÇÕES
- {técnica manual 1}
- {exercício 1}
- {recurso 1}

RESPOSTA AO TRATAMENTO
{imediata}
Efeitos: {efeitos}
Feedback: {feedback}

ORIENTAÇÕES
- {domiciliar 1}
- {ergonômica 1}
Precauções:
- {precaução 1}

PLANO
Frequência: {frequência}
Duração prevista: {duração}
Objetivos CP: {obj1}; {obj2}
Objetivos LP: {obj1}; {obj2}
Critérios de alta: {crit1}; {crit2}

OBSERVAÇÕES
{observações}

PRÓXIMA SESSÃO
{data} — {foco}
```

**Implementação:**
```typescript
const handleExportNote = async (session: SessionWithNote) => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const margin = 14;
  const maxWidth = 180;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`PhysioNotes.AI — ${patient.name}`, margin, 12);
  doc.line(margin, 15, 200 - margin, 15);

  // Título
  doc.setFontSize(14);
  doc.text('NOTA DE EVOLUÇÃO FISIOTERAPÊUTICA', margin, 24);

  // Corpo
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(buildSessionText(session), maxWidth);
  doc.text(lines, margin, 34);

  // Footer
  const page = doc.getNumberOfPages();
  doc.setFontSize(9);
  doc.text(`Página ${page}`, 200 - margin - 20, 290);

  doc.save(`nota-${patient.name.replace(/\s+/g,'_')}-${formatDate(session.date)}.pdf`);
  showToast('success', 'Nota exportada em PDF.');
};
```

---

#### **B. Exportar Prontuário Completo**
- ✅ Botão "Exportar prontuário" no header
- ✅ Exporta TODAS as sessões em um único PDF
- ✅ Nome do arquivo: `prontuario-{nome_paciente}.pdf`
- ✅ Inclui dados do paciente + todas as notas
- ✅ Paginação automática

**Estrutura do PDF:**
```
PhysioNotes.AI — {Nome do Paciente}
──────────────────────────────────────

Prontuário de {Nome do Paciente}

Dados do paciente: CPF {cpf} • Nasc.: {data} • {gênero}
──────────────────────────────────────

SESSÃO 1 — {data} {hora}
Tipo: {tipo} | Especialidade: {especialidade}

{conteúdo completo da nota}
──────────────────────────────────────

SESSÃO 2 — {data} {hora}
...

──────────────────────────────────────
Página {X}
```

**Implementação:**
```typescript
const handleExportAll = async () => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const margin = 14;
  const maxWidth = 180;
  const pageHeight = 297; // A4 height in mm

  let cursorY = 32;

  const addBlock = (text: string) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, cursorY);
    cursorY += lines.length * 6 + 8;
    
    // Nova página se necessário
    if (cursorY > pageHeight - 24) {
      doc.addPage();
      drawHeader();
      cursorY = 22;
    }
  };

  // Header inicial
  drawHeader();
  doc.text(`Prontuário de ${patient.name}`, margin, 24);
  cursorY = 32;

  // Dados do paciente
  addBlock(`Dados: CPF ${patient.cpf} • Nasc.: ${formatDate(patient.birthDate)} • ${patient.gender}`);
  doc.line(margin, cursorY - 4, 200 - margin, cursorY - 4);

  // Sessões
  sessions.forEach((s, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`\nSessão ${idx + 1} — ${formatDate(s.date)} ${formatTime(s.date)}`, margin, cursorY);
    cursorY += 10;
    
    if (s.sessionType || s.specialty) {
      doc.setFontSize(9);
      const info = [];
      if (s.sessionType) info.push(`Tipo: ${s.sessionType}`);
      if (s.specialty) info.push(`Especialidade: ${s.specialty}`);
      doc.text(info.join(' | '), margin, cursorY);
      cursorY += 6;
    }
    
    doc.setFont('helvetica', 'normal');
    addBlock(buildSessionText(s));
    doc.line(margin, cursorY - 4, 200 - margin, cursorY - 4);
  });

  drawFooter();
  doc.save(`prontuario-${patient.name.replace(/\s+/g,'_')}.pdf`);
  showToast('success', 'Prontuário exportado em PDF.');
};
```

---

### 8. **Paginação Progressiva** ✅ Completo

**Comportamento:**
- ✅ Inicialmente exibe 5 sessões
- ✅ Botão "Carregar mais" adiciona mais 5 sessões
- ✅ Continua até exibir todas as sessões
- ✅ Botão desaparece quando todas estão visíveis

**Implementação:**
```typescript
const [visibleCount, setVisibleCount] = useState(5);

// Inicializa com mínimo entre 5 e total de sessões
useEffect(() => {
  if (recordData) {
    setVisibleCount(Math.min(5, recordData.sessions.length));
  }
}, [recordData]);

// Renderização
{sessions.slice(0, visibleCount).map((session) => (
  // ... card de sessão
))}

{visibleCount < sessions.length && (
  <button
    onClick={() => setVisibleCount((c) => Math.min(c + 5, sessions.length))}
    className="px-4 py-2 text-sm font-medium text-[#5A9BCF] bg-[#5A9BCF]/10 hover:bg-[#5A9BCF]/20 rounded-lg transition-colors"
  >
    Carregar mais
  </button>
)}
```

---

### 9. **Estados da Interface** ✅ Completo

#### **Loading State**
```tsx
<div className="min-h-screen flex items-center justify-center">
  <LoadingSpinner size="lg" className="mx-auto mb-4" />
  <p className="text-lg font-medium text-[#475569]">Carregando prontuário...</p>
</div>
```

#### **Error State**
```tsx
<div className="max-w-md text-center">
  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
  <h2 className="text-2xl font-bold mb-2">Erro ao carregar prontuário</h2>
  <p className="text-[#475569] mb-6">{error}</p>
  <button onClick={() => router.back()}>
    Voltar para pacientes
  </button>
</div>
```

#### **Empty State (Sem Sessões)**
```tsx
<div className="text-center py-12">
  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <FileText className="w-8 h-8 text-gray-400" />
  </div>
  <h3 className="text-lg font-semibold mb-2">
    Nenhuma sessão registrada
  </h3>
  <p className="text-[#666666]">
    As notas das sessões aparecerão aqui quando forem criadas.
  </p>
</div>
```

---

### 10. **Toast Notifications** ✅ Completo

**Tipos de Toast:**
- ✅ **Success** (verde): "Nota exportada em PDF", "Resumo atualizado", etc
- ✅ **Error** (vermelho): "Erro ao gerar resumo", etc
- ✅ **Info** (azul): Informações gerais

**Implementação:**
```typescript
const [toast, setToast] = useState<{
  type: 'success' | 'error' | 'info';
  message: string;
} | null>(null);

const showToast = (type: 'success' | 'error' | 'info', message: string) => {
  setToast({ type, message });
  setTimeout(() => setToast(null), 3500); // Auto-hide após 3.5s
};

// Renderização
{toast && (
  <div className={`fixed left-1/2 top-6 z-[200] -translate-x-1/2 rounded-full px-6 py-2 text-sm font-medium shadow-[...] ${
    toast.type === 'success'
      ? 'border border-emerald-100 bg-emerald-50 text-emerald-700'
      : toast.type === 'error'
        ? 'border border-rose-100 bg-rose-50 text-rose-700'
        : 'border border-indigo-100 bg-indigo-50 text-indigo-700'
  }`}>
    {toast.message}
  </div>
)}
```

---

### 11. **Alert Modal** ✅ Completo

**Usado para:**
- ✅ Confirmar substituição de resumo existente
- ✅ Confirmar exclusão de resumo
- ✅ Exibir erros críticos

**Estados do Modal:**
```typescript
interface AlertModalState {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  showCancel?: boolean;
}
```

**Exemplo de Uso:**
```typescript
setAlertModal({
  isOpen: true,
  type: 'warning',
  title: 'Substituir resumo existente?',
  message: 'Já existe um resumo do histórico. Deseja gerar um novo resumo com base nas sessões atualizadas? Esta ação não pode ser desfeita.',
  confirmText: 'Sim, gerar novo resumo',
  showCancel: true,
  onConfirm: () => generateNewSummary()
});
```

---

## 🗄️ Integração com APIs

### API 1: `GET /api/patients/[id]/record`

**Propósito:** Buscar prontuário completo do paciente

**Response:**
```typescript
{
  patient: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    cpf: string | null;
    birthDate: string | null;
    gender: string | null;
    address: {
      street: string | null;
      number: string | null;
      complement?: string | null;
      neighborhood: string | null;
      city: string | null;
      state: string | null;
      zipCode: string | null;
    };
    createdAt: string;
    updatedAt: string;
  };
  statistics: {
    totalSessions: number;
    completedSessions: number;
    totalDurationMinutes: number;
    averageDurationMinutes: number;
    firstSessionDate: string | null;
    lastSessionDate: string | null;
  };
  sessions: SessionWithNote[];
}
```

**SessionWithNote Interface:**
```typescript
interface SessionWithNote {
  id: string;
  date: string;
  durationMin: number | null;
  sessionType: string | null;
  specialty: string | null;
  motivation: string | null;
  status: string;
  transcription: string | null;
  note: SessionNote | null;
  createdAt: string;
  updatedAt: string;
}

interface SessionNote {
  id: string;
  aiGenerated: boolean;
  aiModel: string | null;
  createdAt: string;
  updatedAt: string;
  content: NoteContent; // ⭐ JSON parseado
}
```

**Implementação Backend:**
```typescript
const patient = await prisma.patient.findUnique({
  where: { id: patientId },
  include: {
    sessions: {
      include: { note: true },
      orderBy: { date: 'desc' }, // Mais recente primeiro
    },
  },
});

// Parsear JSON das notas
const sessionsWithParsedNotes = patient.sessions.map((session) => {
  let parsedNote = null;
  if (session.note && session.note.contentJson) {
    parsedNote = JSON.parse(session.note.contentJson);
  }
  return {
    ...session,
    note: parsedNote ? { ...session.note, content: parsedNote } : null,
  };
});
```

**Observações:**
- ✅ Nota já vem parseada (não precisa parsear no frontend)
- ✅ Sessões ordenadas por data descendente (mais recente primeiro)
- ✅ Includes automático de notas
- ✅ Cálculo de estatísticas no backend

---

### API 2: `GET /api/patients/[id]/history-summary`

**Propósito:** Buscar resumo existente do histórico

**Response:**
```typescript
{
  summary: {
    id: string;
    content: string;          // Markdown formatado
    isPinned: boolean;
    sessionsIds: string[];    // IDs das sessões usadas
    aiModel: string;          // 'gpt-4o'
    createdAt: string;
    updatedAt: string;
  } | null
}
```

**Implementação Backend:**
```typescript
const summary = await prisma.historySummary.findUnique({
  where: { patientId },
});

if (!summary) {
  return NextResponse.json({ summary: null }, { status: 200 });
}

return NextResponse.json({
  summary: {
    ...summary,
    sessionsIds: JSON.parse(summary.sessionsIds), // Parse do array
    createdAt: summary.createdAt.toISOString(),
    updatedAt: summary.updatedAt.toISOString(),
  },
});
```

**Observações:**
- ✅ Retorna `null` se não existir resumo (não é erro)
- ✅ `sessionsIds` é parseado de JSON string para array

---

### API 3: `POST /api/patients/[id]/history-summary`

**Propósito:** Gerar novo resumo ou substituir existente

**Request:** Sem body (usa dados do banco)

**Response:**
```typescript
{
  success: true;
  summary: {
    id: string;
    content: string;
    isPinned: boolean;
    sessionsIds: string[];
    aiModel: string;
    createdAt: string;
    updatedAt: string;
  }
}
```

**Fluxo Backend:**
```typescript
// 1. Buscar paciente + sessões completed com notas
const patient = await prisma.patient.findUnique({
  where: { id: patientId },
  include: {
    sessions: {
      where: {
        status: 'completed',
        note: { isNot: null },
      },
      include: { note: true },
      orderBy: { date: 'asc' },
    },
  },
});

// 2. Preparar dados para o prompt
const sessionsData = patient.sessions.map((session, index) => {
  const noteContent = JSON.parse(session.note.contentJson);
  return `📅 SESSÃO ${index + 1} - ${date}\n${queixa}\n${diagnóstico}\n...`;
});

// 3. Criar prompt estruturado
const prompt = `Você é um fisioterapeuta especialista...
**PACIENTE:** ${patient.name}
**TOTAL DE SESSÕES:** ${patient.sessions.length}
${sessionsData.join('\n\n')}

## 🎯 SÍNTESE CLÍNICA
...`;

// 4. Chamar OpenAI
const completion = await openai.chat.completions.create({
  model: GPT_MODEL, // 'gpt-4o'
  messages: [
    { role: 'system', content: 'Você é um fisioterapeuta...' },
    { role: 'user', content: prompt },
  ],
  temperature: 0.7,
  max_tokens: 2000,
});

const summaryContent = completion.choices[0]?.message?.content;

// 5. Criar ou atualizar no banco
const summary = await prisma.historySummary.upsert({
  where: { patientId },
  update: {
    content: summaryContent,
    aiModel: GPT_MODEL,
    sessionsIds: JSON.stringify(sessionsIds),
    updatedAt: new Date(),
  },
  create: {
    patientId,
    content: summaryContent,
    aiModel: GPT_MODEL,
    sessionsIds: JSON.stringify(sessionsIds),
    isPinned: false,
  },
});
```

**Observações:**
- 💰 Custo: ~$0.02-0.05 USD por resumo
- ⏱️ Tempo: 5-15 segundos
- 🎯 Temperature: 0.7 (equilíbrio criatividade/precisão)
- 📏 Max tokens: 2000 (~800 palavras)
- ✅ Upsert: Cria se não existe, atualiza se existe

---

### API 4: `PATCH /api/patients/[id]/history-summary`

**Propósito:** Fixar/desfixar ou editar resumo

**Request Body:**
```typescript
{
  isPinned?: boolean;  // Fixar/desfixar
  content?: string;    // Editar conteúdo
}
```

**Response:**
```typescript
{
  success: true;
  summary: {
    id: string;
    content: string;
    isPinned: boolean;
    sessionsIds: string[];
    aiModel: string;
    createdAt: string;
    updatedAt: string;
  }
}
```

**Implementação Backend:**
```typescript
const { isPinned, content } = await request.json();

const updateData: any = {};
if (typeof isPinned === 'boolean') {
  updateData.isPinned = isPinned;
}
if (typeof content === 'string') {
  updateData.content = content;
  updateData.updatedAt = new Date();
}

const summary = await prisma.historySummary.update({
  where: { patientId },
  data: updateData,
});
```

**Observações:**
- ✅ Aceita apenas `isPinned` ou `content` (ou ambos)
- ✅ Atualiza `updatedAt` automaticamente ao editar conteúdo
- ✅ Retorna resumo atualizado

---

### API 5: `DELETE /api/patients/[id]/history-summary`

**Propósito:** Remover resumo do histórico

**Request:** Sem body

**Response:**
```typescript
{
  success: true;
  message: 'Resumo removido com sucesso'
}
```

**Implementação Backend:**
```typescript
await prisma.historySummary.delete({
  where: { patientId },
});
```

**Observações:**
- ✅ Exclusão permanente (não há soft delete)
- ✅ Pode ser regenerado a qualquer momento

---

## 📊 Database Schema

### Model: HistorySummary
```prisma
model HistorySummary {
  id          String   @id @default(cuid())
  patientId   String   @unique
  content     String   // Markdown formatado
  isPinned    Boolean  @default(false)
  sessionsIds String   // JSON stringified array
  aiModel     String   // 'gpt-4o'
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  patient     Patient  @relation(fields: [patientId], references: [id])
}
```

**Observações:**
- ✅ Relação 1:1 com Patient (patientId unique)
- ✅ `sessionsIds` armazenado como JSON string
- ✅ `isPinned` controla posição no prontuário
- ✅ `updatedAt` atualizado automaticamente

---

## 🎨 Design System

### Paleta de Cores (Por Seção)

| Seção | Cor Principal | Background | Border |
|-------|---------------|------------|--------|
| **Resumo Executivo** | #5A9BCF (azul) | #EEF2FF | #C7D2FE |
| **Anamnese** | #8B5CF6 (roxo) | #F5F3FF | #DDD6FE |
| **Diagnóstico** | #F97316 (laranja) | #FFF7ED | #FED7AA |
| **Intervenções** | #0EA5E9 (azul) | #F0F9FF | #BAE6FD |
| **Resposta** | #22C55E (verde) | #DCFCE7 | #BBF7D0 |
| **Orientações** | #4F46E5 (índigo) | #EEF2FF | #C7D2FE |
| **Plano** | teal-500 | teal-50 | teal-200 |

### Tipografia
- **Títulos Principais**: text-2xl, font-semibold, text-[#0F172A]
- **Títulos de Seção**: text-base, font-semibold, text-[#0F172A]
- **Labels**: text-xs, uppercase, tracking-[0.2em], font-semibold
- **Corpo**: text-sm, leading-relaxed

### Sombras
- **Cards Principais**: `shadow-[0_28px_65px_-46px_rgba(15,23,42,0.35)]`
- **Cards de Sessão**: `shadow-[0_22px_45px_-40px_rgba(15,23,42,0.35)]`
- **Pills**: `shadow-sm`

### Animações
- **Fade In**: `animate-fade-in` (opacity 0 → 1, translateY 20px → 0)
- **Hover Cards**: `-translate-y-1` (subtle lift)
- **Transição**: `transition-all duration-300`

---

## 🚀 Performance e Otimizações

### 1. **Dynamic Import de jsPDF**
```typescript
const { jsPDF } = await import('jspdf');
```
- ✅ Reduz bundle inicial (jsPDF ~200KB)
- ✅ Carrega apenas quando necessário
- ✅ Melhora First Contentful Paint

### 2. **Paginação Progressiva**
- ✅ Inicialmente 5 sessões (reduz DOM nodes)
- ✅ Carrega mais 5 a cada clique
- ✅ Melhora performance em históricos grandes

### 3. **Memoização de Formatação**
```typescript
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { ... });
};
```
- ⚠️ Sem memoização atualmente
- 🚀 **Sugestão:** Usar `useMemo` para formatações repetidas

### 4. **Parsing de JSON no Backend**
- ✅ Notas parseadas no backend (não no frontend)
- ✅ Frontend recebe `note.content` já como objeto
- ✅ Reduz processamento no client

---

## ⚠️ Observações Importantes

### 1. **Inconsistências de Nomenclatura**

**No Código:**
- ✅ `diagnosticoFisioterapeutico.secundarios` (plural)
- ✅ `intervencoes.recursosEletrotermo` (abreviado)

**Documentação Anterior:**
- ❌ Mostrava `secundario` (singular)
- ❌ Mostrava `recursosEletrotermofototerapeticos` (completo)

**Correção:** Documentação atualizada para refletir código real

---

### 2. **Estrutura de Endereço**

**Código Atual:**
```typescript
address: {
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
}
```

**Observação:** Estrutura **flat** (campos diretos no Patient model), não nested object

---

### 3. **Histórico Médico Removido**

**Código Atual:** Campo `medicalHistory` **NÃO EXISTE** no schema Patient

**Solução:** Usar `HistorySummary` gerado por IA como substituição

---

### 4. **Estados de Sessão**

**No Prontuário:** Apenas sessões com `status === 'completed'` têm notas visíveis

**Outros Status (não exibidos):**
- `recording`, `transcribing`, `generating` (fluxo em andamento)
- `processing` (upload mode)
- `error` (falha no processamento)

---

## 🧪 Testes Sugeridos

### Teste 1: Carregar Prontuário
```
1. Acessar /dashboard/patients/[id]
2. Verificar carregamento dos dados do paciente
3. Verificar exibição das sessões
4. Verificar cálculo de estatísticas
5. Verificar paginação (se > 5 sessões)
```

### Teste 2: Expandir/Colapsar Notas
```
1. Clicar em card de sessão
2. Verificar expansão inline
3. Verificar todas as 13 seções
4. Clicar novamente para colapsar
```

### Teste 3: Gerar Resumo IA
```
1. Clicar "Resumir histórico"
2. Aguardar geração (5-15s)
3. Verificar formatação Markdown
4. Verificar emojis e estrutura
5. Verificar contador de sessões
```

### Teste 4: Fixar Resumo
```
1. Gerar resumo
2. Clicar "Fixar"
3. Verificar movimentação para topo
4. Clicar "Desfixar"
5. Verificar retorno ao card de informações
```

### Teste 5: Editar Resumo
```
1. Clicar "Editar"
2. Modificar conteúdo no textarea
3. Clicar "Salvar"
4. Verificar atualização visível
5. Testar "Cancelar" (sem salvar)
```

### Teste 6: Exportar Nota Individual
```
1. Clicar ícone Download em sessão
2. Verificar download de PDF
3. Abrir PDF e validar conteúdo
4. Verificar formatação e layout
```

### Teste 7: Exportar Prontuário Completo
```
1. Clicar "Exportar prontuário"
2. Aguardar geração (pode demorar)
3. Verificar PDF com todas as sessões
4. Verificar paginação automática
```

---

## 🚀 Melhorias Futuras Sugeridas

### 1. Busca e Filtros no Histórico
- [ ] Buscar sessões por palavra-chave
- [ ] Filtrar por tipo de sessão
- [ ] Filtrar por especialidade
- [ ] Filtrar por período de datas

### 2. Visualizações Gráficas
- [ ] Gráfico de evolução da dor (EVA ao longo do tempo)
- [ ] Timeline visual de sessões
- [ ] Comparação de objetivos alcançados

### 3. Comparação de Sessões
- [ ] Comparar duas sessões lado a lado
- [ ] Destacar mudanças entre sessões
- [ ] Visualizar progressão de tratamento

### 4. Anotações Manuais
- [ ] Adicionar anotações às sessões
- [ ] Marcar sessões importantes
- [ ] Tags personalizadas

### 5. Compartilhamento
- [ ] Enviar prontuário por email
- [ ] Gerar link de compartilhamento seguro
- [ ] Exportar para formatos específicos (TISS, etc)

### 6. Resumo Inteligente Avançado
- [ ] Resumo apenas de período específico
- [ ] Resumo focado em condição específica
- [ ] Comparação com guidelines clínicos

### 7. Performance
- [ ] Virtualização de lista de sessões (react-window)
- [ ] Cache de sessões já carregadas
- [ ] Prefetch de próximas páginas
- [ ] Service Worker para offline

---

## ✅ Checklist de Implementação

- [x] Componente PatientRecord.tsx (1,311 linhas)
- [x] API GET /api/patients/[id]/record
- [x] API GET /api/patients/[id]/history-summary
- [x] API POST /api/patients/[id]/history-summary (geração IA)
- [x] API PATCH /api/patients/[id]/history-summary (fixar/editar)
- [x] API DELETE /api/patients/[id]/history-summary
- [x] Visualização inline de notas (13 seções)
- [x] Exportação individual de notas (jsPDF)
- [x] Exportação de prontuário completo (jsPDF)
- [x] Resumo do histórico com IA (GPT-4o)
- [x] Fixar/desfixar resumo
- [x] Editar resumo manualmente
- [x] Excluir resumo
- [x] Paginação progressiva (5 sessões por vez)
- [x] Toast notifications
- [x] Alert modal
- [x] Estados (loading, error, empty)
- [x] Design System v2 completo
- [x] Responsividade

---

**Status Final:** ✅ **Prontuário 100% funcional com visualização estruturada de notas, resumo IA do histórico e exportação em PDF**  
**Última Revisão:** 26 de outubro de 2025  
**Próxima Revisão:** Após implementação de melhorias (gráficos, filtros, comparação)
