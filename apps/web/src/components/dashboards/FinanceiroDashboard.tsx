"use client"

import React, { useState } from 'react';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    PieChart,
    FileText,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    Landmark,
    Filter,
    Search,
    Plus,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal,
    Activity,
    Target,
    FileMinus,
    ChevronRight,
    ChevronDown,
    Building2,
    Zap,
    Download,
    Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { DashboardTab } from '@/types';
import { ReusableKanbanBoard } from '@/components/tasks/ReusableKanbanBoard';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';

export function FinanceiroDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    const [moduleView, setModuleView] = useState<'geral' | 'atividades'>('geral');
    const [activeTab, setActiveTab] = useState('fluxo');
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any; type?: any }>({
        isOpen: false,
        title: "",
        type: "none"
    });

    const openPlaceholder = (title: string, icon?: any, type: any = "none") => {
        setModalConfig({ isOpen: true, title, icon, type });
    };

    // Mock Data
    const cashFlowData = [
        { name: '01/05', projetado: 450000, real: 420000 },
        { name: '05/05', projetado: 520000, real: 510000 },
        { name: '10/05', projetado: 480000, real: 490000 },
        { name: '15/05', projetado: 610000, real: 580000 },
        { name: '20/05', projetado: 550000, real: 540000 },
        { name: '25/05', projetado: 720000, real: 710000 },
    ];

    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-32">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <HeaderAnimated title="Controladoria & Finanças" />
                    <p className="text-muted-foreground font-medium mt-1">
                        Gestão de tesouraria, engenharia de custos e compliance fiscal.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex p-1 bg-muted/20 rounded-xl border border-border/40 shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setModuleView('geral')}
                            className={cn(
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9",
                                moduleView === 'geral' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                            )}
                        >
                            Overview
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setModuleView('atividades')}
                            className={cn(
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9",
                                moduleView === 'atividades' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                            )}
                        >
                            Tarefas
                        </Button>
                    </div>
                    <Button
                        className="rounded-xl h-11 px-6 font-black uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                        onClick={() => openPlaceholder("Novo Lançamento Financeiro", Plus, "financial")}
                    >
                        <Plus size={18} /> Novo Lançamento
                    </Button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {moduleView === 'geral' ? (
                    <motion.div key="geral" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
                        {/* Premium KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div onClick={() => openPlaceholder("Disponibilidade de Caixa", Landmark)} className="cursor-pointer">
                                <KPICard title="Disponibilidade" value="R$ 1.2M" percentage="SALDO ATUAL" icon={Landmark} state="success" />
                            </div>
                            <div onClick={() => openPlaceholder("Contas a Pagar", FileMinus)} className="cursor-pointer">
                                <KPICard title="A Pagar (Mês)" value="R$ 550k" percentage="62 TÍTULOS" icon={FileMinus} state="warning" />
                            </div>
                            <div onClick={() => openPlaceholder("Contas a Receber", ArrowDownRight)} className="cursor-pointer">
                                <KPICard title="A Receber (Mês)" value="R$ 890k" percentage="12 MEDIÇÕES" icon={ArrowDownRight} state="success" />
                            </div>
                            <div onClick={() => openPlaceholder("Burn Rate Operacional", Activity)} className="cursor-pointer">
                                <KPICard title="Burn Rate" value="R$ 12.4k" percentage="MÉDIA DIÁRIA" icon={Activity} state="neutral" />
                            </div>
                        </div>

                        {/* Main Content Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <div className="flex items-center justify-between border-b border-border/40 pb-2 overflow-x-auto no-scrollbar">
                                <TabsList className="bg-transparent h-auto p-0 gap-8">
                                    <TabItem value="fluxo" icon={TrendingUp} label="Fluxo de Caixa" isActive={activeTab === 'fluxo'} />
                                    <TabItem value="pagar" icon={CreditCard} label="Contas a Pagar" isActive={activeTab === 'pagar'} />
                                    <TabItem value="propostas" icon={FileText} label="Propostas & Contratos" isActive={activeTab === 'propostas'} />
                                    <TabItem value="fiscal" icon={Receipt} label="Fiscal & Impostos" isActive={activeTab === 'fiscal'} />
                                </TabsList>
                            </div>

                            <TabsContent value="fluxo" className="space-y-6 mt-0">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <Card className="lg:col-span-2 rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl p-8 shadow-sm relative overflow-hidden">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-xl font-black">Projeção de Caixa Consolidada</h3>
                                            <div className="flex gap-2">
                                                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black px-3">ATUALIZADO AGORA</Badge>
                                            </div>
                                        </div>
                                        <div className="h-[350px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={cashFlowData}>
                                                    <defs>
                                                        <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} tickFormatter={(val) => `R$${val / 1000}k`} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#111', borderRadius: '16px', border: 'none' }} />
                                                    <Area type="monotone" dataKey="projetado" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorProj)" name="Projetado" />
                                                    <Area type="monotone" dataKey="real" stroke="#10b981" strokeWidth={4} fillOpacity={0} name="Realizado" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Card>

                                    <div className="space-y-6">
                                        <Card className="rounded-[2.5rem] border-border/40 bg-background/60 p-8 shadow-sm">
                                            <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground mb-6">Orçado x Realizado (Mês)</h4>
                                            <div className="space-y-6">
                                                <ProgressItem label="Materiais" value={82} color="bg-primary" />
                                                <ProgressItem label="Mão de Obra" value={95} color="bg-emerald-500" />
                                                <ProgressItem label="Impostos" value={45} color="bg-amber-500" />
                                                <ProgressItem label="Marketing" value={110} color="bg-red-500" />
                                            </div>
                                        </Card>

                                        <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 p-8 text-center">
                                            <Zap className="mx-auto text-primary mb-4" size={32} />
                                            <h4 className="font-black text-sm mb-2">Insight de Caixa</h4>
                                            <p className="text-[10px] font-medium text-muted-foreground">O recebimento da medição #12 (Ed. Sky) em 05/06 reduzirá o risco de liquidez em 40%.</p>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="propostas" className="mt-0 outline-none">
                                <PropostasView openPlaceholder={openPlaceholder} />
                            </TabsContent>

                            <TabsContent value="fiscal" className="space-y-6 mt-0">
                                <Card className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl p-8 shadow-sm">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl font-black">Calendário de Impostos & NFs</h3>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl px-4 text-[10px] font-black gap-2 h-9"
                                            onClick={() => openPlaceholder("Exportar Dados SPED", Download)}
                                        >
                                            <Download size={14} /> EXPORTAR SPED
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { tax: 'ISS (Mensal)', value: 'R$ 12.450', date: '20/06', status: 'pendente' },
                                            { tax: 'PIS/COFINS', value: 'R$ 48.900', date: '25/06', status: 'calculado' },
                                            { tax: 'ICMS', value: 'R$ 5.200', date: '15/06', status: 'pago' },
                                        ].map((t, idx) => (
                                            <div key={idx} className="p-6 rounded-[2rem] bg-secondary/30 border border-white/5 flex flex-col gap-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="p-2 rounded-xl bg-primary/10 text-primary"><Receipt size={18} /></div>
                                                    <Badge className={cn(
                                                        "text-[9px] font-black uppercase",
                                                        t.status === 'pago' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                                    )}>{t.status}</Badge>
                                                </div>
                                                <div>
                                                    <p className="font-black text-lg">{t.tax}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Vencimento: {t.date}</p>
                                                </div>
                                                <p className="text-2xl font-black text-primary">{t.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                ) : (
                    <motion.div key="atividades" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full min-h-[600px]">
                        <ReusableKanbanBoard contextFilter="FIN" title="Processos Financeiros" />
                    </motion.div>
                )}
            </AnimatePresence>

            <PlaceholderModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                icon={modalConfig.icon}
                type={(modalConfig as any).type}
            />
        </div>
    );
}

// Helpers
function KPICard({ title, value, percentage, icon: Icon, state }: any) {
    const colors = {
        success: "text-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
        warning: "text-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.1)]",
        danger: "text-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.1)]",
        neutral: "text-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
    };
    return (
        <Card className="rounded-[2rem] border-border/40 bg-background/60 backdrop-blur-md p-6 flex flex-col justify-between group h-40 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex justify-between items-start">
                <div className={cn("p-4 rounded-2xl", colors[state as keyof typeof colors])}><Icon size={24} strokeWidth={2.5} /></div>
                <Badge variant="secondary" className="text-[8px] font-black py-0.5 px-2 bg-muted/40">{percentage}</Badge>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 opacity-60">{title}</p>
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
                "relative bg-transparent h-12 rounded-none px-0 gap-2 text-[10px] font-black uppercase tracking-widest transition-all border-none data-[state=active]:bg-transparent data-[state=active]:text-primary",
                isActive ? "text-primary px-2" : "text-muted-foreground"
            )}
        >
            <Icon size={16} /> {label}
            {isActive && <motion.div layoutId="active-tab-fin" className="absolute -bottom-[9px] left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-5px_15px_rgba(var(--primary),0.5)]" />}
        </TabsTrigger>
    );
}

function ProgressItem({ label, value, color }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">
                <span>{label}</span>
                <span className={cn(value > 100 ? "text-red-500" : "text-primary")}>{value}%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                <div className={cn("h-full transition-all duration-1000", color)} style={{ width: `${Math.min(value, 100)}%` }} />
            </div>
        </div>
    );
}

function PropostasView({ openPlaceholder }: any) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-xl font-black">Propostas Ativas</h3>
                    <Button onClick={() => openPlaceholder("Gerar Nova Proposta", Plus)} className="rounded-xl h-10 gap-2 font-black px-4 uppercase text-[10px] tracking-widest bg-primary">
                        <Plus size={14} /> Nova Carta Proposta
                    </Button>
                </div>
                {[
                    { ref: 'PROP-2026-042', client: 'Condomínio Sky', value: 'R$ 4.2M' },
                    { ref: 'PROP-2026-043', client: 'Holding Alpha', value: 'R$ 850k' },
                ].map((prop) => (
                    <Card key={prop.ref} className="rounded-[2rem] border-border/40 bg-background/60 p-6 hover:border-primary/20 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><FileText size={24} /></div>
                                <div>
                                    <p className="font-black text-sm">{prop.ref} · {prop.client}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Valor Global: {prop.value}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 opacity-0 group-hover:opacity-100"><ChevronRight size={20} /></Button>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="space-y-6">
                <Card className="rounded-[2.5rem] border-border/40 bg-background/60 p-8">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">Templates de Contrato</h4>
                    <div className="space-y-3">
                        {['Residencial Padrão.pdf', 'Industrial Verc.pdf', 'Carta Proposta Simples.pdf'].map(t => (
                            <div key={t} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-all">
                                <Download size={14} className="text-muted-foreground" />
                                <span className="text-xs font-bold truncate">{t}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default FinanceiroDashboard;
