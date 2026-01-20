import React, { useState, useMemo } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    User as UserIcon,
    Building2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Activity } from '@/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarViewProps {
    activities: Activity[];
    onActivityClick?: (activity: Activity) => void;
}

const priorityColors = {
    CRITICA: 'bg-red-500',
    ALTA: 'bg-orange-500',
    MEDIA: 'bg-blue-500',
    BAIXA: 'bg-slate-400',
};

const statusColors = {
    PLANEJADO: 'bg-blue-500',
    EM_EXECUCAO: 'bg-yellow-500',
    CONCLUIDO: 'bg-green-500',
    BLOQUEADO: 'bg-red-500',
};

export function CalendarView({ activities, onActivityClick }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

    const calendarDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth), { locale: ptBR });
        const end = endOfWeek(endOfMonth(currentMonth), { locale: ptBR });
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const getActivitiesForDay = (day: Date) => {
        return activities.filter(activity => {
            if (!activity.dataFim) return false;
            return isSameDay(new Date(activity.dataFim), day);
        });
    };

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handleToday = () => setCurrentMonth(new Date());

    return (
        <div className="h-full flex flex-col">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/20">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold">
                        {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                    </h2>
                    <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={handlePrevMonth} className="h-8 w-8 p-0">
                            <ChevronLeft size={16} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleToday} className="h-8 px-3 text-xs">
                            Hoje
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0">
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
                <div className="flex gap-1 bg-muted/30 rounded-md p-1">
                    <button
                        onClick={() => setViewMode('month')}
                        className={cn(
                            "px-3 py-1 text-xs font-medium rounded transition-all",
                            viewMode === 'month' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Mensal
                    </button>
                    <button
                        onClick={() => setViewMode('week')}
                        className={cn(
                            "px-3 py-1 text-xs font-medium rounded transition-all",
                            viewMode === 'week' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Semanal
                    </button>
                </div>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 border-b">
                {weekDays.map(day => (
                    <div key={day} className="p-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-auto">
                {calendarDays.map((day, idx) => {
                    const dayActivities = getActivitiesForDay(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isCurrentDay = isToday(day);

                    return (
                        <div
                            key={idx}
                            className={cn(
                                "border-b border-r p-1 min-h-[100px] transition-colors",
                                !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                                isCurrentDay && "bg-primary/5"
                            )}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={cn(
                                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                                    isCurrentDay && "bg-primary text-primary-foreground"
                                )}>
                                    {format(day, 'd')}
                                </span>
                                {dayActivities.length > 0 && (
                                    <span className="text-[10px] text-muted-foreground">
                                        {dayActivities.length} tarefa{dayActivities.length > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-1 overflow-hidden">
                                {dayActivities.slice(0, 3).map(activity => (
                                    <button
                                        key={activity.id}
                                        onClick={() => onActivityClick?.(activity)}
                                        className={cn(
                                            "w-full text-left px-2 py-1 rounded text-[10px] font-medium truncate transition-all hover:opacity-80",
                                            statusColors[activity.status as keyof typeof statusColors] || 'bg-slate-500',
                                            "text-white"
                                        )}
                                        title={activity.titulo}
                                    >
                                        {activity.titulo}
                                    </button>
                                ))}
                                {dayActivities.length > 3 && (
                                    <span className="text-[10px] text-muted-foreground px-2">
                                        +{dayActivities.length - 3} mais
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
