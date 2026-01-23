"use client"

import React, { useState } from 'react';
import {
    Target,
    Users,
    TrendingUp,
    FileText,
    Search,
    Filter,
    Plus,
    ChevronRight,
    ArrowRight,
    Clock,
    DollarSign,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MoreHorizontal,
    MessageSquare,
    Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { DashboardTab } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';
import { useAppFlow } from '@/store/useAppFlow';
import { toast } from 'sonner';

import { LeadListPage, LeadDetailPage } from './comercial/LeadManagement';
import { BudgetListPage, BudgetDetailPage } from './comercial/BudgetManagement';
import { ProposalListPage, ProposalDetailPage } from './comercial/ProposalManagement';

export function ComercialDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    const [view, setView] = useState<'leads' | 'orcamentos' | 'propostas' | 'clientes'>('leads');
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
    const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);

    const [openPlaceholder, setOpenPlaceholder] = useState(false);
    const [modalConfig, setModalConfig] = useState<any>({});

    const {
        leads,
        budgets,
        proposals,
        createBudget,
        createProposal,
        updateProposalStatus
    } = useAppFlow();

    // Stats calculation based on real data
    const totalPipeline = budgets.reduce((acc, b) => acc + b.valorEstimado, 0) + proposals.reduce((acc, p) => acc + p.valorFinal, 0);
    const activeLeads = leads.filter(l => l.status !== 'PERDIDO' && l.status !== 'CONVERTIDO').length;
    const pendingProposals = proposals.filter(p => p.status === 'PENDENTE' || p.status === 'NEGOCIACAO').length;

    const handlePlaceholder = (title: string, desc: string, icon: any, type: any = 'none') => {
        setModalConfig({ title, description: desc, icon, type });
        setOpenPlaceholder(true);
    };

    const handleQuickAdd = () => {
        if (view === 'leads' && onOpenWizard) {
            onOpenWizard();
        } else {
            handlePlaceholder(`Novo ${view === 'orcamentos' ? 'Orçamento' : 'Proposta'}`, `Registre um novo item no funil do Comercial.`, Plus, 'none');
        }
    };

    // Flow Logic
    const handleConvertLead = (lead: any) => {
        const budgetId = createBudget({
            leadId: lead.id,
            escopoMacro: `Orçamento para a obra ${lead.nomeObra}.`,
            valorEstimado: lead.areaEstimada ? lead.areaEstimada * 2500 : 500000,
            prazoEstimadoMeses: 12,
            status: 'EM_ELABORACAO'
        });
        setSelectedLeadId(null);
        setView('orcamentos');
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
        setView('propostas');
        setSelectedProposalId(proposalId);
        toast.success("Proposta comercial gerada!");
    };

    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-24 no-scrollbar">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <HeaderAnimated title="Módulo Comercial" />
                    <p className="text-muted-foreground font-medium mt-1">
                        "Tudo nasce no Comercial": Leads, Orçamentos e Propostas.
                    </p>
                </div>
                <div className="flex gap-3 bg-muted/20 p-1 rounded-2xl border border-border/40">
                    {['leads', 'orcamentos', 'propostas', 'clientes'].map((v) => (
                        <Button
                            key={v}
                            variant="ghost"
                            onClick={() => {
                                setView(v as any);
                                setSelectedLeadId(null);
                                setSelectedBudgetId(null);
                                setSelectedProposalId(null);
                            }}
                            className={cn(
                                "rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10",
                                view === v ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                            )}
                        >
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Top Stats Cards (Hide in detail views) */}
            {!selectedLeadId && !selectedBudgetId && !selectedProposalId && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Pipeline Total"
                        value={totalPipeline.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' })}
                        change="+12.5%"
                        icon={TrendingUp}
                        color="blue"
                    />
                    <StatCard title="Leads Ativos" value={activeLeads.toString()} change="+4" icon={Users} color="orange" />
                    <StatCard title="Taxa Conversão" value="18.5%" change="-2.1%" icon={Target} color="emerald" />
                    <StatCard title="Aguardando" value={pendingProposals.toString()} desc="Propostas enviadas" icon={Clock} color="purple" />
                </div>
            )}

            {/* Action Cards Area (Replaces Floating Button) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {view === 'leads' && !selectedLeadId && (
                    <Card className="rounded-[2rem] border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border-dashed border-2 group" onClick={onOpenWizard}>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h3 className="font-black uppercase tracking-widest text-sm">Criar Novo Lead</h3>
                                <p className="text-xs text-muted-foreground font-medium">Registrar nova oportunidade</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Just placeholders for budgets/proposals for now as main flow starts at Lead */}
                {view === 'orcamentos' && !selectedBudgetId && (
                    <Card className="rounded-[2rem] border-border/40 bg-muted/5 border-dashed border-2 opacity-50 cursor-not-allowed">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                <Plus size={24} className="text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-black uppercase tracking-widest text-sm text-muted-foreground">Criar Orçamento</h3>
                                <p className="text-xs text-muted-foreground font-medium">Inicie via conversão de Lead</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={`${view}-${selectedLeadId}-${selectedBudgetId}-${selectedProposalId}`}
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.2 }}
                    className="min-h-[500px]"
                >
                    {view === 'leads' && (
                        selectedLeadId ? (
                            <LeadDetailPage
                                lead={leads.find(l => l.id === selectedLeadId)!}
                                onBack={() => setSelectedLeadId(null)}
                                onConvert={handleConvertLead}
                            />
                        ) : (
                            <LeadListPage onSelect={(l) => setSelectedLeadId(l.id)} />
                        )
                    )}

                    {view === 'orcamentos' && (
                        selectedBudgetId ? (
                            <BudgetDetailPage
                                budget={budgets.find(b => b.id === selectedBudgetId)!}
                                onBack={() => setSelectedBudgetId(null)}
                                onCreateProposal={handleCreateProposal}
                            />
                        ) : (
                            <BudgetListPage onSelect={(b) => setSelectedBudgetId(b.id)} />
                        )
                    )}

                    {view === 'propostas' && (
                        selectedProposalId ? (
                            <ProposalDetailPage
                                proposal={proposals.find(p => p.id === selectedProposalId)!}
                                onBack={() => setSelectedProposalId(null)}
                                onApprove={(id) => {
                                    updateProposalStatus(id, 'APROVADA');
                                    toast.success("Proposta Aprovada! Obra ativada com sucesso.");
                                }}
                            />
                        ) : (
                            <ProposalListPage onSelect={(p) => setSelectedProposalId(p.id)} />
                        )
                    )}

                    {view === 'clientes' && <EnhancedClientesList onAction={handlePlaceholder} />}
                </motion.div>
            </AnimatePresence>



            <PlaceholderModal
                isOpen={openPlaceholder}
                onClose={() => setOpenPlaceholder(false)}
                title={modalConfig.title}
                description={modalConfig.description}
                icon={modalConfig.icon}
                type={modalConfig.type}
            />
        </div>
    );
}

// Sub-components
function StatCard({ title, value, change, desc, icon: Icon, color }: any) {
    const colors = {
        blue: "from-blue-500/10 to-transparent text-blue-500 border-blue-500/20",
        orange: "from-orange-500/10 to-transparent text-orange-500 border-orange-500/20",
        emerald: "from-emerald-500/10 to-transparent text-emerald-500 border-emerald-500/20",
        purple: "from-purple-500/10 to-transparent text-purple-500 border-purple-500/20"
    };

    return (
        <Card className={cn("rounded-[2rem] border-border/40 bg-background/60 backdrop-blur-xl overflow-hidden", colors[color as keyof typeof colors])}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                        <Icon size={20} />
                    </div>
                    {change && (
                        <Badge variant="outline" className={cn("font-black text-[9px]", change.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>
                            {change}
                        </Badge>
                    )}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{title}</p>
                <p className="text-2xl font-black tracking-tight">{value}</p>
                {desc && <p className="text-[10px] font-bold opacity-40 mt-1">{desc}</p>}
            </CardContent>
        </Card>
    );
}

function EnhancedClientesList({ onAction }: any) {
    const clientes = [
        {
            id: 1,
            nome: "Incorporadora Alpha",
            tipo: "Corporativo (PJ)",
            documento: "12.345.678/0001-99",
            contato: "Roberto Sales (CEO)",
            email: "roberto@alpha.com",
            status: "ATIVO",
            contratos: 3,
            valorTotal: "R$ 4.2M",
            nps: 9.5,
            saude: "Excelente",
            logo: "A"
        },
        {
            id: 2,
            nome: "Condomínio Jardins",
            tipo: "Condominial (PJ)",
            documento: "99.888.777/0001-00",
            contato: "Maria Oliveira (Síndica)",
            email: "maria@jardins.com",
            status: "ATIVO",
            contratos: 1,
            valorTotal: "R$ 850k",
            nps: 8.0,
            saude: "Alerta",
            logo: "J"
        },
        {
            id: 3,
            nome: "Dr. Fernando Costa",
            tipo: "Residencial (PF)",
            documento: "123.456.789-00",
            contato: "Fernando Costa",
            email: "fernando@costa.com",
            status: "PROSPECT",
            contratos: 0,
            valorTotal: "R$ 0",
            nps: null,
            saude: "Novo",
            logo: "F"
        },
    ];

    return (
        <div className="grid gap-6">
            {clientes.map(c => (
                <Card key={c.id} className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl hover:border-primary/20 hover:shadow-2xl transition-all group overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                            {/* Company Info */}
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-black text-3xl shadow-inner border border-primary/5">
                                    {c.logo}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black text-2xl tracking-tight leading-none group-hover:text-primary transition-colors">{c.nome}</h3>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className="text-[10px] font-black tracking-widest uppercase border-none px-2 py-0.5 bg-primary/10 text-primary">{c.tipo}</Badge>
                                        <span className="text-[10px] font-bold text-muted-foreground/60">{c.documento}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact & Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 flex-1 lg:max-w-2xl">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-2 tracking-widest flex items-center gap-1.5"><Users size={12} /> Contato Principal</p>
                                    <p className="text-xs font-black">{c.contato}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-1 lowercase">{c.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-2 tracking-widest flex items-center gap-1.5"><TrendingUp size={12} /> Volume Comercial</p>
                                    <p className="text-xs font-black text-primary">{c.valorTotal}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">{c.contratos} Contratos</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-2 tracking-widest">Satisfaction (NPS)</p>
                                    <div className="flex flex-col items-center">
                                        <p className="text-lg font-black leading-none">{c.nps || '-'}</p>
                                        <div className="flex gap-0.5 mt-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className={cn("w-1 h-1 rounded-full", c.nps && c.nps > i * 2 ? "bg-primary" : "bg-muted")} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-2 tracking-widest text-right">Saúde Comercial</p>
                                    <Badge className={cn(
                                        "font-black text-[10px] tracking-widest uppercase px-3 py-1.5 border-none",
                                        c.saude === 'Excelente' ? 'bg-emerald-500/10 text-emerald-600' :
                                            c.saude === 'Alerta' ? 'bg-red-500/10 text-red-600' : 'bg-primary/10 text-primary'
                                    )}>
                                        {c.saude}
                                    </Badge>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button variant="outline" className="rounded-xl h-12 w-12 p-0 border-border/40 hover:bg-primary/10 hover:text-primary">
                                    <MessageSquare size={18} />
                                </Button>
                                <Button
                                    onClick={() => onAction('Perfil Completo', `Visualizar histórico financeiro e documental de ${c.nome}.`, Target)}
                                    className="rounded-xl h-12 gap-2 font-black px-6 uppercase text-[10px] tracking-widest bg-primary hover:bg-primary/90"
                                >
                                    Abrir Perfil <ChevronRight size={18} />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default ComercialDashboard;
