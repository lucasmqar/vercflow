# 🚀 FASE 2 - COMERCIAL (Pipeline de Vendas) - INICIADA

**Iniciado:** 24/01/2026 10:38  
**Status:** Backend Pronto | Frontend em Andamento  

---

## ✅ BANCO SINCRONIZADO

### **Migration Executada:**
- ✅ **Nome:** `20260124133507_fase2_comercial_pipeline`
- ✅ **Status:** Sucesso
- ✅ **Prisma Client:** Gerado automaticamente

---

## 📊 SCHEMA EXPANDIDO (Fase 2)

### **3 Novos Modelos Adicionados:**

#### **1. Lead** (Primeiro Contato)
```prisma
model Lead {
  id              String    @id @default(cuid())
  clientId        String
  client          Client    @relation(fields: [clientId], references: [id])
  
  nomeObra        String
  localizacao     String?
  origem          String?   // INDICACAO, SITE, REDE_SOCIAL, EVENTO, PARCERIA
  classificacao   String?   // RESIDENCIAL, COMERCIAL, INDUSTRIAL
  areaEstimada    Float?
  tipoObra        String?
  
  status          String    @default("NOVO")
  // NOVO → EM_QUALIFICACAO → QUALIFICADO → PERDIDO/CONVERTIDO
  
  budgets         Budget[]  // 1 Lead pode ter vários orçamentos
}
```

#### **2. Budget** (Orçamento)
```prisma
model Budget {
  id                  String    @id @default(cuid())
  leadId              String
  lead                Lead      @relation(fields: [leadId], references: [id])
  
  escopoMacro         String
  valorEstimado       Float
  prazoEstimadoMeses  Int?
  
  premissas           String?   // JSON
  exclusoes           String?   // JSON
  
  status              String    @default("EM_ELABORACAO")
  // EM_ELABORACAO → REVISAO → APROVADO/RECUSADO
  
  proposals           Proposal[] // 1 Budget pode ter várias propostas (versões)
}
```

#### **3. Proposal** (Proposta Comercial)
```prisma
model Proposal {
  id            String    @id @default(cuid())
  budgetId      String
  budget        Budget    @relation(fields: [budgetId], references: [id])
  
  projectId     String?   @unique
  project       Project?  @relation(fields: [projectId], references: [id])
  
  versao        Int       @default(1)
  valorFinal    Float
  prazoMeses    Int?
  
  condicoesComerciais String? // JSON
  formaPagamento      String?
  
  status        String    @default("PENDENTE")
  // PENDENTE → NEGOCIACAO → APROVADA → CONVERTIDA (cria Project)
  // ou RECUSADA
  
  dataEnvio     DateTime?
  dataAprovacao DateTime?
}
```

### **Relations Atualizadas:**
- ✅ `Client` → `leads[]` (1 cliente pode ter vários leads)
- ✅ `Project` → `proposal?` (1 projeto vem de 1 proposta aprovada)

---

## 🔄 FLUXO DO PIPELINE COMERCIAL

```
LEAD (Novo Contato)
  │
  ├─> Qualificação
  │
  ├─> BUDGET (Orçamento)
  │     │
  │     ├─> Elaboração
  │     ├─> Revisão Técnica
  │     │
  │     └─> PROPOSAL (Proposta v1, v2, v3...)
  │           │
  │           ├─> Envio ao Cliente
  │           ├─> Negociação
  │           │
  │           └─> APROVADA
  │                 │
  │                 └─> PROJECT (Obra Criada!)
  │
  └─> PERDIDO (Motivo documentado)
```

---

## 🎯 PRÓXIMOS PASSOS - IMPLEMENTAÇÃO

### **1. API Endpoints (Backend)** ⏳

**Leads:**
- `GET /api/leads` - Listar todos
- `POST /api/leads` - Criar novo lead
- `GET /api/leads/:id` - Detalhes
- `PATCH /api/leads/:id` - Atualizar (qualificar, perder)
- `POST /api/leads/:id/convert` - Converter em Budget

**Budgets:**
- `GET /api/budgets` - Listar orçamentos
- `POST /api/budgets` - Criar orçamento (a partir de Lead)
- `GET /api/budgets/:id` - Detalhes
- `PATCH /api/budgets/:id` - Atualizar
- `POST /api/budgets/:id/propose` - Gerar Proposta

**Proposals:**
- `GET /api/proposals` - Listar propostas
- `POST /api/proposals` - Criar proposta (a partir de Budget)
- `GET /api/proposals/:id` - Detalhes
- `PATCH /api/proposals/:id` - Atualizar
- `POST /api/proposals/:id/approve` - Aprovar e criar Project

**Total:** ~15 endpoints

---

### **2. Frontend (ComercialDashboard)** ⏳

**Já existe estrutura base, precisa:**
- ✅ Conectar às APIs reais (substituir mock data)
- ✅ Implementar formulários:
  - Novo Lead
  - Novo Orçamento (a partir de Lead)
  - Nova Proposta (a partir de Budget)
- ✅ Workflow de conversão:
  - Lead → Budget (botão "Orçar")
  - Budget → Proposal (botão "Gerar Proposta")
  - Proposal → Project (botão "Converter em Obra")

---

### **3. TypeScript Types** ⏳

**Adicionar ao `/apps/web/src/types/index.ts`:**
```typescript
export interface Lead {
  id: string;
  clientId: string;
  client?: Client;
  nomeObra: string;
  localizacao?: string;
  origem?: string;
  classificacao?: string;
  areaEstimada?: number;
  tipoObra?: string;
  status: 'NOVO' | 'EM_QUALIFICACAO' | 'QUALIFICADO' | 'PERDIDO' | 'CONVERTIDO';
  motivoPerda?: string;
  observacoes?: string;
  criadoEm: string;
  updatedAt: string;
  budgets?: Budget[];
}

// Budget, Proposal...
```

---

## 📈 IMPACTO ESPERADO

### **Antes (Fase 1):**
- ❌ Leads não rastreados
- ❌ Orçamentos informais
- ❌ Sem funil de vendas
- ❌ Conversão não mensurável

### **Depois (Fase 2):**
- ✅ **Leads qualificados** e rastreados
- ✅ **Orçamentos formais** com revisões
- ✅ **Propostas versionadas** (v1, v2, v3)
- ✅ **Funil visual** (Kanban no ComercialDashboard)
- ✅ **Taxa de conversão** calculada automaticamente
- ✅ **Histórico completo** Lead → Budget → Proposal → Project

---

## ⏰ TEMPO ESTIMADO

| Etapa | Tempo |
|-------|-------|
| API Endpoints | 30-40 min |
| Frontend (Forms) | 20-30 min |
| Types & Integration | 10-15 min |
| **Total Fase 2** | **~1.5 horas** |

---

**🎯 BANCO SINCRONIZADO! PRONTO PARA IMPLEMENTAR ENDPOINTS!** 🚀
