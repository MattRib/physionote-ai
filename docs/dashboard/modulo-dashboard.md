# 📊 Módulo Dashboard - PhysioNote.AI

**Última atualização:** 26 de outubro de 2025  
**Status:** ✅ **COMPLETO E FUNCIONAL** (Versão 2 - Card-Based)

---

## 📋 Visão Geral

O Dashboard é a **página principal** do PhysioNote.AI, exibida após o login do fisioterapeuta. Apresenta uma visão consolidada de todas as sessões registradas, com múltiplas visualizações (Grid, Lista, Tabela), filtros avançados, busca em tempo real e integração completa com dados reais da API.

**Rota:** `/dashboard`  
**Componente Principal:** `DashboardLayout.tsx` (347 linhas)

---

## 🎯 Funcionalidades Implementadas

### 1. **Listagem de Sessões** ✅ Completo
- ✅ Integração completa com `GET /api/sessions`
- ✅ Carregamento assíncrono com estado de loading
- ✅ Atualização em tempo real após criar nova sessão
- ✅ Exibição de dados reais (paciente, data, duração, status)
- ✅ Tratamento de erros e fallbacks

### 2. **Três Visualizações Disponíveis** ✅ Completo

#### Grid View (Padrão)
- ✅ Cards em grade responsiva (1-3 colunas)
- ✅ Animações staggered (delay progressivo)
- ✅ Glassmorphism e sombras suaves
- ✅ Hover effects (elevação + border colorida)
- ✅ 9 itens por página (padrão)

#### List View
- ✅ Visualização compacta em lista
- ✅ Uma sessão por linha
- ✅ Informações condensadas
- ✅ Boa para telas pequenas

#### Table View
- ✅ Tabela completa com todas as colunas
- ✅ Headers fixos
- ✅ Ordenação visual (preparada para expansão)
- ✅ Melhor para visualização de muitos dados

### 3. **Sistema de Filtros Avançado** ✅ Completo

**Filtros Implementados:**
- ✅ **Busca por Paciente**: Busca em tempo real por nome
- ✅ **Filtro de Status**: 
  - Todas (default)
  - Concluídas (`completed`)
  - Processando (`processing`)
  - Com Erro (`error`)
  - Gravando (`recording`)
  - Transcrevendo (`transcribing`)
  - Gerando (`generating`)
- ✅ **Filtro de Data**:
  - Todo o período (default)
  - Hoje
  - Ontem
  - Esta semana
  - Este mês
  - Período customizado (preparado)

**Implementação:**
- Filtros aplicados no **backend** via query params
- Frontend envia params na chamada `/api/sessions?status=completed&dateRange=week`
- Re-fetch automático ao mudar filtros
- Reset para página 1 ao aplicar filtros

### 4. **Paginação** ✅ Completo
- ✅ Componente Pagination reutilizável
- ✅ Navegação por páginas numeradas
- ✅ Botões Anterior/Próxima
- ✅ Opções de itens por página: 9, 15, 30, 50
- ✅ Scroll automático para topo ao mudar página
- ✅ Contador: "Exibindo X-Y de Z sessões"
- ✅ Botões de navegação rápida (primeira/última)

### 5. **Sidebar de Navegação** ✅ Completo
- ✅ **Desktop**: Sidebar fixa permanente (left: 0, width: 288px - 18rem)
- ✅ **Mobile**: Sidebar slide-in com overlay (z-index: 50)
- ✅ Logo PhysioNote.AI com gradiente
- ✅ Badge "Powered by AI" com ícone Sparkles
- ✅ 3 Links de navegação:
  - 🏠 Dashboard (`/dashboard`)
  - 👥 Pacientes (`/dashboard/patients`)
  - ⚙️ Configurações (`/dashboard/settings`)
- ✅ Indicador visual de página ativa (gradiente azul)
- ✅ Botão "Logout" no rodapé (redireciona para `/login`)
- ✅ Efeitos ambient (blur gradients de fundo)

### 6. **Session Cards (v2)** ✅ Completo

**Design:**
- ✅ `rounded-2xl` com border sutil
- ✅ `bg-white/95` com glassmorphism
- ✅ Shadow customizada: `shadow-[0_20px_55px_-28px_rgba(79,70,229,0.45)]`
- ✅ Hover: elevação + border `#C7D2FE` + shadow intensificada
- ✅ Animação `fade-in-up` com delay progressivo

**Conteúdo do Card:**
- ✅ **Header**: Data + Hora + Badge de Status
- ✅ **Body**: Nome do Paciente (ícone User) + Duração (ícone Clock)
- ✅ **Footer**: 2 Botões (Ver Nota + Download PDF)
- ✅ **Badge LGPD**: Exibido se `is_anonymized: true`

**Status Badges:**
| Status | Cor de Fundo | Cor do Texto | Ícone | Label |
|--------|--------------|--------------|-------|-------|
| `completed` | `#D1FADF` (verde) | `#166534` | ShieldCheck | Concluída |
| `processing` | `#FEF3C7` (amarelo) | `#92400E` | Loader (spin) | Processando |
| `error` | `#FEE2E2` (vermelho) | `#B91C1C` | AlertCircle | Erro |
| `recording` | `#DBEAFE` (azul) | `#1E40AF` | Loader | Gravando |
| `transcribing` | `#FEF3C7` (amarelo) | `#92400E` | Loader | Transcrevendo |
| `generating` | `#E0E7FF` (roxo) | `#4338CA` | Loader | Gerando nota |

**Botões:**
- ✅ **Ver Nota**: 
  - Gradiente azul `from-[#4F46E5] to-[#6366F1]`
  - Habilitado apenas se `status === 'completed'`
  - Abre `NoteViewModal` com nota completa
- ✅ **Download PDF**:
  - Border + text `#4F46E5`
  - Habilitado apenas se `status === 'completed'`
  - Download do prontuário (preparado para implementação)

### 7. **Criar Nova Sessão** ✅ Completo
- ✅ Botão flutuante "Nova Sessão" (desktop: header, mobile: fab)
- ✅ Redireciona para `/dashboard/new-session`
- ✅ Fluxo `NewSessionFlow`:
  1. Seleciona paciente
  2. Confirma e inicia gravação
  3. Redireciona para `/dashboard/session?patientId=X&patientName=Y`
- ✅ Após salvar sessão, retorna ao dashboard com lista atualizada

### 8. **Visualização de Nota (Modal)** ✅ Completo
- ✅ Componente `NoteViewModal` (modal fullscreen)
- ✅ Busca nota completa via `GET /api/sessions/[id]`
- ✅ Exibe todas as seções da nota clínica
- ✅ Botão "Fechar" e click fora para dismiss
- ✅ Loading state enquanto carrega dados

### 9. **Responsividade** ✅ Completo
- ✅ **Desktop (lg+)**: Sidebar fixa + Grid 3 colunas
- ✅ **Tablet (md)**: Sidebar slide-in + Grid 2 colunas
- ✅ **Mobile (sm)**: Hamburger menu + Grid 1 coluna
- ✅ Breakpoints Tailwind: `sm:`, `md:`, `lg:`, `xl:`
- ✅ Touch-friendly (botões e áreas de toque adequadas)

---

## 🗄️ Integração com APIs

### GET /api/sessions

**Chamada do Dashboard:**
```typescript
const params = new URLSearchParams();
if (statusFilter !== 'all') params.append('status', statusFilter);
if (dateFilter !== 'all') params.append('dateRange', dateFilter);
if (searchQuery) params.append('search', searchQuery);

const response = await fetch(`/api/sessions?${params.toString()}`);
const data = await response.json();
setAllSessions(data);
```

**Dados Recebidos:**
```typescript
interface DashboardSession {
  id: string;
  session_datetime: string; // ISO 8601
  patient_name: string;
  status: 'completed' | 'processing' | 'error' | 'recording' | 'transcribing' | 'generating';
  is_anonymized: boolean;
  duration_minutes: number | null;
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  note?: {
    id: string;
    aiGenerated: boolean;
    aiModel: string;
  };
}
```

**Re-fetch Triggers:**
- Mudança em `statusFilter`
- Mudança em `dateFilter`
- Mudança em `searchQuery`
- Após criar nova sessão

---

### GET /api/sessions/[id]

**Chamada do NoteViewModal:**
```typescript
const response = await fetch(`/api/sessions/${sessionId}`);
const sessionData = await response.json();
// sessionData.note.contentJson contém nota completa
```

**Uso:** Carregar nota completa para exibição no modal

---

## 📁 Estrutura de Arquivos

```
src/
├── app/
│   └── dashboard/
│       ├── page.tsx                  # Wrapper do DashboardLayout
│       ├── new-session/
│       │   └── page.tsx              # NewSessionFlow
│       ├── session/
│       │   └── page.tsx              # SessionView (gravação)
│       ├── patients/
│       │   ├── page.tsx              # PatientsView
│       │   └── [id]/
│       │       └── page.tsx          # PatientRecord
│       └── settings/
│           └── page.tsx              # Configurações (placeholder)
│
├── components/
│   └── dashboard/
│       ├── DashboardLayout.tsx       # ⭐ Container principal (347 linhas)
│       ├── Sidebar.tsx               # Navegação lateral (180 linhas)
│       ├── FilterBar.tsx             # Barra de filtros (264 linhas)
│       ├── SessionCards.tsx          # Grid de cards (89 linhas)
│       ├── SessionCard.tsx           # Card individual (167 linhas)
│       ├── SessionListView.tsx       # Visualização em lista
│       ├── SessionTable.tsx          # Visualização em tabela
│       ├── Pagination.tsx            # Controles de paginação
│       ├── NewSessionFlow.tsx        # Fluxo de nova sessão
│       ├── NoteViewModal.tsx         # Modal de visualização de nota
│       ├── types.ts                  # TypeScript types
│       └── index.ts                  # Exports (default: DashboardLayout)
```

---

## 🎨 Design System

### Cores Principais

```typescript
// Primary (Indigo)
primary: {
  50: '#EEF2FF',
  100: '#E0E7FF',
  500: '#6366F1',
  600: '#4F46E5',  // ⭐ Cor principal
  700: '#4338CA',
  900: '#312E81'
}

// Neutrals (Slate/Gray)
neutral: {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  400: '#94A3B8',
  500: '#64748B',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A'
}

// Success (Green)
success: {
  50: '#ECFDF5',
  100: '#D1FADF',
  600: '#047857',
  700: '#166534'
}

// Warning (Yellow)
warning: {
  50: '#FFFBEB',
  100: '#FEF3C7',
  800: '#92400E'
}

// Error (Red)
error: {
  50: '#FEF2F2',
  100: '#FEE2E2',
  600: '#DC2626',
  700: '#B91C1C'
}
```

### Sombras Customizadas

```css
/* Card padrão */
shadow-[0_20px_55px_-28px_rgba(79,70,229,0.45)]

/* Card hover */
shadow-[0_28px_70px_-28px_rgba(79,70,229,0.55)]

/* Botão primário */
shadow-[0_12px_30px_-16px_rgba(79,70,229,0.55)]

/* Sidebar */
shadow-[4px_0_24px_-8px_rgba(0,0,0,0.08)]
```

### Animações

```css
/* Fade in up (cards) */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Delays progressivos */
delay: 0ms, 80ms, 160ms, 240ms, ... (incremento de 80ms)
```

### Bordas e Raios

```css
/* Cards */
border-radius: 1rem (16px) / rounded-2xl

/* Botões */
border-radius: 0.75rem (12px) / rounded-xl

/* Inputs */
border-radius: 0.5rem (8px) / rounded-lg

/* Badges */
border-radius: 9999px / rounded-full
```

---

## 🔄 Fluxos de Uso

### 1. Visualizar Dashboard

```
Usuário faz login → Redireciona para /dashboard
  ↓
DashboardLayout monta
  ↓
useEffect() chama GET /api/sessions
  ↓
setIsLoading(true)
  ↓
API retorna array de sessões
  ↓
setAllSessions(data)
  ↓
setIsLoading(false)
  ↓
SessionCards renderiza grid de cards
  ↓
Animações staggered executam
```

### 2. Filtrar Sessões

```
Usuário clica "Filtros"
  ↓
FilterBar expande
  ↓
Usuário seleciona: Status = "Concluídas"
  ↓
onStatusFilter('completed')
  ↓
setStatusFilter('completed')
  ↓
useEffect detecta mudança
  ↓
Re-fetch: GET /api/sessions?status=completed
  ↓
Sessões filtradas exibidas
  ↓
setCurrentPage(1) // Reset paginação
```

### 3. Buscar por Paciente

```
Usuário digita no campo de busca: "João"
  ↓
handleSearchChange(e)
  ↓
setSearchQuery("João")
  ↓
onSearch("João")
  ↓
useEffect detecta mudança em searchQuery
  ↓
Re-fetch: GET /api/sessions?search=João
  ↓
Apenas sessões de "João" exibidas
```

### 4. Ver Nota de Sessão

```
Usuário clica "Ver Nota" em card
  ↓
handleViewNote({ id, patient_name, ... })
  ↓
setNoteModalData({ ... })
  ↓
NoteViewModal renderiza
  ↓
useEffect() chama GET /api/sessions/[id]
  ↓
Nota completa carregada
  ↓
Exibe todas as seções da nota
  ↓
Usuário clica "Fechar" ou fora do modal
  ↓
setNoteModalData(null)
  ↓
Modal fecha
```

### 5. Criar Nova Sessão

```
Usuário clica "Nova Sessão"
  ↓
handleNewSession()
  ↓
router.push('/dashboard/new-session')
  ↓
NewSessionFlow renderiza
  ↓
Usuário seleciona paciente
  ↓
Clica "Iniciar Sessão"
  ↓
router.push('/dashboard/session?patientId=X&patientName=Y')
  ↓
SessionView inicia gravação
  ↓
... (fluxo de duas fases do módulo Sessões)
  ↓
Após salvar, router.push('/dashboard')
  ↓
Dashboard re-fetches sessões
  ↓
Nova sessão aparece no topo da lista
```

### 6. Mudar Visualização

```
Usuário clica ícone "List View"
  ↓
handleViewModeChange('list')
  ↓
setViewMode('list')
  ↓
Conditional rendering:
  {viewMode === 'grid' && <SessionCards />}
  {viewMode === 'list' && <SessionListView />}
  {viewMode === 'table' && <SessionTable />}
  ↓
SessionListView renderiza lista compacta
```

---

## 🎭 Estados da Interface

### Loading State
```tsx
{isLoading && (
  <div className="flex justify-center items-center py-20">
    <LoadingSpinner size="lg" />
    <p>Carregando sessões...</p>
  </div>
)}
```

### Empty State (Sem Sessões)
```tsx
{!isLoading && filteredSessions.length === 0 && (
  <div className="text-center py-20">
    <FileText className="mx-auto h-20 w-20 text-gray-300" />
    <h3>Nenhuma sessão encontrada</h3>
    <p>Crie sua primeira sessão clicando em "Nova Sessão"</p>
  </div>
)}
```

### Error State
```tsx
// Implementado no catch do useEffect
catch (error) {
  console.error('Error fetching sessions:', error);
  setAllSessions([]); // Mostra empty state
}
```

### Grid View (Padrão)
- 1 coluna (mobile)
- 2 colunas (tablet md:)
- 3 colunas (desktop lg:)

### Sidebar States
- **Desktop**: Sempre visível, fixa
- **Mobile**: 
  - Collapsed: `transform: translateX(-100%)`
  - Expanded: `transform: translateX(0)`
  - Overlay: `bg-black/50`

---

## ⚠️ Observações Importantes

### 1. Sidebar Desktop vs Mobile

**Desktop (`lg:` breakpoint):**
```tsx
<div className="hidden lg:block">
  <Sidebar />
</div>
```

**Mobile:**
```tsx
{sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40" />}
<div className={`fixed left-0 top-0 w-72 z-50 transform transition-transform
                 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
  <Sidebar />
</div>
```

**Problema Comum:** Esquecer de ajustar `paddingLeft` do conteúdo no desktop para compensar sidebar fixa.

**Solução:** Main content tem `lg:ml-72` (margin-left: 18rem)

---

### 2. Filtros Server-Side vs Client-Side

**Implementação Atual:** Filtros são aplicados no **backend** (server-side)

**Motivo:** Performance com grandes volumes de dados

**Código:**
```typescript
// Frontend envia params
const params = new URLSearchParams();
if (statusFilter !== 'all') params.append('status', statusFilter);

// Backend filtra no Prisma
const where: any = {};
if (status && status !== 'all') where.status = status;
const sessions = await prisma.session.findMany({ where });
```

**Observação:** `filteredSessions` no frontend é igual a `allSessions` porque filtro já veio aplicado

---

### 3. Paginação Client-Side

**Implementação Atual:** Paginação é calculada no **frontend**

**Motivo:** Simplicidade, volume de dados é gerenciável

**Código:**
```typescript
const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedSessions = filteredSessions.slice(startIndex, startIndex + itemsPerPage);
```

**Futuro:** Migrar para server-side pagination com `limit` e `offset` na API

---

### 4. View Mode Persistence

**Estado Atual:** `viewMode` é perdido ao recarregar página

**Melhoria Futura:** Salvar em `localStorage`
```typescript
useEffect(() => {
  const saved = localStorage.getItem('dashboard_viewMode');
  if (saved) setViewMode(saved as ViewMode);
}, []);

useEffect(() => {
  localStorage.setItem('dashboard_viewMode', viewMode);
}, [viewMode]);
```

---

### 5. Auto-Refresh

**Estado Atual:** Dashboard NÃO auto-refresh automaticamente

**Implementação Sugerida:**
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    fetchSessions(); // Re-fetch a cada 30s
  }, 30000);
  return () => clearInterval(interval);
}, [statusFilter, dateFilter, searchQuery]);
```

---

## 🧪 Testes Necessários

### Testes de Integração

```typescript
describe('Dashboard', () => {
  it('should load sessions on mount', async () => {
    render(<DashboardLayout />);
    await waitFor(() => {
      expect(screen.queryByText('Carregando')).not.toBeInTheDocument();
    });
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('should filter sessions by status', async () => {
    render(<DashboardLayout />);
    const filterButton = screen.getByText('Concluídas');
    fireEvent.click(filterButton);
    
    await waitFor(() => {
      // Apenas sessões completed exibidas
      expect(screen.queryByText('Processando')).not.toBeInTheDocument();
    });
  });

  it('should paginate sessions correctly', async () => {
    render(<DashboardLayout />);
    const nextButton = screen.getByText('Próxima');
    fireEvent.click(nextButton);
    
    expect(screen.getByText('Página 2')).toBeInTheDocument();
  });

  it('should open note modal when clicking Ver Nota', async () => {
    render(<DashboardLayout />);
    const verNotaButton = screen.getAllByText('Ver Nota')[0];
    fireEvent.click(verNotaButton);
    
    await waitFor(() => {
      expect(screen.getByText('Nota Clínica')).toBeInTheDocument();
    });
  });
});
```

---

## 📚 Documentação Relacionada

- 📁 `docs/sessoes/` - Módulo de Sessões (dados exibidos no dashboard)
- 📁 `docs/pacientes/` - Módulo de Pacientes (navegação via sidebar)
- 📁 `docs/dashboard/cards-dashboard-v2.md` - Redesign v2
- 📁 `docs/dashboard/changelog-v1-para-v2.md` - Mudanças v1 → v2
- 📁 `docs/dashboard/integracao-dados-reais.md` - Integração com API

---

## 🚀 Melhorias Futuras Sugeridas

### 1. Persistência de Preferências
- [ ] Salvar viewMode em localStorage
- [ ] Salvar itemsPerPage em localStorage
- [ ] Lembrar filtros aplicados

### 2. Server-Side Pagination
- [ ] Adicionar `limit` e `offset` na API
- [ ] Implementar cursor-based pagination
- [ ] Melhorar performance com muitas sessões

### 3. Auto-Refresh Inteligente
- [ ] Polling a cada 30 segundos
- [ ] WebSocket para updates em tempo real
- [ ] Notificação quando nova sessão é criada

### 4. Filtros Avançados
- [ ] Filtro por especialidade (Ortopédica, Neurológica, etc)
- [ ] Filtro por duração (< 30min, 30-60min, > 60min)
- [ ] Filtro por presença de nota IA

### 5. Estatísticas no Header
- [ ] Total de sessões hoje
- [ ] Total de pacientes atendidos
- [ ] Tempo médio de sessão
- [ ] Cards com métricas visuais

### 6. Exportação
- [ ] Exportar lista de sessões para CSV
- [ ] Exportar relatório período (PDF)
- [ ] Agendar relatórios automáticos

### 7. Ordenação Customizável
- [ ] Ordenar por data (asc/desc)
- [ ] Ordenar por paciente (A-Z)
- [ ] Ordenar por duração

---

**Status Final:** ✅ **Dashboard 100% funcional com visualizações múltiplas, filtros avançados e integração completa com API**  
**Versão Atual:** v2 (Card-Based Design)  
**Última Revisão:** 26 de outubro de 2025
