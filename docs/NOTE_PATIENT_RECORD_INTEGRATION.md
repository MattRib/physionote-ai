# Integração: Notas Geradas → Prontuário do Paciente

**Data**: 15 de outubro de 2025  
**Status**: ✅ Backend Completo | ⚠️ Frontend em Adaptação

## 📋 Resumo

Implementamos a integração completa entre as notas geradas pela IA (Whisper + GPT-4) e o prontuário eletrônico de cada paciente. Agora, toda nota gerada após uma sessão é automaticamente vinculada ao paciente correto e pode ser visualizada no prontuário.

## 🔗 Arquitetura da Integração

```
┌─────────────┐
│   Patient   │
│  (Paciente) │
└──────┬──────┘
       │ 1:N
       │
       ▼
┌─────────────┐
│   Session   │
│  (Sessão)   │────┐
└──────┬──────┘    │ patientId
       │ 1:1       │
       │           │
       ▼           ▼
┌─────────────┐   ┌──────────────────────┐
│    Note     │   │   Patient Record     │
│   (Nota)    │   │    (Prontuário)      │
└─────────────┘   └──────────────────────┘
```

### Relacionamentos no Prisma Schema

```prisma
model Patient {
  id        String    @id @default(cuid())
  name      String
  email     String?   @unique
  // ... outros campos cadastrais
  sessions  Session[] // ← Relação 1:N
}

model Session {
  id            String   @id @default(cuid())
  patientId     String   // ← FK para Patient
  transcription String?
  status        String   @default("recording")
  // ... outros campos
  patient       Patient  @relation(fields: [patientId], references: [id])
  note          Note?    // ← Relação 1:1
}

model Note {
  id           String   @id @default(cuid())
  sessionId    String   @unique // ← FK para Session (única)
  contentJson  String   // ← JSON estruturado com a nota completa
  aiGenerated  Boolean  @default(false)
  aiModel      String?  // Ex: "gpt-4o"
  // ... outros campos
  session      Session  @relation(fields: [sessionId], references: [id])
}
```

## 🔧 Componentes Implementados

### 1. Endpoint de Prontuário Completo

**Arquivo**: `src/app/api/patients/[id]/record/route.ts`

**Funcionalidade**:
- Busca paciente com todas as sessões e notas
- Parseia `contentJson` de cada nota
- Calcula estatísticas do tratamento
- Ordena sessões por data (mais recente primeiro)

**Response Structure**:
```typescript
{
  patient: {
    id, name, email, phone, cpf, birthDate, gender,
    address: {
      street, number, complement, neighborhood, city, state, zipCode
    },
    createdAt, updatedAt
  },
  statistics: {
    totalSessions: number,
    completedSessions: number,
    totalDurationMinutes: number,
    averageDurationMinutes: number,
    firstSessionDate: string | null,
    lastSessionDate: string | null
  },
  sessions: [
    {
      id, date, durationMin, sessionType, specialty, motivation,
      status, transcription,
      note: {
        id, aiGenerated, aiModel, createdAt, updatedAt,
        content: {
          // Estrutura completa da nota gerada pela IA
          resumoExecutivo, anamnese, diagnosticoFisioterapeutico,
          intervencoes, respostaTratamento, orientacoes,
          planoTratamento, observacoesAdicionais, proximaSessao
        }
      } | null
    }
  ]
}
```

### 2. Processamento de Sessão (Já Existente, Validado)

**Arquivo**: `src/app/api/sessions/[id]/process/route.ts`

**Fluxo**:
1. Recebe ID da sessão
2. Busca sessão com paciente
3. Transcreve áudio com Whisper
4. Gera nota com GPT-4 (usando prompt aprimorado)
5. **Salva nota vinculada à sessão**:
   ```typescript
   await prisma.note.upsert({
     where: { sessionId },
     create: {
       sessionId,
       contentJson: JSON.stringify(note),
       aiGenerated: true,
       aiModel: model,
       aiPromptUsed: promptUsed
     },
     update: { ...}
   });
   ```
6. Atualiza status da sessão para `completed`

### 3. Geração de Nota Aprimorada

**Arquivo**: `src/server/note-generation.ts`

**Melhorias Implementadas**:
- ✅ Prompt reescrito para ser assistente completo (não apenas extrator)
- ✅ IA sugere códigos CIF apropriados
- ✅ IA gera protocolos detalhados com parâmetros (séries, reps, duração)
- ✅ IA cria orientações domiciliares, ergonômicas e precauções
- ✅ IA sugere plano de tratamento com frequência e duração
- ✅ IA define objetivos SMART de curto e longo prazo
- ✅ IA estabelece critérios objetivos de alta
- ✅ Temperatura aumentada para 0.5 (mais criativo mas preciso)

**Exemplo de Prompt**:
```
A IA agora atua como ASSISTENTE FISIOTERAPEUTA que:
- Extrai informações da transcrição
- Sugere diagnósticos diferenciais
- Gera códigos CIF apropriados
- Cria protocolos com dosagem específica
- Fornece orientações práticas e completas
```

### 4. Componente PatientRecord (Em Adaptação)

**Arquivo**: `src/components/patients/PatientRecord.tsx`

**Status Atual**:
- ✅ Busca dados de `/api/patients/[id]/record`
- ✅ Estados de loading e erro implementados
- ✅ Interfaces TypeScript atualizadas
- ⚠️ Rendering das notas precisa ser adaptado para nova estrutura

**Necessário Ajustar**:
```typescript
// ANTES (mock):
session.resumoExecutivo.queixaPrincipal

// DEPOIS (API real):
session.note?.content?.resumoExecutivo?.queixaPrincipal
```

## 🚀 Fluxo Completo de Uso

### Passo a Passo

1. **Fisioterapeuta seleciona paciente** (`/dashboard/patients`)
2. **Clica em "Nova Sessão"** → Abre `SessionView`
3. **Grava consulta** → Áudio salvo, status = `recording`
4. **Clica "Finalizar Sessão"**:
   - Upload de áudio
   - POST para `/api/sessions/[id]/process`
   - Status → `transcribing`
   - Whisper processa áudio (~30s para 30min de áudio)
   - Status → `generating`
   - GPT-4 gera nota completa (~10-15s)
   - Status → `completed`
   - Nota salva em `Note` table vinculada a `sessionId`
5. **Tela SessionSummary** aparece com nota gerada
6. **Fisioterapeuta pode revisar e editar** a nota
7. **Navega para Prontuário do Paciente** (botão "Prontuário" na lista)
8. **Ve histórico completo** com todas as notas geradas

### API Calls

```javascript
// 1. Buscar prontuário completo
GET /api/patients/{patientId}/record

// 2. Listar apenas sessões
GET /api/patients/{patientId}/sessions

// 3. Processar sessão (gera nota)
POST /api/sessions/{sessionId}/process
```

## 📊 Estrutura de Dados

### Note.contentJson (Parseado)

```json
{
  "resumoExecutivo": {
    "queixaPrincipal": "Lombalgia crônica há 3 meses",
    "nivelDor": 7,
    "evolucao": "Melhora de 30% em relação à última sessão"
  },
  "anamnese": {
    "historicoAtual": "...",
    "antecedentesPessoais": "...",
    "medicamentos": "...",
    "objetivos": "..."
  },
  "diagnosticoFisioterapeutico": {
    "principal": "Lombalgia mecânica crônica",
    "secundarios": ["Encurtamento cadeia posterior", "Fraqueza de core"],
    "cif": "b28013 (Dor lombar - grave)"
  },
  "intervencoes": {
    "tecnicasManuais": [
      "Mobilização L4-L5 grau III - 3x30s",
      "Liberação miofascial quadrado lombar - 5min bilateral"
    ],
    "exerciciosTerapeuticos": [
      "Ponte com sustentação isométrica - 3x10 (10s)",
      "Ativação transverso abdominal - 3x10"
    ],
    "recursosEletrotermo": [
      "TENS burst lombar - 20min"
    ]
  },
  "respostaTratamento": {
    "imediata": "Dor 7/10 → 4/10",
    "efeitos": "Sem efeitos adversos",
    "feedback": "Paciente satisfeito"
  },
  "orientacoes": {
    "domiciliares": [
      "Aplicar calor 15-20min antes de exercícios",
      "Alongamentos 2x/dia"
    ],
    "ergonomicas": [
      "Apoio lombar na cadeira",
      "Pausas 5min a cada 1h"
    ],
    "precaucoes": [
      "Evitar rotação + flexão combinadas",
      "Não carregar >5kg por enquanto"
    ]
  },
  "planoTratamento": {
    "frequencia": "3x/semana por 2 semanas, depois 2x/semana",
    "duracaoPrevista": "8-12 semanas",
    "objetivosCurtoPrazo": [
      "Reduzir dor para ≤3/10 em 2 semanas",
      "Aumentar ADM flexão para 75° em 2 semanas"
    ],
    "objetivosLongoPrazo": [
      "Retorno ao trabalho sem limitações em 6-8 semanas",
      "Iniciar programa de caminhada em 8 semanas"
    ],
    "criteriosAlta": [
      "Dor ≤2/10",
      "ADM completa e indolor",
      "Força 5/5"
    ]
  },
  "observacoesAdicionais": "Paciente motivado, boa aderência",
  "proximaSessao": {
    "data": "2 dias",
    "foco": "Progressão de exercícios e reavaliação"
  }
}
```

### Campos API vs Nomes no Mock

| API (Backend)          | Mock (Frontend Antigo) |
|------------------------|------------------------|
| `secundarios`          | `secundario`           |
| `recursosEletrotermo`  | `recursosEletrotermofototerapeticos` |
| `session.note.content` | `session` (direto)     |

## ✅ Validação de Integração

### Checklist de Testes

- [x] Nota é criada no banco após processamento
- [x] `sessionId` vincula nota à sessão correta
- [x] `patientId` da sessão vincula à paciente correto
- [x] Endpoint `/api/patients/[id]/record` retorna dados completos
- [x] `contentJson` é parseado corretamente
- [x] Sessões ordenadas por data DESC
- [ ] Frontend PatientRecord renderiza notas (em andamento)
- [ ] Teste end-to-end: Gravação → Nota → Prontuário

### Consultas SQL de Verificação

```sql
-- Verificar nota vinculada a sessão
SELECT s.id, s.patientId, s.status, n.id as noteId, n.aiGenerated 
FROM Session s 
LEFT JOIN Note n ON n.sessionId = s.id 
WHERE s.patientId = 'patient-id';

-- Buscar prontuário completo
SELECT 
  p.name,
  COUNT(s.id) as total_sessions,
  COUNT(n.id) as total_notes
FROM Patient p
LEFT JOIN Session s ON s.patientId = p.id
LEFT JOIN Note n ON n.sessionId = s.id
WHERE p.id = 'patient-id'
GROUP BY p.id;
```

## 🐛 Problemas Conhecidos

1. **PatientRecord UI desatualizado**
   - Componente ainda usa estrutura de mock
   - Precisa acessar `session.note.content.campo` ao invés de `session.campo`
   - Arrays tipados precisam de `any` cast temporário

2. **Campo `medicalHistory` removido**
   - Não existe mais no schema do Patient
   - Funcionalidade de "Resumir histórico" precisa usar apenas sessões

3. **Campos opcionais**
   - API retorna campos como `null` se não informados
   - Frontend precisa lidar com optional chaining (`?.`)

## 🔜 Próximos Passos

1. **Completar adaptação do PatientRecord.tsx**
   - Mapear todos os campos de `session.note.content`
   - Adicionar safe navigation para campos opcionais
   - Atualizar funções de export (PDF, TXT)

2. **Testar fluxo end-to-end**
   - Criar paciente teste
   - Gravar sessão real
   - Verificar nota no prontuário
   - Validar campos preenchidos pela IA

3. **Adicionar funcionalidades extras**
   - Editar nota diretamente no prontuário
   - Comparar evolução entre sessões
   - Gráficos de progresso (dor, ADM, força)
   - Export de prontuário completo em PDF

4. **Melhorias no prompt da IA**
   - Adicionar few-shot examples
   - Refinar sugestões de CIF codes
   - Melhorar protocolos baseados em evidências

## 📚 Arquivos Relacionados

- `prisma/schema.prisma` - Schema do banco de dados
- `src/app/api/patients/[id]/record/route.ts` - Endpoint novo
- `src/app/api/sessions/[id]/process/route.ts` - Processamento
- `src/server/note-generation.ts` - Prompt aprimorado da IA
- `src/components/patients/PatientRecord.tsx` - Componente (em adaptação)
- `src/components/session/SessionView.tsx` - Gravação e processamento
- `src/components/dashboard/SessionSummary_fullscreen.tsx` - Exibe nota gerada

## 💡 Insights Técnicos

1. **Prisma Relations funcionam perfeitamente**
   - `include: { sessions: { include: { note: true } } }` traz tudo aninhado
   - Performance aceitável mesmo com múltiplas sessões

2. **JSON parsing é seguro**
   - Try/catch impede crash se JSON estiver inválido
   - Permite evolução do schema sem migração

3. **Estrutura normalized é escalável**
   - Separar Patient, Session e Note permite queries eficientes
   - Fácil adicionar novos relacionamentos (ex: Attachments, Exams)

4. **TypeScript types protegem contra erros**
   - Interfaces garantem consistência entre API e Frontend
   - Compilador detecta campos ausentes/renomeados

---

**Documentação criada por**: GitHub Copilot  
**Baseado em**: Implementação real do PhysioNote.AI
