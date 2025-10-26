# 🚀 Guia de Setup Rápido - PhysioNote.AI

**Data:** 26 de outubro de 2025

---

## ⚡ Setup em 3 Passos

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Database (SQLite local)
DATABASE_URL="file:./.data/dev.db"

# OpenAI API (OBRIGATÓRIO para funcionalidades de IA)
OPENAI_API_KEY="sk-proj-YOUR_KEY_HERE"
```

⚠️ **IMPORTANTE:** Substitua `YOUR_KEY_HERE` pela sua chave real da OpenAI obtida em [platform.openai.com](https://platform.openai.com/api-keys)

### 3️⃣ Inicializar Banco de Dados

```powershell
# Criar pasta do banco
New-Item -Path ".data" -ItemType Directory -Force

# Aplicar migrations (PowerShell)
$env:DATABASE_URL="file:./.data/dev.db"; npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate
```

---

## 🏃 Executar o Projeto

### Modo Desenvolvimento
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Modo Produção
```bash
npm run build
npm start
```

---

## 🐛 Troubleshooting Comum

### Erro: "DATABASE_URL not found"

**Causa:** Arquivo `.env.local` não existe ou está mal configurado.

**Solução:**
```bash
# Copiar exemplo
copy .env.example .env.local

# Editar e adicionar DATABASE_URL
DATABASE_URL="file:./.data/dev.db"
```

### Erro: "OPENAI_API_KEY not found"

**Causa:** Chave da OpenAI não configurada.

**Solução:** Adicionar no `.env.local`:
```bash
OPENAI_API_KEY="sk-proj-XXXXXXXXXXXXX"
```

### Erro: "Prisma Client not initialized"

**Causa:** Prisma Client não foi gerado ou migrations não foram aplicadas.

**Solução:**
```powershell
$env:DATABASE_URL="file:./.data/dev.db"
npx prisma migrate deploy
npx prisma generate
```

### Erro: "Migration failed - table already exists"

**Causa:** Migrations duplicadas ou banco corrompido.

**Solução:**
```powershell
# Deletar banco
Remove-Item ".data" -Recurse -Force

# Recriar do zero
New-Item -Path ".data" -ItemType Directory -Force
$env:DATABASE_URL="file:./.data/dev.db"
npx prisma migrate deploy
npx prisma generate
```

---

## 📁 Estrutura de Pastas Importantes

```
physionote-ai/
├── .data/              # Banco de dados SQLite (ignorado no git)
├── .env.local          # Variáveis de ambiente (ignorado no git)
├── .env.example        # Exemplo de configuração (versionado)
├── prisma/
│   ├── schema.prisma   # Schema do banco
│   └── migrations/     # Migrations versionadas
├── src/
│   ├── app/            # Rotas Next.js (páginas + APIs)
│   ├── components/     # Componentes React
│   ├── server/         # Módulos backend (db, openai, etc)
│   └── styles/         # Estilos globais
└── docs/               # Documentação completa
```

---

## 🔑 Obtendo Chave da OpenAI

1. Acesse [platform.openai.com](https://platform.openai.com)
2. Faça login ou crie uma conta
3. Vá em **API Keys** no menu lateral
4. Clique em **Create new secret key**
5. Copie a chave (começa com `sk-proj-...`)
6. Cole no arquivo `.env.local`

⚠️ **NUNCA** commite a chave no git!

---

## 💰 Custos Estimados (OpenAI)

| Operação | Modelo | Custo Aproximado |
|----------|--------|------------------|
| **Transcrição de áudio** | Whisper-1 | $0.006 / minuto |
| **Geração de nota** | GPT-4o | $0.01 - $0.02 / sessão |
| **Resumo do histórico** | GPT-4o | $0.02 - $0.05 / resumo |

**Total por sessão de 30 min:** ~$0.20 - $0.35 USD

---

## ✅ Checklist de Verificação

Antes de rodar o projeto, certifique-se de que:

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env.local` criado
- [ ] `DATABASE_URL` configurada
- [ ] `OPENAI_API_KEY` configurada (com chave real)
- [ ] Pasta `.data` existe
- [ ] Migrations aplicadas (`prisma migrate deploy`)
- [ ] Prisma Client gerado (`prisma generate`)

---

## 🆘 Suporte

**Documentação Completa:** [docs/README.md](./docs/README.md)  
**Build:** [docs/BUILD.md](./docs/BUILD.md)  
**Estrutura:** [docs/projeto/estrutura-projeto.md](./docs/projeto/estrutura-projeto.md)

---

**Última Atualização:** 26 de outubro de 2025
