import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Calendar,
    CheckCircle2,
    Clock,
    Filter,
    Layout,
    Search,
    Settings2,
    AlertCircle,
    MoreVertical,
    ChevronRight,
    TrendingUp,
    Target,
    Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DashboardTab } from '@/types';

export function ProjectManagementDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch(getApiUrl('/api/activities'));
                if (res.ok) setActivities(await res.json());
            } catch (error) {
                toast.error('Erro ao carregar atividades do portfólio');
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const filtered = activities.filter(a =>
        a.titulo.toLowerCase().includes(filter.toLowerCase()) ||
        a.project?.nome.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="flex-1 flex flex-col bg-background/50 h-full overflow-hidden font-sans">
            {/* Control Bar */}
            <div className="p-6 border-b border-border/40 bg-background/95 backdrop-blur-md shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter">Gestão de Projetos</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-60">Visão Multi-Projeto · Verc Intelligence</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Filtrar por nome ou código..."
                                className="pl-10 h-11 w-72 rounded-xl bg-background border-border/60 text-sm"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-11 rounded-xl gap-2 font-black uppercase tracking-widest text-[10px] px-4">
                            <Filter size={14} /> Filtro
                        </Button>
                        <Button className="h-11 rounded-xl font-black uppercase tracking-widest text-[10px] px-6 shadow-glow">Novo Plano</Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Obras no Prazo', value: '4/5', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-500/10' },
                        { label: 'Meta de Produção', value: '92%', icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
                        { label: 'Atividades Fechadas', value: '142', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
                        { label: 'Times Ativos', value: '12', icon: Users, color: 'text-purple-600', bg: 'bg-purple-500/10' },
                    ].map((idx) => (
                        <div key={idx.label} className="flex items-center gap-4 p-4 rounded-2xl bg-background border border-border/40 transition-all hover:border-primary/20">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", idx.bg)}><idx.icon size={18} className={idx.color} /></div>
                            <div>
                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{idx.label}</p>
                                <p className="text-lg font-black tracking-tight leading-none">{idx.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col p-6 space-y-6 scrollbar-none">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 h-full min-h-0">
                    <div className="lg:col-span-2 flex flex-col space-y-6 min-h-0">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/80">Monitoramento em Tempo Real</h3>
                            <Badge variant="outline" className="text-[9px] px-3 font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">Sincronizado</Badge>
                        </div>

                        <ScrollArea className="flex-1 rounded-2xl border border-border/40 bg-background/40 backdrop-blur-sm">
                            <div className="p-1">
                                <AnimatePresence>
                                    {filtered.map((activity, i) => (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-all border-b border-border/10 last:border-0"
                                        >
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background border border-border/40 shrink-0">
                                                    <Badge variant="outline" className="text-[10px] font-black">{activity.discipline?.codigo || 'GP'}</Badge>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter opacity-60">{activity.status}</Badge>
                                                        <span className="text-[10px] font-mono text-muted-foreground">ID {activity.id.slice(-4).toUpperCase()}</span>
                                                    </div>
                                                    <h4 className="text-sm font-bold tracking-tight truncate group-hover:text-primary transition-colors">{activity.titulo}</h4>
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-1.5 opacity-60">
                                                        <Users size={10} /> {activity.assignments?.[0]?.professional?.nome || 'NÃO DESIGNADO'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 shrink-0">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Prazo</p>
                                                    <div className="flex items-center gap-1.5 text-xs font-bold">
                                                        <Clock size={12} className="text-muted-foreground/40" />
                                                        {new Date(activity.dataFim).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                                    </div>
                                                </div>
                                                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-primary hover:text-white transition-all">
                                                    <ChevronRight size={14} />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="flex flex-col space-y-6 min-h-0">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/80">Plano de Prioridades</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={async () => {
                                    toast.promise(
                                        async () => {
                                            // Search for the first active project to demo report
                                            const res = await fetch(getApiUrl('/api/projects'));
                                            const projects = await res.json();
                                            if (projects.length === 0) throw new Error('Nenhum projeto encontrado');

                                            const reportUrl = getApiUrl(`/api/projects/${projects[0].id}/report`);
                                            window.open(reportUrl, '_blank');
                                        },
                                        {
                                            loading: 'Sincronizando dados e gerando relatório técnico...',
                                            success: 'Relatório VERCFLOW gerado com sucesso!',
                                            error: 'Erro ao processar relatório do ecossistema.'
                                        }
                                    );
                                }}
                                className="h-6 rounded-lg text-[10px] font-black text-primary/60 uppercase"
                            >
                                Gerar PDF <BarChart3 size={12} className="ml-1" />
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 rounded-2xl border border-border/40 bg-background/40 backdrop-blur-sm p-4">
                            <div className="space-y-6">
                                {[
                                    { obra: 'Casa Lago Sul', status: 'CRÍTICO', tasks: 12, trend: 'up' },
                                    { obra: 'Edifício Mirante', status: 'NOTÁVEL', tasks: 8, trend: 'neutral' },
                                    { obra: 'Mansão Alpha', status: 'PLANEJADO', tasks: 24, trend: 'up' },
                                ].map((item) => (
                                    <div key={item.obra} className="space-y-3 p-4 rounded-xl bg-background/50 border border-border/40">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{item.obra}</span>
                                            <Badge variant={item.status === 'CRÍTICO' ? 'destructive' : 'outline'} className="text-[9px] font-black px-2">{item.status}</Badge>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-xl font-black">{item.tasks}</p>
                                                <p className="text-[9px] font-black uppercase text-muted-foreground/60 leading-none">Ações Pendentes</p>
                                            </div>
                                            <div className={cn("w-1.5 h-6 rounded-full", item.status === 'CRÍTICO' ? 'bg-red-500 shadow-glow-red' : 'bg-primary')} />
                                        </div>
                                    </div>
                                ))}

                                <div className="p-4 rounded-xl border border-dashed border-border/60 bg-muted/20 flex flex-col items-center justify-center py-8 text-center">
                                    <AlertCircle size={24} className="text-muted-foreground/40 mb-3" />
                                    <h5 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Insights de Portfólio</h5>
                                    <p className="text-[10px] text-muted-foreground/60 mt-1">Gere análises preditivas para otimizar prazos em múltiplos canteiros.</p>
                                    <Button variant="ghost" className="mt-4 h-8 rounded-lg text-[9px] font-black uppercase tracking-widest border border-border/60">Analisar agora</Button>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}
