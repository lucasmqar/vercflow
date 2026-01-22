"use client"

import React, { useState, useEffect } from 'react';
import {
    Box,
    ShoppingCart,
    ArrowRightLeft,
    AlertTriangle,
    Package,
    Truck,
    Search,
    Plus,
    ArrowRight,
    CheckCircle2,
    FileText,
    TrendingDown,
    Filter,
    BarChart3,
    Zap,
    History,
    Receipt,
    Calendar,
    MapPin,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';
import { getApiUrl } from '@/lib/api';

export function EstoqueDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [activeTab, setActiveTab] = useState('geral');
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any; type?: any }>({
        isOpen: false,
        title: "",
        type: "none"
    });

    const openPlaceholder = (title: string, icon?: any, type: any = "none") => {
        setModalConfig({ isOpen: true, title, icon, type });
    };

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-32 no-scrollbar">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <HeaderAnimated title="Estoque & Suprimentos" />
                    <p className="text-muted-foreground font-medium mt-1">
                        Gestão de ciclo completo: da requisição de compra ao controle de almoxarifado.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        className="rounded-xl h-11 px-6 font-black uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                        onClick={() => openPlaceholder("Nova Operação de Estoque", Box, "item")}
                    >
                        <Plus size={18} /> Nova Operação
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <div className="flex items-center justify-between border-b border-border/40 pb-2 overflow-x-auto no-scrollbar">
                    <TabsList className="bg-transparent h-auto p-0 gap-8">
                        <TabItem value="geral" icon={Layers} label="Geral" isActive={activeTab === 'geral'} />
                        <TabItem value="compras" icon={ShoppingCart} label="Mercado & Compras" isActive={activeTab === 'compras'} />
                        <TabItem value="almoxarifado" icon={Package} label="Almoxarifado" isActive={activeTab === 'almoxarifado'} />
                        <TabItem value="logistica" icon={Truck} label="Logística & Fluxo" isActive={activeTab === 'logistica'} />
                    </TabsList>
                </div>

                <AnimatePresence mode="wait">
                    <TabsContent value="geral" className="mt-0 outline-none">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <SummaryCard title="Insumos em Estoque" value="1.2k" sub="Itens Ativos" icon={Box} type="neutral" />
                                <SummaryCard title="Abaixo do Mínimo" value="14" sub="Ação Necessária" icon={AlertTriangle} type="danger" />
                                <SummaryCard title="Pedidos em Trânsito" value="08" sub="R$ 142k" icon={Truck} type="warning" />
                                <SummaryCard title="Efficiency Score" value="96%" sub="+2% Mensal" icon={Zap} type="success" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card className="rounded-[2.5rem] border-border/40 bg-background/60 p-8">
                                    <h3 className="font-black text-lg mb-6">Status de Suprimentos por Obra</h3>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'Edifício Sky', value: 85, color: 'bg-primary' },
                                            { label: 'Residencial Park', value: 42, color: 'bg-amber-500' },
                                            { label: 'Galpão Alpha', value: 95, color: 'bg-emerald-500' },
                                        ].map((item) => (
                                            <div key={item.label} className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                                    <span>{item.label}</span>
                                                    <span>{item.value}% Abastecido</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} className={cn("h-full", item.color)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                                <Card className="rounded-[2.5rem] border-border/40 bg-background/60 p-8 flex flex-col justify-center items-center text-center">
                                    <TrendingDown size={48} className="text-emerald-500 mb-4" />
                                    <h3 className="text-2xl font-black">R$ 12.4k Saved</h3>
                                    <p className="text-muted-foreground text-sm font-medium mt-2">Economia gerada por cotações inteligentes em Maio.</p>
                                    <Button variant="outline" className="mt-8 rounded-xl h-10 text-[10px] font-black uppercase tracking-widest">Ver Analytics</Button>
                                </Card>
                            </div>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="compras" className="mt-0 outline-none">
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-2xl font-black tracking-tight">Cotações & Ordens de Compra</h3>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="rounded-xl h-10 gap-2 font-black px-4 uppercase text-[10px] tracking-widest"><Filter size={14} /> Filtros</Button>
                                    <Button onClick={() => openPlaceholder("Nova Ordem de Compra", Plus, "item")} className="rounded-xl h-10 gap-2 font-black px-4 uppercase text-[10px] tracking-widest bg-primary"><Plus size={14} /> Nova OC</Button>
                                </div>
                            </div>
                            <div className="grid gap-4">
                                {[
                                    { id: 'OC-902', supplier: 'Açolab S.A', value: 'R$ 45.200', status: 'COTACAO', date: '22/05' },
                                    { id: 'OC-903', supplier: 'Cimento Forte', value: 'R$ 12.800', status: 'APROVADO', date: '23/05' },
                                    { id: 'OC-904', supplier: 'HidroCenter', value: 'R$ 8.450', status: 'EM TRANSITO', date: '21/05' },
                                ].map((oc) => (
                                    <Card key={oc.id} className="rounded-[2rem] border-border/40 bg-background/60 p-6 hover:border-primary/20 transition-all cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors"><Receipt size={24} /></div>
                                                <div>
                                                    <p className="font-black text-sm tracking-tight">{oc.id} · {oc.supplier}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{oc.date} · {oc.value}</p>
                                                </div>
                                            </div>
                                            <Badge className={cn("text-[9px] font-black uppercase tracking-widest", oc.status === 'COTACAO' ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500")}>
                                                {oc.status}
                                            </Badge>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="almoxarifado" className="mt-0 outline-none">
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                                <Input placeholder="Buscar insumo no inventário..." className="pl-12 h-14 rounded-2xl border-border/40 bg-background/50 text-sm font-medium shadow-inner" />
                            </div>
                            <Card className="rounded-[2.5rem] border-border/40 bg-background/60 overflow-hidden shadow-sm">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-border/40 bg-muted/30">
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-left">Insumo</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-left">Qtd Atual</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/20">
                                        {[
                                            { name: 'Cimento CP II - 50kg', qtd: 142, status: 'OK' },
                                            { name: 'Tubo PVC 100mm', qtd: 12, status: 'BAIXO' },
                                            { name: 'Argamassa ACIII', qtd: 0, status: 'CRITICO' },
                                        ].map((item, idx) => (
                                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-sm font-black">{item.name}</td>
                                                <td className="p-6 text-sm font-mono font-black">{item.qtd} un</td>
                                                <td className="p-6">
                                                    <Badge variant="outline" className={cn("text-[8px] font-black uppercase px-2", item.status === 'OK' ? "bg-emerald-500/10 text-emerald-500 border-none" : "bg-red-500/10 text-red-500 border-none")}>
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="logistica" className="mt-0 outline-none">
                        <div className="text-center py-20 opacity-40">
                            <Truck size={48} className="mx-auto mb-4" />
                            <h3 className="font-black text-sm uppercase tracking-widest">Painel de Movimentações em Breve</h3>
                        </div>
                    </TabsContent>
                </AnimatePresence>
            </Tabs>

            <PlaceholderModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                icon={modalConfig.icon}
                type={(modalConfig as any).type}
            />
        </div>
    );
}

// Helpers
function TabItem({ value, icon: Icon, label, isActive }: any) {
    return (
        <TabsTrigger
            value={value}
            className={cn(
                "relative bg-transparent h-14 rounded-none px-0 gap-3 text-[10px] font-black uppercase tracking-widest transition-all border-none data-[state=active]:bg-transparent data-[state=active]:text-primary",
                isActive ? "text-primary" : "text-muted-foreground hover:text-white/60"
            )}
        >
            <Icon size={18} /> {label}
            {isActive && <motion.div layoutId="active-tab-estoque" className="absolute -bottom-[9px] left-0 right-0 h-1 bg-primary rounded-t-full" />}
        </TabsTrigger>
    );
}

function SummaryCard({ title, value, sub, icon: Icon, type }: any) {
    const colors = {
        success: "text-emerald-500 bg-emerald-500/10",
        warning: "text-amber-500 bg-amber-500/10",
        danger: "text-red-500 bg-red-500/10",
        neutral: "text-blue-500 bg-blue-500/10"
    };
    return (
        <Card className="rounded-[2.5rem] border-white/5 bg-background/60 p-8 flex flex-col justify-between h-44 shadow-sm group">
            <div className="flex justify-between items-start">
                <div className={cn("p-4 rounded-3xl", colors[type as keyof typeof colors])}>
                    <Icon size={28} strokeWidth={2.5} />
                </div>
                <Badge variant="secondary" className="text-[9px] font-black uppercase px-3 bg-muted/30">{sub}</Badge>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-1">{title}</p>
                <h3 className="text-3xl font-black tracking-tighter group-hover:text-primary transition-colors">{value}</h3>
            </div>
        </Card>
    );
}

function Layers({ size, className }: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
    )
}

export default EstoqueDashboard;
