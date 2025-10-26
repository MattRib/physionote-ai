# 🏥 PhysioNote.AI

Sistema completo de prontuário eletrônico para fisioterapeutas com IA integrada para transcrição e geração de notas clínicas.

## 🎯 Sobre o Projeto

PhysioNote.AI é uma plataforma moderna de gestão de prontuários eletrônicos desenvolvida especificamente para fisioterapeutas brasileiros. O sistema utiliza inteligência artificial (Whisper-1 e GPT-4o) para transcrever consultas e gerar notas clínicas estruturadas, permitindo que o profissional foque 100% no atendimento ao paciente.

## 🚀 Principais Funcionalidades

### 🎙️ Gravação e Transcrição
- Gravação de áudio das consultas via navegador
- Transcrição automática com OpenAI Whisper-1 (português)
- Geração de notas clínicas estruturadas com GPT-4o
- Interface minimalista focada no atendimento

### 📋 Prontuário Eletrônico
- Cadastro completo de pacientes (dados pessoais, endereço, CPF)
- Histórico de todas as sessões do paciente
- Notas clínicas estruturadas em formato profissional
- Resumo automático do histórico com IA
- Export de prontuário em PDF

### 📊 Dashboard
- Visualização em cards, lista ou tabela
- Filtros por status, data e busca por paciente
- Indicadores de status das sessões
- Integração com dados reais (sem mocks)

### 🤖 IA Integrada
- **Whisper-1:** Transcrição de áudio em português
- **GPT-4o:** Geração de notas clínicas estruturadas (SOAP modificado)
- Resumo inteligente do histórico do paciente
- Custos otimizados: ~$0.33 por sessão de 30 minutos

## 💻 Stack Tecnológica

### Frontend
- **Next.js 15.0.3** com App Router
- **React 18** com TypeScript 5
- **Tailwind CSS 3.4.1** para estilização
- **Motion 12.23.24** e **Lottie-React 2.4.1** para animações
- **Lucide-React 0.545.0** para ícones

### Backend
- **Node.js** com runtime do Next.js
- **Prisma 6.17.1** como ORM
- **SQLite** (desenvolvimento) / PostgreSQL (produção)
- **OpenAI SDK 6.3.0** (Whisper-1 + GPT-4o)
- **Zod 4.1.12** para validação

### DevOps
- **TypeScript Strict Mode**
- **ESLint** com Next.js Config
- **VS Code Tasks** para desenvolvimento
- **Git** com conventional commits

## 🎨 Destaques do Design

### Paleta de Cores
- **Azul Primário**: #5A9BCF (botões e elementos interativos)  
- **Azul Escuro**: #2C5F8D (estados hover e acentos)  
- **Branco Neutro**: #FFFFFF (fundos e destaques)  
- **Claro Neutro**: #F7F7F7 (fundos secundários)  
- **Médio Neutro**: #B0B0B0 (texto secundário)  
- **Escuro Neutro**: #333333 (texto principal e títulos)

### Seções Principais
1. **Cabeçalho**: Logo, menu de navegação e botão de login com animações de entrada  
2. **Hero**: Proposta de valor principal com entrada animada e CTA claro  
3. **Funcionalidades**: Quatro principais recursos do produto com animações ao passar o mouse  
4. **Depoimentos**: Histórias de sucesso de clientes  
5. **Rodapé**: Links, informações legais e redes sociais  
6. **Página de Login**: Interface moderna de autenticação com validação de formulário

## 🛠️ Como Começar

### ⚡ Setup Rápido

📖 **Guia completo de setup:** [SETUP.md](./SETUP.md)

**Resumo em 3 passos:**

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar ambiente:**
```bash
# Criar .env.local com:
DATABASE_URL="file:./.data/dev.db"
OPENAI_API_KEY="sk-proj-YOUR_KEY_HERE"
```

3. **Inicializar banco:**
```powershell
New-Item -Path ".data" -ItemType Directory -Force
$env:DATABASE_URL="file:./.data/dev.db"; npx prisma migrate deploy
npx prisma generate
```

### Pré-requisitos
- Node.js 18+  
- npm ou yarn
- Chave da OpenAI API ([obter aqui](https://platform.openai.com/api-keys))

### Build para Produção

⚠️ **IMPORTANTE:** O build requer a variável `OPENAI_API_KEY` configurada.

**Opção 1: Com chave real**
```bash
npm run build
npm start
```

**Opção 2: Build CI/CD (sem chave real)**
```bash
npm run build:ci
npm start
```

**Opção 3: PowerShell (temporário)**
```powershell
$env:OPENAI_API_KEY="sk-your-key"; npm run build
```

📖 **Documentação completa do build:** [docs/BUILD.md](./docs/BUILD.md)

### Executar com Tasks do VS Code

Se estiver usando o VS Code, você pode usar as tasks adicionadas:

- Task: "Install dependencies" — executa npm install  
- Task: "Dev server" — inicia o Next.js em modo de desenvolvimento

No VS Code: pressione Ctrl+Shift+P; digite "Run Task"; selecione a task desejada.

## 📱 Design Responsivo

O site é totalmente responsivo com:
- **Desktop**: Layout completo com todas as funcionalidades visíveis  
- **Tablet**: Layouts ajustados com funcionalidade mantida  
- **Mobile**: Layouts empilhados otimizados para interação por toque

## 🎯 Animações

- **Animações do Cabeçalho**: Logo entra pela esquerda, itens do nav em cascata, botão de login pela direita  
- **Hero**: Entrada sequencial com título, subtítulo e botões com efeito de bounce  
- **Cards de Funcionalidades**: Animações de hover em múltiplas camadas com pulso, rotação, brilho e transições de cor  
- **Fade-in**: Entradas suaves para todas as seções  
- **Hover effects**: Estados interativos para botões e cards com scale e shadow transitions  
- **Micro-interações**: Feedbacks sutis para ações do usuário  
- **Página de Login**: Elementos de formulário com estados de foco e transições animadas

## 🔧 Estrutura do Projeto

```
src/
├── app/                 # Diretório app do Next.js
│   ├── login/           # Rota de login
│   │   └── page.tsx     # Manipulador da rota de login
│   ├── dashboard/       # Rota do dashboard (após login)
│   │   └── page.tsx     # Manipulador da rota do dashboard
│   ├── globals.css      # Estilos globais e animações
│   ├── layout.tsx       # Componente de layout raiz
│   └── page.tsx         # Página inicial
├── components/          # Componentes React
│   ├── Header.tsx       # Navegação e logo com animações
│   ├── HeroSection.tsx  # Seção principal com animações
│   ├── Features.tsx     # Funcionalidades com hover animations
│   ├── Testimonials.tsx # Depoimentos com avaliações
│   ├── Footer.tsx       # Rodapé com links e redes sociais
│   ├── LoginPage.tsx    # Componente de formulário de login
│   ├── Dashboard.tsx    # Container principal do dashboard
│   ├── Sidebar.tsx      # Barra lateral de navegação
│   └── SessionList.tsx  # Lista / tabela de sessões
```

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router  
- **TypeScript** - Tipagem e melhor experiência de desenvolvimento  
- **Tailwind CSS** - Estilização utilitária  
- **React 18** - Biblioteca de UI  
- **lucide-react** - Biblioteca de ícones modernos  
- **ESLint** - Linting de código  
- **PostCSS** - Processamento de CSS

## 📊 Componentes Principais

### Páginas Institucionais
- **Home**: Landing com hero, funcionalidades, depoimentos e rodapé  
- **Login**: Interface de autenticação com validação

### Dashboard (após login)
- **Dashboard**: Layout em duas colunas com sidebar e gerenciamento de sessões  
- **Sidebar**: Navegação fixa com Dashboard, Configurações, Ajuda e Logout  
- **Session List**: Tabela/cards interativos exibindo sessões de fisioterapia com:
  - Badges de status (Completed, Processing, Error)
  - Indicadores de conformidade com LGPD
  - Botões de ação (Ver Nota, Exportar)
  - Botão CTA "Nova Sessão"

### Modelo de Dados de Sessão
```typescript
interface Session {
  id: string;
  session_datetime: string;
  patient_name: string;
  status: 'completed' | 'processing' | 'error';
  is_anonymized: boolean;  // Conformidade LGPD
  duration_minutes: number;
}
```

## 📚 Documentação

A documentação completa do projeto está organizada por módulos na pasta `docs/`:

### 📂 Estrutura da Documentação

- **[docs/](./docs/README.md)** - README principal da documentação
- **[docs/INDICE.md](./docs/INDICE.md)** - Índice alfabético de todos os documentos

### 🗂️ Módulos Documentados

| Módulo | Descrição | Pasta |
|--------|-----------|-------|
| 📊 **Dashboard** | Arquitetura e funcionalidades do dashboard | [docs/dashboard/](./docs/dashboard/) |
| 🎨 **Animações** | Sistema de animações e transições | [docs/animacoes/](./docs/animacoes/) |
| 📝 **Sessões** | Módulo de gerenciamento de sessões | [docs/sessoes/](./docs/sessoes/) |
| 👥 **Pacientes** | Cadastro e gerenciamento de pacientes | [docs/pacientes/](./docs/pacientes/) |
| 📋 **Prontuário** | Prontuário eletrônico e histórico | [docs/prontuario/](./docs/prontuario/) |
| 🎙️ **Áudio** | Processamento e transcrição de áudio | [docs/audio/](./docs/audio/) |
| 🔧 **Backend** | Implementação do backend e APIs | [docs/backend/](./docs/backend/) |
| 🐛 **Bugfixes** | Registro de correções de bugs | [docs/bugfixes/](./docs/bugfixes/) |
| 📜 **Regras de Negócio** | Documentação de regras de negócio | [docs/regras-negocio/](./docs/regras-negocio/) |
| 🔗 **Integração** | Integração frontend-backend | [docs/integracao/](./docs/integracao/) |
| 📐 **Sidebar** | Componente de navegação lateral | [docs/sidebar/](./docs/sidebar/) |
| 🎯 **UX** | Soluções de experiência do usuário | [docs/ux/](./docs/ux/) |
| 🏗️ **Projeto** | Estrutura e configuração geral | [docs/projeto/](./docs/projeto/) |

### 🔍 Navegação Rápida

Para encontrar documentação específica, use:
- **Por módulo**: Navegue pelas pastas acima
- **Por ordem alfabética**: Consulte o [Índice Alfabético](./docs/INDICE.md)
- **Por tópico**: Veja a tabela de navegação no [README da documentação](./docs/README.md)

## 📄 Licença

Este projeto é privado e propriedade da PhysioNote.AI.

## 🤝 Contribuição

Este é um projeto privado. Para dúvidas ou contribuições, entre em contato com a equipe de desenvolvimento.

---

Desenvolvido com ❤️ para fisioterapeutas brasileiros.