import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lead, Budget, Proposal, Project, Client } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// New Types for Interdepartmental Communication
export interface DepartmentRequest {
    id: string;
    fromDepartment: 'COMERCIAL' | 'ENGENHARIA' | 'PROJETOS' | 'FINANCEIRO' | 'COMPRAS' | 'RH' | 'LOGISTICA';
    toDepartment: 'COMERCIAL' | 'ENGENHARIA' | 'PROJETOS' | 'FINANCEIRO' | 'COMPRAS' | 'RH' | 'LOGISTICA';
    type: string; // 'MATERIAL_PURCHASE' | 'TEAM_ALLOCATION' | 'DOCUMENT_REQUEST' etc
    projectId?: string;
    title: string;
    description: string;
    priority: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
    status: 'PENDENTE' | 'EM_ANALISE' | 'APROVADO' | 'REJEITADO' | 'CONCLUIDO';
    createdAt: string;
    resolvedAt?: string;
}

interface AppFlowState {
    // Core Data
    clients: Client[];
    leads: Lead[];
    budgets: Budget[];
    proposals: Proposal[];
    projects: Project[];

    // Interdepartmental Communication
    requests: DepartmentRequest[];

    // Client Management
    addClient: (client: Omit<Client, 'id' | 'criadoEm'>) => string;
    updateClient: (id: string, data: Partial<Client>) => void;
    getClient: (id: string) => Client | undefined;

    // Lead Management (ALWAYS the starting point)
    addLead: (lead: Omit<Lead, 'id' | 'criadoEm'>) => string;
    updateLeadStatus: (id: string, status: Lead['status']) => void;

    // Budget Management
    createBudget: (budget: Omit<Budget, 'id' | 'criadoEm'>) => string;
    updateBudgetStatus: (id: string, status: Budget['status']) => void;

    // Proposal Management
    createProposal: (proposal: Omit<Proposal, 'id' | 'criadoEm'>) => string;
    updateProposalStatus: (id: string, status: Proposal['status']) => void;

    // Project Management (Only created from APPROVED Proposal)
    activateProject: (proposalId: string) => string | null;
    addProject: (project: Omit<Project, 'id' | 'criadoEm' | 'updatedAt'>) => string;
    updateProjectStatus: (id: string, status: Project['status']) => void;

    // Interdepartmental Requests
    createRequest: (request: Omit<DepartmentRequest, 'id' | 'createdAt'>) => string;
    updateRequestStatus: (id: string, status: DepartmentRequest['status']) => void;
    getRequestsForDepartment: (department: DepartmentRequest['toDepartment']) => DepartmentRequest[];
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

            // CLIENT MANAGEMENT
            addClient: (clientData) => {
                const id = uuidv4();
                set((state) => ({
                    clients: [...state.clients, {
                        ...clientData,
                        id,
                        criadoEm: new Date().toISOString()
                    }]
                }));
                return id;
            },

            updateClient: (id, data) => set((state) => ({
                clients: state.clients.map(c => c.id === id ? { ...c, ...data } : c)
            })),

            getClient: (id) => get().clients.find(c => c.id === id),

            // LEAD MANAGEMENT
            addLead: (leadData) => {
                const id = uuidv4();
                set((state) => ({
                    leads: [...state.leads, {
                        ...leadData,
                        id,
                        criadoEm: new Date().toISOString()
                    }]
                }));
                return id;
            },

            updateLeadStatus: (id, status) => {
                set((state) => ({
                    leads: state.leads.map(l => l.id === id ? { ...l, status } : l)
                }));

                // Auto-trigger: If Lead becomes QUALIFICADO, it's ready for Budget
                if (status === 'QUALIFICADO') {
                    const lead = get().leads.find(l => l.id === id);
                    if (lead) {
                        // Notify Commercial to create budget
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
                set((state) => ({
                    budgets: [...state.budgets, {
                        ...budgetData,
                        id,
                        criadoEm: new Date().toISOString()
                    }]
                }));
                return id;
            },

            updateBudgetStatus: (id, status) => set((state) => ({
                budgets: state.budgets.map(b => b.id === id ? { ...b, status } : b)
            })),

            // PROPOSAL MANAGEMENT
            createProposal: (propData) => {
                const id = uuidv4();
                set((state) => ({
                    proposals: [...state.proposals, {
                        ...propData,
                        id,
                        criadoEm: new Date().toISOString()
                    }]
                }));
                return id;
            },

            updateProposalStatus: (id, status) => {
                set((state) => ({
                    proposals: state.proposals.map(p => p.id === id ? { ...p, status } : p)
                }));

                // Auto-trigger: Proposal APROVADA → Activate Project
                if (status === 'APROVADA') {
                    const proposal = get().proposals.find(p => p.id === id);
                    if (proposal) {
                        const projectId = get().activateProject(proposal.id);
                        if (projectId) {
                            // Notify all departments
                            get().createRequest({
                                fromDepartment: 'COMERCIAL',
                                toDepartment: 'ENGENHARIA',
                                type: 'NEW_PROJECT_ACTIVATION',
                                projectId,
                                title: 'Nova Obra Ativada',
                                description: 'Obra pronta para planejamento técnico',
                                priority: 'ALTA',
                                status: 'PENDENTE'
                            });
                        }
                    }
                }
            },

            // PROJECT ACTIVATION (Core Flow)
            activateProject: (proposalId) => {
                const proposal = get().proposals.find(p => p.id === proposalId);
                if (!proposal || proposal.status !== 'APROVADA') return null;

                const budget = get().budgets.find(b => b.id === proposal.budgetId);
                if (!budget) return null;

                const lead = get().leads.find(l => l.id === budget.leadId);

                const projectId = uuidv4();
                const newProject: Project = {
                    id: projectId,
                    nome: lead?.nomeObra || 'Obra sem nome',
                    clientId: lead?.clientId || 'unknown',
                    status: 'PLANEJAMENTO', // Starts in PLANEJAMENTO, not ATIVA
                    orcamentoId: budget.id,
                    propostaId: proposalId,
                    categoria: lead?.tipoObra as any,
                    endereco: lead?.localizacao,
                    classificacao: lead?.classificacao, // Carry over classification
                    attachments: lead?.attachments, // Carry over attachments
                    criadoEm: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                set(state => ({
                    projects: [...state.projects, newProject]
                }));

                return projectId;
            },

            addProject: (projectData) => {
                const id = uuidv4();
                set((state) => ({
                    projects: [...state.projects, {
                        ...projectData,
                        id,
                        criadoEm: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }]
                }));
                return id;
            },

            updateProjectStatus: (id, status) => set((state) => ({
                projects: state.projects.map(p => p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p)
            })),

            // INTERDEPARTMENTAL REQUESTS
            createRequest: (requestData) => {
                const id = uuidv4();
                set((state) => ({
                    requests: [...state.requests, {
                        ...requestData,
                        id,
                        createdAt: new Date().toISOString()
                    }]
                }));
                return id;
            },

            updateRequestStatus: (id, status) => set((state) => ({
                requests: state.requests.map(r => r.id === id ? {
                    ...r,
                    status,
                    resolvedAt: (status === 'CONCLUIDO' || status === 'REJEITADO') ? new Date().toISOString() : r.resolvedAt
                } : r)
            })),

            getRequestsForDepartment: (department) => {
                return get().requests.filter(r => r.toDepartment === department && r.status === 'PENDENTE');
            }
        }),
        {
            name: 'vercflow-storage',
        }
    )
);
