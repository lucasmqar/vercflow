# VERCFLOW - Schema Expansion Plan

**Versão:** 1.0  
**Data:** 24/01/2026  
**Base Atual:** 20 modelos Prisma  
**Alvo:** 38+ modelos (expans

ão 90%)  

---

## 🎯 OBJETIVO

Expandir o schema Prisma para cobrir **todos os departamentos e fluxos** mapeados nos fluxogramas oficiais, garantindo rastreabilidade completa e aderência aos processos operacionais da empresa.

---

## 📋 ESTRUTURA DO PLANO

### **Fase 1 - DP & DST (Emergencial)**
### **Fase 2 - Comercial (Estratégico)**
### **Fase 3 - Financeiro (Operacional)**
### **Fase 4 - RH & Logística (Expansão)**

---

## 🛠️ FASE 1 - DP & DST

### **Entidades Novas: 8 modelos**

#### **1.1 Employee (Funcionário CLT)**
```prisma
model Employee {
  id              String   @id @default(cuid())
  userId          String?  @unique // Link to User (optional)
  user            User?    @relation(fields: [userId], references: [id])
  nome            String
  cpf             String   @unique
  rg              String?
  dataNascimento  DateTime?
  endereco        String?
  contatos        String?  // JSON {telefone, email, emergencia}
  cargo           String
  departamento    String
  salario         Float
  dataAdmissao    DateTime
  dataDemissao    DateTime?
  statusAtual     String   @default("ATIVO") // ATIVO, FERIAS, AFASTADO, DEMITIDO
  motivoDemissao  String?
  observacoes     String?
  criadoEm        DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  payrolls        Payroll[]
  benefits        EmployeeBenefit[]
  asos            ASO[]
  accidents       Accident[]
  epiDistributions EPIDistribution[]
  exitInterview   ExitInterview?
}
```

#### **1.2 Payroll (Folha de Pagamento)**
```prisma
model Payroll {
  id              String   @id @default(cuid())
  employeeId      String
  employee        Employee @relation(fields: [employeeId], references: [id])
  mesReferencia   DateTime // Mês/Ano (ex: 2026-01-01)
  salarioBase     Float
  horasExtras     Float?
  bonificacoes    Float?
  descontos       Float?  // JSON {inss, irrf, faltas, etc}
  salarioLiquido  Float
  dataPagamento   DateTime?
  status          String   @default("PENDENTE") // PENDENTE, PAGO, CANCELADO
  observacoes     String?
  criadoEm        DateTime @default(now())
  
  @@unique([employeeId, mesReferencia])
}
```

#### **1.3 Benefit (Benefício)**
```prisma
model Benefit {
  id              String   @id @default(cuid())
  nome            String   // Vale-transporte, Alimentação, Saúde, etc
  tipo            String   // VALE_TRANSPORTE, ALIMENTACAO, SAUDE, DENTAL, etc
  valor           Float?
  descricao       String?
  criadoEm        DateTime @default(now())
  
  employees       EmployeeBenefit[]
}

model EmployeeBenefit {
  id              String   @id @default(cuid())
  employeeId      String
  employee        Employee @relation(fields: [employeeId], references: [id])
  benefitId       String
  benefit         Benefit  @relation(fields: [benefitId], references: [id])
  dataInicio      DateTime
  dataFim         DateTime?
  valorMensal     Float?
  criadoEm        DateTime @default(now())
  
  @@unique([employeeId, benefitId, dataInicio])
}
```

#### **1.4 ThirdPartyContract (Terceirizado)**
```prisma
model ThirdPartyContract {
  id              String   @id @default(cuid())
  empresa         String
  cnpj            String
  contato         String?
  servico         String   // Limpeza, Segurança, Técnico, etc
  valorMensal     Float
  dataInicio      DateTime
  dataFim         DateTime?
  status          String   @default("ATIVO") // ATIVO, SUSPENSO, ENCERRADO
  observacoes     String?
  criadoEm        DateTime @default(now())
}
```

#### **1.5 ASO (Atestado de Saúde Ocupacional)**
```prisma
model ASO {
  id              String    @id @default(cuid())
  employeeId      String
  employee        Employee  @relation(fields: [employeeId], references: [id])
  tipo            String    // ADMISSIONAL, PERIODICO, RETORNO_FERIAS, RETORNO_AFASTAMENTO, DEMISSIONAL
  dataExame       DateTime
  dataValidade    DateTime?
  medico          String
  clinica         String?
  resultado       String    // APTO, INAPTO, APTO_COM_RESTRICOES
  restricoes      String?
  anexoUrl        String?
  criadoEm        DateTime  @default(now())
}
```

#### **1.6 SafetyInspection (Inspeção de Segurança)**
```prisma
model SafetyInspection {
  id              String   @id @default(cuid())
  projectId       String?
  project         Project? @relation(fields: [projectId], references: [id])
  inspectorId     String
  inspector       User     @relation(fields: [inspectorId], references: [id])
  dataInspecao    DateTime
  tipo            String   // ROTINA, ESPECIAL, POS_ACIDENTE
  checklistJson   String?  // JSON com itens NR-18, NR-35, etc
  conformidades   Int      @default(0)
  naoConformidades Int     @default(0)
  observacoes     String?
  status          String   @default("PENDENTE") // PENDENTE, REGULARIZADO
  criadoEm        DateTime @default(now())
}
```

#### **1.7 Accident (Acidente de Trabalho)**
```prisma
model Accident {
  id              String    @id @default(cuid())
  employeeId      String
  employee        Employee  @relation(fields: [employeeId], references: [id])
  projectId       String?
  project         Project?  @relation(fields: [projectId], references: [id])
  dataOcorrencia  DateTime
  horaOcorrencia  String?
  local           String
  descricao       String
  gravidade       String    // LEVE, MODERADO, GRAVE, FATAL
  tipoAcidente    String    // TIPICO, TRAJETO, DOENCA_OCUPACIONAL
  partesCorpo     String?   // JSON array [mao_direita, perna_esquerda, etc]
  testemunhas     String?   // JSON array de nomes
  catEmitida      Boolean   @default(false)
  numeroCAT       String?
  dataAfastamento DateTime?
  diasAfastado    Int?
  investigacao    String?
  medidasCorretivas String?
  status          String    @default("ABERTO") // ABERTO, INVESTIGACAO, FECHADO
  criadoEm        DateTime  @default(now())
}
```

#### **1.8 EPIDistribution (Distribuição de EPI)**
```prisma
model EPIDistribution {
  id              String    @id @default(cuid())
  employeeId      String
  employee        Employee  @relation(fields: [employeeId], references: [id])
  epiTipo         String    // CAPACETE, LUVAS, OCULOS, BOTINAS, CINTO, etc
  marca           String?
  quantidade      Int       @default(1)
  dataEntrega     DateTime
  dataValidade    DateTime?
  nf              String?
  assinaturaUrl   String?   // Foto/scan da assinatura
  status          String    @default("EM_USO") // EM_USO, DEVOLVIDO, DANIFICADO
  observacoes     String?
  criadoEm        DateTime  @default(now())
}
```

#### **1.9 ExitInterview (Entrevista de Desligamento)**
```prisma
model ExitInterview {
  id              String    @id @default(cuid())
  employeeId      String    @unique
  employee        Employee  @relation(fields: [employeeId], references: [id])
  dataEntrevista  DateTime
  entrevistador   String
  motivoSaida     String    // VOLUNTARIO, DEMISSAO_SEM_JUSTA_CAUSA, JUSTA_CAUSA, APOSENTADORIA
  feedbackJson    String?   // JSON com perguntas/respostas
  notaSatisfacao  Int?      // 1-5
  sugestoes       String?
  voltaria        Boolean?
  criadoEm        DateTime  @default(now())
}
```

---

## 🛠️ FASE 2 - COMERCIAL

### **Entidades Novas: 3 modelos**

#### **2.1 Lead (Captação de Clientes)**
```prisma
model Lead {
  id              String    @id @default(cuid())
  clientId        String?
  client          Client?   @relation(fields: [clientId], references: [id])
  nomeContato     String
  empresa         String?
  telefone        String
  email           String?
  origem          String    // INDICACAO, SITE, REDES_SOCIAIS, EVENTO, etc
  interesseEm     String    // RESIDENCIAL, COMERCIAL, INDUSTRIAL, etc
  areaEstimada    Float?
  orcamentoEstimado Float?
  observacoes     String?
  status          String    @default("NOVO") // NOVO, QUALIFICANDO, QUALIFICADO, PERDIDO, CONVERTIDO
  motivoPerda     String?
  responsavelId   String?
  responsavel     User?     @relation(fields: [responsavelId], references: [id])
  criadoEm        DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  budgets         Budget[]
}
```

#### **2.2 Budget (Orçamento Macro)**
```prisma
model Budget {
  id              String    @id @default(cuid())
  leadId          String?
  lead            Lead?     @relation(fields: [leadId], references: [id])
  clientId        String?
  client          Client?   @relation(fields: [clientId], references: [id])
  tipoObra        String
  escopoMacro     String    // Descrição do escopo
  areaConstruida  Float?
  valorEstimado   Float
  prazoMeses      Int?
  premissas       String?   // JSON com assumptions
  exclusoes       String?   // O que NÃO está incluído
  status          String    @default("RASCUNHO") // RASCUNHO, ENVIADO, APROVADO, REJEITADO
  dataEnvio       DateTime?
  dataResposta    DateTime?
  observacoes     String?
  criadoEm        DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  proposals       Proposal[]
}
```

#### **2.3 Proposal (Proposta Comercial)**
```prisma
model Proposal {
  id              String    @id @default(cuid())
  budgetId        String
  budget          Budget    @relation(fields: [budgetId], references: [id])
  versao          Int       @default(1)
  valorFinal      Float
  prazoExecucao   Int?      // meses
  formaPagamento  String?   // JSON {entrada, parcelas, etc}
  condicoesEspeciais String?
  validade        DateTime  // Data de validade da proposta
  status          String    @default("PENDENTE") // PENDENTE, NEGOCIACAO, APROVADA, RECUSADA, FECHADA
  dataEnvio       DateTime?
  dataResposta    DateTime?
  motivoRecusa    String?
  projectId       String?   // Link ao Project criado se aprovada
  project         Project?  @relation(fields: [projectId], references: [id])
  criadoEm        DateTime  @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 🛠️ FASE 3 - FINANCEIRO

### **Entidades Novas: 4 modelos**

#### **3.1 BankAccount (Conta Bancária)**
```prisma
model BankAccount {
  id              String    @id @default(cuid())
  banco           String
  agencia         String
  conta           String
  tipo            String    // CORRENTE, POUPANCA, INVESTIMENTO
  titular         String
  saldoInicial    Float     @default(0)
  saldoAtual      Float     @default(0)
  ativa           Boolean   @default(true)
  criadoEm        DateTime  @default(now())
  
  transactions    Transaction[]
}
```

#### **3.2 Transaction (Lançamento Financeiro)**
```prisma
model Transaction {
  id              String       @id @default(cuid())
  tipo            String       // RECEITA, DESPESA, TRANSFERENCIA
  categoria       String       // FOLHA, MATERIAIS, SERVICOS, IMPOSTOS, RECEITA_VENDA, etc
  descricao       String
  valor           Float
  dataCompetencia DateTime
  dataPagamento   DateTime?
  status          String       @default("PENDENTE") // PENDENTE, PAGO, CANCELADO
  formaPagamento  String?      // DINHEIRO, PIX, BOLETO, CARTAO, etc
  projectId       String?
  project         Project?     @relation(fields: [projectId], references: [id])
  costCenterId    String?
  costCenter      CostCenter?  @relation(fields: [costCenterId], references: [id])
  bankAccountId   String?
  bankAccount     BankAccount? @relation(fields: [bankAccountId], references: [id])
  invoiceId       String?
  invoice         Invoice?     @relation(fields: [invoiceId], references: [id])
  anexoUrl        String?
  observacoes     String?
  criadoEm        DateTime     @default(now())
}
```

#### **3.3 Invoice (Nota Fiscal)**
```prisma
model Invoice {
  id              String        @id @default(cuid())
  tipo            String        // ENTRADA, SAIDA
  numero          String        @unique
  serie           String?
  dataEmissao     DateTime
  fornecedor      String?       // Para NF de entrada
  cliente         String?       // Para NF de saída
  cnpjCpf         String?
  valorTotal      Float
  impostos        Float?
  valorLiquido    Float
  chaveAcesso     String?
  xmlUrl          String?
  pdfUrl          String?
  status          String        @default("EMITIDA") // EMITIDA, CANCELADA, DEVOLVIDA
  projectId       String?
  project         Project?      @relation(fields: [projectId], references: [id])
  criadoEm        DateTime      @default(now())
  
  transactions    Transaction[]
}
```

#### **3.4 CostCenter (Centro de Custo)**
```prisma
model CostCenter {
  id              String        @id @default(cuid())
  codigo          String        @unique
  nome            String
  tipo            String        // OBRA, DEPARTAMENTO, SERVICO
  projectId       String?       // Se for específico de obra
  project         Project?      @relation(fields: [projectId], references: [id])
  orcamentoMensal Float?
  ativo           Boolean       @default(true)
  criadoEm        DateTime      @default(now())
  
  transactions    Transaction[]
}
```

---

## 🛠️ FASE 4 - RH & LOGÍSTICA

### **Entidades Novas: 7 modelos**

#### **4.1 JobOpening (Vaga)**
```prisma
model JobOpening {
  id              String       @id @default(cuid())
  titulo          String
  cargo           String
  departamento    String
  descricao       String
  requisitos      String?
  salario         Float?
  beneficios      String?
  tipoContrato    String       // CLT, PJ, TEMPORARIO, ESTAGIO
  localTrabalho   String?
  dataAbertura    DateTime
  dataFechamento  DateTime?
  status          String       @default("ABERTA") // ABERTA, PAUSADA, FECHADA, PREENCHIDA
  numeroVagas     Int          @default(1)
  criadoEm        DateTime     @default(now())
  
  candidates      Candidate[]
}
```

#### **4.2 Candidate (Candidato)**
```prisma
model Candidate {
  id              String       @id @default(cuid())
  jobOpeningId    String
  jobOpening      JobOpening   @relation(fields: [jobOpeningId], references: [id])
  nome            String
  cpf             String?
  telefone        String
  email           String
  curriculoUrl    String?
  pretensaoSalarial Float?
  disponibilidade String?
  origem          String       // LINKEDIN, SITE, INDICACAO, etc
  status          String       @default("NOVO") // NOVO, TRIAGEM, ENTREVISTA, APROVADO, REPROVADO, CONTRATADO
  criadoEm        DateTime     @default(now())
  
  interviews      Interview[]
}
```

#### **4.3 Interview (Entrevista)**
```prisma
model Interview {
  id              String    @id @default(cuid())
  candidateId     String
  candidate       Candidate @relation(fields: [candidateId], references: [id])
  data            DateTime
  entrevistador   String
  tipo            String    // TELEFONE, PRESENCIAL, VIDEO
  feedbackJson    String?   // JSON com perguntas/respostas
  nota            Int?      // 1-5
  resultado       String    @default("PENDENTE") // PENDENTE, APROVADO, REPROVADO
  observacoes     String?
  criadoEm        DateTime  @default(now())
}
```

#### **4.4 SatisfactionSurvey (Pesquisa de Satisfação)**
```prisma
model SatisfactionSurvey {
  id              String   @id @default(cuid())
  titulo          String
  descricao       String?
  perguntasJson   String   // JSON array de perguntas
  dataCriacao     DateTime
  dataInicio      DateTime
  dataFim         DateTime?
  ativa           Boolean  @default(true)
  criadoEm        DateTime @default(now())
  
  responses       SurveyResponse[]
}

model SurveyResponse {
  id              String             @id @default(cuid())
  surveyId        String
  survey          SatisfactionSurvey @relation(fields: [surveyId], references: [id])
  employeeId      String?            // Opcional (pode ser anônimo)
  respostasJson   String             // JSON com respostas
  dataResposta    DateTime
  criadoEm        DateTime           @default(now())
}
```

#### **4.5 MaintenanceRecord (Manutenção Veicular)**
```prisma
model MaintenanceRecord {
  id              String   @id @default(cuid())
  vehicleId       String
  vehicle         Vehicle  @relation(fields: [vehicleId], references: [id])
  tipo            String   // PREVENTIVA, CORRETIVA, REVISAO
  descricao       String
  oficina         String?
  valor           Float?
  dataExecucao    DateTime
  quilometragem   Int?
  proximaRevisao  DateTime?
  anexoUrl        String?
  criadoEm        DateTime @default(now())
}
```

#### **4.6 Tool (Ferramenta)**
```prisma
model Tool {
  id              String        @id @default(cuid())
  codigo          String        @unique
  nome            String
  tipo            String        // ELETRICA, MANUAL, MEDICAO, etc
  marca           String?
  estado          String        @default("BOM") // BOM, REGULAR, DANIFICADO
  localizacao     String?       // Almoxarifado, Obra X, etc
  responsavel     String?
  dataAquisicao   DateTime?
  valorAquisicao  Float?
  criadoEm        DateTime      @default(now())
  
  loans           ToolLoan[]
}

model ToolLoan {
  id              String    @id @default(cuid())
  toolId          String
  tool            Tool      @relation(fields: [toolId], references: [id])
  usuarioId       String
  usuario         User      @relation(fields: [usuarioId], references: [id])
  projectId       String?
  project         Project?  @relation(fields: [projectId], references: [id])
  dataSaida       DateTime
  dataRetorno     DateTime?
  estadoSaida     String    // BOM, REGULAR
  estadoRetorno   String?   // BOM, REGULAR, DANIFICADO
  observacoes     String?
  criadoEm        DateTime  @default(now())
}
```

#### **4.7 Accommodation (Alojamento)**
```prisma
model Accommodation {
  id              String   @id @default(cuid())
  nome            String
  endereco        String
  capacidade      Int
  ocupacaoAtual   Int      @default(0)
  projectId       String?
  project         Project? @relation(fields: [projectId], references: [id])
  status          String   @default("DISPONIVEL") // DISPONIVEL, OCUPADO, MANUTENCAO
  observacoes     String?
  criadoEm        DateTime @default(now())
  
  occupancies     AccommodationOccupancy[]
}

model AccommodationOccupancy {
  id              String        @id @default(cuid())
  accommodationId String
  accommodation   Accommodation @relation(fields: [accommodationId], references: [id])
  employeeId      String
  dataEntrada     DateTime
  dataSaida       DateTime?
  observacoes     String?
  criadoEm        DateTime      @default(now())
}
```

---

## 🔗 AJUSTES EM MODELOS EXISTENTES

### **User**
```prisma
// Adicionar relations
SafetyInspections  SafetyInspection[]
leads              Lead[] @relation("UserLeads")
toolLoans          ToolLoan[]
```

### **Project**
```prisma
// Adicionar relations
accidents          Accident[]
safetyInspections  SafetyInspection[]
proposals          Proposal[]
transactions       Transaction[]
invoices           Invoice[]
costCenters        CostCenter[]
toolLoans          ToolLoan[]
accommodations     Accommodation[]
```

### **Client**
```prisma
// Adicionar relations
leads              Lead[]
budgets            Budget[]
```

### **Vehicle**
```prisma
// Adicionar relation
maintenances       MaintenanceRecord[]
```

---

## 📊 RESUMO DA EXPANSÃO

### **Antes:**
- **Modelos:** 20
- **Departamentos Cobertos:** 4/8 (50%)
- **Fluxos Implementados:** 25/73 (34%)

### **Depois (Completo):**
- **Modelos:** 38+ (expansão 90%)
- **Departamentos Cobertos:** 8/8 (100%)
- **Fluxos Implementados:** 70+/73 (95%+)

### **Novos Modelos por Fase:**
- **Fase 1:** +9 modelos (DP/DST)
- **Fase 2:** +3 modelos (Comercial)
- **Fase 3:** +4 modelos (Financeiro)
- **Fase 4:** +10 modelos (RH/Logística)

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Para Cada Modelo:**
- [ ] Definir schema Prisma
- [ ] Executar migration
- [ ] Criar tipos TypeScript
- [ ] Implementar API CRUD (GET, POST, PATCH, DELETE)
- [ ] Criar componentes frontend
- [ ] Adicionar ao seed script
- [ ] Documentar endpoints
- [ ] Testes unitários
- [ ] Testes E2E

---

## 🔒 PRÓXIMOS PASSOS

1. **Validação:** CEO/Gestor/Tech Lead revisar este plano
2. **Priorização:** Confirmar ordem das fases
3. **Migration Inicial:** Criar branch `schema-expansion-p0`
4. **Implementação Fase 1:** Iniciar com DP/DST
5. **Rollout Progressivo:** Testar, validar, deploy por fase

---

**📧 Contato:** [Equipe de Desenvolvimento]  
**🔒 Confidencial - VERCFLOW Schema Expansion Plan**
