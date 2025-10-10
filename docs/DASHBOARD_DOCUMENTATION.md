# Dashboard Component Documentation

## Overview
The Dashboard is the main post-login interface for PhysioNote.AI, featuring a modern two-column layout for managing physiotherapy sessions.

## Component Structure

### 1. Dashboard.tsx (Parent Component)
- **Purpose**: Orchestrates the Sidebar and SessionList components
- **Features**:
  - Responsive layout with grid system
  - Mobile hamburger menu integration
  - State management for sidebar toggle
  - Smooth animations on load

### 2. Sidebar.tsx
- **Purpose**: Fixed navigation panel for app-wide navigation
- **Features**:
  - Logo and branding at top
  - Navigation items: Dashboard, Settings, Help
  - Active state highlighting (`bg-[#5A9BCF]/10`)
  - Logout button at bottom
  - Mobile responsive with overlay and slide animation
  - Collapses on mobile, fixed on desktop

**Navigation Items**:
```typescript
- Dashboard (LayoutDashboard icon) - Active by default
- Settings (Settings icon)
- Help (HelpCircle icon)
- Logout (LogOut icon) - Red hover state
```

### 3. SessionList.tsx
- **Purpose**: Displays and manages physiotherapy session records
- **Features**:
  - Session counter: "Mostrando X de Y sessões"
  - **"+ Nova Sessão"** CTA button (top-right)
  - Responsive table/card layout
  - Status badges with color coding
  - LGPD compliance indicators
  - Action buttons (View Note, Export)

## Data Model

### Session Interface
```typescript
interface Session {
  id: string;
  session_datetime: string;        // ISO 8601 format
  patient_name: string;
  status: 'completed' | 'processing' | 'error';
  is_anonymized: boolean;          // LGPD compliance
  duration_minutes: number;
}
```

## Visual Design

### Color Palette
- **Primary**: `#5A9BCF` (Blue) - CTAs, active states, icons
- **Hover**: `#2C5F8D` (Blue Dark)
- **Background**: `#F7F7F7` (Neutral Light)
- **Text**: `#333333` (Headings), `#666666` (Body)

### Status Badges
- **Completed**: `bg-green-500` - "Concluída"
- **Processing**: `bg-yellow-500` - "Processando"
- **Error**: `bg-red-500` - "Erro"

### LGPD Compliance Badge
- **Anonymized**: Green Shield icon + "LGPD" text
- **Pending**: Gray Shield icon + "Pendente" text

## Animations

### Entry Animations (CSS Keyframes)
```css
- animate-fade-in: Fade in with opacity transition
- animate-slide-up: Slide up from bottom
- Staggered delays: 0.1s per item in list
```

### Hover Effects
- **CTA Button**: `hover:scale-105` + shadow elevation
- **Table Rows**: `hover:bg-gray-50` background change
- **Action Buttons**: `hover:bg-[#5A9BCF]/10` background
- **Sidebar Items**: `hover:bg-gray-100` + blue text

## Responsive Behavior

### Desktop (≥1024px)
- Two-column layout: Fixed sidebar (256px) + Flexible content
- Table view with 6 columns
- All icons and actions visible

### Mobile (<1024px)
- Sidebar collapses with hamburger menu
- Mobile header with centered logo
- Card-based layout instead of table
- Touch-friendly action buttons

### Breakpoints
```css
- sm: 640px (Mobile)
- md: 768px (Tablet)
- lg: 1024px (Desktop)
```

## Action Handlers

### Session Actions
```typescript
handleNewSession()      // Create new session
handleViewNote(id)      // View session note (disabled if not completed)
handleExport(id)        // Export session data (disabled if not completed)
```

### Navigation Actions
```typescript
toggleSidebar()         // Open/close mobile sidebar
Logout                  // Redirect to /login
```

## Routes
- `/dashboard` - Main dashboard view
- `/settings` - User settings (placeholder)
- `/help` - Help center (placeholder)

## Integration Points

### Required Implementations
1. **API Integration**: Replace mock data with real fetch calls
2. **Authentication**: Implement proper auth check and token management
3. **Export Functionality**: PDF/CSV export for session notes
4. **Session Creation**: Modal or page for recording new sessions
5. **Note Viewer**: Full-screen note viewer component

### Future Enhancements
- Filters and search for sessions
- Pagination for large datasets
- Bulk actions (multi-select)
- Real-time status updates (WebSocket)
- Session statistics dashboard

## File Structure
```
src/
├── app/
│   └── dashboard/
│       └── page.tsx              # Route wrapper
├── components/
│   ├── Dashboard.tsx             # Main container
│   ├── Sidebar.tsx               # Navigation sidebar
│   └── SessionList.tsx           # Session table/cards
```

## Dependencies
- `lucide-react`: Icons (LayoutDashboard, Settings, HelpCircle, FileText, Download, Shield, Menu, Plus, etc.)
- `next/link`: Client-side navigation
- `next/navigation`: useRouter for redirects

## Performance Optimizations
- Static rendering where possible
- Lazy loading for session list
- Debounced search/filters (when implemented)
- Optimistic UI updates for status changes
