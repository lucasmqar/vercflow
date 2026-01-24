import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    TrendingUp, Users, Target, Clock, Zap, AlertCircle, ChevronRight, CheckCircle2, DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function ComercialOverview({ stats, onNavigate }: any) {
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
                {/* Recent Activity / Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-sm p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-lg flex items-center gap-3">
                                <Clock className="text-primary" />
                                Atividade Recente
                            </h3>
                            <Button variant="ghost" size="sm" className="hidden sm:flex">Ver Tudo</Button>
                        </div>

                        <div className="relative pl-4 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/30">
                            {[
                                { title: 'Novo Lead Qualificado', user: 'Comercial Ana', time: 'Há 15 min', type: 'LEAD', desc: 'Residencial Altos do Ipê cadastrado.' },
                                { title: 'Proposta Enviada', user: 'Gerente Roberto', time: 'Há 2 horas', type: 'PROP', desc: 'Proposta #254 para Cliente Corporativo A.' },
                                { title: 'Orçamento Validado', user: 'Engenharia', time: 'Ontem', type: 'ENG', desc: 'Validação técnica concluída para Obra Beta.' },
                            ].map((log, i) => (
                                <div key={i} className="relative pl-8 group">
                                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-background border-4 border-primary group-hover:scale-110 transition-transform z-10" />
                                    <div className="p-4 rounded-2xl bg-background border border-border/40 hover:border-primary/20 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-foreground text-sm">{log.title}</p>
                                                <p className="text-xs text-muted-foreground font-medium mt-1">{log.desc}</p>
                                            </div>
                                            <Badge variant="secondary" className="text-[10px] font-bold">{log.time}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                                {log.user.charAt(0)}
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-muted-foreground">{log.user}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Quick Actions / Alerts */}
                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] bg-indigo-500/5 border-indigo-500/10 p-6">
                        <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 text-indigo-700 mb-4">
                            <Zap size={16} /> Ações Recomendadas
                        </h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-background rounded-2xl border border-indigo-500/20 shadow-sm flex items-start gap-3">
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

                    <Card className="rounded-[2.5rem] bg-background border-border/40 p-6 h-full flex flex-col justify-center items-center text-center">
                        <CheckCircle2 size={40} className="text-emerald-500 mb-3 opacity-20" />
                        <p className="text-sm font-medium text-muted-foreground">Metas do Mês</p>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1">85% Atingido</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
