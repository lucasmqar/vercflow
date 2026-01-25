import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    TrendingUp, Users, Target, Clock, Zap, AlertCircle, ChevronRight, CheckCircle2, DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

import { useAppFlow } from '@/store/useAppFlow';

export function ComercialOverview({ stats, onNavigate }: any) {
    const { leads, budgets, proposals, projects } = useAppFlow();
    const { totalPipeline, activeLeads, pendingProposals, conversionRate } = stats;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Pipeline */}
                <Card className="rounded-[2rem] p-6 bg-gradient-to-br from-background to-blue-500/5 border-border/40 hover:shadow-lg transition-all group cursor-pointer" onClick={() => onNavigate('leads')}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <TrendingUp size={24} />
                        </div>
                        <Badge variant="outline" className="rounded-full px-3 py-1 bg-background/50 backdrop-blur text-emerald-500 border-emerald-500/20">
                            +12.5%
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Pipeline Total</p>
                        <p className="text-3xl font-black mt-1 tracking-tight truncate">{totalPipeline.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' })}</p>
                    </div>
                </Card>

                {/* Active Leads */}
                <Card className="rounded-[2rem] p-6 bg-gradient-to-br from-background to-orange-500/5 border-border/40 hover:shadow-lg transition-all group cursor-pointer" onClick={() => onNavigate('leads')}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                        <Badge variant="outline" className="rounded-full px-3 py-1 bg-background/50 backdrop-blur text-emerald-500 border-emerald-500/20">
                            +4
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Leads Ativos</p>
                        <p className="text-3xl font-black mt-1 tracking-tight">{activeLeads}</p>
                    </div>
                </Card>

                {/* Conversion Rate */}
                <Card className="rounded-[2rem] p-6 bg-gradient-to-br from-background to-emerald-500/5 border-border/40 hover:shadow-lg transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <Target size={24} />
                        </div>
                        <Badge variant="outline" className="rounded-full px-3 py-1 bg-background/50 backdrop-blur text-rose-500 border-rose-500/20">
                            -2.1%
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Conversão</p>
                        <p className="text-3xl font-black mt-1 tracking-tight">{conversionRate || '18.5%'}</p>
                    </div>
                </Card>

                {/* Pending Proposals */}
                <Card className="rounded-[2rem] p-6 bg-gradient-to-br from-background to-purple-500/5 border-border/40 hover:shadow-lg transition-all group cursor-pointer" onClick={() => onNavigate('proposals')}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Propostas</p>
                        <p className="text-3xl font-black mt-1 tracking-tight">{pendingProposals}</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pipeline Summary */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-2xl border-white/5 bg-background/40 backdrop-blur-sm p-8">
                        <h3 className="font-black text-lg flex items-center gap-3 mb-8">
                            <Target className="text-primary" />
                            Pipeline por Estágio
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Leads', count: leads?.length || 0, color: 'bg-orange-500', target: 'leads' },
                                { label: 'Orçamentos', count: budgets?.length || 0, color: 'bg-blue-500', target: 'budgets' },
                                { label: 'Propostas', count: proposals?.length || 0, color: 'bg-purple-500', target: 'proposals' },
                                { label: 'Obras Ativas', count: projects?.length || 0, color: 'bg-emerald-500', target: 'pipeline' }
                            ].map((stage, i) => (
                                <div key={stage.label} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group" onClick={() => onNavigate(stage.target)}>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 group-hover:text-primary transition-colors">{stage.label}</p>
                                    <div className="flex items-end gap-2">
                                        <p className="text-2xl font-black">{stage.count}</p>
                                        <div className={cn("w-1.5 h-1.5 rounded-full mb-2", stage.color)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-white/5 bg-background/40 backdrop-blur-sm p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-lg flex items-center gap-3">
                                <Clock className="text-primary" />
                                Atividade Recente
                            </h3>
                            <Button variant="ghost" size="sm" className="hidden sm:flex">Ver Tudo</Button>
                        </div>

                        {/* Vertical Pill Timeline */}
                        <div className="space-y-4">
                            {[
                                {
                                    title: 'Novo Lead Qualificado',
                                    user: 'Ana Costa',
                                    role: 'Comercial',
                                    time: 'Há 15 min',
                                    type: 'LEAD',
                                    desc: 'Residencial Altos do Ipê - 450m² - Residencial Alto Padrão',
                                    value: 'R$ 1.2M',
                                    status: 'success'
                                },
                                {
                                    title: 'Proposta Enviada',
                                    user: 'Roberto Silva',
                                    role: 'Gerente',
                                    time: 'Há 2 horas',
                                    type: 'PROP',
                                    desc: 'Proposta #254 - Corporativo Phoenix Inc. - Revisão v2',
                                    value: 'R$ 2.8M',
                                    status: 'pending'
                                },
                                {
                                    title: 'Orçamento Validado',
                                    user: 'Equipe Engenharia',
                                    role: 'Técnico',
                                    time: 'Ontem',
                                    type: 'ENG',
                                    desc: 'Obra Beta Industrial - Estrutura metálica aprovada',
                                    value: '',
                                    status: 'info'
                                },
                                {
                                    title: 'Cliente Retornou',
                                    user: 'Sistema',
                                    role: 'Automação',
                                    time: 'Há 1 dia',
                                    type: 'FOLLOW',
                                    desc: 'Galpão Logístico Delta pediu ajustes no prazo',
                                    value: '',
                                    status: 'warning'
                                },
                            ].map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative"
                                >
                                    <div className={cn(
                                        "relative p-5 rounded-2xl border-2 transition-all duration-300",
                                        "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
                                        log.status === 'success' ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40" :
                                            log.status === 'pending' ? "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40" :
                                                log.status === 'warning' ? "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40" :
                                                    "bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40"
                                    )}>
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0",
                                                    log.status === 'success' ? "bg-emerald-500/10 text-emerald-600" :
                                                        log.status === 'pending' ? "bg-blue-500/10 text-blue-600" :
                                                            log.status === 'warning' ? "bg-amber-500/10 text-amber-600" :
                                                                "bg-purple-500/10 text-purple-600"
                                                )}>
                                                    {log.type}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-black text-sm text-foreground leading-tight">{log.title}</p>
                                                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{log.desc}</p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className="text-[9px] font-black uppercase tracking-wider shrink-0 ml-2"
                                            >
                                                {log.time}
                                            </Badge>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/20">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                                                    log.status === 'success' ? "bg-emerald-500/20 text-emerald-700" :
                                                        log.status === 'pending' ? "bg-blue-500/20 text-blue-700" :
                                                            log.status === 'warning' ? "bg-amber-500/20 text-amber-700" :
                                                                "bg-purple-500/20 text-purple-700"
                                                )}>
                                                    {log.user.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-foreground">{log.user}</p>
                                                    <p className="text-[9px] text-muted-foreground font-medium">{log.role}</p>
                                                </div>
                                            </div>
                                            {log.value && (
                                                <Badge className="bg-background/50 text-foreground border border-border/40 font-black text-xs">
                                                    {log.value}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Hover Indicator */}
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight size={16} className="text-muted-foreground" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Quick Actions / Alerts */}
                <div className="space-y-6">
                    <Card className="rounded-2xl bg-indigo-500/5 border-indigo-500/10 p-6">
                        <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 text-indigo-700 mb-4">
                            <Zap size={16} /> Ações Recomendadas
                        </h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-background rounded-2xl border border-indigo-500/20 shadow-sm flex items-start gap-3 group hover:border-indigo-500/40 transition-all">
                                <DollarSign size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-foreground">Follow-up Proposta</p>
                                    <p className="text-xs text-muted-foreground mt-1">Proposta "Galpão Ind. Zeta" vence amanhã.</p>
                                    <Button size="sm" variant="ghost" className="h-8 mt-2 text-indigo-600 font-bold text-xs p-0 hover:bg-transparent hover:text-indigo-700">
                                        Contatar Cliente <ChevronRight size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl bg-rose-500/5 border-rose-500/10 p-6">
                        <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 text-rose-700 mb-4">
                            <AlertCircle size={16} /> Gestão do Sistema
                        </h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-background rounded-2xl border border-rose-500/10 shadow-sm">
                                <p className="text-[10px] font-black uppercase text-rose-500 mb-1">Ambiente de Testes</p>
                                <p className="text-xs text-muted-foreground mb-4 font-medium leading-relaxed">
                                    Reseta todas as tabelas comerciais e injeta dados de alta fidelidade para homologação de PDFs.
                                </p>
                                <Button
                                    onClick={() => {
                                        const confirm = window.confirm("Isso apagará todos os dados atuais e reiniciará o sistema com dados de teste. Continuar?");
                                        if (confirm) {
                                            useAppFlow.getState().resetAndSeed();
                                            window.location.reload();
                                        }
                                    }}
                                    variant="destructive"
                                    className="w-full rounded-xl font-black uppercase tracking-widest text-[10px] h-10 shadow-lg shadow-rose-500/20"
                                >
                                    Reinicializar Database
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl bg-background border-border/40 p-6 h-full flex flex-col justify-center items-center text-center">
                        <CheckCircle2 size={40} className="text-emerald-500 mb-3 opacity-20" />
                        <p className="text-sm font-medium text-muted-foreground">Metas do Mês</p>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1">85% Atingido</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
