import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lead, Budget, Proposal, Project, Client, BudgetRevision, DiarioObra, DepartmentRequest, AuditLogEntry, Attachment } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface AppFlowState {
    // Core Data
    clients: Client[];
    leads: Lead[];
    budgets: Budget[];
    proposals: Proposal[];
    projects: Project[];

    // Interdepartmental Communication
    requests: DepartmentRequest[];

    // Internal Helpers
    addAuditLog: (entityType: 'BUDGET' | 'PROPOSAL' | 'PROJECT', entityId: string, action: string, description: string, metadata?: any) => void;

    // Client Management
    addClient: (client: Omit<Client, 'id' | 'criadoEm'>) => string;
    updateClient: (id: string, data: Partial<Client>) => void;
    getClient: (id: string) => Client | undefined;

    // Global Project Context
    selectedProjectId: string | null;
    setSelectedProject: (id: string | null) => void;

    // Lead Management
    addLead: (lead: Omit<Lead, 'id' | 'criadoEm'>) => string;
    updateLeadStatus: (id: string, status: Lead['status']) => void;

    // Budget Management
    createBudget: (budget: Omit<Budget, 'id' | 'criadoEm'>) => string;
    updateBudgetStatus: (id: string, status: Budget['status']) => void;
    updateBudget: (id: string, data: Partial<Budget>) => void;
    createBudgetRevision: (budgetId: string, revisionData: Omit<BudgetRevision, 'id' | 'budgetId' | 'version' | 'createdAt'>, reason: string) => string;

    // Proposal Management
    createProposal: (proposal: Omit<Proposal, 'id' | 'criadoEm'>) => string;
    updateProposalStatus: (id: string, status: Proposal['status']) => void;

    // Project Management
    activateProject: (proposalId: string) => string | null;
    addProject: (project: Omit<Project, 'id' | 'criadoEm' | 'updatedAt'>) => string;
    updateProjectStatus: (id: string, status: Project['status']) => void;

    // Interdepartmental Requests
    createRequest: (request: Omit<DepartmentRequest, 'id' | 'createdAt'>) => string;
    updateRequestStatus: (id: string, status: DepartmentRequest['status'], feedback?: any) => void;
    updateRequest: (id: string, data: Partial<DepartmentRequest>) => void;
    getRequestsForDepartment: (department: DepartmentRequest['toDepartment']) => DepartmentRequest[];

    // Discipline Management
    disciplines: any[];
    addDiscipline: (data: any) => string;
    getDisciplinesByProject: (projectId: string) => any[];

    // Diario de Obra (RDO)
    diariosObra: DiarioObra[];
    createDiarioObra: (data: Omit<DiarioObra, 'id' | 'criadoEm'>) => string;
    updateDiarioObra: (id: string, data: Partial<DiarioObra>) => void;
    updateDiarioObraStatus: (id: string, status: DiarioObra['status']) => void;
    getDiariosByProject: (projectId: string) => DiarioObra[];
    resetAndSeed: () => void;
}

export const useAppFlow = create<AppFlowState>()(
    persist(
        (set, get) => ({
            clients: [],
            leads: [],
            budgets: [],
            proposals: [],
            projects: [],
            requests: [],
            disciplines: [],
            diariosObra: [],

            // AUDIT LOG HELPER
            addAuditLog: (type, id, action, description, metadata) => {
                const entry: AuditLogEntry = {
                    id: uuidv4(),
                    userId: 'current-user-id', // Mock
                    userName: 'Usuário Sistema', // Mock
                    action,
                    description,
                    timestamp: new Date().toISOString(),
                    metadata
                };

                if (type === 'BUDGET') {
                    set(state => ({
                        budgets: state.budgets.map(b => b.id === id ? {
                            ...b,
                            auditLog: [...(b.auditLog || []), entry]
                        } : b)
                    }));
                } else if (type === 'PROPOSAL') {
                    set(state => ({
                        proposals: state.proposals.map(p => p.id === id ? {
                            ...p,
                            auditLog: [...(p.auditLog || []), entry]
                        } : p)
                    }));
                } else if (type === 'PROJECT') {
                    // Logic for project audit if needed
                }
            },

            // CLIENT MANAGEMENT
            addClient: (clientData) => {
                const id = uuidv4();
                const nomeUnificado = clientData.nome || clientData.razaoSocial || clientData.nomeFantasia || 'Cliente Sem Nome';
                set((state) => ({
                    clients: [...state.clients, {
                        ...clientData,
                        id,
                        nome: nomeUnificado,
                        ativo: true,
                        contatos: clientData.contatos || '[]',
                        razaoSocial: clientData.razaoSocial || nomeUnificado,
                        criadoEm: new Date().toISOString()
                    } as any]
                }));
                return id;
            },

            updateClient: (id, data) => set((state) => ({
                clients: state.clients.map(c => c.id === id ? { ...c, ...data } : c)
            })),

            getClient: (id) => get().clients.find(c => c.id === id),

            // GLOBAL PROJECT CONTEXT
            selectedProjectId: null,
            setSelectedProject: (id) => set({ selectedProjectId: id }),

            // LEAD MANAGEMENT
            addLead: (leadData) => {
                const id = uuidv4();
                set((state) => ({
                    leads: [...state.leads, {
                        ...leadData,
                        id,
                        criadoEm: new Date().toISOString()
                    } as any]
                }));
                return id;
            },

            updateLeadStatus: (id, status) => {
                set((state) => ({
                    leads: state.leads.map(l => l.id === id ? { ...l, status } : l)
                }));
                if (status === 'QUALIFICADO') {
                    const lead = get().leads.find(l => l.id === id);
                    if (lead) {
                        get().createRequest({
                            fromDepartment: 'COMERCIAL',
                            toDepartment: 'COMERCIAL',
                            type: 'CREATE_BUDGET',
                            title: `Lead Qualificado: ${lead.nomeObra}`,
                            description: 'Lead pronto para orçamento',
                            priority: 'MEDIA',
                            status: 'PENDENTE'
                        });
                    }
                }
            },

            // BUDGET MANAGEMENT
            createBudget: (budgetData) => {
                const id = uuidv4();
                const newBudget: Budget = {
                    ...budgetData,
                    id,
                    validacaoTecnica: 'PENDENTE',
                    validacaoFinanceira: 'PENDENTE',
                    status: 'EM_ELABORACAO',
                    attachments: [],
                    auditLog: [],
                    criadoEm: new Date().toISOString()
                } as any;

                set((state) => ({
                    budgets: [...state.budgets, newBudget]
                }));

                get().addAuditLog('BUDGET', id, 'CREATE', 'Orçamento inicial criado pelo comercial.');

                // Auto-trigger Engineer
                const lead = get().leads.find(l => l.id === budgetData.leadId);
                get().createRequest({
                    fromDepartment: 'COMERCIAL',
                    toDepartment: 'ENGENHARIA',
                    type: 'BUDGET_VALIDATION',
                    title: `Validação Técnica: ${lead?.nomeObra || 'Obra'}`,
                    description: `Validar escopo macro e viabilidade técnica.`,
                    priority: 'ALTA',
                    status: 'PENDENTE',
                    recordId: id
                });

                return id;
            },

            updateBudgetStatus: (id, status) => {
                set((state) => ({
                    budgets: state.budgets.map(b => b.id === id ? { ...b, status } : b)
                }));
                get().addAuditLog('BUDGET', id, 'STATUS_CHANGE', `Status alterado para ${status}`);
            },

            updateBudget: (id, data) => set((state) => ({
                budgets: state.budgets.map(b => b.id === id ? { ...b, ...data } : b)
            })),

            createBudgetRevision: (budgetId, revisionData, reason) => {
                const id = uuidv4();
                const budget = get().budgets.find(b => b.id === budgetId);
                if (!budget) return '';

                const version = (budget.revisions?.length || 0) + 1;
                const newRevision: BudgetRevision = {
                    ...revisionData,
                    id,
                    budgetId,
                    version,
                    resumoAlteracoes: reason,
                    createdAt: new Date().toISOString()
                } as any;

                set((state) => ({
                    budgets: state.budgets.map(b => b.id === budgetId ? {
                        ...b,
                        ...revisionData,
                        validacaoTecnica: 'PENDENTE',
                        validacaoFinanceira: 'PENDENTE',
                        status: 'EM_ELABORACAO',
                        revisions: [...(b.revisions || []), newRevision]
                    } : b)
                }));

                get().addAuditLog('BUDGET', budgetId, 'REVISION', `Nova revisão v${version} gerada. Motivo: ${reason}`, { revisionId: id });

                return id;
            },

            // PROPOSAL MANAGEMENT
            createProposal: (propData) => {
                const id = uuidv4();
                set((state) => ({
                    proposals: [...state.proposals, {
                        ...propData,
                        id,
                        auditLog: [],
                        criadoEm: new Date().toISOString()
                    } as any]
                }));
                get().addAuditLog('PROPOSAL', id, 'CREATE', 'Proposta comercial gerada a partir do orçamento aprovado.');
                return id;
            },

            updateProposalStatus: (id, status) => {
                set((state) => ({
                    proposals: state.proposals.map(p => p.id === id ? { ...p, status } : p)
                }));
                get().addAuditLog('PROPOSAL', id, 'STATUS_CHANGE', `Proposta alterada para ${status}`);

                if (status === 'APROVADA') {
                    const proposal = get().proposals.find(p => p.id === id);
                    if (proposal) {
                        const projectId = get().activateProject(proposal.id);
                        if (projectId) {
                            get().createRequest({
                                fromDepartment: 'COMERCIAL',
                                toDepartment: 'ENGENHARIA',
                                type: 'NEW_PROJECT_ACTIVATION',
                                projectId,
                                title: 'Obra Ativada',
                                description: 'Proposta assinada e obra pronta para planejamento.',
                                priority: 'ALTA',
                                status: 'PENDENTE'
                            });
                        }
                    }
                }
            },

            // PROJECT
            activateProject: (proposalId) => {
                const proposal = get().proposals.find(p => p.id === proposalId);
                const budget = get().budgets.find(b => b.id === proposal?.budgetId);
                const lead = get().leads.find(l => l.id === budget?.leadId);

                if (!proposal || !budget) return null;

                const projectId = uuidv4();
                const newProject: Project = {
                    id: projectId,
                    nome: lead?.nomeObra || 'Obra Nova',
                    clientId: lead?.clientId || 'unknown',
                    status: 'PLANEJAMENTO',
                    orcamentoId: budget.id,
                    propostaId: proposalId,
                    endereco: lead?.localizacao,
                    classificacao: lead?.classificacao || ({} as any),
                    attachments: [...(budget.attachments || []), ...(proposal.attachments || [])],
                    criadoEm: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                set(state => ({ projects: [...state.projects, newProject] }));
                return projectId;
            },

            addProject: (p) => {
                const id = uuidv4();
                set(s => ({ projects: [...s.projects, { ...p, id, criadoEm: new Date().toISOString(), updatedAt: new Date().toISOString() } as any] }));
                return id;
            },

            updateProjectStatus: (id, status) => set(s => ({
                projects: s.projects.map(p => p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p)
            })),

            // INTERDEPARTMENTAL REQUESTS
            createRequest: (r) => {
                const id = uuidv4();
                set(s => ({ requests: [...s.requests, { ...r, id, createdAt: new Date().toISOString() } as any] }));
                return id;
            },

            updateRequestStatus: (id, status, feedback) => {
                const request = get().requests.find(r => r.id === id);
                if (!request) return;

                set(s => ({
                    requests: s.requests.map(r => r.id === id ? {
                        ...r,
                        status,
                        resolvedAt: (status === 'APROVADO' || status === 'REJEITADO' || status === 'CONCLUIDO') ? new Date().toISOString() : r.resolvedAt,
                        metadata: feedback ? { ...r.metadata, ...feedback } : r.metadata
                    } : r)
                }));

                // Logic Cascading
                if (status === 'APROVADO') {
                    if (request.type === 'BUDGET_VALIDATION') {
                        const budgetId = request.recordId;
                        if (budgetId) {
                            set(s => ({
                                budgets: s.budgets.map(b => b.id === budgetId ? {
                                    ...b,
                                    validacaoTecnica: 'APROVADO',
                                    validacaoTecnicaObs: feedback?.observations,
                                    status: 'AGUARDANDO_FINANCEIRO',
                                    // Update values if engineer provided them
                                    valorEstimado: feedback?.adjustedValue || b.valorEstimado,
                                    prazoEstimadoMeses: feedback?.adjustedDeadline || b.prazoEstimadoMeses,
                                    attachments: [...(b.attachments || []), ...(feedback?.attachments || [])]
                                } : b)
                            }));

                            get().addAuditLog('BUDGET', budgetId, 'TECH_APPROVAL', 'Engenharia validou o escopo técnico.', feedback);

                            get().createRequest({
                                fromDepartment: 'ENGENHARIA',
                                toDepartment: 'FINANCEIRO',
                                type: 'FINANCIAL_VALIDATION',
                                title: `Validação Financeira: ${request.title.replace('Validação Técnica: ', '')}`,
                                description: 'Validar margens do orçamento técnico aprovado.',
                                priority: 'ALTA',
                                status: 'PENDENTE',
                                recordId: budgetId,
                                metadata: { engineeringFeedback: feedback }
                            });
                        }
                    }

                    if (request.type === 'FINANCIAL_VALIDATION') {
                        const budgetId = request.recordId;
                        if (budgetId) {
                            set(s => ({
                                budgets: s.budgets.map(b => b.id === budgetId ? {
                                    ...b,
                                    validacaoFinanceira: 'APROVADO',
                                    validacaoFinanceiraObs: feedback?.observations,
                                    status: 'APROVADO'
                                } : b)
                            }));
                            get().addAuditLog('BUDGET', budgetId, 'FINANCE_APPROVAL', 'Financeiro validou a viabilidade e margens.', feedback);
                        }
                    }
                }
            },

            updateRequest: (id, data) => set(s => ({
                requests: s.requests.map(r => r.id === id ? { ...r, ...data } : r)
            })),

            getRequestsForDepartment: (d) => get().requests.filter(r => r.toDepartment === d),

            // DISCIPLINE
            addDiscipline: (d) => {
                const id = uuidv4();
                set(s => ({ disciplines: [...(s.disciplines || []), { ...d, id, status: d.status || 'NAO_INICIADO', progress: d.progress || 0 }] }));
                return id;
            },
            getDisciplinesByProject: (pid) => (get().disciplines || []).filter(d => d.projectId === pid),

            // DIARIO
            createDiarioObra: (d) => {
                const id = uuidv4();
                set(s => ({ diariosObra: [...s.diariosObra, { ...d, id, criadoEm: new Date().toISOString() }] }));
                return id;
            },
            updateDiarioObra: (id, d) => set(s => ({ diariosObra: s.diariosObra.map(x => x.id === id ? { ...x, ...d } : x) })),
            updateDiarioObraStatus: (id, status) => set(s => ({
                diariosObra: s.diariosObra.map(d => d.id === id ? { ...d, status, aprovadoEm: status === 'APROVADO' ? new Date().toISOString() : d.aprovadoEm } : d)
            })),
            getDiariosByProject: (p) => get().diariosObra.filter(d => d.projectId === p),

            resetAndSeed: () => {
                const clientId = uuidv4();
                const leadId = uuidv4();
                const budgetId = uuidv4();
                const proposalId = uuidv4();
                const createdAt = new Date().toISOString();

                const seedData: Partial<AppFlowState> = {
                    clients: [{
                        id: clientId,
                        nome: "Indústrias Metalúrgicas Delta S.A.",
                        tipo: "PJ" as const,
                        documento: "45.882.331/0001-08",
                        razaoSocial: "Indústrias Metalúrgicas Delta S.A.",
                        email: "diretoria@delta.com.br",
                        contatos: "João Silva - Diretor Técnico (+55 11 99882-1122)",
                        enderecos: [{
                            id: uuidv4(),
                            tipo: 'PRINCIPAL' as const,
                            logradouro: "Av. das Nações Unidas",
                            numero: "12551",
                            bairro: "Brooklin",
                            cidade: "São Paulo",
                            estado: "SP",
                            cep: "04578-000"
                        }],
                        documentosAnexos: [],
                        docStatus: 'COMPLETO' as const,
                        ativo: true,
                        criadoEm: createdAt
                    }],
                    leads: [{
                        id: leadId,
                        clientId: clientId,
                        nomeValidacao: "Indústrias Metalúrgicas Delta S.A.",
                        nomeObra: "Nova Unidade Fabril - Plant 04",
                        localizacao: "Distrito Industrial, Sorocaba/SP",
                        classificacao: {
                            natureza: 'INDUSTRIAL' as const,
                            contexto: 'URBANA' as const,
                            subcontexto: 'DISTRITO_INDUSTRIAL',
                            tipologia: 'GALPAO_LOGISTICO_CROSSDOCKING',
                            padrao: 'PREMIUM_INDUSTRIAL',
                            finalidade: 'USO_PROPRIO',
                            objetos: ['PROJETO_OBRA_NOVA', 'GERENCIAMENTO_COMPLETO', 'FUNDACOES_ESPECIAIS'],
                            requerLegalizacao: true,
                            legalizacao: {
                                orgaos: ['PREFEITURA', 'CORPO_DE_BOMBEIROS', 'CETESB'],
                                cenario: 'OBRA_NOVA'
                            }
                        },
                        tipoObra: 'GALPÃO INDUSTRIAL',
                        status: 'CONVERTIDO' as const,
                        attachments: [],
                        criadoEm: createdAt
                    }],
                    budgets: [{
                        id: budgetId,
                        leadId: leadId,
                        lead: {
                            id: leadId,
                            nomeObra: "Nova Unidade Fabril - Plant 04",
                            nomeValidacao: "Indústrias Metalúrgicas Delta S.A.",
                            localizacao: "Distrito Industrial, Sorocaba/SP",
                            tipoObra: 'GALPÃO INDUSTRIAL',
                            status: 'CONVERTIDO' as const,
                            criadoEm: createdAt
                        },
                        escopoMacro: "Gerenciamento de obra e execução de supraestrutura para galpão industrial de 12.000m². Incluindo terraplenagem, fundações em estacas hélice, piso industrial de alta resistência e fechamento em painéis alveolares.",
                        valorEstimado: 12450000.00,
                        prazoEstimadoMeses: 10,
                        validacaoTecnica: 'APROVADO' as const,
                        validacaoFinanceira: 'APROVADO' as const,
                        status: 'APROVADO' as const,
                        revisions: [],
                        attachments: [],
                        auditLog: [],
                        criadoEm: createdAt
                    }],
                    proposals: [{
                        id: proposalId,
                        budgetId: budgetId,
                        versao: 1,
                        valorFinal: 11980000.00,
                        condicoesEspeciais: "Pagamento estruturado em medições mensais de 10%. Retenção de 5% de garantia técnica. Desconto comercial de 3.75% aplicado sobre o orçamento base da engenharia.",
                        status: 'APROVADA' as const,
                        attachments: [],
                        auditLog: [],
                        criadoEm: createdAt
                    }],
                    projects: [],
                    requests: [],
                    disciplines: [],
                    diariosObra: []
                };

                set(seedData);
                console.log("Database reset and seeded with high-fidelity production data.");
            }
        }),
        { name: 'vercflow-storage' }
    )
);
