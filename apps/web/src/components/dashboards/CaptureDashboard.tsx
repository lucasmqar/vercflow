import React, { useState, useEffect } from 'react';
import { useRegistros } from '@/hooks/useRegistros';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
    Palette,
    FileText,
    Clock,
    ChevronRight,
    TrendingUp,
    MessageSquare,
    Plus,
    Layers,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RegistroModal } from '@/components/shared/RegistroModal';
import { Record } from '@/types';

export function CaptureDashboard() {
    const { user } = useAuth();
    const { registros, fetchRegistros } = useRegistros();
    const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
    const [selectedParent, setSelectedParent] = useState<Record | null>(null);

    useEffect(() => {
        fetchRegistros();
    }, []);

    const recentRegistros = registros.slice(0, 8);

    return (
        <div className="flex flex-col min-h-full bg-background/50 overflow-y-auto scrollbar-thin">

            {/* Header / Hero Section - Technical Hub */}
            <div className="max-w-6xl mx-auto w-full px-8 pt-12 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="glass-card rounded-2xl p-10 relative overflow-hidden group border-primary/10"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.01] pointer-events-none" />
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <Badge variant="outline" className="px-2 py-0.5 rounded-md font-mono text-[10px] font-black uppercase tracking-[0.2em] border-primary/20 text-primary bg-primary/5">Vercflow Operations Hub</Badge>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground font-sans leading-none">
                                Central de <span className="text-primary">Captura</span>
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-base max-w-lg leading-relaxed font-medium">
                                Pipeline de digitalização de campo. Registre ocorrências, inspeções e desdobramentos operacionais com sincronização de baixa latência.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <Button
                                onClick={() => {
                                    setSelectedParent(null);
                                    setIsRegistroModalOpen(true);
                                }}
                                className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-black uppercase tracking-widest gap-3 shadow-glow hover:translate-y-[-1px] active:scale-95 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Iniciar Novo Registro
                            </Button>
                            <div className="flex items-center justify-center md:justify-start gap-4 px-2">
                                <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Sistema Online
                                </div>
                                <div className="w-[1px] h-3 bg-border/40" />
                                <div className="font-mono text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    {registros.length} Ativos Detectados
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Stats / Analytical Overlay */}
            <div className="max-w-6xl mx-auto w-full px-8 grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                {[
                    { label: 'Fluxo em Triagem', value: registros.filter(r => r.status === 'TRIAGEM').length, icon: Layers, color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
                    { label: 'Ocorrências Hoje', value: '14', icon: Zap, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20' },
                    { label: 'Nível de Resposta', value: '98.2%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
                    { label: 'Sync Latency', value: '24ms', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + (idx * 0.1) }}
                    >
                        <div className={cn(
                            "group p-5 rounded-xl border bg-background/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/30",
                            stat.border
                        )}>
                            <div className="flex items-center justify-between mb-3">
                                <div className={cn("p-2 rounded-lg", stat.bg, stat.color)}>
                                    <stat.icon size={16} strokeWidth={2.5} />
                                </div>
                                <span className="font-mono text-[10px] font-black text-muted-foreground/30 uppercase">Metric::{idx + 1}</span>
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">{stat.label}</p>
                            <p className="text-2xl font-black font-sans tracking-tight">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Technical Feed / Recent Timeline */}
            <div className="max-w-6xl mx-auto w-full px-8 pb-20">
                <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex flex-col">
                        <span className="font-mono text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] mb-1">Operational Logs</span>
                        <h2 className="text-xl font-black tracking-tight text-foreground/80">Monitoramento em Tempo Real</h2>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-lg text-[10px] font-black uppercase tracking-widest gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all px-4">
                        Database History <ChevronRight size={14} />
                    </Button>
                </div>

                <div className="grid gap-3">
                    <AnimatePresence mode="popLayout">
                        {recentRegistros.map((reg, idx) => (
                            <motion.div
                                key={reg.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.04) }}
                                className="glass-card p-4 rounded-xl border border-border/40 flex items-center justify-between group cursor-pointer transition-all duration-300 hover:translate-x-1 hover:border-primary/20 shadow-none"
                            >
                                <div className="flex items-center gap-5 min-w-0">
                                    <div className={cn(
                                        "w-11 h-11 rounded-lg flex items-center justify-center border transition-all duration-300",
                                        reg.type === 'ESBOCO' ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-500" : "bg-muted/30 border-border/40 text-muted-foreground"
                                    )}>
                                        {reg.type === 'ESBOCO' ? <Palette size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div className="min-w-0 flex flex-col gap-0.5">
                                        <h4 className="text-sm font-bold tracking-tight text-foreground/80 truncate group-hover:text-foreground transition-colors">
                                            {reg.texto?.split('\n')[0] || 'Registro de Campo sem Identificador'}
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-[10px] font-black text-primary/40 uppercase tracking-widest">{reg.refCodigo}</span>
                                            <div className="w-[1px] h-2 bg-border/40" />
                                            <span className="font-mono text-[9px] font-bold text-muted-foreground/60 uppercase">{reg.author?.nome}</span>
                                            <div className="w-[1px] h-2 bg-border/40" />
                                            <span className="font-mono text-[9px] font-bold text-muted-foreground/40 uppercase">
                                                {reg.criadoEm ? format(new Date(reg.criadoEm), "dd MMM · HH:mm", { locale: ptBR }) : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 shrink-0">
                                    <div className="hidden sm:flex flex-col items-end gap-1">
                                        <Badge className={cn(
                                            "text-[9px] font-black uppercase tracking-widest h-5 rounded-md border px-2",
                                            reg.status === 'TRIAGEM' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                                reg.status === 'CONCLUIDO' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                    "bg-primary/5 text-primary border-primary/20"
                                        )}>
                                            {reg.status}
                                        </Badge>
                                        <span className="text-[9px] font-mono font-bold text-muted-foreground/30 uppercase tracking-tighter">Status::System</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-border/40 bg-muted/5 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                                        <ChevronRight size={16} className="text-muted-foreground/40 group-hover:text-primary transition-all" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <RegistroModal
                isOpen={isRegistroModalOpen}
                onClose={() => setIsRegistroModalOpen(false)}
                onSuccess={fetchRegistros}
                parentRecord={selectedParent}
            />
        </div>
    );
}
