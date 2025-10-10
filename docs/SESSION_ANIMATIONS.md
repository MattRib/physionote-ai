# Animações da Página de Nova Sessão

## Visão Geral

A página de Nova Sessão foi aprimorada com animações sutis e elegantes que melhoram significativamente a experiência do usuário, tornando a interface mais dinâmica e profissional, alinhada com as outras páginas do sistema.

## Animações Implementadas

### 1. **Entrada da Página**
- **Componente**: Container principal
- **Animação**: `animate-fade-in`
- **Efeito**: Fade in suave ao carregar a página
- **Duração**: 0.5s
- **Timing**: ease-out

### 2. **Card Principal**
- **Componente**: Card branco central
- **Animação**: `animate-slide-up-modal`
- **Efeito**: Desliza de baixo para cima com leve escala e fade in
- **Duração**: 0.5s
- **Timing**: cubic-bezier(0.34, 1.56, 0.64, 1) - bounce suave
- **Transform**: translateY(40px) scale(0.95) → translateY(0) scale(1)

### 3. **Ícone de Atividade**
- **Componente**: Ícone circular no topo
- **Animação**: `animate-bounce-gentle`
- **Efeito**: Bounce suave e contínuo
- **Duração**: 2s (loop infinito)
- **Movimento**: translateY(0) → translateY(-8px) → translateY(0)
- **Extra**: Gradiente de cor (from-[#5A9BCF] to-[#4A8BBF]) com sombra

### 4. **Título e Subtítulo**
- **Componente**: "Nova Sessão" e descrição
- **Animação**: 
  - Título: `animate-fade-in-up`
  - Subtítulo: `animate-fade-in-up-delay`
- **Efeito**: Fade in com movimento vertical
- **Duração**: 0.6s
- **Delay**: 0s (título) / 0.15s (subtítulo)
- **Transform**: translateY(20px) → translateY(0)

### 5. **Seletor de Paciente**
- **Componente**: Campo de seleção
- **Animação**: `animate-fade-in-up`
- **Delay**: 0.2s (inline style)
- **Efeito**: Aparece após o título com fade in

#### 5.1. **Botão do Seletor**
- **Hover**: 
  - Border muda para `border-[#5A9BCF]`
  - Adiciona sombra (`shadow-md`)
  - Transição suave de 300ms

#### 5.2. **Dropdown**
- **Abertura**: `animate-slide-down`
- **Efeito**: Desliza de cima com escala vertical
- **Duração**: 0.3s
- **Transform**: translateY(-10px) scaleY(0.95) → translateY(0) scaleY(1)

#### 5.3. **Itens da Lista**
- **Animação**: `animate-fade-in-item`
- **Efeito**: Fade in com deslize da esquerda (stagger)
- **Delay**: 0.05s por item (índice × 0.05s)
- **Transform**: translateX(-10px) → translateX(0)
- **Hover**:
  - Background: `hover:bg-blue-50`
  - Avatar escala: `scale-110`
  - Nome muda para cor azul
  - Transições de 200-300ms

### 6. **Botões de Ação**

#### 6.1. **Botão Cancelar**
- **Animação de entrada**: `animate-fade-in-up` com delay de 0.3s
- **Hover**:
  - Background: `hover:bg-gray-50`
  - Border: `hover:border-gray-300`
  - Sombra: `hover:shadow-md`
  - Lift: `hover:-translate-y-0.5`
  - Duração: 300ms

#### 6.2. **Botão Iniciar Sessão**
- **Animação de entrada**: `animate-fade-in-up` com delay de 0.3s
- **Gradiente**: from-[#5A9BCF] to-[#4A8BBF]
- **Hover**:
  - Gradiente: from-[#4A8BBF] to-[#3A7BAF]
  - Sombra: `shadow-md` → `shadow-xl`
  - Lift: `hover:-translate-y-1`
  - Overlay branco com opacidade: 0 → 20%
  - Ícone Play escala: `scale-110`
  - Duração: 300ms
- **Disabled**:
  - Sem animações hover
  - Opacidade 50%
  - Cursor not-allowed

## Hierarquia de Timing

```
0ms    → Página fade in
0ms    → Card slide up
0ms    → Ícone bounce (contínuo)
0ms    → Título fade in up
150ms  → Subtítulo fade in up
200ms  → Seletor de paciente fade in up
300ms  → Botões fade in up

(Ao abrir dropdown)
0ms    → Dropdown slide down
0ms    → Primeiro item fade in
50ms   → Segundo item fade in
100ms  → Terceiro item fade in
...
```

## Classes CSS Customizadas

### Principais Keyframes

```css
@keyframes slideUpModal
@keyframes bounceGentle
@keyframes fadeIn
@keyframes fadeInUp
@keyframes slideDown
@keyframes fadeInItem
```

### Classes Utilitárias

- `.animate-slide-up-modal`
- `.animate-bounce-gentle`
- `.animate-fade-in`
- `.animate-fade-in-up`
- `.animate-fade-in-up-delay`
- `.animate-slide-down`
- `.animate-fade-in-item`

## Melhorias de UX

1. **Feedback Visual Imediato**: Todas as interações têm resposta visual em 300ms ou menos
2. **Hierarquia de Entrada**: Elementos aparecem em ordem lógica de leitura
3. **Transições Suaves**: Uso de cubic-bezier para movimentos naturais
4. **Estados de Hover Ricos**: Botões e itens reagem de forma clara ao hover
5. **Stagger Animation**: Lista de pacientes aparece sequencialmente
6. **Disabled States**: Botão desabilitado não responde a hover
7. **Performance**: Uso de `will-change`, `backface-visibility` e `transform` para animações otimizadas

## Comparação com Outras Páginas

A página agora está alinhada com:
- **Landing Page**: Mesma linguagem de animações de entrada (fade in up)
- **Dashboard**: Transições de hover similares nos cards
- **Login**: Card com slide up modal consistente

## Arquivos Modificados

1. **`SessionView.tsx`**
   - Adicionadas classes de animação no container, card, ícone, textos e botões
   - Delays inline para timing sequencial

2. **`PatientSelector.tsx`**
   - Animação de dropdown
   - Animação stagger nos itens da lista
   - Hovers aprimorados com transições suaves

3. **`globals.css`**
   - Novos keyframes: `slideUpModal`, `bounceGentle`, `slideDown`, `fadeInItem`
   - Novas classes utilitárias de animação

## Testes Recomendados

1. ✅ Verificar entrada suave da página
2. ✅ Confirmar bounce do ícone (contínuo e suave)
3. ✅ Testar abertura do dropdown de pacientes
4. ✅ Validar stagger animation na lista
5. ✅ Testar hovers em todos os botões e itens
6. ✅ Confirmar que botão desabilitado não anima no hover
7. ✅ Verificar performance (60fps) em navegadores diversos

## Status

✅ **Implementado e validado**
- Build: Sucesso
- TypeScript: Sem erros
- Performance: Otimizada com GPU acceleration
