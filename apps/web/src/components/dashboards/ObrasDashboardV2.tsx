import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2, Plus, Columns, List, LayoutGrid, Users, DollarSign, FileText,
    Settings, Truck, Zap, Search, TrendingUp, Calendar, CheckCircle2, AlertCircle, MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Project, Client, DashboardTab } from '@/types';
import { getApiUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import AnimatedTextCycle from '@/components/ui/AnimatedTextCycle';

export function ObrasDashboardV2({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeTab, setActiveTab] = useState('ativas');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProjects();
    }, [activeTab]);

    const fetchProjects = async () => {
        try {
            let statusFilter = '';
            if (activeTab === 'ativas') statusFilter = '?status=ATIVA';
            else if (activeTab === 'orcamentos') statusFilter = '?status=ORCAMENTO';
            else if (activeTab === 'concluidas') statusFilter = '?status=CONCLUIDA';

            const res = await fetch(getApiUrl(`/api/projects${statusFilter}`));
            if (res.ok) setProjects(await res.json());
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getProjectProgress = (p: Project) => {
        // Mock progress calculation
        if (p.status === 'CONCLUIDA') return 100;
        if (p.status === 'ORCAMENTO') return Math.floor(Math.random() * 30);
        return Math.floor(Math.random() * 80) + 20;
    };

    const getHealthStatus = (p: Project) => {
        const rand = Math.random();
        if (rand > 0.7) return { prazo: 'critical', budget: 'warning', docs: 'ok' };
        if (rand > 0.4) return { prazo: 'warning', budget: 'ok', docs: 'ok' };
        return { prazo: 'ok', budget: 'ok', docs: 'ok' };
    };

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b bg-background/95 backdrop-blur-sm shrink-0">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-black tracking-tighter">Centro de Comando</h1>
                            <AnimatedTextCycle
                                words={['de Engenharia', 'Estratégico', 'Operacional', 'High-End']}
                                className="text-3xl font-black tracking-tighter text-primary"
                                interval={3000}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-60">
                            VERC Intelligence - Lifecycle v2.5
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex p-1 bg-muted/20 rounded-xl border border-border/40">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewMode('grid')}
                                className={cn('h-8 w-8 rounded-lg', viewMode === 'grid' && 'bg-background shadow-sm text-primary')}
                            >
                                <LayoutGrid size={14} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewMode('list')}
                                className={cn('h-8 w-8 rounded-lg', viewMode === 'list' && 'bg-background shadow-sm text-primary')}
                            >
                                <List size={14} />
                            </Button>
                        </div>
                        <div className="w-px h-8 bg-border/40 mx-1" />
                        <Button
                            onClick={() => onTabChange('obras')}
                            className="h-10 rounded-xl font-black uppercase tracking-widest px-6 shadow-glow bg-primary"
                        >
                            <Plus size={16} className="mr-2" /> Ativar Obra
                        </Button>
                    </div>
                </div>

                {/* Quick Access Panel */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
                    {[
                        { label: 'Novo Cliente', icon: Users, color: 'bg-blue-500/10 text-blue-600', action: () => onTabChange('clientes') },
                        { label: 'Controle de Frota', icon: Truck, color: 'bg-orange-500/10 text-orange-600', action: () => onTabChange('estoque') },
                        { label: 'Atividades IA', icon: Zap, color: 'bg-primary/10 text-primary', action: () => onTabChange('atividades') },
                        { label: 'Financeiro', icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-600', action: () => onTabChange('financeiro') },
                        { label: 'Documentação', icon: FileText, color: 'bg-zinc-500/10 text-zinc-600', action: () => onTabChange('gestao-projetos') },
                        { label: 'Configurações', icon: Settings, color: 'bg-secondary/10 text-muted-foreground', action: () => onTabChange('config') },
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            onClick={item.action}
                            className="group flex flex-col items-center justify-center p-4 rounded-3xl bg-background/40 border border-border/40 hover:border-primary/40 hover:bg-background/80 transition-all"
                        >
                            <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm', item.color)}>
                                <item.icon size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 group-hover:text-foreground transition-colors">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search & Tabs */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar obras, clientes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 h-11 rounded-xl bg-background/60 border-border/40"
                        />
                    </div>
                </div>
            </div>

            {/* Tabs & Content */}
            <div className="flex-1 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <div className="px-6 pt-4 border-b">
                        <TabsList className="bg-muted/20">
                            <TabsTrigger value="ativas" className="font-bold">
                                Obras Ativas ({filteredProjects.filter(p => p.status === 'ATIVA').length})
                            </TabsTrigger>
                            <TabsTrigger value="orcamentos" className="font-bold">
                                Orçamentos ({filteredProjects.filter(p => p.status === 'ORCAMENTO').length})
                            </TabsTrigger>
                            <TabsTrigger value="concluidas" className="font-bold">
                                Concluídas ({filteredProjects.filter(p => p.status === 'CONCLUIDA').length})
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                        <TabsContent value={activeTab} className="mt-0">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full" />
                                </div>
                            ) : (
                                <div className={cn(
                                    viewMode === 'grid'
                                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                        : "space-y-4"
                                )}>
                                    {filteredProjects.map((p, idx) => (
                                        <EnhancedProjectCard
                                            key={p.id}
                                            project={p}
                                            progress={getProjectProgress(p)}
                                            health={getHealthStatus(p)}
                                            viewMode={viewMode}
                                            onClick={() => navigate(`/obras/${p.id}`)}
                                            onTabChange={onTabChange}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

function EnhancedProjectCard({ project, progress, health, viewMode, onClick, onTabChange }: any) {
    const statusColors: Record<string, string> = {
        ATIVA: 'bg-green-500/10 text-green-600',
        ORCAMENTO: 'bg-blue-500/10 text-blue-600',
        CONCLUIDA: 'bg-purple-500/10 text-purple-600',
        NEGOCIACAO: 'bg-orange-500/10 text-orange-600'
    };

    const healthIcons: Record<string, any> = {
        ok: { color: 'text-green-600', icon: CheckCircle2 },
        warning: { color: 'text-yellow-600', icon: AlertCircle },
        critical: { color: 'text-red-600', icon: AlertCircle }
    };

    if (viewMode === 'list') {
        return (
            <Card className="cursor-pointer hover:shadow-xl transition-all rounded-2xl" onClick={onClick}>
                <CardContent className="p-6 flex items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className={cn('text-[9px] font-black px-3 py-1 rounded-full', statusColors[project.status])}>
                                {project.status}
                            </Badge>
                            <p className="text-xs font-black text-primary uppercase tracking-widest">{project.codigoInterno}</p>
                        </div>
                        <h3 className="text-lg font-bold mb-1">{project.nome}</h3>
                        <p className="text-sm text-muted-foreground">{project.client?.nome || 'Cliente não vinculado'}</p>
                    </div>
                    <div className="w-32">
                        <Progress value={progress} className="h-2 mb-2" />
                        <p className="text-xs text-muted-foreground text-center">{progress}% concluído</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card
                onClick={onClick}
                className="group cursor-pointer rounded-[2.5rem] overflow-hidden border-border/40 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-background/60 backdrop-blur-xl"
            >
                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{project.codigoInterno}</p>
                            <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{project.nome}</h3>
                        </div>
                        <Badge variant="outline" className={cn('text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full', statusColors[project.status])}>
                            {project.status}
                        </Badge>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-muted-foreground">Progresso Geral</span>
                            <span className="text-xs font-black">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    {/* Info */}
                    <div className="space-y-3 pt-2 border-t border-border/10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
                                <Users size={14} className="text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Contratante</p>
                                <p className="text-sm font-semibold truncate">{project.client?.nome || 'Não vinculado'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
                                <MapPin size={14} className="text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Localização</p>
                                <p className="text-sm font-semibold truncate">{project.endereco || 'Não definida'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Health Indicators */}
                    <div className="flex items-center gap-2 pt-3 border-t border-border/10">
                        {Object.entries(health).map(([key, status]) => {
                            const HealthIcon = healthIcons[status as string].icon;
                            const color = healthIcons[status as string].color;
                            return (
                                <div key={key} className="flex items-center gap-1">
                                    <HealthIcon size={12} className={color} />
                                    <span className="text-[9px] font-bold uppercase">{key}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8 text-[10px] font-black uppercase rounded-xl"
                            onClick={(e) => {
                                e.stopPropagation();
                                onTabChange('gestao-projetos');
                            }}
                        >
                            📅 Cronograma
                        </Button>
                        <Button
                            size="sm"
                            className="flex-1 h-8 text-[10px] font-black uppercase rounded-xl bg-primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick();
                            }}
                        >
                            Gerenciar
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

export default ObrasDashboardV2;
