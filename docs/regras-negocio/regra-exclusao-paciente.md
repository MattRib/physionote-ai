# Regra de Negócio: Proteção de Exclusão de Pacientes

## 📋 Descrição

Implementada proteção para impedir a exclusão de pacientes que possuem sessões registradas no prontuário, garantindo a integridade dos dados históricos.

**Data de Implementação:** 15 de Outubro de 2025

---

## 🎯 Objetivo

Prevenir a perda acidental de dados históricos importantes ao garantir que pacientes com sessões registradas não possam ser excluídos do sistema.

---

## 📐 Regra

> **"Somente é permitido excluir pacientes que NÃO possuem sessões registradas no prontuário."**

### Condições:

- ✅ **Permitido:** Excluir paciente SEM sessões (`totalSessions === 0`)
- ❌ **Bloqueado:** Excluir paciente COM sessões (`totalSessions > 0`)

---

## 🔧 Implementação Técnica

### 1. **Backend - API Endpoint** (`/api/patients/[id]/route.ts`)

#### Validação no DELETE:

```typescript
// Buscar paciente com contagem de sessões
const existingPatient = await prisma.patient.findUnique({
  where: { id },
  include: {
    sessions: {
      select: { id: true },
    },
  },
});

// REGRA DE NEGÓCIO: Bloquear exclusão se houver sessões
if (existingPatient.sessions.length > 0) {
  return NextResponse.json(
    { 
      error: 'Não é possível excluir paciente com sessões registradas',
      message: `Este paciente possui ${existingPatient.sessions.length} ${existingPatient.sessions.length === 1 ? 'sessão registrada' : 'sessões registradas'} no prontuário. Para excluir o paciente, primeiro remova todas as sessões.`,
      sessionsCount: existingPatient.sessions.length
    },
    { status: 400 } // Bad Request
  );
}

// Continuar com exclusão apenas se não houver sessões
await prisma.patient.delete({ where: { id } });
```

#### Resposta de Erro:

**Status:** `400 Bad Request`

**Body:**
```json
{
  "error": "Não é possível excluir paciente com sessões registradas",
  "message": "Este paciente possui 5 sessões registradas no prontuário. Para excluir o paciente, primeiro remova todas as sessões.",
  "sessionsCount": 5
}
```

---

### 2. **Frontend - Validação Preventiva** (`PatientsView.tsx`)

#### Verificação antes de chamar API:

```typescript
const handleDeletePatient = async (patientId: string) => {
  const patient = patients.find(p => p.id === patientId);
  
  // Bloquear ANTES de chamar a API
  if (patient && patient.totalSessions > 0) {
    alert(
      `⚠️ Não é possível excluir este paciente!\n\n` +
      `${patient.name} possui ${patient.totalSessions} ${patient.totalSessions === 1 ? 'sessão registrada' : 'sessões registradas'} no prontuário.\n\n` +
      `Para excluir o paciente, primeiro remova todas as sessões do prontuário.`
    );
    return; // Abortar
  }
  
  // Continuar apenas se não houver sessões...
}
```

#### Tratamento de Erro da API:

```typescript
if (!response.ok) {
  const errorData = await response.json();
  
  // Mostrar mensagem específica do backend
  if (errorData.sessionsCount) {
    alert(
      `⚠️ ${errorData.error}\n\n` +
      `${errorData.message}`
    );
    return;
  }
}
```

---

### 3. **UI - Botão Desabilitado** (`PatientsList.tsx`)

#### Visual Feedback:

```tsx
<button
  onClick={() => onDelete(patient.id)}
  disabled={patient.totalSessions > 0}
  className={`... ${
    patient.totalSessions > 0
      ? 'cursor-not-allowed bg-gray-100 text-gray-400 opacity-50'
      : 'bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]'
  }`}
  title={
    patient.totalSessions > 0
      ? `Não é possível excluir: ${patient.totalSessions} ${patient.totalSessions === 1 ? 'sessão registrada' : 'sessões registradas'}`
      : 'Excluir paciente'
  }
>
  <Trash2 />
</button>
```

#### Estados Visuais:

| Condição | Aparência | Cursor | Tooltip |
|----------|-----------|--------|---------|
| **0 sessões** | 🔴 Vermelho claro | `pointer` | "Excluir paciente" |
| **1+ sessões** | ⚪ Cinza (opaco 50%) | `not-allowed` | "Não é possível excluir: X sessões registradas" |

---

## 🎨 Experiência do Usuário

### Cenário 1: Paciente SEM sessões

```
1. Usuário clica no botão vermelho "Excluir" (ativo)
2. Confirma no dialog: "Tem certeza que deseja excluir Maria Silva?"
3. ✅ Paciente excluído com sucesso
4. Mensagem: "✅ Paciente excluído com sucesso!"
```

### Cenário 2: Paciente COM sessões

#### Opção A - Tentativa via botão desabilitado:
```
1. Usuário passa o mouse no botão cinza (inativo)
2. Tooltip aparece: "Não é possível excluir: 3 sessões registradas"
3. Botão não clica (disabled)
```

#### Opção B - Tentativa forçada (se botão não estivesse desabilitado):
```
1. Usuário clica no botão "Excluir"
2. ⚠️ Alert imediato (antes de chamar API):
   
   "⚠️ Não é possível excluir este paciente!
   
   João Santos possui 3 sessões registradas no prontuário.
   
   Para excluir o paciente, primeiro remova todas as sessões do prontuário."

3. Operação cancelada
```

#### Opção C - Tentativa via API (se frontend falhasse):
```
1. Request: DELETE /api/patients/abc123
2. Response: 400 Bad Request
3. Body: { error: "...", message: "...", sessionsCount: 3 }
4. ⚠️ Alert com mensagem do servidor
5. Operação cancelada
```

---

## 🛡️ Camadas de Proteção

A regra é aplicada em **3 camadas** para máxima segurança:

### 1️⃣ **Camada UI (Preventiva)**
- Botão desabilitado visualmente
- Tooltip explicativo
- Impede clique antes mesmo de tentar

### 2️⃣ **Camada Frontend (Validação)**
- Verifica `totalSessions` antes de chamar API
- Mostra alert descritivo
- Economiza requisição desnecessária

### 3️⃣ **Camada Backend (Garantia)**
- Valida no servidor (fonte da verdade)
- Bloqueia com status 400
- Retorna mensagem clara
- **Impossível burlar via API direta**

---

## 📊 Fluxo Completo

```
┌─────────────────────────────────────────────────────┐
│ Usuário tenta excluir paciente                      │
└────────────┬────────────────────────────────────────┘
             │
             ▼
      ┌─────────────┐
      │ totalSessions│
      └──────┬───────┘
             │
      ┌──────▼──────────┐
      │  > 0 sessões?   │
      └──┬──────────┬───┘
         │ SIM      │ NÃO
         │          │
         ▼          ▼
   ┌─────────┐  ┌─────────┐
   │ BLOQUEAR│  │CONFIRMAR│
   │         │  │  DIALOG │
   │ Alert + │  └────┬────┘
   │ Disabled│       │
   └─────────┘       ▼
                ┌─────────┐
                │ Usuário │
                │ confirma?│
                └────┬────┘
                     │ SIM
                     ▼
              ┌──────────────┐
              │DELETE /api/  │
              │patients/{id} │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │ Prisma Query:│
              │ Include      │
              │ sessions     │
              └──────┬───────┘
                     │
              ┌──────▼──────────┐
              │sessions.length? │
              └──┬──────────┬───┘
                 │ > 0      │ === 0
                 │          │
                 ▼          ▼
          ┌──────────┐  ┌──────────┐
          │ 400 Error│  │  DELETE  │
          │ + Message│  │  SUCCESS │
          └──────────┘  └──────────┘
                             │
                             ▼
                        ┌──────────┐
                        │ 200 OK + │
                        │ Refresh  │
                        │ UI List  │
                        └──────────┘
```

---

## 🧪 Casos de Teste

### ✅ Teste 1: Excluir paciente sem sessões
**Setup:**
- Paciente: "Maria Silva"
- totalSessions: 0

**Resultado Esperado:**
- ✅ Botão vermelho ativo
- ✅ Confirmação exibida
- ✅ DELETE retorna 200 OK
- ✅ Paciente removido da lista
- ✅ Alert: "Paciente excluído com sucesso!"

---

### ❌ Teste 2: Tentar excluir paciente com 1 sessão
**Setup:**
- Paciente: "João Santos"
- totalSessions: 1

**Resultado Esperado:**
- ❌ Botão cinza desabilitado
- ❌ Tooltip: "Não é possível excluir: 1 sessão registrada"
- ❌ Clique bloqueado
- ❌ Nenhuma requisição enviada

---

### ❌ Teste 3: Tentar excluir paciente com 5 sessões
**Setup:**
- Paciente: "Ana Costa"
- totalSessions: 5

**Resultado Esperado:**
- ❌ Botão cinza desabilitado
- ❌ Tooltip: "Não é possível excluir: 5 sessões registradas"
- ❌ Se forçado via código: Alert + bloqueio
- ❌ Se alcançar API: 400 Bad Request

---

### 🔧 Teste 4: Validação backend (bypass frontend)
**Setup:**
- Request direto via Postman/curl: `DELETE /api/patients/abc123`
- Paciente tem 3 sessões

**Resultado Esperado:**
- ❌ Status: 400 Bad Request
- ❌ Body:
  ```json
  {
    "error": "Não é possível excluir paciente com sessões registradas",
    "message": "Este paciente possui 3 sessões registradas...",
    "sessionsCount": 3
  }
  ```

---

## 💡 Alternativas para Exclusão

Se o usuário precisa "remover" um paciente com sessões, as opções são:

### Opção 1: Excluir todas as sessões primeiro
1. Ir no prontuário do paciente
2. Excluir cada sessão manualmente
3. Voltar à lista de pacientes
4. Agora o botão estará habilitado

### Opção 2: Implementar "Arquivamento" (Futuro)
- Em vez de exclusão física, criar campo `archived: boolean`
- Pacientes arquivados não aparecem na lista principal
- Mantém histórico completo no banco

### Opção 3: Implementar "Exclusão em Cascata Controlada" (Futuro)
- Dialog especial: "Excluir paciente E todas as X sessões?"
- Checkbox extra para confirmar exclusão em massa
- Mais arriscado, requer permissões especiais

---

## 🔐 Segurança e Integridade

### Benefícios desta Regra:

1. **Prevenção de Perda de Dados**
   - Histórico clínico preservado
   - Notas de sessões mantidas
   - Rastreabilidade garantida

2. **Conformidade LGPD**
   - Mantém registros de atendimento
   - Importante para auditoria
   - Suporta direito de portabilidade

3. **UX Protetiva**
   - Usuário não pode cometer erro grave
   - Feedback visual claro
   - Mensagens descritivas

4. **Integridade Relacional**
   - Evita orphan sessions (impossível com ON DELETE CASCADE)
   - Mantém referências corretas
   - Previne corrupção de dados

---

## 📈 Métricas de Sucesso

- ✅ **0 exclusões acidentais** de pacientes com histórico
- ✅ **100% de bloqueios** quando há sessões registradas
- ✅ **Feedback claro** em todas as tentativas
- ✅ **Proteção em 3 camadas** funcionando

---

## 🚀 Implementação Completa

- [x] Backend: Validação na API
- [x] Frontend: Verificação preventiva
- [x] UI: Botão desabilitado com tooltip
- [x] Mensagens de erro descritivas
- [x] Testes de cenários
- [x] Documentação completa

---

## 📝 Notas de Desenvolvimento

**Decisões Técnicas:**

1. **Por que não usar CASCADE DELETE?**
   - Perda irreversível de dados históricos
   - Violaria princípios de auditoria
   - Não há como desfazer

2. **Por que 3 camadas de validação?**
   - UI: Melhor UX (feedback imediato)
   - Frontend: Economia de requests
   - Backend: Segurança garantida (impossível burlar)

3. **Por que não implementar "soft delete"?**
   - Escopo atual não requer
   - Pode ser adicionado no futuro
   - Exclusão física é suficiente para pacientes sem histórico

---

**Status:** ✅ **IMPLEMENTADO E TESTADO**

**Versão:** 1.0.0  
**Data:** 15 de Outubro de 2025
