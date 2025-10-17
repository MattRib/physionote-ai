# Fluxo de Sessões - PhysioNotes.AI

## Problema Identificado

O sistema estava criando **2 sessões duplicadas** no prontuário do paciente porque:

1. **`NewSessionFlow.tsx`** chamava `/api/sessions` (POST) → criava sessão com status `'recording'`
2. **`SessionView.tsx`** processava o áudio com `/api/sessions/process-temp` (correto)
3. Quando o usuário clicava em **Salvar**, `handleSaveSession` chamava `/api/sessions/save` → criava **OUTRA** sessão com status `'completed'`

**Resultado:** 2 sessões no banco de dados para o mesmo atendimento.

---

## Solução Implementada

### Fluxo Correto para Gravação ao Vivo (Live Recording)

```
1. Usuário seleciona paciente no NewSessionFlow
   ↓
2. NewSessionFlow redireciona para SessionView (SEM criar sessão no banco)
   - Passa apenas: patientId, patientName via URL params
   ↓
3. SessionView inicia gravação de áudio
   ↓
4. Usuário clica em "Parar Gravação"
   ↓
5. SessionView processa áudio com /api/sessions/process-temp
   - Transcreve áudio
   - Gera nota com IA
   - NÃO salva no banco
   ↓
6. Usuário revisa a nota gerada
   ↓
7. Usuário clica em "Salvar Sessão"
   ↓
8. SessionView chama /api/sessions/save (ÚNICA criação no banco)
   - Cria sessão com status 'completed'
   - Salva áudio, transcrição e nota
   - Sessão aparece no prontuário
```

### Fluxo para Upload de Áudio

```
1. Usuário seleciona paciente e faz upload de arquivo
   ↓
2. NewSessionFlow cria sessão temporária via /api/sessions
   - Status: 'processing'
   ↓
3. Sistema processa áudio em background
   ↓
4. Usuário revisa nota gerada
   ↓
5. Usuário clica em "Salvar"
   ↓
6. Sistema atualiza sessão existente ou cria nova com status 'completed'
```

---

## Rotas da API

### `/api/sessions/save` (POST)
- **Propósito:** Criar sessão completa no prontuário
- **Status:** `completed`
- **Quando usar:** Quando o usuário clica em "Salvar Sessão" após revisar a nota
- **⚠️ Esta é a ÚNICA rota que deve criar sessões visíveis no prontuário**

### `/api/sessions/process-temp` (POST)
- **Propósito:** Processar áudio temporariamente SEM salvar no banco
- **Quando usar:** Durante gravação ao vivo, para gerar transcrição e nota
- **NÃO cria sessão no banco**

### `/api/sessions` (POST)
- **Propósito:** Criar sessão temporária para upload de áudio
- **Status:** `recording` ou `processing`
- **Quando usar:** Apenas para modo upload de áudio
- **⚠️ NÃO usar para gravação ao vivo**

---

## Arquivos Modificados

1. **`src/components/dashboard/NewSessionFlow.tsx`**
   - Removida chamada para `/api/sessions` no modo 'live recording'
   - Agora apenas redireciona para SessionView com dados do paciente

2. **`src/app/api/sessions/route.ts`**
   - Adicionada documentação clara sobre quando usar esta rota

3. **`src/components/session/SessionView.tsx`**
   - Comentários reforçando que a sessão é criada apenas ao salvar

---

## Verificação

Para confirmar que o problema foi resolvido:

1. Inicie uma nova sessão (gravação ao vivo)
2. Grave alguns segundos de áudio
3. Pare a gravação e aguarde o processamento
4. Revise a nota gerada
5. Clique em "Salvar Sessão"
6. Verifique o prontuário do paciente
7. **Deve haver apenas 1 sessão criada**

---

## Prevenção de Duplicação

✅ **Fazer:**
- Usar `/api/sessions/save` para criar sessões no prontuário
- Usar `/api/sessions/process-temp` para processar áudio sem salvar
- Criar sessão apenas quando o usuário confirmar salvamento

❌ **Não fazer:**
- Criar sessão antes do usuário revisar a nota
- Chamar `/api/sessions` no modo live recording
- Criar múltiplas sessões para o mesmo atendimento

---

**Data da correção:** 2025-01-17
**Desenvolvedor:** Cascade AI
