# 👥 Módulo de Pacientes - PhysioNote.AI

**Última atualização:** 26 de outubro de 2025  
**Status:** ✅ **COMPLETO E FUNCIONAL**

---

## 📋 Visão Geral

O módulo de Pacientes do PhysioNote.AI permite o gerenciamento completo de pacientes, incluindo cadastro, visualização, edição e exclusão de registros. O módulo está **100% funcional** com integração completa entre frontend, backend e banco de dados.

## 🎯 Funcionalidades Implementadas

### 1. **Visualização de Pacientes** ✅ Completo
- ✅ Lista de todos os pacientes cadastrados (ordem: mais recentes primeiro)
- ✅ Visualização em cards com design moderno (glassmorphism)
- ✅ Sistema de busca em tempo real (nome, email, telefone, CPF)
- ✅ Botão "Filtros" (UI implementada, backend preparado para expansão)
- ✅ Estados de loading e error tratados
- ✅ Empty state quando não há pacientes

### 2. **Dashboard de Estatísticas** ✅ Completo
- ✅ **Total de pacientes cadastrados** (contagem em tempo real)
- ✅ **Pacientes ativos** (com pelo menos 1 sessão registrada)
- ✅ **Novos este mês** (filtro dinâmico por mês/ano atual)
- ✅ Cards com ícones emoji e gradientes coloridos

### 3. **Cadastro de Pacientes** ✅ Completo
- ✅ Modal completo com formulário estruturado
- ✅ Seções organizadas:
  - **Informações Pessoais**: Nome, CPF, data de nascimento, gênero
  - **Contato**: Email e telefone
  - **Endereço**: CEP, rua, número, complemento, bairro, cidade, estado
- ✅ Validação com Zod no backend
- ✅ Tratamento de erros (email duplicado, CPF duplicado)
- ✅ Feedback visual de sucesso/erro com AlertModal

### 4. **Edição de Pacientes** ✅ Completo
- ✅ Modal reutilizado para edição (mesmo componente do cadastro)
- ✅ Pré-preenchimento automático dos dados (busca completa via GET /api/patients/[id])
- ✅ Validação de campos obrigatórios
- ✅ Atualização otimista da lista após salvar
- ✅ Tratamento de erro de email duplicado

### 5. **Exclusão de Pacientes** ✅ Completo + Regra de Negócio
- ⚠️ **REGRA DE NEGÓCIO CRÍTICA:** Não permite excluir pacientes com sessões registradas
- ✅ Confirmação com AlertModal antes de excluir
- ✅ Botão desabilitado se paciente tiver sessões (com tooltip explicativo)
- ✅ Validação no backend (retorna erro 400 se houver sessões)
- ✅ Remoção otimista da lista após exclusão bem-sucedida

### 6. **Formatação Automática** ✅ Completo
- ✅ **CPF**: `000.000.000-00` (máx 14 caracteres)
- ✅ **Telefone**: `(00) 00000-0000` (máx 15 caracteres)
- ✅ **CEP**: `00000-000` (máx 9 caracteres)
- ✅ **Estado**: Uppercase automático (máx 2 caracteres)

### 7. **Navegação para Prontuário** ✅ Completo
- ✅ Botão "Prontuário" em cada card de paciente
- ✅ Redireciona para `/dashboard/patients/[id]` (PatientRecord)
- ✅ Integração com componente PatientRecord (visualização completa)

## 🗄️ Modelo de Dados (Prisma)

```prisma
model Patient {
  id              String           @id @default(cuid())
  name            String           // Campo obrigatório
  email           String?          @unique  // Opcional, mas único se fornecido
  phone           String?          // Opcional
  cpf             String?          @unique  // Opcional, mas único se fornecido
  birthDate       DateTime?        // Opcional
  gender          String?          // Opcional: masculino | feminino | outro
  
  // Campos de endereço (todos opcionais)
  street          String?
  number          String?
  complement      String?
  neighborhood    String?
  city            String?
  state           String?
  zipCode         String?
  
  // Metadata
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  
  // Relações
  sessions        Session[]        // 1:N com Session
  historySummary  HistorySummary?  // 1:1 com HistorySummary
}
```

**Campos Únicos:**
- `email` (constraint: unique)
- `cpf` (constraint: unique)

**Relações:**
- `sessions`: Todas as sessões do paciente
- `historySummary`: Resumo do histórico gerado por IA

## 🎨 Sistema de Design

### Paleta de Cores (Design System v2)
```typescript
// Cores Primárias
Primary Blue: #4F46E5 → #6366F1     // Gradiente principal
Primary Light: #EEF2FF               // Background de badges
Primary Border: #C7D2FE              // Bordas

// Cores Neutras
Neutral Dark: #0F172A / #111827      // Textos principais
Neutral Medium: #475569 / #64748B    // Textos secundários
Neutral Light: #F7F7F7 / #F8FAFC     // Backgrounds

// Cores de Estado
Success: #16A34A / #DCFCE7           // Verde (pacientes ativos)
Warning: #B45309 / #FEF3C7           // Amarelo (avisos)
Error: #DC2626 / #FEE2E2             // Vermelho (erros, exclusão)

// Cores de Dados
Info Blue: #1E3A8A / #DBEAFE         // Azul claro (sessões)
Data Green: #047857 / #D1FAE5        // Verde (última sessão)
```

### Componentes
- **Cards**: `rounded-[28px]`, border white/70, glassmorphism (`bg-white/95`)
- **Modal**: `rounded-lg`, scroll interno, validações inline
- **Botões**: 
  - Primary: Gradiente azul `from-[#4F46E5] to-[#6366F1]`
  - Secondary: `bg-white/90`, border subtle
  - Danger: `bg-[#FEF2F2]`, texto vermelho
- **Badges**: `rounded-full`, ícones Lucide, cores semânticas
- **Ícones**: Biblioteca lucide-react (Mail, Phone, FileText, Edit, Trash2, etc)
- **Sombras**: `shadow-[0_22px_60px_-42px_rgba(79,70,229,0.45)]` (customizadas)

## 📁 Estrutura de Arquivos

```
src/
├── app/
│   ├── dashboard/
│   │   └── patients/
│   │       └── [id]/
│   │           └── page.tsx         # Prontuário do paciente
│   └── api/
│       └── patients/
│           ├── route.ts             # GET (lista) + POST (criar)
│           └── [id]/
│               ├── route.ts         # GET (buscar) + PUT (editar) + DELETE (excluir)
│               ├── record/
│               │   └── route.ts     # GET prontuário completo
│               ├── sessions/
│               │   └── route.ts     # GET sessões do paciente
│               └── history-summary/
│                   └── route.ts     # GET + POST + PATCH + DELETE resumo IA
├── components/
│   └── patients/
│       ├── PatientsView.tsx         # Container principal (estado + lógica)
│       ├── PatientsList.tsx         # Grid de cards de pacientes
│       ├── PatientModal.tsx         # Modal de cadastro/edição
│       ├── PatientRecord.tsx        # Visualização completa do prontuário
│       └── index.ts                 # Exports
└── server/
    └── db.ts                        # Prisma client (singleton)
```

## 📊 Interface TypeScript

```typescript
// Interface principal do paciente (frontend)
export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;        // ISO 8601 format
  gender?: string;           // 'masculino' | 'feminino' | 'outro'
  // Address fields (flat structure)
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  // Metadata
  createdAt: string;
  lastSession?: string;      // ISO 8601 date string
  totalSessions: number;     // Calculado dinamicamente
}
```

**Observação:** A documentação antiga mostrava `address` como objeto aninhado, mas o código real usa estrutura **flat** (campos diretos no Patient).

## � APIs Implementadas

### 1. GET /api/patients
**Função:** Listar todos os pacientes  
**Autenticação:** Não implementada (público)  
**Response:**
```json
[
  {
    "id": "cm2fvqk3k0000ywp37pv0n6b2",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 98765-4321",
    "cpf": "123.456.789-00",
    "birthDate": "1990-05-15T00:00:00.000Z",
    "gender": "masculino",
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 45",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "createdAt": "2025-10-26T14:30:00.000Z",
    "updatedAt": "2025-10-26T14:30:00.000Z",
    "totalSessions": 5,
    "lastSession": "2025-10-25T10:00:00.000Z"
  }
]
```

**Ordenação:** `createdAt desc` (mais recentes primeiro)  
**Include:** Última sessão (`sessions.take(1)`)  
**Cálculo:** `totalSessions` e `lastSession` calculados por paciente

---

### 2. POST /api/patients
**Função:** Criar novo paciente  
**Validação:** Zod schema  
**Body:**
```json
{
  "name": "Maria Santos",           // ✅ Obrigatório
  "email": "maria@email.com",       // ❌ Opcional (mas único)
  "phone": "(11) 91234-5678",       // ❌ Opcional
  "cpf": "987.654.321-00",          // ❌ Opcional (mas único)
  "birthDate": "1985-08-20",        // ❌ Opcional (ISO 8601)
  "gender": "feminino",             // ❌ Opcional
  "street": "Av. Paulista",         // ❌ Opcional
  "number": "1000",                 // ❌ Opcional
  "complement": "Sala 200",         // ❌ Opcional
  "neighborhood": "Bela Vista",     // ❌ Opcional
  "city": "São Paulo",              // ❌ Opcional
  "state": "SP",                    // ❌ Opcional
  "zipCode": "01310-100"            // ❌ Opcional
}
```

**Response Success (201):**
```json
{
  "id": "cm2fvqk3k0000ywp37pv0n6b2",
  "name": "Maria Santos",
  "email": "maria@email.com",
  // ... todos os campos
  "createdAt": "2025-10-26T15:00:00.000Z",
  "updatedAt": "2025-10-26T15:00:00.000Z"
}
```

**Response Error (400):**
```json
{
  "error": "Unique constraint failed on the fields: (`email`)"
}
```

**Erros Tratados:**
- Email duplicado (unique constraint)
- CPF duplicado (unique constraint)
- Validação Zod falhou (campos inválidos)

---

### 3. GET /api/patients/[id]
**Função:** Buscar paciente por ID  
**Response Success (200):**
```json
{
  "id": "cm2fvqk3k0000ywp37pv0n6b2",
  "name": "João Silva",
  // ... todos os campos do paciente
  "totalSessions": 5,
  "lastSession": "2025-10-25"
}
```

**Response Error (404):**
```json
{
  "error": "Paciente não encontrado"
}
```

---

### 4. PUT /api/patients/[id]
**Função:** Atualizar paciente existente  
**Validação:** Zod schema (mesmo do POST)  
**Body:** Mesma estrutura do POST  
**Response Success (200):** Paciente atualizado + `totalSessions` + `lastSession`  
**Response Error (404):** Paciente não encontrado  
**Response Error (400):** Email/CPF duplicado ou validação falhou

---

### 5. DELETE /api/patients/[id]
**Função:** Excluir paciente  
**REGRA DE NEGÓCIO:** ⚠️ **NÃO permite excluir se houver sessões registradas**

**Response Success (200):**
```json
{
  "message": "Paciente deletado com sucesso"
}
```

**Response Error (404):**
```json
{
  "error": "Paciente não encontrado"
}
```

**Response Error (400) - Com Sessões:**
```json
{
  "error": "Não é possível excluir paciente com sessões registradas",
  "message": "Este paciente possui 5 sessões registradas no prontuário. Para excluir o paciente, primeiro remova todas as sessões.",
  "sessionsCount": 5
}
```

---

## 🔄 Fluxos de Uso

### 1. Adicionar Novo Paciente
```
Usuário → Clica "Novo Paciente"
  → PatientsView.setIsModalOpen(true)
  → PatientModal renderiza (patient=null)
  → Usuário preenche formulário
  → Clica "Cadastrar Paciente"
  → PatientsView.handleSavePatient()
    → POST /api/patients
    → Response 201: Success
      → setPatients([newPatient, ...patients])  // Adiciona no topo
      → showAlert('success', 'Paciente Criado')
      → setIsModalOpen(false)
    → Response 400: Error
      → showAlert('error', 'Erro ao Salvar', error.message)
```

### 2. Editar Paciente
```
Usuário → Clica ícone Edit no card
  → PatientsView.handleEditPatient(patient)
    → GET /api/patients/[id]  // Busca dados completos
    → setEditingPatient(fullData)
    → setIsModalOpen(true)
  → PatientModal renderiza (patient=fullData)
  → useEffect() pré-preenche formData
  → Usuário modifica campos
  → Clica "Salvar Alterações"
  → PatientsView.handleSavePatient()
    → PUT /api/patients/[id]
    → Response 200: Success
      → setPatients(patients.map(p => p.id === id ? updated : p))
      → showAlert('success', 'Paciente Atualizado')
    → Response 400: Error (email duplicado)
      → showAlert('error', 'Erro ao Salvar', 'Email já cadastrado')
```

### 3. Excluir Paciente
```
Usuário → Clica ícone Trash no card
  → PatientsView.handleDeletePatient(patientId)
  → Verifica: patient.totalSessions > 0?
    → SIM: showAlert('warning', 'Não é Possível Excluir', 'Paciente possui N sessões')
    → RETURN (não prossegue)
  → NÃO: showAlert('warning', 'Confirmar Exclusão', onConfirm callback, showCancel=true)
    → Usuário clica "Excluir"
      → DELETE /api/patients/[id]
      → Response 200: Success
        → setPatients(patients.filter(p => p.id !== id))
        → showAlert('success', 'Paciente Excluído')
      → Response 400: Error (sessões no backend)
        → showAlert('warning', 'Não é Possível Excluir', errorData.message)
```

### 4. Buscar Paciente
```
Usuário → Digita no input de busca
  → setSearchTerm(value)
  → filteredPatients = patients.filter(p => 
      name includes searchTerm ||
      email includes searchTerm ||
      phone includes searchTerm ||
      cpf includes searchTerm
    )
  → PatientsList renderiza apenas filteredPatients
```

### 5. Ver Prontuário
```
Usuário → Clica ícone FileText no card
  → PatientsList.handleViewRecord(patientId)
  → router.push(`/dashboard/patients/${patientId}`)
  → Redireciona para página do PatientRecord
```

---

## 🎭 Estados da Interface

### Loading State
```tsx
{loading && (
  <div className="rounded-[26px] border bg-white/90 p-16">
    <LoadingSpinner size="lg" className="mx-auto mb-5" />
    <p>Carregando pacientes...</p>
  </div>
)}
```

### Error State
```tsx
{error && !loading && (
  <div className="rounded-[26px] border border-red-100 bg-gradient-to-br from-[#FEE2E2]">
    <h3>Erro ao carregar pacientes</h3>
    <p>{error}</p>
  </div>
)}
```

### Empty State
```tsx
{patients.length === 0 && (
  <div className="rounded-[28px] border-dashed border-[#C7D2FE]">
    <div className="text-3xl">👥</div>
    <h3>Nenhum paciente encontrado</h3>
    <p>Clique em "Novo Paciente"...</p>
  </div>
)}
```

---

## ⚠️ Regras de Negócio Importantes

### 1. Exclusão de Pacientes
**Regra:** Pacientes com sessões registradas **NÃO PODEM ser excluídos**

**Validação Frontend:**
```typescript
// Botão desabilitado se totalSessions > 0
disabled={patient.totalSessions > 0}
title={`Não é possível excluir: ${patient.totalSessions} sessões registradas`}
```

**Validação Backend:**
```typescript
if (existingPatient.sessions.length > 0) {
  return NextResponse.json({ 
    error: '...',
    sessionsCount: existingPatient.sessions.length
  }, { status: 400 });
}
```

**Motivo:** Preservar integridade referencial e histórico clínico

---

### 2. Campos Únicos
**Email e CPF** devem ser únicos no banco de dados

**Validação Prisma:** `@unique` constraint  
**Erro:** `Unique constraint failed on the fields: (email|cpf)`  
**Tratamento Frontend:** Mensagem amigável "Email/CPF já cadastrado"

---

### 3. Campos Obrigatórios
**Apenas `name` é obrigatório** (validação Zod + HTML5 required)

Todos os demais campos são opcionais, permitindo cadastros rápidos e atualização gradual de dados.

---

## 🧪 Testes Necessários

### Testes de Integração

```typescript
describe('POST /api/patients', () => {
  it('should create patient with minimum required data', async () => {
    const response = await fetch('/api/patients', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Patient' })
    });
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.id).toBeDefined();
    expect(data.name).toBe('Test Patient');
  });

  it('should reject duplicate email', async () => {
    await createPatient({ name: 'Patient 1', email: 'test@test.com' });
    const response = await fetch('/api/patients', {
      method: 'POST',
      body: JSON.stringify({ name: 'Patient 2', email: 'test@test.com' })
    });
    expect(response.status).toBe(400);
  });
});

describe('DELETE /api/patients/[id]', () => {
  it('should prevent deletion if patient has sessions', async () => {
    const patient = await createPatient({ name: 'Test' });
    await createSession({ patientId: patient.id });
    
    const response = await fetch(`/api/patients/${patient.id}`, {
      method: 'DELETE'
    });
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.sessionsCount).toBe(1);
  });
});
```

---

## 🚀 Melhorias Futuras Sugeridas

### 1. Autenticação e Autorização
- [ ] Adicionar middleware de autenticação nas rotas
- [ ] Restringir acesso apenas ao fisioterapeuta dono dos dados
- [ ] Implementar multi-tenancy (isolamento por terapeuta)

### 2. Busca Avançada
- [ ] Filtro por gênero
- [ ] Filtro por faixa etária
- [ ] Filtro por cidade/estado
- [ ] Filtro por status (ativo/inativo)
- [ ] Ordenação personalizável (nome, data, sessões)

### 3. Paginação
- [ ] Implementar paginação no backend (limit + offset)
- [ ] Infinite scroll ou numbered pages
- [ ] Configuração de itens por página

### 4. Import/Export
- [ ] Import CSV de pacientes (bulk upload)
- [ ] Export CSV/Excel da lista
- [ ] Export PDF de prontuário individual

### 5. Integração ViaCEP
- [ ] Buscar endereço automaticamente ao digitar CEP
- [ ] Auto-preencher: rua, bairro, cidade, estado

### 6. Histórico de Alterações
- [ ] Audit log de mudanças nos dados do paciente
- [ ] Quem alterou e quando (se multi-usuário)

### 7. Validações Adicionais
- [ ] Validar formato de CPF (dígitos verificadores)
- [ ] Validar formato de telefone (DDD válido)
- [ ] Validar data de nascimento (não pode ser futura)
- [ ] Validar idade mínima/máxima razoável

---

## 📚 Documentação Relacionada

- 📁 `docs/sessoes/` - Módulo de Sessões (relação com pacientes)
- 📁 `docs/prontuario/` - Visualização completa do prontuário
- 📁 `docs/regras-negocio/` - Regra de exclusão de pacientes
- 📁 `docs/projeto/estrutura-projeto.md` - Estrutura geral do projeto

---

**Status Final:** ✅ **Módulo 100% funcional e documentado**  
**Próximos Passos:** Implementar autenticação e melhorias de UX (paginação, filtros avançados)
- PUT /api/patients/:id - Atualizar paciente
- DELETE /api/patients/:id - Excluir paciente
```

### Funcionalidades Futuras
- [ ] Filtros avançados (por data, gênero, cidade)
- [ ] Exportar lista em PDF/Excel
- [ ] Histórico de sessões do paciente
- [ ] Upload de documentos (laudos, exames)
- [ ] Agenda de consultas integrada
- [ ] Notificações por email/SMS
- [ ] Relatórios de evolução
- [ ] Integração com sistema de pagamentos

### Validações Adicionais
- [ ] Validação de CPF com dígito verificador
- [ ] Validação de CEP com busca automática de endereço (ViaCEP)
- [ ] Validação de email com verificação
- [ ] Prevenção de CPF duplicado

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Next.js 14** (App Router)
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **Estado local** com useState (preparado para Zustand/Redux)

## 📱 Responsividade

✅ **Mobile First**
- Layout adaptável para todos os tamanhos de tela
- Grid responsivo (1 coluna → 2 → 3 colunas)
- Modal com scroll interno em telas pequenas
- Botões e inputs otimizados para touch

## ⚡ Performance

- Busca otimizada com filtro client-side
- Renderização condicional (Grid vs Table)
- Lazy loading preparado para grandes listas
- Memoização pronta para implementação

## 🎓 Boas Práticas Aplicadas

✅ TypeScript com tipagem completa
✅ Componentização modular
✅ Separação de responsabilidades
✅ Props drilling evitado
✅ Código limpo e comentado
✅ Consistência com Design System
✅ Acessibilidade (aria-labels, títulos)

---

**Desenvolvido seguindo as diretrizes de design do PhysioNote.AI**
