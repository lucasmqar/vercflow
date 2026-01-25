"use client"

import React, { useState } from 'react';
import {
    Box,
    ChevronRight,
    Search,
    Filter,
    MoveRight,
    History,
    Plus,
    BarChart3,
    PackageSearch,
    AlertCircle,
    CheckCircle2,
    Truck,
    Building2,
    Warehouse,
    ArrowDownLeft,
    ArrowUpRight,
    Tag,
    Hammer,
    MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import HeaderAnimated from '@/components/common/HeaderAnimated';

const STOCK_ITEMS = [
    { id: 'STK-01', name: 'Cimento CP-II', category: 'Civil', location: 'Depósito Central', quantity: 450, unit: 'Sacos', min: 100, status: 'normal' },
    { id: 'STK-02', name: 'Argamassa AC-III', category: 'Civil', location: 'Obra Infinity', quantity: 20, unit: 'Sacos', min: 50, status: 'critical' },
    { id: 'STK-03', name: 'Bitola 10mm Aço', category: 'Estrutural', location: 'Depósito Central', quantity: 2.5, unit: 'Toneladas', min: 1, status: 'normal' },
    { id: 'STK-04', name: 'Cabo Flexível 2.5mm', category: 'Elétrico', location: 'Depósito Central', quantity: 15, unit: 'Rolos', min: 20, status: 'low' },
];

export function StockControl({ obraName = "Gestão de Inventário" }: { obraName?: string }) {
    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-24">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1">
                    <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest uppercase mb-2">Controle de Estoque</Badge>
                    <HeaderAnimated title={obraName} />
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl h-12 gap-2 font-black px-6 border-border/40 uppercase text-[10px] tracking-widest hover:bg-white/5">
                        <History size={18} /> Movimentações
                    </Button>
                    <Button className="rounded-2xl h-12 gap-2 font-black px-6 uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 bg-primary">
                        <Plus size={18} /> Entrada de Material
                    </Button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InventoryStat label="Valor em Estoque" value="R$ 458.200" icon={Box} />
                <InventoryStat label="Produtos Ativos" value="284" icon={Tag} />
                <InventoryStat label="Itens Críticos" value="12" icon={AlertCircle} color="text-rose-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Search & Tree (Left Column) */}
                <div className="space-y-6">
                    <Card className="rounded-2xl border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                        <CardContent className="p-6">
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-2.5 text-muted-foreground/40" size={14} />
                                <Input placeholder="Filtrar estoque..." className="pl-9 h-10 rounded-xl text-xs bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-1">
                                <CategoryNav label="Todos os Itens" icon={PackageSearch} active />
                                <CategoryNav label="Civil / Básico" icon={Building2} />
                                <CategoryNav label="Elétrico / Hidro" icon={Truck} />
                                <CategoryNav label="EPI / Ferramentas" icon={Hammer} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-white/5 bg-primary/5 shadow-2xl overflow-hidden border border-primary/10">
                        <CardContent className="p-8 text-center space-y-4">
                            <BarChart3 className="mx-auto text-primary/40" size={32} />
                            <h4 className="text-sm font-black uppercase tracking-widest">Giro de Estoque</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Média de permanência: 12 dias</p>
                            <Button variant="ghost" className="w-full rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 text-primary">
                                Ver Relatório Full
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Inventory Table */}
                <Card className="lg:col-span-3 rounded-2xl border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Inventário Geral</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Consolidado Depósitos e Obras</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl"><Filter size={16} /></Button>
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl"><ArrowUpRight size={16} /></Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 opacity-40">
                                        <th className="pb-4 text-[9px] font-black uppercase tracking-widest px-4">Produto</th>
                                        <th className="pb-4 text-[9px] font-black uppercase tracking-widest px-4">Localização</th>
                                        <th className="pb-4 text-[9px] font-black uppercase tracking-widest px-4">Quantidade</th>
                                        <th className="pb-4 text-[9px] font-black uppercase tracking-widest px-4">Status</th>
                                        <th className="pb-4 text-[9px] font-black uppercase tracking-widest px-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {STOCK_ITEMS.map((item) => (
                                        <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-6 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                        <Box size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black tracking-tight">{item.name}</p>
                                                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">{item.id} • {item.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                                                    <MapPin size={12} className="text-primary/40" /> {item.location}
                                                </div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black">{item.quantity} {item.unit}</p>
                                                    <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn("h-full rounded-full", item.status === 'critical' ? 'bg-rose-500' : 'bg-primary')}
                                                            style={{ width: `${Math.min((item.quantity / item.min) * 50, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4">
                                                <Badge className={cn(
                                                    "text-[8px] font-black uppercase tracking-widest border-none px-2",
                                                    item.status === 'normal' ? "bg-emerald-500/10 text-emerald-500" :
                                                        item.status === 'low' ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                                                )}>
                                                    {item.status}
                                                </Badge>
                                            </td>
                                            <td className="py-6 px-4 text-right">
                                                <Button variant="ghost" className="rounded-xl h-10 gap-2 font-black px-4 uppercase text-[9px] tracking-widest opacity-0 group-hover:opacity-100">
                                                    Transferir <MoveRight size={14} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions (Floating bar or bottom section) */}
            <div className="flex justify-center pt-8">
                <div className="flex gap-4 p-4 rounded-2xl bg-background/80 backdrop-blur-xl border border-white/10 shadow-3xl">
                    <ActionButton icon={ArrowDownLeft} label="Entrada (NF)" />
                    <ActionButton icon={ArrowUpRight} label="Saída (Obra)" />
                    <ActionButton icon={MoveRight} label="Transferência" />
                    <ActionButton icon={History} label="Inventário" />
                </div>
            </div>
        </div>
    );
}

// Helpers
function InventoryStat({ label, value, icon: Icon, color }: any) {
    return (
        <Card className="rounded-[2rem] border-white/5 bg-background shadow-xl">
            <CardContent className="p-6 flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                    <Icon size={24} />
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-0.5">{label}</p>
                    <h4 className={cn("text-xl font-black tracking-tight", color)}>{value}</h4>
                </div>
            </CardContent>
        </Card>
    );
}

function CategoryNav({ label, icon: Icon, active = false }: any) {
    return (
        <button className={cn(
            "w-full flex items-center justify-between p-3 rounded-xl transition-all font-bold text-xs group",
            active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
        )}>
            <div className="flex items-center gap-3">
                <Icon size={14} className={cn("transition-colors", active ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary")} />
                {label}
            </div>
            {active && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
        </button>
    );
}

function ActionButton({ icon: Icon, label }: any) {
    return (
        <Button variant="ghost" className="flex flex-col items-center gap-1.5 h-auto py-3 px-6 rounded-2xl group text-muted-foreground hover:text-primary transition-all">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/20 group-hover:bg-primary/10 transition-all">
                <Icon size={20} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
        </Button>
    );
}
