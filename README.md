# PhysioNote.AI - Institutional Website

A modern, responsive institutional website for PhysioNote.AI - an AI-powered documentation platform for physiotherapists.

## 🚀 Features

- **Modern Design**: Clean and professional interface with smooth animations
- **Responsive Layout**: Fully optimized for desktop, tablet, and mobile devices
- **TypeScript**: Built with type safety in mind
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Next.js 15**: Latest React framework with App Router

## 🎨 Design Highlights

### Color Palette
- **Primary Blue**: #5A9BCF (buttons and interactive elements)
- **Blue Dark**: #2C5F8D (hover states and accents)
- **Neutral White**: #FFFFFF (backgrounds and highlights)
- **Neutral Light**: #F7F7F7 (secondary backgrounds)
- **Neutral Medium**: #B0B0B0 (secondary text)
- **Neutral Dark**: #333333 (main text and titles)

### Key Sections
1. **Header**: Logo, navigation menu, and login button with entrance animations
2. **Hero Section**: Main value proposition with animated entrance and clear call-to-action
3. **Features**: Four main product features with interactive hover animations
4. **Testimonials**: Customer success stories
5. **Footer**: Links, legal information, and social media
6. **Login Page**: Modern authentication interface with form validation

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

### Run with VS Code Tasks

If you're using VS Code, you can use the built-in tasks we added:

- Task: "Install dependencies" — runs npm install
- Task: "Dev server" — starts Next.js in the background

In VS Code: press Ctrl+Shift+P; type "Run Task"; select the task.

## 📱 Responsive Design

The website is fully responsive with:
- **Desktop**: Full layout with all features visible
- **Tablet**: Adjusted layouts with maintained functionality
- **Mobile**: Stacked layouts optimized for touch interaction

## 🎯 Animation Features

- **Header Animations**: Logo slides from left, nav items cascade from top, login button from right
- **Hero Section**: Sequential entrance with title, subtitle, and buttons with bounce effect
- **Features Cards**: 5-layer hover animations with icon pulse, rotation, glow, and color transitions
- **Fade-in animations**: Smooth entrance effects for all sections
- **Hover effects**: Interactive button and card states with scale and shadow transitions
- **Micro-interactions**: Subtle feedback for user actions throughout the interface
- **Login Page**: Form elements with focus states and animated transitions

## 🔧 Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── login/          # Login page route
│   │   └── page.tsx    # Login route handler
│   ├── dashboard/      # Dashboard route (post-login)
│   │   └── page.tsx    # Dashboard route handler
│   ├── globals.css     # Global styles and animations
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── Header.tsx      # Navigation and logo with animations
│   ├── HeroSection.tsx # Main landing section with entrance animations
│   ├── Features.tsx    # Product features with hover animations
│   ├── Testimonials.tsx # Customer testimonials with ratings
│   ├── Footer.tsx      # Footer with links and social media
│   ├── LoginPage.tsx   # Login form component
│   ├── Dashboard.tsx   # Main dashboard container (post-login)
│   ├── Sidebar.tsx     # Navigation sidebar with menu
│   └── SessionList.tsx # Session management table/cards
```

## 🚀 Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - UI library with client components
- **lucide-react** - Modern icon library
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization

## 📊 Key Components

### Institutional Pages
- **Home**: Landing page with hero, features, testimonials, and footer
- **Login**: Authentication interface with form validation

### Dashboard (Post-Login)
- **Dashboard**: Two-column layout with sidebar and session management
- **Sidebar**: Fixed navigation with Dashboard, Settings, Help, and Logout
- **Session List**: Interactive table/cards showing physiotherapy sessions with:
  - Status badges (Completed, Processing, Error)
  - LGPD compliance indicators
  - Action buttons (View Note, Export)
  - "Nova Sessão" CTA button

### Session Data Model
```typescript
interface Session {
  id: string;
  session_datetime: string;
  patient_name: string;
  status: 'completed' | 'processing' | 'error';
  is_anonymized: boolean;  // LGPD compliance
  duration_minutes: number;
}
```

## 📚 Documentation Files

- `ANIMATIONS.md` - Complete animation system documentation
- `HERO_ANIMATIONS.md` - Hero section animation details
- `HEADER_ANIMATIONS.md` - Header animation specifications
- `FEATURES_HOVER_ANIMATIONS.md` - Feature cards hover effects
- `DASHBOARD_DOCUMENTATION.md` - Dashboard component architecture

## 📄 License

This project is private and proprietary to PhysioNote.AI.

## 🤝 Contributing

This is a private project. For any questions or contributions, please contact the development team.

---

Built with ❤️ for Brazilian physiotherapists