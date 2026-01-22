"use client"

import React, { useState } from 'react';
import {
    Layers,
    Plus,
    Search,
    Settings2,
    Building2,
    Activity,
    Zap,
    LayoutGrid,
    ClipboardList,
    Target,
    Users,
    MapPin,
    Send,
    TrendingUp,
    BarChart3,
    ChevronRight,
    Clock,
    PieChart,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    TrendingDown,
    ArrowRight,
    Filter,
    MoreVertical,
    List,
    Camera
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

export function GestaoProjetosDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    const [viewMode, setViewMode] = useState<'geral' | 'atividades'>('geral');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any }>({
        isOpen: false,
        title: "",
    });

    const openPlaceholder = (title: string, icon?: any) => {
        setModalConfig({ isOpen: true, title, icon });
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background to-secondary/5 overflow-hidden font-sans pb-32">
            {/* Module Header */}
            <div className="p-8 border-b bg-background/95 backdrop-blur-md shrink-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
                    <div>
                        <HeaderAnimated title="Gestão de Portfólio" />
                        <p className="text-muted-foreground font-medium mt-1">Dashboards estratégicos para aprovação e criação de novos conceitos.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex p-1 bg-muted/40 rounded-xl border border-white/5 shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('geral')}
                                className={cn(
                                    "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9 transition-all",
                                    viewMode === 'geral' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <LayoutGrid size={14} className="mr-2" /> Overview
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode('atividades')}
                                className={cn(
                                    "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9 transition-all",
                                    viewMode === 'atividades' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <ClipboardList size={14} className="mr-2" /> Atividades
                            </Button>
                        </div>
                        <Button
                            onClick={onOpenWizard}
                            className="h-12 rounded-2xl font-black uppercase tracking-widest text-[11px] px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus size={18} className="mr-2" /> Novo Projeto
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            placeholder="Buscar projetos, clientes ou responsáveis..."
                            className="pl-12 h-12 rounded-xl border-white/10 bg-muted/20 focus:bg-background transition-all font-medium text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="rounded-xl h-12 gap-2 font-black px-6 border-white/10 uppercase text-[10px] tracking-widest hover:bg-muted/50">
                        <Filter size={18} /> Filtros Avançados
                    </Button>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-8">
                <AnimatePresence mode="wait">
                    {viewMode === 'geral' ? (
                        <motion.div
                            key="geral"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12 max-w-[1400px] mx-auto"
                        >
                            {/* Strategic Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Projetos Ativos', value: '14', icon: Layers, color: 'text-blue-500', trend: '+2 este mês' },
                                    { label: 'Taxa de Aprovação', value: '92%', icon: Target, color: 'text-emerald-500', trend: '+5% vs ano ant.' },
                                    { label: 'Margem Estimada', value: '24.5%', icon: BarChart3, color: 'text-purple-500', trend: 'Acima da meta' },
                                    { label: 'SLA de Criação', value: '4.2d', icon: TrendingUp, color: 'text-orange-500', trend: '-1.2d de redução' },
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        className="cursor-pointer"
                                        onClick={() => openPlaceholder(`Métrica: ${stat.label}`, stat.icon)}
                                    >
                                        <Card className="rounded-[2.5rem] border-border/40 bg-background/40 backdrop-blur-xl p-8 shadow-sm group hover:shadow-2xl hover:shadow-primary/5 transition-all h-full">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={cn("p-4 rounded-2xl bg-muted/50 transition-transform group-hover:scale-110 shadow-inner", stat.color)}>
                                                    <stat.icon size={24} strokeWidth={2.5} />
                                                </div>
                                                <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 opacity-60">Mensal</Badge>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-2">{stat.label}</p>
                                                <div className="flex items-end gap-3">
                                                    <h3 className="text-3xl font-black tracking-tighter leading-none">{stat.value}</h3>
                                                    <span className="text-[10px] font-black text-emerald-500 mb-1">{stat.trend}</span>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>

                            {/* Active Projects List */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <h3 className="text-2xl font-black tracking-tight">Design & Aprovações</h3>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase py-1 px-3 border-primary/20 text-primary">FASE DE CRIAÇÃO (4)</Badge>
                                    </div>
                                </div>

                                <div className="grid gap-6">
                                    {[1, 2].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Card className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl p-8 hover:border-primary/20 transition-all cursor-pointer group shadow-sm hover:shadow-2xl hover:shadow-primary/5">
                                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                                                    <div className="flex items-center gap-8">
                                                        <div className="w-20 h-20 rounded-[2rem] bg-muted/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner border border-white/5 relative overflow-hidden">
                                                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <Building2 size={32} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h4 className="text-2xl font-black tracking-tight">Verc Concept Design {i + 1}</h4>
                                                                <Badge className="bg-blue-500/10 text-blue-500 border-none text-[8px] font-black uppercase tracking-widest px-3">ESTUDO PRELIMINAR</Badge>
                                                            </div>
                                                            <div className="flex flex-wrap gap-4">
                                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 opacity-60">
                                                                    <Users size={12} className="text-primary" /> Arq. Juliana
                                                                </span>
                                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 opacity-60">
                                                                    <Clock size={12} className="text-primary" /> Modificado: Hoje
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <Button
                                                            variant="outline"
                                                            className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest px-6 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                                                            onClick={(e: any) => {
                                                                e.stopPropagation();
                                                                openPlaceholder("Aprovação Técnica de Layout", CheckCircle2);
                                                            }}
                                                        >
                                                            Aprovar Layout
                                                        </Button>
                                                        <Button className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest px-6 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 gap-2">
                                                            <Send size={14} /> Handoff Engenharia
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="atividades"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full min-h-[600px]"
                        >
                            <ReusableKanbanBoard contextFilter="PROJETOS" title="Pipeline de Criação & Aprovações Técnicas" />
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
