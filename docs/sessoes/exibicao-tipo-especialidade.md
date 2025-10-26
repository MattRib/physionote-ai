# Exibição de Tipo de Sessão e Especialidade no Histórico

## 📋 Visão Geral

Implementação de exibição visual do **Tipo de Sessão** e **Especialidade** no histórico de sessões do paciente, melhorando a documentação e rastreabilidade do tratamento.

## 🎯 Motivação

### Problema Anterior
O histórico de sessões mostrava apenas:
- ✅ Data e hora
- ✅ Duração
- ❌ **Tipo de sessão** (Avaliação inicial, Retorno, etc.) - NÃO EXIBIDO
- ❌ **Especialidade** (Fisioterapia, Ortopedia, etc.) - NÃO EXIBIDO

**Impacto**: Dificuldade em identificar rapidamente o tipo de consulta e área de especialização de cada sessão no histórico.

### Solução Implementada
Agora o histórico exibe visualmente:
- ✅ **Tipo de Sessão**: Badge roxo com ícone de documento
- ✅ **Especialidade**: Badge verde-água com ícone de estetoscópio
- ✅ Exibição em **cards de sessão** na interface
- ✅ Inclusão em **exportação de PDF individual**
- ✅ Inclusão em **exportação de prontuário completo**

## 🎨 Design da Interface

### Cards de Sessão no Histórico

```tsx
// Visual dos badges
┌─────────────────────────────────────────────────────────────┐
│ 📄 Sessão - 15/10/2025                    🏷️ Mais Recente │
│ ⏰ 14:30 • 60 minutos                                       │
│                                                             │
│ 📝 Avaliação inicial    🩺 Fisioterapia Ortopédica         │
│ └─ Badge Roxo           └─ Badge Verde-Água                 │
└─────────────────────────────────────────────────────────────┘
```

### Especificações de Estilo

#### Badge: Tipo de Sessão
```tsx
<span className="inline-flex items-center rounded-full 
  bg-[#EEF2FF] px-2.5 py-0.5 text-xs font-medium 
  text-[#4F46E5] border border-[#C7D2FE]">
  <FileText className="w-3 h-3 mr-1" />
  {session.sessionType}
</span>
```

**Cores:**
- Background: `#EEF2FF` (Índigo 50)
- Texto: `#4F46E5` (Índigo 600)
- Borda: `#C7D2FE` (Índigo 200)
- Ícone: `FileText` (Lucide React)

#### Badge: Especialidade
```tsx
<span className="inline-flex items-center rounded-full 
  bg-[#F0FDFA] px-2.5 py-0.5 text-xs font-medium 
  text-[#0F766E] border border-[#99F6E4]">
  <Stethoscope className="w-3 h-3 mr-1" />
  {session.specialty}
</span>
```

**Cores:**
- Background: `#F0FDFA` (Teal 50)
- Texto: `#0F766E` (Teal 700)
- Borda: `#99F6E4` (Teal 200)
- Ícone: `Stethoscope` (Lucide React)

### Layout Responsivo

Os badges são exibidos em uma linha flexível que se adapta:
- Desktop: Badges lado a lado
- Mobile: Badges quebram para nova linha se necessário

```tsx
<div className="mt-2 flex items-center gap-2 flex-wrap">
  {/* Badges aqui */}
</div>
```

## 📄 Exportação em PDF

### PDF Individual (Nota da Sessão)

No cabeçalho da nota, as informações agora incluem:

```
NOTA DE EVOLUÇÃO FISIOTERAPÊUTICA
Paciente: João Silva
Data: 15/10/2025 às 14:30
Duração: 60 minutos
Tipo de Sessão: Avaliação inicial        ← NOVO
Especialidade: Fisioterapia Ortopédica   ← NOVO

RESUMO EXECUTIVO
...
```

**Implementação:**
```typescript
return `NOTA DE EVOLUÇÃO FISIOTERAPÊUTICA\n` +
  `Paciente: ${patient.name}\n` +
  `Data: ${formatDate(session.date)} às ${formatTime(session.date)}\n` +
  `Duração: ${session.durationMin || 'N/A'} minutos\n` +
  (session.sessionType ? `Tipo de Sessão: ${session.sessionType}\n` : '') +
  (session.specialty ? `Especialidade: ${session.specialty}\n` : '') +
  `\n` +
  `RESUMO EXECUTIVO\n` +
  // ... resto do conteúdo
```

### PDF Completo (Prontuário)

No histórico completo, cada sessão exibe:

```
Sessão 1 — 15/10/2025 14:30
Tipo: Avaliação inicial | Especialidade: Fisioterapia Ortopédica  ← NOVO

NOTA DE EVOLUÇÃO FISIOTERAPÊUTICA
...
```

**Implementação:**
```typescript
sessions.forEach((s: SessionWithNote, idx: number) => {
  doc.setFont('helvetica', 'bold');
  doc.text(`\nSessão ${idx + 1} — ${formatDate(s.date)} ${formatTime(s.date)}`, margin, cursorY);
  cursorY += 10;
  
  // Adicionar tipo de sessão e especialidade se existirem
  if (s.sessionType || s.specialty) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    const sessionInfo = [];
    if (s.sessionType) sessionInfo.push(`Tipo: ${s.sessionType}`);
    if (s.specialty) sessionInfo.push(`Especialidade: ${s.specialty}`);
    doc.text(sessionInfo.join(' | '), margin, cursorY);
    cursorY += 6;
    doc.setFontSize(10);
  }
  
  doc.setFont('helvetica', 'normal');
  addBlock(buildSessionText(s));
  // ...
});
```

## 🔍 Detalhes Técnicos

### Dados de Origem

Os dados vêm do schema da sessão no banco de dados:

```typescript
interface SessionWithNote {
  id: string;
  date: string;
  durationMin: number | null;
  sessionType: string | null;      // ← Campo usado
  specialty: string | null;         // ← Campo usado
  motivation: string | null;
  status: string;
  transcription: string | null;
  note: SessionNote | null;
  createdAt: string;
  updatedAt: string;
}
```

### Renderização Condicional

Os badges só são exibidos quando os dados existem:

```typescript
{(session.sessionType || session.specialty) && (
  <div className="mt-2 flex items-center gap-2 flex-wrap">
    {session.sessionType && (
      <span className="...">
        <FileText className="w-3 h-3 mr-1" />
        {session.sessionType}
      </span>
    )}
    {session.specialty && (
      <span className="...">
        <Stethoscope className="w-3 h-3 mr-1" />
        {session.specialty}
      </span>
    )}
  </div>
)}
```

**Comportamentos:**
- Se ambos existem: Ambos badges são exibidos
- Se só um existe: Apenas um badge é exibido
- Se nenhum existe: Div inteira não é renderizada

### Ícones Utilizados

```typescript
import {
  FileText,      // Para Tipo de Sessão
  Stethoscope,   // Para Especialidade
  Clock,         // Para Hora (já existente)
  // ...
} from 'lucide-react';
```

## 📊 Exemplos Visuais

### Exemplo 1: Avaliação Inicial

```
┌─────────────────────────────────────────┐
│ 📄 15/10/2025           🏷️ Mais Recente │
│ ⏰ 14:30 • 60 minutos                   │
│                                         │
│ 📝 Avaliação inicial    🩺 Fisioterapia │
└─────────────────────────────────────────┘
```

### Exemplo 2: Retorno

```
┌─────────────────────────────────────────┐
│ 📄 22/10/2025                           │
│ ⏰ 15:00 • 45 minutos                   │
│                                         │
│ 📝 Retorno    🩺 Fisioterapia Esportiva │
└─────────────────────────────────────────┘
```

### Exemplo 3: Sessão sem Tipo/Especialidade (Retrocompatibilidade)

```
┌─────────────────────────────────────────┐
│ 📄 10/09/2025                           │
│ ⏰ 10:00 • 50 minutos                   │
│                                         │
│ (Sem badges - sessão antiga)            │
└─────────────────────────────────────────┘
```

## 🎯 Casos de Uso

### 1. Identificar Tipo de Consulta Rapidamente
**Antes**: Precisava abrir nota completa
**Depois**: Vê "Avaliação inicial" ou "Retorno" diretamente no card

### 2. Filtrar por Especialidade Visualmente
**Antes**: Sem indicação visual
**Depois**: Badge colorido diferencia especialidades

### 3. Exportar Documentação Completa
**Antes**: PDF não incluía tipo/especialidade
**Depois**: Informações completas em cabeçalho e histórico

### 4. Rastreabilidade do Tratamento
**Antes**: Difícil ver progressão de tipos de sessão
**Depois**: Histórico mostra claramente sequência (Avaliação → Retornos)

## 🔧 Modificações no Código

### Arquivo Modificado
- `src/components/patients/PatientRecord.tsx`

### Alterações Realizadas

1. **Badge de Tipo de Sessão e Especialidade** (Linhas ~927-942):
   - Adicionado container condicional
   - Badge roxo para sessionType
   - Badge verde-água para specialty

2. **Export PDF Individual** (Linhas ~405-407):
   - Adicionadas linhas condicionais para tipo e especialidade
   - Formatação: `Tipo de Sessão: ...` e `Especialidade: ...`

3. **Export PDF Completo** (Linhas ~536-548):
   - Adicionado bloco condicional após título da sessão
   - Formatação em itálico, tamanho 9pt
   - Separação por " | "

## 📈 Benefícios

### Para Fisioterapeutas
- ✅ **Identificação Rápida**: Vê tipo de sessão sem abrir nota
- ✅ **Documentação Completa**: PDFs incluem informações contextuais
- ✅ **Organização Visual**: Badges coloridos facilitam scanning
- ✅ **Rastreabilidade**: Histórico mostra progressão clara do tratamento

### Para Pacientes
- ✅ **Transparência**: Sabe que tipo de consulta teve
- ✅ **Compreensão**: Especialidade indica área de foco

### Para Clínicas
- ✅ **Conformidade**: Documentação mais completa
- ✅ **Auditoria**: Fácil verificar tipos de sessões realizadas
- ✅ **Estatísticas**: Dados visuais facilitam análises

## 🧪 Testes Sugeridos

### Teste 1: Exibição de Badges
- [ ] Criar sessão com tipo "Avaliação inicial" e especialidade "Fisioterapia"
- [ ] Verificar exibição de ambos badges no card
- [ ] Verificar cores corretas (roxo e verde-água)

### Teste 2: Renderização Condicional
- [ ] Sessão só com tipo (sem especialidade) → Apenas badge roxo
- [ ] Sessão só com especialidade (sem tipo) → Apenas badge verde
- [ ] Sessão sem nenhum → Nenhum badge

### Teste 3: Export PDF Individual
- [ ] Exportar nota de sessão com tipo e especialidade
- [ ] Verificar presença das linhas no cabeçalho
- [ ] Validar formatação correta

### Teste 4: Export PDF Completo
- [ ] Exportar prontuário com múltiplas sessões
- [ ] Verificar linha de tipo/especialidade em cada sessão
- [ ] Validar separação por " | "

### Teste 5: Responsividade
- [ ] Desktop: Badges na mesma linha
- [ ] Mobile: Badges quebram linha se necessário
- [ ] Verificar alinhamento e espaçamento

## 🚀 Próximas Melhorias

### Funcionalidades Futuras

1. **Filtro por Tipo de Sessão**
   - Dropdown para filtrar histórico
   - Exemplo: "Mostrar apenas Avaliações Iniciais"

2. **Filtro por Especialidade**
   - Múltiplas especialidades selecionáveis
   - Útil para clínicas multidisciplinares

3. **Estatísticas Visuais**
   - Gráfico de pizza: Distribuição de tipos de sessão
   - Gráfico de barras: Sessões por especialidade

4. **Badges Customizáveis**
   - Permitir clínica definir cores por tipo
   - Ícones personalizados por especialidade

5. **Busca Textual**
   - Buscar por tipo: "Avaliação"
   - Buscar por especialidade: "Ortopédica"

6. **Export Filtrado**
   - Exportar apenas sessões de um tipo
   - Relatório por especialidade

## 📝 Changelog

### v1.0.0 (2025-10-15)
- ✅ Adicionados badges visuais para tipo de sessão e especialidade
- ✅ Badge roxo (índigo) para tipo de sessão com ícone FileText
- ✅ Badge verde-água (teal) para especialidade com ícone Stethoscope
- ✅ Renderização condicional (só exibe se dados existem)
- ✅ Layout responsivo com flex-wrap
- ✅ Inclusão em export de PDF individual (cabeçalho)
- ✅ Inclusão em export de PDF completo (linha adicional por sessão)
- ✅ Formatação em itálico e tamanho reduzido no PDF
- ✅ Retrocompatibilidade com sessões antigas (sem tipo/especialidade)

---

**Sistema PhysioNote.AI** | Documentação Inteligente e Contextualizada
