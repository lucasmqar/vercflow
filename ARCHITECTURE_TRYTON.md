# Análise Arquitetural: VercFlow vs. Tryton ERP
> Estratégia de adaptação dos padrões de design modular do Tryton para o ecossistema VercFlow.

## 1. Visão Geral Comparativa

### Tryton ERP (Referência)
- **Arquitetura:** 3-Tier (Cliente Rico/Web, Servidor Python, PostgreSQL).
- **Core Philosophy:** Modularidade extrema. Nada existe no núcleo além do kernel sistema; tudo (Vendas, Compras, Projetos) são módulos.
- **Padrão de Dados:** Modelo `Party` centralizado para gestão de entidades.
- **Workflows:** Máquinas de estado rígidas definem transições de documentos (ex: Proposta -> Contrato).

### VercFlow (Atual)
- **Arquitetura:** Frontend-First (React/Zustand) com Backend Node.js incipiente.
- **Estado:** Dados geridos em Store local (`useAppFlow`) para agilidade de UI/UX.
- **Foco:** UX de alta fidelidade e Dashboards visuais (Geolocalização, Kanban).

---

## 2. Projeção de Aplicação (Design Patterns a Adotar)

Para elevar o VercFlow de um "Dashboard" para um "Sistema Operacional de Engenharia", devemos adotar os seguintes padrões do Tryton:

### A. O Modelo "Party" (Entidade Unificada)
No Tryton, não existem tabelas separadas para "Fornecedor", "Cliente" e "Funcionário" duplicando dados. Existe a **Party**.
- **Aplicação no VercFlow:**
  - Unificar `clients`, `leads`, `employees` e `suppliers` (futuro) numa estrutura base `Entity` ou `Party`.
  - Uma `Party` pode ter múltiplos papéis: Ser Cliente em uma obra e Fornecedor em outra.
  - **Benefício:** Centralização de contatos, endereços e histórico.

### B. Workflows Estritos (Máquinas de Estado)
O Tryton não permite mudar um status de "Rascunho" para "Pago" magicamente. Ele exige transições: `Draft -> Validate -> Post -> Paid`.
- **Aplicação no VercFlow:**
  - Refatorar o `useAppFlow` para não expor `updateStatus(string)`.
  - Expor ações semânticas: `promoteToQualified()`, `approveBudget()`, `signContract()`.
  - Cada ação valida pré-condições (ex: Não aprovar orçamento sem itens).

### C. Estrutura Modular de Domínio
Ao invés de um código monolítico, separar o sistema em domínios lógicos que podem ser "instalados" ou "ativados".

| Módulo Tryton | Módulo VercFlow Proposto | Responsabilidade |
| :--- | :--- | :--- |
| `party` | **CRM / Base** | Gestão de Pessoas, Empresas e Endereços. |
| `sale_opportunity` | **Comercial (Funil)** | Leads, Qualificação de Obras. |
| `sale` | **Comercial (Contratos)** | Propostas formais, Contratos. |
| `project` | **Engenharia (Obras)** | Gestão da Obra, Fases, Diário de Obra. |
| `purchase` | **Suprimentos** | Cotação de Materiais, Pedidos de Compra. |
| `account_invoice` | **Financeiro** | Contas a Pagar/Receber, Fluxo de Caixa. |

### D. Herança e Extensão
O Tryton permite que um módulo adicione campos a outro sem tocar no código original.
- **Aplicação no VercFlow:** Usar TypeScript Interfaces e Composition para estender tipos base. O módulo "Engenharia" estende o tipo `Project` base adicionando `technical_details`, enquanto o módulo "Financeiro" estende o mesmo `Project` adicionando `cost_center_id`.

---

## 3. Plano de Convergência (Roadmap)

### Fase 1: Refatoração de Tipos (Frontend)
- [ ] Criar interface `Party` em `types/index.ts`.
- [ ] Migrar `Client` para estender `Party`.
- [ ] Implementar Workflow Validator (função pura que recebe estado atual + ação e retorna novo estado ou erro).

### Fase 2: Lógica de Negócio (Store/Backend)
- [ ] Quebrar `useAppFlow` em "slices" (fatias) por domínio (`createProjectSlice`, `createCommercialSlice`).
- [ ] Implementar gatilhos cruzados (Observer Pattern): Quando 'Venda' fecha, 'Engenharia' cria projeto e 'Financeiro' cria previsão de recebimento.

### Fase 3: Persistência Robusta
- [ ] Modelar o Schema do Banco (Prisma) espelhando a modularidade proposta.
- [ ] Migrar dados do `localStorage` para o Banco DB real.

---

## 4. Exemplo Prático: Fluxo de Venda -> Obra

**Abordagem Tryton aplicada ao VercFlow:**

1. **Lead (Módulo Sale Opportunity):**
   - Cria-se uma `Opportunity` ligada a uma `Party`.
   - Conversão: Ganha -> Cria Cotação (`Sale`).

2. **Cotação (Módulo Sale):**
   - Itens de serviço/material.
   - Estado: `Draft` -> `Quotation` -> `Confirmed`.
   - Ao confirmar: Dispara gatilho.

3. **Gatilho de Confirmação:**
   - **Módulo Project:** Cria um `Work` (Obra) em estado `Planning`. Herda endereço e cliente da `Party`.
   - **Módulo Account:** Cria uma `Invoice` (Fatura) de entrada em estado `Draft`.

Essa orquestração automática elimina a necessidade de "cadastrar a obra" manualmente após fechar o contrato, reduzindo erro humano.
