# Funcionalidade de Resumo do Histórico do Paciente

## Visão Geral

Esta funcionalidade permite gerar, visualizar, fixar e gerenciar resumos clínicos automatizados do histórico completo de um paciente usando OpenAI. O resumo analisa todas as sessões completadas e cria uma síntese profissional do tratamento.

## Arquitetura

### Modelo de Dados

**Tabela: `HistorySummary`**

```prisma
model HistorySummary {
  id          String   @id @default(cuid())
  patientId   String   @unique
  content     String   // Texto do resumo gerado pela IA
  aiModel     String   // Modelo usado (ex: "gpt-4o")
  isPinned    Boolean  @default(false)
  sessionsIds String   // IDs das sessões incluídas (JSON array)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  patient     Patient  @relation(fields: [patientId], references: [id])
}
```

**Relação com Patient:**
```prisma
model Patient {
  // ... campos existentes
  historySummary  HistorySummary?
}
```

### API Endpoints

**Endpoint:** `/api/patients/[id]/history-summary`

#### GET - Buscar resumo existente
```typescript
GET /api/patients/{patientId}/history-summary

Response 200:
{
  "summary": {
    "id": "clxxx...",
    "content": "## 🎯 SÍNTESE CLÍNICA\n...",
    "isPinned": false,
    "sessionsIds": ["session1", "session2"],
    "aiModel": "gpt-4o",
    "createdAt": "2025-10-15T...",
    "updatedAt": "2025-10-15T..."
  }
}

Response 200 (sem resumo):
{
  "summary": null
}
```

#### POST - Gerar novo resumo ou substituir existente
```typescript
POST /api/patients/{patientId}/history-summary

Response 200:
{
  "success": true,
  "summary": { /* objeto HistorySummary */ }
}

Response 400 (sem sessões):
{
  "error": "Paciente não possui sessões com notas para resumir"
}

Response 404 (paciente não encontrado):
{
  "error": "Paciente não encontrado"
}
```

**Processo de geração:**

1. Busca paciente e todas as sessões completadas com notas
2. Extrai dados clinicamente relevantes de cada sessão:
   - Data e tipo da sessão
   - Queixa principal e nível de dor
   - Diagnóstico fisioterapêutico
   - Intervenções aplicadas (técnicas manuais, exercícios)
   - Resposta ao tratamento
   - Objetivos do plano terapêutico

3. Cria prompt estruturado para OpenAI com formato:
   ```
   📅 SESSÃO 1 - 01/10/2025
   Tipo: Avaliação Inicial
   🎯 Queixa: Dor lombar
   📊 Dor: 8/10
   🔍 Diagnóstico: Lombalgia mecânica
   ✋ Técnicas: Mobilização articular, Liberação miofascial
   📈 Resposta: Redução de 40% na dor
   ---
   ```

4. Envia para OpenAI com instruções para gerar resumo estruturado em Markdown
5. Salva resumo no banco (ou atualiza se já existir)

#### PATCH - Fixar/Desfixar resumo
```typescript
PATCH /api/patients/{patientId}/history-summary
Content-Type: application/json

Body:
{
  "isPinned": true
}

Response 200:
{
  "success": true,
  "summary": { /* objeto HistorySummary atualizado */ }
}
```

#### DELETE - Remover resumo
```typescript
DELETE /api/patients/{patientId}/history-summary

Response 200:
{
  "success": true,
  "message": "Resumo removido com sucesso"
}
```

## Componente Frontend

**Arquivo:** `src/components/patients/PatientRecord.tsx`

### Estados Adicionados

```typescript
const [historySummary, setHistorySummary] = useState<HistorySummary | null>(null);
const [summarizingHistory, setSummarizingHistory] = useState(false);
const [alertModal, setAlertModal] = useState<AlertModalState>({...});
```

### Interface TypeScript

```typescript
interface HistorySummary {
  id: string;
  content: string;
  isPinned: boolean;
  sessionsIds: string[];
  aiModel: string;
  createdAt: string;
  updatedAt: string;
}
```

### Funções Principais

#### `handleSummarizeHistory()`
- Verifica se já existe resumo
- Se existir, exibe modal de confirmação para substituir
- Se não existir, gera novo resumo diretamente

#### `generateNewSummary()`
- Chama API POST para gerar resumo
- Atualiza estado com novo resumo
- Exibe toast de sucesso/erro

#### `handleTogglePin()`
- Alterna entre fixado/desfixado via PATCH
- Atualiza estado local
- Exibe feedback visual

#### `handleDeleteSummary()`
- Exibe modal de confirmação
- Chama API DELETE
- Remove resumo do estado
- Exibe toast de confirmação

## Interface do Usuário

### Botão no Header

**Estados do botão:**
1. **Sem resumo:** 
   - Ícone: Sparkles
   - Texto: "Resumir histórico"

2. **Com resumo:**
   - Ícone: RefreshCw
   - Texto: "Atualizar resumo"

3. **Gerando:**
   - Ícone: Spinner animado
   - Texto: "Gerando resumo..."
   - Estado: disabled

### Card de Resumo (no Patient Info)

Aparece quando `historySummary` existe, abaixo das informações do paciente.

**Elementos:**
- **Header:**
  - Título: "Resumo Clínico do Histórico"
  - Badge "Fixado" (se isPinned)
  - Badge "Gerado por IA" com ícone Sparkles
  - Botões:
    - Fixar/Desfixar (Pin/PinOff)
    - Excluir (Trash2)

- **Conteúdo:**
  - Renderização do Markdown com formatação HTML
  - Background gradiente: `from-[#F5F3FF] to-white`
  - Border: `border-[#DDD6FE]`
  - Shadow: `shadow-[0_16px_35px_-24px_rgba(109,40,217,0.45)]`

- **Footer:**
  - Quantidade de sessões incluídas
  - Data da última atualização

### Card Fixado (no topo do histórico)

Quando `historySummary.isPinned === true`, um card especial aparece antes da lista de sessões.

**Características:**
- Border dourada: `border-[#FEF3C7]`
- Background gradiente: `from-[#FFFBEB] to-white`
- Ícone de Pin em destaque
- Título: "Resumo Fixado"
- Formato compacto para fácil referência

### Modais

1. **Substituir Resumo (Warning):**
   - Título: "Substituir resumo existente?"
   - Mensagem: "Já existe um resumo do histórico. Deseja gerar um novo resumo com base nas sessões atualizadas? Esta ação não pode ser desfeita."
   - Botões: "Sim, gerar novo resumo" / "Cancelar"

2. **Excluir Resumo (Warning):**
   - Título: "Excluir resumo?"
   - Mensagem: "Tem certeza que deseja excluir o resumo do histórico? Esta ação não pode ser desfeita."
   - Botões: "Sim, excluir" / "Cancelar"

3. **Erro ao Gerar (Error):**
   - Título: "Erro ao gerar resumo"
   - Mensagem: Detalhe do erro retornado pela API

## Prompt para OpenAI

### System Message
```
Você é um fisioterapeuta experiente especializado em análise de prontuários 
e síntese clínica. Sua função é criar resumos profissionais, concisos e 
clinicamente relevantes.
```

### User Prompt Structure

```markdown
**PACIENTE:** [Nome]
**TOTAL DE SESSÕES:** [N]
**PERÍODO:** [Data inicial] a [Data final]

═══════════════════════════════════════════════════════
HISTÓRICO DE SESSÕES
═══════════════════════════════════════════════════════

[Dados formatados de cada sessão]

═══════════════════════════════════════════════════════

**INSTRUÇÕES PARA O RESUMO:**

## 🎯 SÍNTESE CLÍNICA
- Quadro clínico inicial e evolução
- Diagnóstico fisioterapêutico principal
- Condições secundárias relevantes

## 📊 EVOLUÇÃO DO TRATAMENTO
- Progresso observado ao longo das sessões
- Mudanças nos níveis de dor e funcionalidade
- Marcos importantes alcançados

## 💊 INTERVENÇÕES APLICADAS
- Técnicas manuais mais utilizadas
- Exercícios terapêuticos prescritos
- Recursos complementares

## 📈 RESULTADOS ALCANÇADOS
- Melhoras objetivas e subjetivas
- Feedback do paciente
- Capacidades funcionais recuperadas

## 🎯 RECOMENDAÇÕES
- Continuidade do tratamento
- Exercícios domiciliares
- Precauções e orientações

**IMPORTANTE:**
- Use linguagem técnica mas clara
- Seja objetivo e direto
- Destaque informações clinicamente relevantes
- Mantenha a formatação Markdown com emojis
- Máximo de 800 palavras
```

### Parâmetros da API

```typescript
{
  model: "gpt-4o",
  messages: [systemMessage, userPrompt],
  temperature: 0.7,
  max_tokens: 2000
}
```

## Regras de Negócio

1. **Geração de Resumo:**
   - Apenas pacientes com sessões completadas podem ter resumos
   - Apenas sessões com status "completed" e nota gerada são incluídas
   - Sessões são ordenadas por data (ascendente) para análise cronológica

2. **Atualização:**
   - Ao gerar novo resumo, o anterior é substituído (não versionado)
   - A lista de `sessionsIds` é atualizada com as sessões atuais
   - O campo `updatedAt` reflete a última geração

3. **Fixação:**
   - Apenas um resumo pode ser fixado por paciente
   - Resumo fixado aparece em destaque no topo do histórico
   - Fixação é persistida no banco de dados

4. **Exclusão:**
   - Exclusão do resumo não afeta as sessões
   - Paciente pode gerar novo resumo a qualquer momento
   - Modal de confirmação obrigatório antes de excluir

## Fluxo de Dados

```
┌─────────────────┐
│  PatientRecord  │
│   Component     │
└────────┬────────┘
         │
         ├──(mount)──> GET /api/patients/[id]/history-summary
         │                        │
         │                        ├──> prisma.historySummary.findUnique()
         │                        │
         │              ┌─────────▼─────────┐
         │              │  setHistorySummary│
         │              └───────────────────┘
         │
         ├──(click "Resumir")──> handleSummarizeHistory()
         │                               │
         │                 ┌─────────────▼──────────────┐
         │                 │ historySummary exists?     │
         │                 └─────────┬──────────────────┘
         │                           │
         │                    ┌──────┴──────┐
         │                    │             │
         │                   YES            NO
         │                    │             │
         │         ┌──────────▼─┐    ┌─────▼──────┐
         │         │ Show modal │    │  Generate  │
         │         │  confirm   │    │    new     │
         │         └──────┬─────┘    └─────┬──────┘
         │                │                 │
         │         (confirm)                │
         │                │                 │
         │         ┌──────▼─────────────────▼──┐
         │         │  generateNewSummary()     │
         │         └──────────┬────────────────┘
         │                    │
         │         POST /api/patients/[id]/history-summary
         │                    │
         │         1. Fetch patient + sessions
         │         2. Extract clinical data
         │         3. Build prompt
         │         4. Call OpenAI
         │         5. Save to DB (create or update)
         │                    │
         │         ┌──────────▼─────────────┐
         │         │  Update frontend state │
         │         └────────────────────────┘
         │
         ├──(click "Fixar")──> handleTogglePin()
         │                            │
         │              PATCH /api/patients/[id]/history-summary
         │                    { isPinned: !current }
         │                            │
         │              ┌─────────────▼─────────────┐
         │              │ Update state + show toast │
         │              └───────────────────────────┘
         │
         └──(click "Excluir")──> handleDeleteSummary()
                                       │
                        ┌──────────────▼──────────────┐
                        │  Show confirmation modal    │
                        └──────────┬──────────────────┘
                                   │
                            (user confirms)
                                   │
                     DELETE /api/patients/[id]/history-summary
                                   │
                        ┌──────────▼─────────────┐
                        │ setHistorySummary(null)│
                        └────────────────────────┘
```

## Estilização

### Cores e Gradientes

- **Primary Purple:** `#4F46E5` a `#6366F1`
- **Light Purple:** `#F5F3FF` (background)
- **Border Purple:** `#DDD6FE`
- **Text Purple:** `#4338CA`, `#6D28D9`
- **Pin Yellow:** `#FEF3C7` (background), `#92400E` (text)
- **Success Green:** Toast de confirmação
- **Error Red:** Border e texto de botão excluir

### Sombras

```css
shadow-[0_16px_35px_-24px_rgba(109,40,217,0.45)] /* Resumo principal */
shadow-[0_28px_65px_-46px_rgba(146,64,14,0.35)] /* Card fixado */
```

### Animações

- Fade-in ao carregar resumo
- Hover lift nos botões (`hover:-translate-y-0.5`)
- Spinner animado durante geração
- Transições suaves em borders e backgrounds

## Segurança e Performance

1. **API Rate Limiting:**
   - Considerar limitar chamadas para OpenAI (futuro)
   - Cache de resumos no cliente

2. **Validação:**
   - Backend valida existência do paciente
   - Verifica se há sessões antes de gerar
   - TypeScript strict mode em toda aplicação

3. **Otimização:**
   - Fetch paralelo (record + summary) no useEffect
   - Uso de `Promise.all` para queries múltiplas
   - Include otimizado no Prisma (apenas campos necessários)

4. **Tratamento de Erros:**
   - Try/catch em todas as funções async
   - Mensagens de erro específicas para o usuário
   - Logs detalhados no console para debug

## Melhorias Futuras

1. **Versionamento:**
   - Manter histórico de resumos anteriores
   - Comparar versões lado a lado

2. **Customização:**
   - Permitir edição manual do resumo
   - Selecionar quais sessões incluir

3. **Exportação:**
   - Incluir resumo no PDF do prontuário
   - Exportar apenas o resumo

4. **Compartilhamento:**
   - Gerar link público temporário
   - Enviar por email ao paciente

5. **Analytics:**
   - Rastrear uso da feature
   - Feedback sobre qualidade dos resumos

## Testes Sugeridos

1. **Unitários:**
   - Formatação de dados das sessões
   - Parsing de conteúdo Markdown
   - Validação de estados

2. **Integração:**
   - Geração de resumo com 1, 5, 20 sessões
   - Substituição de resumo existente
   - Fixar/desfixar/excluir fluxos completos

3. **E2E:**
   - Usuário abre prontuário → clica resumir → vê resumo
   - Fixar resumo → navegar até histórico → verificar card fixado
   - Excluir resumo → confirmar remoção → verificar ausência

## Migration

**Arquivo:** `prisma/migrations/20251015_add_history_summary/migration.sql`

```sql
-- CreateTable
CREATE TABLE "HistorySummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "aiModel" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "sessionsIds" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HistorySummary_patientId_fkey" 
      FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") 
      ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "HistorySummary_patientId_key" 
  ON "HistorySummary"("patientId");
```

## Arquivos Criados/Modificados

### Novos Arquivos
- `src/app/api/patients/[id]/history-summary/route.ts` (310 linhas)
- `prisma/migrations/20251015_add_history_summary/migration.sql`
- `docs/HISTORY_SUMMARY_FEATURE.md` (este arquivo)

### Arquivos Modificados
- `prisma/schema.prisma` - Adicionado modelo `HistorySummary` e relação com `Patient`
- `src/components/patients/PatientRecord.tsx` - Adicionado UI e lógica para resumos

### Dependências
- Nenhuma nova dependência necessária
- Usa OpenAI SDK já instalado
- Usa AlertModal existente
- Usa Prisma ORM já configurado

---

**Autor:** PhysioNotes.AI Development Team  
**Data:** 15/10/2025  
**Versão:** 1.0.0
