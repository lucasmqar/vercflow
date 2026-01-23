"use client"

import React, { useState } from 'react';
import {
    Palette,
    Layers,
    Search,
    Plus,
    Image,
    LayoutTemplate,
    Box,
    CheckCircle2,
    Users,
    FileText,
    Grid,
    ArrowRight,
    Sparkles,
    Eye
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';

export function DesignDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [viewMode, setViewMode] = useState<'specs' | 'architects' | 'moodboards'>('specs');
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any }>({
        isOpen: false,
        title: "",
    });

    const openPlaceholder = (title: string, icon?: any) => {
        setModalConfig({ isOpen: true, title, icon });
    };

    // Mock Data for Design Module
    const specs = [
        { id: 'S-001', project: 'Residencial Sky', area: 'Banho Master', category: 'Metais', status: 'DEFINIDO', deadline: '10/11' },
        { id: 'S-002', project: 'Casa Alpha', area: 'Cozinha', category: 'Revestimentos', status: 'EM APROVAÇÃO', deadline: '12/11' },
        { id: 'S-003', project: 'Escritório Verc', area: 'Recepção', category: 'Marcenaria', status: 'PENDENTE', deadline: '05/11' },
    ];

    const architects = [
        { name: 'Ana Silva Arq', projects: 3, status: 'Ativo', rating: 5 },
        { name: 'Studio béton', projects: 1, status: 'Ativo', rating: 4 },
        { name: 'Carlos Oliveira', projects: 0, status: 'Disponível', rating: 5 },
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background to-secondary/5 overflow-hidden font-sans pb-32">
            {/* Header */}
            <div className="pt-8 px-8 pb-4 shrink-0 flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div>
                        <HeaderAnimated title="Acabamentos & Design" />
                        <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-2">
                            Especificações • Interiores • Curadoria
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-background border border-border/40 rounded-xl p-1 shadow-sm">
                            <Button
                                variant={viewMode === 'specs' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest"
                                onClick={() => setViewMode('specs')}
                            >
                                Especificações
                            </Button>
                            <Button
                                variant={viewMode === 'moodboards' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest"
                                onClick={() => setViewMode('moodboards')}
                            >
                                Moodboards
                            </Button>
                            <Button
                                variant={viewMode === 'architects' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest"
                                onClick={() => setViewMode('architects')}
                            >
                                Arquitetos
                            </Button>
                        </div>

                        <Button
                            onClick={() => openPlaceholder("Nova Especificação", Palette)}
                            className="h-10 rounded-xl font-black uppercase tracking-widest text-[10px] px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                        >
                            <Plus size={16} className="mr-2" /> Novo Item
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 pt-2 scrollbar-thin">
                <AnimatePresence mode="wait">
                    {viewMode === 'specs' && (
                        <motion.div
                            key="specs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Materials Categories */}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {['Louças & Metais', 'Revestimentos', 'Iluminação', 'Marcenaria', 'Mobiliário Solto'].map((cat, i) => (
                                    <Card
                                        key={cat}
                                        className="group rounded-2xl border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
                                        onClick={() => openPlaceholder(`Catálogo: ${cat}`, Box)}
                                    >
                                        <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Box size={20} className="text-muted-foreground group-hover:text-primary" />
                                            </div>
                                            <p className="font-bold text-xs">{cat}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Active Specs List */}
                            <Card className="rounded-3xl border-border/40 bg-background/50 backdrop-blur-sm overflow-hidden">
                                <div className="p-6 border-b border-border/40 sticky top-0 bg-background z-10 flex justify-between items-center">
                                    <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                        <FileText size={16} className="text-primary" /> Definições em Andamento
                                    </h3>
                                    <div className="relative w-64">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input placeholder="Buscar por obra ou item..." className="h-8 pl-9 rounded-lg text-xs bg-muted/50 border-transparent focus:bg-background" />
                                    </div>
                                </div>
                                <div className="divide-y divide-border/20">
                                    {specs.map((item) => (
                                        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/5 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
                                                    {/* Placeholder for material thumb */}
                                                    <Image size={18} className="text-muted-foreground opacity-50" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-black text-xs text-foreground">{item.id}</span>
                                                        <Badge variant="outline" className="text-[9px] h-5 px-1.5 font-mono text-muted-foreground bg-background">{item.id}</Badge>
                                                        <span className="text-[10px] font-bold text-muted-foreground">in {item.project}</span>
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">{item.area} • {item.category}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                                                        item.status === 'DEFINIDO' ? "bg-emerald-500/10 text-emerald-500" :
                                                            item.status === 'PENDENTE' ? "bg-red-500/10 text-red-500" :
                                                                "bg-amber-500/10 text-amber-500"
                                                    )}>
                                                        {item.status}
                                                    </span>
                                                    <p className="text-[9px] text-muted-foreground mt-1 text-right">Prazo: {item.deadline}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors">
                                                    <ArrowRight size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {viewMode === 'architects' && (
                        <motion.div
                            key="architects"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {architects.map((arq, i) => (
                                <Card key={i} className="rounded-3xl border-border/40 bg-background hover:shadow-lg transition-all group cursor-pointer overflow-hidden">
                                    <div className="h-24 bg-gradient-to-r from-neutral-100 to-neutral-200 relative">
                                        <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-2xl bg-white p-1 shadow-md">
                                            <div className="w-full h-full rounded-xl bg-neutral-900 flex items-center justify-center text-white font-bold text-lg">
                                                {arq.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 pt-8">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-black text-lg">{arq.name}</h3>
                                            <div className="flex text-amber-500">
                                                {[...Array(5)].map((_, j) => (
                                                    <Sparkles key={j} size={10} className={j < arq.rating ? "fill-current" : "text-muted opacity-20"} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-4">Parceiro Externo • Especialista em Interiores</p>

                                        <div className="grid grid-cols-2 gap-2 mb-6">
                                            <div className="p-3 rounded-xl bg-muted/30">
                                                <p className="text-[10px] uppercase font-black text-muted-foreground">Projetos</p>
                                                <p className="text-xl font-black">{arq.projects}</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-muted/30">
                                                <p className="text-[10px] uppercase font-black text-muted-foreground">Status</p>
                                                <p className={cn("text-xs font-black uppercase mt-1", arq.status === 'Ativo' ? "text-emerald-500" : "text-primary")}>{arq.status}</p>
                                            </div>
                                        </div>

                                        <Button className="w-full rounded-xl font-black uppercase text-[10px] tracking-widest" variant="outline">
                                            Ver Portfólio
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </motion.div>
                    )}

                    {viewMode === 'moodboards' && (
                        <div className="flex flex-col items-center justify-center h-[500px] text-center p-8 border border-dashed border-border/40 rounded-3xl bg-muted/5">
                            <LayoutTemplate size={64} className="text-muted-foreground/20 mb-6" />
                            <h3 className="text-xl font-black text-muted-foreground/60">Galeria de Inspirações</h3>
                            <p className="text-sm text-muted-foreground/40 max-w-sm mt-2 mb-8">
                                Crie moodboards digitais para apresentar conceitos de acabamentos aos clientes antes da fase de compra.
                            </p>
                            <Button onClick={() => openPlaceholder("Novo Moodboard", LayoutTemplate)}>
                                Criar Moodboard
                            </Button>
                        </div>
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

export default DesignDashboard;
