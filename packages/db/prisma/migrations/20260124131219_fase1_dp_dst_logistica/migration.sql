/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `assignedToId` on the `Discipline` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Discipline` table. All the data in the column will be lost.
  - You are about to drop the column `currentPhase` on the `Discipline` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Discipline` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Discipline` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory` on the `Discipline` table. All the data in the column will be lost.
  - You are about to drop the column `disciplineId` on the `Request` table. All the data in the column will be lost.
  - Added the required column `codigo` to the `Discipline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Task";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Fee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "documentId" TEXT,
    "nome" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "vencimento" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "anexoUrl" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Fee_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Fee_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "disciplineId" TEXT,
    "tipo" TEXT NOT NULL,
    "codigo" TEXT,
    "descricao" TEXT NOT NULL,
    "ambiente" TEXT,
    "departamento" TEXT,
    "responsavelId" TEXT,
    "prazo" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "quantidade" REAL,
    "marca" TEXT,
    "nf" TEXT,
    "fornecedor" TEXT,
    "anexoUrl" TEXT,
    "revisao" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChecklistItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChecklistItem_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PurchaseRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "solicitanteId" TEXT NOT NULL,
    "disciplina" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SOLICITADO',
    "urgencia" TEXT NOT NULL DEFAULT 'NORMAL',
    "obs" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PurchaseRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PurchaseQuotation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "fornecedor" TEXT NOT NULL,
    "valorTotal" REAL NOT NULL,
    "prazoEntrega" TEXT,
    "condicaoPagamento" TEXT,
    "anexoUrl" TEXT,
    "selecionada" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PurchaseQuotation_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PurchaseRequest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "numeroOC" TEXT NOT NULL,
    "valorFinal" REAL NOT NULL,
    "dataEmissao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'EMITIDA',
    "nf" TEXT,
    "documentoNfUrl" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PurchaseOrder_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PurchaseRequest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "disciplineId" TEXT,
    "nome" TEXT NOT NULL,
    "tipo" TEXT,
    "fase" TEXT,
    "revisao" TEXT NOT NULL DEFAULT 'R0',
    "folha" TEXT,
    "url" TEXT NOT NULL,
    "extensao" TEXT NOT NULL,
    "origem" TEXT,
    "faseObra" TEXT,
    "tags" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectFile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "quantidade" REAL NOT NULL,
    "unidade" TEXT,
    "obraId" TEXT,
    "usuarioId" TEXT NOT NULL,
    "observacao" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockMovement_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StockMovement_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placa" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "cor" TEXT,
    "ano" INTEGER,
    "responsavelId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DISPONIVEL',
    "quilometragem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vehicle_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "dataNascimento" DATETIME,
    "endereco" TEXT,
    "contatos" TEXT,
    "cargo" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "salario" REAL NOT NULL,
    "dataAdmissao" DATETIME NOT NULL,
    "dataDemissao" DATETIME,
    "statusAtual" TEXT NOT NULL DEFAULT 'ATIVO',
    "motivoDemissao" TEXT,
    "observacoes" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payroll" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "mesReferencia" DATETIME NOT NULL,
    "salarioBase" REAL NOT NULL,
    "horasExtras" REAL,
    "bonificacoes" REAL,
    "descontos" REAL,
    "salarioLiquido" REAL NOT NULL,
    "dataPagamento" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payroll_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Benefit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" REAL,
    "descricao" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmployeeBenefit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "benefitId" TEXT NOT NULL,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME,
    "valorMensal" REAL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployeeBenefit_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EmployeeBenefit_benefitId_fkey" FOREIGN KEY ("benefitId") REFERENCES "Benefit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ThirdPartyContract" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "empresa" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "contato" TEXT,
    "servico" TEXT NOT NULL,
    "valorMensal" REAL NOT NULL,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "observacoes" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ASO" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "dataExame" DATETIME NOT NULL,
    "dataValidade" DATETIME,
    "medico" TEXT NOT NULL,
    "clinica" TEXT,
    "resultado" TEXT NOT NULL,
    "restricoes" TEXT,
    "anexoUrl" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ASO_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExitInterview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "dataEntrevista" DATETIME NOT NULL,
    "entrevistador" TEXT NOT NULL,
    "motivoSaida" TEXT NOT NULL,
    "feedbackJson" TEXT,
    "notaSatisfacao" INTEGER,
    "sugestoes" TEXT,
    "voltaria" BOOLEAN,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExitInterview_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SafetyInspection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT,
    "inspectorId" TEXT NOT NULL,
    "dataInspecao" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL,
    "checklistJson" TEXT,
    "conformidades" INTEGER NOT NULL DEFAULT 0,
    "naoConformidades" INTEGER NOT NULL DEFAULT 0,
    "observacoes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SafetyInspection_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SafetyInspection_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Accident" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "projectId" TEXT,
    "dataOcorrencia" DATETIME NOT NULL,
    "horaOcorrencia" TEXT,
    "local" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "gravidade" TEXT NOT NULL,
    "tipoAcidente" TEXT NOT NULL,
    "partesCorpo" TEXT,
    "testemunhas" TEXT,
    "catEmitida" BOOLEAN NOT NULL DEFAULT false,
    "numeroCAT" TEXT,
    "dataAfastamento" DATETIME,
    "diasAfastado" INTEGER,
    "investigacao" TEXT,
    "medidasCorretivas" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ABERTO',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Accident_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Accident_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EPIDistribution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "epiTipo" TEXT NOT NULL,
    "marca" TEXT,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "dataEntrega" DATETIME NOT NULL,
    "dataValidade" DATETIME,
    "nf" TEXT,
    "assinaturaUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'EM_USO',
    "observacoes" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EPIDistribution_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "marca" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'BOM',
    "localizacao" TEXT,
    "responsavel" TEXT,
    "dataAquisicao" DATETIME,
    "valorAquisicao" REAL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ToolLoan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "toolId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "projectId" TEXT,
    "dataSaida" DATETIME NOT NULL,
    "dataRetorno" DATETIME,
    "estadoSaida" TEXT NOT NULL,
    "estadoRetorno" TEXT,
    "observacoes" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ToolLoan_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ToolLoan_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ToolLoan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaintenanceRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "oficina" TEXT,
    "valor" REAL,
    "dataExecucao" DATETIME NOT NULL,
    "quilometragem" INTEGER,
    "proximaRevisao" DATETIME,
    "anexoUrl" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MaintenanceRecord_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recordId" TEXT,
    "projectId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANEJADO',
    "prioridade" TEXT NOT NULL DEFAULT 'MEDIA',
    "dataInicio" DATETIME,
    "dataFim" DATETIME,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disciplineId" TEXT,
    CONSTRAINT "Activity_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Activity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Activity_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Activity" ("criadoEm", "dataFim", "dataInicio", "descricao", "id", "prioridade", "projectId", "recordId", "status", "titulo") SELECT "criadoEm", "dataFim", "dataInicio", "descricao", "id", "prioridade", "projectId", "recordId", "status", "titulo" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'PF',
    "documento" TEXT,
    "rgIe" TEXT,
    "contatos" TEXT,
    "enderecoCompleto" TEXT,
    "representacao" TEXT,
    "configOrgaos" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Client" ("contatos", "criadoEm", "documento", "id", "nome") SELECT "contatos", "criadoEm", "documento", "id", "nome" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE TABLE "new_Discipline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NAO_CONTRATADO',
    "fase" TEXT,
    "responsibleId" TEXT,
    "previsao" DATETIME,
    "entregaReal" DATETIME,
    "versaoAtual" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Discipline_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Discipline_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "Professional" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Discipline" ("category", "criadoEm", "id", "name", "projectId", "status", "updatedAt") SELECT "category", "criadoEm", "id", "name", "projectId", "status", "updatedAt" FROM "Discipline";
DROP TABLE "Discipline";
ALTER TABLE "new_Discipline" RENAME TO "Discipline";
CREATE UNIQUE INDEX "Discipline_projectId_codigo_fase_key" ON "Discipline"("projectId", "codigo", "fase");
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigoInterno" TEXT,
    "nome" TEXT NOT NULL,
    "endereco" TEXT,
    "tipoObra" TEXT,
    "dadosLote" TEXT,
    "areaConstruida" REAL,
    "pavimentos" INTEGER,
    "exigenciasAprovacao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ORCAMENTO',
    "categoria" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clientId" TEXT NOT NULL,
    "mestreObraId" TEXT,
    "engenheiroId" TEXT,
    CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_mestreObraId_fkey" FOREIGN KEY ("mestreObraId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_engenheiroId_fkey" FOREIGN KEY ("engenheiroId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("clientId", "criadoEm", "endereco", "id", "nome", "status") SELECT "clientId", "criadoEm", "endereco", "id", "nome", "status" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_codigoInterno_key" ON "Project"("codigoInterno");
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'MEDIA',
    "requestedById" TEXT NOT NULL,
    "assignedToId" TEXT,
    "dueDate" DATETIME,
    "cancellationReason" TEXT,
    "cancelledById" TEXT,
    "cancelledAt" DATETIME,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Request_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Request_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Request_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Professional" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Request_cancelledById_fkey" FOREIGN KEY ("cancelledById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("assignedToId", "cancellationReason", "cancelledAt", "cancelledById", "criadoEm", "description", "dueDate", "id", "priority", "projectId", "requestedById", "status", "title", "type", "updatedAt") SELECT "assignedToId", "cancellationReason", "cancelledAt", "cancelledById", "criadoEm", "description", "dueDate", "id", "priority", "projectId", "requestedById", "status", "title", "type", "updatedAt" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_requestId_key" ON "PurchaseOrder"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_numeroOC_key" ON "PurchaseOrder"("numeroOC");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_placa_key" ON "Vehicle"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_cpf_key" ON "Employee"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Payroll_employeeId_mesReferencia_key" ON "Payroll"("employeeId", "mesReferencia");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeBenefit_employeeId_benefitId_dataInicio_key" ON "EmployeeBenefit"("employeeId", "benefitId", "dataInicio");

-- CreateIndex
CREATE UNIQUE INDEX "ExitInterview_employeeId_key" ON "ExitInterview"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_codigo_key" ON "Tool"("codigo");
