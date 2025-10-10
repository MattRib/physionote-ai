# 👨‍⚕️ Guia do Usuário - Sistema de Gravação

## 🎯 Visão Geral

O PhysioNote.AI foi projetado para você **focar 100% no paciente** durante a consulta. O sistema grava e transcreve automaticamente em segundo plano, sem distrações visuais.

---

## 📱 Como Usar

### 1️⃣ Iniciando uma Nova Sessão

**Na tela do Dashboard:**
1. Clique no botão **"+ Nova Sessão"** (canto superior direito)
2. Você será direcionado para a tela de gravação

**Ou pelo menu lateral:**
1. Clique em **"Dashboard"** no menu
2. Clique no botão **"Iniciar Nova Sessão"**

---

### 2️⃣ Selecionando o Paciente

![Tela de Seleção](placeholder)

**O que você verá:**
- Logo PhysioNote.AI no topo
- Título: "Nova Sessão"
- Campo de busca de pacientes

**Passos:**
1. Clique no campo **"Selecione o paciente"**
2. Digite o nome do paciente ou navegue pela lista
3. Clique no paciente desejado
4. O botão **"Iniciar Sessão"** ficará azul (habilitado)
5. Clique em **"Iniciar Sessão"**

💡 **Dica:** Se o paciente não estiver na lista, cancele e vá em "Pacientes" no menu para cadastrá-lo primeiro.

---

### 3️⃣ Durante a Gravação 🎙️

![Tela de Gravação](placeholder)

**O que você verá:**

```
┌─────────────────────────────────────────────┐
│                                             │
│         🔴 A consulta está sendo gravada    │
│                                             │
│                                             │
│              ╭─────────────╮                │
│              │  ~~~~~~~~   │                │
│              │ (  🎤  )    │  ← Pulsando    │
│              │  ~~~~~~~~   │                │
│              ╰─────────────╯                │
│                                             │
│              00:15:32                       │
│                                             │
│         Paciente: João Silva                │
│                                             │
│  [🛑 Finalizar Consulta e Gerar Transcrição]│
│                                             │
│  ℹ️ Continue normalmente. A transcrição     │
│     será gerada ao finalizar.               │
│                                             │
└─────────────────────────────────────────────┘
```

**Elementos na tela:**
- ✅ **Fundo animado** com efeito de vidro líquido
- ✅ **Microfone pulsante** no centro (indica que está gravando)
- ✅ **Ondas sonoras** animadas (efeito visual)
- ✅ **Mensagem de status** com ponto vermelho
- ✅ **Timer** mostrando duração (HH:MM:SS)
- ✅ **Nome do paciente** para confirmar quem está sendo atendido
- ✅ **Botão vermelho** grande para finalizar

**O que NÃO aparece:**
- ❌ Texto da transcrição
- ❌ Menus ou barras laterais
- ❌ Outros botões ou controles

---

### 4️⃣ Durante o Atendimento

**✅ FAÇA:**
- Converse normalmente com o paciente
- Explique os procedimentos
- Descreva verbalmente o que está fazendo
- Fale claramente próximo ao microfone

**❌ EVITE:**
- Não se preocupe com a transcrição (é automática)
- Não tente ler ou visualizar o texto
- Não pause a gravação (mantenha fluida)

💡 **Dica:** Quanto mais você descrever verbalmente, melhor será a documentação automática!

---

### 5️⃣ Finalizando a Consulta

**Quando terminar o atendimento:**
1. Clique no botão vermelho **"Finalizar Consulta e Gerar Transcrição"**
2. Aguarde 2 segundos (animação de processamento)
3. Você será levado automaticamente para a tela de resumo

**Durante o processamento:**
```
┌─────────────────────────────────────────────┐
│                                             │
│            ⏳ Finalizando consulta...       │
│     Processando gravação e gerando          │
│            transcrição                      │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 6️⃣ Revisando a Transcrição ⭐

![Tela de Resumo](placeholder)

**O que você verá:**

```
╔═══════════════════════════════════════════════╗
║  ✅ Sessão Finalizada                         ║
║  Revise e complete as informações da sessão   ║
╟───────────────────────────────────────────────╢
║  👤 Paciente: João Silva                      ║
║  ⏱️  Duração: 00:15:32                        ║
║  📄 Segmentos: 7                              ║
╚═══════════════════════════════════════════════╝

╔═══════════════════════════════════════════════╗
║  📄 Transcrição da Consulta (7 segmentos) 🔽 ║
╟───────────────────────────────────────────────╢
║  ┌─────────────────────────────────────────┐ ║
║  │ [1] Paciente relata dor na região      │ ║
║  │     lombar há 2 semanas.                │ ║
║  ├─────────────────────────────────────────┤ ║
║  │ [2] Dor aumenta ao realizar movimentos │ ║
║  │     de flexão do tronco.                │ ║
║  ├─────────────────────────────────────────┤ ║
║  │ [3] Observada limitação de amplitude... │ ║
║  └─────────────────────────────────────────┘ ║
║                                               ║
║  [📋 Copiar] [✏️ Editar] [📥 Exportar PDF]   ║
╚═══════════════════════════════════════════════╝
```

#### **Opções Disponíveis:**

##### 📋 **Copiar Transcrição**
- Clique em **"Copiar"**
- Toda a transcrição é copiada para área de transferência
- Feedback visual: "Copiado!" aparece por 2 segundos
- Cole em Word, Google Docs ou qualquer outro app

##### 🔽 **Ocultar/Exibir**
- Clique no botão **"Ocultar"** no canto superior direito
- A transcrição será escondida para economizar espaço
- Clique em **"Exibir"** para mostrar novamente

##### ✏️ **Editar Transcrição**
- Clique no botão **"Editar Transcrição"**
- Uma caixa de texto grande aparecerá com toda a transcrição
- Corrija erros de transcrição automática
- Adicione ou remova informações
- Clique em **"Salvar Alterações"** quando terminar
- Ou clique em **"Cancelar"** para descartar mudanças

**Exemplo de edição:**
```
Antes (IA):  "Paciente tem dolor na lombar"
Depois (Você): "Paciente tem dor na região lombar"
```

##### 📥 **Exportar PDF**
- Clique em **"Exportar PDF"**
- Um documento PDF será gerado com:
  - Dados do paciente
  - Transcrição completa
  - Informações adicionais
  - Cabeçalho PhysioNote.AI

---

### 7️⃣ Completando a Documentação

**Role para baixo para ver os campos adicionais:**

```
╔═══════════════════════════════════════════════╗
║  ✏️ Informações Adicionais                    ║
╟───────────────────────────────────────────────╢
║  Diagnóstico / Avaliação                      ║
║  ┌─────────────────────────────────────────┐ ║
║  │ Ex: Lombalgia mecânica aguda            │ ║
║  └─────────────────────────────────────────┘ ║
║                                               ║
║  Tratamento Realizado                         ║
║  ┌─────────────────────────────────────────┐ ║
║  │ Ex: Mobilização articular grau 3        │ ║
║  │     Alongamento de cadeia posterior     │ ║
║  └─────────────────────────────────────────┘ ║
║                                               ║
║  Orientações e Próximos Passos                ║
║  ┌─────────────────────────────────────────┐ ║
║  │ Ex: Realizar exercícios 2x ao dia       │ ║
║  │     Retorno em 7 dias                   │ ║
║  └─────────────────────────────────────────┘ ║
║                                               ║
║  Observações Gerais                           ║
║  ┌─────────────────────────────────────────┐ ║
║  │ Ex: Paciente aderente ao tratamento     │ ║
║  └─────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════╝
```

**Preencha:**
1. **Diagnóstico/Avaliação:** Sua avaliação clínica
2. **Tratamento Realizado:** Técnicas e procedimentos aplicados
3. **Orientações:** Exercícios, cuidados, próximas sessões
4. **Observações:** Qualquer informação relevante adicional

💡 **Dica:** Esses campos são opcionais mas recomendados para documentação completa.

---

### 8️⃣ Salvando ou Descartando

**No final da página:**

```
┌───────────────────────────────────────────────┐
│                                               │
│        [❌ Descartar]  [💾 Salvar Sessão]     │
│                                               │
└───────────────────────────────────────────────┘
```

#### **Salvar Sessão** 💾
- Clique no botão azul **"Salvar Sessão"**
- Todos os dados serão salvos:
  - Transcrição (editada ou original)
  - Informações adicionais
  - Áudio da gravação
  - Data, hora, duração
- Você retornará ao Dashboard
- A sessão aparecerá na lista de sessões recentes

#### **Descartar** ❌
- Clique no botão cinza **"Descartar"**
- Uma confirmação aparecerá: "Tem certeza?"
- Se confirmar, TODOS os dados serão perdidos
- Use apenas se a gravação teve problemas

⚠️ **Atenção:** Descartar é permanente e não pode ser desfeito!

---

## 💡 Dicas e Boas Práticas

### Durante a Gravação 🎙️

1. **Posicionamento do Microfone:**
   - Mantenha o notebook/tablet a uma distância confortável
   - Evite cobrir o microfone com as mãos

2. **Ambiente:**
   - Feche portas e janelas se possível
   - Desligue ventiladores ou ar-condicionado barulhentos
   - Minimize ruídos externos

3. **Comunicação:**
   - Fale claramente e em ritmo normal
   - Descreva verbalmente o que está fazendo
   - Exemplo: "Vou aplicar uma técnica de mobilização na lombar"

4. **Termos Técnicos:**
   - Use terminologia profissional normalmente
   - A IA aprende com termos médicos e fisioterapêuticos
   - Você pode corrigir erros na edição posterior

### Após a Gravação 📝

1. **Sempre Revise:**
   - Leia a transcrição completa antes de salvar
   - Corrija erros de transcrição automática
   - Adicione informações que faltaram

2. **Documentação Completa:**
   - Preencha todos os campos adicionais
   - Diagnóstico claro ajuda em consultas futuras
   - Orientações bem descritas ajudam o paciente

3. **Backup:**
   - Sempre salve a sessão no sistema
   - Opcionalmente, exporte PDF como backup local
   - Copie transcrição para prontuário se necessário

---

## ❓ Perguntas Frequentes

### **P: Posso pausar a gravação?**
**R:** Não. Para evitar distrações e manter foco no paciente, a gravação é contínua. Se precisar parar, finalize a sessão e inicie uma nova depois.

### **P: E se eu errar o nome do paciente?**
**R:** Clique em "Descartar" e inicie uma nova sessão com o paciente correto. É importante que o registro esteja associado ao paciente certo.

### **P: Posso ver a transcrição durante a gravação?**
**R:** Não. A interface foi projetada para eliminar distrações. A transcrição aparece apenas após finalizar, para você revisar com calma.

### **P: A transcrição é 100% precisa?**
**R:** Não. A IA é muito boa, mas pode cometer erros, especialmente com:
   - Termos técnicos muito específicos
   - Nomes próprios
   - Ambientes barulhentos
   
Por isso, **sempre revise e edite antes de salvar!**

### **P: Posso editar a transcrição depois de salvar?**
**R:** Sim! Você pode abrir a sessão salva no Dashboard e editar novamente.

### **P: O áudio fica salvo?**
**R:** Sim, o áudio original é armazenado junto com a transcrição para referência futura.

### **P: E se minha internet cair durante a gravação?**
**R:** A gravação continua localmente. Quando a internet voltar, os dados serão sincronizados.

### **P: Posso usar em múltiplos dispositivos?**
**R:** Sim! Acesse sua conta em qualquer navegador. As sessões ficam sincronizadas na nuvem.

---

## 🎓 Vídeo Tutorial

🎥 **[Assistir Tutorial Completo]** (em breve)

Duração: 5 minutos  
Conteúdo:
- Como iniciar uma sessão
- Melhores práticas durante gravação
- Revisão e edição de transcrição
- Salvamento e exportação

---

## 🆘 Precisa de Ajuda?

### Suporte Técnico
- 📧 Email: suporte@physionote.ai
- 💬 Chat: Clique em "Ajuda" no menu lateral
- 📞 Telefone: (11) 1234-5678

### Horário de Atendimento
- Segunda a Sexta: 8h às 18h
- Sábados: 9h às 13h
- Domingos: Fechado

### Recursos Adicionais
- 📚 Central de Ajuda: help.physionote.ai
- 🎓 Cursos Online: academy.physionote.ai
- 👥 Comunidade: community.physionote.ai

---

**Aproveite o PhysioNote.AI e foque no que realmente importa: o cuidado com seu paciente! 💙**

---

*Última atualização: Outubro 2025 | Versão 2.0*
