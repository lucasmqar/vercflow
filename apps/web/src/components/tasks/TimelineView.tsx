import React, { useMemo } from 'react';
import {
    Calendar as CalendarIcon,
    User as UserIcon,
    Building2,
    Clock,
    AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Activity } from '@/types';
import { format, differenceInDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimelineViewProps {
    activities: Activity[];
    onActivityClick?: (activity: Activity) => void;
}

const statusColors = {
    PLANEJADO: 'bg-blue-500',
    EM_EXECUCAO: 'bg-yellow-500',
    CONCLUIDO: 'bg-green-500',
    BLOQUEADO: 'bg-red-500',
};

const priorityOrder = { CRITICA: 0, ALTA: 1, MEDIA: 2, BAIXA: 3 };

export function TimelineView({ activities, onActivityClick }: TimelineViewProps) {
    const today = startOfDay(new Date());

    const sortedActivities = useMemo(() => {
        return [...activities]
            .filter(a => a.dataInicio || a.dataFim)
            .sort((a, b) => {
                // Sort by start date, then by priority
                const aStart = a.dataInicio ? new Date(a.dataInicio) : new Date();
                const bStart = b.dataInicio ? new Date(b.dataInicio) : new Date();
                const dateCompare = aStart.getTime() - bStart.getTime();
                if (dateCompare !== 0) return dateCompare;
                return (priorityOrder[a.prioridade as keyof typeof priorityOrder] || 2) -
                    (priorityOrder[b.prioridade as keyof typeof priorityOrder] || 2);
            });
    }, [activities]);

    // Calculate timeline range
    const timelineRange = useMemo(() => {
        if (sortedActivities.length === 0) return { start: today, end: today, days: 30 };

        let minDate = today;
        let maxDate = today;

        sortedActivities.forEach(a => {
            if (a.dataInicio) {
                const start = new Date(a.dataInicio);
                if (isBefore(start, minDate)) minDate = start;
            }
            if (a.dataFim) {
                const end = new Date(a.dataFim);
                if (isAfter(end, maxDate)) maxDate = end;
            }
        });

        const days = Math.max(differenceInDays(maxDate, minDate) + 7, 30);
        return { start: minDate, end: maxDate, days };
    }, [sortedActivities, today]);

    const getBarStyle = (activity: Activity) => {
        const start = activity.dataInicio ? new Date(activity.dataInicio) : today;
        const end = activity.dataFim ? new Date(activity.dataFim) : start;

        const startOffset = Math.max(0, differenceInDays(start, timelineRange.start));
        const duration = Math.max(1, differenceInDays(end, start) + 1);

        const leftPercent = (startOffset / timelineRange.days) * 100;
        const widthPercent = (duration / timelineRange.days) * 100;

        return {
            left: `${Math.min(leftPercent, 100)}%`,
            width: `${Math.min(widthPercent, 100 - leftPercent)}%`,
        };
    };

    const isOverdue = (activity: Activity) => {
        if (activity.status === 'CONCLUIDO') return false;
        if (!activity.dataFim) return false;
        return isBefore(new Date(activity.dataFim), today);
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Timeline Header */}
            <div className="flex items-center gap-4 p-4 border-b bg-muted/20">
                <h2 className="text-sm font-bold uppercase tracking-wider">Timeline de Atividades</h2>
                <div className="flex gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-blue-500" />
                        <span className="text-muted-foreground">Planejado</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-yellow-500" />
                        <span className="text-muted-foreground">Em Execução</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-green-500" />
                        <span className="text-muted-foreground">Concluído</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-red-500" />
                        <span className="text-muted-foreground">Bloqueado</span>
                    </div>
                </div>
            </div>

            {/* Timeline Content */}
            <div className="flex-1 overflow-auto">
                <div className="min-w-[1000px]">
                    {/* Time Scale */}
                    <div className="flex border-b bg-muted/10 sticky top-0 z-10">
                        <div className="w-[280px] shrink-0 px-4 py-2 border-r text-xs font-semibold text-muted-foreground">
                            Atividade
                        </div>
                        <div className="flex-1 relative h-8">
                            {/* Today marker */}
                            <div
                                className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
                                style={{
                                    left: `${(differenceInDays(today, timelineRange.start) / timelineRange.days) * 100}%`
                                }}
                            />
                            {/* Date markers every 7 days */}
                            {Array.from({ length: Math.ceil(timelineRange.days / 7) + 1 }).map((_, i) => {
                                const dayOffset = i * 7;
                                const date = new Date(timelineRange.start);
                                date.setDate(date.getDate() + dayOffset);
                                return (
                                    <div
                                        key={i}
                                        className="absolute top-0 bottom-0 border-l border-border/50 text-[10px] text-muted-foreground px-1 flex items-center"
                                        style={{ left: `${(dayOffset / timelineRange.days) * 100}%` }}
                                    >
                                        {format(date, 'dd/MM', { locale: ptBR })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Activity Rows */}
                    {sortedActivities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex border-b hover:bg-muted/30 transition-colors cursor-pointer group"
                            onClick={() => onActivityClick?.(activity)}
                        >
                            {/* Activity Info */}
                            <div className="w-[280px] shrink-0 px-4 py-2 border-r">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-mono font-bold text-primary">
                                        #{activity.id.slice(-4).toUpperCase()}
                                    </span>
                                    {isOverdue(activity) && (
                                        <AlertTriangle size={12} className="text-red-500" />
                                    )}
                                </div>
                                <p className="text-sm font-medium line-clamp-1 mb-1">
                                    {activity.titulo}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                    <UserIcon size={10} />
                                    <span className="truncate max-w-[80px]">
                                        {activity.assignments?.[0]?.professional?.nome || 'N/A'}
                                    </span>
                                    <Building2 size={10} />
                                    <span className="truncate max-w-[80px]">
                                        {activity.project?.nome || 'Geral'}
                                    </span>
                                </div>
                            </div>

                            {/* Timeline Bar */}
                            <div className="flex-1 relative py-3">
                                <div
                                    className={cn(
                                        "absolute h-6 rounded-md flex items-center px-2 text-[10px] font-medium text-white shadow-sm transition-all group-hover:scale-y-110",
                                        statusColors[activity.status as keyof typeof statusColors] || 'bg-slate-500',
                                        isOverdue(activity) && "ring-2 ring-red-300 ring-offset-1"
                                    )}
                                    style={getBarStyle(activity)}
                                    title={`${activity.titulo} (${format(new Date(activity.dataInicio || new Date()), 'dd/MM')} - ${format(new Date(activity.dataFim || new Date()), 'dd/MM')})`}
                                >
                                    <span className="truncate">
                                        {activity.titulo}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {sortedActivities.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground">
                            <CalendarIcon size={32} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Nenhuma atividade com datas definidas</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
