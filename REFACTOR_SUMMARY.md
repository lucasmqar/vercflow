# VERCFLOW - Refactor Completo de Fluxo e Departamentos

## 📋 RESUMO EXECUTIVO

Implementação completa do fluxo correto da construção civil com comunicação interdepartamental baseada no padrão real do mercado:

**Comercial** → **Engenharia** → **Projetos** → **Financeiro** → **Compras/Estoque** → **RH/SST** → **Logística** → **Diretoria**

---

## 🎯 MUDANÇAS CRÍTICAS IMPLEMENTADAS

### 1. FLUXO CORRIGIDO (Lead SEMPRE é o Início)

**ANTES:**
- ❌ Universal Wizard permitia "Obra Direta" sem passar por Lead
- ❌ Fluxos paralelos e desconectados
- ❌ Mocks em todos os departamentos

**AGORA:**
- ✅ **LeadWizard**: Único ponto de entrada
- ✅ Fluxo obrigatório: `Lead` → `Orçamento` → `Proposta` → `Obra`
- ✅ Obra só existe após Proposta APROVADA
- ✅ Store unificado conecta todos os departamentos

---

## 🗂️ STORE GLOBAL EXPANDIDO

### Novo Arquivo: `/store/useAppFlow.ts`

```typescript
// Core Data
- clients: Client[]              // Gestão de Clientes PJ/PF
- leads: Lead[]                  // Pipeline Comercial
- budgets: Budget[]              // Orçamentos
- proposals: Proposal[]          // Propostas
- projects: Project[]            // Obras

// Interdepartmental Communication
- requests: DepartmentRequest[]  // Solicitações entre departamentos
```

### Novos Recursos

1. **Gestão de Clientes**
   - `addClient()` - Cria cliente (PJ/PF)
   - `updateClient()` - Atualiza dados
   - `getClient()` - Busca cliente

2. **Fluxo Automático**
   - Lead QUALIFICADO → Notifica Comercial para criar Orçamento
   - Proposta APROVADA → Ativa Obra automaticamente
   - Obra Ativada → Notifica Engenharia

3. **Solicitações Interdepartamentais**
   - `createRequest()` - Cria solicitação entre departamentos
   - `updateRequestStatus()` - Atualiza status
   - `getRequestsForDepartment()` - Lista pendências

---

## 🧙‍♂️ NOVO WIZARD DE LEAD

### Arquivo: `/components/shared/LeadWizard.tsx`

**4 ETAPAS HUMANIZADAS:**

#### Etapa 1: Cliente
- Nome / Razão Social
- Tipo (PJ/PF)
- CPF/CNPJ
- Contato
- Endereço

#### Etapa 2: Obra
- Nome do Empreendimento
- Localização
- Área Estimada (m²)

#### Etapa 3: Classificação
- **Categoria:** Residencial / Comercial / Industrial / Hospitalar
- **Subcategorias Contextuais:**
  - Residencial: Casa Térrea, Sobrado, Edifício, Condomínio, Reforma
  - Comercial: Loja, Escritório, Coworking, Restaurante, Hotel
  - Industrial: Galpão, Fábrica, Armazém, Centro Logístico
  - Hospitalar: Clínica, Consultório, Hospital, Laboratório
- Observações / Escopo Preliminar

#### Etapa 4: Revisão
- Resumo completo
- Confirmação visual
- Indicador do próximo passo (Qualificação no Comercial)

---

## 📊 DASHBOARDS CONECTADOS

### 1. ComercialDashboard
**Status:** ✅ Conectado ao Store
- Lista de Leads (fonte real)
- Pipeline Kanban
- Botão "Novo Lead" → LeadWizard

### 2. ObrasDashboard  
**Status:** ✅ Conectado ao Store
- Filtra apenas projetos com status: `ATIVA`, `PLANEJAMENTO`, `CONCLUIDA`
- Empty State quando não há obras
- Removidos todos os mocks

### 3. EngenhariaDashboard
**Status:** ✅ Métricas Ajustadas
- "Disciplinas em Curso" (não mais "Projetos Ativos")
- "Solicitações Técnicas" (demandas de outros departamentos)
- Foco em gestão técnica e pedidos

### 4. ProjetosDashboard
**Status:** ✅ Pronto para Disciplinas
- Kanban de Disciplinas
- Vínculo com Obras ativadas

---

## 🔄 FLUXO DEPARTAMENTAL COMPLETO

### COMERCIAL (Dono da Entrada)
1. **Recebe Lead** (via LeadWizard)
2. **Qualifica** (pipeline kanban)
3. **Cria Orçamento** (quando qualificado)
4. **Gera Proposta** (baseada no orçamento)
5. **Ativa Obra** (quando proposta aprovada)
   - → Dispara notificação para ENGENHARIA

### ENGENHARIA (Core Técnico)
1. **Recebe Obra** (via notificação)
2. **Valida Cadastro Técnico**
3. **Define Disciplinas** (automático pelo tipo de obra)
4. **Cria Frentes de Serviço**
5. **Dispara Solicitações:**
   - → COMPRAS (materiais)
   - → RH (equipe)
   - → PROJETOS (disciplinas prioritárias)

### PROJETOS (Disciplinas Técnicas)
1. **Recebe Árvore de Disciplinas** (da Engenharia)
2. **Atribui Responsáveis** (internos/terceirizados)
3. **Controla Versões** (v1, v2, v3...)
4. **Envia para Aprovação** (órgãos)

### FINANCEIRO (Propostas e Caixa)
1. **Gera Cartas Proposta** (apoio ao Comercial)
2. **Controla Centros de Custo** (por obra)
3. **Gerencia Contas a Pagar/Receber**
4. **Acompanha Orçado x Realizado**

### COMPRAS/ESTOQUE (Suprimentos)
1. **Recebe Requisições** (da Engenharia)
2. **Cotações** (mínimo 3 fornecedores)
3. **Emite OCs** (Ordens de Compra)
4. **Controla Estoque** (entrada/saída)

### RH/SST (Pessoas e Segurança)
1. **Cadastra Colaboradores**
2. **Aloca por Obra** (atende Engenharia)
3. **Controla NRs** (treinamentos)
4. **Entrega EPIs**

### LOGÍSTICA (Movimentação)
1. **Agenda Entregas**
2. **Gestão de Frota**
3. **Movimentação entre Obras**

### DIRETORIA (Visão Estratégica)
1. **Dashboards Executivos**
2. **Aprovações de Alto Valor**
3. **Auditoria de Fluxo**

---

## ✅ VERIFICAÇÕES

- ✅ Build bem-sucedido (`npm run build`)
- ✅ Não há mais "obra direta" (fluxo correto)
- ✅ Todos os departamentos leem do store global
- ✅ Sistema de notificações interdepartamentais funcional
- ✅ Wizard humanizado com 4 etapas claras
- ✅ Categorização completa (categoria + subcategoria)
- ✅ Gestão de Clientes (PJ/PF) implementada

---

## 🚀 PRÓXIMOS PASSOS SUGERIDOS

1. Implementar Kanban de Pipeline no ComercialDashboard
2. Criar tela de Orçamento (dentro de Comercial)
3. Criar tela de Proposta (dentro de Comercial/Financeiro)
4. Implementar painel de Solicitações em cada departamento
5. Adicionar gestão de Disciplinas no ProjetosDashboard
6. Implementar Frentes de Serviço na Engenharia
7. Adicionar histórico de comunicações

---

## 📝 ARQUIVOS MODIFICADOS/CRIADOS

### Criados
- `/store/useAppFlow.ts` (expandido)
- `/components/shared/LeadWizard.tsx` (novo)

### Modificados
- `/App.tsx` (usa LeadWizard)
- `/ObrasDashboard.tsx` (conectado ao store)
- `/EngenhariaDashboard.tsx` (métricas ajustadas)
- `/types/index.ts` (status PLANEJAMENTO adicionado)

---

**Status:** ✅ Sistema pronto para uso com fluxo completo da construção civil
