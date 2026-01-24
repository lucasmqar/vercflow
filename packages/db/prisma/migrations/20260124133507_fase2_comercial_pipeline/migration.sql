-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "nomeObra" TEXT NOT NULL,
    "localizacao" TEXT,
    "origem" TEXT,
    "classificacao" TEXT,
    "areaEstimada" REAL,
    "tipoObra" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NOVO',
    "motivoPerda" TEXT,
    "observacoes" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lead_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "escopoMacro" TEXT NOT NULL,
    "valorEstimado" REAL NOT NULL,
    "prazoEstimadoMeses" INTEGER,
    "premissas" TEXT,
    "exclusoes" TEXT,
    "observacoesTecnicas" TEXT,
    "status" TEXT NOT NULL DEFAULT 'EM_ELABORACAO',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Budget_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "budgetId" TEXT NOT NULL,
    "projectId" TEXT,
    "versao" INTEGER NOT NULL DEFAULT 1,
    "valorFinal" REAL NOT NULL,
    "prazoMeses" INTEGER,
    "condicoesComerciais" TEXT,
    "formaPagamento" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "motivoRecusa" TEXT,
    "dataEnvio" DATETIME,
    "dataAprovacao" DATETIME,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Proposal_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Proposal_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_projectId_key" ON "Proposal"("projectId");
