# Atualização do RETURN_SESSION_PROMPT v2.0

## 📋 Visão Geral

O `RETURN_SESSION_PROMPT` foi completamente reformulado para ter **conhecimento específico** sobre a estrutura da **Avaliação Inicial** e como usar essas informações para gerar notas de retorno mais ricas e contextualizadas.

## 🎯 Motivação da Atualização

### Problema Anterior (v1.0)
O prompt de retorno era genérico e não tinha instruções específicas sobre:
- Como usar os dados da avaliação inicial
- Quais campos buscar no histórico
- Como fazer comparações com o baseline inicial
- Como avaliar objetivos estabelecidos no início

**Resultado**: Notas de retorno com análises superficiais, sem conexão clara com o plano inicial.

### Solução Atual (v2.0)
Prompt especializado que:
- ✅ Conhece a estrutura completa da avaliação inicial
- ✅ Sabe quais campos buscar (anamnese, diagnosticoFisioterapeutico, planoTratamento)
- ✅ Tem instruções específicas de como usar cada campo
- ✅ Demonstra continuidade do cuidado através de comparações
- ✅ Avalia progresso em relação aos objetivos estabelecidos

## 🔑 Principais Adições

### 1. Seção: "ESTRUTURA DA AVALIAÇÃO INICIAL QUE VOCÊ DEVE CONHECER"

```typescript
ESTRUTURA DA AVALIAÇÃO INICIAL QUE VOCÊ DEVE CONHECER:
A nota de avaliação inicial contém os seguintes campos importantes que você deve buscar e usar:

{
  "resumoExecutivo": {
    "nivelDor": número de 0-10 (BASELINE PARA COMPARAÇÃO)
  },
  "anamnese": {
    "objetivos": "objetivos do paciente" (USE PARA AVALIAR SE ESTÃO SENDO ALCANÇADOS)
  },
  "diagnosticoFisioterapeutico": {
    "principal": "diagnóstico principal",
    "secundarios": ["diagnósticos secundários"],
    "cif": "código CIF" (MANTENHA CONSISTÊNCIA)
  },
  "planoTratamento": {
    "frequencia": "frequência planejada" (COMPARE COM ADERÊNCIA REAL),
    "duracaoPrevista": "duração estimada" (AVALIE SE ESTÁ NO PRAZO),
    "objetivosCurtoPrazo": ["objetivos 2-4 semanas"] (VERIFIQUE SE FORAM ALCANÇADOS),
    "objetivosLongoPrazo": ["objetivos finais"] (AVALIE PROGRESSO),
    "criteriosAlta": ["critérios para alta"] (USE PARA AVALIAR PROXIMIDADE DA ALTA)
  }
}
```

### 2. Seção: "COMO USAR OS DADOS DA AVALIAÇÃO INICIAL"

Instruções específicas para cada campo:

#### EVA/Dor Baseline
```
- Busque o "nivelDor" da avaliação inicial
- Compare com o nível atual
- Calcule percentual de melhora/piora
- Exemplo: "EVA inicial: 8, atual: 3 = melhora de 62.5%"
```

#### Objetivos do Paciente
```
- Busque em "anamnese.objetivos"
- Avalie se estão sendo alcançados
- Exemplo: "Objetivo 'retornar à corrida': ainda não iniciado, mas progredindo bem"
```

#### Objetivos de Curto Prazo
```
- Busque em "planoTratamento.objetivosCurtoPrazo"
- Verifique se foram alcançados no prazo
- Exemplo: "Objetivo 'Reduzir EVA para ≤5 em 2 semanas': ALCANÇADO (EVA atual: 3)"
```

#### Frequência Planejada vs Real
```
- Busque em "planoTratamento.frequencia"
- Compare com frequência real de comparecimento
- Exemplo: "Planejado: 3x/semana. Realizado: 8 sessões em 4 semanas (2x/semana) - abaixo do ideal"
```

#### Critérios de Alta
```
- Busque em "planoTratamento.criteriosAlta"
- Avalie quantos já foram alcançados
- Estime proximidade da alta
- Exemplo: "3 de 5 critérios de alta alcançados - provável alta em 2-3 sessões"
```

### 3. Nova Diretriz: "PROGRESSO EM RELAÇÃO AOS OBJETIVOS"

Seção crítica adicionada:

```typescript
4. PROGRESSO EM RELAÇÃO AOS OBJETIVOS (CRÍTICO):
   
   a) Objetivos de Curto Prazo (da avaliação inicial):
      - Liste cada objetivo de curto prazo estabelecido
      - Avalie status: "ALCANÇADO", "EM PROGRESSO", "NÃO ALCANÇADO"
      - Justifique status com dados mensuráveis
      - Exemplo: "Objetivo 'Reduzir EVA ≤5 em 2 semanas': 
        ALCANÇADO (EVA atual: 3, meta: 5)"
   
   b) Objetivos de Longo Prazo:
      - Avalie progresso percentual em direção aos objetivos finais
      - Estime tempo necessário para alcançar baseado na trajetória
      - Exemplo: "Objetivo 'Retorno à corrida': 60% alcançado - 
        caminhada normalizada, iniciar trote leve em 2 semanas"
   
   c) Objetivos do Paciente (motivação):
      - Relembre objetivos pessoais relatados na avaliação inicial
      - Avalie progresso e impacto na motivação
      - Exemplo: "Paciente relatou na avaliação inicial 'voltar a 
        brincar com netos' - objetivo parcialmente alcançado, 
        brinca sentado mas ainda não no chão"
```

### 4. Nova Diretriz: "AVALIAÇÃO DE CRITÉRIOS DE ALTA"

```typescript
6. AVALIAÇÃO DE CRITÉRIOS DE ALTA (IMPORTANTE):
   - Busque os critérios de alta estabelecidos na avaliação inicial
   - Avalie quantos já foram alcançados
   - Seja específico sobre cada critério
   - Estime proximidade da alta
   - Exemplo formato:
     "CRITÉRIOS DE ALTA (estabelecidos na avaliação inicial):
     ✅ 1. EVA ≤2 por 2 semanas consecutivas - ALCANÇADO
     ✅ 2. Função normalizada em AVDs - ALCANÇADO
     🔄 3. Força e resistência adequadas - EM PROGRESSO
     🔄 4. Retorno a atividades recreativas - EM PROGRESSO
     ✅ 5. Paciente independente em autocuidado - ALCANÇADO
     
     STATUS: 3 de 5 critérios alcançados. 
     Estimativa de alta: 2-3 sessões."
```

### 5. Seção: "EXEMPLOS PRÁTICOS REFERENCIANDO AVALIAÇÃO INICIAL"

Exemplos comparativos (Fraco vs Excelente) foram completamente reescritos:

#### Exemplo 1: Evolução Geral

❌ **Fraco** (sem contexto inicial):
```
"Paciente evoluindo bem"
```

✅ **Excelente** (com contexto da avaliação inicial):
```
"Paciente apresenta melhora progressiva de 62.5% na EVA (baseline 
avaliação inicial: 8 → atual: 3) em 4 semanas e 8 sessões. Na 
avaliação inicial, foram estabelecidos objetivos de curto prazo de 
'Reduzir EVA para ≤5 em 2 semanas' (ALCANÇADO na Sessão 4, EVA: 5) 
e 'Aumentar ADM lombar em 30%' (ALCANÇADO - ganho de 35% mensurado). 
Evolução é superior ao esperado para lombalgia crônica com duração 
prevista de 6-8 semanas - possível alta em 5 semanas."
```

#### Exemplo 2: Progressão de Exercícios

❌ **Fraco** (sem referência ao plano inicial):
```
"Exercícios foram progredidos"
```

✅ **Excelente** (com progressão desde início):
```
"Exercícios iniciados na avaliação inicial foram progredidos 
sistematicamente: Ponte isométrica 3x10s (Sessão 1) → Ponte 
dinâmica 3x15 (Sessão 3) → Ponte unipodal 3x8/lado (Sessão 6) 
→ Ponte unipodal com instabilidade 3x10/lado (Sessão 8 - atual). 
Progressão baseada em ganho de força de glúteos (avaliação 
inicial: 3/5 → atual: 4+/5) e ausência de compensações lombares. 
Meta do plano inicial era alcançar 4/5 em 4 semanas: SUPERADO."
```

#### Exemplo 3: Avaliação de Objetivos

❌ **Fraco** (sem avaliar objetivos):
```
"Paciente deve continuar exercícios"
```

✅ **Excelente** (avaliando objetivos da avaliação inicial):
```
"Na avaliação inicial, paciente estabeleceu como objetivo principal 
'voltar a brincar com netos no chão'. Análise de progresso: 
✅ ALCANÇADO - paciente relata que consegue brincar no chão por 
20min sem dor (objetivo alcançado 2 semanas antes do previsto). 
Segundo objetivo 'retornar à corrida recreacional': 🔄 EM PROGRESSO 
(70% alcançado - caminhada rápida normalizada, iniciar walk-jog na 
próxima sessão conforme progressão planejada)."
```

#### Exemplo 4: Aderência ao Plano

❌ **Fraco** (sem contexto de aderência):
```
"Paciente faltou em algumas sessões"
```

✅ **Excelente** (comparando com plano):
```
"Frequência planejada na avaliação inicial: 3x/semana por 2 semanas, 
depois 2x/semana. Frequência REAL: 8 sessões em 4 semanas 
(2x/semana desde início) - 33% abaixo do ideal. Apesar disso, 
melhora de 62.5% na EVA demonstra excelente resposta por sessão. 
Aderência aos exercícios domiciliares tem sido o principal fator 
compensatório (paciente relata realizar 6x/semana, 15min/dia). 
Recomenda-se manter 2x/semana dado bom resultado com menor frequência."
```

#### Exemplo 5: Critérios de Alta

❌ **Fraco** (sem avaliar critérios):
```
"Paciente próximo da alta"
```

✅ **Excelente** (avaliando cada critério estabelecido):
```
"AVALIAÇÃO DE CRITÉRIOS DE ALTA (estabelecidos na avaliação inicial):
1. ✅ EVA ≤2 por 2 semanas consecutivas: ALCANÇADO
2. ✅ Função normalizada em AVDs: ALCANÇADO
3. 🔄 Força e resistência adequadas: EM PROGRESSO (força 4+/5, 
   resistência prancha 45s - meta: 5/5 e 60s)
4. 🔄 Retorno a atividades recreativas sem dor: EM PROGRESSO 
   (caminhada ok, corrida ainda não testada)
5. ✅ Paciente independente em autocuidado: ALCANÇADO

STATUS GERAL: 3 de 5 critérios plenamente alcançados, 2 em 
progresso avançado (80-90%). Estimativa de alta: 2-3 sessões 
(dentro da duração prevista de 6-8 semanas na avaliação inicial)."
```

### 6. Seção: "COMO LOCALIZAR INFORMAÇÕES DA AVALIAÇÃO INICIAL NO HISTÓRICO"

Instruções práticas de como o modelo deve procurar a avaliação inicial:

```
Para identificar a avaliação inicial:
1. Procure pela sessão com tipo "Avaliação inicial" ou a primeira do histórico
2. Se a nota dessa sessão contiver campos como "anamnese", 
   "diagnosticoFisioterapeutico", "planoTratamento" → É a avaliação inicial
3. Use o conteúdo dessa nota como REFERÊNCIA PRINCIPAL para todas as comparações

PRIORIZE SEMPRE:
1. Comparar EVA atual com EVA da SESSÃO 1 (avaliação inicial)
2. Avaliar progresso em relação aos OBJETIVOS estabelecidos na SESSÃO 1
3. Verificar aderência à FREQUÊNCIA planejada na SESSÃO 1
4. Checar status dos CRITÉRIOS DE ALTA definidos na SESSÃO 1
5. Comparar DURAÇÃO PREVISTA na SESSÃO 1 com tempo real decorrido
```

### 7. Tom e Linguagem Atualizados

```typescript
9. LINGUAGEM E TOM (ANALÍTICO E COMPARATIVO):
   - Use terminologia técnica fisioterapêutica
   - Seja analítico e baseado em evidências observadas
   - SEMPRE faça comparações com a avaliação inicial quando relevante
   - Demonstre raciocínio clínico e tomada de decisão
   - Conecte causa e efeito entre intervenções e resultados
   - Use linguagem que demonstre continuidade do tratamento
   - Exemplo de tom: "Desde a avaliação inicial há 4 semanas...", 
     "Comparado ao baseline...", "Em relação ao objetivo estabelecido 
     inicialmente..."
```

## 📊 Comparação: Versão 1.0 vs 2.0

| Aspecto | v1.0 (Original) | v2.0 (Atualizado) |
|---------|----------------|-------------------|
| **Conhecimento da estrutura inicial** | ❌ Não tinha | ✅ Conhece todos os campos da avaliação inicial |
| **Instruções de uso** | ❌ Genéricas | ✅ Específicas para cada campo |
| **Comparações** | ⚠️ Superficiais | ✅ Profundas e quantificadas |
| **Avaliação de objetivos** | ❌ Não mencionado | ✅ Seção dedicada com formato específico |
| **Critérios de alta** | ❌ Não avaliava | ✅ Avalia cada critério com status |
| **Exemplos práticos** | ⚠️ Genéricos | ✅ Todos referenciam avaliação inicial |
| **Continuidade do cuidado** | ⚠️ Implícita | ✅ Explícita em toda nota |
| **Linguagem** | ⚠️ Analítica | ✅ Analítica + Comparativa + Contextual |
| **Progressão de exercícios** | ⚠️ Simples | ✅ Trajetória completa desde início |
| **Aderência ao plano** | ⚠️ Mencionada | ✅ Comparada com frequência planejada |

## 🎯 Impacto Esperado

### Antes (v1.0)
```json
{
  "resumoExecutivo": {
    "evolucaoGeral": "Paciente com boa evolução nas últimas sessões"
  },
  "analiseComparativa": {
    "progressoDor": {
      "sessaoAnterior": 4,
      "atual": 3,
      "tendencia": "melhora"
    }
  }
}
```

### Depois (v2.0)
```json
{
  "resumoExecutivo": {
    "evolucaoGeral": "Paciente apresenta melhora de 62.5% na EVA (baseline avaliação inicial: 8 → atual: 3) em 4 semanas e 8 sessões. Dos 4 objetivos de curto prazo estabelecidos na avaliação inicial, 3 foram ALCANÇADOS (75%). Evolução é superior ao esperado - duração prevista era 6-8 semanas, possível alta em 5 semanas. Frequência real (2x/semana) foi 33% abaixo da planejada (3x/semana), mas resultado compensado por excelente aderência aos exercícios domiciliares."
  },
  "analiseComparativa": {
    "progressoDor": {
      "sessaoAnterior": 4,
      "atual": 3,
      "tendencia": "melhora",
      "observacoes": "Redução progressiva e consistente desde baseline (EVA 8 na Sessão 1). Trajetória: S1: 8 → S2: 7 → S4: 5 (objetivo curto prazo 'EVA ≤5' ALCANÇADO) → S6: 4 → S8: 3 (atual). Sem flutuações significativas ou exacerbações. Melhora de 1-1.5 pontos a cada 2 sessões é consistente e previsível."
    }
  },
  "insightsClinicas": {
    "recomendacoesAjuste": [
      "Objetivos de longo prazo da avaliação inicial incluíam 'retorno à corrida' - paciente está 70% do caminho (caminhada normalizada). Recomenda-se iniciar protocolo walk-jog na próxima sessão conforme progressão planejada.",
      "Critério de alta 'EVA ≤2 por 2 semanas' será atingido se EVA se mantiver em 2-3 nas próximas 2 sessões. Monitorar de perto.",
      "Frequência pode ser reduzida para 1x/semana (transição para alta) considerando que objetivo 'paciente independente em autocuidado' já foi alcançado."
    ]
  }
}
```

## 🔧 Implementação

### Uso Automático
O sistema já está configurado para usar este prompt automaticamente quando detectar que é uma sessão de retorno (quando `previousSessions.length > 0`):

```typescript
const { note } = await generateReturnNoteFromTranscription({
  transcription: "Transcrição da sessão...",
  patientName: "João Silva",
  sessionDate: new Date(),
  previousSessions: [
    {
      date: new Date('2025-09-17'),
      sessionType: 'Avaliação inicial',
      mainComplaint: 'Lombalgia há 3 meses',
      painLevel: 8,
      noteContent: JSON.stringify(initialEvaluationNote) // Nota completa
    },
    // ... outras sessões
  ]
});
```

### Formato do Histórico
O histórico é formatado automaticamente para o modelo:

```
=== HISTÓRICO DE SESSÕES ANTERIORES ===

SESSÃO 1 (17/09/2025):
- Tipo: Avaliação inicial
- Queixa Principal: Lombalgia há 3 meses
- Nível de Dor (EVA): 8
- Evolução: Não registrada
- Intervenções: Mobilização articular, Exercícios de core
- Observações: {"resumoExecutivo":{...},"anamnese":{...},"planoTratamento":{...}}

SESSÃO 2 (20/09/2025):
- Tipo: Retorno
- Queixa Principal: Lombalgia persistente
- Nível de Dor (EVA): 7
- Evolução: Leve melhora após primeira sessão
...
```

## 📈 Métricas de Sucesso

### Indicadores de Qualidade da Nota v2.0

✅ **Comparações Quantificadas**: EVA baseline → atual com % de melhora
✅ **Objetivos Referenciados**: Todos os objetivos da avaliação inicial mencionados
✅ **Status de Objetivos**: "ALCANÇADO", "EM PROGRESSO", "NÃO ALCANÇADO" para cada
✅ **Critérios de Alta Avaliados**: Checklist completo com status
✅ **Aderência Comparada**: Frequência real vs planejada com %
✅ **Progressão de Exercícios**: Trajetória completa desde Sessão 1
✅ **Duração vs Previsto**: Comparação de prazo
✅ **Continuidade Demonstrada**: Linguagem conecta todas as sessões
✅ **Insights Contextualizados**: Referências específicas à avaliação inicial

## 🚀 Benefícios Clínicos

1. **Continuidade do Cuidado**: Cada nota demonstra conhecimento de todo o histórico
2. **Tomada de Decisão Fundamentada**: Ajustes baseados em comparação com plano original
3. **Transparência**: Paciente vê progresso claro em relação aos objetivos dele
4. **Accountability**: Fisioterapeuta avalia se plano inicial foi efetivo
5. **Otimização**: Identifica desvios do plano e ajusta proativamente
6. **Previsibilidade**: Estimativas de alta baseadas em trajetória real
7. **Motivação**: Objetivos alcançados são explicitamente reconhecidos
8. **Documentação Legal**: Demonstra raciocínio clínico evolutivo

## 📝 Changelog

### v2.0 (2025-10-15)
- ✅ Adicionada seção "ESTRUTURA DA AVALIAÇÃO INICIAL"
- ✅ Adicionada seção "COMO USAR OS DADOS DA AVALIAÇÃO INICIAL"
- ✅ Nova diretriz "PROGRESSO EM RELAÇÃO AOS OBJETIVOS"
- ✅ Nova diretriz "AVALIAÇÃO DE CRITÉRIOS DE ALTA"
- ✅ Reescritos todos os exemplos para referenciar avaliação inicial
- ✅ Adicionada seção "COMO LOCALIZAR INFORMAÇÕES NO HISTÓRICO"
- ✅ Atualizado tom de linguagem para ser comparativo e contextual
- ✅ Adicionadas instruções de priorização (5 pontos principais)
- ✅ Expandido RETURN_SESSION_PROMPT de ~3000 para ~5500 tokens

### v1.0 (2025-10-15 - original)
- ✅ Prompt genérico para sessão de retorno
- ✅ Análise comparativa básica
- ✅ Insights clínicos sem contexto inicial
- ✅ Exemplos simples

---

**Sistema PhysioNote.AI** | Documentação Inteligente com Continuidade do Cuidado
