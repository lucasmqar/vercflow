"use client"

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
    Plus,
    Layers,
    Zap,
    Search,
    Filter,
    Activity,
    ShieldCheck,
    ArrowUpRight,
    LayoutGrid,
    List,
    MoreHorizontal,
    Radar,
    Smartphone,
    Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RegistroModal } from '@/components/shared/RegistroModal';
import { Record, DashboardTab } from '@/types';
import { ShaderAnimation } from '@/components/ui/ShaderAnimation';
import { Input } from '@/components/ui/input';

export function CaptureDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    const { user } = useAuth();
    const { registros, fetchRegistros, isLoading } = useRegistros();
    const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
    const [selectedParent, setSelectedParent] = useState<Record | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    useEffect(() => {
        fetchRegistros();
    }, []);

    const filteredRegistros = registros.filter(r =>
        r.texto?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.refCodigo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const recentRegistros = filteredRegistros.slice(0, 12);

    // Stats Calculation
    const stats = {
        inTriage: registros.filter(r => ['CAPTURE', 'TRIAGE', 'ANALYSIS'].includes(r.status)).length,
        today: registros.filter(r => {
            const today = new Date().toISOString().split('T')[0];
            return r.criadoEm.startsWith(today);
        }).length,
        critical: registros.filter(r => r.prioridade === 'CRITICA').length
    };

    return (
        <div className="flex flex-col min-h-full bg-background overflow-y-auto scrollbar-none pb-32 font-sans">
            {/* Header / Command Center */}
            <div className="w-full px-4 lg:px-8 pt-8 pb-12">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shadow-primary/5">
                                    <Radar size={20} className="animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground leading-none mb-1">Engenharia de Campo</span>
                                    <Badge variant="outline" className="border-border/40 text-muted-foreground bg-background text-[9px] font-black uppercase h-5">VERC OS v3.0 CAPTURE</Badge>
                                </div>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
                                Central de <br />
                                <span className="text-primary font-black">Operações</span>
                            </h1>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <Button
                                onClick={() => {
                                    setSelectedParent(null);
                                    setIsRegistroModalOpen(true);
                                }}
                                className="h-16 px-12 rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-widest gap-4 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <Plus size={20} strokeWidth={3} />
                                Iniciar Captura
                            </Button>

                            <div className="flex items-center gap-2 p-1 bg-background border border-border/40 rounded-[2rem] shadow-sm">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setViewMode('list')}
                                    className={cn("w-14 h-14 rounded-full transition-all", viewMode === 'list' ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-muted/50")}
                                >
                                    <List size={20} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setViewMode('grid')}
                                    className={cn("w-14 h-14 rounded-full transition-all", viewMode === 'grid' ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-muted/50")}
                                >
                                    <LayoutGrid size={20} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={Layers}
                            label="Fila de Triagem"
                            value={stats.inTriage}
                            desc="Aguardando distribuição"
                            color="text-blue-600"
                            bg="bg-blue-500/10"
                            gradient="from-background to-blue-500/5"
                        />
                        <StatCard
                            icon={Activity}
                            label="Fluxo Diário"
                            value={stats.today}
                            desc="Registros hoje"
                            color="text-indigo-600"
                            bg="bg-indigo-500/10"
                            gradient="from-background to-indigo-500/5"
                        />
                        <StatCard
                            icon={ShieldCheck}
                            label="Ocorrências Críticas"
                            value={stats.critical}
                            desc="Ação imediata necessária"
                            color="text-rose-600"
                            bg="bg-rose-500/10"
                            gradient="from-background to-rose-500/5"
                        />
                        <Card className="rounded-[2.5rem] bg-primary p-8 border-none flex flex-col justify-between shadow-xl shadow-primary/20 group cursor-pointer overflow-hidden relative">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                            <div className="relative z-10 text-primary-foreground">
                                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Capacidade</p>
                                <h3 className="text-3xl font-black tracking-tight">98.4%</h3>
                            </div>
                            <div className="relative z-10 flex items-center justify-between mt-8 text-primary-foreground text-xs font-black uppercase tracking-widest">
                                <span>Sincronização</span>
                                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 mb-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-6 p-6 rounded-[2.5rem] bg-background border border-border/40 shadow-xl shadow-black/5">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                            placeholder="Recuperar dados operacionais por código, autor ou descrição..."
                            className="h-14 pl-16 rounded-[1.5rem] bg-secondary/30 border-transparent text-sm font-medium focus-visible:ring-primary/20 placeholder:text-muted-foreground/40"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="h-14 rounded-[1.5rem] border-border/40 px-8 font-black text-[10px] uppercase tracking-widest gap-2 bg-background hover:bg-secondary">
                            <Filter size={16} /> FILTRAR
                        </Button>
                        <Button variant="outline" className="h-14 rounded-[1.5rem] border-border/40 px-8 font-black text-[10px] uppercase tracking-widest gap-2 text-foreground font-black bg-background hover:bg-secondary" onClick={() => fetchRegistros()}>
                            <Clock size={16} /> RECARREGAR
                        </Button>
                    </div>
                </div>
            </div>

            {/* Feed Section */}
            <div className="max-w-7xl mx-auto w-full px-4 lg:px-8">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-8 bg-primary rounded-full" />
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-foreground">Logs Operacionais</h2>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Streaming de dados técnicos de campo</p>
                        </div>
                    </div>
                    {filteredRegistros.length > 12 && (
                        <Button variant="link" className="text-[10px] font-black text-primary uppercase tracking-widest" onClick={() => onTabChange('triagem')}>
                            Ver Todos <ChevronRight size={14} className="ml-1" />
                        </Button>
                    )}
                </div>

                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 w-full bg-white/2 animate-pulse rounded-[2rem]" />
                            ))}
                        </div>
                    ) : viewMode === 'list' ? (
                        <div className="space-y-4">
                            {recentRegistros.map((reg, idx) => (
                                <RecordListCard
                                    key={reg.id}
                                    reg={reg}
                                    index={idx}
                                    onClick={() => onTabChange('triagem')}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentRegistros.map((reg, idx) => (
                                <RecordGridCard
                                    key={reg.id}
                                    reg={reg}
                                    index={idx}
                                    onClick={() => onTabChange('triagem')}
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {!isLoading && recentRegistros.length === 0 && (
                    <div className="py-32 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-primary flex items-center justify-center">
                            <Search size={32} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Nenhum registro encontrado</h3>
                        <p className="text-sm max-w-xs">Tente ajustar seus filtros ou termos de pesquisa.</p>
                    </div>
                )}
            </div>

            <RegistroModal
                isOpen={isRegistroModalOpen}
                onClose={() => setIsRegistroModalOpen(false)}
                onSuccess={fetchRegistros}
                parentRecord={selectedParent}
            />
        </div >
    );
}

function StatCard({ icon: Icon, label, value, desc, color, bg, gradient }: any) {
    return (
        <Card className={cn(
            "rounded-[2.5rem] border border-border/40 p-8 transition-all hover:shadow-xl group bg-gradient-to-br",
            gradient
        )}>
            <div className="flex justify-between items-start mb-6">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm shadow-black/5", bg, color)}>
                    <Icon size={24} />
                </div>
                <Badge variant="outline" className="border-border/40 text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">ACTIVE_FEED</Badge>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{label}</p>
            <h3 className="text-4xl font-black tracking-tighter mb-2 text-foreground">{value}</h3>
            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase leading-none">{desc}</p>
        </Card>
    );
}

function RecordListCard({ reg, index, onClick }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={onClick}
            className="group relative flex items-center gap-6 p-6 rounded-[2.5rem] bg-background border border-border/40 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer overflow-hidden"
        >
            <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 bg-primary transition-opacity" />

            <div className={cn(
                "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-border/20 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-all shadow-sm",
                reg.type === 'ESBOCO' ? "bg-purple-500/5 text-purple-500" :
                    reg.type === 'FOTO' ? "bg-orange-500/5 text-orange-500" : "bg-blue-500/5 shadow-sm"
            )}>
                {reg.type === 'ESBOCO' ? <Palette size={24} /> :
                    reg.type === 'FOTO' ? <Smartphone size={24} /> : <FileText size={24} />}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-lg font-black tracking-tight truncate text-foreground/80 group-hover:text-foreground transition-colors">
                        {reg.texto?.split('\n')[0] || 'Registro s/ Identificador'}
                    </h4>
                    <Badge className={cn(
                        "text-[9px] font-black uppercase tracking-widest h-5",
                        reg.prioridade === 'CRITICA' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                            reg.prioridade === 'ALTA' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/5 text-primary"
                    )}>
                        {reg.prioridade}
                    </Badge>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] font-black text-primary uppercase tracking-[0.2em]">{reg.refCodigo}</span>
                    <div className="w-[1px] h-3 bg-white/10" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 leading-none">
                        <Globe size={10} /> {reg.project?.nome || 'Log Geral'}
                    </span>
                    <div className="w-[1px] h-3 bg-white/10" />
                    <span className="text-[10px] font-bold text-muted-foreground opacity-60 flex items-center gap-1.5 leading-none">
                        <Clock size={10} /> {reg.criadoEm ? format(new Date(reg.criadoEm), "dd MMM · HH:mm", { locale: ptBR }) : '-'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-6 shrink-0 pr-2">
                <div className="hidden md:flex flex-col items-end">
                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest mb-1">{reg.status}</p>
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40 leading-none">Status::Core</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-background/50 border border-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all">
                    <ChevronRight size={20} />
                </div>
            </div>
        </motion.div>
    );
}

function RecordGridCard({ reg, index, onClick }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={onClick}
            className="group relative flex flex-col p-8 rounded-[3rem] bg-muted/5 border border-white/5 hover:border-primary/20 hover:bg-muted/10 transition-all cursor-pointer overflow-hidden aspect-square md:aspect-auto min-h-[300px]"
        >
            <div className="flex justify-between items-start mb-8">
                <div className={cn(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center border border-white/5 shadow-inner",
                    reg.type === 'ESBOCO' ? "bg-purple-500/10 text-purple-500" :
                        reg.type === 'FOTO' ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"
                )}>
                    {reg.type === 'ESBOCO' ? <Palette size={28} /> :
                        reg.type === 'FOTO' ? <Smartphone size={28} /> : <FileText size={28} />}
                </div>
                <Badge variant="outline" className="text-[9px] font-black border-white/5 uppercase tracking-widest text-muted-foreground">
                    {reg.refCodigo}
                </Badge>
            </div>

            <div className="flex-1 space-y-4">
                <Badge className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-2",
                    reg.prioridade === 'CRITICA' ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                )}>
                    {reg.prioridade}
                </Badge>
                <h4 className="text-xl font-black leading-tight tracking-tight line-clamp-3">
                    {reg.texto || 'Ocorrência de Campo sem Descrição Técnica'}
                </h4>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest mb-1">{reg.project?.nome || 'Log Geral'}</p>
                    <p className="text-[10px] font-bold text-muted-foreground lower opacity-60">
                        {reg.criadoEm ? format(new Date(reg.criadoEm), "dd MMM · HH:mm", { locale: ptBR }) : '-'}
                    </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <ChevronRight size={18} />
                </div>
            </div>
        </motion.div>
    );
}

export default CaptureDashboard;
