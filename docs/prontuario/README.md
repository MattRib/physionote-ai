# 📋 Prontuário - Documentação

Esta pasta contém toda a documentação relacionada ao módulo de Prontuário Eletrônico do PhysioNote.AI.

## 📄 Documentação Principal

### ⭐ modulo-prontuario.md (1,189 linhas)
**Documentação completa e atualizada do módulo Prontuário.**

Cobre tudo sobre o prontuário eletrônico:
- Componente `PatientRecord.tsx` (1,311 linhas de código)
- 13 seções estruturadas de notas clínicas
- Resumo do histórico com IA (GPT-4o)
- 5 APIs completas (GET, POST, PATCH, DELETE)
- Exportação em PDF (individual e completo)
- Pin/Edit/Delete de resumos
- Design System v2
- Testes e melhorias futuras

### comparacao-tipos-notas.md
Comparação conceitual entre diferentes tipos de notas clínicas:
- SOAP (Subjetivo, Objetivo, Avaliação, Plano)
- Narrativa (formato livre)
- Resumo IA (gerado automaticamente)

### integracao-notas-prontuario.md
Fluxo de integração das notas das sessões ao prontuário do paciente:
- Session → Note → PatientRecord
- API `/api/patients/[id]/record`
- Parseamento de JSON

## 🎯 Objetivo

Manter um registro completo e organizado do histórico de atendimentos de cada paciente, facilitando o acompanhamento da evolução e tomada de decisões clínicas.

## � Arquivos Obsoletos (Movidos para `archive/`)

Os seguintes arquivos foram substituídos por `modulo-prontuario.md`:

- **prontuario-v2.md** (424 linhas) - Substituído pela documentação consolidada
  - Motivo: Status desatualizado ("awaits PDF library" → código tem jsPDF implementado)
  
- **funcionalidade-prontuario.md** (256 linhas) - Versão V1 obsoleta
  - Motivo: Código atual é V2 com visualização inline
  
- **funcionalidade-visualizacao-notas.md** (378 linhas) - Modal substituído
  - Motivo: Implementação mudou de modal para visualização inline
  
- **funcionalidade-resumo-historico.md** (443 linhas) - 100% coberto
  - Motivo: Totalmente documentado em `modulo-prontuario.md`

**Total arquivado:** 1,501 linhas de documentação duplicada

## �📊 Tipos de Notas

- **SOAP** - Subjetivo, Objetivo, Avaliação, Plano
- **Narrativa** - Formato livre de documentação
- **Resumo IA** - Resumo gerado automaticamente

## 🔗 Módulos Relacionados

- [Sessões](../sessoes/) - Origem das notas
- [Pacientes](../pacientes/) - Dono do prontuário
- [Áudio](../audio/) - Fonte dos dados transcritos

---
[← Voltar para Documentação](../README.md)
