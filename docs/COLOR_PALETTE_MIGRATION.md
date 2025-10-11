# Migração de Paleta de Cores - PhysioNote.AI

## 📋 Resumo da Mudança

Atualização completa da identidade visual do projeto com nova paleta de cores moderna.

### 🎨 Cores Antigas → Novas

| Elemento | Cor Antiga | Cor Nova | Código |
|----------|------------|----------|--------|
| **Primária** | #5A9BCF (azul claro) | #4F46E5 (roxo-azul) | `from-[#4F46E5]` |
| **Primária Light** | #4A8BBF | #6366F1 | `to-[#6366F1]` |
| **Texto Primário** | #333333 | #111827 | `text-[#111827]` |
| **Texto Secundário** | #666666 | #6B7280 | `text-[#6B7280]` |
| **Fundo** | Vários | #F9FAFB | `bg-[#F9FAFB]` |
| **Borda** | gray-200 | #E5E7EB | `border-[#E5E7EB]` |
| **Erro** | red-500/red-600 | #EF4444 | `text-[#EF4444]` |

## 🔄 Substituições Necessárias

### 1. Sidebar ✅ COMPLETO
- `from-[#5A9BCF]` → `from-[#4F46E5]`
- `to-[#4A8BBF]` → `to-[#6366F1]`
- `hover:bg-red-500/30` → `hover:bg-[#EF4444]/30`

### 2. PatientModal
**Input className:**
```typescript
// ANTES
focus:ring-[#5A9BCF] text-[#333333]

// DEPOIS
focus:ring-[#4F46E5] text-[#111827]
```

**Títulos e textos:**
- `text-[#333333]` → `text-[#111827]` (10 ocorrências)
- `text-[#666666]` → `text-[#6B7280]`

**Ícones:**
- `text-[#5A9BCF]` → `text-[#4F46E5]` (4 ocorrências)

**Botões:**
- `bg-[#5A9BCF]` → `bg-[#4F46E5]`
- `hover:bg-[#4A8BBF]` → `hover:bg-[#6366F1]`

### 3. PatientsList
**Buscar e substituir:**
- Badges de status
- Cores de hover
- Botões de ação

### 4. PatientsView
**Botão principal:**
- Background e hover

### 5. DashboardLayout
- Cards de sessão
- Estados de hover
- Gradientes

### 6. Componentes de Landing Page
- HeroSection
- Features
- Testimonials

## 🛠️ Script de Migração (PowerShell)

```powershell
# Substituir cores no projeto inteiro
$files = Get-ChildItem -Path "src" -Recurse -Include *.tsx,*.ts,*.css

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Substituições de cores
    $content = $content -replace '\[#5A9BCF\]', '[#4F46E5]'
    $content = $content -replace '\[#4A8BBF\]', '[#6366F1]'
    $content = $content -replace 'text-\[#333333\]', 'text-[#111827]'
    $content = $content -replace 'text-\[#666666\]', 'text-[#6B7280]'
    
    Set-Content $file.FullName -Value $content -NoNewline
}

Write-Host "Migração de cores concluída!" -ForegroundColor Green
```

## 📦 Arquivo de Cores Centralizado

Criado: `src/styles/colors.ts`

Contém todas as cores do projeto organizadas por categoria:
- primary (marca)
- success, warning, error, info (feedback)
- neutral (base)
- interaction (hover/ativo)
- gradients

## ✅ Status da Migração

### Completo
- [x] `src/styles/colors.ts` - Arquivo centralizado criado
- [x] `src/components/dashboard/Sidebar.tsx` - Sidebar atualizado
- [x] `src/components/patients/PatientModal.tsx` - inputClassName atualizado

### Pendente
- [ ] PatientModal - Atualizar todos os textos e ícones
- [ ] PatientsList - Atualizar badges e botões
- [ ] PatientsView - Atualizar botão principal
- [ ] DashboardLayout - Atualizar cards
- [ ] SessionCard - Atualizar status badges
- [ ] HeroSection - Atualizar gradientes
- [ ] Features - Atualizar ícones
- [ ] LoginPage - Atualizar formulário
- [ ] Botões globais - Atualizar bg e hover

## 🎨 Paleta Completa (Referência)

```css
/* Primária */
--primary: #4F46E5;
--primary-light: #6366F1;
--primary-dark: #4338CA;

/* Feedback */
--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;

/* Neutros */
--bg: #F9FAFB;
--card: #FFFFFF;
--text-primary: #111827;
--text-secondary: #6B7280;
--border: #E5E7EB;

/* Interação */
--hover: #EEF2FF;
--active-border: #6366F1;

/* Gradientes */
--gradient-primary: linear-gradient(90deg, #4F46E5 0%, #6366F1 100%);
--gradient-sidebar: linear-gradient(180deg, #4F46E5 0%, #6366F1 100%);
```

## 🚀 Próximos Passos

1. Executar script de migração automatizada
2. Revisar visualmente todos os componentes
3. Testar interações e estados (hover, focus, active)
4. Atualizar screenshots da documentação
5. Criar página de styleguide com nova paleta

## 📝 Notas

- A nova cor primária (#4F46E5) é mais moderna e tecnológica
- Mantém excelente contraste para acessibilidade
- Gradiente roxo-azul é tendência de 2025
- Cores de feedback seguem padrões do mercado
- Paleta é consistente com design systems modernos (Tailwind v4, Shadcn/ui)

---

**Data:** 11 de Outubro de 2025  
**Versão:** 1.0  
**Status:** 🔄 Em Progresso
