# PhysioNote.AI - Documentação

Esta pasta contém toda a documentação técnica do projeto PhysioNote.AI, organizada por módulos e componentes para facilitar a navegação e manutenção.

> 🎉 **Nova Estrutura!** A documentação foi reorganizada em 26/10/2025 para melhor usabilidade.  
> Veja o [Guia de Migração](./MIGRACAO.md) para entender as mudanças.

## 📑 Documentos Especiais

- **⚡ [REFERENCIA-RAPIDA.md](./REFERENCIA-RAPIDA.md)** - Guia rápido para encontrar o que você precisa
- **[INDICE.md](./INDICE.md)** - Índice alfabético de todos os documentos
- **[ARVORE.md](./ARVORE.md)** - Visualização em árvore da estrutura completa
- **[MIGRACAO.md](./MIGRACAO.md)** - Guia de migração da reorganização (26/out/2025)

## 📂 Estrutura de Pastas

### 📊 Dashboard
**Pasta:** `dashboard/`
- **documentacao-dashboard-v1.md** - Arquitetura do dashboard v1
- **cards-dashboard-v2.md** - Redesign do dashboard v2 baseado em cards
- **changelog-v1-para-v2.md** - Mudanças da v1 para v2
- **integracao-dados-reais.md** - Integração com dados reais

### 🎨 Animações
**Pasta:** `animacoes/`
- **visao-geral-animacoes.md** - Visão geral do sistema de animações
- **animacoes-hero.md** - Detalhes das animações da seção hero
- **animacoes-header.md** - Especificações das animações do header
- **animacoes-hover-features.md** - Efeitos hover dos cards de features
- **animacao-gradiente-botao.md** - Animação de gradiente dos botões
- **animacoes-sessao.md** - Animações do módulo de sessões
- **animacao-lottie-gravacao.md** - Animação Lottie para gravação de áudio

### 📝 Sessões
**Pasta:** `sessoes/`
- **api-sessoes.md** - API do módulo de sessões
- **redesign-pagina-sessoes.md** - Redesign da página de sessões
- **modulo-sessoes.md** - Documentação completa do módulo
- **integracao-notas-sessao.md** - Integração de notas com sessões
- **melhorias-ux-gravacao.md** - Melhorias de UX na gravação
- **exibicao-tipo-especialidade.md** - Exibição de tipo e especialidade
- **fluxo-sessoes.md** - Fluxo completo de sessões
- **retorno-notas-sessao.md** - Retorno de notas da sessão
- **prompt-retorno-v2.md** - Prompt v2 para retorno de sessões

### 👥 Pacientes
**Pasta:** `pacientes/`
- **modulo-pacientes.md** - Documentação completa do módulo de pacientes

### 📋 Prontuário
**Pasta:** `prontuario/`
- **funcionalidade-prontuario.md** - Funcionalidade principal do prontuário
- **prontuario-v2.md** - Versão 2 do prontuário
- **integracao-notas-prontuario.md** - Integração de notas com prontuário
- **comparacao-tipos-notas.md** - Comparação entre tipos de notas
- **funcionalidade-visualizacao-notas.md** - Visualização de notas
- **funcionalidade-resumo-historico.md** - Resumo do histórico do paciente

### 🎙️ Áudio
**Pasta:** `audio/`
- **api-processamento-audio.md** - API de processamento de áudio
- **funcionalidade-upload-audio.md** - Upload de arquivos de áudio
- **integracao-whisper.md** - Integração com Whisper AI
- **fluxo-transcricao.md** - Fluxo completo de transcrição

### 🔧 Backend
**Pasta:** `backend/`
- **resumo-implementacao-backend.md** - Resumo da implementação do backend

### 🐛 Correções (Bugfixes)
**Pasta:** `bugfixes/`
- **correcao-nota-ia-resumo.md** - Correção de nota de IA no resumo
- **correcao-sobreposicao-dropdown.md** - Correção de sobreposição de dropdown
- **correcao-restricao-email-unico.md** - Correção de restrição de email único
- **correcao-labels-formulario.md** - Correção de labels do formulário
- **correcao-endpoint-paciente-ausente.md** - Correção de endpoint de paciente ausente
- **correcao-modal-edicao-paciente.md** - Correção do modal de edição de paciente
- **correcao-critica-salvamento-sessao.md** - Correção crítica no salvamento de sessão

### 📜 Regras de Negócio
**Pasta:** `regras-negocio/`
- **regra-exclusao-paciente.md** - Regra de exclusão de paciente
- **regra-salvamento-sessao.md** - Regra de salvamento de sessão

### 🔗 Integração
**Pasta:** `integracao/`
- **integracao-frontend-iteracao1.md** - Integração frontend iteração 1
- **integracao-frontend-iteracao2-4.md** - Integração frontend iterações 2-4

### � Sidebar
**Pasta:** `sidebar/`
- **evolucao-sidebar.md** - Evolução do componente sidebar
- **redesign-sidebar-v3.md** - Redesign da sidebar versão 3

### 🎯 UX (Experiência do Usuário)
**Pasta:** `ux/`
- **⭐ solucao-escalabilidade-ux.md** - Solução completa de UX para muitas sessões
- **⭐ resumo-solucao-ux.md** - Resumo executivo das melhorias de UX

### 🏗️ Projeto
**Pasta:** `projeto/`
- **estrutura-projeto.md** - Estrutura completa do projeto
- **checklist-implementacao.md** - Checklist de implementação
- **resumo-implementacao.md** - Resumo da implementação
- **migracao-paleta-cores.md** - Migração da paleta de cores
- **implementacao-modal-alerta.md** - Implementação do modal de alerta
- **guia-usuario.md** - Guia do usuário

### 📦 Archive
**Pasta:** `archive/`
- Documentos antigos e obsoletos

## 🎨 Sistema de Design

Todos os componentes seguem o sistema de design PhysioNote.AI:
- **Cor Primária**: #5A9BCF (Azul)
- **Cor Hover**: #2C5F8D (Azul Escuro)
- **Background**: #F7F7F7 (Cinza Claro)
- **Texto**: #333333 (Cinza Escuro)

## 🔗 Links Rápidos

- [README Principal](../README.md)
- [Package.json](../package.json)
- [Tailwind Config](../tailwind.config.ts)

## ▶️ Executar com VS Code Tasks

- Use a task "Install dependencies" para configurar o projeto
- Use a task "Dev server" para iniciar o Next.js localmente
- No VS Code: pressione Ctrl+Shift+P; escolha "Run Task"

## 📝 Como Contribuir

Ao adicionar novos documentos:
1. Coloque-os na pasta apropriada do componente/módulo
2. Use nomes descritivos em português (pt-br)
3. Use kebab-case para nomes de arquivos (exemplo: `meu-documento.md`)
4. Atualize este README.md com o novo documento
5. Mantenha a estrutura organizada por módulos

## 🔍 Navegação Rápida

Para encontrar documentação sobre um tópico específico:

| Procurando por... | Vá para a pasta... |
|-------------------|-------------------|
| Dashboard, cards, estatísticas | `dashboard/` |
| Animações, transições, efeitos | `animacoes/` |
| Sessões, gravação, transcrição | `sessoes/` |
| Pacientes, cadastro | `pacientes/` |
| Prontuário, histórico, notas | `prontuario/` |
| Áudio, Whisper, processamento | `audio/` |
| Backend, API, banco de dados | `backend/` |
| Correções de bugs | `bugfixes/` |
| Regras de negócio | `regras-negocio/` |
| Integração frontend | `integracao/` |
| Menu lateral | `sidebar/` |
| Experiência do usuário | `ux/` |
| Estrutura, configuração | `projeto/` |

---

**Última atualização:** 26 de outubro de 2025
