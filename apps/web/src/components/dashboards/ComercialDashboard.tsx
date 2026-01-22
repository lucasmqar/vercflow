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
import { DashboardTab, Lead, Budget, Proposal } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';

export function ComercialDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [view, setView] = useState<'leads' | 'orcamentos' | 'propostas' | 'clientes'>('leads');
    const [openPlaceholder, setOpenPlaceholder] = useState(false);
    const [modalConfig, setModalConfig] = useState<any>({});

    const handlePlaceholder = (title: string, desc: string, icon: any, type: any = 'none') => {
        setModalConfig({ title, description: desc, icon, type });
        setOpenPlaceholder(true);
    };

    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-24">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <HeaderAnimated title="Módulo Comercial" />
                    <p className="text-muted-foreground font-medium mt-1">
                        "Tudo nasce no Comercial": Leads, Orçamentos e Propostas.
                    </p>
                </div>
                <div className="flex gap-3 bg-muted/20 p-1 rounded-2xl border border-border/40">
                    <Button
                        variant="ghost"
                        onClick={() => setView('leads')}
                        className={cn(
                            "rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10",
                            view === 'leads' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                        )}
                    >
                        Leads
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setView('orcamentos')}
                        className={cn(
                            "rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10",
                            view === 'orcamentos' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                        )}
                    >
                        Orçamentos
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setView('propostas')}
                        className={cn(
                            "rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10",
                            view === 'propostas' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                        )}
                    >
                        Propostas
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setView('clientes')}
                        className={cn(
                            "rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10",
                            view === 'clientes' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                        )}
                    >
                        Clientes
                    </Button>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Pipeline Total" value="R$ 8.4M" change="+12.5%" icon={TrendingUp} color="blue" />
                <StatCard title="Leads Ativos" value="24" change="+4" icon={Users} color="orange" />
                <StatCard title="Taxa Conversão" value="18.5%" change="-2.1%" icon={Target} color="emerald" />
                <StatCard title="Aguardando" value="7" desc="Propostas enviadas" icon={Clock} color="purple" />
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                    <Input placeholder="Buscar por cliente, obra ou código..." className="pl-12 h-12 rounded-xl border-border/40 bg-background/50 text-sm font-medium shadow-inner" />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl h-12 gap-2 font-black px-6 border-border/40 uppercase text-[10px] tracking-widest"><Filter size={18} /> Filtros</Button>
                    <Button
                        onClick={() => handlePlaceholder(`Novo ${view === 'leads' ? 'Lead' : view === 'orcamentos' ? 'Orçamento' : 'Proposta'}`, `Registre um novo item no funil do Comercial.`, Plus, view === 'leads' ? 'lead' : 'none')}
                        className="rounded-xl h-12 gap-2 font-black px-6 uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
                    >
                        <Plus size={18} /> Novo {view === 'leads' ? 'Lead' : view === 'orcamentos' ? 'Orçamento' : 'Proposta'}
                    </Button>
                </div>
            </div>

            {/* List View */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid gap-4"
                >
                    {view === 'leads' && <LeadsList onAction={handlePlaceholder} />}
                    {view === 'orcamentos' && <BudgetsList onAction={handlePlaceholder} />}
                    {view === 'propostas' && <ProposalsList onAction={handlePlaceholder} />}
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

function LeadsList({ onAction }: any) {
    const data = [
        { id: '1', client: 'Hospital Santa Rosa', obra: 'Reforma Ala C', area: 1200, status: 'QUALIFICADO', date: 'Há 2 dias' },
        { id: '2', client: 'Grupo Madero', obra: 'Nova Unidade Campinas', area: 450, status: 'NOVO', date: 'Há 5 horas' },
        { id: '3', client: 'Residencial Aurora', obra: 'Infraestrutura Hidráulica', area: 2500, status: 'EM_QUALIFICACAO', date: 'Ontem' },
    ];

    return (
        <>
            {data.map(item => (
                <Card key={item.id} className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl hover:border-primary/20 hover:shadow-2xl transition-all group overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500/10 flex items-center justify-center text-amber-600">
                                    <Target size={30} />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl leading-none group-hover:text-primary transition-colors">{item.client}</h3>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">{item.obra} • {item.area}m²</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge className="bg-amber-500/10 text-amber-600 font-black text-[10px] tracking-widest uppercase border-none">{item.status}</Badge>
                                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onAction('Detalhes do Lead', `Visualizar pipeline para ${item.client}.`, Target)}>
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}

function BudgetsList({ onAction }: any) {
    const data = [
        { id: '1', client: 'Condomínio Spazio', value: 'R$ 850.000', status: 'EM_ELABORACAO', date: 'Vence em 3 dias' },
        { id: '2', client: 'Prefeitura Municipal', value: 'R$ 2.4M', status: 'ENVIADO', date: 'Há 1 semana' },
    ];

    return (
        <>
            {data.map(item => (
                <Card key={item.id} className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl hover:border-primary/20 transition-all group">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <DollarSign size={30} />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl leading-none">{item.client}</h3>
                                    <p className="text-xs font-black text-primary uppercase tracking-widest mt-2">{item.value}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge className="bg-blue-500/10 text-blue-600 font-black text-[10px] tracking-widest uppercase border-none">{item.status}</Badge>
                                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onAction('Edição de Orçamento', `Configurar itens de escopo macro para ${item.client}.`, DollarSign)}>
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}

function ProposalsList({ onAction }: any) {
    const data = [
        { id: '1', client: 'Indústria Textil X', status: 'APROVADA', version: 'v3', val: 'R$ 1.2M' },
        { id: '2', client: 'Posto Petrobras', status: 'NEGOCIACAO', version: 'v1', val: 'R$ 450k' },
    ];

    return (
        <>
            {data.map(item => (
                <Card key={item.id} className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl hover:border-emerald-500/20 transition-all group">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                    <FileText size={30} />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl leading-none">{item.client}</h3>
                                    <div className="flex items-center gap-3 mt-2">
                                        <Badge variant="outline" className="text-[9px] font-black">{item.version}</Badge>
                                        <p className="text-xs font-bold text-muted-foreground uppercase">{item.val}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className={cn(
                                    "font-black text-[10px] tracking-widest uppercase border-none",
                                    item.status === 'APROVADA' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                )}>
                                    {item.status}
                                </Badge>
                                {item.status === 'APROVADA' ? (
                                    <Button
                                        onClick={() => onAction('Ativar Obra', `Gerar DNA da obra e distribuir tarefas para ${item.client}.`, CheckCircle2)}
                                        className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl px-6"
                                    >
                                        Ativar Obra
                                    </Button>
                                ) : (
                                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onAction('Gestão de Proposta', `Negociação e versões para ${item.client}.`, FileText)}>
                                        <ChevronRight />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
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
