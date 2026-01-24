"use client"

import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    FileText,
    TrendingUp,
    Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { useAppFlow } from '@/store/useAppFlow';
import { toast } from 'sonner';

// Sub-components
import { ComercialOverview } from './comercial/ComercialOverview';
import { ComercialLeads } from './comercial/ComercialLeads';
import { ComercialBudgets } from './comercial/ComercialBudgets';
import { ComercialProposals } from './comercial/ComercialProposals';
import { ComercialClients } from './comercial/ComercialClients';
import { ClientProfilePage } from './comercial/ClientProfilePage';

export function ComercialDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    // Navigation State
    const [currentSection, setCurrentSection] = useState<'overview' | 'leads' | 'budgets' | 'proposals' | 'clients'>('overview');

    // Selection State for Detail Views
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
    const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
    const [selectedClientProfile, setSelectedClientProfile] = useState<any>(null);

    const {
        leads,
        budgets,
        proposals,
        createBudget,
        createProposal,
        updateProposalStatus
    } = useAppFlow();

    // Stats Logic
    const totalPipeline = budgets.reduce((acc, b) => acc + b.valorEstimado, 0) + proposals.reduce((acc, p) => acc + p.valorFinal, 0);
    const activeLeads = leads.filter(l => l.status !== 'PERDIDO' && l.status !== 'CONVERTIDO').length;
    const pendingProposals = proposals.filter(p => p.status === 'PENDENTE' || p.status === 'NEGOCIACAO').length;

    // Navigation Items
    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'leads', label: 'Leads', icon: TrendingUp },
        { id: 'budgets', label: 'Orçamentos', icon: FileText },
        { id: 'proposals', label: 'Propostas', icon: Briefcase },
        { id: 'clients', label: 'Carteira', icon: Users },
    ];

    // Handlers
    const handleConvertLead = (lead: any) => {
        const budgetId = createBudget({
            leadId: lead.id,
            escopoMacro: `Orçamento para a obra ${lead.nomeObra}.`,
            valorEstimado: lead.areaEstimada ? lead.areaEstimada * 2500 : 500000,
            prazoEstimadoMeses: 12,
            status: 'EM_ELABORACAO'
        });
        setSelectedLeadId(null);
        setCurrentSection('budgets');
        setSelectedBudgetId(budgetId);
        toast.success("Lead convertido em Orçamento!");
    };

    const handleCreateProposal = (budget: any) => {
        const proposalId = createProposal({
            budgetId: budget.id,
            versao: 1,
            valorFinal: budget.valorEstimado * 0.95,
            status: 'PENDENTE'
        });
        setSelectedBudgetId(null);
        setCurrentSection('proposals');
        setSelectedProposalId(proposalId);
        toast.success("Proposta comercial gerada!");
    };

    const handleOpenClientProfile = (client: any) => {
        setSelectedClientProfile(client);
    };

    // Wrapper to switch sections from Overview
    const handleNavigate = (section: any) => {
        setCurrentSection(section);
    };

    // Full Page View Rendering
    if (selectedClientProfile) {
        return (
            <ClientProfilePage
                client={selectedClientProfile}
                onBack={() => setSelectedClientProfile(null)}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden font-sans">
            <div className="flex h-full">
                {/* Sidebar Navigation */}
                <div className="w-20 lg:w-64 border-r border-border/40 flex flex-col items-center lg:items-stretch py-8 bg-background/50 backdrop-blur-sm shrink-0 transition-all duration-300">
                    <div className="px-6 mb-8 hidden lg:block">
                        <HeaderAnimated title="Comercial" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-1">
                            Sales & Growth
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full px-4 flex-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = currentSection === item.id;
                            return (
                                <Button
                                    key={item.id}
                                    variant={isActive ? "secondary" : "ghost"}
                                    onClick={() => {
                                        setCurrentSection(item.id as any);
                                        // Reset selections when switching tabs to ensure clean state
                                        setSelectedLeadId(null);
                                        setSelectedBudgetId(null);
                                        setSelectedProposalId(null);
                                        setSelectedClientProfile(null);
                                    }}
                                    className={cn(
                                        "w-full justify-start h-12 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                                        "lg:px-4 px-0 lg:justify-start justify-center"
                                    )}
                                >
                                    <item.icon size={20} className={cn("shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground", "lg:mr-3")} />
                                    <span className="hidden lg:block font-bold text-xs uppercase tracking-wide truncate">{item.label}</span>
                                </Button>
                            );
                        })}
                    </div>

                    <div className="p-4 mt-auto">
                        <Card className="p-4 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/10 rounded-2xl hidden lg:block">
                            <p className="text-[10px] font-black uppercase text-indigo-500 mb-1">Meta Mensal</p>
                            <div className="w-full h-1.5 bg-background/50 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[85%]" />
                            </div>
                            <p className="text-[10px] font-bold text-right mt-1 text-muted-foreground">85%</p>
                        </Card>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col bg-muted/5">
                    {/* Top Bar (Mobile/Responsive or Contextual) */}
                    <div className="h-20 border-b border-border/40 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm shrink-0 lg:hidden">
                        <HeaderAnimated title="Comercial" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        <motion.div
                            key={currentSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-[1920px] mx-auto"
                        >
                            {currentSection === 'overview' && (
                                <ComercialOverview
                                    stats={{ totalPipeline, activeLeads, pendingProposals }}
                                    onNavigate={handleNavigate}
                                />
                            )}

                            {currentSection === 'leads' && (
                                <ComercialLeads
                                    leads={leads}
                                    onSelectLead={setSelectedLeadId}
                                    selectedLeadId={selectedLeadId}
                                    onBack={() => setSelectedLeadId(null)}
                                    onConvert={handleConvertLead}
                                    onOpenWizard={onOpenWizard}
                                />
                            )}

                            {currentSection === 'budgets' && (
                                <ComercialBudgets
                                    budgets={budgets}
                                    selectedBudgetId={selectedBudgetId}
                                    onSelectBudget={setSelectedBudgetId}
                                    onBack={() => setSelectedBudgetId(null)}
                                    onCreateProposal={handleCreateProposal}
                                />
                            )}

                            {currentSection === 'proposals' && (
                                <ComercialProposals
                                    proposals={proposals}
                                    selectedProposalId={selectedProposalId}
                                    onSelectProposal={setSelectedProposalId}
                                    onBack={() => setSelectedProposalId(null)}
                                    onApprove={(id: string) => {
                                        updateProposalStatus(id, 'APROVADA');
                                        toast.success("Proposta Aprovada! Obra ativada com sucesso.");
                                        setSelectedProposalId(null);
                                    }}
                                />
                            )}

                            {currentSection === 'clients' && (
                                <ComercialClients
                                    onOpenProfile={handleOpenClientProfile}
                                />
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
