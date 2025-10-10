# Animações da Hero Section - PhysioNote.AI

## 🎬 Animações de Entrada Implementadas

Este documento descreve as animações elegantes e sutis adicionadas à seção Hero (primeira seção da página).

## 📋 Elementos Animados

### 1. **Título Principal (H1)**
- **Classe**: `animate-hero-title`
- **Efeito**: Fade-in + Slide up suave
- **Duração**: 1 segundo
- **Delay**: 0s (primeiro elemento a aparecer)
- **Movimento**: 40px de baixo para cima

```tsx
className="opacity-0 animate-hero-title"
```

**Detalhes da Animação:**
```css
0%   → opacity: 0, translateY(40px)
100% → opacity: 1, translateY(0)
```

### 2. **Subtítulo (Descrição)**
- **Classe**: `animate-hero-subtitle`
- **Efeito**: Fade-in + Slide up suave
- **Duração**: 1 segundo
- **Delay**: 0.3s (aparece após o título)
- **Movimento**: 30px de baixo para cima

```tsx
className="opacity-0 animate-hero-subtitle"
```

**Detalhes da Animação:**
```css
0%   → opacity: 0, translateY(30px)
100% → opacity: 1, translateY(0)
```

### 3. **Botão "Comece Agora" (Primário)**
- **Classe**: `animate-hero-button-primary`
- **Efeito**: Fade-in + Slide up + Efeito de crescimento
- **Duração**: 0.8 segundo
- **Delay**: 0.6s
- **Movimento**: 20px de baixo para cima com bounce

```tsx
className="opacity-0 animate-hero-button-primary"
```

**Detalhes da Animação:**
```css
0%   → opacity: 0, translateY(20px) scale(0.9)
60%  → translateY(-5px) scale(1.05)    // Bounce up
100% → opacity: 1, translateY(0) scale(1)
```

### 4. **Botão "Veja como Funciona" (Secundário)**
- **Classe**: `animate-hero-button-secondary`
- **Efeito**: Fade-in + Slide up + Efeito de crescimento
- **Duração**: 0.8 segundo
- **Delay**: 0.75s (150ms após o primeiro botão)
- **Movimento**: 20px de baixo para cima com bounce

```tsx
className="opacity-0 animate-hero-button-secondary"
```

**Detalhes da Animação:**
```css
0%   → opacity: 0, translateY(20px) scale(0.9)
60%  → translateY(-5px) scale(1.05)    // Bounce up
100% → opacity: 1, translateY(0) scale(1)
```

### 5. **Imagem/Ilustração (Lado Direito)**
- **Classe**: `animate-hero-image`
- **Efeito**: Fade-in + Slide da direita + Scale up
- **Duração**: 1.2 segundos
- **Delay**: 0.4s
- **Movimento**: 30px da direita + crescimento sutil

```tsx
className="opacity-0 animate-hero-image"
```

**Detalhes da Animação:**
```css
0%   → opacity: 0, translateX(30px) scale(0.95)
100% → opacity: 1, translateX(0) scale(1)
```

## 🎯 Sequência de Animação

```
Tempo | Elemento
------|------------------------------------------
0.0s  | Título começa a aparecer
0.3s  | Subtítulo começa a aparecer
0.4s  | Imagem começa a aparecer
0.6s  | Botão "Comece Agora" começa a aparecer
0.75s | Botão "Veja como Funciona" começa a aparecer
------|------------------------------------------
1.5s  | Todas as animações completadas
```

## ⚙️ Configuração Técnica

### Tailwind Config (tailwind.config.ts)

```typescript
animation: {
  'hero-title': 'heroTitle 1s ease-out forwards',
  'hero-subtitle': 'heroSubtitle 1s ease-out 0.3s forwards',
  'hero-button-primary': 'heroButtonPrimary 0.8s ease-out 0.6s forwards',
  'hero-button-secondary': 'heroButtonSecondary 0.8s ease-out 0.75s forwards',
  'hero-image': 'heroImage 1.2s ease-out 0.4s forwards',
}
```

### Keyframes Personalizados

Todas as animações usam keyframes personalizados definidos no Tailwind config:

- **heroTitle**: Movimento vertical 40px
- **heroSubtitle**: Movimento vertical 30px
- **heroButtonPrimary**: Movimento vertical 20px + bounce + scale
- **heroButtonSecondary**: Movimento vertical 20px + bounce + scale
- **heroImage**: Movimento horizontal 30px + scale

### Otimizações de Performance (globals.css)

```css
.animate-hero-* {
  will-change: opacity, transform;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  animation-fill-mode: forwards;
}
```

## 🎨 Características das Animações

### Suavidade e Elegância
- **Timing function**: `ease-out` - desaceleração suave no final
- **Fade-in gradual**: Opacidade de 0 a 1
- **Movimento sutil**: Distâncias curtas (20-40px)
- **Efeito bounce**: Apenas nos botões para chamar atenção

### Hierarquia Visual
1. **Título** (0s) - Primeira impressão
2. **Subtítulo** (0.3s) - Contexto adicional
3. **Imagem** (0.4s) - Visual de suporte
4. **Botões** (0.6-0.75s) - Call-to-action

### Performance
- ✅ GPU-accelerated (transform + opacity)
- ✅ `will-change` para otimização
- ✅ `backface-visibility: hidden` para suavidade
- ✅ `animation-fill-mode: forwards` para manter estado final

## 📱 Responsividade

As animações funcionam perfeitamente em todos os dispositivos:
- **Desktop**: Animação completa
- **Tablet**: Animação completa
- **Mobile**: Animação completa (adaptada ao viewport)

## 🎭 Experiência do Usuário

### Benefícios
- ✨ **Entrada elegante**: Primeira impressão profissional
- 🎯 **Hierarquia clara**: Usuário entende a ordem de importância
- 💎 **Atenção nos CTAs**: Botões aparecem por último com bounce
- 🌊 **Fluidez natural**: Sequência orgânica e não robótica
- ⚡ **Performance otimizada**: Animações suaves sem lag

### Timing Perfeito
- **1-1.5s total**: Tempo ideal para não cansar o usuário
- **Stagger de 150-300ms**: Espaçamento natural entre elementos
- **Bounce sutil**: 5% de scale para efeito de "chegada"

## 🔧 Customização

Para ajustar as animações:

### Mudar Duração
```typescript
// Em tailwind.config.ts
'hero-title': 'heroTitle 1.5s ease-out forwards', // Mais lento
```

### Ajustar Delay
```typescript
// Em tailwind.config.ts
'hero-subtitle': 'heroSubtitle 1s ease-out 0.5s forwards', // Delay maior
```

### Modificar Distância
```typescript
// No keyframe
heroTitle: {
  '0%': { transform: 'translateY(60px)' }, // Mais movimento
}
```

### Remover Bounce
```typescript
// Remover frame intermediário
heroButtonPrimary: {
  '0%': { opacity: '0', transform: 'scale(0.9)' },
  // '60%': { ... } ← Remover esta linha
  '100%': { opacity: '1', transform: 'scale(1)' },
}
```

## 🚀 Resultado Final

A seção Hero agora tem uma entrada **cinematográfica e profissional**:

1. 📰 Título surge elegantemente de baixo
2. 📝 Subtítulo complementa suavemente
3. 🖼️ Imagem desliza da lateral
4. 🎯 Botões aparecem com bounce chamativo
5. ✨ Toda a sequência em ~1.5 segundos

---

**Última atualização**: 8 de outubro de 2025  
**Versão**: 2.0.0