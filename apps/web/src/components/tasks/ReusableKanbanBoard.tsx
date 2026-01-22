"use client"

import React, { useState, useEffect } from 'react';
import {
    Building2,
    Calendar as CalendarIcon,
    User as UserIcon,
    CheckCircle2,
    Clock,
    Link2,
    Plus,
    ArrowRight,
    ArrowLeft,
    MoreHorizontal
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getApiUrl } from '@/lib/api';
import { Activity, Priority } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const kanbanColumns = [
    { value: 'PLANEJADO', label: 'Planejado', color: 'bg-blue-500', border: 'border-blue-500/20' },
    { value: 'EM_EXECUCAO', label: 'Em Execução', color: 'bg-amber-500', border: 'border-amber-500/20' },
    { value: 'CONCLUIDO', label: 'Concluído', color: 'bg-emerald-500', border: 'border-emerald-500/20' },
    { value: 'BLOQUEADO', label: 'Bloqueado', color: 'bg-rose-500', border: 'border-rose-500/20' },
];

const priorityConfig: Record<Priority, { label: string; color: string }> = {
    BAIXA: { label: 'Baixa', color: 'text-slate-500 bg-slate-500/10' },
    MEDIA: { label: 'Média', color: 'text-blue-500 bg-blue-500/10' },
    ALTA: { label: 'Alta', color: 'text-amber-600 bg-amber-600/10' },
    CRITICA: { label: 'Crítica', color: 'text-rose-600 bg-rose-600/10 shadow-[0_0_10px_-2px_rgba(225,29,72,0.2)]' },
};

interface ReusableKanbanBoardProps {
    contextFilter?: string; // Department or project filter
    onActivityClick?: (activity: Activity) => void;
    title?: string;
}

export function ReusableKanbanBoard({ contextFilter, onActivityClick, title }: ReusableKanbanBoardProps) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, [contextFilter]);

    const fetchActivities = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(getApiUrl(`/api/activities`));
            if (res.ok) {
                let data: Activity[] = await res.json();
                // Simple client-side filtering for demo, in real app this would be API side
                if (contextFilter && contextFilter !== 'ALL') {
                    // If contextFilter matches a discipline code or project name
                    data = data.filter(a =>
                        a.discipline?.codigo?.startsWith(contextFilter) ||
                        a.project?.nome?.includes(contextFilter) ||
                        a.status === contextFilter
                    );
                }
                setActivities(data);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleMove = async (activity: Activity, direction: 'forward' | 'backward') => {
        const order = ['PLANEJADO', 'EM_EXECUCAO', 'CONCLUIDO'];
        const currentIndex = order.indexOf(activity.status);
        if (currentIndex === -1 && activity.status !== 'BLOQUEADO') return;

        let nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
        if (activity.status === 'BLOQUEADO' && direction === 'forward') nextIndex = 1;

        if (nextIndex < 0 || nextIndex >= order.length) return;

        const nextStatus = order[nextIndex];
        setActivities(prev => prev.map(a => a.id === activity.id ? { ...a, status: nextStatus as any } : a));

        // In a real app, update via API here
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full" />
            </div>
        );
    }

    return (
        <div className="flex gap-6 h-full pb-4 overflow-x-auto min-h-[500px]">
            {kanbanColumns.map((col) => {
                const items = activities.filter(a => a.status === col.value);
                return (
                    <div key={col.value} className="flex-shrink-0 w-[300px] flex flex-col h-full bg-muted/10 rounded-xl border border-border/40 overflow-hidden backdrop-blur-sm">
                        <div className="px-4 py-3 flex items-center justify-between border-b border-border/40 bg-muted/20">
                            <div className="flex items-center gap-2.5">
                                <div className={cn("w-1.5 h-1.5 rounded-full", col.color)} />
                                <h3 className="font-bold text-[10px] uppercase tracking-[0.15em] text-foreground/70">{col.label}</h3>
                                <Badge variant="outline" className="h-5 px-1.5 text-[9px] font-mono border-border/40 bg-background/50">
                                    {items.length}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 p-3 scrollbar-thin">
                            <AnimatePresence mode="popLayout">
                                {items.map((activity) => (
                                    <motion.div
                                        key={activity.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group relative"
                                    >
                                        <Card
                                            className="group glass-card transition-all cursor-pointer p-0 overflow-hidden border-border/40 hover:border-primary/40"
                                            onClick={() => onActivityClick?.(activity)}
                                        >
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <Badge variant="outline" className={cn("text-[9px] h-5 font-bold uppercase tracking-tighter", priorityConfig[activity.prioridade]?.color)}>
                                                        {activity.prioridade}
                                                    </Badge>
                                                    <div className="flex gap-1">
                                                        {activity.record && (
                                                            <Badge className="text-[8px] bg-primary/10 text-primary border-none">{activity.record.refCodigo}</Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-bold text-xs leading-tight text-foreground/90 group-hover:text-primary transition-colors line-clamp-2">
                                                        {activity.titulo}
                                                    </h4>
                                                    {activity.project && (
                                                        <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider mt-1 flex items-center gap-1">
                                                            <Building2 size={10} /> {activity.project.nome}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between pt-2 border-t border-border/20 border-dashed">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                            <UserIcon size={10} className="text-primary" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-foreground/70">
                                                            {activity.assignments?.[0]?.professional?.nome?.split(' ')[0] || 'TBD'}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-6 w-6 rounded-md hover:bg-muted"
                                                            onClick={(e) => { e.stopPropagation(); handleMove(activity, 'backward'); }}
                                                        >
                                                            <ArrowLeft size={10} />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-6 w-6 rounded-md hover:bg-muted"
                                                            onClick={(e) => { e.stopPropagation(); handleMove(activity, 'forward'); }}
                                                        >
                                                            <ArrowRight size={10} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
