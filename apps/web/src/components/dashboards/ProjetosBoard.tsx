"use client"

import React, { useState } from 'react';
import {
    Layers,
    LayoutGrid,
    List,
    Calendar,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    ChevronRight,
    Clock,
    User,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    FileText,
    History,
    MessageSquare,
    FolderOpen,
    Send,
    ArrowLeftCircle,
    Building2,
    Users as UsersIcon,
    Zap as ZapIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';

// Types
type ViewMode = 'portfolio' | 'geral' | 'kanban' | 'list' | 'calendar';

interface Discipline {
    id: string;
    title: string;
    category: 'Arquitetura' | 'Estrutural' | 'Elétrico' | 'Hidrossanitário' | 'HVAC' | 'Legal';
    status: 'backlog' | 'development' | 'review' | 'submitted' | 'approved' | 'ajustes';
    responsible: string;
    deadline: string;
    progress: number;
    versions: number;
    revisions: number;
}

const CATEGORY_COLORS = {
    'Arquitetura': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Estrutural': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    'Elétrico': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Hidrossanitário': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    'HVAC': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    'Legal': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

// Mock Data
const MOCK_DISCIPLINES: Discipline[] = [
    { id: '1', title: 'Arq. Executivo - Pavimento Tipo', category: 'Arquitetura', status: 'development', responsible: 'Ricardo M.', deadline: '15 Fev', progress: 65, versions: 2, revisions: 1 },
    { id: '2', title: 'Cálculo Estrutural - Fundações', category: 'Estrutural', status: 'review', responsible: 'Ana Paula', deadline: '10 Fev', progress: 90, versions: 3, revisions: 2 },
    { id: '3', title: 'Diagrama Unifilar - QGBT', category: 'Elétrico', status: 'backlog', responsible: 'Carlos E.', deadline: '22 Mar', progress: 0, versions: 0, revisions: 0 },
    { id: '4', title: 'Prumadas de Esgoto', category: 'Hidrossanitário', status: 'submitted', responsible: 'Felipe S.', deadline: '28 Jan', progress: 100, versions: 4, revisions: 3 },
    { id: '5', title: 'Memorial Descritivo Legal', category: 'Legal', status: 'approved', responsible: 'Juliana L.', deadline: '20 Jan', progress: 100, versions: 1, revisions: 0 },
    { id: '6', title: 'Carga Térmica - Salas Técnicas', category: 'HVAC', status: 'ajustes', responsible: 'Marcos V.', deadline: '05 Fev', progress: 85, versions: 2, revisions: 4 },
];

export function ProjetosBoard() {
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('portfolio');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDiscipline, setSelectedDiscipline] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any; type?: any }>({
        isOpen: false,
        title: "",
        type: "none"
    });

    const openPlaceholder = (title: string, icon?: any, type: any = "none") => {
        setModalConfig({ isOpen: true, title, icon, type });
    };

    const handleProjectSelect = (name: string) => {
        setSelectedProject(name);
        setViewMode('geral');
    };

    const openDetail = (discipline: any) => {
        setSelectedDiscipline(discipline);
        setIsDetailOpen(true);
    };

    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-24">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest uppercase">Central de Disciplinas</Badge>
                        {selectedProject && (
                            <>
                                <span className="text-muted-foreground/40 font-black">•</span>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">65% Concluído</span>
                            </>
                        )}
                    </div>
                    {selectedProject ? (
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => setViewMode('portfolio')} className="rounded-xl hover:bg-white/5 h-10 w-10">
                                <ArrowLeftCircle size={24} />
                            </Button>
                            <HeaderAnimated title={selectedProject} />
                        </div>
                    ) : (
                        <HeaderAnimated title="Portfólio de Projetos" />
                    )}
                </div>

                {selectedProject && (
                    <div className="flex items-center gap-3 bg-muted/20 p-1.5 rounded-[2rem] border border-border/40 backdrop-blur-md shadow-inner">
                        <ViewToggle active={viewMode === 'geral'} onClick={() => setViewMode('geral')} icon={Layers} label="Geral" />
                        <ViewToggle active={viewMode === 'kanban'} onClick={() => setViewMode('kanban')} icon={LayoutGrid} label="Board" />
                        <ViewToggle active={viewMode === 'list'} onClick={() => setViewMode('list')} icon={List} label="Lista" />
                    </div>
                )}
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Buscar disciplina, responsável..."
                        className="pl-12 h-12 rounded-2xl border-border/40 bg-background/50 text-sm font-medium shadow-inner focus-visible:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none rounded-2xl h-12 gap-2 font-black px-6 border-border/40 uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">
                        <Filter size={18} /> Filtros
                    </Button>
                    <Button onClick={() => openPlaceholder("Nova Disciplina Técnica", Plus, "projeto")} className="flex-1 md:flex-none rounded-2xl h-12 gap-2 font-black px-6 uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                        <Plus size={18} /> Nova Disciplina
                    </Button>
                </div>
            </div>

            {/* Board Content */}
            <AnimatePresence mode="wait">
                {viewMode === 'portfolio' ? (
                    <motion.div key="portfolio" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                        <ProjectPortfolioView onSelect={handleProjectSelect} openPlaceholder={openPlaceholder} />
                    </motion.div>
                ) : viewMode === 'geral' ? (
                    <motion.div key="geral" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                        <GeralProjectView />
                    </motion.div>
                ) : viewMode === 'kanban' ? (
                    <motion.div
                        key="kanban"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-6 overflow-x-auto pb-6 no-scrollbar min-h-[600px]"
                    >
                        <KanbanColumn onSelect={openDetail} title="Não Iniciado" status="backlog" disciplines={MOCK_DISCIPLINES.filter(d => d.status === 'backlog')} />
                        <KanbanColumn onSelect={openDetail} title="Em Desenvolvimento" status="development" disciplines={MOCK_DISCIPLINES.filter(d => d.status === 'development')} />
                        <KanbanColumn onSelect={openDetail} title="Em Revisão Interna" status="review" disciplines={MOCK_DISCIPLINES.filter(d => d.status === 'review')} />
                        <KanbanColumn onSelect={openDetail} title="Enviado ao Cliente" status="submitted" disciplines={MOCK_DISCIPLINES.filter(d => d.status === 'submitted')} />
                        <KanbanColumn onSelect={openDetail} title="Aprovado" status="approved" disciplines={MOCK_DISCIPLINES.filter(d => d.status === 'approved')} />
                        <KanbanColumn onSelect={openDetail} title="Ajustes Pendentes" status="ajustes" disciplines={MOCK_DISCIPLINES.filter(d => d.status === 'ajustes')} />
                    </motion.div>
                ) : viewMode === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-background/40 backdrop-blur-xl rounded-[2.5rem] border border-border/40 overflow-hidden shadow-2xl"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border/40 bg-muted/30">
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 w-[40%]">Disciplina</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Responsável</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Prazo</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Status</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Versão</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_DISCIPLINES.map((d) => (
                                        <tr key={d.id}
                                            onClick={() => openDetail(d)}
                                            className="border-b border-border/20 hover:bg-white/5 transition-colors group cursor-pointer"
                                        >
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("w-1.5 h-10 rounded-full", CATEGORY_COLORS[d.category].split(' ')[0].replace('bg-', 'bg-').replace('/10', ''))} />
                                                    <div>
                                                        <p className="font-black text-sm tracking-tight group-hover:text-primary transition-colors">{d.title}</p>
                                                        <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-tighter mt-1 px-1.5 py-0 border-none", CATEGORY_COLORS[d.category])}>
                                                            {d.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary">
                                                        {d.responsible.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-muted-foreground">{d.responsible}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="text-[11px] font-black text-muted-foreground flex items-center gap-1.5">
                                                    <Clock size={12} className="text-primary/60" /> {d.deadline}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <Badge className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border-none",
                                                    d.status === 'approved' ? "bg-emerald-500/10 text-emerald-500" :
                                                        d.status === 'development' ? "bg-blue-500/10 text-blue-500" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {d.status}
                                                </Badge>
                                            </td>
                                            <td className="p-6 text-[11px] font-black text-muted-foreground">v{d.versions}</td>
                                            <td className="p-6 text-right">
                                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                                                    <ChevronRight size={18} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="gantt"
                        className="h-[400px] flex items-center justify-center bg-background/40 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-border/40"
                    >
                        <div className="text-center">
                            <Calendar size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                            <p className="font-black text-sm uppercase tracking-widest text-muted-foreground/60">Gantt Simplificado em Definição</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            <PlaceholderModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                icon={modalConfig.icon}
                type={modalConfig.type}
            />
        </div>
    );
}

// Sub-components
function ViewToggle({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-[1.5rem] transition-all text-[10px] font-black uppercase tracking-widest",
                active
                    ? "bg-background text-primary shadow-lg ring-1 ring-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
        >
            <Icon size={14} className={active ? "animate-pulse" : ""} />
            {label}
        </button>
    );
}

function KanbanColumn({ title, status, disciplines, onSelect }: { title: string, status: string, disciplines: Discipline[], onSelect: (d: any) => void }) {
    return (
        <div className="flex-shrink-0 w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">{title}</h3>
                    <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-none text-[10px] h-5 min-w-[20px] px-1 font-black flex items-center justify-center">
                        {disciplines.length}
                    </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full opacity-40 hover:opacity-100">
                    <MoreHorizontal size={14} />
                </Button>
            </div>

            <div className="flex-1 space-y-4">
                {disciplines.map((d) => (
                    <KanbanCard key={d.id} d={d} onClick={() => onSelect(d)} />
                ))}
            </div>
        </div>
    );
}

function KanbanCard({ d, onClick }: { d: Discipline, onClick: () => void }) {
    return (
        <Card
            onClick={onClick}
            className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all group overflow-hidden cursor-pointer active:cursor-grabbing"
        >
            <CardContent className="p-6 space-y-5">
                <div className="flex justify-between items-start">
                    <Badge className={cn("text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 border-none", CATEGORY_COLORS[d.category])}>
                        {d.category}
                    </Badge>
                    <DisciplineActions />
                </div>

                <div>
                    <h4 className="font-black text-sm tracking-tight leading-tight group-hover:text-primary transition-colors">{d.title}</h4>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground/60 uppercase">
                            <User size={10} /> {d.responsible}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground/60 uppercase">
                            <Clock size={10} /> {d.deadline}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                        <span>Progresso</span>
                        <span>{d.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${d.progress}%` }}
                            className={cn(
                                "h-full rounded-full transition-all",
                                d.progress === 100 ? "bg-emerald-500" : "bg-primary"
                            )}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/20">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[9px] font-black text-muted-foreground/60">
                            <FileText size={10} /> v{d.versions}
                        </div>
                        <div className="flex items-center gap-1 text-[9px] font-black text-muted-foreground/60">
                            <History size={10} /> {d.revisions} rev.
                        </div>
                    </div>
                    <div className="flex -space-x-1.5">
                        {[1, 2].map(i => (
                            <div key={i} className="w-5 h-5 rounded-full bg-muted border border-background flex items-center justify-center text-[7px] font-black uppercase ring-2 ring-background">
                                {i === 1 ? 'RM' : 'AP'}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function DisciplineActions() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-40 hover:opacity-100 hover:bg-white/10 transition-all">
                    <MoreHorizontal size={14} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] bg-background/80 backdrop-blur-xl border-border/40 p-2 shadow-2xl">
                <DropdownMenuItem className="rounded-xl flex items-center gap-3 p-3 font-bold text-xs cursor-pointer group">
                    <FolderOpen size={16} className="text-muted-foreground group-hover:text-primary transition-colors" /> Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl flex items-center gap-3 p-3 font-bold text-xs cursor-pointer group">
                    <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" /> Abrir Pasta
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5 mx-2" />
                <DropdownMenuItem className="rounded-xl flex items-center gap-3 p-3 font-bold text-xs cursor-pointer group">
                    <Plus size={16} className="text-muted-foreground group-hover:text-primary transition-colors" /> Nova Revisão
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl flex items-center gap-3 p-3 font-bold text-xs cursor-pointer group">
                    <Send size={16} className="text-muted-foreground group-hover:text-primary transition-colors" /> Enviar p/ Aprovação
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl flex items-center gap-3 p-3 font-bold text-xs cursor-pointer group text-rose-500">
                    <AlertCircle size={16} /> Criar Tarefa de Ajuste
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function GeralProjectView() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Visual Progress Card */}
                <Card className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl p-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
                    <div className="relative z-10 grid md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Physical Execution</h3>
                                <p className="text-5xl font-black tracking-tighter">65.4%</p>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: 'Fundação', progress: 100 },
                                    { label: 'Estrutura Pav. Tipo', progress: 45 },
                                    { label: 'Alvenaria', progress: 10 },
                                ].map(item => (
                                    <div key={item.label} className="space-y-1.5">
                                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                                            <span>{item.label}</span>
                                            <span>{item.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} className="h-full bg-primary rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center border-l border-border/20 pl-10 space-y-6">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-2">Financial Health</h3>
                                <p className="text-3xl font-black tracking-tight">R$ 1.8M / <span className="text-muted-foreground/40 text-lg">R$ 4.2M</span></p>
                            </div>
                            <Badge variant="outline" className="w-fit rounded-xl border-emerald-500/20 bg-emerald-500/5 text-emerald-600 font-black uppercase text-[10px] px-4 py-2">
                                +12% Efficiency vs Budget
                            </Badge>
                        </div>
                    </div>
                </Card>

                {/* Main Pending Issues (Linked to Triagem concept) */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Triagem do Projeto · Crucial</h3>
                    <div className="grid gap-4">
                        {[
                            { title: 'Revisão de Carga Elétrica - Subestação', urgency: 'CRÍTICA', dept: 'Engenharia' },
                            { title: 'Aprovação de Materiais Louças & Metais', urgency: 'ALTA', dept: 'Suprimentos' },
                        ].map((issue, i) => (
                            <Card key={i} className="rounded-[2rem] border-border/40 bg-background/60 p-6 hover:border-primary/20 transition-all cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><AlertCircle size={20} /></div>
                                        <div>
                                            <p className="font-black text-sm tracking-tight group-hover:text-primary transition-colors">{issue.title}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">{issue.dept}</p>
                                        </div>
                                    </div>
                                    <Badge className={cn("text-[9px] font-black uppercase tracking-widest", issue.urgency === 'CRÍTICA' ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary")}>
                                        {issue.urgency}
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Team Alocation */}
                <Card className="rounded-[2.5rem] border-border/40 bg-background/60 p-8 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-6">Equipe Alocada</h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Ana Carolina', role: 'Gestora de Projetos', initial: 'AC' },
                            { name: 'Ricardo Mendes', role: 'Engenheiro Calculista', initial: 'RM' },
                            { name: 'Felipe Soares', role: 'Instalações', initial: 'FS' },
                        ].map((person) => (
                            <div key={person.name} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-black text-primary border border-primary/20">
                                    {person.initial}
                                </div>
                                <div>
                                    <p className="text-sm font-black">{person.name}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{person.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-8 rounded-xl h-10 text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary">
                        Gerenciar Alocação <ChevronRight size={14} className="ml-2" />
                    </Button>
                </Card>

                {/* Timeline and Quick Milestones */}
                <Card className="rounded-[2.5rem] border-border/40 bg-indigo-600 text-white p-8 shadow-indigo-500/20 shadow-xl relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Próxima Entrega</h3>
                    <div className="space-y-1">
                        <p className="text-2xl font-black tracking-tight leading-none">Entrega Final Estrutural</p>
                        <p className="text-xs font-bold opacity-60">15 de Fevereiro de 2026</p>
                    </div>
                    <div className="mt-10 flex items-center gap-2">
                        <Clock size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Faltam 12 dias</span>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function ProjectPortfolioView({ onSelect, openPlaceholder }: { onSelect: (name: string) => void, openPlaceholder: any }) {
    const activeWorks = [
        { name: 'Edifício Infinity Coast', location: 'Baln. Camboriú, SC', progress: 85, health: 'success', category: 'Residencial', team: 12 },
        { name: 'Residencial Sky Tower', location: 'Itapema, SC', progress: 42, health: 'warning', category: 'Residencial', team: 8 },
        { name: 'Galpão Industrial Alpha', location: 'Joinville, SC', progress: 95, health: 'success', category: 'Industrial', team: 5 },
        { name: 'Edifício Corporate One', location: 'Florianópolis, SC', progress: 15, health: 'neutral', category: 'Comercial', team: 15 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeWorks.map((work) => (
                <Card
                    key={work.name}
                    onClick={() => onSelect(work.name)}
                    className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all group overflow-hidden cursor-pointer"
                >
                    <div className="h-2 w-full bg-muted/20">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${work.progress}%` }}
                            className={cn(
                                "h-full",
                                work.health === 'success' ? "bg-emerald-500" : work.health === 'warning' ? "bg-amber-500" : "bg-primary"
                            )}
                        />
                    </div>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20 text-primary px-3">{work.category}</Badge>
                            <Badge className={cn("text-[9px] font-black uppercase", work.health === 'success' ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary")}>
                                {work.health}
                            </Badge>
                        </div>

                        <div>
                            <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors leading-tight">{work.name}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-2 flex items-center gap-2">
                                <Building2 size={12} className="opacity-40" /> {work.location}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-border/20">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground/60">
                                    <UsersIcon size={14} /> {work.team} Alocados
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary">
                                    {work.progress}% Completo
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* "New Project" card removed to enforce Commercial-only Work creation flow */}
            <Card
                className="rounded-[2.5rem] border-dashed border-border/40 bg-muted/5 flex flex-col items-center justify-center p-10 text-center opacity-50 cursor-not-allowed"
            >
                <div className="w-16 h-16 rounded-[2rem] bg-background border border-border/40 flex items-center justify-center text-muted-foreground/40 mb-6">
                    <Building2 size={32} />
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground/60">Aguardando Novas Obras</h3>
                <p className="text-[10px] font-medium text-muted-foreground/40 mt-2">Novos projetos aparecem aqui após aprovação comercial</p>
            </Card>
        </div>
    );
}

export default ProjetosBoard;
