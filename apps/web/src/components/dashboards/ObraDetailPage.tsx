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
    BarChart3,
    Package, // Added
    Plus // Added
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Project } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';

interface ObraDetailPageProps {
    obra: Project;
    onBack: () => void;
}

export function ObraDetailPage({ obra, onBack }: ObraDetailPageProps) {
    const [currentSection, setCurrentSection] = useState<string>('overview');

    const navItems = [
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
        <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden font-sans">
            {/* Main Layout */}
            <div className="flex h-full">
                {/* Sidebar Navigation */}
                <div className="w-20 lg:w-64 border-r border-border/40 flex flex-col items-center lg:items-stretch py-6 bg-background/50 backdrop-blur-sm shrink-0 transition-all duration-300">
                    <div className="px-6 mb-6 hidden lg:block">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="text-muted-foreground hover:text-foreground mb-4 pl-0 gap-2"
                        >
                            <ArrowLeft size={16} /> Voltar
                        </Button>
                        <h2 className="text-xl font-black tracking-tighter uppercase leading-none mb-1">{obra.nome.substring(0, 20)}{obra.nome.length > 20 && '...'}</h2>
                        <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5 mt-2">
                            {obra.status}
                        </Badge>
                    </div>

                    <div className="flex flex-col gap-1 w-full px-3 flex-1 overflow-y-auto no-scrollbar">
                        {navItems.map((item) => {
                            const isActive = currentSection === item.id;
                            return (
                                <Button
                                    key={item.id}
                                    variant={isActive ? "secondary" : "ghost"}
                                    onClick={() => setCurrentSection(item.id)}
                                    className={cn(
                                        "w-full justify-start h-11 rounded-xl transition-all duration-200 mb-1",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                                        "lg:px-4 px-0 lg:justify-start justify-center"
                                    )}
                                >
                                    <item.icon size={18} className={cn("shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground", "lg:mr-3")} />
                                    <span className="hidden lg:block font-bold text-xs uppercase tracking-wide truncate">{item.label}</span>
                                </Button>
                            );
                        })}
                    </div>

                    <div className="p-4 mt-auto">
                        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/10 rounded-2xl hidden lg:block">
                            <p className="text-[9px] font-black uppercase text-primary mb-1">Centro de Custo</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-foreground overflow-ellipsis overflow-hidden whitespace-nowrap">CC-{obra.codigoInterno || '000'}</span>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col bg-muted/5">
                    {/* Mobile Header */}
                    <div className="h-16 border-b border-border/40 flex items-center justify-between px-4 bg-background/50 backdrop-blur-sm shrink-0 lg:hidden">
                        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft size={20} /></Button>
                        <span className="font-bold text-sm truncate">{obra.nome}</span>
                        <div className="w-10" />
                    </div>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-[1600px] mx-auto w-full"
                            >
                                {/* Header Info Block for Main View */}
                                <div className="mb-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                    <div className="space-y-1">
                                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                            {navItems.find(i => i.id === currentSection)?.label}
                                            <span className="text-muted-foreground/30 font-light text-xl">|</span>
                                            <span className="text-base text-muted-foreground font-medium">{obra.endereco || 'Local não informado'}</span>
                                        </h1>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="rounded-xl font-bold uppercase text-[10px] tracking-widest">
                                            <FileText size={14} className="mr-2" /> Relatório
                                        </Button>
                                        {currentSection === 'engineering' && (
                                            <Button size="sm" className="rounded-xl font-bold uppercase text-[10px] tracking-widest bg-primary text-primary-foreground">
                                                <Activity size={14} className="mr-2" /> Diário de Obra
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {currentSection === 'overview' && <OverviewTab obra={obra} />}
                                {currentSection === 'engineering' && <EngineeringTab obra={obra} />}
                                {currentSection === 'projects' && <ProjectsTab obra={obra} />}
                                {currentSection === 'people' && <PeopleTab obra={obra} />}
                                {currentSection === 'purchases' && <PurchasesTab obra={obra} />}
                                {currentSection === 'financial' && <FinancialTab obra={obra} />}
                                {currentSection === 'logistics' && <LogisticsTab obra={obra} />}
                                {currentSection === 'documents' && <DocumentsTab obra={obra} />}
                                {currentSection === 'field' && <FieldDiaryTab obra={obra} />}
                                {currentSection === 'settings' && <SettingsTab obra={obra} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components (Tabs) - Retained Logic, Updated Styles for new container context
function OverviewTab({ obra }: { obra: Project }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Avanço Físico" value="0%" icon={Activity} color="text-primary" />
            <StatCard label="Avanço Projetos" value="12%" icon={Layers} color="text-amber-500" />
            <StatCard label="Orçamento Consumido" value="R$ 0" icon={DollarSign} color="text-emerald-500" />
            <StatCard label="Segurança (EPI/NR)" value="OK" icon={ShieldCheck} color="text-blue-500" />

            <Card className="lg:col-span-3 rounded-2xl border-white/5 bg-background/60 backdrop-blur-xl p-8 min-h-[400px]">
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
                <Card className="lg:col-span-2 rounded-2xl border-white/5 bg-background/60 backdrop-blur-xl p-8">
                    <h3 className="text-xl font-black uppercase mb-6">Fases da Obra</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {['Pré-Obra', 'Mobilização', 'Estrutura', 'Alvenaria', 'Instalações', 'Acabamento'].map((fase, i) => (
                            <div key={fase} className="flex-1 min-w-[150px] p-6 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center gap-3 text-center">
                                <Badge className="bg-muted text-muted-foreground border-none text-[8px] font-black uppercase">{i + 1}</Badge>
                                <span className="font-black text-xs uppercase tracking-widest">{fase}</span>
                                <div className="h-1 w-full bg-white/10 rounded-full mt-2" />
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="rounded-2xl border-white/5 bg-background/60 backdrop-blur-xl p-8">
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
            <Card className="rounded-2xl border-white/5 bg-background/60 backdrop-blur-xl p-8">
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
            <Card className="lg:col-span-8 rounded-2xl border-white/5 bg-background/60 backdrop-blur-xl p-8">
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
            <Card className="lg:col-span-4 rounded-2xl border-white/10 bg-primary/5 p-8 border-dashed border-2">
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

import { NewRequisitionModal } from '../shared/NewRequisitionModal';
import { DepartmentRequests } from '../shared/DepartmentRequests';

function PurchasesTab({ obra }: { obra: Project }) {
    const [isReqModalOpen, setIsReqModalOpen] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Requisições da Obra</h3>
                    <p className="text-sm text-muted-foreground font-medium">Itens solicitados especificamente para este centro de custo.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2">
                        <Package size={14} /> Ver Estoque Local
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setIsReqModalOpen(true)}
                        className="rounded-xl font-bold uppercase text-[10px] tracking-widest bg-primary text-primary-foreground gap-2"
                    >
                        <Plus size={14} /> Nova Requisição
                    </Button>
                </div>
            </div>

            {/* We reuse the DepartmentRequests component but ideally filtered by Project context */}
            {/* For now, it shows department wide, but in V2 needs projectId filter prop */}
            <DepartmentRequests department="COMPRAS" />

            <NewRequisitionModal
                isOpen={isReqModalOpen}
                onClose={() => setIsReqModalOpen(false)}
                projectId={obra.id}
            />
        </div>
    );
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
        <Card className="rounded-xl border-white/5 bg-background/60 backdrop-blur-xl p-8 flex flex-col gap-4">
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
        <Card className="rounded-[2rem] border-white/5 bg-background/60 backdrop-blur-xl p-6">
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
            <div className="min-h-[200px] rounded-xl bg-white/5 border border-dashed border-white/5 flex items-center justify-center p-6 text-center">
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
