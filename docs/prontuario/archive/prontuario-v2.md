# Patient Record V2 - Prontuário Eletrônico Completo

## 📋 Visão Geral

Atualização completa do componente PatientRecord para exibir notas clínicas completas de forma inline (sem modal), com exportação individual de notas, animações otimizadas e resumo com IA do histórico médico.

## ✨ Mudanças Implementadas

### 1. **Estrutura de Dados Completa**

#### Interface `FullSessionNote`

Substituição da interface simplificada por uma estrutura completa que espelha o formato SOAP de documentação clínica:

```typescript
interface FullSessionNote {
  id: string;
  date: string;
  duration: number;
  
  // Resumo Executivo
  resumoExecutivo: {
    queixaPrincipal: string;
    nivelDor: number;  // 0-10
    evolucao: string;
  };
  
  // Anamnese
  anamnese: {
    historicoAtual: string;
    antecedentesPessoais: string;
    medicamentos: string;
    objetivos: string;
  };
  
  // Diagnóstico Fisioterapêutico
  diagnosticoFisioterapeutico: {
    principal: string;
    secundario: string[];
    cif: string;  // Classificação Internacional de Funcionalidade
  };
  
  // Intervenções Realizadas
  intervencoes: {
    tecnicasManuais: string[];
    exerciciosTerapeuticos: string[];
    recursosEletrotermofototerapeticos: string[];
  };
  
  // Resposta ao Tratamento
  respostaTratamento: {
    imediata: string;
    efeitos: string;
    feedback: string;
  };
  
  // Orientações ao Paciente
  orientacoes: {
    domiciliares: string[];
    ergonomicas: string[];
    precaucoes: string[];
  };
  
  // Plano de Tratamento
  planoTratamento: {
    frequencia: string;
    duracaoPrevista: string;
    objetivosCurtoPrazo: string[];
    objetivosLongoPrazo: string[];
    criteriosAlta: string[];
  };
  
  observacoesAdicionais: string;
  
  // Próxima Sessão
  proximaSessao: {
    data: string;
    foco: string;
  };
}
```

### 2. **Visualização Inline de Notas Completas**

**Antes:** Botão "Ver nota completa" abria modal com informações resumidas.

**Depois:** Clique no card da sessão expande/colapsa a nota completa inline com todas as seções estruturadas.

#### Seções Exibidas:

1. **Resumo Executivo** (ícone Activity, cor azul)
   - Queixa principal em destaque
   - Nível de dor (EVA) com badge visual
   - Evolução do paciente

2. **Anamnese** (ícone Clipboard, cor roxa)
   - Histórico atual
   - Antecedentes pessoais
   - Medicamentos em uso
   - Objetivos do paciente

3. **Diagnóstico Fisioterapêutico** (ícone Stethoscope, cor laranja)
   - Diagnóstico principal destacado
   - Diagnósticos secundários listados
   - Código CIF

4. **Intervenções Realizadas** (ícone Activity, cor azul)
   - Técnicas manuais (marcador azul)
   - Exercícios terapêuticos (marcador verde)
   - Recursos eletrotermofototerapêuticos (marcador roxo)

5. **Resposta ao Tratamento** (ícone TrendingUp, cor verde)
   - Resposta imediata destacada
   - Efeitos adversos
   - Feedback do paciente

6. **Orientações ao Paciente** (ícone Target, cor índigo)
   - Exercícios domiciliares (check verde)
   - Orientações ergonômicas (check azul)
   - Precauções em destaque amarelo

7. **Plano de Tratamento** (ícone Target, cor teal)
   - Frequência e duração
   - Objetivos de curto prazo (numerados)
   - Objetivos de longo prazo (numerados)
   - Critérios de alta

8. **Observações Adicionais** (background azul suave)

9. **Próxima Sessão** (gradient azul com borda)

### 3. **Exportação Individual de Notas**

#### Botão de Exportação

- **Localização:** No cabeçalho de cada card de sessão
- **Ícone:** Download (Lucide)
- **Cor:** Azul primário (#5A9BCF)
- **Comportamento:** 
  - Clique exporta apenas aquela nota específica
  - Não interfere com expansão/colapso do card
  - `stopPropagation()` previne trigger do toggle

#### Formato de Exportação

```typescript
const handleExportNote = (session: FullSessionNote) => {
  // TODO: Implementar exportação real de PDF
  const noteText = `
NOTA DE EVOLUÇÃO FISIOTERAPÊUTICA
Paciente: ${patient.name}
Data: ${formatDate(session.date)} às ${formatTime(session.date)}
Duração: ${session.duration} minutos

RESUMO EXECUTIVO
Queixa Principal: ${session.resumoExecutivo.queixaPrincipal}
Nível de Dor: ${session.resumoExecutivo.nivelDor}/10
Evolução: ${session.resumoExecutivo.evolucao}

DIAGNÓSTICO: ${session.diagnosticoFisioterapeutico.principal}
  `;
  // Gerar PDF ou texto estruturado
};
```

**Status:** Estrutura pronta, aguarda integração com biblioteca de PDF (jsPDF, pdfmake, etc.)

### 4. **Resumo com IA do Histórico Médico**

#### Botão "Resumir com IA"

- **Localização:** Ao lado do título "Histórico Médico"
- **Ícone:** Sparkles (Lucide) - representa IA
- **Cores:** Roxo (purple-50 background, purple-700 text)
- **Estados:**
  - Normal: "Resumir com IA"
  - Carregando: Spinner animado + "Resumindo..."
  - Disabled durante processamento

```typescript
const handleSummarizeHistory = () => {
  setSummarizingHistory(true);
  // Simular processamento de IA
  setTimeout(() => {
    setSummarizingHistory(false);
    alert('Resumo gerado com IA! (funcionalidade a ser implementada)');
  }, 2000);
};
```

**Status:** UI completa, aguarda integração com API de IA (OpenAI, GPT, etc.)

### 5. **Correção de Animações Hover**

#### Problema Anterior

Animações de `hover:scale-110` causavam overflow e elementos saindo dos containers.

#### Solução Implementada

**Remoção de hover scale problemático:**
- Cards de sessão usam apenas `hover:bg-gray-100` (mudança de cor)
- Transição suave com `transition-colors`
- Sem transformações de escala que causem overflow

**Animação preservada onde apropriado:**
- Botões pequenos (download, voltar) mantém `hover:scale-110` pois têm espaço
- Containers principais usam cores e opacidade no hover

### 6. **Novos Ícones Implementados**

Importação atualizada com ícones específicos para notas clínicas:

```typescript
import {
  ArrowLeft,      // Voltar
  User,           // Usuário (não usado atualmente)
  Calendar,       // Datas
  Phone,          // Telefone
  Mail,           // Email
  MapPin,         // Endereço
  FileText,       // Notas/Documentos
  Activity,       // Atividade/Resumo/Intervenções
  Clock,          // Horário
  ChevronDown,    // Expandir
  ChevronUp,      // Colapsar
  Download,       // Exportar
  Sparkles,       // IA
  Stethoscope,    // Diagnóstico
  Clipboard,      // Anamnese
  Target,         // Objetivos/Plano
  AlertCircle,    // Alertas/Queixa
  TrendingUp,     // Evolução/Resposta
  Check           // Confirmação/Critérios
} from 'lucide-react';
```

### 7. **Componente Helper: SectionHeader**

Componente reutilizável para títulos de seções:

```typescript
const SectionHeader = ({ 
  icon: Icon, 
  title, 
  color 
}: { 
  icon: any, 
  title: string, 
  color: string 
}) => (
  <div className="flex items-center space-x-2 mb-3">
    <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <h4 className="font-semibold text-[#333333]">{title}</h4>
  </div>
);
```

**Cores por Seção:**
- Resumo Executivo: `bg-[#5A9BCF]` (azul primário)
- Anamnese: `bg-purple-500` (roxo)
- Diagnóstico: `bg-orange-500` (laranja)
- Intervenções: `bg-[#5A9BCF]` (azul primário)
- Resposta: `bg-green-500` (verde)
- Orientações: `bg-indigo-500` (índigo)
- Plano: `bg-teal-500` (teal)

## 🎨 Design System

### Paleta de Cores

```css
/* Primárias */
--primary-blue: #5A9BCF
--primary-blue-dark: #4A8BBF

/* Status */
--success-green: #10b981 (green-500)
--warning-yellow: #f59e0b (yellow-500)
--danger-red: #ef4444 (red-500)
--info-purple: #8b5cf6 (purple-500)

/* Backgrounds */
--bg-primary: #FFFFFF (white)
--bg-secondary: #F7F7F7 (gray-50)
--bg-muted: #F3F4F6 (gray-100)

/* Text */
--text-primary: #333333
--text-secondary: #666666
--text-muted: #999999
```

### Espaçamento

```css
/* Gaps */
space-y-6: 1.5rem entre elementos verticais principais
space-y-4: 1rem entre cards de sessão
space-y-3: 0.75rem dentro de seções
space-x-2: 0.5rem entre ícone e texto

/* Padding */
p-6: 1.5rem padding em cards principais
p-4: 1rem padding em seções internas
p-3: 0.75rem padding em badges
```

### Tipografia

```css
/* Headings */
text-3xl: Títulos principais (h1)
text-2xl: Títulos de seções (h2)
text-sm: Labels e subtítulos
text-xs: Badges e metadata

/* Weights */
font-bold: 700 (títulos)
font-semibold: 600 (subtítulos, labels)
font-medium: 500 (destaque leve)
```

## 🔧 Estado da Aplicação

### Estado Gerenciado

```typescript
// Cards de notas expandidos/colapsados
const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

// Status de processamento do resumo IA
const [summarizingHistory, setSummarizingHistory] = useState(false);
```

### Funções Auxiliares

```typescript
// Formatação de datas
formatDate(dateString: string) // "20 de março de 2024"
formatTime(dateString: string) // "14:30"

// Cálculo de idade
calculateAge(birthDate: string) // 39

// Toggle de notas
toggleNote(noteId: string) // Adiciona/remove do Set

// Ações
handleSummarizeHistory() // Simula IA (2s delay)
handleExportNote(session) // Prepara exportação PDF
```

## 📊 Mock Data

### Estrutura de Paciente

```typescript
{
  id: string,
  name: string,
  email: string,
  phone: string,
  cpf: string,
  birthDate: string,
  gender: string,
  address: {
    street, number, complement,
    neighborhood, city, state, zipCode
  },
  medicalHistory: string,
  createdAt: string,
  totalSessions: number,
  sessions: FullSessionNote[]
}
```

### Dados de Exemplo

**2 sessões completas** com:
- Sessão 1 (2024-03-20): Lombalgia crônica, 7/10 dor, evolução 30%
- Sessão 2 (2024-03-18): Dor persistente, 6/10 dor, melhora do sono 20%

## 🚀 Próximos Passos (Backend Integration)

### 1. Exportação de PDF

**Biblioteca sugerida:** jsPDF ou pdfmake

```typescript
// Exemplo com jsPDF
import jsPDF from 'jspdf';

const handleExportNote = (session: FullSessionNote) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(16);
  doc.text('NOTA DE EVOLUÇÃO FISIOTERAPÊUTICA', 20, 20);
  
  // Content sections...
  doc.setFontSize(12);
  doc.text(`Paciente: ${patient.name}`, 20, 35);
  doc.text(`Data: ${formatDate(session.date)}`, 20, 45);
  
  // Save
  doc.save(`nota-${patient.name}-${session.date}.pdf`);
};
```

### 2. Integração com IA

**API sugerida:** OpenAI GPT-4 ou Azure Cognitive Services

```typescript
const handleSummarizeHistory = async () => {
  setSummarizingHistory(true);
  
  try {
    const response = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        medicalHistory: patient.medicalHistory,
        sessions: patient.sessions
      })
    });
    
    const { summary } = await response.json();
    
    // Exibir resumo em modal ou área expandida
    setAISummary(summary);
    
  } catch (error) {
    console.error('Erro ao gerar resumo:', error);
  } finally {
    setSummarizingHistory(false);
  }
};
```

### 3. Persistência de Estado

**Salvar notas expandidas no localStorage:**

```typescript
useEffect(() => {
  const saved = localStorage.getItem(`expanded-notes-${patientId}`);
  if (saved) {
    setExpandedNotes(new Set(JSON.parse(saved)));
  }
}, [patientId]);

useEffect(() => {
  localStorage.setItem(
    `expanded-notes-${patientId}`,
    JSON.stringify(Array.from(expandedNotes))
  );
}, [expandedNotes, patientId]);
```

### 4. Lazy Loading de Sessões

**Carregar sessões sob demanda:**

```typescript
const [visibleSessions, setVisibleSessions] = useState(10);
const [loading, setLoading] = useState(false);

const loadMoreSessions = async () => {
  setLoading(true);
  // Fetch próximas 10 sessões
  const moreSessions = await fetchSessions(patientId, visibleSessions, 10);
  setSessions([...sessions, ...moreSessions]);
  setVisibleSessions(v => v + 10);
  setLoading(false);
};
```

## 📝 Checklist de Implementação

- [x] Interface `FullSessionNote` com estrutura completa
- [x] Mock data com 2 sessões de exemplo detalhadas
- [x] Visualização inline de notas (substituição de modal)
- [x] Botão de exportação por nota individual
- [x] UI do botão "Resumir com IA"
- [x] Correção de animações hover (remoção de scale problemático)
- [x] Novos ícones para seções clínicas
- [x] Componente `SectionHeader` reutilizável
- [x] Design system com cores por tipo de seção
- [ ] Integração real de exportação PDF
- [ ] Integração real com API de IA
- [ ] Persistência de notas expandidas
- [ ] Lazy loading de sessões antigas
- [ ] Testes unitários
- [ ] Testes de integração

## 🎯 Benefícios da V2

1. **Documentação Completa:** Todas as seções SOAP visíveis sem cliques extras
2. **Melhor UX:** Inline expansion é mais intuitivo que modals
3. **Produtividade:** Exportação rápida de notas individuais
4. **IA Integrada:** Resumos inteligentes do histórico médico
5. **Performance:** Animações otimizadas sem overflow
6. **Escalabilidade:** Estrutura pronta para lazy loading
7. **Acessibilidade:** Hierarquia visual clara com ícones e cores

## 📄 Arquivos Modificados

```
src/components/patients/PatientRecord.tsx (reescrito completamente)
```

## 🔗 Relacionado

- [PATIENT_RECORD_FEATURE.md](./PATIENT_RECORD_FEATURE.md) - Documentação V1
- [DASHBOARD_DOCUMENTATION.md](./DASHBOARD_DOCUMENTATION.md) - Dashboard context
- [SESSION_ANIMATIONS.md](./SESSION_ANIMATIONS.md) - Animation patterns
