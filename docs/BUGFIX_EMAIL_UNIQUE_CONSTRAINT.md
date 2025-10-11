# Bugfix: Email Único - Constraint Violation

## 🐛 Problema Identificado

**Erro:** `Unique constraint failed on the fields: (email)`  
**Causa:** Tentativa de criar paciente com email que já existe no banco  
**Impacto:** Paciente não era criado, erro genérico para o usuário

---

## 🔍 Análise do Erro

### Prisma Schema
```prisma
model Patient {
  id         String    @id @default(cuid())
  name       String
  email      String?   @unique  // ← CONSTRAINT ÚNICA
  phone      String?
  // ...
}
```

### Problema Original
1. **Email obrigatório na interface:** `email: string`
2. **Email vazio enviado como string vazia:** `""`
3. **Primeiro paciente:** salva email `""`
4. **Segundo paciente:** tenta salvar email `""` → **ERRO: Duplicata**

---

## ✅ Soluções Implementadas

### 1. **Ajuste de Interface (PatientsView.tsx)**

#### Antes:
```typescript
export interface Patient {
  email: string;    // Obrigatório
  phone: string;    // Obrigatório
  cpf: string;      // Obrigatório
  birthDate: string; // Obrigatório
  gender: 'masculino' | 'feminino' | 'outro'; // Obrigatório
}
```

#### Depois:
```typescript
export interface Patient {
  email?: string;        // Opcional (como no Prisma)
  phone?: string;        // Opcional (como no Prisma)
  cpf?: string;          // Campo extra (não existe no Prisma)
  birthDate?: string;    // Opcional (como no Prisma)
  gender?: string;       // Opcional (como no Prisma)
}
```

**Benefício:** Interface agora reflete o schema real do Prisma.

### 2. **Envio de Dados Melhorado (PatientModal.tsx)**

#### Antes:
```typescript
const patientData = {
  name: formData.name,
  email: formData.email,    // String vazia = ""
  phone: formData.phone,    // String vazia = ""
  // ...
};
```

#### Depois:
```typescript
const patientData = {
  name: formData.name,
  email: formData.email.trim() || undefined,    // undefined se vazio
  phone: formData.phone.trim() || undefined,    // undefined se vazio
  birthDate: formData.birthDate || undefined,   // undefined se vazio
  gender: formData.gender || undefined,         // undefined se vazio
};
```

**Benefício:** 
- ✅ Campos vazios viram `undefined` 
- ✅ Prisma não salva `undefined` → evita constraint violation
- ✅ Múltiplos pacientes podem ter `email: null` no banco

### 3. **Tratamento de Erro Específico (PatientsView.tsx)**

#### Antes:
```typescript
throw new Error(`Erro ao criar paciente: ${response.status}`);
```

#### Depois:
```typescript
if (errorData.includes('Unique constraint failed on the fields: (`email`)')) {
  throw new Error('Este email já está cadastrado. Por favor, use um email diferente.');
}
throw new Error(`Erro ao criar paciente: ${response.status}`);
```

**Benefício:** Usuário vê mensagem clara e específica.

### 4. **Filtro de Busca Seguro (PatientsView.tsx)**

#### Antes:
```typescript
const filteredPatients = patients.filter(patient =>
  patient.email.toLowerCase().includes(searchTerm.toLowerCase()) || // ❌ ERRO se email = undefined
  patient.phone.includes(searchTerm) ||                              // ❌ ERRO se phone = undefined
  patient.cpf.includes(searchTerm)                                   // ❌ ERRO se cpf = undefined
);
```

#### Depois:
```typescript
const filteredPatients = patients.filter(patient =>
  patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||  // ✅ SEGURO
  (patient.phone && patient.phone.includes(searchTerm)) ||                              // ✅ SEGURO
  (patient.cpf && patient.cpf.includes(searchTerm))                                     // ✅ SEGURO
);
```

**Benefício:** Busca funciona mesmo com campos vazios/undefined.

### 5. **Exibição Segura (PatientsList.tsx)**

#### Antes:
```tsx
<div>{patient.email}</div>      {/* undefined = renderiza "" */}
<div>{patient.phone}</div>      {/* undefined = renderiza "" */}
```

#### Depois:
```tsx
<div>{patient.email || '-'}</div>      {/* undefined = renderiza "-" */}
<div>{patient.phone || '-'}</div>      {/* undefined = renderiza "-" */}
```

**Benefício:** UX melhor - campos vazios mostram "-" em vez de espaço em branco.

### 6. **useEffect Defensivo (PatientModal.tsx)**

#### Antes:
```typescript
setFormData({
  email: patient.email,    // ❌ ERRO se patient.email = undefined
  address: {
    street: patient.address.street,  // ❌ ERRO se patient.address = undefined
  }
});
```

#### Depois:
```typescript
setFormData({
  email: patient.email || '',
  address: patient.address ? {
    street: patient.address.street,
    // ...
  } : {
    street: '',
    // ... valores padrão
  }
});
```

**Benefício:** Modal abre sem erros mesmo com dados incompletos.

---

## ✅ Validações

### Build
```bash
npm run build
# ✅ Compiled successfully
# ✅ Linting and checking validity of types
```

### Bundle Size
- `/dashboard/patients`: 2.37 kB → 2.37 kB (mantido)

---

## 🧪 Como Testar

### 1. **Teste Cenário Normal**
1. Acesse http://localhost:3000/dashboard/patients
2. Clique **"Novo Paciente"**
3. Preencha:
   - **Nome:** "João Silva"
   - **Email:** deixe vazio OU preencha email único
4. Salve
5. ✅ Deve criar paciente normalmente

### 2. **Teste Email Duplicado**
1. Crie paciente com email "joao@email.com"
2. Tente criar outro paciente com mesmo email
3. ✅ Deve mostrar: **"Este email já está cadastrado. Por favor, use um email diferente."**

### 3. **Teste Campos Vazios**
1. Crie paciente preenchendo **apenas o nome**
2. Deixe email, telefone, data vazios
3. ✅ Deve criar normalmente
4. Na lista, campos vazios aparecem como **"-"**

### 4. **Teste Busca**
1. Crie pacientes com diferentes combinações:
   - Paciente A: nome + email
   - Paciente B: apenas nome
   - Paciente C: nome + telefone
2. Teste busca por nome, email, telefone
3. ✅ Busca deve funcionar sem erros

### 5. **Teste Edição**
1. Edite paciente existente
2. Tente mudar email para um que já existe
3. ✅ Deve mostrar erro específico
4. Mude para email único ou deixe vazio
5. ✅ Deve salvar normalmente

---

## 📊 Fluxo Corrigido

### Cenário: Email Vazio

#### Antes (❌ Erro):
```
PatientModal → email: ""
       ↓
POST /api/patients { email: "" }
       ↓
Prisma: patient.create({ email: "" })
       ↓
DB: Primeira inserção OK, email = ""
       ↓
Segunda tentativa → ERRO: Unique constraint (email já existe)
```

#### Depois (✅ Sucesso):
```
PatientModal → email: ""
       ↓
handleSubmit → email.trim() || undefined → undefined
       ↓
POST /api/patients { email: undefined }
       ↓
Prisma: patient.create({ email: undefined })
       ↓
DB: email = null (não viola constraint)
       ↓
Múltiplos pacientes podem ter email = null
```

### Cenário: Email Duplicado Real

#### Antes (❌ Erro genérico):
```
POST { email: "joao@email.com" }
       ↓
Prisma Error → 400 Bad Request
       ↓
"Erro ao criar paciente: 400"
```

#### Depois (✅ Erro específico):
```
POST { email: "joao@email.com" }
       ↓
Prisma Error → errorData parsing
       ↓
"Este email já está cadastrado. Por favor, use um email diferente."
```

---

## 🐛 Possíveis Erros Restantes

### "Este email já está cadastrado"
**Situação:** Email realmente duplicado  
**Solução:** Use email diferente ou deixe campo vazio

### Campos aparecem como "undefined" na UI
**Causa:** Erro na renderização  
**Investigação:** Verifique se usou `|| '-'` em vez de só `||`

### Erro ao editar paciente
**Causa:** Campos opcionais não tratados  
**Solução:** Mesmas correções aplicadas para criação

---

## 🔄 Próximas Melhorias

### UX
- 🎨 **Validação visual** de email duplicado (tempo real)
- ✨ **Toast notifications** em vez de `alert()`
- 🎯 **Highlight de campos únicos** (email)

### Backend
- 📧 **Endpoint para verificar email** (`GET /api/patients/check-email?email=...`)
- 🔐 **Validação mais robusta** (email format, domain check)
- 📊 **Logs estruturados** para debugging

### Performance
- 🚀 **Debounce na validação** de email
- 💾 **Cache de validações**

---

## 📚 Referências

- **Arquivos Modificados:**
  - `src/components/patients/PatientsView.tsx` (interface + tratamento erro)
  - `src/components/patients/PatientModal.tsx` (envio dados + useEffect)
  - `src/components/patients/PatientsList.tsx` (exibição segura)
- **Schema Prisma:** `prisma/schema.prisma` (model Patient)
- **Documentação Anterior:** `docs/BUGFIX_FORM_CREATION_LABELS.md`

---

**Status:** ✅ Resolvido  
**Autor:** GitHub Copilot  
**Data:** 10/01/2025  
**Build:** ✅ Passing

## 🎯 Resultado Final

- ✅ **Campos vazios não geram conflito** (undefined → null no DB)
- ✅ **Erro de email duplicado tem mensagem clara**
- ✅ **Interface reflete schema real** (campos opcionais)
- ✅ **Busca e exibição funcionam** com campos vazios
- ✅ **Build passa** sem erros de tipo