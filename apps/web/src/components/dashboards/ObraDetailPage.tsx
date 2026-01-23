"use client"

import React, { useState } from 'react';
import {
    ArrowLeft,
    Building2,
    MapPin,
    User,
    Briefcase,
    LayoutDashboard,
    Hammer,
    Layers,
    Users,
    ShoppingCart,
    DollarSign,
    Truck,
    FileText,
    ClipboardList,
    Settings,
    ChevronRight,
    TrendingUp,
    ShieldCheck,
    Calendar,
    Target,
    Activity,
    AlertTriangle,
    CheckCircle2,
    BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Project } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';

interface ObraDetailPageProps {
    obra: Project;
    onBack: () => void;
}

export function ObraDetailPage({ obra, onBack }: ObraDetailPageProps) {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'engineering', label: 'Engenharia', icon: Hammer },
        { id: 'projects', label: 'Projetos', icon: Layers },
        { id: 'people', label: 'RH / SST', icon: Users },
        { id: 'purchases', label: 'Suprimentos', icon: ShoppingCart },
        { id: 'financial', label: 'Financeiro', icon: DollarSign },
        { id: 'logistics', label: 'Logística', icon: Truck },
        { id: 'documents', label: 'Documentos', icon: FileText },
        { id: 'field', label: 'Diário / Campo', icon: ClipboardList },
        { id: 'settings', label: 'Ajustes', icon: Settings },
    ];

    return (
        <div className="flex flex-col h-full bg-secondary/10 overflow-hidden">
            {/* Unified Fixed Header */}
            <div className="bg-background/60 backdrop-blur-3xl border-b border-border/40 p-6 lg:px-10 flex flex-col gap-6 shrink-0 relative z-20">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="w-12 h-12 rounded-[1.25rem] bg-muted/20 border border-white/5 hover:bg-white/10"
                        >
                            <ArrowLeft size={24} />
                        </Button>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl font-black tracking-tighter uppercase">{obra.nome}</h2>
                                <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] items-center gap-2 px-3 h-7 flex">
                                    {obra.status}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-5">
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                    <MapPin size={14} className="text-primary" /> {obra.endereco || 'Local não definido'}
                                </span>
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                    <Building2 size={14} className="text-primary" /> {obra.categoria || 'Residencial'}
                                </span>
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                    <User size={14} className="text-primary" /> Cliente: {obra.client?.nome || 'Não definido'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="h-10 rounded-xl px-4 font-black uppercase tracking-widest text-[9px] gap-2 border-white/10 hover:bg-white/5">
                            <Briefcase size={14} /> Ver Comercial
                        </Button>
                        <Button variant="outline" className="h-10 rounded-xl px-4 font-black uppercase tracking-widest text-[9px] gap-2 border-white/10 hover:bg-white/5">
                            <BarChart3 size={14} /> Centro de Custo
                        </Button>
                    </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex overflow-x-auto no-scrollbar pt-2">
                    <div className="flex p-1.5 bg-muted/20 rounded-[28px] border border-border/40 shrink-0 backdrop-blur-xl gap-2 h-14 items-center px-2">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2.5 px-5 h-10 rounded-[20px] transition-all duration-300 whitespace-nowrap",
                                        isActive
                                            ? "bg-background shadow-lg text-primary scale-105"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                    )}
                                >
                                    <Icon size={16} className={cn(isActive && "animate-pulse")} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.15em]">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="max-w-[1600px] mx-auto w-full"
                    >
                        {activeTab === 'overview' && <OverviewTab obra={obra} />}
                        {activeTab === 'engineering' && <EngineeringTab obra={obra} />}
                        {activeTab === 'projects' && <ProjectsTab obra={obra} />}
                        {activeTab === 'people' && <PeopleTab obra={obra} />}
                        {activeTab === 'purchases' && <PurchasesTab obra={obra} />}
                        {activeTab === 'financial' && <FinancialTab obra={obra} />}
                        {activeTab === 'logistics' && <LogisticsTab obra={obra} />}
                        {activeTab === 'documents' && <DocumentsTab obra={obra} />}
                        {activeTab === 'field' && <FieldDiaryTab obra={obra} />}
                        {activeTab === 'settings' && <SettingsTab obra={obra} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// Sub-components (Tabs)
function OverviewTab({ obra }: { obra: Project }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Avanço Físico" value="0%" icon={Activity} color="text-primary" />
            <StatCard label="Avanço Projetos" value="12%" icon={Layers} color="text-amber-500" />
            <StatCard label="Orçamento Consumido" value="R$ 0" icon={DollarSign} color="text-emerald-500" />
            <StatCard label="Segurança (EPI/NR)" value="OK" icon={ShieldCheck} color="text-blue-500" />

            <Card className="lg:col-span-3 rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl p-8 min-h-[400px]">
                <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Linha do Tempo</h3>
                <div className="relative pl-12 space-y-12 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                    <TimelineItem label="Lead Criado" date="Jan 20, 2026" status="complete" />
                    <TimelineItem label="Orçamento Aprovado" date="Jan 21, 2026" status="complete" />
                    <TimelineItem label="Proposta Fechada" date="Jan 22, 2026" status="complete" />
                    <TimelineItem label="Obra Ativada" date="Jan 23, 2026" status="active" />
                    <TimelineItem label="Mobilização de Canteiro" date="Pendente" status="pending" />
                </div>
            </Card>

            <div className="space-y-6">
                <ModuleSummaryCard title="Engenharia" desc="0 fases concluídas" items={["Fase 01: Mobilização", "Fase 02: Fundações"]} />
                <ModuleSummaryCard title="Financeiro" desc="Fluxo de Caixa" items={["A receber: R$ 450k", "A pagar: R$ 120k"]} />
            </div>
        </div>
    );
}

function EngineeringTab({ obra }: { obra: Project }) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl p-8">
                    <h3 className="text-xl font-black uppercase mb-6">Fases da Obra</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {['Pré-Obra', 'Mobilização', 'Estrutura', 'Alvenaria', 'Instalações', 'Acabamento'].map((fase, i) => (
                            <div key={fase} className="flex-1 min-w-[150px] p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center gap-3 text-center">
                                <Badge className="bg-muted text-muted-foreground border-none text-[8px] font-black uppercase">{i + 1}</Badge>
                                <span className="font-black text-xs uppercase tracking-widest">{fase}</span>
                                <div className="h-1 w-full bg-white/10 rounded-full mt-2" />
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl p-8">
                    <h3 className="text-xl font-black uppercase mb-6 text-primary">Solicitações abertas</h3>
                    <div className="space-y-4">
                        <SmallRequestCard to=" RH / SST" title="Alocar Mestre de Obra" priority="ALTA" />
                        <SmallRequestCard to="Compras" title="Cimento CP-II (500 sacos)" priority="URGENTE" />
                    </div>
                </Card>
            </div>
        </div>
    );
}

function ProjectsTab({ obra }: { obra: Project }) {
    return (
        <div className="space-y-8">
            <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl p-8">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                    <h3 className="text-xl font-black uppercase">Board de Disciplinas</h3>
                    <Button variant="outline" className="h-10 rounded-xl font-black uppercase tracking-widest text-[9px]">
                        + Adicionar Disciplina
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <KanbanColumn title="Não Iniciado" count={2} color="bg-muted" />
                    <KanbanColumn title="Desenvolvimento" count={1} color="bg-primary" />
                    <KanbanColumn title="Revisão Interna" count={0} color="bg-amber-500" />
                    <KanbanColumn title="Órgão / Cliente" count={0} color="bg-blue-500" />
                    <KanbanColumn title="Aprovado" count={0} color="bg-emerald-500" />
                </div>
            </Card>
        </div>
    );
}

function PeopleTab({ obra }: { obra: Project }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-8 rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl p-8">
                <h3 className="text-xl font-black uppercase mb-8">Pessoas na Obra</h3>
                <div className="space-y-6">
                    {/* Empty State */}
                    <div className="py-20 text-center opacity-30">
                        <Users size={64} className="mx-auto mb-4" />
                        <p className="font-black uppercase tracking-widest text-sm">Nenhum colaborador alocado ainda</p>
                        <Button variant="link" className="text-primary font-black uppercase text-xs mt-4">Solicitar equipe ao RH</Button>
                    </div>
                </div>
            </Card>
            <Card className="lg:col-span-4 rounded-[2.5rem] border-white/10 bg-primary/5 p-8 border-dashed border-2">
                <h3 className="text-xl font-black uppercase mb-6 text-primary flex items-center gap-2">
                    <ShieldCheck size={24} /> Status SST
                </h3>
                <div className="space-y-6">
                    <SSTItem label="NRs Obrigatórias" status="Pendente" color="text-amber-500" />
                    <SSTItem label="Kits EPI" status="Não entregue" color="text-red-500" />
                    <SSTItem label="Liberação de Etapa" status="Bloqueado" color="text-red-500" />
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed mt-4">
                        A obra não está liberada para início das fundações devido à falta de treinamentos de NR-18.
                    </p>
                </div>
            </Card>
        </div>
    );
}

function PurchasesTab({ obra }: { obra: Project }) {
    return <ModulePlaceholder title="Suprimentos & Almoxarifado" icon={ShoppingCart} />;
}

function FinancialTab({ obra }: { obra: Project }) {
    return <ModulePlaceholder title="Gestão Financeira & Custos" icon={DollarSign} />;
}

function LogisticsTab({ obra }: { obra: Project }) {
    return <ModulePlaceholder title="Movimentação & Logística" icon={Truck} />;
}

function DocumentsTab({ obra }: { obra: Project }) {
    return <ModulePlaceholder title="Documentos & Órgãos" icon={FileText} />;
}

function FieldDiaryTab({ obra }: { obra: Project }) {
    return <ModulePlaceholder title="Diário de Obra / Registro de Campo" icon={ClipboardList} />;
}

function SettingsTab({ obra }: { obra: Project }) {
    return <ModulePlaceholder title="Configurações Técnicas" icon={Settings} />;
}

// UI Helpers
function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <Card className="rounded-3xl border-white/5 bg-background/40 backdrop-blur-xl p-8 flex flex-col gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 flex items-center gap-2">
                <Icon size={14} className={color} /> {label}
            </span>
            <p className="text-3xl font-black tracking-tighter">{value}</p>
        </Card>
    );
}

function TimelineItem({ label, date, status }: any) {
    return (
        <div className="relative group">
            <div className={cn(
                "absolute -left-7 top-1 w-2.5 h-2.5 rounded-full z-10",
                status === 'complete' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                    status === 'active' ? "bg-primary animate-pulse" : "bg-muted"
            )} />
            <div>
                <h4 className={cn("text-xs font-black uppercase tracking-widest", status === 'pending' && "opacity-40")}>{label}</h4>
                <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase">{date}</p>
            </div>
        </div>
    );
}

function ModuleSummaryCard({ title, desc, items }: any) {
    return (
        <Card className="rounded-[2rem] border-white/5 bg-background/40 backdrop-blur-xl p-6">
            <h4 className="text-xs font-black uppercase tracking-widest mb-1 text-primary">{title}</h4>
            <p className="text-[10px] text-muted-foreground font-bold mb-4 uppercase">{desc}</p>
            <div className="space-y-2">
                {items.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground opacity-70">
                        <ChevronRight size={10} className="text-primary" /> {item}
                    </div>
                ))}
            </div>
        </Card>
    );
}

function SmallRequestCard({ to, title, priority }: any) {
    return (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer">
            <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className="text-[8px] font-black border-white/10 uppercase tracking-widest px-2">{to}</Badge>
                <span className={cn("text-[8px] font-black uppercase tracking-widest", priority === 'URGENTE' ? "text-red-500" : "text-amber-500")}>{priority}</span>
            </div>
            <p className="text-[11px] font-black uppercase leading-tight">{title}</p>
        </div>
    );
}

function KanbanColumn({ title, count, color }: any) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", color)} />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{title}</span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">{count}</span>
            </div>
            <div className="min-h-[200px] rounded-3xl bg-white/5 border border-dashed border-white/5 flex items-center justify-center p-6 text-center">
                <p className="text-[10px] text-muted-foreground uppercase opacity-20 font-black tracking-widest">Sem disciplinas</p>
            </div>
        </div>
    );
}

function SSTItem({ label, status, color }: any) {
    return (
        <div className="flex justify-between items-center border-b border-primary/10 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
            <span className={cn("text-[10px] font-black uppercase", color)}>{status}</span>
        </div>
    );
}

function ModulePlaceholder({ title, icon: Icon }: any) {
    return (
        <div className="py-40 text-center opacity-20 flex flex-col items-center justify-center h-full">
            <Icon size={120} strokeWidth={0.5} className="mb-8" />
            <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">{title}</h3>
            <p className="text-sm font-black uppercase tracking-[0.3em]">Módulo em Fase de Ativação Técnica</p>
        </div>
    );
}
