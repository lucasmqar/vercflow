"use client"

import React, { useState } from 'react';
import {
    ShoppingCart,
    Package,
    Truck,
    AlertCircle,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    ChevronRight,
    Clock,
    FileText,
    BarChart3,
    CheckCircle2,
    Building2,
    Calendar,
    ArrowUpRight,
    TrendingDown,
    MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import HeaderAnimated from '@/components/common/HeaderAnimated';

export function PurchasesDashboard({ obraName = "Visão Global Suprimentos" }: { obraName?: string }) {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-24">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1">
                    <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest uppercase mb-2">Módulo Compras</Badge>
                    <HeaderAnimated title={obraName} />
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl h-12 gap-2 font-black px-6 border-border/40 uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">
                        <BarChart3 size={18} /> Performance OC
                    </Button>
                    <Button className="rounded-2xl h-12 gap-2 font-black px-6 uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                        <Plus size={18} /> Nova Requisição
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <PurchaseStat label="Requisições Abertas" value="12" sub="Aguardando cotação" icon={ShoppingCart} />
                <PurchaseStat label="OCs Emitidas" value="R$ 1.2M" sub="Este mês" icon={FileText} />
                <PurchaseStat label="Entregas Perto" value="08" sub="Para hoje/amanhã" icon={Truck} color="text-emerald-500" />
                <PurchaseStat label="Itens Críticos" value="04" sub="Ruptura iminente" icon={AlertCircle} color="text-rose-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Requisitions */}
                <Card className="lg:col-span-2 rounded-[2.5rem] border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Requisições Ativas</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Acompanhamento por obra</p>
                            </div>
                            <div className="relative w-48">
                                <Search className="absolute left-3 top-2.5 text-muted-foreground/40" size={14} />
                                <Input placeholder="Buscar..." className="pl-9 h-9 rounded-xl text-[10px] bg-white/5 border-white/10" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <RequisitionItem
                                id="REQ-882"
                                obra="Infinity Coast"
                                item="Cimento CP-II (500 sacos)"
                                status="quoting"
                                date="22 Jan"
                            />
                            <RequisitionItem
                                id="REQ-881"
                                obra="Residencial Orion"
                                item="Aço CA-50 10mm (2t)"
                                status="approved"
                                date="21 Jan"
                            />
                            <RequisitionItem
                                id="REQ-879"
                                obra="Infinity Coast"
                                item="Tubulação Tigre 100mm"
                                status="received"
                                date="18 Jan"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Logistics Feed */}
                <Card className="rounded-[2.5rem] border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-black tracking-tight mb-8">Fluxo de Entregas</h3>
                        <div className="space-y-6">
                            {[
                                { status: 'A caminho', location: 'Infinity Coast', supplier: 'Zandoná Mat.', time: '14:30' },
                                { status: 'Carregando', location: 'Res. Orion', supplier: 'Gerdau', time: 'Amanhã' },
                                { status: 'Atrasado', location: 'Infinity Coast', supplier: 'Hydra S.A.', time: 'Ontem' },
                            ].map((log, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <div className={cn(
                                            "w-3 h-3 rounded-full",
                                            log.status === 'Atrasado' ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-primary"
                                        )} />
                                        <div className="w-[1px] h-full bg-white/5 my-1" />
                                    </div>
                                    <div className="pb-6">
                                        <p className="text-xs font-black tracking-tight group-hover:text-primary transition-colors">{log.supplier}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-white/5 px-1 py-0">{log.location}</Badge>
                                            <span className="text-[10px] font-bold text-muted-foreground opacity-60 uppercase tracking-tighter">{log.status} • {log.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-2 rounded-xl h-10 gap-2 font-black px-6 border-white/10 uppercase text-[10px] tracking-widest bg-white/5 hover:bg-white/10 text-muted-foreground">
                            Ver Mapa Logístico
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Helpers
function PurchaseStat({ label, value, sub, icon: Icon, color }: any) {
    return (
        <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl hover:border-primary/20 transition-all group overflow-hidden">
            <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                        <Icon size={20} />
                    </div>
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">{label}</p>
                    <h4 className={cn("text-2xl font-black tracking-tighter", color)}>{value}</h4>
                    <p className="text-[8px] font-bold text-muted-foreground/60 mt-1 uppercase">{sub}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function RequisitionItem({ id, obra, item, status, date }: any) {
    return (
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
            <div className="flex items-center gap-6">
                <div className="text-center w-12">
                    <p className="text-[10px] font-black text-primary">{id}</p>
                    <p className="text-[8px] font-bold text-muted-foreground opacity-40 uppercase">{date}</p>
                </div>
                <div>
                    <p className="text-sm font-black tracking-tight leading-none mb-1.5">{item}</p>
                    <div className="flex items-center gap-2">
                        <Building2 size={10} className="text-muted-foreground/40" />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">{obra}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Badge className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-none",
                    status === 'received' ? "bg-emerald-500/10 text-emerald-500" :
                        status === 'approved' ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-500"
                )}>
                    {status}
                </Badge>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 opacity-40 group-hover:opacity-100">
                    <ArrowUpRight size={18} />
                </Button>
            </div>
        </div>
    );
}
