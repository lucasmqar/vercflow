import React from 'react';
import {
    TrendingUp,
    Users,
    Briefcase,
    AlertTriangle,
    Clock,
    CheckCircle2,
    DollarSign,
    ArrowUpRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CEODashboard() {
    const kpis = [
        { label: 'Registros Criados', value: '42', icon: Clock, color: 'text-primary', trend: '+12%', bg: 'bg-primary/10' },
        { label: 'Esboços em Análise', value: '08', icon: AlertTriangle, color: 'text-orange-500', trend: '-2', bg: 'bg-orange-500/10' },
        { label: 'Atividades Ativas', value: '14', icon: Briefcase, color: 'text-blue-500', trend: 'normal', bg: 'bg-blue-500/10' },
        { label: 'Previsto Total', value: 'R$ 84k', icon: DollarSign, color: 'text-green-500', trend: '+5%', bg: 'bg-green-500/10' },
    ];

    return (
        <div className="p-4 lg:p-10 h-[calc(100vh-64px)] flex flex-col bg-secondary/10 overflow-y-auto">

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tighter">Visão Geral CEO</h1>
                <p className="text-muted-foreground font-medium">Pipeline operacional e indicadores de eficiência (SLA)</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {kpis.map((kpi, idx) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="rounded-3xl border-border/50 shadow-xl shadow-black/5 bg-background/80 backdrop-blur-md hover:border-primary/20 transition-all group overflow-hidden relative">
                            <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10", kpi.bg)} />
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", kpi.bg, kpi.color)}>
                                        <kpi.icon size={24} />
                                    </div>
                                    <Badge className="bg-success/10 text-success border-none h-5 text-[10px] uppercase font-bold tracking-widest">
                                        {kpi.trend}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{kpi.label}</p>
                                    <p className="text-3xl font-bold tracking-tighter mt-1">{kpi.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Pipeline SLA */}
                <Card className="lg:col-span-2 rounded-3xl border-border/50 shadow-xl bg-background/80 backdrop-blur-md overflow-hidden">
                    <CardHeader className="border-b bg-secondary/10 px-8 py-6">
                        <CardTitle className="text-lg font-bold tracking-tight">Indicadores de SLA & Gargalos</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 py-6 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold tracking-tight">Tempo Médio Captura &rarr; Triagem</p>
                                <span className="text-sm font-bold text-primary">4.2 horas</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full w-[40%] bg-primary rounded-full" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold tracking-tight">Tempo Médio Triagem &rarr; Execução</p>
                                <span className="text-sm font-bold text-blue-500">1.8 dias</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full w-[65%] bg-blue-500 rounded-full" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-10 p-6 bg-secondary/20 rounded-2xl">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Custo Total Previsto</p>
                                <p className="text-2xl font-bold tracking-tighter">R$ 142.900</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Taxa de Conclusão</p>
                                <p className="text-2xl font-bold tracking-tighter text-success">89%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Clicaveis Section */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Atalhos Críticos</h4>
                    <Button variant="outline" className="w-full h-16 justify-between px-6 rounded-2xl bg-background border-border hover:border-primary/40 group">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="text-orange-500 group-hover:scale-110 transition-transform" size={20} />
                            <span className="font-bold tracking-tight">Ver registros em atraso</span>
                        </div>
                        <ArrowUpRight className="opacity-40" size={18} />
                    </Button>
                    <Button variant="outline" className="w-full h-16 justify-between px-6 rounded-2xl bg-background border-border hover:border-red-500/40 group">
                        <div className="flex items-center gap-3">
                            <Users className="text-red-500 group-hover:scale-110 transition-transform" size={20} />
                            <span className="font-bold tracking-tight">Atividades sem Profissional</span>
                        </div>
                        <ArrowUpRight className="opacity-40" size={18} />
                    </Button>
                    <Button variant="outline" className="w-full h-16 justify-between px-6 rounded-2xl bg-background border-border hover:border-success/40 group">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-success group-hover:scale-110 transition-transform" size={20} />
                            <span className="font-bold tracking-tight">Relatório de Conclusão Mensal</span>
                        </div>
                        <ArrowUpRight className="opacity-40" size={18} />
                    </Button>
                </div>

            </div>
        </div>
    );
}

import { Badge } from '@/components/ui/badge';
