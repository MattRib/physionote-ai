# Dashboard v2 - Card-Based Design

## 📋 Visão Geral

O Dashboard v2 é uma reformulação completa da interface do dashboard, substituindo o layout de tabela por um design moderno baseado em **Cards**. Esta versão oferece uma experiência visual mais limpa, responsiva e intuitiva.

## 🎨 Componentes Criados

### 1. **DashboardLayout.tsx** (Componente Principal)
- **Responsabilidade**: Container principal que integra todos os componentes do dashboard
- **Features**:
  - Sidebar fixa em desktop
  - Menu mobile com overlay
  - Header com contadores de sessões (Concluídas, Processando, Com Erro)
  - Botão CTA "Nova Sessão" com animação
  - Grid responsivo de cards

### 2. **Sidebar.tsx** (Redesenhado)
- **Layout**: Fixo à esquerda, 256px de largura
- **Animação**: `slide-in-left` suave no carregamento
- **Estado Ativo**: Item ativo com background `#5A9BCF/10` e texto `#5A9BCF`
- **Navegação**:
  - Dashboard (`/dashboard`)
  - Configurações (`/dashboard/settings`)
  - Ajuda (`/dashboard/help`)
  - Sair (botão vermelho)
- **Mobile**: Ocultado por padrão, aparece com overlay

### 3. **SessionCard.tsx** (Card Individual)
- **Hierarquia de Dados**:
  - **Topo**: Data/Hora + Nome do Paciente
  - **Centro**: Duração (se disponível)
  - **Status**: Badge circular com cores específicas
  - **LGPD**: Ícone de escudo verde (ShieldCheck) quando anonimizado
  - **Bottom**: Botões "Ver Nota" e "Download"

- **Status Visual**:
  | Status | Cor | Ícone | Comportamento |
  |--------|-----|-------|---------------|
  | `completed` | Verde (`bg-green-500`) | `ShieldCheck` | Botões habilitados |
  | `processing` | Amarelo (`bg-amber-500`) | `Loader` (spinner) | Botões desabilitados |
  | `error` | Vermelho (`bg-red-500`) | `AlertCircle` | Botões desabilitados |

- **Animações**:
  - **Hover**: Elevação (`hover:-translate-y-2`) + shadow-xl
  - **Entrada**: `fade-in-up` com delay staggered (100ms * index)
  - **Botões**: `hover:scale-105` nos botões de ação

### 4. **SessionCards.tsx** (Grid Container)
- **Grid Responsivo**:
  - Mobile: 1 coluna
  - Tablet: 2 colunas
  - Desktop: 3 colunas
- **Estado Vazio**: Ilustração com mensagem amigável quando não há sessões
- **Staggered Animation**: Cada card entra com delay incremental (100ms)

## 🎯 Features Implementadas

### ✅ Responsividade Completa
- **Mobile** (< 768px): 1 coluna, menu hamburguer
- **Tablet** (768px - 1024px): 2 colunas
- **Desktop** (> 1024px): 3 colunas, sidebar fixa

### ✅ Animações Suaves
1. **Sidebar**: `animate-slide-in-left` (entrada da esquerda)
2. **Cards**: `animate-fade-in-up` com delay staggered
3. **Botões**: `hover:scale-105` com transição 300ms
4. **Ícones**: `group-hover:scale-110` nos itens de navegação

### ✅ Estados Visuais Claros
- **Ativo**: Background azul claro + texto azul
- **Hover**: Background cinza + texto azul
- **Desabilitado**: Opacidade reduzida + cursor not-allowed

### ✅ Conformidade LGPD
- Badge de escudo verde em cards anonimizados
- Animação de escala no hover do badge

### ✅ Contadores de Status
Barra de estatísticas no topo mostrando:
- **Concluídas**: Verde
- **Processando**: Amarelo
- **Com Erro**: Vermelho (só aparece se houver)

## 📦 Estrutura de Dados

```typescript
interface Session {
  id: string;
  session_datetime: string; // ISO 8601
  patient_name: string;
  status: 'completed' | 'processing' | 'error';
  is_anonymized: boolean;
  duration_minutes?: number;
}
```

## 🎨 Paleta de Cores

| Elemento | Cor | Hex |
|----------|-----|-----|
| Primário | Azul | `#5A9BCF` |
| Hover | Azul Escuro | `#2C5F8D` |
| Sucesso | Verde | `bg-green-500` |
| Aviso | Amarelo | `bg-amber-500` |
| Erro | Vermelho | `bg-red-500` |
| Background | Cinza Claro | `#F7F7F7` |
| Texto | Cinza Escuro | `#333333` |

## 🚀 Melhorias em Relação ao v1

| Aspecto | v1 (Tabela) | v2 (Cards) |
|---------|-------------|------------|
| **Visual** | Linhas densas | Cards espaçosos |
| **Mobile** | Scroll horizontal | Grid responsivo |
| **Status** | Texto simples | Badge colorido |
| **Ações** | Links pequenos | Botões grandes |
| **LGPD** | Texto | Ícone visual |
| **Animações** | Básicas | Avançadas (stagger) |
| **Densidade** | Alta | Média-baixa |

## 🔧 Próximos Passos

- [ ] Implementar `/dashboard/settings` page
- [ ] Implementar `/dashboard/help` page
- [ ] Conectar com API real (substituir mock data)
- [ ] Adicionar filtros (por status, por data)
- [ ] Adicionar busca de sessões
- [ ] Implementar paginação
- [ ] Adicionar modal de visualização de nota
- [ ] Implementar download de arquivos
- [ ] Adicionar loading states
- [ ] Implementar error boundaries

## 💡 Uso

### Import:
```typescript
import { DashboardLayout } from '@/components/dashboard';
```

### No page.tsx:
```typescript
export default function DashboardPage() {
  return <DashboardLayout />;
}
```

## 📝 Notas Técnicas

1. **Mock Data**: Atualmente usando 5 sessões mock em `DashboardLayout.tsx`
2. **Client Component**: Todos os componentes usam `'use client'` para interatividade
3. **Icons**: lucide-react para todos os ícones
4. **Routing**: next/navigation para navegação programática
5. **Animations**: Configuradas em `tailwind.config.ts`

## ✨ Highlights de UX

- **Feedback Visual**: Todos os elementos clicáveis têm hover states
- **Hierarquia Clara**: Informações importantes em destaque
- **Accessibility**: Botões com labels descritivos
- **Performance**: Animações otimizadas com CSS
- **Mobile-First**: Design pensado para mobile primeiro
