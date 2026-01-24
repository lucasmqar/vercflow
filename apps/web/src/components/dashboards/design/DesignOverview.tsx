"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Palette, Layers, Image,
    Clock, AlertCircle, CheckCircle2,
    ArrowUpRight, TrendingUp, Users,
    LayoutTemplate
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function DesignOverview({ onNavigate }: { onNavigate: (section: string) => void }) {

    // Mock KPIs
    const kpis = [
        {
            label: "Projetos em Andamento",
            value: "12",
            trend: "+3 novos",
            icon: Layers,
            color: "text-primary",
            bg: "bg-primary/10",
            border: "border-primary/20",
            nav: "projects"
        },
        {
            label: "Especificações Pendentes",
            value: "84",
            trend: "Ação Necessária",
            icon: Palette,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            nav: "specs"
        },
        {
            label: "Aprovações da Semana",
            value: "9",
            trend: "Meta atingida",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            nav: "overview"
        },
        {
            label: "Moodboards Criados",
            value: "24",
            trend: "Total Mensal",
            icon: LayoutTemplate,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            nav: "moodboards"
        }
    ];

    // Recent Activity / Timeline
    const activities = [
        { id: 1, type: "approval", title: "Aprovação de Revestimentos", project: "Residencial Sky - Banho Master", time: "2h atrás", author: "Ana Silva" },
        { id: 2, type: "comment", title: "Comentário em Marcenaria", project: "Escritório Verc - Recepção", time: "4h atrás", author: "Carlos O." },
        { id: 3, type: "upload", title: "Novas Imagens 3D", project: "Casa Alpha - Living", time: "Ontem", author: "Studio 3D" },
        { id: 4, type: "spec", title: "Especificação Alterada", project: "Residencial Sky - Cozinha", time: "Ontem", author: "Ana Silva" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <Card
                        key={i}
                        onClick={() => onNavigate(kpi.nav)}
                        className={cn(
                            "rounded-[2rem] p-6 border-white/5 bg-background/40 backdrop-blur-md hover:shadow-lg transition-all cursor-pointer group hover:scale-[1.02]",
                            "border hover:border-white/10"
                        )}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner", kpi.bg, kpi.color)}>
                                <kpi.icon size={24} />
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground group-hover:text-foreground">
                                <ArrowUpRight size={18} />
                            </Button>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">{kpi.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-black tracking-tight">{kpi.value}</h3>
                                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-muted/50", kpi.color)}>{kpi.trend}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area - e.g. Recent Priority Items */}
                <Card className="lg:col-span-2 rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-md p-8 min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black text-xl tracking-tight">Atividades Recentes</h3>
                            <p className="text-xs text-muted-foreground mt-1">Histórico de especificações e aprovações.</p>
                        </div>
                        <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-wide">
                            Ver Tudo
                        </Button>
                    </div>

                    <div className="relative pl-6 border-l border-border/40 space-y-8">
                        {activities.map((item) => (
                            <div key={item.id} className="relative group cursor-pointer hover:bg-white/5 p-4 rounded-2xl -ml-4 transition-colors">
                                <div className={cn(
                                    "absolute -left-[29px] top-6 w-3 h-3 rounded-full border-2 border-background shadow-sm",
                                    item.type === 'approval' ? 'bg-emerald-500' :
                                        item.type === 'comment' ? 'bg-blue-500' :
                                            'bg-primary'
                                )} />
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground font-medium">{item.project}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg whitespace-nowrap">{item.time}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold">
                                        {item.author.charAt(0)}
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{item.author}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Side Stats */}
                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-background rounded-xl shadow-lg shadow-primary/10 text-primary">
                                <Palette size={20} />
                            </div>
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-wide">Catálogo</h4>
                                <p className="text-[10px] text-muted-foreground font-bold">Resumo de Materiais</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {['Revestimentos', 'Metais', 'Iluminação', 'Mobiliário'].map((cat, i) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                    <span className="font-medium text-muted-foreground">{cat}</span>
                                    <span className="font-black">{(10 - i) * 12} items</span>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-6 rounded-xl font-bold uppercase text-[10px] tracking-widest bg-background text-foreground hover:bg-background/80 shadow-none border border-black/5">
                            Gerenciar Itens
                        </Button>
                    </Card>

                    <Card className="rounded-[2.5rem] p-6 border-white/5 bg-background/40">
                        <h4 className="font-black text-sm uppercase tracking-wide mb-4">Equipe Design</h4>
                        <div className="flex -space-x-3 overflow-hidden py-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold shadow-sm">
                                    U{i}
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-black shadow-sm">
                                +3
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
