"use client"

import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Shield,
    GraduationCap,
    DollarSign,
    Briefcase,
    MapPin,
    ChevronRight,
    Search,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';

// Placeholder components for sections
const PlaceholderSection = ({ title, icon: Icon }: any) => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-muted/30 rounded-[2rem] flex items-center justify-center mb-6">
            <Icon size={40} className="opacity-50" />
        </div>
        <h2 className="text-xl font-black tracking-tight mb-2">Seção {title}</h2>
        <p className="max-w-[300px] text-center text-sm font-medium opacity-60">
            Módulo de RH e SST em desenvolvimento.
        </p>
    </div>
);

export function RHDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [currentSection, setCurrentSection] = useState<'overview' | 'collaborators' | 'protection' | 'training' | 'payroll'>('overview');

    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'collaborators', label: 'Colaboradores', icon: Users },
        { id: 'protection', label: 'SST & EPIs', icon: Shield },
        { id: 'training', label: 'Treinamentos', icon: GraduationCap },
        { id: 'payroll', label: 'Folha & Custos', icon: DollarSign },
    ];

    const colaboradores = [
        { id: 1, nome: "Carlos Oliveira", funcao: "Engenheiro Residente", obra: "Residencial Verc", status: "ATIVO", alocacao: 100 },
        { id: 2, nome: "Ana Paula Silva", funcao: "Arquiteta", obra: "Comercial Hub", status: "ATIVO", alocacao: 80 },
        { id: 3, nome: "Marcos Santos", funcao: "Mestre de Obras", obra: "Park Avenue", status: "FERIAS", alocacao: 0 },
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden font-sans">
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-20 lg:w-64 border-r border-border/40 flex flex-col items-center lg:items-stretch py-8 bg-background/50 backdrop-blur-sm shrink-0 transition-all duration-300">
                    <div className="px-6 mb-8 hidden lg:block">
                        <HeaderAnimated title="RH & SST" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-1">
                            People & Safety
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full px-4 flex-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = currentSection === item.id;
                            return (
                                <Button
                                    key={item.id}
                                    variant={isActive ? "secondary" : "ghost"}
                                    onClick={() => setCurrentSection(item.id as any)}
                                    className={cn(
                                        "w-full justify-start h-12 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                                        "lg:px-4 px-0 lg:justify-start justify-center"
                                    )}
                                >
                                    <item.icon size={20} className={cn("shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground", "lg:mr-3")} />
                                    <span className="hidden lg:block font-bold text-xs uppercase tracking-wide truncate">{item.label}</span>
                                </Button>
                            );
                        })}
                    </div>

                    <div className="p-4 mt-auto">
                        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/10 rounded-2xl hidden lg:block">
                            <p className="text-[10px] font-black uppercase text-primary mb-1">Total Efetivo</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-xs font-bold text-foreground">124 Ativos</span>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex flex-col bg-muted/5">
                    <div className="h-20 border-b border-border/40 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm shrink-0 lg:hidden">
                        <HeaderAnimated title="RH & SST" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-[1920px] mx-auto h-full"
                            >
                                {currentSection === 'overview' || currentSection === 'collaborators' ? (
                                    <div className="space-y-8">
                                        {/* Stats */}
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                            {[
                                                { label: 'Total Efetivo', value: '124', change: '+5', icon: Users, color: 'text-blue-500' },
                                                { label: 'Alocação Média', value: '88%', change: 'Ótima', icon: Briefcase, color: 'text-emerald-500' },
                                                { label: 'Treinamentos', value: '12', change: 'Pendentes', icon: GraduationCap, color: 'text-amber-500' },
                                                { label: 'Compliance SST', value: '100%', change: 'Seguro', icon: Shield, color: 'text-primary' },
                                            ].map((s, i) => (
                                                <Card key={i} className="rounded-[2rem] border-white/5 bg-background/60 backdrop-blur-xl p-8 hover:shadow-lg transition-all">
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
                                            ))}
                                        </div>

                                        {/* Search Bar Area */}
                                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="relative flex-1 w-full md:max-w-md">
                                                <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                                                <Input placeholder="Buscar colaborador..." className="pl-12 h-12 rounded-xl border-border/40 bg-background/50 font-medium text-sm shadow-inner" />
                                            </div>
                                            <Button className="rounded-xl h-11 px-6 font-black uppercase tracking-widest gap-2 bg-primary text-primary-foreground">
                                                <Plus size={18} /> Novo Colaborador
                                            </Button>
                                        </div>

                                        {/* Collaborators List */}
                                        <div className="grid gap-4">
                                            {colaboradores.map((col) => (
                                                <Card key={col.id} className="rounded-[2rem] border-white/5 bg-background/60 p-6 hover:border-primary/20 transition-all group">
                                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                                        <div className="flex items-center gap-6 w-full md:w-auto">
                                                            <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center text-primary border border-white/5">
                                                                <Users size={28} />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-black text-lg tracking-tight mb-1">{col.nome}</h3>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-wider">{col.funcao}</Badge>
                                                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                                                                        <MapPin size={12} /> {col.obra}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-8 w-full md:w-auto justify-between">
                                                            <div className="text-right">
                                                                <p className="text-[9px] font-black uppercase text-muted-foreground/50 mb-1 tracking-widest">Alocação</p>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                                                        <div className="h-full bg-primary" style={{ width: `${col.alocacao}%` }} />
                                                                    </div>
                                                                    <span className="text-xs font-bold">{col.alocacao}%</span>
                                                                </div>
                                                            </div>
                                                            <Badge className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1", col.status === 'ATIVO' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>
                                                                {col.status}
                                                            </Badge>
                                                            <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white/10">
                                                                <ChevronRight size={20} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <PlaceholderSection
                                        title={navItems.find(i => i.id === currentSection)?.label}
                                        icon={navItems.find(i => i.id === currentSection)?.icon}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RHDashboard;
