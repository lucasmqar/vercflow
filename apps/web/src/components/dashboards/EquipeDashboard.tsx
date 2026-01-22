"use client"

import React, { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    Calendar,
    Briefcase,
    Shield,
    CheckCircle2,
    XCircle,
    Clock,
    MapPin,
    GraduationCap,
    Plus,
    ChevronRight,
    ArrowRightLeft,
    DollarSign,
    Zap,
    LayoutGrid,
    List,
    Camera,
    Activity,
    Building2,
    Target,
    BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { DashboardTab } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReusableKanbanBoard } from '@/components/tasks/ReusableKanbanBoard';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';

export function EquipeDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    const [moduleView, setModuleView] = useState<'geral' | 'atividades'>('geral');
    const [activeTab, setActiveTab] = useState('colaboradores');
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any }>({
        isOpen: false,
        title: "",
    });

    const openPlaceholder = (title: string, icon?: any) => {
        setModalConfig({ isOpen: true, title, icon });
    };

    const colaboradores = [
        { id: 1, nome: "Carlos Oliveira", funcao: "Engenheiro Residente", obra: "Residencial Verc", status: "ATIVO", alocacao: 100 },
        { id: 2, nome: "Ana Paula Silva", funcao: "Arquiteta", obra: "Comercial Hub", status: "ATIVO", alocacao: 80 },
        { id: 3, nome: "Marcos Santos", funcao: "Mestre de Obras", obra: "Park Avenue", status: "FERIAS", alocacao: 0 },
    ];

    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-24">
            {/* Header Content */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <HeaderAnimated title="Gestão de Pessoas & Alocação" />
                    <p className="text-muted-foreground font-medium mt-1">
                        Monitoramento de equipes, produtividade e saúde ocupacional.
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
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9 transition-all",
                                moduleView === 'atividades' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                            )}
                        >
                            Kanban Equipe
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-xl h-11 gap-2 font-black px-6 border-white/10 uppercase text-[10px] tracking-widest shadow-sm"
                        onClick={() => openPlaceholder("Adicionar Novo Colaborador", Plus)}
                    >
                        <Plus size={18} /> Novo Colaborador
                    </Button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {moduleView === 'geral' ? (
                    <motion.div key="geral" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
                        {/* Stats Panel */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Efetivo', value: '124', change: '+5', icon: Users, color: 'text-blue-500' },
                                { label: 'Alocação Média', value: '88%', change: 'Ótima', icon: Briefcase, color: 'text-emerald-500' },
                                { label: 'Treinamentos', value: '12', change: 'Pendentes', icon: GraduationCap, color: 'text-amber-500' },
                                { label: 'Compliance SST', value: '100%', change: 'Seguro', icon: Shield, color: 'text-primary' },
                            ].map((s, i) => (
                                <div key={i} onClick={() => openPlaceholder(`Analytics: ${s.label}`, s.icon)} className="cursor-pointer">
                                    <Card className="rounded-[2rem] border-border/40 bg-background/60 backdrop-blur-xl p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={cn("p-4 rounded-2xl bg-muted/50", s.color)}>
                                                <s.icon size={24} strokeWidth={2.5} />
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2">{s.label}</p>
                                        <div className="flex items-end gap-2">
                                            <h3 className="text-3xl font-black tracking-tighter leading-none">{s.value}</h3>
                                            <span className="text-[10px] font-black text-emerald-500 mb-1">{s.change}</span>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>

                        {/* Search & Tabs */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                                <Input placeholder="Buscar por nome, cargo ou obra..." className="pl-12 h-12 rounded-xl border-border/40 bg-background/50 font-medium text-sm shadow-inner" />
                            </div>
                            <div className="flex p-1 bg-muted/20 rounded-xl border border-white/5">
                                {['colaboradores', 'escalas', 'custos'].map(tab => (
                                    <Button
                                        key={tab}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (tab === 'colaboradores') setActiveTab(tab);
                                            else openPlaceholder(`Gestão de ${tab.charAt(0).toUpperCase() + tab.slice(1)} de Equipe`, tab === 'escalas' ? Calendar : DollarSign);
                                        }}
                                        className={cn(
                                            "rounded-lg text-[9px] font-black uppercase tracking-widest px-4 h-9",
                                            activeTab === tab ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        {tab}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Colaboradores List */}
                        <div className="grid gap-4">
                            {colaboradores.map((col) => (
                                <Card key={col.id} className="rounded-[2rem] border-border/40 bg-background/60 backdrop-blur-xl hover:border-primary/20 hover:shadow-2xl transition-all group overflow-hidden">
                                    <CardContent className="p-8">
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-muted/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                                                    <Users size={32} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1.5">
                                                        <h3 className="font-black text-xl tracking-tight leading-none group-hover:text-primary transition-colors">{col.nome}</h3>
                                                        <Badge variant="secondary" className="text-[9px] font-black tracking-widest uppercase border-none px-2 py-0.5 bg-secondary">{col.funcao}</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-2 font-bold uppercase tracking-wider">
                                                        <MapPin size={14} className="text-primary/60" /> {col.obra}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground/60 mb-2 tracking-widest">Alocação</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-24 bg-muted/50 rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary" style={{ width: `${col.alocacao}%` }} />
                                                        </div>
                                                        <p className="text-xs font-black">{col.alocacao}%</p>
                                                    </div>
                                                </div>
                                                <Badge className={cn(
                                                    "font-black text-[10px] tracking-widest uppercase px-3 py-1.5 border-none",
                                                    col.status === 'ATIVO' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                                )}>
                                                    {col.status}
                                                </Badge>
                                                <Button size="icon" variant="ghost" className="h-12 w-12 rounded-xl border border-white/5 hover:bg-primary hover:text-white transition-all">
                                                    <ChevronRight size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="atividades" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full min-h-[600px]">
                        <ReusableKanbanBoard contextFilter="EQUIPE" title="Gestão de Quadros & Colaboradores" />
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

export default EquipeDashboard;
