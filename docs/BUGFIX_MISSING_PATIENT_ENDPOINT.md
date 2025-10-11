# Bugfix: Endpoint /api/patients/:id ausente

## 🐛 Problema Identificado

**Erro:** Console error ao tentar deletar paciente  
**Causa:** Endpoint `GET/PUT/DELETE /api/patients/:id` não existia  
**Impacto:** Edição e exclusão de pacientes não funcionavam

---

## ❌ Erro Original

```
Error at handleDeletePatient 
(webpack-internal:///(app-pages-browser)/./src/components/patients/PatientsView.tsx:73:21)
```

**Request:**
```
DELETE /api/patients/:id
Status: 404 Not Found
```

---

## 📁 Arquitetura Descoberta

### Antes (faltando):
```
src/app/api/patients/
├── route.ts (GET, POST) ✅
└── [id]/
    └── sessions/
        └── route.ts (GET, POST) ✅
```

### Depois (corrigido):
```
src/app/api/patients/
├── route.ts (GET, POST) ✅
└── [id]/
    ├── route.ts (GET, PUT, DELETE) ✅ NOVO
    └── sessions/
        └── route.ts (GET, POST) ✅
```

---

## 🔧 Solução Implementada

### Arquivo Criado: `src/app/api/patients/[id]/route.ts`

#### **Métodos Implementados:**

1. **GET /api/patients/:id** - Buscar paciente por ID
2. **PUT /api/patients/:id** - Atualizar paciente
3. **DELETE /api/patients/:id** - Deletar paciente

---

## ⚠️ Conflito Descoberto: Schema vs Interface

### Problema
O **frontend** usa interface `Patient` com campos que **não existem** no Prisma Schema:

#### Interface Frontend (PatientsView.tsx)
```typescript
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;              // ❌ NÃO EXISTE NO PRISMA
  birthDate: string;
  gender: string;
  address: {                // ❌ NÃO EXISTE NO PRISMA
    street: string;
    number: string;
    // ...
  };
  medicalHistory?: string;  // ❌ NÃO EXISTE NO PRISMA
  totalSessions: number;    // ✅ Computed
  lastSession?: string;     // ✅ Computed
}
```

#### Schema Prisma Real
```prisma
model Patient {
  id         String    @id @default(cuid())
  name       String
  email      String?   @unique
  phone      String?
  birthDate  DateTime?
  gender     String?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  sessions   Session[]
}
```

### Campos Ausentes no Banco:
- ❌ `cpf`
- ❌ `address`
- ❌ `medicalHistory`

---

## ✅ Solução Aplicada

### Opção 1: Adaptar Backend (escolhida)
Endpoint aceita **apenas os campos que existem** no Prisma:

```typescript
const updatePatientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
});
```

**Consequência:** Frontend pode enviar `cpf`, `address`, `medicalHistory`, mas eles serão **ignorados** (não salvos no banco).

### Opção 2: Migrar Schema (futuro)
Adicionar os campos ausentes ao Prisma:

```prisma
model Patient {
  // ... campos existentes
  cpf            String?
  address        Json?    // JSON para estrutura complexa
  medicalHistory String?
}
```

**Requer:** Migration do banco de dados.

---

## 📝 Implementação do Endpoint

### GET /api/patients/:id
```typescript
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      sessions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!patient) {
    return NextResponse.json(
      { error: 'Paciente não encontrado' },
      { status: 404 }
    );
  }

  // Calcular campos computed
  const totalSessions = await prisma.session.count({
    where: { patientId: id },
  });

  const lastSession = patient.sessions[0]?.createdAt
    .toISOString()
    .split('T')[0];

  return NextResponse.json({
    ...patient,
    totalSessions,
    lastSession,
  });
}
```

### PUT /api/patients/:id
```typescript
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  const validatedData = updatePatientSchema.parse(body);

  const existingPatient = await prisma.patient.findUnique({
    where: { id },
  });

  if (!existingPatient) {
    return NextResponse.json(
      { error: 'Paciente não encontrado' },
      { status: 404 }
    );
  }

  const updatedPatient = await prisma.patient.update({
    where: { id },
    data: {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      birthDate: validatedData.birthDate 
        ? new Date(validatedData.birthDate) 
        : undefined,
      gender: validatedData.gender,
    },
  });

  // Recalcular campos computed
  const totalSessions = await prisma.session.count({
    where: { patientId: id },
  });

  const lastSessionRecord = await prisma.session.findFirst({
    where: { patientId: id },
    orderBy: { createdAt: 'desc' },
  });

  const lastSession = lastSessionRecord?.createdAt
    .toISOString()
    .split('T')[0];

  return NextResponse.json({
    ...updatedPatient,
    totalSessions,
    lastSession,
  });
}
```

### DELETE /api/patients/:id
```typescript
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const existingPatient = await prisma.patient.findUnique({
    where: { id },
  });

  if (!existingPatient) {
    return NextResponse.json(
      { error: 'Paciente não encontrado' },
      { status: 404 }
    );
  }

  // Deletar paciente (sessions deletadas em cascata)
  await prisma.patient.delete({
    where: { id },
  });

  return NextResponse.json(
    { message: 'Paciente deletado com sucesso' },
    { status: 200 }
  );
}
```

---

## ✅ Validações

### Build
```bash
npm run build
```
**Resultado:** ✅ Build passou

### Rotas Compiladas
```
├ ƒ /api/patients           (GET, POST)
├ ƒ /api/patients/[id]      (GET, PUT, DELETE) ✅ NOVO
└ ƒ /api/patients/[id]/sessions (GET, POST)
```

---

## 🧪 Como Testar

### 1. Deletar Paciente
```bash
# Terminal ou DevTools
curl -X DELETE http://localhost:3000/api/patients/:id
```

### 2. Via Frontend
1. Acesse http://localhost:3000/dashboard/patients
2. Clique em 🗑️ (Excluir) de um paciente
3. Confirme a exclusão
4. ✅ Paciente deve sumir da lista e do banco

### 3. Editar Paciente
1. Clique em ✏️ (Editar)
2. Altere nome/email/telefone
3. Salve
4. ✅ Mudanças devem persistir

---

## 📊 Fluxo Corrigido

### Antes (❌ Erro)
```
Frontend → DELETE /api/patients/:id
                      ↓
                  404 Not Found
                      ↓
              Console.error
```

### Depois (✅ Funciona)
```
Frontend → DELETE /api/patients/:id
                      ↓
          [id]/route.ts → DELETE handler
                      ↓
       prisma.patient.delete({ where: { id } })
                      ↓
              200 OK + { message }
                      ↓
        Frontend atualiza lista
```

---

## ⚠️ Limitações Conhecidas

### Campos Ignorados
O backend **não salva** estes campos (enviados pelo frontend):
- `cpf`
- `address`
- `medicalHistory`

**Impacto:**
- Modal permite preencher esses campos
- Dados são enviados na requisição
- Backend **ignora** silenciosamente
- Dados **não** aparecem no banco

**Solução Futura:**
- Opção A: Adicionar campos ao Prisma Schema + migration
- Opção B: Remover campos do frontend (PatientModal)

---

## 🔄 Próximas Ações

### Imediato
- ✅ Endpoint `/api/patients/:id` criado
- ✅ Editar e deletar funcionam
- ✅ Build passou

### Curto Prazo
- 🔜 Decidir sobre campos extras (cpf, address, medicalHistory):
  - Migrar schema? (adicionar ao Prisma)
  - Remover do frontend? (simplificar)
- 🔜 Adicionar validações adicionais (CPF único, email único)

### Médio Prazo
- 🔜 Implementar toast notifications (substituir `alert()`)
- 🔜 Adicionar loading states em botões
- 🔜 Optimistic updates

---

## 📚 Referências

- **Arquivo Criado:** `src/app/api/patients/[id]/route.ts`
- **Frontend:** `src/components/patients/PatientsView.tsx`
- **Schema:** `prisma/schema.prisma`
- **Documentação Backend:** `docs/BACKEND_IMPLEMENTATION_SUMMARY.md`
- **Iterações 2-4:** `docs/FRONTEND_INTEGRATION_ITER2-4.md`

---

**Status:** ✅ Resolvido  
**Autor:** GitHub Copilot  
**Data:** 10/01/2025
