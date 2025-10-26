# Instruções para GitHub Copilot - PhysioNote.AI

## 🎯 Contexto do Projeto

**Projeto:** PhysioNote.AI - Sistema de prontuário eletrônico para fisioterapeutas  
**Tech Stack:** Next.js 15.0.3, React 18, TypeScript 5, Prisma 6.17.1, Tailwind CSS 3.4.1  
**Backend:** Node.js, SQLite (dev), OpenAI SDK 6.3.0 (Whisper-1 + GPT-4o)  
**Status:** Em produção ativa com usuários reais

---

## 📚 Regra Crítica: Documentação Sempre Sincronizada

### ⚠️ IMPORTANTE: Atualizar Documentação a Cada Iteração

**Toda vez que modificar código, você DEVE atualizar a documentação correspondente:**

1. **Ao modificar APIs:**
   - Atualizar `docs/backend/*.md`
   - Atualizar `docs/sessoes/api-*.md` ou `docs/audio/api-*.md`
   - Incluir novos endpoints, parâmetros, respostas

2. **Ao modificar componentes:**
   - Atualizar `docs/dashboard/*.md`, `docs/sessoes/*.md`, `docs/pacientes/*.md`
   - Documentar novas props, estados, funcionalidades

3. **Ao modificar fluxos:**
   - Atualizar `docs/sessoes/fluxo-*.md`
   - Atualizar diagramas e explicações

4. **Ao modificar schema do banco:**
   - Atualizar `docs/projeto/estrutura-projeto.md`
   - Documentar novos modelos, campos, relações

5. **Ao adicionar dependências:**
   - Atualizar tech stack em `docs/projeto/estrutura-projeto.md`
   - Documentar configuração necessária

6. **Ao corrigir bugs:**
   - Criar novo arquivo em `docs/bugfixes/correcao-*.md`
   - Documentar problema, causa, solução

### 📝 Checklist de Documentação

Antes de finalizar qualquer iteração, verificar:

- [ ] Código modificado tem documentação correspondente atualizada?
- [ ] Novos arquivos criados têm documentação?
- [ ] Mudanças de arquitetura estão documentadas?
- [ ] APIs modificadas têm exemplos atualizados?
- [ ] README.md do projeto reflete mudanças (se aplicável)?

### 🚫 O Que NÃO Fazer

- ❌ Modificar código sem atualizar docs
- ❌ Deixar documentação desatualizada "para depois"
- ❌ Criar features sem documentar
- ❌ Assumir que "o código é auto-explicativo"

### ✅ O Que Fazer

- ✅ Documentar DURANTE a implementação
- ✅ Atualizar docs no mesmo commit das mudanças de código
- ✅ Incluir exemplos práticos na documentação
- ✅ Manter precisão: se mudou no código, mude na doc

---

## 🏗️ Arquitetura do Projeto

### Fluxo de Duas Fases (Crítico)

**Sessões são criadas APENAS após revisão do usuário:**

1. **Fase Temporária:** `/api/sessions/process-temp` (NÃO salva no banco)
2. **Fase Definitiva:** `/api/sessions/save` (cria Session + Note)

⚠️ **Nunca** criar sessão antes do usuário confirmar salvamento!

### Estrutura de Pastas

```
docs/
├── animacoes/          # Documentação de animações
├── audio/              # Processamento de áudio e transcrição
├── backend/            # APIs e servidor
├── bugfixes/           # Registro de correções
├── dashboard/          # Módulo dashboard
├── integracao/         # Frontend-backend integration
├── pacientes/          # Módulo de pacientes
├── projeto/            # Estrutura e config geral
├── prontuario/         # Prontuário eletrônico
├── regras-negocio/     # Regras de negócio
├── sessoes/            # Módulo de sessões
├── sidebar/            # Componente sidebar
└── ux/                 # Experiência do usuário
```

---

## 🎨 Padrões de Código

### Nomenclatura
- **Componentes:** PascalCase (`SessionView.tsx`)
- **Hooks:** camelCase com `use` prefix (`useSessionState`)
- **APIs:** kebab-case (`/api/sessions/process-temp`)
- **Arquivos de doc:** kebab-case (`fluxo-sessoes.md`)

### TypeScript
- Strict mode habilitado
- Interfaces para props de componentes
- Types para responses de API
- Evitar `any`, usar tipos específicos

### React
- Functional components com hooks
- Props destructuring
- Estados bem nomeados e organizados
- Cleanup em useEffect quando necessário

---

## 🔧 Convenções de Commit

Ao fazer mudanças, documentar no formato:

```
feat(sessoes): adiciona campo motivation à sessão

- Adicionado campo motivation ao modelo Session
- Atualizado endpoint /api/sessions/save
- Documentação atualizada em docs/sessoes/api-sessoes.md
```

---

## ✅ Checklist de Setup Inicial (Completo)

- [x] Projeto Next.js criado
- [x] Componentes institucionais criados
- [x] VS Code tasks configuradas
- [x] Prisma configurado e migrations aplicadas
- [x] OpenAI SDK integrado
- [x] Documentação organizada em pastas temáticas
- [x] Fluxo de duas fases implementado
- [x] Sistema de prontuário completo

---

## 🚀 Como Usar Este Arquivo

**Para GitHub Copilot:**
- Seguir estas instruções em TODAS as interações
- Priorizar manutenção da documentação
- Sempre validar contra código existente antes de sugerir mudanças
- Ao adicionar features, criar documentação correspondente

**Para desenvolvedores:**
- Consultar antes de fazer mudanças significativas
- Atualizar este arquivo quando padrões mudarem
- Manter sincronizado com evolução do projeto

---

**Última atualização:** 26 de outubro de 2025  
**Próxima revisão:** A cada sprint ou mudança arquitetural significativa