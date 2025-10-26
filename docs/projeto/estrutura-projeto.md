# 🏗️ Estrutura do Projeto PhysioNote.AI# 🏗️ Estrutura do Projeto PhysioNote.AI# PhysioNote.AI - Project Structure



**Última atualização:** 26 de outubro de 2025  

**Baseado em:** Código-fonte real do projeto

**Última atualização:** 26 de outubro de 2025  ## 📁 Organized Folder Structure

Esta documentação descreve a estrutura completa e atual do projeto PhysioNote.AI.

**Baseado em:** Código-fonte real do projeto

## 📋 Stack Tecnológica

```

### Frontend

- **Framework:** Next.js 15.0.3 (App Router)Esta documentação descreve a estrutura completa e atual do projeto PhysioNote.AI.10_PhysioNotes.AI/

- **UI Library:** React 18

- **Language:** TypeScript 5├── .github/

- **Styling:** Tailwind CSS 3.4.1

- **Animations:** Motion 12.23.24, Lottie-React 2.4.1## 📋 Stack Tecnológica│   └── copilot-instructions.md          # GitHub Copilot configuration

- **Icons:** Lucide-React 0.545.0

- **PDF Export:** jsPDF 2.5.1│



### Backend### Frontend├── docs/                                 # 📚 All Documentation

- **Runtime:** Node.js

- **Database ORM:** Prisma 6.17.1- **Framework:** Next.js 15.0.3 (App Router)│   ├── README.md                        # Documentation index

- **Database:** SQLite (desenvolvimento)

- **AI Services:** OpenAI SDK 6.3.0- **UI Library:** React 18│   ├── ANIMATIONS.md                    # General animations

  - Transcrição: Whisper-1

  - Geração de notas: GPT-4o- **Language:** TypeScript 5│   ├── HERO_ANIMATIONS.md               # Hero section animations

- **Validation:** Zod 4.1.12

- **Styling:** Tailwind CSS 3.4.1│   ├── HEADER_ANIMATIONS.md             # Header animations

### DevOps & Tools

- **Linting:** ESLint 8 + Next.js Config- **Animations:** Motion 12.23.24, Lottie-React 2.4.1│   ├── FEATURES_HOVER_ANIMATIONS.md     # Features hover effects

- **Type Checking:** TypeScript Strict Mode

- **Package Manager:** npm- **Icons:** Lucide-React 0.545.0│   └── DASHBOARD_DOCUMENTATION.md       # Dashboard architecture

- **VS Code Tasks:** Configuradas para install e dev server

- **PDF Export:** jsPDF 2.5.1│

## 📁 Estrutura de Diretórios

├── src/

```

physionote-ai/### Backend│   ├── app/                             # 🚀 Next.js App Router

├── .github/

│   └── copilot-instructions.md          # Instruções para GitHub Copilot- **Runtime:** Node.js│   │   ├── dashboard/                   # Dashboard routes

│

├── .vscode/- **Database ORM:** Prisma 6.17.1│   │   │   ├── page.tsx                # Main dashboard page

│   └── tasks.json                       # Tasks do VS Code (install, dev)

│- **Database:** SQLite (desenvolvimento)│   │   │   └── new-session/            # New session flow

├── docs/                                 # 📚 Documentação completa (organizada em pt-br)

│   ├── README.md                        # Índice da documentação- **AI Services:** OpenAI SDK 6.3.0│   │   │       └── page.tsx            # New session page

│   ├── INDICE.md                        # Índice alfabético

│   ├── ARVORE.md                        # Visualização em árvore  - Transcrição: Whisper-1│   │   ├── login/                      # Authentication routes

│   ├── MIGRACAO.md                      # Guia de migração 26/out/2025

│   ├── REFERENCIA-RAPIDA.md            # Guia de referência rápida  - Geração de notas: GPT-4o│   │   │   └── page.tsx                # Login page

│   ├── animacoes/                       # Documentos sobre animações

│   ├── audio/                           # Processamento de áudio- **Validation:** Zod 4.1.12│   │   ├── layout.tsx                  # Root layout

│   ├── backend/                         # Backend e APIs

│   ├── bugfixes/                        # Registro de correções│   │   ├── page.tsx                    # Home page

│   ├── dashboard/                       # Módulo dashboard

│   ├── integracao/                      # Integrações frontend-backend### DevOps & Tools│   │   └── globals.css                 # Global styles

│   ├── pacientes/                       # Módulo de pacientes

│   ├── projeto/                         # Estrutura e config geral- **Linting:** ESLint 8 + Next.js Config│   │

│   ├── prontuario/                      # Prontuário eletrônico

│   ├── regras-negocio/                 # Regras de negócio- **Type Checking:** TypeScript Strict Mode│   └── components/                      # 🧩 React Components

│   ├── sessoes/                         # Módulo de sessões

│   ├── sidebar/                         # Componente sidebar- **Package Manager:** npm│       ├── auth/                        # 🔐 Authentication Components

│   └── ux/                              # Experiência do usuário

│- **VS Code Tasks:** Configuradas para install e dev server│       │   ├── LoginPage.tsx           # Login form component

├── prisma/

│   ├── schema.prisma                    # Schema do banco de dados│       │   └── index.ts                # Auth exports

│   └── migrations/                      # Migrações do Prisma

│       ├── migration_lock.toml## 📁 Estrutura de Diretórios│       │

│       ├── 20251010155032_add_transcription_and_processing/

│       ├── 20251015_add_history_summary/│       ├── dashboard/                   # 📊 Dashboard Components (v2 Card-Based)

│       ├── 20251015190538_add_patient_address_cpf/

│       ├── 20251015192132_add_session_details/```│       │   ├── DashboardLayout.tsx     # Main dashboard container

│       └── 20251015231850_add_history_summary/

│physionote-ai/│       │   ├── Sidebar.tsx             # Navigation sidebar (redesigned)

├── public/

│   └── animations/                      # Animações Lottie├── .github/│       │   ├── SessionCard.tsx         # Individual session card

│       ├── audio-recording.json         # Animação de gravação

│       └── loading-blue.json            # Loading spinner│   └── copilot-instructions.md          # Instruções para GitHub Copilot│       │   ├── SessionCards.tsx        # Cards grid container

│

├── src/││       │   ├── SessionList.tsx         # Session management table (legacy)

│   ├── app/                             # 🚀 Next.js App Router

│   │   ├── api/                         # API Routes├── .vscode/│       │   ├── NewSessionFlow.tsx      # New session form

│   │   │   ├── ai/

│   │   │   │   └── summarize/│   └── tasks.json                       # Tasks do VS Code (install, dev)│       │   └── index.ts                # Dashboard exports

│   │   │   │       └── route.ts         # API de resumo com IA

│   │   │   ├── patients/││       │

│   │   │   │   ├── route.ts             # CRUD de pacientes

│   │   │   │   └── [id]/├── docs/                                 # 📚 Documentação completa (organizada em pt-br)│       ├── landing/                     # 🏠 Landing Page Components

│   │   │   │       ├── route.ts         # Paciente por ID

│   │   │   │       ├── history-summary/│   ├── README.md                        # Índice da documentação│       │   ├── HeroSection.tsx         # Hero section

│   │   │   │       │   └── route.ts     # Resumo do histórico (IA)

│   │   │   │       ├── record/│   ├── INDICE.md                        # Índice alfabético│       │   ├── Features.tsx            # Features showcase

│   │   │   │       │   └── route.ts     # Prontuário completo

│   │   │   │       └── sessions/│   ├── ARVORE.md                        # Visualização em árvore│       │   ├── Testimonials.tsx        # Customer testimonials

│   │   │   │           └── route.ts     # Sessões do paciente

│   │   │   └── sessions/│   ├── MIGRACAO.md                      # Guia de migração 26/out/2025│       │   └── index.ts                # Landing exports

│   │   │       ├── route.ts             # CRUD de sessões

│   │   │       ├── save/│   ├── REFERENCIA-RAPIDA.md            # Guia de referência rápida│       │

│   │   │       │   └── route.ts         # ⭐ Salvar sessão completa (ÚNICO que cria no DB)

│   │   │       ├── process-temp/│   ├── animacoes/                       # Documentos sobre animações│       └── layout/                      # 🎨 Layout Components

│   │   │       │   └── route.ts         # ⭐ Processamento temporário (SEM DB)

│   │   │       └── [id]/│   ├── audio/                           # Processamento de áudio│           ├── Header.tsx              # Navigation header

│   │   │           ├── route.ts         # Sessão por ID

│   │   │           ├── audio/│   ├── backend/                         # Backend e APIs│           ├── Footer.tsx              # Footer with links

│   │   │           │   └── route.ts     # Upload de áudio

│   │   │           └── process/│   ├── bugfixes/                        # Registro de correções│           └── index.ts                # Layout exports

│   │   │               └── route.ts     # Processar sessão

│   │   ││   ├── dashboard/                       # Módulo dashboard│

│   │   ├── dashboard/                   # Rotas do Dashboard

│   │   │   ├── page.tsx                 # Dashboard principal│   ├── integracao/                      # Integrações frontend-backend├── .eslintrc.json                      # ESLint configuration

│   │   │   ├── new-session/

│   │   │   │   └── page.tsx             # Nova sessão│   ├── pacientes/                       # Módulo de pacientes├── next.config.js                      # Next.js configuration

│   │   │   ├── patients/

│   │   │   │   ├── page.tsx             # Lista de pacientes│   ├── projeto/                         # Estrutura e config geral├── package.json                        # Dependencies

│   │   │   │   └── [id]/

│   │   │   │       └── page.tsx         # Prontuário do paciente│   ├── prontuario/                      # Prontuário eletrônico├── postcss.config.js                   # PostCSS configuration

│   │   │   ├── session/

│   │   │   │   └── page.tsx             # Gravação de sessão│   ├── regras-negocio/                 # Regras de negócio├── README.md                           # Main project README

│   │   │   └── settings/

│   │   │       └── page.tsx             # Configurações│   ├── sessoes/                         # Módulo de sessões├── tailwind.config.ts                  # Tailwind CSS configuration

│   │   │

│   │   ├── login/│   ├── sidebar/                         # Componente sidebar└── tsconfig.json                       # TypeScript configuration

│   │   │   └── page.tsx                 # Página de login

│   │   ││   └── ux/                              # Experiência do usuário```

│   │   ├── layout.tsx                   # Layout raiz

│   │   ├── page.tsx                     # Landing page│

│   │   └── globals.css                  # Estilos globais + animações

│   │├── prisma/## 🎯 Component Organization

│   ├── components/                      # 🧩 Componentes React

│   │   ├── auth/│   ├── schema.prisma                    # Schema do banco de dados

│   │   │   ├── LoginPage.tsx            # Formulário de login

│   │   │   └── index.ts│   └── migrations/                      # Migrações do Prisma### Auth Components (`src/components/auth/`)

│   │   │

│   │   ├── common/                      # Componentes compartilhados│       ├── migration_lock.toml- **LoginPage.tsx**: Complete login form with validation

│   │   │   ├── AlertModal.tsx           # Modal de alerta reutilizável

│   │   │   ├── LoadingSpinner.tsx       # Spinner de loading│       ├── 20251010155032_add_transcription_and_processing/

│   │   │   ├── Modal.tsx                # Modal genérico

│   │   │   ├── RevealOnScroll.tsx       # Animação ao scroll│       ├── 20251015_add_history_summary/### Dashboard Components (`src/components/dashboard/`) ⭐ **v2 Card-Based**

│   │   │   └── index.ts

│   │   ││       ├── 20251015190538_add_patient_address_cpf/- **DashboardLayout.tsx**: Main container with responsive grid (DEFAULT EXPORT)

│   │   ├── dashboard/                   # Componentes do Dashboard

│   │   │   ├── DashboardLayout.tsx      # Layout principal (v2 card-based)│       ├── 20251015192132_add_session_details/- **Sidebar.tsx**: Fixed sidebar with smooth animations

│   │   │   ├── Sidebar.tsx              # Sidebar de navegação

│   │   │   ├── FilterBar.tsx            # Barra de filtros│       └── 20251015231850_add_history_summary/- **SessionCard.tsx**: Individual session card with status badges

│   │   │   ├── SessionCard.tsx          # Card individual de sessão

│   │   │   ├── SessionCards.tsx         # Grid de cards│- **SessionCards.tsx**: Grid container with staggered animations

│   │   │   ├── SessionListView.tsx      # Visualização em lista

│   │   │   ├── SessionTable.tsx         # Visualização em tabela├── public/- **SessionList.tsx**: Legacy table view (mantido para compatibilidade)

│   │   │   ├── SessionList.tsx          # Gerenciador de sessões (legacy)

│   │   │   ├── NewSessionFlow.tsx       # Fluxo de nova sessão│   └── animations/                      # Animações Lottie- **NewSessionFlow.tsx**: New session creation form with specialty selection

│   │   │   ├── NoteViewModal.tsx        # Modal de visualização de nota

│   │   │   ├── Pagination.tsx           # Componente de paginação│       ├── audio-recording.json         # Animação de gravação

│   │   │   ├── types.ts                 # TypeScript types

│   │   │   └── index.ts│       └── loading-blue.json            # Loading spinner### Landing Components (`src/components/landing/`)

│   │   │

│   │   ├── landing/                     # Landing Page│- **HeroSection.tsx**: Main hero section with CTA

│   │   │   ├── Hero.tsx                 # Seção hero com animações

│   │   │   ├── Features.tsx             # Cards de funcionalidades├── src/- **Features.tsx**: Product features with hover animations

│   │   │   ├── Testimonials.tsx         # Depoimentos

│   │   │   └── index.ts│   ├── app/                             # 🚀 Next.js App Router- **Testimonials.tsx**: Customer testimonials with ratings

│   │   │

│   │   ├── layout/                      # Componentes de layout│   │   ├── api/                         # API Routes

│   │   │   ├── Header.tsx               # Header com navegação

│   │   │   ├── Footer.tsx               # Footer│   │   │   ├── ai/### Layout Components (`src/components/layout/`)

│   │   │   └── index.ts

│   │   ││   │   │   │   └── summarize/- **Header.tsx**: Navigation header with logo

│   │   ├── patients/                    # Componentes de Pacientes

│   │   │   ├── PatientsView.tsx         # Visualização principal│   │   │   │       └── route.ts         # API de resumo com IA- **Footer.tsx**: Footer with legal links and social media

│   │   │   ├── PatientsList.tsx         # Lista de pacientes

│   │   │   ├── PatientModal.tsx         # Modal de cadastro/edição│   │   │   ├── patients/

│   │   │   ├── PatientRecord.tsx        # Prontuário completo

│   │   │   └── index.ts│   │   │   │   ├── route.ts             # CRUD de pacientes## 📦 Import Examples

│   │   │

│   │   └── session/                     # Componentes de Sessão│   │   │   │   └── [id]/

│   │       ├── SessionView.tsx          # Gravação de sessão

│   │       ├── SessionSummary.tsx       # Resumo da sessão│   │   │   │       ├── route.ts         # Paciente por ID### Using Default Export (Dashboard v2)

│   │       ├── SessionSummary_fullscreen.tsx  # Resumo fullscreen

│   │       ├── TranscriptionPanel.tsx   # Painel de transcrição│   │   │   │       ├── history-summary/```typescript

│   │       ├── PatientSelector.tsx      # Seletor de paciente

│   │       ├── NoteAIDisclaimer.tsx     # Disclaimer de IA│   │   │   │       │   └── route.ts     # Resumo do histórico (IA)// Dashboard Layout (recommended)

│   │       └── index.ts

│   ││   │   │   │       ├── record/import DashboardLayout from '@/components/dashboard';

│   ├── server/                          # 🔧 Server-side modules

│   │   ├── db.ts                        # Prisma client│   │   │   │       │   └── route.ts     # Prontuário completo// or

│   │   ├── openai.ts                    # OpenAI client + configs

│   │   ├── transcription.ts             # Whisper transcription│   │   │   │       └── sessions/import { DashboardLayout } from '@/components/dashboard';

│   │   ├── note-generation.ts           # GPT-4o note generation

│   │   └── storage.ts                   # File storage utilities│   │   │   │           └── route.ts     # Sessões do paciente```

│   │

│   └── styles/│   │   │   └── sessions/

│       └── colors.ts                    # Paleta de cores do projeto

││   │   │       ├── route.ts             # CRUD de sessões### Using Named Exports

├── uploads/                             # Arquivos uploadados (gitignored)

│   └── audio/                           # Áudios das sessões│   │   │       ├── save/```typescript

│

├── temp/                                # Arquivos temporários (gitignored)│   │   │       │   └── route.ts         # Salvar sessão completa// Landing components

│

├── .data/                               # Dados locais (gitignored)│   │   │       ├── process-temp/import { HeroSection, Features, Testimonials } from '@/components/landing';

│   └── audio/                           # Storage local de áudio

││   │   │       │   └── route.ts         # Processamento temporário (sem DB)

├── .eslintrc.json                       # Configuração ESLint

├── .gitignore                           # Arquivos ignorados pelo Git│   │   │       └── [id]/// Layout components

├── next-env.d.ts                        # Types do Next.js

├── next.config.js                       # Configuração do Next.js│   │   │           ├── route.ts         # Sessão por IDimport { Header, Footer } from '@/components/layout';

├── package.json                         # Dependências e scripts

├── package-lock.json                    # Lockfile do npm│   │   │           ├── audio/

├── postcss.config.js                    # Configuração PostCSS

├── README.md                            # README principal do projeto│   │   │           │   └── route.ts     # Upload de áudio// Dashboard components

├── tailwind.config.ts                   # Configuração Tailwind CSS

└── tsconfig.json                        # Configuração TypeScript│   │   │           └── process/import { Sidebar, SessionList, NewSessionFlow } from '@/components/dashboard';

```

│   │   │               └── route.ts     # Processar sessão

## 🗄️ Modelo de Dados (Prisma Schema)

│   │   │// Auth components

### Patient (Paciente)

```prisma│   │   ├── dashboard/                   # Rotas do Dashboardimport { LoginPage } from '@/components/auth';

model Patient {

  id              String           @id @default(cuid())│   │   │   ├── page.tsx                 # Dashboard principal```

  name            String

  email           String?          @unique│   │   │   ├── new-session/

  phone           String?

  cpf             String?          @unique│   │   │   │   └── page.tsx             # Nova sessão### Using Default Export

  birthDate       DateTime?

  gender          String?│   │   │   ├── patients/```typescript

  // Endereço

  street          String?│   │   │   │   ├── page.tsx             # Lista de pacientes// Dashboard (default export from dashboard index)

  number          String?

  complement      String?│   │   │   │   └── [id]/import Dashboard from '@/components/dashboard';

  neighborhood    String?

  city            String?│   │   │   │       └── page.tsx         # Prontuário do paciente```

  state           String?

  zipCode         String?│   │   │   ├── session/

  createdAt       DateTime         @default(now())

  updatedAt       DateTime         @updatedAt│   │   │   │   └── page.tsx             # Gravação de sessão## 🗂️ Documentation Structure

  sessions        Session[]

  historySummary  HistorySummary?│   │   │   └── settings/

}

```│   │   │       └── page.tsx             # ConfiguraçõesAll technical documentation has been moved to the `/docs` folder:



### Session (Sessão)│   │   │- ✅ Centralized location for all docs

```prisma

model Session {│   │   ├── login/- ✅ Easy to find and maintain

  id            String   @id @default(cuid())

  patientId     String│   │   │   └── page.tsx                 # Página de login- ✅ Separated from code for clarity

  date          DateTime @default(now())

  durationMin   Int?│   │   │- ✅ Includes README with navigation

  sessionType   String?  // Ex: "Avaliação inicial", "Retorno"

  specialty     String?  // Ex: "Fisioterapia Ortopédica"│   │   ├── layout.tsx                   # Layout raiz

  motivation    String?  // Motivação/objetivo da consulta

  audioUrl      String?│   │   ├── page.tsx                     # Landing page## ✨ Benefits of This Structure

  audioSize     Int?     // tamanho em bytes

  transcription String?  // texto completo da transcrição│   │   └── globals.css                  # Estilos globais + animações

  status        String   @default("recording")

                         // Valores: recording | transcribing | generating | completed | error│   │1. **Clear Separation**: Components grouped by functionality

  errorMessage  String?

  createdAt     DateTime @default(now())│   ├── components/                      # 🧩 Componentes React2. **Easy Navigation**: Intuitive folder names

  updatedAt     DateTime @updatedAt

  patient       Patient  @relation(fields: [patientId], references: [id])│   │   ├── auth/3. **Scalability**: Easy to add new components in appropriate folders

  note          Note?

│   │   │   ├── LoginPage.tsx            # Formulário de login4. **Clean Imports**: Index files allow clean named exports

  @@index([patientId, date])

  @@index([status])│   │   │   └── index.ts5. **Documentation**: All docs in one place

}

```│   │   │6. **Maintainability**: Easy to locate and update components



### Note (Nota Clínica)│   │   ├── common/                      # Componentes compartilhados

```prisma

model Note {│   │   │   ├── AlertModal.tsx           # Modal de alerta reutilizável## 🚀 Routes

  id           String    @id @default(cuid())

  sessionId    String    @unique│   │   │   ├── LoadingSpinner.tsx       # Spinner de loading

  contentJson  String    // JSON estruturado da nota

  aiGenerated  Boolean   @default(false)│   │   │   ├── Modal.tsx                # Modal genérico| Route | Component | Description |

  aiModel      String?   // Ex: "gpt-4o"

  aiPromptUsed String?   // Prompt usado (auditoria)│   │   │   ├── RevealOnScroll.tsx       # Animação ao scroll|-------|-----------|-------------|

  reviewedBy   String?   // userId que revisou (futuro)

  reviewedAt   DateTime?│   │   │   └── index.ts| `/` | Home | Landing page |

  createdAt    DateTime  @default(now())

  updatedAt    DateTime  @updatedAt│   │   │| `/login` | LoginPage | Authentication |

  session      Session   @relation(fields: [sessionId], references: [id])

}│   │   ├── dashboard/                   # Componentes do Dashboard| `/dashboard` | Dashboard | Main dashboard |

```

│   │   │   ├── DashboardLayout.tsx      # Layout principal (v2 card-based)| `/dashboard/new-session` | NewSessionFlow | Create new session |

### HistorySummary (Resumo do Histórico)

```prisma│   │   │   ├── Sidebar.tsx              # Sidebar de navegação

model HistorySummary {

  id          String   @id @default(cuid())│   │   │   ├── FilterBar.tsx            # Barra de filtros## 📝 Notes

  patientId   String   @unique

  content     String   // Resumo gerado pela IA│   │   │   ├── SessionCard.tsx          # Card individual de sessão

  aiModel     String   // Modelo usado (ex: "gpt-4o")

  isPinned    Boolean  @default(false)  // Se está fixado│   │   │   ├── SessionCards.tsx         # Grid de cards- All components use TypeScript for type safety

  sessionsIds String   // IDs das sessões incluídas (JSON array)

  createdAt   DateTime @default(now())│   │   │   ├── SessionListView.tsx      # Visualização em lista- Tailwind CSS for styling with custom configuration

  updatedAt   DateTime @updatedAt

  patient     Patient  @relation(fields: [patientId], references: [id])│   │   │   ├── SessionTable.tsx         # Visualização em tabela- lucide-react for icons throughout the app

}

```│   │   │   ├── SessionList.tsx          # Gerenciador de sessões (legacy)- Next.js 15 with App Router architecture



## 🔌 APIs Implementadas│   │   │   ├── NewSessionFlow.tsx       # Fluxo de nova sessão

│   │   │   ├── NoteViewModal.tsx        # Modal de visualização de nota

### Pacientes (`/api/patients`)│   │   │   ├── Pagination.tsx           # Componente de paginação

- **GET** `/api/patients` - Listar todos os pacientes│   │   │   ├── types.ts                 # TypeScript types

- **POST** `/api/patients` - Criar novo paciente│   │   │   └── index.ts

- **GET** `/api/patients/[id]` - Buscar paciente por ID│   │   │

- **PUT** `/api/patients/[id]` - Atualizar paciente│   │   ├── landing/                     # Landing Page

- **DELETE** `/api/patients/[id]` - Excluir paciente│   │   │   ├── Hero.tsx                 # Seção hero com animações

- **GET** `/api/patients/[id]/record` - Prontuário completo│   │   │   ├── Features.tsx             # Cards de funcionalidades

- **GET** `/api/patients/[id]/sessions` - Sessões do paciente│   │   │   ├── Testimonials.tsx         # Depoimentos

- **GET** `/api/patients/[id]/history-summary` - Resumo do histórico│   │   │   └── index.ts

- **POST** `/api/patients/[id]/history-summary` - Gerar novo resumo│   │   │

- **PATCH** `/api/patients/[id]/history-summary` - Editar/Fixar resumo│   │   ├── layout/                      # Componentes de layout

- **DELETE** `/api/patients/[id]/history-summary` - Excluir resumo│   │   │   ├── Header.tsx               # Header com navegação

│   │   │   ├── Footer.tsx               # Footer

### Sessões (`/api/sessions`)│   │   │   └── index.ts

- **GET** `/api/sessions` - Listar sessões (com filtros)│   │   │

- **POST** `/api/sessions` - Criar sessão temporária (upload)│   │   ├── patients/                    # Componentes de Pacientes

- **GET** `/api/sessions/[id]` - Buscar sessão por ID│   │   │   ├── PatientsView.tsx         # Visualização principal

- **PUT** `/api/sessions/[id]` - Atualizar sessão│   │   │   ├── PatientsList.tsx         # Lista de pacientes

- **DELETE** `/api/sessions/[id]` - Excluir sessão│   │   │   ├── PatientModal.tsx         # Modal de cadastro/edição

- **POST** `/api/sessions/[id]/process` - Processar sessão existente│   │   │   ├── PatientRecord.tsx        # Prontuário completo

- **POST** `/api/sessions/[id]/audio` - Upload de áudio│   │   │   └── index.ts

- **POST** `/api/sessions/process-temp` - ⭐ Processamento temporário (SEM DB)│   │   │

- **POST** `/api/sessions/save` - ⭐ Salvar sessão completa no prontuário│   │   └── session/                     # Componentes de Sessão

│   │       ├── SessionView.tsx          # Gravação de sessão

### IA (`/api/ai`)│   │       ├── SessionSummary.tsx       # Resumo da sessão

- **POST** `/api/ai/summarize` - Gerar resumo com IA│   │       ├── SessionSummary_fullscreen.tsx  # Resumo fullscreen

│   │       ├── TranscriptionPanel.tsx   # Painel de transcrição

## 🎨 Sistema de Design│   │       ├── PatientSelector.tsx      # Seletor de paciente

│   │       ├── NoteAIDisclaimer.tsx     # Disclaimer de IA

### Paleta de Cores│   │       └── index.ts

Definida em `src/styles/colors.ts` e utilizada globalmente:│   │

│   ├── server/                          # 🔧 Server-side modules

- **Primária (Indigo):** `from-[#4F46E5] to-[#6366F1]`│   │   ├── db.ts                        # Prisma client

- **Sucesso (Verde):** `#16A34A`, `#DCFCE7`│   │   ├── openai.ts                    # OpenAI client + configs

- **Atenção (Amarelo):** `#B45309`, `#FEF3C7`│   │   ├── transcription.ts             # Whisper transcription

- **Erro (Vermelho):** `#DC2626`, `#FEE2E2`│   │   ├── note-generation.ts           # GPT-4o note generation

- **Neutros:**│   │   └── storage.ts                   # File storage utilities

  - Fundo: `#F7F7F7`, `#F8FAFC`│   │

  - Texto: `#0F172A`, `#475569`, `#64748B`│   └── styles/

  - Bordas: `#E2E8F0`, `#CBD5E1`│       └── colors.ts                    # Paleta de cores do projeto

│

### Componentes de Design├── uploads/                             # Arquivos uploadados (gitignored)

- **Cards:** `rounded-[24px]` a `rounded-[32px]`│   └── audio/                           # Áudios das sessões

- **Sombras:** `shadow-[0_28px_65px_-46px_rgba(79,70,229,0.45)]`│

- **Glassmorphism:** `backdrop-blur`, `bg-white/70`├── temp/                                # Arquivos temporários (gitignored)

- **Gradientes:** Utilizados em botões, badges e backgrounds│

├── .data/                               # Dados locais (gitignored)

## 🔄 Fluxos Principais│   └── audio/                           # Storage local de áudio

│

### Fluxo de Gravação de Sessão (Duas Fases - CRÍTICO)├── .eslintrc.json                       # Configuração ESLint

├── .gitignore                           # Arquivos ignorados pelo Git

⚠️ **Sessões são criadas APENAS após revisão do usuário**├── next-env.d.ts                        # Types do Next.js

├── next.config.js                       # Configuração do Next.js

#### Fase 1: Processamento Temporário (SEM salvar no banco)├── package.json                         # Dependências e scripts

```├── package-lock.json                    # Lockfile do npm

1. Usuário acessa /dashboard/new-session├── postcss.config.js                    # Configuração PostCSS

2. Seleciona paciente (NÃO cria sessão ainda)├── README.md                            # README principal do projeto

3. Redireciona para /dashboard/session com patientId├── tailwind.config.ts                   # Configuração Tailwind CSS

4. Inicia gravação de áudio (MediaRecorder API)└── tsconfig.json                        # Configuração TypeScript

5. Finaliza gravação```

6. Chama POST /api/sessions/process-temp

   - Salva áudio em /temp (temporário)## 🗄️ Modelo de Dados (Prisma Schema)

   - Transcreve com Whisper-1

   - Gera nota com GPT-4o### Patient (Paciente)

   - NÃO salva no banco```prisma

   - Retorna: transcrição + notamodel Patient {

7. Exibe SessionSummary para revisão  id              String           @id @default(cuid())

   - Usuário pode editar todos os campos  name            String

```  email           String?          @unique

  phone           String?

#### Fase 2: Salvamento Definitivo (Criação no banco)  cpf             String?          @unique

```  birthDate       DateTime?

8. Usuário clica em "Salvar Sessão"  gender          String?

9. Chama POST /api/sessions/save  // Endereço

   - Move áudio de /temp para /uploads/audio/  street          String?

   - Cria Session com status 'completed'  number          String?

   - Cria Note vinculada  complement      String?

   - Tudo em transação atômica  neighborhood    String?

10. ✅ ÚNICA criação de sessão no banco  city            String?

11. Redireciona para /dashboard  state           String?

```  zipCode         String?

  createdAt       DateTime         @default(now())

### Fluxo de Visualização do Prontuário  updatedAt       DateTime         @updatedAt

1. Acessa `/dashboard/patients/[id]`  sessions        Session[]

2. Componente `PatientRecord` carrega via:  historySummary  HistorySummary?

   - `/api/patients/[id]/record` - Dados + sessões + notas}

   - `/api/patients/[id]/history-summary` - Resumo (se existir)```

3. Exibe informações do paciente

4. Lista sessões ordenadas por data (desc)### Session (Sessão)

5. Cada sessão expansível mostra nota estruturada completa```prisma

6. Opção de gerar/atualizar resumo clínico com IAmodel Session {

7. Export de notas individuais ou prontuário completo em PDF  id            String   @id @default(cuid())

  patientId     String

## 🧪 VS Code Tasks  date          DateTime @default(now())

  durationMin   Int?

Configuradas em `.vscode/tasks.json`:  sessionType   String?  // Ex: "Avaliação inicial", "Retorno"

  specialty     String?  // Ex: "Fisioterapia Ortopédica"

### Install dependencies  motivation    String?  // Motivação/objetivo da consulta

```json  audioUrl      String?

{  audioSize     Int?     // tamanho em bytes

  "label": "Install dependencies",  transcription String?  // texto completo da transcrição

  "type": "shell",  status        String   @default("recording")

  "command": "npm",                         // Valores: recording | transcribing | generating | completed | error

  "args": ["install"]  errorMessage  String?

}  createdAt     DateTime @default(now())

```  updatedAt     DateTime @updatedAt

  patient       Patient  @relation(fields: [patientId], references: [id])

### Dev server  note          Note?

```json

{  @@index([patientId, date])

  "label": "Dev server",  @@index([status])

  "type": "shell",}

  "command": "npm",```

  "args": ["run", "dev"],

  "isBackground": true### Note (Nota Clínica)

}```prisma

```model Note {

  id           String    @id @default(cuid())

**Como usar:** `Ctrl+Shift+P` → "Run Task" → Selecionar task  sessionId    String    @unique

  contentJson  String    // JSON estruturado da nota

## 📦 Scripts NPM  aiGenerated  Boolean   @default(false)

  aiModel      String?   // Ex: "gpt-4o"

```json  aiPromptUsed String?   // Prompt usado (auditoria)

{  reviewedBy   String?   // userId que revisou (futuro)

  "dev": "next dev",           // Servidor de desenvolvimento  reviewedAt   DateTime?

  "build": "next build",       // Build de produção  createdAt    DateTime  @default(now())

  "start": "next start",       // Servidor de produção  updatedAt    DateTime  @updatedAt

  "lint": "next lint"          // Linting  session      Session   @relation(fields: [sessionId], references: [id])

}}

``````



## 🔐 Variáveis de Ambiente### HistorySummary (Resumo do Histórico)

```prisma

Configurar em `.env`:model HistorySummary {

  id          String   @id @default(cuid())

```env  patientId   String   @unique

# Database  content     String   // Resumo gerado pela IA

DATABASE_URL="file:./dev.db"  aiModel     String   // Modelo usado (ex: "gpt-4o")

  isPinned    Boolean  @default(false)  // Se está fixado

# OpenAI  sessionsIds String   // IDs das sessões incluídas (JSON array)

OPENAI_API_KEY="sk-..."  createdAt   DateTime @default(now())

  updatedAt   DateTime @updatedAt

# Next.js  patient     Patient  @relation(fields: [patientId], references: [id])

NEXT_PUBLIC_APP_URL="http://localhost:3000"}

``````



## 📝 Convenções de Código## 🔌 APIs Implementadas



### Nomenclatura### Pacientes (`/api/patients`)

- **Componentes:** PascalCase (`SessionView.tsx`)- **GET** `/api/patients` - Listar todos os pacientes

- **Utilitários:** camelCase (`transcription.ts`)- **POST** `/api/patients` - Criar novo paciente

- **Tipos:** PascalCase + Interface/Type (`DashboardSession`)- **GET** `/api/patients/[id]` - Buscar paciente por ID

- **Constantes:** UPPER_SNAKE_CASE (`WHISPER_MODEL`)- **PUT** `/api/patients/[id]` - Atualizar paciente

- **DELETE** `/api/patients/[id]` - Excluir paciente

### Estrutura de Componentes- **GET** `/api/patients/[id]/record` - Prontuário completo

```typescript- **GET** `/api/patients/[id]/sessions` - Sessões do paciente

'use client'; // Se necessário- **GET** `/api/patients/[id]/history-summary` - Resumo do histórico

- **POST** `/api/patients/[id]/history-summary` - Gerar novo resumo

import React from 'react';- **PATCH** `/api/patients/[id]/history-summary` - Editar/Fixar resumo

import { /* dependências */ } from 'pacote';- **DELETE** `/api/patients/[id]/history-summary` - Excluir resumo



interface ComponentProps {### Sessões (`/api/sessions`)

  // Props tipadas- **GET** `/api/sessions` - Listar sessões (com filtros)

}- **POST** `/api/sessions` - Criar sessão temporária (upload)

- **GET** `/api/sessions/[id]` - Buscar sessão por ID

const Component: React.FC<ComponentProps> = ({ props }) => {- **PUT** `/api/sessions/[id]` - Atualizar sessão

  // Estados- **DELETE** `/api/sessions/[id]` - Excluir sessão

  // Efeitos- **POST** `/api/sessions/[id]/process` - Processar sessão existente

  // Handlers- **POST** `/api/sessions/[id]/audio` - Upload de áudio

  // Renderização- **POST** `/api/sessions/process-temp` - ⭐ Processamento temporário (sem DB)

  - **POST** `/api/sessions/save` - ⭐ Salvar sessão completa no prontuário

  return (

    <div>### IA (`/api/ai`)

      {/* JSX */}- **POST** `/api/ai/summarize` - Gerar resumo com IA

    </div>

  );## 🎨 Sistema de Design

};

### Paleta de Cores

export default Component;Definida em `src/styles/colors.ts` e utilizada globalmente:

```

- **Primária (Indigo):** `from-[#4F46E5] to-[#6366F1]`

### API Routes- **Sucesso (Verde):** `#16A34A`, `#DCFCE7`

```typescript- **Atenção (Amarelo):** `#B45309`, `#FEF3C7`

import { NextRequest, NextResponse } from 'next/server';- **Erro (Vermelho):** `#DC2626`, `#FEE2E2`

import { prisma } from '@/server/db';- **Neutros:**

  - Fundo: `#F7F7F7`, `#F8FAFC`

export const runtime = 'nodejs';  - Texto: `#0F172A`, `#475569`, `#64748B`

  - Bordas: `#E2E8F0`, `#CBD5E1`

export async function GET(req: NextRequest) {

  try {### Componentes de Design

    // Lógica- **Cards:** `rounded-[24px]` a `rounded-[32px]`

    return NextResponse.json(data);- **Sombras:** `shadow-[0_28px_65px_-46px_rgba(79,70,229,0.45)]`

  } catch (error) {- **Glassmorphism:** `backdrop-blur`, `bg-white/70`

    return NextResponse.json(- **Gradientes:** Utilizados em botões, badges e backgrounds

      { error: 'Mensagem de erro' },

      { status: 500 }## 🔄 Fluxos Principais

    );

  }### Fluxo de Gravação de Sessão

}1. Usuário acessa `/dashboard/new-session`

```2. Seleciona paciente (`PatientSelector`)

3. Inicia gravação (`SessionView`)

## 🚀 Próximos Passos4. Durante gravação: captura áudio via MediaRecorder API

5. Ao finalizar: chama `/api/sessions/process-temp`

- [ ] Autenticação com NextAuth.js   - Transcreve com Whisper

- [ ] Multi-tenancy (múltiplos fisioterapeutas)   - Gera nota com GPT-4o

- [ ] Agendamento de consultas   - **NÃO salva no banco**

- [ ] Integração com calendário6. Exibe `SessionSummary` para revisão

- [ ] Notificações push7. Ao confirmar: chama `/api/sessions/save`

- [ ] Export para sistemas de prontuário eletrônico (PEP)   - Cria Session com status `completed`

- [ ] Dashboard analytics avançado   - Cria Note vinculada

- [ ] Relatórios personalizados   - Salva áudio em `/uploads/audio/`



---### Fluxo de Visualização do Prontuário

1. Acessa `/dashboard/patients/[id]`

[← Voltar para Documentação](../README.md)2. Componente `PatientRecord` carrega via:

   - `/api/patients/[id]/record` - Dados + sessões + notas
   - `/api/patients/[id]/history-summary` - Resumo (se existir)
3. Exibe informações do paciente
4. Lista sessões ordenadas por data (desc)
5. Cada sessão expansível mostra nota estruturada completa
6. Opção de gerar/atualizar resumo clínico com IA
7. Export de notas individuais ou prontuário completo em PDF

## 🧪 VS Code Tasks

Configuradas em `.vscode/tasks.json`:

### Install dependencies
```json
{
  "label": "Install dependencies",
  "type": "shell",
  "command": "npm",
  "args": ["install"]
}
```

### Dev server
```json
{
  "label": "Dev server",
  "type": "shell",
  "command": "npm",
  "args": ["run", "dev"],
  "isBackground": true
}
```

**Como usar:** `Ctrl+Shift+P` → "Run Task" → Selecionar task

## 📦 Scripts NPM

```json
{
  "dev": "next dev",           // Servidor de desenvolvimento
  "build": "next build",       // Build de produção
  "start": "next start",       // Servidor de produção
  "lint": "next lint"          // Linting
}
```

## 🔐 Variáveis de Ambiente

Configurar em `.env`:

```env
# Database
DATABASE_URL="file:./dev.db"

# OpenAI
OPENAI_API_KEY="sk-..."

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 📝 Convenções de Código

### Nomenclatura
- **Componentes:** PascalCase (`SessionView.tsx`)
- **Utilitários:** camelCase (`transcription.ts`)
- **Tipos:** PascalCase + Interface/Type (`DashboardSession`)
- **Constantes:** UPPER_SNAKE_CASE (`WHISPER_MODEL`)

### Estrutura de Componentes
```typescript
'use client'; // Se necessário

import React from 'react';
import { /* dependências */ } from 'pacote';

interface ComponentProps {
  // Props tipadas
}

const Component: React.FC<ComponentProps> = ({ props }) => {
  // Estados
  // Efeitos
  // Handlers
  // Renderização
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default Component;
```

### API Routes
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    // Lógica
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Mensagem de erro' },
      { status: 500 }
    );
  }
}
```

## 🚀 Próximos Passos

- [ ] Autenticação com NextAuth.js
- [ ] Multi-tenancy (múltiplos fisioterapeutas)
- [ ] Agendamento de consultas
- [ ] Integração com calendário
- [ ] Notificações push
- [ ] Export para sistemas de prontuário eletrônico (PEP)
- [ ] Dashboard analytics avançado
- [ ] Relatórios personalizados

---

[← Voltar para Documentação](../README.md)
