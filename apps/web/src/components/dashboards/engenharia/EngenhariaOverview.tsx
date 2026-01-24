import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, AlertCircle, ShoppingCart, Users, Zap, FileText, AlertTriangle, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EngenhariaRequests } from '../EngenhariaRequests';

export function EngenhariaOverview({ projects, requestsCount, activeProjectsCount, onNavigate }: any) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="rounded-[2rem] p-6 bg-gradient-to-br from-background to-muted/20 border-border/40 hover:shadow-lg transition-all group cursor-pointer" onClick={() => onNavigate('projects')}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Building2 size={24} />
                        </div>
                        <Badge variant="outline" className="rounded-full px-3 py-1 bg-background/50 backdrop-blur">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                            Ativo
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Obras em Gestão</p>
                        <p className="text-4xl font-black mt-1 tracking-tight">{activeProjectsCount}</p>
                    </div>
                </Card>

                <Card className="rounded-[2rem] p-6 bg-gradient-to-br from-background to-muted/20 border-border/40 hover:shadow-lg transition-all group cursor-pointer" onClick={() => onNavigate('budgets')}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                            <FileText size={24} />
                        </div>
                        <Badge variant="outline" className="rounded-full px-3 py-1 bg-background/50 backdrop-blur text-amber-600 border-amber-200">
                            3 Pendentes
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Orçamentos</p>
                        <p className="text-4xl font-black mt-1 tracking-tight">3</p>
                    </div>
                </Card>

                <Card className="rounded-[2rem] p-6 bg-gradient-to-br from-background to-muted/20 border-border/40 hover:shadow-lg transition-all group cursor-pointer" onClick={() => onNavigate('supply')}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <ShoppingCart size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Requisições</p>
                        <p className="text-4xl font-black mt-1 tracking-tight">12</p>
                    </div>
                </Card>

                <Card className="rounded-[2rem] p-6 bg-gradient-to-br from-background to-muted/20 border-border/40 hover:shadow-lg transition-all group cursor-pointer" onClick={() => onNavigate('team')}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Equipe Campo</p>
                        <p className="text-4xl font-black mt-1 tracking-tight">45</p>
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
                                Linha do Tempo
                            </h3>
                            <Button variant="ghost" size="sm" className="hidden sm:flex">Ver Tudo</Button>
                        </div>

                        <div className="relative pl-4 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/30">
                            {[
                                { title: 'Revisão de Projeto Elétrico', user: 'Eng. Carlos', time: 'Há 2 horas', type: 'REV', project: 'Residencial Sky' },
                                { title: 'Aprovação Orçamento Hidráulica', user: 'Fin. Ana', time: 'Ontem', type: 'APR', project: 'Galpão Alpha' },
                                { title: 'RDO #45 Enviado', user: 'Mestre Silva', time: 'Ontem', type: 'RDO', project: 'Residencial Sky' },
                                { title: 'Solicitação de Concreto (20m³)', user: 'Eng. Pedro', time: '22 Jan', type: 'REQ', project: 'Novo Centro Médico' }
                            ].map((log, i) => (
                                <div key={i} className="relative pl-8 group">
                                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-background border-4 border-primary group-hover:scale-110 transition-transform z-10" />
                                    <div className="p-4 rounded-2xl bg-background border border-border/40 hover:border-primary/20 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-foreground text-sm">{log.title}</p>
                                                <p className="text-xs text-muted-foreground font-medium mt-1">{log.project}</p>
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

                {/* Quick Alerts / Requests */}
                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] bg-amber-500/5 border-amber-500/10 p-6">
                        <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 text-amber-700 mb-4">
                            <Zap size={16} /> Prioridade Alta
                        </h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-background rounded-2xl border border-amber-500/20 shadow-sm flex items-start gap-3">
                                <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-foreground">Validação de Escopo</p>
                                    <p className="text-xs text-muted-foreground mt-1">Lead "Novo Centro Médico" aguardando aprovação técnica.</p>
                                    <Button size="sm" variant="ghost" className="h-8 mt-2 text-amber-600 font-bold text-xs p-0 hover:bg-transparent hover:text-amber-700" onClick={() => onNavigate('budgets')}>
                                        Revisar Agora <ChevronRight size={14} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[2.5rem] bg-background border-border/40 p-6 h-full">
                        <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-4">
                            <AlertTriangle size={16} className="text-destructive" /> Bloqueios
                        </h3>
                        <div className="flex flex-col items-center justify-center h-[150px] text-center">
                            <CheckCircle2 size={40} className="text-emerald-500 mb-3 opacity-20" />
                            <p className="text-sm font-medium text-muted-foreground">Nenhum bloqueio crítico</p>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1">SST & Qualidade OK</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
