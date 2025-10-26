# 🔄 Guia de Migração da Documentação

Este documento registra a reorganização da documentação do PhysioNote.AI realizada em 26 de outubro de 2025.

## 🎯 Objetivos da Reorganização

1. ✅ **Tradução para PT-BR**: Todos os nomes de arquivos agora estão em português brasileiro
2. ✅ **Organização por Módulos**: Documentos agrupados por componente/funcionalidade
3. ✅ **Facilitar Navegação**: Estrutura hierárquica clara com READMEs em cada pasta
4. ✅ **Manutenibilidade**: Facilitar adição e localização de novos documentos

## 📊 Antes e Depois

### Antes
```
docs/
├── ANIMATIONS.md
├── AUDIO_PROCESSING_API.md
├── AUDIO_UPLOAD_FEATURE.md
├── BACKEND_IMPLEMENTATION_SUMMARY.md
├── BUGFIX_AI_NOTE_IN_SUMMARY.md
├── BUGFIX_DROPDOWN_OVERLAP.md
├── ... (50+ arquivos na raiz)
└── README.md
```

### Depois
```
docs/
├── README.md (atualizado)
├── INDICE.md (novo)
├── animacoes/
│   ├── README.md
│   └── ... (7 arquivos)
├── dashboard/
│   ├── README.md
│   └── ... (4 arquivos)
├── sessoes/
│   ├── README.md
│   └── ... (9 arquivos)
├── ... (12 pastas no total)
```

## 🗺️ Mapa de Migração

### Dashboard
```
DASHBOARD_DOCUMENTATION.md       → dashboard/documentacao-dashboard-v1.md
DASHBOARD_V2_CARDS.md           → dashboard/cards-dashboard-v2.md
DASHBOARD_V2_CHANGELOG.md       → dashboard/changelog-v1-para-v2.md
DASHBOARD_REAL_DATA_INTEGRATION.md → dashboard/integracao-dados-reais.md
```

### Animações
```
ANIMATIONS.md                   → animacoes/visao-geral-animacoes.md
HERO_ANIMATIONS.md             → animacoes/animacoes-hero.md
HEADER_ANIMATIONS.md           → animacoes/animacoes-header.md
FEATURES_HOVER_ANIMATIONS.md   → animacoes/animacoes-hover-features.md
BUTTON_GRADIENT_ANIMATION.md   → animacoes/animacao-gradiente-botao.md
SESSION_ANIMATIONS.md          → animacoes/animacoes-sessao.md
LOTTIE_RECORDING_ANIMATION.md  → animacoes/animacao-lottie-gravacao.md
```

### Sessões
```
SESSIONS_API.md                        → sessoes/api-sessoes.md
SESSIONS_PAGE_REDESIGN.md             → sessoes/redesign-pagina-sessoes.md
SESSION_MODULE.md                      → sessoes/modulo-sessoes.md
SESSION_NOTE_INTEGRATION.md           → sessoes/integracao-notas-sessao.md
SESSION_RECORDING_UX_IMPROVEMENTS.md  → sessoes/melhorias-ux-gravacao.md
SESSION_TYPE_SPECIALTY_DISPLAY.md     → sessoes/exibicao-tipo-especialidade.md
FLUXO_SESSOES.md                      → sessoes/fluxo-sessoes.md
RETURN_SESSION_NOTES.md               → sessoes/retorno-notas-sessao.md
RETURN_SESSION_PROMPT_V2.md           → sessoes/prompt-retorno-v2.md
```

### Pacientes
```
PATIENTS_MODULE.md → pacientes/modulo-pacientes.md
```

### Prontuário
```
PATIENT_RECORD_FEATURE.md          → prontuario/funcionalidade-prontuario.md
PATIENT_RECORD_V2.md               → prontuario/prontuario-v2.md
NOTE_PATIENT_RECORD_INTEGRATION.md → prontuario/integracao-notas-prontuario.md
NOTE_TYPES_COMPARISON.md           → prontuario/comparacao-tipos-notas.md
NOTE_VIEW_FEATURE.md               → prontuario/funcionalidade-visualizacao-notas.md
HISTORY_SUMMARY_FEATURE.md         → prontuario/funcionalidade-resumo-historico.md
```

### Áudio
```
AUDIO_PROCESSING_API.md  → audio/api-processamento-audio.md
AUDIO_UPLOAD_FEATURE.md  → audio/funcionalidade-upload-audio.md
WHISPER_INTEGRATION.md   → audio/integracao-whisper.md
TRANSCRIPTION_FLOW.md    → audio/fluxo-transcricao.md
```

### Backend
```
BACKEND_IMPLEMENTATION_SUMMARY.md → backend/resumo-implementacao-backend.md
```

### Bugfixes
```
BUGFIX_AI_NOTE_IN_SUMMARY.md       → bugfixes/correcao-nota-ia-resumo.md
BUGFIX_DROPDOWN_OVERLAP.md         → bugfixes/correcao-sobreposicao-dropdown.md
BUGFIX_EMAIL_UNIQUE_CONSTRAINT.md  → bugfixes/correcao-restricao-email-unico.md
BUGFIX_FORM_CREATION_LABELS.md     → bugfixes/correcao-labels-formulario.md
BUGFIX_MISSING_PATIENT_ENDPOINT.md → bugfixes/correcao-endpoint-paciente-ausente.md
BUGFIX_PATIENT_EDIT_MODAL.md       → bugfixes/correcao-modal-edicao-paciente.md
BUGFIX_SESSION_SAVE_CRITICAL.md    → bugfixes/correcao-critica-salvamento-sessao.md
```

### Regras de Negócio
```
BUSINESS_RULE_PATIENT_DELETION.md → regras-negocio/regra-exclusao-paciente.md
BUSINESS_RULE_SESSION_SAVE.md     → regras-negocio/regra-salvamento-sessao.md
```

### Integração
```
FRONTEND_INTEGRATION_ITER1.md   → integracao/integracao-frontend-iteracao1.md
FRONTEND_INTEGRATION_ITER2-4.md → integracao/integracao-frontend-iteracao2-4.md
```

### Sidebar
```
SIDEBAR_EVOLUTION.md   → sidebar/evolucao-sidebar.md
SIDEBAR_V3_REDESIGN.md → sidebar/redesign-sidebar-v3.md
```

### UX
```
UX_SOLUTION_SCALABILITY.md → ux/solucao-escalabilidade-ux.md
UX_SOLUTION_SUMMARY.md     → ux/resumo-solucao-ux.md
```

### Projeto
```
PROJECT_STRUCTURE.md           → projeto/estrutura-projeto.md
IMPLEMENTATION_CHECKLIST.md    → projeto/checklist-implementacao.md
IMPLEMENTATION_SUMMARY.md      → projeto/resumo-implementacao.md
COLOR_PALETTE_MIGRATION.md     → projeto/migracao-paleta-cores.md
ALERT_MODAL_IMPLEMENTATION.md  → projeto/implementacao-modal-alerta.md
USER_GUIDE.md                  → projeto/guia-usuario.md
```

## 📝 Convenções de Nomenclatura

### Padrões Aplicados

1. **Idioma**: Português brasileiro (pt-br)
2. **Formato**: kebab-case (palavras-separadas-por-hifen)
3. **Prefixos descritivos**:
   - `api-` para documentação de APIs
   - `funcionalidade-` para features
   - `integracao-` para integrações
   - `correcao-` para bugfixes
   - `regra-` para regras de negócio
   - `resumo-` para documentos de resumo
   - `guia-` para guias

### Exemplos
```
✅ Correto:
- api-sessoes.md
- funcionalidade-upload-audio.md
- integracao-whisper.md
- correcao-modal-edicao-paciente.md

❌ Evitar:
- SESSIONS_API.md (inglês, UPPER_CASE)
- audio_upload.md (underscore)
- Integração Whisper.md (espaços)
```

## 🎯 Novos Recursos Adicionados

1. **README.md em cada pasta**: Contexto e visão geral do módulo
2. **INDICE.md**: Índice alfabético de todos os documentos
3. **Tabelas de navegação**: Links rápidos entre módulos relacionados
4. **Emojis visuais**: Facilitam identificação rápida de cada categoria

## 📊 Estatísticas

- **Pastas criadas**: 12 (+ archive existente)
- **Documentos movidos**: ~50 arquivos
- **READMEs criados**: 13 (1 principal + 12 por pasta)
- **Novos documentos**: 2 (INDICE.md, MIGRACAO.md)

## 🔗 Links Úteis Pós-Migração

- [README Principal da Documentação](./README.md)
- [Índice Alfabético](./INDICE.md)
- [README do Projeto](../README.md)

## ✅ Checklist de Verificação

- [x] Todos os documentos movidos para pastas apropriadas
- [x] Nomes traduzidos para pt-br
- [x] README criado em cada pasta
- [x] INDICE.md alfabético criado
- [x] README principal atualizado
- [x] README do projeto atualizado com nova estrutura
- [x] Todos os links internos funcionando

## 🎉 Resultado

A documentação agora está:
- ✅ Organizada por módulos
- ✅ Em português brasileiro
- ✅ Fácil de navegar
- ✅ Escalável para novos documentos
- ✅ Com contexto em cada pasta

---

**Data da migração:** 26 de outubro de 2025  
**Responsável:** GitHub Copilot  
**Status:** ✅ Concluída

[← Voltar para Documentação](./README.md)
