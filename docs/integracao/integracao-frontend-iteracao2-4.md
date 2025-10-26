# Frontend Integration - Iterações 2-4: CRUD Completo de Pacientes

## 📋 Resumo das Iterações

**Status:** ✅ Concluídas (3 iterações)  
**Data:** 10/01/2025  
**Componente:** `PatientsView.tsx`  
**Endpoints:** `POST /api/patients`, `PUT /api/patients/:id`, `DELETE /api/patients/:id`

---

## 🎯 Objetivos

### Iteração 2: Criar Paciente (POST)
Conectar o modal de criação com a API para persistir novos pacientes no banco de dados.

### Iteração 3: Editar Paciente (PUT)
Conectar o modal de edição com a API para atualizar dados de pacientes existentes.

### Iteração 4: Deletar Paciente (DELETE)
Implementar exclusão de pacientes com confirmação do usuário.

---

## 🔧 Implementação

### Arquivo Modificado

**`src/components/patients/PatientsView.tsx`**

### Alterações Realizadas

#### 1. **handleSavePatient - Criar e Editar** (Iterações 2 e 3)

```typescript
const handleSavePatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'totalSessions'>) => {
  try {
    if (editingPatient) {
      // EDITAR (PUT) - Iteração 3
      const response = await fetch(`/api/patients/${editingPatient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar paciente');
      }

      const updatedPatient = await response.json();
      setPatients(patients.map(p => p.id === editingPatient.id ? updatedPatient : p));
    } else {
      // CRIAR (POST) - Iteração 2
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar paciente');
      }

      const newPatient = await response.json();
      setPatients([newPatient, ...patients]);
    }

    setIsModalOpen(false);
    setEditingPatient(null);
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Erro ao salvar paciente');
    console.error('Erro ao salvar paciente:', err);
  }
};
```

**Fluxo:**
1. Verifica se está editando (editingPatient existe) ou criando (null)
2. Faz requisição POST (criar) ou PUT (editar) apropriada
3. Atualiza estado local com resposta da API
4. Fecha modal
5. Trata erros com alert + console.error

#### 2. **handleDeletePatient - Deletar** (Iteração 4)

```typescript
const handleDeletePatient = async (patientId: string) => {
  if (!confirm('Tem certeza que deseja excluir este paciente?')) {
    return;
  }

  try {
    const response = await fetch(`/api/patients/${patientId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir paciente');
    }

    setPatients(patients.filter(p => p.id !== patientId));
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Erro ao excluir paciente');
    console.error('Erro ao excluir paciente:', err);
  }
};
```

**Fluxo:**
1. Exibe confirmação (window.confirm)
2. Se confirmado, faz DELETE request
3. Remove paciente do estado local (filter)
4. Trata erros com alert + console.error

---

## ✅ Validações

### Build Production
```bash
npm run build
```
**Resultado:** ✅ Build passou sem erros

### TypeScript
```bash
npx tsc --noEmit
```
**Resultado:** ✅ Nenhum erro de tipo

### Bundle Size
- `/dashboard/patients`: 2.37 kB (mantido)
- Sem aumento de bundle

---

## 🧪 Como Testar

### 1. **Iniciar o servidor**
```bash
npm run dev
```

### 2. **Testar Criação (POST) - Iteração 2**

**Passo a passo:**
1. Acesse http://localhost:3000/dashboard/patients
2. Clique em **"Novo Paciente"**
3. Preencha o formulário:
   - Nome: "João Pedro Silva"
   - Email: "joao@email.com"
   - Telefone: "(11) 91234-5678"
   - CPF: "987.654.321-00"
   - Data de Nascimento: "15/05/1990"
   - Gênero: Masculino
   - Endereço completo
4. Clique em **"Salvar"**
5. ✅ Verifique que:
   - Modal fecha automaticamente
   - Paciente aparece **no topo da lista**
   - Card "Total de Pacientes" incrementa
   - Paciente está **no banco** (abra Prisma Studio)

**Verificar no banco:**
```bash
npx prisma studio
```
- Tabela Patient → deve ter o novo registro

### 3. **Testar Edição (PUT) - Iteração 3**

**Passo a passo:**
1. Na lista de pacientes, clique no ícone **✏️ (Editar)** de um paciente
2. Modal abre com dados preenchidos
3. Altere alguns campos (ex: telefone, email)
4. Clique em **"Salvar"**
5. ✅ Verifique que:
   - Modal fecha
   - Dados **atualizados na lista**
   - Mudanças persistidas no banco (Prisma Studio)

### 4. **Testar Exclusão (DELETE) - Iteração 4**

**Passo a passo:**
1. Na lista, clique no ícone **🗑️ (Excluir)** de um paciente
2. Diálogo de confirmação aparece
3. Clique em **"OK"** (confirmar)
4. ✅ Verifique que:
   - Paciente **removido da lista** imediatamente
   - Card "Total de Pacientes" decrementa
   - Paciente **deletado do banco** (Prisma Studio)

**Teste cancelamento:**
1. Clique em 🗑️ novamente
2. Clique em **"Cancelar"** no diálogo
3. ✅ Verifique que nada acontece (paciente permanece)

---

## 📊 Fluxo de Dados Completo

### Criar Paciente (POST)
```
PatientModal.tsx
      ↓ onSave(formData)
PatientsView.handleSavePatient()
      ↓ fetch POST /api/patients
API Route (route.ts)
      ↓ prisma.patient.create()
SQLite DB
      ↓ newPatient
PatientsView.setPatients([newPatient, ...patients])
      ↓
PatientsList.tsx (renderiza)
```

### Editar Paciente (PUT)
```
PatientsList → Edit button
      ↓ onEdit(patient)
PatientsView.handleEditPatient()
      ↓ setEditingPatient(patient)
PatientModal.tsx (preenchido)
      ↓ onSave(formData)
      ↓ fetch PUT /api/patients/:id
API Route ([id]/route.ts)
      ↓ prisma.patient.update()
SQLite DB
      ↓ updatedPatient
PatientsView.setPatients(map replace)
      ↓
PatientsList.tsx (atualizado)
```

### Deletar Paciente (DELETE)
```
PatientsList → Delete button
      ↓ onDelete(patientId)
PatientsView.handleDeletePatient()
      ↓ window.confirm()
      ↓ fetch DELETE /api/patients/:id
API Route ([id]/route.ts)
      ↓ prisma.patient.delete()
SQLite DB
      ↓ 200 OK
PatientsView.setPatients(filter)
      ↓
PatientsList.tsx (removido)
```

---

## 🐛 Possíveis Erros

### Erro: "Erro ao criar paciente"
**Causa:** Validação falhou no backend (Zod)  
**Solução:** Verifique se todos os campos obrigatórios foram preenchidos:
- name, email, phone, cpf, birthDate, gender
- address completo (street, number, neighborhood, city, state, zipCode)

### Erro: "Erro ao atualizar paciente"
**Causa:** Paciente não existe no banco ou validação falhou  
**Solução:** Confirme que o paciente existe; verifique campos obrigatórios

### Erro: "Erro ao excluir paciente"
**Causa:** Paciente tem sessões associadas (constraint de FK)  
**Solução:** No Prisma, a relação está como `onDelete: Cascade`, então deve funcionar. Se persistir, verifique sessões órfãs.

### Modal não fecha após salvar
**Causa:** Erro silencioso na requisição  
**Solução:**
1. Abra DevTools → Console
2. Procure por "Erro ao salvar paciente: [mensagem]"
3. Verifique Network tab: status da requisição

### Paciente criado mas não aparece
**Causa:** Estado não atualizou ou API retornou estrutura diferente  
**Solução:**
1. Verifique Network → Response da requisição POST
2. Confirme que API retorna objeto Patient completo
3. Verifique se `setPatients([newPatient, ...patients])` foi executado

---

## 📈 Melhorias Futuras (Não Implementadas)

### UX Enhancements
- ⏳ **Loading state no botão Salvar** (spinner, disabled)
- ✨ **Toast notifications** em vez de `alert()`
- 🎨 **Animação de entrada/saída** do paciente na lista
- 🔄 **Otimistic updates** (atualiza UI antes de confirmar API)

### Validações
- 📋 **Validação client-side** do formulário (antes de enviar)
- 🚫 **Verificar duplicatas** de CPF/email
- ⚠️ **Mensagens de erro específicas** (por campo)

### Performance
- 🔄 **Debounce na busca** (evitar filtrar a cada keystroke)
- 📄 **Paginação** (quando houver muitos pacientes)
- 💾 **Cache** de pacientes (React Query ou SWR)

---

## 📝 Próximos Passos

### ✅ Concluídas (Iterações 1-4)
- GET /api/patients (listar)
- POST /api/patients (criar)
- PUT /api/patients/:id (editar)
- DELETE /api/patients/:id (deletar)

### 🔜 Próximas (Iterações 5-10)
**Iteration 5: POST /api/patients/:id/sessions (Criar sessão)**
- Conectar `NewSessionFlow` com API
- Criar sessão e navegar para `SessionView`
- Aguardando feedback do usuário antes de avançar

---

## 📚 Referências

- **API Endpoints:**
  - `src/app/api/patients/route.ts` (GET, POST)
  - `src/app/api/patients/[id]/route.ts` (GET, PUT, DELETE)
- **Componente Frontend:** `src/components/patients/PatientsView.tsx`
- **Modal:** `src/components/patients/PatientModal.tsx`
- **Schema Prisma:** `prisma/schema.prisma` (model Patient)
- **Documentação Backend:** `docs/BACKEND_IMPLEMENTATION_SUMMARY.md`
- **Iteração 1:** `docs/FRONTEND_INTEGRATION_ITER1.md`

---

## 📸 Fluxo Visual

### Criar Paciente
```
[Dashboard] → [Novo Paciente] → [Modal] → [Preencher] → [Salvar]
                                               ↓
                                        POST /api/patients
                                               ↓
                                      [Paciente no topo da lista]
```

### Editar Paciente
```
[Lista] → [✏️ Editar] → [Modal preenchido] → [Alterar] → [Salvar]
                                                  ↓
                                         PUT /api/patients/:id
                                                  ↓
                                        [Lista atualizada]
```

### Deletar Paciente
```
[Lista] → [🗑️ Excluir] → [Confirmar?] → [OK]
                              ↓
                     DELETE /api/patients/:id
                              ↓
                    [Removido da lista]
```

---

**Autor:** GitHub Copilot  
**Revisão:** Aguardando testes do usuário  
**Build:** ✅ Passing (npm run build)
