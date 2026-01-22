"use client"

import React, { useState } from 'react';
import {
    Activity,
    ArrowUpRight,
    Truck,
    Users,
    Layers,
    AlertCircle,
    Plus,
    ChevronRight,
    TrendingUp,
    Hammer,
    BarChart3,
    Clock,
    Box,
    Calendar,
    ShoppingCart,
    ShieldCheck,
    Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import HeaderAnimated from '@/components/common/HeaderAnimated';

export function EngineeringOverview({ obraName = "Edifício Infinity Coast" }: { obraName?: string }) {
    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-24">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1">
                    <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest uppercase mb-2">Engenharia Core</Badge>
                    <HeaderAnimated title={obraName} />
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl h-12 gap-2 font-black px-6 border-border/40 uppercase text-[10px] tracking-widest">
                        <Activity size={18} /> Relatório Diário
                    </Button>
                    <Button className="rounded-2xl h-12 gap-2 font-black px-6 uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 bg-primary">
                        Configurações Obra
                    </Button>
                </div>
            </div>

            {/* Snapshot Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Avanço Físico" value="68.4%" icon={TrendingUp} trend="+2.1%" color="text-emerald-500" />
                <StatCard label="Avanço Projetos" value="92.0%" icon={Layers} trend="No prazo" color="text-blue-500" />
                <StatCard label="Avanço Compras" value="54.2%" icon={ShoppingCart} trend="-5% Atrasado" color="text-amber-500" />
                <StatCard label="Alertas Críticos" value="03" icon={AlertCircle} trend="Pendências" color="text-rose-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gestão de Atribuições */}
                <Card className="lg:col-span-2 rounded-[2.5rem] border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Macroatribuições & Frentes</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Status de execução por serviço</p>
                            </div>
                            <Button variant="ghost" className="rounded-xl h-10 gap-2 font-black px-4 uppercase text-[10px] tracking-widest hover:bg-white/5">
                                <Plus size={16} /> Atribuir Frente
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <ServiceFrontItem
                                title="Estrutura de Concreto"
                                responsible="Mestre João"
                                status="executing"
                                progress={85}
                                teamSize={12}
                            />
                            <ServiceFrontItem
                                title="Instalações Elétricas"
                                responsible="Eng. Carlos"
                                status="waiting"
                                progress={12}
                                teamSize={4}
                            />
                            <ServiceFrontItem
                                title="Alvenaria Estrutural"
                                responsible="Mestre João"
                                status="executing"
                                progress={45}
                                teamSize={8}
                            />
                            <ServiceFrontItem
                                title="Acabamento Interno"
                                responsible="Mestra Ana"
                                status="planned"
                                progress={0}
                                teamSize={0}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Gestão de Locação */}
                <Card className="rounded-[2.5rem] border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black tracking-tight">Locação de Ativos</h3>
                            <Truck size={24} className="text-primary/40" />
                        </div>

                        <div className="space-y-4">
                            <RentalItem
                                item="Grua de Torre 45m"
                                provider="RentMach"
                                cost="R$ 15.000/mês"
                                status="active"
                            />
                            <RentalItem
                                item="Andaime Fachadeiro"
                                provider="LocalEasy"
                                cost="R$ 4.200/mês"
                                status="warning"
                            />
                            <RentalItem
                                item="Container Escritório"
                                provider="SafeMod"
                                cost="R$ 2.100/mês"
                                status="active"
                            />
                        </div>

                        <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Custo Mensal Locação</span>
                                <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black tracking-widest">ESTIMATED</Badge>
                            </div>
                            <p className="text-2xl font-black tracking-tight">R$ 21.300,00</p>
                            <Button className="w-full mt-4 rounded-xl h-10 gap-2 font-black px-4 uppercase text-[10px] tracking-widest bg-primary hover:bg-primary/90">
                                Programar Devolução
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Solicitações Inter-departamentais */}
            <div className="grid grid-cols-1 gap-6">
                <Card className="rounded-[2.5rem] border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Solicitações p/ Departamentos</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Acompanhamento de requisições externas</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="ghost" className="rounded-xl h-10 gap-2 font-black px-4 uppercase text-[10px] tracking-widest hover:bg-white/5">
                                    <ShoppingCart size={16} /> Compras
                                </Button>
                                <Button variant="ghost" className="rounded-xl h-10 gap-2 font-black px-4 uppercase text-[10px] tracking-widest hover:bg-white/5">
                                    <ShieldCheck size={16} /> Jurídico
                                </Button>
                                <Button variant="ghost" className="rounded-xl h-10 gap-2 font-black px-4 uppercase text-[10px] tracking-widest hover:bg-white/5">
                                    <Briefcase size={16} /> RH
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <RequestGroup title="Para Compras" count={5} />
                            <RequestGroup title="Para Financeiro" count={2} />
                            <RequestGroup title="Para Projetos" count={1} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Helpers
function StatCard({ label, value, trend, icon: Icon, color }: any) {
    return (
        <Card className="rounded-[2.5rem] border-white/5 bg-background/60 backdrop-blur-xl hover:border-primary/20 transition-all group overflow-hidden shadow-xl">
            <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                        <Icon size={24} />
                    </div>
                    <Badge variant="outline" className="border-white/10 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                        Live
                    </Badge>
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">{label}</p>
                    <h4 className={cn("text-3xl font-black tracking-tighter", color)}>{value}</h4>
                    <p className="text-[9px] font-bold text-muted-foreground/60 mt-1 flex items-center gap-1.5 uppercase">
                        <Clock size={10} className="text-primary/60" /> {trend}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

function ServiceFrontItem({ title, responsible, status, progress, teamSize }: any) {
    return (
        <div className="p-6 rounded-[2rem] bg-background/40 border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        status === 'executing' ? "bg-emerald-500/10 text-emerald-500" :
                            status === 'waiting' ? "bg-amber-500/10 text-amber-500" : "bg-muted/50 text-muted-foreground"
                    )}>
                        <Hammer size={20} />
                    </div>
                    <div>
                        <h4 className="font-black text-sm tracking-tight">{title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase">
                                <Users size={10} /> {responsible}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase">
                                <Users size={10} /> {teamSize} Prof.
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 max-w-[200px] w-full space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                        <span>Avanço</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden shadow-inner font-sans">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={cn(
                                "h-full rounded-full",
                                progress === 100 ? "bg-emerald-500" : "bg-primary"
                            )}
                        />
                    </div>
                </div>

                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 opacity-0 group-hover:opacity-100">
                    <ChevronRight size={18} />
                </Button>
            </div>
        </div>
    );
}

function RentalItem({ item, provider, cost, status }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-2 h-8 rounded-full",
                    status === 'active' ? "bg-emerald-500" : "bg-amber-500"
                )} />
                <div>
                    <p className="text-[11px] font-black tracking-tight">{item}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">{provider}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[11px] font-black opacity-60">{cost}</p>
                {status === 'warning' && (
                    <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Devolução Atrasada</span>
                )}
            </div>
        </div>
    );
}

function RequestGroup({ title, count }: { title: string, count: number }) {
    return (
        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{title}</h4>
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                    {count}
                </div>
            </div>
            <div className="space-y-3">
                {[1, 2].slice(0, count).map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold text-muted-foreground/80">Req #234 - {i === 0 ? 'Urgent' : 'In review'}</span>
                    </div>
                ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 rounded-xl h-8 gap-2 font-black px-4 uppercase text-[8px] tracking-widest hover:bg-white/5 opacity-0 group-hover:opacity-100">
                Ver Todas <ArrowUpRight size={12} />
            </Button>
        </div>
    );
}
