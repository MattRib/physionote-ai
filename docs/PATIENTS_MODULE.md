# Sistema de Gerenciamento de Pacientes

## 📋 Visão Geral

O módulo de Pacientes do PhysioNote.AI permite o gerenciamento completo de pacientes, incluindo cadastro, visualização, edição e exclusão de registros.

## 🎯 Funcionalidades Implementadas

### 1. **Visualização de Pacientes**
- ✅ Lista de todos os pacientes cadastrados
- ✅ Duas visualizações disponíveis:
  - **Grade (Grid)**: Cards visuais com informações principais
  - **Tabela**: Visualização compacta em formato de tabela
- ✅ Sistema de busca em tempo real
- ✅ Filtros (preparado para expansão futura)

### 2. **Dashboard de Estatísticas**
- ✅ Total de pacientes cadastrados
- ✅ Pacientes ativos (com sessões registradas)
- ✅ Novos pacientes do mês atual

### 3. **Cadastro de Pacientes**
- ✅ Modal completo com formulário estruturado
- ✅ Seções organizadas:
  - **Informações Pessoais**: Nome, CPF, data de nascimento, gênero
  - **Contato**: Email e telefone
  - **Endereço**: CEP, rua, número, complemento, bairro, cidade, estado
  - **Histórico Médico**: Campo de texto livre para anotações

### 4. **Edição de Pacientes**
- ✅ Edição inline através do mesmo modal
- ✅ Pré-preenchimento automático dos dados
- ✅ Validação de campos obrigatórios

### 5. **Exclusão de Pacientes**
- ✅ Confirmação antes de excluir
- ✅ Remoção da lista em tempo real

### 6. **Formatação Automática**
- ✅ CPF: `000.000.000-00`
- ✅ Telefone: `(00) 00000-0000`
- ✅ CEP: `00000-000`
- ✅ Estado: Uppercase automático

## 🎨 Design e UX

### Paleta de Cores
```typescript
Primary: #5A9BCF       // Azul principal
Background: #F7F7F7    // Fundo claro
Text Primary: #333333  // Texto principal
Text Secondary: #666666 // Texto secundário
Success: green-600     // Estados positivos
Danger: red-600        // Ações destrutivas
```

### Componentes
- **Cards**: Gradiente azul no header, informações organizadas
- **Modal**: Design responsivo, scroll interno, validações
- **Botões**: Estados hover e active bem definidos
- **Ícones**: Biblioteca lucide-react

## 📁 Estrutura de Arquivos

```
src/
├── app/
│   └── dashboard/
│       └── patients/
│           └── page.tsx              # Página principal de pacientes
├── components/
│   └── patients/
│       ├── PatientsView.tsx          # Container principal com lógica
│       ├── PatientsList.tsx          # Lista/Grid de pacientes
│       ├── PatientModal.tsx          # Modal de cadastro/edição
│       └── index.ts                  # Exports
```

## 📊 Interface do Paciente

```typescript
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  gender: 'masculino' | 'feminino' | 'outro';
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  medicalHistory?: string;
  createdAt: string;
  lastSession?: string;
  totalSessions: number;
}
```

## 🔄 Fluxo de Uso

### Adicionar Novo Paciente
1. Clicar em "Novo Paciente"
2. Preencher o formulário modal
3. Clicar em "Cadastrar Paciente"
4. Paciente aparece no topo da lista

### Editar Paciente
1. Clicar no ícone de edição (lápis) no card ou tabela
2. Modal abre com dados pré-preenchidos
3. Modificar campos desejados
4. Clicar em "Salvar Alterações"

### Excluir Paciente
1. Clicar no ícone de lixeira
2. Confirmar exclusão no alert
3. Paciente removido da lista

### Buscar Paciente
1. Digitar no campo de busca
2. Filtro aplica-se em tempo real
3. Busca em: nome, email, telefone e CPF

## 🚀 Próximas Expansões Sugeridas

### Backend Integration
```typescript
// Conectar com API para persistência de dados
- POST /api/patients - Criar paciente
- GET /api/patients - Listar pacientes
- PUT /api/patients/:id - Atualizar paciente
- DELETE /api/patients/:id - Excluir paciente
```

### Funcionalidades Futuras
- [ ] Filtros avançados (por data, gênero, cidade)
- [ ] Exportar lista em PDF/Excel
- [ ] Histórico de sessões do paciente
- [ ] Upload de documentos (laudos, exames)
- [ ] Agenda de consultas integrada
- [ ] Notificações por email/SMS
- [ ] Relatórios de evolução
- [ ] Integração com sistema de pagamentos

### Validações Adicionais
- [ ] Validação de CPF com dígito verificador
- [ ] Validação de CEP com busca automática de endereço (ViaCEP)
- [ ] Validação de email com verificação
- [ ] Prevenção de CPF duplicado

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Next.js 14** (App Router)
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **Estado local** com useState (preparado para Zustand/Redux)

## 📱 Responsividade

✅ **Mobile First**
- Layout adaptável para todos os tamanhos de tela
- Grid responsivo (1 coluna → 2 → 3 colunas)
- Modal com scroll interno em telas pequenas
- Botões e inputs otimizados para touch

## ⚡ Performance

- Busca otimizada com filtro client-side
- Renderização condicional (Grid vs Table)
- Lazy loading preparado para grandes listas
- Memoização pronta para implementação

## 🎓 Boas Práticas Aplicadas

✅ TypeScript com tipagem completa
✅ Componentização modular
✅ Separação de responsabilidades
✅ Props drilling evitado
✅ Código limpo e comentado
✅ Consistência com Design System
✅ Acessibilidade (aria-labels, títulos)

---

**Desenvolvido seguindo as diretrizes de design do PhysioNote.AI**
