"use client"

import React, { useState } from 'react';
import {
    Hammer,
    ShieldCheck,
    FileText,
    Plus,
    Search,
    Settings2,
    ChevronRight,
    Zap,
    ClipboardCheck,
    Building2,
    Layers,
    MapPin,
    Droplets,
    Wind,
    ShieldAlert,
    Paintbrush,
    CheckCircle2,
    Clock,
    AlertCircle,
    ShoppingCart,
    AlertTriangle,
    Wrench,
    Expand,
    MoreHorizontal,
    Maximize2,
    Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab, Project } from '@/types';
import { ReusableKanbanBoard } from '@/components/tasks/ReusableKanbanBoard';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';
import { useAppFlow } from '@/store/useAppFlow';
import { EngenhariaRequests } from './EngenhariaRequests';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

// Standardized Disciplines Taxonomy (Based on Market Standards & User Input)
const STANDARD_DISCIPLINES = [
    { code: 'PROJ-ARQ', label: 'Arquitetura & Urbanismo', description: 'Executivo, Detalhamento, Legal', icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { code: 'PROJ-EST', label: 'Estrutura & Fundações', description: 'Concreto, Metálica, Contenções', icon: Layers, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { code: 'PROJ-HID', label: 'Instalações Hidrossanitárias', description: 'Água Fria/Quente, Esgoto, Pluvial', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { code: 'PROJ-ELE', label: 'Instalações Elétricas', description: 'Baixa Tensão, Lógica, SPDA', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { code: 'PROJ-CLI', label: 'Climatização & Exaustão', description: 'HVAC, VRF, Exaustão Mecânica', icon: Wind, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { code: 'PROJ-INC', label: 'Prevenção de Incêndio', description: 'Hidrantes, Sprinklers, Detecção', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
    { code: 'PROJ-LEG', label: 'Legalização & Licenças', description: 'Prefeitura, Bombeiros, Ambiental', icon: FileText, color: 'text-slate-500', bg: 'bg-slate-500/10' },
];

export function EngenhariaDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null); // For Fullscreen Detail Mode
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any }>({
        isOpen: false,
        title: "",
    });
    const [movimentacaoModalOpen, setMovimentacaoModalOpen] = useState(false);

    const { projects, getRequestsForDepartment } = useAppFlow();
    const requestsCount = getRequestsForDepartment('ENGENHARIA').length;

    // Derived stats
    const activeProjectsCount = projects.filter(p => p.status === 'ATIVA' || p.status === 'PLANEJAMENTO').length;

    // Quick Actions
    const quickActions = [
        { id: 'compra', label: 'Solicitar Compra', icon: ShoppingCart, color: 'text-blue-500' },
        { id: 'servico', label: 'Novo Serviço', icon: Wrench, color: 'text-green-500' },
        { id: 'alerta', label: 'Registrar Alerta', icon: AlertTriangle, color: 'text-amber-500' },
        { id: 'rdo', label: 'RDO - Diário', icon: FileText, color: 'text-purple-500' },
    ];

    const openPlaceholder = (title: string, icon?: any) => {
        setModalConfig({ isOpen: true, title, icon });
        setMovimentacaoModalOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background to-secondary/5 overflow-hidden font-sans pb-32">
            {/* Header - Unified Control Room Style */}
            <div className="pt-8 px-8 pb-4 shrink-0 flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div>
                        <HeaderAnimated title="Engenharia Central" />
                        <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-2">
                            Controle Técnico • Gestão de Obras • Matriz de Projetos
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Quick Access Toolbar */}
                        <div className="flex bg-background border border-border/40  rounded-xl p-1 shadow-sm">
                            {quickActions.map(action => (
                                <Button
                                    key={action.id}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted"
                                    onClick={() => openPlaceholder(action.label, action.icon)}
                                    title={action.label}
                                >
                                    <action.icon size={16} className={action.color} />
                                </Button>
                            ))}
                        </div>

                        <Button
                            onClick={() => setMovimentacaoModalOpen(true)}
                            className="h-10 rounded-xl font-black uppercase tracking-widest text-[10px] px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                        >
                            <Plus size={16} className="mr-2" /> Movimentação
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Unified Grid Content */}
            <div className="flex-1 overflow-y-auto p-8 pt-2 scrollbar-thin">
                <div className="grid grid-cols-12 gap-6 h-full min-h-[800px]">

                    {/* LEFT COLUMN: Project List & Status (4 cols) */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                        {/* Status Summary */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="rounded-2xl p-4 bg-background border-border/40">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Obras Ativas</div>
                                <div className="text-2xl font-black flex items-center gap-2">
                                    {activeProjectsCount} <span className="text-emerald-500 text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full">+2</span>
                                </div>
                            </Card>
                            <Card className="rounded-2xl p-4 bg-background border-border/40">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-2">
                                    Pendências {requestsCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                                </div>
                                <div className="text-2xl font-black text-amber-500">{requestsCount}</div>
                            </Card>
                        </div>

                        {/* Projects List with Expansion Logic */}
                        <Card className="flex-1 rounded-3xl border-border/40 bg-background/50 backdrop-blur-sm overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-border/40 flex justify-between items-center stick top-0 bg-background/80 backdrop-blur z-10">
                                <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                    <Building2 size={16} className="text-primary" /> Obras em Gestão
                                </h3>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Search size={14} /></Button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {projects.map(project => (
                                    <div
                                        key={project.id}
                                        onClick={() => setSelectedProject(project)}
                                        className={cn(
                                            "group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                                            selectedProject?.id === project.id
                                                ? "bg-primary/5 border-primary/40 shadow-md"
                                                : "bg-background border-border/40 hover:border-primary/20 hover:shadow-lg"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-background/50 backdrop-blur">{project.status}</Badge>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Maximize2 size={14} />
                                            </Button>
                                        </div>
                                        <h4 className="font-black text-sm tracking-tight mb-1">{project.nome}</h4>
                                        <p className="text-[10px] text-muted-foreground line-clamp-1 flex items-center gap-1">
                                            <MapPin size={10} /> {project.endereco || "Sem endereço"}
                                        </p>

                                        {/* Mini progress bars for critical disciplines */}
                                        <div className="mt-4 grid grid-cols-4 gap-1">
                                            {['ARQ', 'EST', 'HID', 'ELE'].map((d, i) => (
                                                <div key={d} className="h-1 rounded-full bg-muted overflow-hidden">
                                                    <div className="h-full bg-primary/60" style={{ width: `${Math.random() * 100}%` }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* CENTER/RIGHT: Context Aware Activity Center (8 cols) */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full overflow-hidden">

                        {/* Context Header */}
                        <div className="flex gap-4 items-center">
                            {selectedProject ? (
                                <div className="flex items-center justify-between w-full bg-background/50 border border-border/40 rounded-2xl p-4 backdrop-blur-md">
                                    <div className="flex items-center gap-4">
                                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl" onClick={() => setSelectedProject(null)}>
                                            <ChevronRight className="rotate-180" size={18} />
                                        </Button>
                                        <div>
                                            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                                                {selectedProject.nome}
                                                <Badge className="bg-primary text-white border-none">EM GESTÃO</Badge>
                                            </h2>
                                            <p className="text-xs text-muted-foreground mt-0.5">Painel de Controle da Obra • {selectedProject.tipoObra || selectedProject.constructionType} • {selectedProject.area || selectedProject.areaConstruida}m²</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                                            <FileText size={14} /> RDO
                                        </Button>
                                        <Button variant="outline" className="h-9 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                                            <ShoppingCart size={14} /> Solicitações
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full p-4 rounded-2xl border border-dashed border-border/40 bg-muted/5 flex items-center justify-center text-muted-foreground text-sm font-medium">
                                    Selecione uma obra ao lado para ver detalhes e gerenciar disciplinas
                                </div>
                            )}
                        </div>

                        {selectedProject ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto pr-2 pb-20">
                                {/* Disciplines Matrix for Selected Project */}
                                <div className="space-y-4">
                                    <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 sticky top-0 bg-transparent z-10 mb-2">
                                        <Layers size={16} className="text-primary" /> Matriz de Disciplinas
                                    </h3>
                                    {STANDARD_DISCIPLINES.map((disc, idx) => (
                                        <Card key={disc.code} className="group rounded-2xl border-border/40 hover:border-primary/20 transition-all overflow-hidden cursor-pointer bg-background">
                                            <div className="flex items-stretch">
                                                <div className={cn("w-2", disc.bg.replace('/10', ''))} />
                                                <div className="p-4 flex-1 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", disc.bg, disc.color)}>
                                                            <disc.icon size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-black text-sm">{disc.label}</h4>
                                                                <Badge variant="outline" className="text-[9px] h-5 px-1.5 font-mono text-muted-foreground">{disc.code}</Badge>
                                                            </div>
                                                            <p className="text-[10px] text-muted-foreground mt-0.5">{disc.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right hidden sm:block">
                                                            <div className="text-[10px] font-black uppercase text-muted-foreground">Status</div>
                                                            <div className="text-xs font-bold text-primary">EM ANDAMENTO</div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors">
                                                            <ChevronRight size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Expandable Action Area (Visible on hover/click in real app, simplified here) */}
                                        </Card>
                                    ))}
                                </div>

                                {/* Right Side: Activities & Requests */}
                                <div className="space-y-6">
                                    {/* Requests */}
                                    <div>
                                        <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-4">
                                            <AlertCircle size={16} className="text-amber-500" /> Solicitações Pendentes
                                        </h3>
                                        {requestsCount > 0 ? (
                                            <EngenhariaRequests />
                                        ) : (
                                            <div className="p-8 rounded-2xl bg-muted/5 border border-dashed border-border/40 flex flex-col items-center justify-center text-center">
                                                <CheckCircle2 size={32} className="text-emerald-500 mb-2 opacity-50" />
                                                <p className="text-sm font-medium text-muted-foreground">Tudo em dia nesta obra</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Recent Activities / Timeline */}
                                    <Card className="rounded-3xl border-border/40 p-6 bg-background">
                                        <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-6">
                                            <Clock size={16} className="text-blue-500" /> Linha do Tempo
                                        </h3>
                                        <div className="space-y-6 relative pl-2">
                                            <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-border/40" />
                                            {[
                                                { title: 'Revisão de Projeto Elétrico', user: 'Eng. Carlos', time: 'Há 2 horas', type: 'REV' },
                                                { title: 'Aprovação Orçamento Hidráulica', user: 'Fin. Ana', time: 'Ontem', type: 'APR' },
                                                { title: 'RDO #45 Enviado', user: 'Mestre Silva', time: 'Ontem', type: 'RDO' }
                                            ].map((log, i) => (
                                                <div key={i} className="flex gap-4 relative">
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 relative z-10 mt-1.5 ring-4 ring-background" />
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">{log.title}</p>
                                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">{log.user} • {log.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        ) : (
                            // Global Overview / Department Control Room
                            <div className="h-full space-y-6 overflow-y-auto pr-2">
                                {/* Department KPIs */}
                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        { label: 'Orçamentos p/ Análise', value: '3', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                        { label: 'Requisições Abertas', value: '12', icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                        { label: 'Equipe em Campo', value: '45', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                        { label: 'RDOs Pendentes', value: '2', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
                                    ].map((stat, i) => (
                                        <Card key={i} className="p-4 bg-background border-border/40 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                                <p className="text-2xl font-black mt-1">{stat.value}</p>
                                            </div>
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                                                <stat.icon size={20} />
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {/* Incoming Work: Budgets to Validate */}
                                <Card className="p-0 overflow-hidden border-border/40 bg-background">
                                    <div className="p-5 border-b border-border/40 flex justify-between items-center bg-muted/5">
                                        <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                            <Zap size={16} className="text-amber-500" /> Entrada: Validações do Comercial
                                        </h3>
                                        <Badge variant="outline" className="border-amber-500/20 text-amber-600 bg-amber-500/5">3 Pendentes</Badge>
                                    </div>
                                    <div className="divide-y divide-border/40">
                                        {[
                                            { client: 'Novo Centro Médico', value: 'R$ 1.2M', date: 'Hoje', status: 'Aguardando Análise' },
                                            { client: 'Residencial Vida Nova', value: 'R$ 450k', date: 'Ontem', status: 'Em Revisão' },
                                            { client: 'Galpão Logístico Sul', value: 'R$ 3.5M', date: '2 dias', status: 'Urgente' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors group cursor-pointer" onClick={() => openPlaceholder(`Validar Orçamento: ${item.client}`, FileText)}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold text-xs">
                                                        {item.client.substring(0, 1)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-foreground">{item.client}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Orçamento Base • {item.value}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge variant="secondary" className="text-[9px] font-bold">{item.date}</Badge>
                                                    <Button size="sm" variant="ghost" className="h-8 text-[10px] font-black uppercase text-primary group-hover:bg-primary/10">
                                                        Validar Escopo <ChevronRight size={14} className="ml-1" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Outgoing: Requests to Purchasing */}
                                    <Card className="p-0 overflow-hidden border-border/40 bg-background">
                                        <div className="p-5 border-b border-border/40 flex justify-between items-center bg-muted/5">
                                            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                                <ShoppingCart size={16} className="text-blue-500" /> Saída: Suprimentos
                                            </h3>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {[
                                                { item: 'Cimento CP-II (500 sc)', obra: 'Residencial Sky', status: 'Em Cotação' },
                                                { item: 'Aço CA-50 10mm', obra: 'Galpão Alpha', status: 'Autorizado' },
                                            ].map((req, i) => (
                                                <div key={i} className="flex justify-between items-center text-xs border-b border-border/20 last:border-0 pb-2 last:pb-0">
                                                    <div>
                                                        <p className="font-bold">{req.item}</p>
                                                        <p className="text-[10px] text-muted-foreground">{req.obra}</p>
                                                    </div>
                                                    <Badge variant="outline" className="text-[9px]">{req.status}</Badge>
                                                </div>
                                            ))}
                                            <Button variant="outline" size="sm" className="w-full text-[10px] font-black uppercase h-8 mt-2">Ver Todas</Button>
                                        </div>
                                    </Card>

                                    {/* Critical Alerts */}
                                    <Card className="p-0 overflow-hidden border-red-500/20 bg-red-500/5">
                                        <div className="p-5 border-b border-red-500/10 flex justify-between items-center">
                                            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 text-red-600">
                                                <AlertTriangle size={16} /> Bloqueios de Segurança
                                            </h3>
                                        </div>
                                        <div className="p-4 text-center">
                                            <p className="text-2xl font-black text-red-600 mb-1">0</p>
                                            <p className="text-xs text-muted-foreground font-medium">Nenhuma obra bloqueada pelo SST</p>
                                            <div className="mt-4 flex gap-2 justify-center">
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase">Compliance 100%</span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Nova Movimentação Modal */}
            <Dialog open={movimentacaoModalOpen} onOpenChange={setMovimentacaoModalOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-0 overflow-hidden bg-background">
                    <div className="p-8 border-b border-border/10 bg-muted/5">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight">Nova Movimentação</DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground mt-1.5 font-medium">
                                Selecione o tipo de registro que deseja realizar para a obra selecionada.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="p-8 grid grid-cols-2 gap-4">
                        {quickActions.map((option) => (
                            <button
                                key={option.id}
                                className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all group text-left"
                                onClick={() => openPlaceholder(option.label, option.icon)}
                            >
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm", "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground")}>
                                    <option.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-black uppercase tracking-tight text-foreground">{option.label}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5 group-hover:text-primary/80">Clique para iniciar</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            <PlaceholderModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                icon={modalConfig.icon}
            />
        </div>
    );
}

export default EngenhariaDashboard;
