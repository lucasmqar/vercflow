"use client"

import React, { useState } from 'react';
import {
    Truck,
    Wrench,
    Fuel,
    Calendar,
    AlertTriangle,
    Search,
    Plus,
    MapPin,
    ArrowUpRight,
    Activity,
    History,
    Filter,
    Gauge,
    Droplets,
    Zap,
    Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { DashboardTab } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { ReusableKanbanBoard } from '@/components/tasks/ReusableKanbanBoard';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';

export function FrotaDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    const [moduleView, setModuleView] = useState<'geral' | 'atividades'>('geral');
    const [activeClassification, setActiveClassification] = useState<'all' | 'leve' | 'pesado' | 'maquina'>('all');
    const [activeTab, setActiveTab] = useState('veiculos');
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any; type?: any }>({
        isOpen: false,
        title: "",
        type: "none"
    });

    const openPlaceholder = (title: string, icon?: any, type: any = "none") => {
        setModalConfig({ isOpen: true, title, icon, type });
    };

    // Mock Vehicles
    const veiculos = [
        { id: 1, placa: 'ABC-1234', modelo: 'Fiat Strada', tipo: 'Utilitário', class: 'leve', status: 'EM USO', obra: 'Ed. Sky', revisao: 'Em dia', km: 12450, combustivel: 75, motorista: 'João Silva' },
        { id: 2, placa: 'DEF-5678', modelo: 'Caminhão Munck', tipo: 'Caminhão', class: 'pesado', status: 'DISPONIVEL', obra: 'Pátio', revisao: 'Vence em 5 dias', km: 45800, combustivel: 45, motorista: '-' },
        { id: 3, placa: 'GHI-9012', modelo: 'VW Saveiro', tipo: 'Utilitário', class: 'leve', status: 'MANUTENCAO', obra: 'Oficina', revisao: 'Atrasada', km: 89300, combustivel: 10, motorista: '-' },
        { id: 4, placa: 'JKL-3456', modelo: 'Escavadeira Volvo', tipo: 'Maquinário', class: 'maquina', status: 'EM USO', obra: 'Res. Orion', revisao: 'Em dia', horas: 1200, combustivel: 60, motorista: 'Carlos S.' },
        { id: 5, placa: 'MNO-7890', modelo: 'Gerador 50kVA', tipo: 'Equipamento', class: 'maquina', status: 'DISPONIVEL', obra: 'Ed. Infinity', revisao: 'Pendente', horas: 450, combustivel: 95, motorista: '-' },
    ];

    const filteredVeiculos = veiculos.filter(v => activeClassification === 'all' || v.class === activeClassification);

    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-24">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <HeaderAnimated title="Telemetria & Frota" />
                    <p className="text-muted-foreground font-medium mt-1">
                        Monitoramento de ativos móveis, máquinas pesadas e custos operacionais.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex p-1 bg-muted/20 rounded-xl border border-border/40 shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setModuleView('geral')}
                            className={cn(
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9",
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
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9",
                                moduleView === 'atividades' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                            )}
                        >
                            Logística (Kanban)
                        </Button>
                    </div>
                    <Button
                        className="rounded-xl h-11 px-6 font-black uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                        onClick={() => openPlaceholder("Adicionar Novo Ativo", Plus, "vehicle")}
                    >
                        <Plus size={18} /> Novo Ativo
                    </Button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {moduleView === 'geral' ? (
                    <motion.div key="geral" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
                        {/* Fleet KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <FleetKPI title="Ativos Totais" value="42" icon={Truck} sub="Móveis e Máquinas" />
                            <FleetKPI title="Disponibilidade" value="89%" icon={Activity} sub="Taxa de Utilização" />
                            <FleetKPI title="Manutenção" value="4" icon={Wrench} sub="Parados em Oficina" color="text-red-500" />
                            <FleetKPI title="Consumo Médio" value="R$ 4.2k" icon={Fuel} sub="Combustível / Semana" />
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <div className="flex items-center justify-between border-b border-border/40 pb-2 overflow-x-auto no-scrollbar">
                                <TabsList className="bg-transparent h-auto p-0 gap-8">
                                    <TabItem value="veiculos" icon={Truck} label="Ativos" isActive={activeTab === 'veiculos'} />
                                    <TabItem value="manutencao" icon={Wrench} label="Agenda Preventiva" isActive={activeTab === 'manutencao'} />
                                    <TabItem value="abastecimento" icon={Fuel} label="Relatórios Consumo" isActive={activeTab === 'abastecimento'} />
                                    <TabItem value="tracking" icon={MapPin} label="Live Tracking" isActive={activeTab === 'tracking'} />
                                </TabsList>
                            </div>

                            <TabsContent value="veiculos" className="space-y-6">
                                <div className="flex gap-4 p-2 bg-background/40 backdrop-blur-md rounded-3xl border border-white/5 w-fit">
                                    <ClassificationFilter active={activeClassification === 'all'} onClick={() => setActiveClassification('all')} label="Todos" count={veiculos.length} />
                                    <ClassificationFilter active={activeClassification === 'leve'} onClick={() => setActiveClassification('leve')} label="Leves" icon={Truck} color="text-blue-500" />
                                    <ClassificationFilter active={activeClassification === 'pesado'} onClick={() => setActiveClassification('pesado')} label="Pesados" icon={Truck} color="text-amber-500" />
                                    <ClassificationFilter active={activeClassification === 'maquina'} onClick={() => setActiveClassification('maquina')} label="Máquinas" icon={Activity} color="text-rose-500" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredVeiculos.map((v) => (
                                        <VehicleCard key={v.id} v={v} />
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                ) : (
                    <motion.div key="atividades" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full min-h-[600px]">
                        <ReusableKanbanBoard contextFilter="LOG" title="Gestão de Logística & Ativos" />
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

// Helpers
function FleetKPI({ title, value, icon: Icon, sub, color }: any) {
    return (
        <Card className="rounded-2xl border-border/40 bg-background/60 p-6 flex flex-col justify-between border-b-4 border-b-primary shadow-sm hover:translate-y-[-2px] transition-all">
            <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
                <Icon size={20} className={color || "text-primary"} />
            </div>
            <div>
                <h3 className="text-2xl font-black leading-none mb-1">{value}</h3>
                <p className="text-[9px] font-bold text-muted-foreground/60 uppercase">{sub}</p>
            </div>
        </Card>
    );
}

function TabItem({ value, icon: Icon, label, isActive }: any) {
    return (
        <TabsTrigger
            value={value}
            className={cn(
                "relative bg-transparent h-12 rounded-none px-0 gap-2 text-xs font-bold uppercase tracking-wider transition-all border-none data-[state=active]:bg-transparent data-[state=active]:text-primary shadow-none",
                isActive ? "text-primary" : "text-muted-foreground"
            )}
        >
            <Icon size={14} /> {label}
            {isActive && <motion.div layoutId="active-tab-frota" className="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-primary" />}
        </TabsTrigger>
    );
}

function VehicleCard({ v }: any) {
    const Icon = v.class === 'maquina' ? Activity : v.class === 'pesado' ? Truck : Truck;

    return (
        <Card className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl group hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden">
            <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center font-black shadow-inner",
                        v.class === 'maquina' ? "bg-rose-500/10 text-rose-500" :
                            v.class === 'pesado' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                    )}>
                        <Icon size={28} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Badge className={cn(
                            "font-black text-[9px] tracking-widest uppercase border-none px-3 py-1",
                            v.status === 'EM USO' ? 'bg-emerald-500/10 text-emerald-600' :
                                v.status === 'MANUTENCAO' ? 'bg-red-500/10 text-red-600' : 'bg-primary/10 text-primary'
                        )}>
                            {v.status}
                        </Badge>
                        <Badge variant="outline" className="text-[8px] font-black uppercase border-white/10 text-muted-foreground/60">
                            {v.class}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{v.modelo}</h3>
                    <div className="flex items-center gap-2">
                        <MapPin size={10} className="text-primary/60" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{v.obra}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    <p className="text-[9px] font-black text-muted-foreground/60 bg-secondary/50 px-2 py-0.5 rounded-md tracking-widest uppercase border border-white/5">{v.placa}</p>
                    <p className="text-[9px] font-black text-white/40 bg-white/5 px-2 py-0.5 rounded-md tracking-widest uppercase border border-white/5">{v.tipo}</p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                    <div>
                        <p className="text-[8px] font-black uppercase text-muted-foreground/40 mb-1">Responsável</p>
                        <p className="text-xs font-bold">{v.motorista}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black uppercase text-muted-foreground/40 mb-1">Km / Horas</p>
                        <p className="text-xs font-bold">{v.km || v.horas}</p>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div>
                        <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase mb-1">
                            <span>Energia / Tanque</span>
                            <span className={v.combustivel < 20 ? "text-red-500" : "text-emerald-500"}>{v.combustivel}%</span>
                        </div>
                        <Progress value={v.combustivel} className="h-1.5" />
                    </div>
                </div>

                <Button variant="ghost" className="w-full mt-6 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    Ver Telemetria <ArrowUpRight size={14} className="ml-2" />
                </Button>
            </CardContent>
        </Card>
    );
}

function ClassificationFilter({ active, onClick, label, icon: Icon, color, count }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest",
                active ? "bg-white/10 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
            )}
        >
            {Icon && <Icon size={14} className={active ? color : ""} />}
            {label}
            {count !== undefined && <span className="opacity-40 ml-1">{count}</span>}
        </button>
    );
}

export default FrotaDashboard;
