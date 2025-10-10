# PhysioNote.AI - Project Structure

## 📁 Organized Folder Structure

```
10_PhysioNotes.AI/
├── .github/
│   └── copilot-instructions.md          # GitHub Copilot configuration
│
├── docs/                                 # 📚 All Documentation
│   ├── README.md                        # Documentation index
│   ├── ANIMATIONS.md                    # General animations
│   ├── HERO_ANIMATIONS.md               # Hero section animations
│   ├── HEADER_ANIMATIONS.md             # Header animations
│   ├── FEATURES_HOVER_ANIMATIONS.md     # Features hover effects
│   └── DASHBOARD_DOCUMENTATION.md       # Dashboard architecture
│
├── src/
│   ├── app/                             # 🚀 Next.js App Router
│   │   ├── dashboard/                   # Dashboard routes
│   │   │   ├── page.tsx                # Main dashboard page
│   │   │   └── new-session/            # New session flow
│   │   │       └── page.tsx            # New session page
│   │   ├── login/                      # Authentication routes
│   │   │   └── page.tsx                # Login page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Home page
│   │   └── globals.css                 # Global styles
│   │
│   └── components/                      # 🧩 React Components
│       ├── auth/                        # 🔐 Authentication Components
│       │   ├── LoginPage.tsx           # Login form component
│       │   └── index.ts                # Auth exports
│       │
│       ├── dashboard/                   # 📊 Dashboard Components (v2 Card-Based)
│       │   ├── DashboardLayout.tsx     # Main dashboard container
│       │   ├── Sidebar.tsx             # Navigation sidebar (redesigned)
│       │   ├── SessionCard.tsx         # Individual session card
│       │   ├── SessionCards.tsx        # Cards grid container
│       │   ├── SessionList.tsx         # Session management table (legacy)
│       │   ├── NewSessionFlow.tsx      # New session form
│       │   └── index.ts                # Dashboard exports
│       │
│       ├── landing/                     # 🏠 Landing Page Components
│       │   ├── HeroSection.tsx         # Hero section
│       │   ├── Features.tsx            # Features showcase
│       │   ├── Testimonials.tsx        # Customer testimonials
│       │   └── index.ts                # Landing exports
│       │
│       └── layout/                      # 🎨 Layout Components
│           ├── Header.tsx              # Navigation header
│           ├── Footer.tsx              # Footer with links
│           └── index.ts                # Layout exports
│
├── .eslintrc.json                      # ESLint configuration
├── next.config.js                      # Next.js configuration
├── package.json                        # Dependencies
├── postcss.config.js                   # PostCSS configuration
├── README.md                           # Main project README
├── tailwind.config.ts                  # Tailwind CSS configuration
└── tsconfig.json                       # TypeScript configuration
```

## 🎯 Component Organization

### Auth Components (`src/components/auth/`)
- **LoginPage.tsx**: Complete login form with validation

### Dashboard Components (`src/components/dashboard/`) ⭐ **v2 Card-Based**
- **DashboardLayout.tsx**: Main container with responsive grid (DEFAULT EXPORT)
- **Sidebar.tsx**: Fixed sidebar with smooth animations
- **SessionCard.tsx**: Individual session card with status badges
- **SessionCards.tsx**: Grid container with staggered animations
- **SessionList.tsx**: Legacy table view (mantido para compatibilidade)
- **NewSessionFlow.tsx**: New session creation form with specialty selection

### Landing Components (`src/components/landing/`)
- **HeroSection.tsx**: Main hero section with CTA
- **Features.tsx**: Product features with hover animations
- **Testimonials.tsx**: Customer testimonials with ratings

### Layout Components (`src/components/layout/`)
- **Header.tsx**: Navigation header with logo
- **Footer.tsx**: Footer with legal links and social media

## 📦 Import Examples

### Using Default Export (Dashboard v2)
```typescript
// Dashboard Layout (recommended)
import DashboardLayout from '@/components/dashboard';
// or
import { DashboardLayout } from '@/components/dashboard';
```

### Using Named Exports
```typescript
// Landing components
import { HeroSection, Features, Testimonials } from '@/components/landing';

// Layout components
import { Header, Footer } from '@/components/layout';

// Dashboard components
import { Sidebar, SessionList, NewSessionFlow } from '@/components/dashboard';

// Auth components
import { LoginPage } from '@/components/auth';
```

### Using Default Export
```typescript
// Dashboard (default export from dashboard index)
import Dashboard from '@/components/dashboard';
```

## 🗂️ Documentation Structure

All technical documentation has been moved to the `/docs` folder:
- ✅ Centralized location for all docs
- ✅ Easy to find and maintain
- ✅ Separated from code for clarity
- ✅ Includes README with navigation

## ✨ Benefits of This Structure

1. **Clear Separation**: Components grouped by functionality
2. **Easy Navigation**: Intuitive folder names
3. **Scalability**: Easy to add new components in appropriate folders
4. **Clean Imports**: Index files allow clean named exports
5. **Documentation**: All docs in one place
6. **Maintainability**: Easy to locate and update components

## 🚀 Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page |
| `/login` | LoginPage | Authentication |
| `/dashboard` | Dashboard | Main dashboard |
| `/dashboard/new-session` | NewSessionFlow | Create new session |

## 📝 Notes

- All components use TypeScript for type safety
- Tailwind CSS for styling with custom configuration
- lucide-react for icons throughout the app
- Next.js 15 with App Router architecture
