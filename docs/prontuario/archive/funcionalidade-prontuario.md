# Prontuário Eletrônico do Paciente - Documentação

## Visão Geral

Implementação completa de um sistema de prontuário eletrônico que permite visualizar informações detalhadas do paciente e todo o histórico de sessões/notas clínicas.

## Funcionalidades Implementadas

### 1. **Botão de Prontuário na Lista de Pacientes**

#### Localização
- **Arquivo**: `src/components/patients/PatientsList.tsx`
- **Posição**: Coluna "Ações" da tabela, antes dos botões Editar e Excluir

#### Características
- **Ícone**: `FileText` (ícone de prontuário/documento)
- **Cor**: Azul primário (`#5A9BCF`)
- **Hover**: Background azul claro com escala 110%
- **Tooltip**: "Prontuário"
- **Ação**: Redireciona para `/dashboard/patients/[id]`

#### Código
```tsx
<button
  onClick={() => handleViewRecord(patient.id)}
  className="p-2 text-[#5A9BCF] hover:bg-[#5A9BCF]/10 rounded-lg transition-all duration-200 hover:scale-110"
  title="Prontuário"
>
  <FileText className="w-4 h-4" />
</button>
```

### 2. **Página de Prontuário Eletrônico**

#### Rota Dinâmica
- **Arquivo**: `src/app/dashboard/patients/[id]/page.tsx`
- **Rota**: `/dashboard/patients/:id`
- **Tipo**: Dynamic Server-Rendered (ƒ)

#### Layout
- Sidebar persistente (navegação)
- Conteúdo principal com prontuário completo

### 3. **Componente PatientRecord**

#### Localização
- **Arquivo**: `src/components/patients/PatientRecord.tsx`
- **Export**: `src/components/patients/index.ts`

#### Estrutura Visual

##### **Header de Navegação**
- Botão "Voltar" (retorna à lista de pacientes)
- Botão "Exportar Prontuário" (placeholder para futura implementação)

##### **Card de Informações do Paciente**
Seção principal com dados pessoais e médicos:

**Avatar e Identificação**
- Avatar circular com gradiente e inicial do nome
- Nome completo (título grande)
- Idade e gênero
- Badge com total de sessões realizadas

**Grade de Informações (3 colunas)**
1. **Contato**
   - Telefone (ícone Phone)
   - Email (ícone Mail)

2. **Dados Pessoais**
   - Data de nascimento formatada (ícone Calendar)
   - CPF (ícone FileText)

3. **Endereço**
   - Endereço completo formatado (ícone MapPin)
   - Rua, número, complemento
   - Bairro, cidade/estado
   - CEP

**Histórico Médico**
- Seção separada por borda superior
- Texto completo do histórico médico do paciente

##### **Histórico de Sessões**

**Header**
- Título com ícone
- Contador de registros

**Timeline de Sessões**
Lista ordenada da mais recente para a mais antiga:

**Card de Sessão (Colapsável)**

*Header do Card:*
- Ícone circular (azul para mais recente, cinza para antigas)
- Data formatada (ex: "20 de março de 2024")
- Badge "Mais Recente" (apenas na primeira sessão)
- Horário da sessão
- Duração em minutos
- Botão "Ver nota completa" (ícone Eye)
- Botão expandir/colapsar (ChevronDown/Up)

*Conteúdo Expandido:*
- **Queixa Principal**: Descrição da queixa do paciente
- **Diagnóstico**: Diagnóstico fisioterapêutico
- **Intervenções Realizadas**: Lista com bullet points
- **Evolução**: Descrição da resposta ao tratamento

**Estado Vazio**
- Mensagem quando não há sessões registradas
- Ícone centralizado
- Texto explicativo

## Dados Mock

### Estrutura do Patient
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  gender: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  medicalHistory?: string;
  createdAt: string;
  totalSessions: number;
  sessions: SessionNote[];
}
```

### Estrutura do SessionNote
```typescript
{
  id: string;
  date: string; // ISO 8601
  duration: number; // minutos
  complaint: string;
  diagnosis: string;
  interventions: string[];
  evolution: string;
}
```

## Animações e UX

### Animações Implementadas
1. **Card principal**: `animate-fade-in` (fade in suave ao carregar)
2. **Detalhes da sessão**: `animate-fade-in` (ao expandir)
3. **Hover nos botões**: Transições suaves (200-300ms)

### Feedback Visual
- **Primeira sessão**: Ring azul ao redor do card
- **Badge "Mais Recente"**: Destaque verde
- **Hover**: Background changes e scale effects
- **Estados de expansão**: Ícones de chevron animados

### Responsividade
- **Desktop**: Grade de 3 colunas para informações
- **Tablet**: Grade de 2 colunas
- **Mobile**: Grade de 1 coluna (stack vertical)

## Fluxo de Navegação

```
Dashboard de Pacientes
  ↓ (clique no botão FileText)
Prontuário Eletrônico
  ↓ (botão Voltar)
Dashboard de Pacientes
```

## Integrações Futuras

### Planejadas (Placeholders)
1. **Exportar Prontuário**: Gerar PDF completo
2. **Ver Nota Completa**: Modal com nota detalhada (como NoteViewModal)
3. **Filtros de Sessão**: Por data, tipo de intervenção
4. **Busca no Histórico**: Buscar por palavra-chave nas notas
5. **Comparação de Evolução**: Gráficos de progresso
6. **Anexos**: Upload de exames, imagens
7. **Impressão**: Layout otimizado para impressão

### Backend
- Substituir `getMockPatientData()` por chamadas à API
- Carregar sessões paginadas (lazy loading)
- Cache de dados do paciente
- Sincronização em tempo real

## Arquivos Criados/Modificados

### Criados
1. **`src/app/dashboard/patients/[id]/page.tsx`**
   - Página dinâmica de prontuário
   - Wrapper com Sidebar

2. **`src/components/patients/PatientRecord.tsx`**
   - Componente principal do prontuário
   - 400+ linhas de código
   - Mock data integrado

### Modificados
1. **`src/components/patients/PatientsList.tsx`**
   - Adicionado import `FileText` e `useRouter`
   - Adicionada função `handleViewRecord`
   - Adicionado botão de prontuário na tabela

2. **`src/components/patients/index.ts`**
   - Exportado `PatientRecord`

## Cores e Estilo

### Paleta de Cores Usada
- **Azul Primário**: `#5A9BCF` (botões, ícones principais)
- **Azul Gradiente**: `from-[#5A9BCF] to-[#4A8BBF]` (avatar)
- **Verde**: Badge de sessões ativas
- **Cinza**: Sessões antigas, textos secundários
- **Vermelho**: (não usado nesta feature, reservado para alertas)

### Tipografia
- **Títulos**: font-bold, text-2xl/3xl
- **Subtítulos**: font-semibold, text-sm/base
- **Corpo**: text-[#666666], leading-relaxed

## Testes Recomendados

### Funcionalidade
- [ ] Clicar no botão de prontuário redireciona corretamente
- [ ] Dados do paciente são exibidos corretamente
- [ ] Sessões aparecem ordenadas (mais recente primeiro)
- [ ] Expandir/colapsar sessões funciona
- [ ] Botão "Voltar" retorna à lista
- [ ] Responsividade em mobile/tablet

### Visual
- [ ] Avatar mostra inicial correta
- [ ] Badge "Mais Recente" aparece apenas na primeira sessão
- [ ] Animações suaves ao expandir
- [ ] Hovers funcionam em todos os botões
- [ ] Layout não quebra com textos longos

### Performance
- [ ] Página carrega em < 3s
- [ ] Animações a 60fps
- [ ] Sem memory leaks ao navegar

## Status

✅ **Implementado e validado**
- Build: Sucesso (Dynamic route criada)
- TypeScript: Sem erros
- Responsivo: Sim
- Animações: Implementadas
- Mock Data: 4 sessões de exemplo

## Próximos Passos

1. Integrar com backend real
2. Implementar modal de nota completa
3. Adicionar exportação de PDF
4. Implementar gráficos de evolução
5. Adicionar filtros e busca
6. Sistema de anexos/upload

## Screenshots das Funcionalidades

### Botão na Lista
```
┌─────────────────────────────────────────┐
│  Ações:  [📄] [✏️] [🗑️]              │
│          ↑                              │
│      Prontuário                         │
└─────────────────────────────────────────┘
```

### Layout do Prontuário
```
┌──────────────────────────────────────────────┐
│ [← Voltar]              [Exportar Prontuário]│
├──────────────────────────────────────────────┤
│ ┌────────────────────────────────────────┐   │
│ │ [Avatar] Maria Silva Santos            │   │
│ │          32 anos • Feminino            │   │
│ │                         [12 sessões]   │   │
│ ├────────────────────────────────────────┤   │
│ │ Contato | Dados Pessoais | Endereço    │   │
│ │ Histórico Médico...                    │   │
│ └────────────────────────────────────────┘   │
├──────────────────────────────────────────────┤
│ 📄 Histórico de Sessões          4 registros │
├──────────────────────────────────────────────┤
│ ┌────────────────────────────────────────┐   │
│ │ [🔵] 20 de março de 2024 [Mais Recente]│   │
│ │      14:30 • 45 minutos      [👁️] [▼]  │   │
│ │  ↓ (expandido)                         │   │
│ │  Queixa: ...                           │   │
│ │  Diagnóstico: ...                      │   │
│ └────────────────────────────────────────┘   │
│ ┌────────────────────────────────────────┐   │
│ │ [⚪] 18 de março de 2024         [▶]   │   │
│ └────────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```
