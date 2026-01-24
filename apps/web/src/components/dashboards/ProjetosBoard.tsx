"use client"

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Inbox,
    Clock,
    CheckCircle2,
    Send,
    History,
    Search,
    Filter,
    ChevronRight,
    AlertCircle,
    FileText,
    User,
    Calendar,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Activity } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';

const API_BASE = 'http://localhost:4000/api';

type Section = 'overview' | 'my-tasks' | 'in-progress' | 'review' | 'completed' | 'history';

export function ProjetosBoard() {
    const [currentSection, setCurrentSection] = useState<Section>('my-tasks');
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'my-tasks', label: 'Minhas Atividades', icon: Inbox },
        { id: 'in-progress', label: 'Em Andamento', icon: Clock },
        { id: 'review', label: 'Em Validação', icon: Send },
        { id: 'completed', label: 'Concluídas', icon: CheckCircle2 },
        { id: 'history', label: 'Histórico', icon: History },
    ];

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/activities`);
            const data = await res.json();
            setActivities(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStartTask = async (activityId: string) => {
        // TODO: Connect to PATCH /api/activities/:id
        console.log('Starting task:', activityId);
    };

    const handleSubmitForReview = async (activityId: string) => {
        // TODO: Connect to PATCH /api/activities/:id (status = AGUARDANDO_VALIDACAO)
        console.log('Submitting for review:', activityId);
    };

    const handleCompleteTask = async (activityId: string) => {
        // TODO: Connect to PATCH /api/activities/:id (status = CONCLUIDA)
        console.log('Completing task:', activityId);
    };

    // Filter activities by section
    const filteredActivities = activities.filter(a => {
        if (currentSection === 'my-tasks') return a.status === 'PENDENTE';
        if (currentSection === 'in-progress') return a.status === 'EM_ANDAMENTO';
        if (currentSection === 'review') return a.status === 'AGUARDANDO_VALIDACAO';
        if (currentSection === 'completed') return a.status === 'CONCLUIDA';
        return true;
    });

    const stats = {
        pending: activities.filter(a => a.status === 'PENDENTE').length,
        inProgress: activities.filter(a => a.status === 'EM_ANDAMENTO').length,
        review: activities.filter(a => a.status === 'AGUARDANDO_VALIDACAO').length,
        completed: activities.filter(a => a.status === 'CONCLUIDA').length,
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden font-sans">
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-20 lg:w-64 border-r border-border/40 flex flex-col items-center lg:items-stretch py-8 bg-background/50 backdrop-blur-sm shrink-0">
                    <div className="px-6 mb-8 hidden lg:block">
                        <HeaderAnimated title="Projetos" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-1">
                            Workflow Projetista
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full px-4 flex-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = currentSection === item.id;
                            const count =
                                item.id === 'my-tasks' ? stats.pending :
                                    item.id === 'in-progress' ? stats.inProgress :
                                        item.id === 'review' ? stats.review :
                                            item.id === 'completed' ? stats.completed : null;

                            return (
                                <Button
                                    key={item.id}
                                    variant={isActive ? "secondary" : "ghost"}
                                    onClick={() => setCurrentSection(item.id as Section)}
                                    className={cn(
                                        "w-full justify-start h-12 rounded-xl transition-all",
                                        isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted/50",
                                        "lg:px-4 px-0 lg:justify-start justify-center"
                                    )}
                                >
                                    <item.icon size={20} className="shrink-0 lg:mr-3" />
                                    <span className="hidden lg:flex items-center gap-2 font-bold text-xs uppercase tracking-wide truncate flex-1">
                                        {item.label}
                                        {count !== null && count > 0 && (
                                            <Badge variant="secondary" className="ml-auto text-[9px] px-1.5">
                                                {count}
                                            </Badge>
                                        )}
                                    </span>
                                </Button>
                            );
                        })}
                    </div>

                    <div className="p-4 mt-auto">
                        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/10 rounded-2xl hidden lg:block">
                            <p className="text-[10px] font-black uppercase text-primary mb-1">Atividades Ativas</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-xs font-bold">{stats.pending + stats.inProgress}</span>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="h-20 border-b flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm shrink-0">
                        <div className="lg:hidden">
                            <HeaderAnimated title="Projetos" />
                        </div>
                        <div className="hidden lg:flex items-center gap-4 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                                <Input placeholder="Buscar atividades..." className="pl-12 h-12 rounded-xl" />
                            </div>
                            <Button variant="outline" size="icon" className="rounded-xl">
                                <Filter size={18} />
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 lg:p-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-[1920px] mx-auto"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                                    </div>
                                ) : currentSection === 'overview' ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                            {[
                                                { label: 'Pendentes', value: stats.pending, icon: Inbox, color: 'text-amber-500' },
                                                { label: 'Em Andamento', value: stats.inProgress, icon: Clock, color: 'text-blue-500' },
                                                { label: 'Validação', value: stats.review, icon: Send, color: 'text-purple-500' },
                                                { label: 'Concluídas', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-500' },
                                            ].map((s, i) => (
                                                <Card key={i} className="rounded-[2rem] p-8 bg-background/60">
                                                    <div className="flex justify-between mb-6">
                                                        <div className={cn("p-4 rounded-2xl bg-muted/50", s.color)}>
                                                            <s.icon size={24} strokeWidth={2.5} />
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60 mb-2">{s.label}</p>
                                                    <h3 className="text-3xl font-black">{s.value}</h3>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-black tracking-tight">
                                                {navItems.find(i => i.id === currentSection)?.label}
                                            </h2>
                                            {currentSection === 'my-tasks' && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {filteredActivities.length} atividade(s)
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="grid gap-4">
                                            {filteredActivities.map(activity => (
                                                <Card key={activity.id} className="rounded-[2rem] p-6 bg-background/60 hover:border-primary/20 transition-all group">
                                                    <div className="flex items-center justify-between gap-6">
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <div className={cn(
                                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                                activity.status === 'CONCLUIDA' ? "bg-emerald-500/10" :
                                                                    activity.status === 'EM_ANDAMENTO' ? "bg-blue-500/10" :
                                                                        activity.status === 'AGUARDANDO_VALIDACAO' ? "bg-purple-500/10" :
                                                                            "bg-amber-500/10"
                                                            )}>
                                                                <FileText size={20} className={
                                                                    activity.status === 'CONCLUIDA' ? "text-emerald-500" :
                                                                        activity.status === 'EM_ANDAMENTO' ? "text-blue-500" :
                                                                            activity.status === 'AGUARDANDO_VALIDACAO' ? "text-purple-500" :
                                                                                "text-amber-500"
                                                                } />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-sm mb-1 truncate">{activity.titulo}</h4>
                                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                                    {activity.record?.refCodigo && (
                                                                        <span className="flex items-center gap-1">
                                                                            <FileText size={12} />
                                                                            {activity.record.refCodigo}
                                                                        </span>
                                                                    )}
                                                                    {activity.prazo && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Calendar size={12} />
                                                                            {new Date(activity.prazo).toLocaleDateString('pt-BR')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <Badge className={cn(
                                                                "text-[9px] font-black uppercase",
                                                                activity.status === 'CONCLUIDA' ? "bg-emerald-500/10 text-emerald-500" :
                                                                    activity.status === 'EM_ANDAMENTO' ? "bg-blue-500/10 text-blue-500" :
                                                                        activity.status === 'AGUARDANDO_VALIDACAO' ? "bg-purple-500/10 text-purple-500" :
                                                                            "bg-amber-500/10 text-amber-500"
                                                            )}>
                                                                {activity.status}
                                                            </Badge>

                                                            {currentSection === 'my-tasks' && (
                                                                <Button
                                                                    size="sm"
                                                                    className="rounded-xl h-9 px-4 font-bold text-xs uppercase tracking-wide"
                                                                    onClick={() => handleStartTask(activity.id)}
                                                                >
                                                                    Iniciar
                                                                </Button>
                                                            )}

                                                            {currentSection === 'in-progress' && (
                                                                <Button
                                                                    size="sm"
                                                                    className="rounded-xl h-9 px-4 font-bold text-xs uppercase tracking-wide gap-2"
                                                                    onClick={() => handleSubmitForReview(activity.id)}
                                                                >
                                                                    <Send size={14} />
                                                                    Validar
                                                                </Button>
                                                            )}

                                                            <Button size="icon" variant="ghost" className="rounded-xl">
                                                                <ChevronRight size={20} />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {activity.descricao && (
                                                        <div className="mt-4 pt-4 border-t border-border/40">
                                                            <p className="text-xs text-muted-foreground line-clamp-2">{activity.descricao}</p>
                                                        </div>
                                                    )}
                                                </Card>
                                            ))}

                                            {filteredActivities.length === 0 && (
                                                <Card className="rounded-[2rem] p-12 text-center">
                                                    <CheckCircle2 size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                                                    <p className="text-sm font-bold text-muted-foreground">
                                                        {currentSection === 'my-tasks' ? 'Nenhuma atividade pendente' :
                                                            currentSection === 'in-progress' ? 'Nenhuma atividade em andamento' :
                                                                currentSection === 'review' ? 'Nenhuma atividade aguardando validação' :
                                                                    'Nenhuma atividade concluída'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground/60 mt-2">
                                                        {currentSection === 'my-tasks' && 'Você está em dia com suas tarefas!'}
                                                    </p>
                                                </Card>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjetosBoard;
