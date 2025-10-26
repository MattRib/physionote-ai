# Animações de Hover - Features Cards

## 🎨 Animações Interativas dos Cards de Características

Este documento descreve as animações sofisticadas aplicadas aos cards de características quando o usuário passa o mouse.

## 🎯 Efeitos Implementados

### 1. **Card Container (Hover Geral)** 📦

#### Movimento e Elevação
```css
transform: translateY(-12px) scale(1.05)
```
- **Lift**: Card sobe 12px (mais pronunciado)
- **Scale**: Aumenta 5%
- **Duração**: 500ms
- **Timing**: ease-out suave

#### Shadow Dinâmica
```css
box-shadow: 0 25px 50px -12px rgba(90, 155, 207, 0.25)
```
- **Cor**: Azul do tema (#5A9BCF)
- **Spread**: 50px blur com 25% opacidade
- **Efeito**: Sombra azulada profissional

#### Border e Background
```css
border: 1px solid #5A9BCF
background: gradient azul sutil
```
- Border muda de cinza para azul
- Background com gradiente azul muito sutil (5% opacity)

### 2. **Ícone (Centro do Card)** 🎨

#### Rotação e Scale
```css
transform: scale(1.1) rotate(6deg)
```
- **Scale**: 110% (10% maior)
- **Rotação**: 6 graus no sentido horário
- **Duração**: 500ms

#### Animação Pulse
```css
@keyframes iconPulse {
  0%   → scale(1) rotate(0deg)
  50%  → scale(1.15) rotate(8deg)    // Pico
  100% → scale(1.1) rotate(6deg)     // Final
}
```
- **Efeito**: Ícone "pulsa" ao hover
- **Pico**: 115% no meio da animação
- **Bounce**: Volta para 110%

#### Background do Ícone
```css
background: rgba(90, 155, 207, 0.2)  // 20% opacity
```
- Muda de 10% para 20% opacity
- Transição suave de 500ms

#### Glow Effect (Brilho)
```css
box-shadow: 
  0 0 20px rgba(90, 155, 207, 0.4),
  0 0 40px rgba(90, 155, 207, 0.2)
```
- **Inner glow**: 20px blur, 40% opacity
- **Outer glow**: 40px blur, 20% opacity
- **Cor**: Azul tema
- **Efeito**: Ícone "brilha" ao hover

#### SVG dentro do Ícone
```css
transform: scale(1.1)
```
- O SVG também escala 110%
- Transição de 500ms
- Efeito combinado com container

### 3. **Título (H3)** 📝

#### Mudança de Cor
```css
color: #333333 → #5A9BCF
```
- De cinza escuro para azul tema
- Duração: 400ms
- Timing: cubic-bezier suave

#### Transição
```tsx
className="group-hover:text-primary-blue"
```

### 4. **Descrição (Parágrafo)** 📄

#### Text Enhancement
```css
color: #B0B0B0 → #333333
transform: translateY(-2px)
```
- Texto fica mais escuro (melhor legibilidade)
- Sobe 2px sutilmente
- Duração: 300ms

### 5. **Background Animado** 🌈

#### Gradient Overlay
```css
background: linear-gradient(
  from-primary-blue/5 to-blue-700/5
)
```
- Gradiente azul muito sutil
- Transição de 500ms
- De transparente para 5% opacity

## 🎬 Sequência de Efeitos

Quando você passa o mouse:

```
0ms   ━━━━━━ Início do hover

50ms  ━━━━━━ Card começa a subir
              Border começa a ficar azul
              
100ms ━━━━━━ Ícone começa rotação
              Background gradient aparece
              
200ms ━━━━━━ Título começa a ficar azul
              Shadow intensifica
              
300ms ━━━━━━ Ícone atinge pico (115% + 8°)
              Glow effect visível
              
400ms ━━━━━━ Descrição escurece
              
500ms ━━━━━━ Todos os efeitos completados
              Ícone estabiliza em 110% + 6°
```

## 💎 Características Especiais

### Icon Pulse Animation
O ícone tem uma animação especial de "pulse":

```css
0%   → Normal
50%  → Ultrapassa (115% + 8°)
100% → Estabiliza (110% + 6°)
```

Isso cria um efeito de **energia** e **vida** ao card.

### Glow Effect (Brilho)
O ícone ganha um **brilho azulado**:
- Inner glow forte (40% opacity)
- Outer glow suave (20% opacity)
- Cria profundidade e destaque

### Smooth Shadow
A sombra é **colorida** (azul) em vez de preta:
```css
rgba(90, 155, 207, 0.25)
```
Isso dá um toque mais moderno e alinhado com o tema.

## 🎨 Classes Tailwind Utilizadas

### Card Container
```tsx
className="group bg-white p-8 rounded-xl 
           shadow-lg hover:shadow-2xl 
           transform hover:-translate-y-3 hover:scale-105 
           transition-all duration-500 ease-out
           border border-gray-100 cursor-pointer
           hover:border-primary-blue 
           hover:bg-gradient-to-br hover:from-primary-blue/5 
           relative overflow-hidden"
```

### Ícone Container
```tsx
className="mb-6 p-4 bg-primary-blue/10 rounded-full 
           transition-all duration-500 ease-out
           group-hover:bg-primary-blue/20 
           group-hover:scale-110 
           group-hover:rotate-6 
           group-hover:shadow-lg
           group-hover:shadow-primary-blue/30"
```

### SVG Interno
```tsx
className="transition-transform duration-500 
           group-hover:scale-110"
```

### Título
```tsx
className="text-xl font-semibold text-neutral-dark mb-4
           transition-colors duration-300 
           group-hover:text-primary-blue"
```

### Descrição
```tsx
className="text-neutral-medium leading-relaxed
           transition-all duration-300 
           group-hover:text-neutral-dark"
```

## ⚙️ CSS Personalizado (globals.css)

```css
/* Icon pulse animation */
@keyframes iconPulse {
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.15) rotate(8deg); }
  100% { transform: scale(1.1) rotate(6deg); }
}

/* Card hover lift */
.group:hover {
  transform: translateY(-12px) scale(1.05);
  box-shadow: 0 25px 50px -12px rgba(90, 155, 207, 0.25);
}

/* Icon glow effect */
.group:hover .rounded-full {
  box-shadow: 0 0 20px rgba(90, 155, 207, 0.4),
              0 0 40px rgba(90, 155, 207, 0.2);
}

/* Description lift */
.group:hover p {
  transform: translateY(-2px);
}
```

## 🎭 Experiência do Usuário

### Antes do Hover
- Card em posição normal
- Sombra padrão cinza
- Ícone estático
- Texto neutro

### Durante o Hover
- ✨ Card **levita** 12px para cima
- 🎨 Ícone **gira** 6° e **pulsa**
- 💡 Ícone **brilha** com glow azul
- 🎯 Título **destaca** em azul
- 📄 Texto fica mais **legível**
- 🌊 Sombra azul **profissional**

## 📊 Timing Comparativo

| Efeito | Duração | Timing |
|--------|---------|--------|
| Card Lift | 500ms | ease-out |
| Icon Rotation | 500ms | iconPulse |
| Icon Glow | 500ms | ease-out |
| Title Color | 400ms | cubic-bezier |
| Text Enhancement | 300ms | ease-out |
| Background Gradient | 500ms | ease-out |

## 🚀 Performance

### Otimizações
- ✅ GPU-accelerated (transform)
- ✅ Sem repaint (só transform/opacity)
- ✅ will-change implícito
- ✅ 60fps garantido

### Técnicas Usadas
```css
transform: translateY() scale() rotate()  // GPU
box-shadow: ...                           // GPU
opacity: ...                              // GPU
color: ...                                // Repaint mínimo
```

## 🎨 Efeitos Visuais Detalhados

### 1. Lift Effect (Levitação)
```
Normal:  Y = 0px
Hover:   Y = -12px
Scale:   1.0 → 1.05
```

### 2. Icon Pulse (Pulso)
```
Start:   100% / 0°
Peak:    115% / 8°
End:     110% / 6°
```

### 3. Glow Layers (Camadas de Brilho)
```
Inner:  20px blur / 40% opacity
Outer:  40px blur / 20% opacity
```

### 4. Color Transitions
```
Border:  #E5E7EB → #5A9BCF
Title:   #333333 → #5A9BCF
Text:    #B0B0B0 → #333333
```

## 🎯 Resultado Final

Os cards agora têm **5 camadas de animação simultâneas**:

1. 📦 **Card**: Levita + escala + sombra azul
2. 🎨 **Ícone**: Pulsa + rota + brilha
3. 📝 **Título**: Muda para azul
4. 📄 **Texto**: Escurece + sobe levemente
5. 🌊 **Background**: Gradient azul sutil

Tudo sincronizado em **500ms** para uma experiência fluida e moderna! ✨

---

**Última atualização**: 8 de outubro de 2025  
**Versão**: 1.0.0