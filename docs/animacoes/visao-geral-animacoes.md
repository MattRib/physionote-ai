# Animações de Botões - PhysioNote.AI

## 🎨 Animações Implementadas

Este documento descreve todas as animações suaves adicionadas aos botões e elementos interativos da página.

## 📋 Elementos Animados

### 1. **Botão de Login (Header)**
- **Localização**: Canto superior direito
- **Efeito hover**: 
  - Escala aumenta para 110% (`scale-110`)
  - Cor muda de azul claro (#5A9BCF) para azul escuro (#2C5F8D)
  - Duração: 300ms
  - Shadow aumenta de `shadow-lg` para `shadow-xl`

```tsx
className="bg-primary-blue hover:bg-blue-700 hover:scale-110 
           transform transition-all duration-300 shadow-lg hover:shadow-xl"
```

### 2. **Botões da Hero Section**

#### Botão "Comece Agora" (Primário)
- **Efeito hover**:
  - Escala aumenta para 110%
  - Cor muda de azul claro (#5A9BCF) para azul escuro (#2C5F8D)
  - Duração: 400ms
  - Shadow intensifica

```tsx
className="bg-primary-blue hover:bg-blue-700 hover:scale-110 
           transform transition-all duration-400 shadow-lg hover:shadow-xl"
```

#### Botão "Veja como Funciona" (Secundário)
- **Efeito hover**:
  - Escala aumenta para 110%
  - Border azul (#5A9BCF) se transforma em background azul sólido
  - Texto muda de azul para branco
  - Duração: 400ms
  - Shadow adiciona de `shadow-md` para `shadow-xl`

```tsx
className="border-2 border-primary-blue hover:bg-primary-blue hover:text-white 
           hover:scale-110 transform transition-all duration-400"
```

### 3. **Cards de Features**
- **Efeito hover nos cards**:
  - Movimento vertical de -8px (`-translate-y-2`)
  - Escala aumenta para 105%
  - Shadow muda de `shadow-lg` para `shadow-2xl`
  - Border muda de cinza para azul (#5A9BCF)
  - Duração: 400ms
  - Cursor muda para pointer

- **Efeito hover nos ícones**:
  - Background muda de azul/10 para azul/30 (mais intenso)
  - Escala aumenta para 110%
  - Duração: 400ms

```tsx
className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl 
           transform hover:-translate-y-2 hover:scale-105 transition-all duration-400
           border hover:border-primary-blue cursor-pointer"
```

### 4. **Cards de Testimonials**
- **Efeito hover**:
  - Movimento vertical de -8px
  - Escala aumenta para 105%
  - Shadow muda de `shadow-lg` para `shadow-2xl`
  - Border muda para azul (#5A9BCF)
  - Duração: 400ms
  - Cursor pointer
  - Avatar usa tons de azul (#5A9BCF)

```tsx
className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl 
           transform hover:-translate-y-2 hover:scale-105 transition-all duration-400
           border hover:border-primary-blue cursor-pointer"
```

## ⚙️ Configuração Técnica

### Tailwind Config
As cores personalizadas estão definidas em `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    blue: '#5A9BCF',    // Azul claro - botões principais
  },
  blue: {
    700: '#2C5F8D',     // Azul escuro - hover state
    800: '#1E4A6F',     // Azul mais escuro - alternativo
  }
}
```

### CSS Global
Estilos globais adicionados em `globals.css`:

```css
/* Enhanced button animations */
button {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🎯 Características das Animações

### Timing
- **Duração padrão**: 300-400ms
- **Função de timing**: `cubic-bezier(0.4, 0, 0.2, 1)` - proporciona aceleração suave

### Transformações
- **Scale hover**: 105% a 110% dependendo do elemento
- **Translate**: -8px vertical para cards

### Cores de Transição
- **Azul Claro → Azul Escuro**: Transição suave de #5A9BCF para #2C5F8D
- **Transparente → Sólido**: Para botões secundários com border azul

### Sombras
- **Progressão**: `shadow-lg` → `shadow-xl` → `shadow-2xl`
- Cria profundidade visual no hover

## 🚀 Performance

Todas as animações usam:
- `transform` (GPU-accelerated)
- `transition-all` com durações otimizadas
- `cubic-bezier` para suavidade visual

## 📱 Responsividade

As animações são mantidas em todos os breakpoints:
- Desktop: Efeito completo
- Tablet: Efeito completo
- Mobile: Efeito adaptado para touch (escala reduzida)

## 🎨 Design System

### Hierarquia Visual
1. **Botões primários**: Azul claro → Azul escuro (ação principal)
2. **Botões secundários**: Border azul → Background azul sólido (ação secundária)
3. **Cards**: Elevação + scale + border azul (interatividade)

### Consistência
- Todos os botões principais usam a mesma transição azul claro → azul escuro
- Duração consistente de 300-400ms
- Scale consistente de 105-110%
- Paleta monocromática azul para elegância

## 🔧 Manutenção

Para modificar as animações:

1. **Duração**: Ajuste `duration-300` ou `duration-400`
2. **Escala**: Ajuste `scale-105` ou `scale-110`
3. **Cores**: Modifique em `tailwind.config.ts`
4. **Timing**: Ajuste o `cubic-bezier` em `globals.css`

---

**Última atualização**: 8 de outubro de 2025
**Versão**: 1.0.0