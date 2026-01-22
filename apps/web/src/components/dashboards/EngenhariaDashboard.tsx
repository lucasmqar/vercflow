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
    LayoutGrid,
    ClipboardCheck,
    Building2,
    Layers,
    ArrowRight,
    MapPin,
    Droplets,
    Wind,
    ShieldAlert,
    Paintbrush,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import { ReusableKanbanBoard } from '@/components/tasks/ReusableKanbanBoard';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';

export function EngenhariaDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    const [viewMode, setViewMode] = useState<'geral' | 'site' | 'atividades'>('geral');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any }>({
        isOpen: false,
        title: "",
    });

    const openPlaceholder = (title: string, icon?: any) => {
        setModalConfig({ isOpen: true, title, icon });
    };

    const disciplines = [
        { code: '1.x', label: 'Estudos & Viabilidade', items: 12, status: '90%', color: 'border-blue-500', icon: MapPin },
        { code: '2.x', label: 'Arquitetura & Design', items: 45, status: '75%', color: 'border-emerald-500', icon: Building2 },
        { code: '3.x', label: 'Engenharia Estrutural', items: 28, status: '40%', color: 'border-amber-500', icon: Layers },
        { code: '4.x', label: 'Instalações Hidrosanitárias', items: 32, status: '20%', color: 'border-cyan-500', icon: Droplets },
        { code: '5.x', label: 'Engenharia Elétrica', items: 40, status: '15%', color: 'border-orange-500', icon: Zap },
        { code: '6.x', label: 'Climatização & HVAC', items: 15, status: '10%', color: 'border-purple-500', icon: Wind },
        { code: '7.x', label: 'Projetos Especiais', items: 8, status: '0%', color: 'border-rose-500', icon: ShieldAlert },
        { code: '8.x', label: 'Acabamentos & Interiores', items: 22, status: '5%', color: 'border-pink-500', icon: Paintbrush },
        { code: '9.x', label: 'Documentação Legal', items: 30, status: '60%', color: 'border-slate-500', icon: FileText },
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background to-secondary/5 overflow-hidden font-sans pb-32">
            {/* Module Header */}
            <div className="p-8 border-b bg-background/95 backdrop-blur-md shrink-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
                    <div>
                        <HeaderAnimated title="Engenharia & Projetos" />
                        <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-2">
                            Coordenação Global de Disciplinas • VERC Intelligence
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex p-1 bg-muted/20 rounded-2xl border border-border/40 backdrop-blur-xl">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('geral')}
                                className={cn(
                                    "rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10 transition-all",
                                    viewMode === 'geral' ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:bg-white/5"
                                )}
                            >
                                Core
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('site')}
                                className={cn(
                                    "rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10 transition-all",
                                    viewMode === 'site' ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:bg-white/5"
                                )}
                            >
                                Diário & Site
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('atividades')}
                                className={cn(
                                    "rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10 transition-all",
                                    viewMode === 'atividades' ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:bg-white/5"
                                )}
                            >
                                Board
                            </Button>
                        </div>
                        <Button
                            onClick={onOpenWizard}
                            className="h-12 rounded-2xl font-black uppercase tracking-widest text-[11px] px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus size={18} className="mr-2" /> Novo Orçamento
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50" />
                        <Input
                            placeholder="Buscar disciplinas, normas técnicas ou RTs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-14 rounded-2xl bg-background/60 border-border/40 text-sm font-bold shadow-sm focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Badge variant="outline" className="h-14 px-8 rounded-2xl border-dashed flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-emerald-500/5 text-emerald-500 border-emerald-500/20">
                            <ShieldCheck size={18} /> Compliance 100%
                        </Badge>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-14 w-14 rounded-2xl border-border/40 hover:bg-white/5"
                            onClick={() => openPlaceholder("Configurações de Engenharia", Settings2)}
                        >
                            <Settings2 size={20} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
                <AnimatePresence mode="wait">
                    {viewMode === 'geral' ? (
                        <motion.div
                            key="geral"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-12"
                        >
                            {/* Dashboard Highlights */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Projetos Ativos', value: '42', icon: Layers, color: 'text-primary', trend: '+12%' },
                                    { label: 'RTs Alocados', value: '15', icon: Building2, color: 'text-blue-500', trend: 'OK' },
                                    { label: 'Pendências VISA', value: '03', icon: Zap, color: 'text-amber-500', trend: 'URGENTE' },
                                    { label: 'Aprovações Hoje', value: '08', icon: CheckCircle2, color: 'text-emerald-500', trend: '+4' },
                                ].map((stat, i) => (
                                    <Card key={i} className="rounded-[2.5rem] border-border/40 bg-background/40 backdrop-blur-xl p-6 shadow-sm border border-white/5 hover:border-white/10 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={cn("p-3 rounded-2xl bg-muted/50", stat.color)}>
                                                <stat.icon size={22} strokeWidth={2.5} />
                                            </div>
                                            <Badge variant="secondary" className="text-[10px] font-black">{stat.trend}</Badge>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-1">{stat.label}</p>
                                        <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                                    </Card>
                                ))}
                            </div>

                            {/* Disciplines Matrix */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight">Matriz de Disciplinas</h3>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Status de projeto e coordenação BIM</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="text-[10px] font-black uppercase tracking-widest gap-2"
                                        onClick={() => openPlaceholder("Mapa Completo de Disciplinas", MapPin)}
                                    >
                                        Ver Mapa Completo <ArrowRight size={14} />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {disciplines.map((d, i) => (
                                        <motion.div
                                            key={d.code}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card
                                                className={cn(
                                                    "group glass-card border-l-4 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer overflow-hidden p-0 rounded-[2.5rem]",
                                                    d.color
                                                )}
                                            >
                                                <CardContent className="p-8">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                                                <d.icon size={24} />
                                                            </div>
                                                            <div>
                                                                <Badge variant="outline" className="font-mono font-black border-primary/20 text-primary bg-primary/5 text-[10px]">{d.code}</Badge>
                                                                <h3 className="font-black text-lg group-hover:text-primary transition-colors leading-tight mt-1">{d.label}</h3>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-end">
                                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pipeline</span>
                                                            <span className="text-[10px] font-black text-primary">{d.status} COMPLETADO</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: d.status }}
                                                                transition={{ duration: 1.5, ease: "circOut", delay: i * 0.1 }}
                                                                className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
                                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                                            <FileText size={14} strokeWidth={2.5} className="text-primary/60" /> {d.items} RTs Ativos
                                                        </div>
                                                        <div className="flex -space-x-3">
                                                            {[1, 2, 3].map(j => (
                                                                <div key={j} className="w-8 h-8 rounded-full bg-secondary border-4 border-background flex items-center justify-center shadow-lg overflow-hidden transition-transform hover:scale-110 hover:z-10">
                                                                    <img src={`https://i.pravatar.cc/100?u=${d.code}${j}`} alt="avatar" className="w-full h-full object-cover grayscale hover:grayscale-0" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Approval Timeline Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl p-8 overflow-hidden relative">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="font-black text-xl flex items-center gap-3"><Clock size={24} className="text-primary" /> Roadmap de Aprovações</h3>
                                        <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black tracking-widest uppercase">REAL-TIME</Badge>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { project: 'Edifício Sky - Estrutural', status: 'Em Análise', time: '2h ago', level: 'warning' },
                                            { project: 'Residencial Park - Hidro', status: 'Aprovado', time: '5h ago', level: 'success' },
                                            { project: 'Galpão Alpha - Elétrico', status: 'Revisão Necessária', time: '1d ago', level: 'destructive' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex gap-4 items-start group">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-background shadow-md",
                                                    item.level === 'success' ? "bg-emerald-500" : item.level === 'warning' ? "bg-amber-500" : "bg-red-500"
                                                )}>
                                                    <CheckCircle2 size={16} className="text-white" />
                                                </div>
                                                <div className="flex-1 pb-6 border-b border-white/5 last:border-0">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-black text-sm tracking-tight">{item.project}</h4>
                                                        <span className="text-[9px] font-bold text-muted-foreground uppercase">{item.time}</span>
                                                    </div>
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">{item.status}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 p-8 flex flex-col justify-center items-center text-center overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Zap size={200} />
                                    </div>
                                    <Badge className="bg-primary text-white border-none font-black text-[10px] tracking-widest uppercase mb-4">VERC INTELLIGENCE AI</Badge>
                                    <h3 className="text-3xl font-black tracking-tight mb-4">Otimização de Fluxo</h3>
                                    <p className="text-muted-foreground text-sm font-medium mb-8 max-w-sm">
                                        Detectamos que as disciplinas de <span className="text-primary font-bold">Hidrossanitário (4.x)</span> estão 15% atrasadas em relação ao cronograma base.
                                    </p>
                                    <Button
                                        className="rounded-2xl h-14 px-8 font-black uppercase text-xs tracking-widest bg-primary shadow-xl shadow-primary/20 gap-3"
                                        onClick={() => openPlaceholder("Ação AI: Acionar Coordenador", Zap)}
                                    >
                                        <Zap size={18} /> Acionar Coordenador
                                    </Button>
                                </Card>
                            </div>
                        </motion.div>
                    ) : viewMode === 'site' ? (
                        <motion.div
                            key="site"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <SiteControlsView openPlaceholder={openPlaceholder} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="atividades"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                            className="h-full min-h-[600px]"
                        >
                            <ReusableKanbanBoard contextFilter="ENG" title="Atividades de Engenharia" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <PlaceholderModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                icon={modalConfig.icon}
            />
        </div>
    );
}

function SiteControlsView({ openPlaceholder }: any) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-black tracking-tight">Diário de Obra (RDO)</h3>
                    <Button variant="outline" className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest gap-2">
                        <Plus size={14} /> Novo Apontamento
                    </Button>
                </div>
                {[
                    { date: 'Hoje', author: 'Eng. Carlos', text: 'Concretagem da laje L04 finalizada. Sem intercorrências.', status: 'ENVIADO' },
                    { date: 'Ontem', author: 'Mestre Silva', text: 'Atraso na entrega de sacos de cimento. Cronograma ajustado.', status: 'REVISADO' },
                ].map((log, i) => (
                    <Card key={i} className="rounded-[2rem] border-border/40 bg-background/60 p-6 hover:shadow-lg transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><FileText size={20} /></div>
                                <div>
                                    <p className="font-black text-sm">{log.author}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{log.date}</p>
                                </div>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase">{log.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{log.text}</p>
                    </Card>
                ))}
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-black tracking-tight ml-2">Ferramentas de Canteiro</h3>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Segurança (EPI)', icon: ShieldCheck, color: 'text-blue-500' },
                        { label: 'Qualidade (FVS)', icon: ClipboardCheck, color: 'text-emerald-500' },
                        { label: 'Ferramentaria', icon: Hammer, color: 'text-amber-500' },
                        { label: 'Checklist Site', icon: ClipboardCheck, color: 'text-purple-500' },
                    ].map((tool) => (
                        <Card
                            key={tool.label}
                            className="rounded-[2rem] border-border/40 bg-background/60 p-6 hover:border-primary/20 transition-all cursor-pointer text-center group"
                            onClick={() => openPlaceholder(tool.label, tool.icon)}
                        >
                            <tool.icon size={28} className={cn("mx-auto mb-4 group-hover:scale-110 transition-transform", tool.color)} />
                            <p className="text-[10px] font-black uppercase tracking-widest">{tool.label}</p>
                        </Card>
                    ))}
                </div>

                <Card className="rounded-[2.5rem] border-dashed border-border/40 bg-muted/5 p-8 text-center mt-6">
                    <Settings2 size={32} className="mx-auto mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Configurações de Fluxo de Campo</p>
                </Card>
            </div>
        </div>
    );
}

export default EngenhariaDashboard;
