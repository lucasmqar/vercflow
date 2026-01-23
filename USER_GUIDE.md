# VERCFLOW - Guia de Uso do Sistema

## 🎯 FLUXO PRÁTICO DE USO

### 1. NOVO CLIENTE / NOVA OBRA

**Passo a Passo:**

1. Qualquer departamento clica em **"Novo Registro"** ou **"+ Nova Obra"**
2. Sistema abre **LeadWizard**
3. Preenche 4 etapas:
   - **Cliente** (nome, CPF/CNPJ, contato)
   - **Obra** (nome, localização, área)
   - **Classificação** (categoria + subcategoria)
   - **Revisão** (confirma dados)
4. Sistema cria automaticamente:
   - ✅ Cliente no banco
   - ✅ Lead no Comercial (status: NOVO)

### 2. COMERCIAL QUALIFICA O LEAD

**No Dashboard Comercial:**

1. Visualiza lista de Leads
2. Clica no Lead
3. Muda status: `NOVO` → `EM_QUALIFICACAO` → `QUALIFICADO`
4. Sistema notifica: "Lead pronto para orçamento"

### 3. COMERCIAL CRIA ORÇAMENTO

**Ação:**
```typescript
createBudget({
  leadId: 'xxx',
  escopoMacro: 'Descrição do escopo...',
  valorEstimado: 1500000,
  prazoEstimadoMeses: 12,
  status: 'EM_ELABORACAO'
})
```

### 4. COMERCIAL GERA PROPOSTA

**Ação:**
```typescript
createProposal({
  budgetId: 'xxx',
  versao: 1,
  valorFinal: 1450000,
  condicoesEspeciais: '...',
  status: 'PENDENTE'
})
```

### 5. PROPOSTA APROVADA → OBRA ATIVADA

**Ação Manual:**
```typescript
updateProposalStatus(proposalId, 'APROVADA')
```

**Sistema executa automaticamente:**
1. Cria `Project` (status: PLANEJAMENTO)
2. Vincula: `orcamentoId`, `propostaId`, `clientId`
3. Notifica **ENGENHARIA**: "Nova Obra Ativada"

### 6. ENGENHARIA RECEBE A OBRA

**No Dashboard Engenharia:**

1. Vê notificação: "Nova Obra Ativada"
2. Acessa detalhes do projeto
3. Valida cadastro técnico
4. Define disciplinas (automático pelo tipo de obra)
5. Cria frentes de serviço

### 7. ENGENHARIA SOLICITA RECURSOS

**Exemplo - Solicitar Material:**
```typescript
createRequest({
  fromDepartment: 'ENGENHARIA',
  toDepartment: 'COMPRAS',
  type: 'MATERIAL_PURCHASE',
  projectId: 'xxx',
  title: 'Compra de Cimento - Obra Sky Tower',
  description: '500 sacos cimento CP-II',
  priority: 'ALTA',
  status: 'PENDENTE'
})
```

### 8. COMPRAS ATENDE A SOLICITAÇÃO

**No Dashboard Compras:**

1. Vê notificação: "1 nova solicitação"
2. Clica na solicitação
3. Cria cotações
4. Emite Ordem de Compra
5. Atualiza solicitação: `PENDENTE` → `CONCLUIDO`

---

## 📚 PRINCIPAIS FUNÇÕES DO STORE

### Clientes
```typescript
const { addClient, updateClient, getClient } = useAppFlow();

// Criar cliente
const clientId = addClient({
  nome: "João Silva",
  tipo: "PF",
  documento: "000.000.000-00",
  contatos: "(11) 99999-9999"
});

// Buscar cliente
const client = getClient(clientId);
```

### Leads
```typescript
const { addLead, updateLeadStatus } = useAppFlow();

// Criar lead
const leadId = addLead({
  clientId: 'xxx',
  nomeObra: 'Edifício Sky Tower',
  localizacao: 'São Paulo - SP',
  tipoObra: 'RESIDENCIAL',
  areaEstimada: 5000,
  status: 'NOVO'
});

// Qualificar lead
updateLeadStatus(leadId, 'QUALIFICADO');
```

### Orçamentos
```typescript
const { createBudget, updateBudgetStatus } = useAppFlow();

const budgetId = createBudget({
  leadId: 'xxx',
  escopoMacro: '...',
  valorEstimado: 1500000,
  prazoEstimadoMeses: 12,
  status: 'EM_ELABORACAO'
});
```

### Propostas
```typescript
const { createProposal, updateProposalStatus } = useAppFlow();

const proposalId = createProposal({
  budgetId: 'xxx',
  versao: 1,
  valorFinal: 1450000,
  status: 'PENDENTE'
});

// Aprovar proposta (ativa obra automaticamente)
updateProposalStatus(proposalId, 'APROVADA');
```

### Projetos
```typescript
const { projects, updateProjectStatus } = useAppFlow();

// Listar projetos
const activeProjects = projects.filter(p => p.status === 'ATIVA');

// Atualizar status
updateProjectStatus(projectId, 'EM_EXECUCAO');
```

### Solicitações Interdepartamentais
```typescript
const { 
  createRequest, 
  updateRequestStatus, 
  getRequestsForDepartment 
} = useAppFlow();

// Criar solicitação
const requestId = createRequest({
  fromDepartment: 'ENGENHARIA',
  toDepartment: 'COMPRAS',
  type: 'MATERIAL_PURCHASE',
  title: '...',
  description: '...',
  priority: 'ALTA',
  status: 'PENDENTE'
});

// Listar solicitações do meu departamento
const myRequests = getRequestsForDepartment('COMPRAS');

// Resolver solicitação
updateRequestStatus(requestId, 'CONCLUIDO');
```

---

## 🔄 ESTADOS E TRANSIÇÕES

### Lead
```
NOVO → EM_QUALIFICACAO → QUALIFICADO → CONVERTIDO
                    ↓
                 PERDIDO
```

### Orçamento
```
EM_ELABORACAO → ENVIADO → APROVADO
                     ↓
                  REJEITADO
```

### Proposta
```
PENDENTE → NEGOCIACAO → APROVADA → FECHADA
                   ↓
                RECUSADA
```

### Projeto
```
PLANEJAMENTO → ATIVA → CONCLUIDA
                 ↓
            EM_PAUSA
                 ↓
            CANCELADA
```

### Solicitação
```
PENDENTE → EM_ANALISE → APROVADO → CONCLUIDO
                   ↓
               REJEITADO
```

---

## 🎨 COMPONENTES PRINCIPAIS

### LeadWizard
```tsx
import { LeadWizard } from '@/components/shared/LeadWizard';

<LeadWizard
  isOpen={showWizard}
  onClose={() => setShowWizard(false)}
/>
```

### ComercialDashboard
- Lista de Leads
- Pipeline Kanban (em desenvolvimento)
- Gestão de Orçamentos
- Gestão de Propostas

### ObrasDashboard
- Portfolio de Obras Ativas
- Detalhes por Obra
- Gestão de Frentes
- Medições

### EngenhariaDashboard
- Métricas de Disciplinas
- Solicitações Técnicas
- Gestão de Frentes de Serviço
- Painel de Controle

---

## ⚡ DICAS DE USO

1. **SEMPRE use o LeadWizard** para criar novas entradas
2. **Qualifique Leads** no Comercial antes de orçar
3. **Aprove Propostas** para ativar obras automaticamente
4. **Use Solicitações** para comunicação entre departamentos
5. **Monitore Status** de cada entidade no dashboard correto

---

## 🚨 REGRAS DE NEGÓCIO

1. ❌ **Não é possível** criar Obra sem Proposta Aprovada
2. ❌ **Não é possível** criar Proposta sem Orçamento
3. ❌ **Não é possível** criar Orçamento sem Lead Qualificado
4. ✅ **Sempre** começa com Lead
5. ✅ **Obra** só existe após fluxo completo

---

**Última Atualização:** 23/01/2026
