# Bugfix: Edição de Paciente - Dados Não Carregam no Modal

## 🐛 Problema Relatado

**Sintoma:** "Quando eu clico para editar a ficha do meu paciente, não está retornando as informações do mesmo"  
**Comportamento:** Modal de edição abre vazio, sem preencher os campos com dados existentes

---

## 🔍 Análise do Problema

### **Causa Raiz 1: Dados Incompletos na Lista**
O `handleEditPatient` passava o paciente **da lista local** para o modal:

```typescript
// ANTES - Problemático
const handleEditPatient = (patient: Patient) => {
  setEditingPatient(patient);  // Dados da lista (incompletos)
  setIsModalOpen(true);
};
```

**Problema:** Paciente da lista tem apenas campos básicos (`name`, `email`, `phone`, etc.), mas o modal espera **todos os campos** (`cpf`, `address`, `medicalHistory`).

### **Causa Raiz 2: Schema Mismatch**
- **Frontend espera:** `cpf`, `address`, `medicalHistory`
- **Backend retorna:** apenas campos do Prisma (`name`, `email`, `phone`, `birthDate`, `gender`)

### **Causa Raiz 3: Formato de Data**
- **Backend retorna:** ISO string (`"2024-01-15T00:00:00.000Z"`)
- **Input date espera:** YYYY-MM-DD (`"2024-01-15"`)

---

## ✅ Soluções Implementadas

### **1. Buscar Dados Completos da API (PatientsView.tsx)**

#### Antes:
```typescript
const handleEditPatient = (patient: Patient) => {
  setEditingPatient(patient);  // Usa dados da lista
  setIsModalOpen(true);
};
```

#### Depois:
```typescript
const handleEditPatient = async (patient: Patient) => {
  try {
    // Buscar dados completos do paciente da API
    const response = await fetch(`/api/patients/${patient.id}`);
    
    if (!response.ok) {
      throw new Error('Erro ao carregar dados do paciente');
    }
    
    const fullPatientData = await response.json();
    console.log('Dados do paciente carregados:', fullPatientData);
    
    setEditingPatient(fullPatientData);
    setIsModalOpen(true);
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Erro ao carregar paciente');
    console.error('Erro ao carregar paciente:', err);
  }
};
```

**Benefícios:**
- ✅ Sempre busca dados **frescos** da API
- ✅ Garante consistência entre backend e frontend
- ✅ Logs para debugging
- ✅ Tratamento de erro se API falhar

### **2. useEffect Robusto (PatientModal.tsx)**

#### Problema Original:
```typescript
// Falhava se patient.birthDate era ISO string
birthDate: patient.birthDate || '',

// Assumia que patient.address sempre existia
address: {
  street: patient.address.street,  // ❌ ERRO se address = undefined
}
```

#### Solução:
```typescript
useEffect(() => {
  if (patient) {
    console.log('Preenchendo modal com dados do paciente:', patient);
    
    // Converter birthDate do formato ISO para YYYY-MM-DD
    let formattedBirthDate = '';
    if (patient.birthDate) {
      const date = new Date(patient.birthDate);
      if (!isNaN(date.getTime())) {
        formattedBirthDate = date.toISOString().split('T')[0];
      }
    }
    
    setFormData({
      name: patient.name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      cpf: patient.cpf || '', // Não existe no backend
      birthDate: formattedBirthDate,
      gender: (patient.gender as 'masculino' | 'feminino' | 'outro') || 'feminino',
      address: patient.address ? {
        street: patient.address.street || '',
        number: patient.address.number || '',
        // ... outros campos
      } : {
        // Valores padrão se address não existir
        street: '',
        number: '',
        // ...
      },
      medicalHistory: patient.medicalHistory || '', // Não existe no backend
      lastSession: patient.lastSession || ''
    });
  } else {
    // Reset completo quando patient = null (novo paciente)
    setFormData({
      name: '',
      email: '',
      // ... todos os campos zerados
    });
  }
}, [patient]);
```

**Benefícios:**
- ✅ **Conversão de data:** ISO → YYYY-MM-DD
- ✅ **Defensivo:** Não quebra se campos estão missing
- ✅ **Reset automático:** Limpa form para novo paciente
- ✅ **Logs:** Debug fácil

### **3. Aviso Visual sobre Campos**

Adicionei aviso no modal para informar o usuário:

```tsx
{patient && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
        <span className="text-yellow-600 text-sm font-bold">!</span>
      </div>
      <div className="flex-1">
        <h4 className="text-yellow-800 font-semibold text-sm mb-1">Campos em desenvolvimento</h4>
        <p className="text-yellow-700 text-sm">
          CPF, endereço e histórico médico ainda não são salvos no banco de dados. 
          Apenas nome, email, telefone, data de nascimento e gênero são persistidos.
        </p>
      </div>
    </div>
  </div>
)}
```

**Benefícios:**
- ✅ **Transparência:** Usuário sabe quais campos são salvos
- ✅ **Expectativa:** Evita confusão sobre dados "perdidos"
- ✅ **UX:** Só aparece no modo edição

---

## 📊 Fluxo Corrigido

### Antes (❌ Problemático):
```
1. Usuário clica ✏️ Editar
2. handleEditPatient(patientFromList)
3. patientFromList = { id, name, email, phone, totalSessions }
4. setEditingPatient(patientFromList)
5. Modal abre
6. useEffect: patient.cpf → undefined
7. useEffect: patient.address.street → ERROR
8. Modal: campos vazios ou erro
```

### Depois (✅ Funcional):
```
1. Usuário clica ✏️ Editar
2. handleEditPatient(patientFromList) → async
3. fetch(`/api/patients/${patient.id}`)
4. API retorna: { id, name, email, phone, birthDate, gender, ... }
5. console.log('Dados do paciente carregados:', fullPatientData)
6. setEditingPatient(fullPatientData)
7. Modal abre
8. useEffect detecta patient change
9. Conversão: birthDate ISO → YYYY-MM-DD
10. setFormData com todos os campos (com defaults)
11. Modal: campos preenchidos ✅
```

---

## 🧪 Como Testar

### **1. Teste Edição Básica**
1. Acesse http://localhost:3000/dashboard/patients
2. Clique no ícone **✏️ (Editar)** de um paciente
3. Abra **DevTools (F12)** → Console
4. ✅ Deve ver: `"Dados do paciente carregados: { ... }"`
5. ✅ Deve ver: `"Preenchendo modal com dados do paciente: { ... }"`
6. ✅ Modal deve abrir com campos **preenchidos**:
   - Nome ✅
   - Email ✅ (se existir)
   - Telefone ✅ (se existir)
   - Data de Nascimento ✅ (se existir)
   - Gênero ✅ (se existir)
7. ✅ Aviso amarelo deve aparecer sobre campos não salvos

### **2. Teste Campos Vazios**
1. Edite paciente que tem apenas nome
2. ✅ Outros campos devem aparecer vazios (não undefined)
3. ✅ Data deve estar no formato correto (YYYY-MM-DD)

### **3. Teste Salvar Edição**
1. Altere nome ou email
2. Clique **"Salvar"**
3. ✅ Deve salvar e fechar modal
4. ✅ Lista deve atualizar com novos dados

### **4. Teste Erro de API**
1. Desligue o servidor (`Ctrl+C`)
2. Tente editar paciente
3. ✅ Deve mostrar alert: "Erro ao carregar dados do paciente"
4. ✅ Modal não deve abrir

---

## 🐛 Possíveis Erros

### "Erro ao carregar dados do paciente"
**Causa:** API /api/patients/:id não responde  
**Solução:** Verifique se servidor está rodando

### Campos ainda vazios após correção
**Investigação:**
1. Abra DevTools → Console
2. Procure logs: "Dados do paciente carregados"
3. Verifique se API retorna dados corretos
4. Verifique se useEffect detecta mudança

### Data aparece como "Invalid Date"
**Causa:** Formato de data inválido do backend  
**Investigação:**
1. Verifique formato no console log
2. API deve retornar ISO string válida

### Aviso amarelo não aparece
**Causa:** Condição `{patient &&` não detecta edição  
**Investigação:**
1. Verifique se `editingPatient` está sendo setado
2. Modal recebe prop `patient` corretamente

---

## 🔄 Próximas Melhorias

### UX
- 🎨 **Loading state** no botão Editar (spinner enquanto busca dados)
- ✨ **Skeleton loading** no modal (campos "carregando...")
- 🎯 **Validação visual** de campos obrigatórios

### Backend
- 📊 **Adicionar campos ao Prisma Schema** (cpf, address, medicalHistory)
- 🔄 **Migration** para incluir novos campos
- 🗂️ **Endpoint mais rico** com relacionamentos

### Performance
- 🚀 **Cache de dados** do paciente (evitar buscar toda vez)
- 💾 **React Query** para gerenciamento de estado server

---

## 📚 Referências

- **Arquivos Modificados:**
  - `src/components/patients/PatientsView.tsx` (handleEditPatient async)
  - `src/components/patients/PatientModal.tsx` (useEffect robusto + aviso visual)
- **API Endpoint:** `src/app/api/patients/[id]/route.ts` (GET individual)
- **Documentação Relacionada:** `docs/BUGFIX_EMAIL_UNIQUE_CONSTRAINT.md`

---

**Status:** ✅ Resolvido  
**Autor:** GitHub Copilot  
**Data:** 10/01/2025

## 🎯 Resultado Esperado

- ✅ **Edição funciona:** Campos preenchidos com dados atuais
- ✅ **Transparência:** Usuário sabe quais campos são salvos
- ✅ **Robustez:** Não quebra com dados incompletos
- ✅ **Logs:** Fácil debugging se houver problemas