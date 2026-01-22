"use client"

import React, { useState } from 'react';
import {
    ShoppingCart,
    Package,
    FileText,
    Truck,
    TrendingDown,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    AlertCircle,
    Building2,
    ArrowRight,
    BarChart3,
    ChevronRight,
    ArrowUpRight,
    History,
    ShieldCheck,
    Coins,
    Zap,
    Download,
    Receipt,
    Calendar,
    Box,
    MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardTab } from '@/types';
import { ReusableKanbanBoard } from '@/components/tasks/ReusableKanbanBoard';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';

export function ComprasDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    const [moduleView, setModuleView] = useState<'geral' | 'atividades'>('geral');
    const [activeTab, setActiveTab] = useState('requisicoes');
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any }>({
        isOpen: false,
        title: "",
    });

    const openPlaceholder = (title: string, icon?: any) => {
        setModalConfig({ isOpen: true, title, icon });
    };

    // Mock Data
    const requisicoes = [
        { id: 'REQ-2024-089', obra: 'Edifício Sky', solicitante: 'Eng. Carlos', itens: 12, prioridade: 'ALTA', status: 'COTACAO', data: '20/05/2024' },
        { id: 'REQ-2024-090', obra: 'Residencial Park', solicitante: 'Mestre João', itens: 5, prioridade: 'NORMAL', status: 'PENDENTE', data: '21/05/2024' },
        { id: 'REQ-2024-091', obra: 'Edifício Sky', solicitante: 'Eng. Carlos', itens: 28, prioridade: 'URGENTE', status: 'APROVADO', data: '19/05/2024' },
    ];

    const orders = [
        { id: 'PO-7821', supplier: 'Açolab S.A', value: 'R$ 45.200', status: 'EM TRANSITO', delivery: '25/05' },
        { id: 'PO-7822', supplier: 'Cimento Forte', value: 'R$ 12.800', status: 'ENTREGUE', delivery: '22/05' },
        { id: 'PO-7823', supplier: 'HidroCenter', value: 'R$ 8.450', status: 'PREPARANDO', delivery: '28/05' },
    ];

    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-32 no-scrollbar">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <HeaderAnimated title="Suprimentos & Logística" />
                    <p className="text-muted-foreground font-medium mt-1">
                        Gestão centralizada de aquisições, cotações e conformidade de estoque.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex p-1 bg-muted/20 rounded-xl border border-border/40 shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setModuleView('geral')}
                            className={cn(
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9 transition-all",
                                moduleView === 'geral' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-white/5"
                            )}
                        >
                            Overview
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setModuleView('atividades')}
                            className={cn(
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9 transition-all",
                                moduleView === 'atividades' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-white/5"
                            )}
                        >
                            Kanban
                        </Button>
                    </div>
                    <Button
                        className="rounded-xl h-11 px-6 font-black uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        onClick={() => openPlaceholder("Nova Requisição de Suprimentos", ShoppingCart)}
                    >
                        <Plus size={18} /> Nova Requisição
                    </Button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {moduleView === 'geral' ? (
                    <motion.div key="geral" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
                        {/* Premium KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div onClick={() => openPlaceholder("Visualizar Requisições Gerais", FileText)} className="cursor-pointer">
                                <SummaryCard title="Requisições" value="24" sub="8 PENDENTES" icon={FileText} type="neutral" />
                            </div>
                            <div onClick={() => openPlaceholder("Gestão de Ordens de Compra", ShoppingCart)} className="cursor-pointer">
                                <SummaryCard title="Ordens de Compra" value="12" sub="R$ 452.890" icon={ShoppingCart} type="success" />
                            </div>
                            <div onClick={() => openPlaceholder("Analytics: Savings de Suprimentos", Coins)} className="cursor-pointer">
                                <SummaryCard title="Savings Mês" value="R$ 42k" sub="MÉDIA 8.4%" icon={Coins} type="warning" />
                            </div>
                            <div onClick={() => openPlaceholder("Análise de Lead Time (Logística)", Clock)} className="cursor-pointer">
                                <SummaryCard title="Lead Time" value="4.2d" sub="MÉDIA ENTREGA" icon={Clock} type="danger" />
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                            <div className="flex items-center justify-between border-b border-border/40 pb-2 overflow-x-auto no-scrollbar">
                                <TabsList className="bg-transparent h-auto p-0 gap-8">
                                    <TabItem value="requisicoes" icon={FileText} label="Requisições" isActive={activeTab === 'requisicoes'} />
                                    <TabItem value="ordens" icon={Package} label="Ordens de Compra" isActive={activeTab === 'ordens'} />
                                    <TabItem value="entrega" icon={Truck} label="Logística & Entrega" isActive={activeTab === 'entrega'} />
                                    <TabItem value="estoque" icon={Box} label="Almoxarifado" isActive={activeTab === 'estoque'} />
                                </TabsList>
                            </div>

                            <TabsContent value="requisicoes" className="space-y-6 mt-0">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-4">
                                        <div className="flex justify-between items-center px-2 mb-2">
                                            <h3 className="font-black text-lg tracking-tight">Requisições de Campo</h3>
                                            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest h-8 gap-2">Ver Todas <ArrowRight size={14} /></Button>
                                        </div>
                                        {requisicoes.map((req) => (
                                            <RequisicaoCard key={req.id} req={req} />
                                        ))}
                                    </div>
                                    <div className="space-y-8">
                                        <Card className="rounded-[2.5rem] border-border/40 bg-background/60 p-8 shadow-sm">
                                            <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                                                <AlertCircle size={18} className="text-red-500" /> Stock Alert
                                            </h3>
                                            <div className="space-y-8">
                                                <CriticalItem name="Aço CA-50" stock={15} min={20} unit="TON" />
                                                <CriticalItem name="Cimento CP-II" stock={400} min={500} unit="SAC" />
                                                <CriticalItem name="Tijolo 6 Furos" stock={8000} min={10000} unit="UN" />
                                            </div>
                                            <Button className="w-full mt-10 rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all">Cotação Automática AI</Button>
                                        </Card>

                                        <Card className="rounded-[2.5rem] border-emerald-500/20 bg-emerald-500/5 p-8 text-center border-dashed">
                                            <ShieldCheck className="mx-auto text-emerald-500 mb-4" size={32} />
                                            <h4 className="font-black text-sm mb-2">Compliance Fornecedores</h4>
                                            <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">Todos os 12 fornecedores ativos na semana possuem certificação VERC em dia.</p>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="ordens" className="mt-0">
                                <Card className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl p-8 shadow-sm">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-xl font-black">Tracking de Ordens de Compra (PO)</h3>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl px-4 text-[10px] font-black gap-2 h-9 border-white/5"
                                                onClick={() => openPlaceholder("Relatório Consolidado de OCs", Download)}
                                            >
                                                <Download size={14} /> RELATÓRIO OC
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        {orders.map((order, idx) => (
                                            <div key={idx} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 rounded-[2rem] bg-secondary/30 border border-white/5 hover:border-primary/20 transition-all group">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <Receipt size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-black text-lg tracking-tight">{order.id}</h4>
                                                            <Badge className={cn(
                                                                "text-[8px] font-black uppercase px-2",
                                                                order.status === 'EM TRANSITO' ? "bg-blue-500/10 text-blue-500" :
                                                                    order.status === 'ENTREGUE' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                                            )}>{order.status}</Badge>
                                                        </div>
                                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{order.supplier}</p>
                                                    </div>
                                                </div>

                                                <div className="flex-1 w-full max-w-xs space-y-2 hidden lg:block">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-[9px] font-black text-muted-foreground opacity-60 uppercase">Trânsito</span>
                                                        <span className="text-[10px] font-black text-primary">{order.delivery}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary" style={{ width: order.status === 'ENTREGUE' ? '100%' : order.status === 'EM TRANSITO' ? '65%' : '15%' }} />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-8 min-w-[150px] justify-end">
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-black text-muted-foreground opacity-60 uppercase mb-1">Valor Total</p>
                                                        <p className="text-lg font-black text-primary tracking-tighter">{order.value}</p>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/5"><ChevronRight size={20} /></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                ) : (
                    <motion.div key="atividades" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full min-h-[600px]">
                        <ReusableKanbanBoard contextFilter="PUR" title="Gestão de Pedidos & Suprimentos" />
                    </motion.div>
                )}
            </AnimatePresence>

            <PlaceholderModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                icon={modalConfig.icon}
            />
        </div>
    );
}

// Subcomponents
function SummaryCard({ title, value, sub, icon: Icon, type }: any) {
    const colors = {
        success: "text-emerald-500 bg-emerald-500/10 shadow-[0_10px_30px_rgba(16,185,129,0.05)]",
        warning: "text-amber-500 bg-amber-500/10 shadow-[0_10px_30px_rgba(245,158,11,0.05)]",
        danger: "text-red-500 bg-red-500/10 shadow-[0_10px_30px_rgba(239,68,68,0.05)]",
        neutral: "text-blue-500 bg-blue-500/10 shadow-[0_10px_30px_rgba(59,130,246,0.05)]"
    };
    return (
        <Card className="rounded-[2.5rem] border-white/5 bg-background/60 p-8 flex flex-col justify-between h-44 shadow-sm hover:translate-y-[-4px] transition-all border-b-4 border-b-primary group">
            <div className="flex justify-between items-start">
                <div className={cn("p-4 rounded-3xl", colors[type as keyof typeof colors])}>
                    <Icon size={28} strokeWidth={2.5} />
                </div>
                <Badge variant="secondary" className="text-[9px] font-black uppercase px-3 bg-muted/30">{sub}</Badge>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-1">{title}</p>
                <h3 className="text-3xl font-black tracking-tighter group-hover:text-primary transition-colors">{value}</h3>
            </div>
        </Card>
    );
}

function TabItem({ value, icon: Icon, label, isActive }: any) {
    return (
        <TabsTrigger
            value={value}
            className={cn(
                "relative bg-transparent h-14 rounded-none px-0 gap-3 text-[10px] font-black uppercase tracking-widest transition-all border-none data-[state=active]:bg-transparent data-[state=active]:text-primary",
                isActive ? "text-primary" : "text-muted-foreground hover:text-white/60"
            )}
        >
            <Icon size={18} /> {label}
            {isActive && <motion.div layoutId="active-tab-proc" className="absolute -bottom-[9px] left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-5px_15px_rgba(var(--primary),0.5)]" />}
        </TabsTrigger>
    );
}

function RequisicaoCard({ req }: any) {
    return (
        <Card className="rounded-[2rem] border-border/40 bg-background/60 p-8 hover:border-primary/30 transition-all group overflow-hidden relative shadow-sm hover:shadow-2xl hover:shadow-primary/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-muted/50 border border-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all group-hover:scale-110">
                        <FileText size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-black tracking-tight">{req.id}</span>
                            <Badge className={cn(
                                "text-[8px] font-black uppercase tracking-[0.1em] px-3",
                                req.prioridade === 'URGENTE' ? "bg-red-500/10 text-red-500" :
                                    req.prioridade === 'ALTA' ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
                            )}>{req.prioridade}</Badge>
                        </div>
                        <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 opacity-60">
                            <Building2 size={12} className="text-primary" /> {req.obra} · <Users size={12} className="text-primary" /> {req.solicitante}
                        </h4>
                    </div>
                </div>
                <div className="flex items-center gap-10">
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 opacity-60">Data Ref</p>
                        <p className="text-sm font-black text-primary">{req.data}</p>
                    </div>
                    <div className="text-right border-l border-white/5 pl-10">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1 opacity-60">Status</p>
                        <Badge variant="outline" className="text-[9px] font-black border-primary/20 text-primary">{req.status}</Badge>
                    </div>
                    <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-primary hover:text-white hover:scale-110 active:scale-90 transition-all border border-white/5"><ChevronRight size={20} /></Button>
                </div>
            </div>
        </Card>
    );
}

function CriticalItem({ name, stock, min, unit }: any) {
    const percent = Math.min((stock / min) * 100, 100);
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-muted-foreground opacity-60">{name}</span>
                <span className="text-red-500 font-bold">{stock}/{min} {unit}</span>
            </div>
            <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                />
            </div>
        </div>
    );
}

function Users({ size, className }: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    )
}

export default ComprasDashboard;
