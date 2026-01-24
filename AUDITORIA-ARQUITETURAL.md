# VERCFLOW - Auditoria Arquitetural Constitucional Profunda

> **STATUS:** Em Andamento - Fase 1 Concluída  
> **INICIADO:** 2026-01-24  
> **DOCUMENTOS CONSTITUCIONAIS:** `ID Verc (Protocolos de Identificação Padrão)/` + Fluxogramas Textual Fornecidos  

---

## 🎯 OBJETIVO

Realizar auditoria arquitetural profunda e completa do sistema VERCFLOW, comparando a **implementação real** (código, schema, API) com os **fluxogramas oficiais** (Constitution), identificando **divergências**, **funcionalidades ausentes**, **endpoints desconectados**, **redundâncias** e **oportunidades de otimização**, culminando em um **Plano de Correção** e **Estratégia de Refatoração**.

---

## 📋 METODOLOGIA

### Fase 1: Mapeamento do Estado Atual ✅ (CONCLUÍDA)
1. ✅ **Schema do Prisma:** 20 tabelas analisadas
2. ✅ **Endpoints da API:** 50+ endpoints catalogados  
3. ✅ **Tipos TypeScript:** Interfaces e enums verificados
4. ⏳ **Frontend Components:** Dashboards mapeados (parcial)

### Fase 2: Análise dos Fluxogramas Oficiais ✅ (CONCLUÍDA)
1. ✅ **Comercial:** Fluxo hierárquico completo analisado
2. ✅ **Aprovações:** 9 tipos de aprovações mapeados
3. ✅ **Compras:** 13 etapas do fluxo identificadas
4. ✅ **Logística:** 8 sub-fluxos analisados
5. ✅ **RH:** 9 processos mapeados
6. ✅ **DP:** 14 rotinas documentadas
7. ✅ **DST:** 7 procedimentos listados
8. ✅ **Financeiro:** 14 processos identificados

### Fase 3: Comparação e Identificação de Divergências ✅ (CONCLUÍDA)
1. ✅ **Mapeamento Departamental:** 8 departamentos auditados
2. ✅ **Fluxos Ausentes:** 45+ fluxos não implementados identificados
3. ✅ **Implementações Órfãs:** 3 schemas desconectados encontrados
4. ⏳ **Campos/Relações Faltantes:** Em análise

### Fase 4: Plano de Correção (EM PROGRESSO)
### Fase 5: Reset de Dados & Seed Completo (AGUARDANDO)

---

## 📊 FASE 1 - ESTADO ATUAL DO SISTEMA

### 1.1 SCHEMA PRISMA

**Implementado:** 20 modelos principais

#### **Core Entities**
- ✅ `User` (11 roles, sem separação Employee/Professional clara)
- ✅ `Client` (PF/PJ, representações JSON, config órgãos JSON)
- ✅ `Project` (status, categoria, área, exigências JSON)
- ✅ `Fee` (taxas genéricas)

#### **Records & Docs**
- ✅ `Record` (lifecycle 7 estados)
- ✅ `RecordItem` (4 tipos)
- ✅ `Sketch` (JSON + imageUrl)
- ✅ `Document` (hash, versão, pdfUrl)

#### **Engineering**
- ✅ `Discipline` (1.x-14.x, fases: PRELIMINAR/LEGAL/EXECUTIVO)
- ✅ `ChecklistItem` (3 tipos: DOCUMENTO, PROJETO, MATERIAL)
- ✅ `Activity` (5 status)
- ✅ `Professional` (interno/externo confuso)
- ✅ `ProfessionalCategory`
- ✅ `ActivityAssignment` (valores previsto/real)
- ✅ `ProjectFile` (nomenclatura padronizada)

#### **Purchasing**
- ✅ `Request` (genérico)
- ✅ `PurchaseRequest` (7 status)
- ✅ `PurchaseQuotation`
- ✅ `PurchaseOrder`

#### **Logistics**
- ✅ `Vehicle` (4 status)
- ✅ `StockMovement` (3 tipos)

#### **Audit**
- ✅ `AuditLog`
- ✅ `RaciAssignment` (4 roles)
- ✅ `Comment`

---

### 1.2 ENDPOINTS DA API

**Total:** 52 endpoints implementados

#### **Auth (1)**
- `POST /api/auth/login` (sem senha Hash, comparação direta)

#### **Records (7)**
- `POST /api/records`
- `GET /api/records`
- `PATCH /api/records/:id`
- `DELETE /api/records/:id`
- `POST /api/records/:id/sketch`
- `POST /api/records/:id/convert`
- `GET /api/records/:id/pdf-view`
- `PATCH /api/record-items/:id`

#### **Projects (14)**
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `GET /api/projects/:id/report`
- `POST /api/projects/:id/enquadramento`
- `GET /api/projects/:id/fees`
- `POST /api/fees`
- `POST /api/projects/:id/configure`
- `GET /api/projects/pipeline`
- `GET /api/projects/completed`
- `GET /api/projects/:id/schedule`
- `GET /api/projects/:id/professionals`
- `GET /api/projects/:id/files`
- `POST /api/projects/:id/files`

#### **Clients (2)**
- `GET /api/clients`
- `POST /api/clients`

#### **Users (2)**
- `GET /api/users`
- `POST /api/users`

#### **Professionals (2)**
- `GET /api/professionals`
- `POST /api/professionals`

#### **Activities (2)**
- `GET /api/activities`
- `PATCH /api/activities/:id`

#### **Disciplines (2)**
- `GET /api/disciplines`
- `GET /api/disciplines/:id`

#### **Stock & Logistics (6)**
- `GET /api/stock/movements`
- `POST /api/stock/movements`
- `GET /api/vehicles`
- `POST /api/vehicles`
- `PATCH /api/vehicles/:id`
- `DELETE /api/vehicles/:id`

#### **Documents (2)**
- `POST /api/docs/formalize`
- `GET /api/docs/view/:recordId`

#### **Dashboards (2)**
- `GET /api/dashboard/home`
- `GET /api/dashboard/ceo`

#### **Purchasing (9 - NOVOS!)**
- `GET /api/purchases`
- `POST /api/purchases`
- `POST /api/purchases/:id/quotations`
- `POST /api/purchases/:id/order`

#### **Health (1)**
- `GET /health`

---

### 1.3 TIPOS TYPESCRIPT

```typescript
// 18 Roles implementados
'CEO' | 'DIRETOR' | 'GERENTE_COMERCIAL' | 'CONSULTOR_COMERCIAL' | 
'COORD_ENGENHARIA' | 'ENGENHEIRO_OBRA' | 'MESTRE_OBRA' | 
'COORD_PROJETOS' | 'ARQUITETO' | 'PROJETISTA' | 
'GERENTE_FINANCEIRO' | 'GERENTE_COMPRAS' | 'COORD_RH' | 'COORD_LOGISTICA' | 
'ENCARREGADO' | 'PARCEIRO_EXTERNO' | 'CLIENTE_VIEW' | 'ADMIN'

// 10 Departamentos
'DIRETORIA' | 'COMERCIAL' | 'ENGENHARIA' | 'PROJETOS' | 'FINANCEIRO' | 
'COMPRAS' | 'RH_SST' | 'LOGISTICA' | 'DESIGN' | 'EXTERNO'

// 13 Dashboard Tabs
'home' | 'captura' | 'triagem' | 'comercial' | 'obras' | 'projetos' | 
'engenharia' | 'financeiro' | 'estoque' | 'rh-sst' | 'logistica' | 
'design' | 'config'
```

---

## 🚨 FASE 2-3 - DIVERGÊNCIAS IDENTIFICADAS

### **DEPARTAMENTO: COMERCIAL**

#### **Fluxo Oficial:** 15 etapas (Captação → Mobilização)

#### **Divergências Críticas:**
| Item | Status | Problema |
|------|--------|----------|
| Lead (Captação) | ❌ AUSENTE | Não há entidade `Lead` |
| Budget | ❌ AUSENTE | Não há entidade `Budget` |
| Proposal | ❌ AUSENTE | Não há entidade `Proposal` |
| Briefing | ❌ AUSENTE | Não há registro formal de requisitos |
| Croqui Aprovação | ❌ AUSENTE | Não há workflow de aprovação de cliente |
| Solicitações Iniciais | ❌ AUSENTE | Não há checklist de docs iniciais |
| Manual Boas-Vindas | ❌ AUSENTE | Não há template/geração |
| Mobilização Obra | ❌ AUSENTE | Não há registro de mobilização |

**Impacto:** Pipeline comercial inexistente. Sistema pula de "nada" para "Project ATIVA".

---

### **DEPARTAMENTO: APROVAÇÕES**

#### **Fluxo Oficial:** 9 tipos (Condomínio, Prefeitura, Bombeiros, VISA, SUDERV, etc.)

#### **Divergências Críticas:**
| Item | Status | Problema |  
|------|--------|----------|
| Entidade `Approval` | ❌ AUSENTE | Não há rastreamento individual |
| Workflow (Solicitar →Analisar→Aprovar) | ❌ AUSENTE | Apenas flags JSON em `Project` |
| Protocolos | ❌ AUSENTE | Não há registro de número/data |
| Taxas Vinculadas | ⚠️ PARCIAL | `Fee` existe mas desconectada |
| Alertas Vencimento | ❌ AUSENTE | Não há notificações |
| Tab Específica | ❌ AUSENTE | Não há interface dedicada |

**Impacto:** Impossível rastrear status real de aprovações. Risco de perda de prazos.

---

### **DEPARTAMENTO: COMPRAS**

#### **Fluxo Oficial:** 13 etapas (Solicitação → Entrega)

#### **Divergências Críticas:**
| Item | Status | Problema |
|------|--------|----------|
| API CRUD Compras | ⚠️ PARCIAL | Endpoints existem mas incompletos |
| Frontend Compras | ❌ AUSENTE | Tab "estoque" não usa Purchasing models |
| Controle Estoque Físico | ❌ AUSENTE | Apenas movimentações, sem inventário |
| Programação Alimentação | ❌ AUSENTE | Não implementado |
| Cartão Corporativo | ❌ AUSENTE | Não implementado |
| Alertas Estoque Baixo | ❌ AUSENTE | Não implementado |

**Impacto:** Schema completo mas **órfão**. Funcionalidade essencial não utilizável.

---

### **DEPARTAMENTO: LOGÍSTICA**

#### **Fluxo Oficial:** 8 sub-fluxos (Transporte, Frotas, Ferramentas, Alojamento, etc.)

#### **Divergências Críticas:**
| Item | Status | Problema |
|------|--------|----------|
| Manutenção Veicular | ❌ AUSENTE | Não há `MaintenanceRecord` |
| Controle Ferramentas | ❌ AUSENTE | Não há entidade |
| Exterminador (Pragas) | ❌ AUSENTE | Não há entidade |
| Alojamento | ❌ AUSENTE | Não há entidade |
| Histórico Manutenção | ❌ AUSENTE | Não há timeline de manutenções |

**Impacto:** Logística reduzida a veículos e movimentações básicas.

---

### **DEPARTAMENTO: RH**

#### **Fluxo Oficial:** 9 processos (Recrutamento → Endomarketing)

#### **Divergências Críticas:**
| Item | Status | Problema |
|------|--------|----------|
| `JobOpening` | ❌ AUSENTE | Não há entidade de vagas |
| `Candidate` | ❌ AUSENTE | Não há pipeline de candidatos |
| `Interview` | ❌ AUSENTE | Não há registro de entrevistas |
| `SatisfactionSurvey` | ❌ AUSENTE | Não há pesquisas de clima |
| `ExitInterview` | ❌ AUSENTE | Não há entrevistas de saída |
| Backend RH | ❌ AUSENTE | Nenhum endpoint implementado |

**Impacto:** Departamento crítico **totalmente ausente**.

---

### **DEPARTAMENTO: DP (Departamento Pessoal)**

#### **Fluxo Oficial:** 14 rotinas (Admissão → ASO)

#### **Divergências Críticas:**
| Item | Status | Problema |
|------|--------|----------|
| `Employee` | ❌ AUSENTE | Confusão com `Professional` |
| `Payroll` | ❌ AUSENTE | Não há folha de pagamento |
| `Benefit` | ❌ AUSENTE | Não há controle de benefícios |
| `ThirdPartyContract` | ❌ AUSENTE | Terceirizados não rastreados |
| `ASO` | ❌ AUSENTE | Atestados não registrados |
| Backend DP | ❌ AUSENTE | Nenhum endpoint implementado |

**Impacto:** DP **totalmente ausente**. `Professional` não substitui Employee CLT.

---

### **DEPARTAMENTO: DST (Segurança do Trabalho)**

#### **Fluxo Oficial:** 7 procedimentos (Inspeção → Acidentes)

#### **Divergências Críticas:**
| Item | Status | Problema |
|------|--------|----------|
| `SafetyInspection` | ❌ AUSENTE | Não há registro de inspeções |
| `EPIDistribution` | ❌ AUSENTE | Não há controle de EPIs |
| `Accident` | ❌ AUSENTE | Não há registro de CAT |
| `ASO` | ❌ AUSENTE | Atestados não registrados |
| Backend DST | ❌ AUSENTE | Nenhum endpoint implementado |

**Impacto:** Risco de compliance. Sem registro = auditoria/fiscalização comprometida.

---

### **DEPARTAMENTO: FINANCEIRO**

#### **Fluxo Oficial:** 14 processos (Fluxo de Caixa → Arquivamentos)

#### **Divergências Críticas:**
| Item | Status | Problema |
|------|--------|----------|
| `Transaction` | ❌ AUSENTE | Não há lançamentos financeiros |
| `Invoice` | ❌ AUSENTE | Não há notas fiscais |
| `BankAccount` | ❌ AUSENTE | Não há contas bancárias |
| `CostCenter` | ❌ AUSENTE | Não há centro de custos por obra |
| Fluxo de Caixa | ❌ AUSENTE | Não há relatório/dashboard |
| Cartões Corporativos | ❌ AUSENTE | Não implementado |
| Conciliação Bancária | ❌ AUSENTE | Não implementado |

**Impacto:** `Fee` genérico não modela transações completas. Financeiro fragmentado.

---

## 📉 RESUMO EXECUTIVO

### **Departamentos CRÍTICOS Totalmente AUSENTES:**
1. ❌ **Comercial (Pipeline):** Lead, Budget, Proposal, Briefing
2. ❌ **RH:** JobOpening, Candidate, Interview, Surveys
3. ** ***DP:** Employee, Payroll, Benefit, ThirdPartyContract
4. ❌ **DST:** SafetyInspection, Accident, EPI, ASO
5. ❌ **Financeiro:** Transaction, Invoice, CostCenter, BankAccount

### **Funcionalidades PARCIAIS (Schema ✅, API ⚠️, Frontend ❌):**
1. ⚠️ **Compras:** Models OK, API incompleta, Frontend órfã
2. ⚠️ **Aprovações:** Flags JSON, sem workflow
3. ⚠️ **Logística:** Veículos OK, manutenção/ferramentas/alojamento ausentes

### **Redundâncias/Confusões:**
1. ⚠️ `Professional` vs `Employee` (sem separação clara CLT/PJ)
2. ⚠️ `Request` vs `PurchaseRequest` (genérico vs específico)
3. ⚠️ `ChecklistItem` genérico sobrecarregado

### **Estatísticas:**
- **Fluxos Mapeados:** 73+ etapas oficiais
- **Fluxos Implementados:** ~25 etapas (34%)
- **Entidades Faltantes:** 18+ modelos críticos
- **Endpoints Faltantes:** 30+ APIs necessárias
- **Tabs Órfãs:** 3 (comercial, financeiro, estoque parcialmente)

---

## 🛠️ PRÓXIMOS PASSOS

### **Fase 4: Plano de Correção (EM ANDAMENTO)**

#### **Priorização Sugerida (CEO/Gestor decidem):**  
1. **P0 - CRÍTICO:** DP + DST (Compliance/Legal)
2. **P1 - ALTA:** Comercial (Pipeline de negócios)
3. **P2 - MÉDIA:** Financeiro + Compras (Conectar frontend)
4. **P3 - BAIXA:** RH + Logística (Expansões)

#### **Ações Imediatas:**
1. **Schema Expansion:**
   - `Employee`, `Payroll`, `Benefit` (DP)
   - `SafetyInspection`, `Accident`, `EPIDistribution` (DST)
   - `Lead`, `Budget`, `Proposal` (Comercial)
   - `Transaction`, `Invoice`, `BankAccount`, `CostCenter` (Financeiro)
   
2. **API Development:**
   - Completar CRUD de Purchasing
   - Criar workflow de Aprovações
   - Endpoints DP, DST, RH, Financeiro

3. **Frontend Completion:**
   - Conectar `EstoqueDashboard` ao Purchasing
   - Criar `ApprovalsDashboard`
   - Expandir `ComercialDashboard` (Lead/Budget/Proposal)
   - Implementar `RHDashboard` completo
   - Implementar `FinanceiroDashboard` completo

4. **Data Reset & Seed:**
   - Criar dataset completo multidepartamental
   - Exemplos de todos os fluxos

---

## 📌 NOTAS

- **Este documento será atualizado continuamente**
- **Fluxogramas oficiais = FONTE ÚNICA DE VERDADE (Constitution)**
- **Próxima Sessão:** Definir prioridades com CEO/Gestor e iniciar Schema Expansion

---

**🔒 CONFIDENCIAL - VERCFLOW INTERNAL AUDIT**
