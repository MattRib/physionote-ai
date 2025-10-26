# ⚡ Referência Rápida - Documentação PhysioNote.AI

Guia rápido para encontrar o que você precisa na documentação.

## 🎯 Navegação por Caso de Uso

### "Preciso entender como funciona..."

| O quê | Onde encontrar |
|-------|----------------|
| **...o dashboard?** | [dashboard/](./dashboard/) → documentacao-dashboard-v1.md |
| **...as animações?** | [animacoes/](./animacoes/) → visao-geral-animacoes.md |
| **...o módulo de sessões?** | [sessoes/](./sessoes/) → modulo-sessoes.md |
| **...o processamento de áudio?** | [audio/](./audio/) → api-processamento-audio.md |
| **...o prontuário?** | [prontuario/](./prontuario/) → funcionalidade-prontuario.md |
| **...a integração com Whisper?** | [audio/](./audio/) → integracao-whisper.md |
| **...a estrutura do projeto?** | [projeto/](./projeto/) → estrutura-projeto.md |

### "Preciso saber sobre uma correção..."

| Tipo de bug | Onde encontrar |
|-------------|----------------|
| **Modal de edição de paciente** | [bugfixes/](./bugfixes/) → correcao-modal-edicao-paciente.md |
| **Salvamento de sessão (crítico)** | [bugfixes/](./bugfixes/) → correcao-critica-salvamento-sessao.md |
| **Dropdown sobreposto** | [bugfixes/](./bugfixes/) → correcao-sobreposicao-dropdown.md |
| **Todos os bugfixes** | [bugfixes/README.md](./bugfixes/README.md) |

### "Preciso implementar..."

| Feature | Onde encontrar |
|---------|----------------|
| **Nova animação** | [animacoes/](./animacoes/) + visão-geral |
| **Nova funcionalidade de sessão** | [sessoes/](./sessoes/) + api-sessoes.md |
| **Upload de áudio** | [audio/](./audio/) → funcionalidade-upload-audio.md |
| **Nova regra de negócio** | [regras-negocio/](./regras-negocio/) + exemplos |

## 📚 Documentos Essenciais

### ⭐ Leitura Obrigatória

1. **[projeto/estrutura-projeto.md](./projeto/estrutura-projeto.md)** - Entenda a organização do código
2. **[ux/solucao-escalabilidade-ux.md](./ux/solucao-escalabilidade-ux.md)** - Padrões de UX para escalabilidade
3. **[sessoes/modulo-sessoes.md](./sessoes/modulo-sessoes.md)** - Core da aplicação

### 📖 Referências Técnicas

1. **[backend/resumo-implementacao-backend.md](./backend/resumo-implementacao-backend.md)** - Arquitetura backend
2. **[audio/api-processamento-audio.md](./audio/api-processamento-audio.md)** - API de áudio
3. **[sessoes/api-sessoes.md](./sessoes/api-sessoes.md)** - API de sessões

### 📝 Guias do Usuário

1. **[projeto/guia-usuario.md](./projeto/guia-usuario.md)** - Guia para usuários finais
2. **[dashboard/documentacao-dashboard-v1.md](./dashboard/documentacao-dashboard-v1.md)** - Como usar o dashboard

## 🔍 Métodos de Busca

### 1️⃣ Busca por Nome de Arquivo
→ Use o [INDICE.md](./INDICE.md) (ordem alfabética)

### 2️⃣ Busca por Módulo/Componente
→ Use o [README.md](./README.md) principal (organizado por pastas)

### 3️⃣ Visualizar Estrutura Completa
→ Use o [ARVORE.md](./ARVORE.md) (árvore visual)

### 4️⃣ Busca por Palavra-chave
Use Ctrl+F neste documento:

**Palavras-chave disponíveis:**
- API → audio/api-processamento-audio.md, sessoes/api-sessoes.md
- Animação → animacoes/
- Backend → backend/
- Bug → bugfixes/
- Dashboard → dashboard/
- Integração → integracao/, audio/integracao-whisper.md
- Paciente → pacientes/
- Prontuário → prontuario/
- Regra → regras-negocio/
- Sessão → sessoes/
- Sidebar → sidebar/
- UX → ux/
- Whisper → audio/integracao-whisper.md

## 🏃 Atalhos Rápidos

### Por Emoji

| Emoji | Módulo | Link |
|-------|--------|------|
| 📊 | Dashboard | [dashboard/](./dashboard/) |
| 🎨 | Animações | [animacoes/](./animacoes/) |
| 📝 | Sessões | [sessoes/](./sessoes/) |
| 👥 | Pacientes | [pacientes/](./pacientes/) |
| 📋 | Prontuário | [prontuario/](./prontuario/) |
| 🎙️ | Áudio | [audio/](./audio/) |
| 🔧 | Backend | [backend/](./backend/) |
| 🐛 | Bugfixes | [bugfixes/](./bugfixes/) |
| 📜 | Regras | [regras-negocio/](./regras-negocio/) |
| 🔗 | Integração | [integracao/](./integracao/) |
| 📐 | Sidebar | [sidebar/](./sidebar/) |
| 🎯 | UX | [ux/](./ux/) |
| 🏗️ | Projeto | [projeto/](./projeto/) |

## 💡 Dicas

1. **Cada pasta tem um README.md** - Sempre comece por lá!
2. **Use os emojis** - Facilitam a identificação visual
3. **Links relacionados** - Cada README tem links para módulos relacionados
4. **Ordem alfabética** - Use o INDICE.md se souber o nome do arquivo
5. **Visualização completa** - Use ARVORE.md para ver tudo de uma vez

## 📞 Ajuda

Se não encontrar o que procura:
1. Verifique o [README principal](./README.md)
2. Consulte o [INDICE.md](./INDICE.md)
3. Veja a [ARVORE.md](./ARVORE.md)
4. Leia o [MIGRACAO.md](./MIGRACAO.md) para entender a organização

---

[← Voltar para Documentação](./README.md)
