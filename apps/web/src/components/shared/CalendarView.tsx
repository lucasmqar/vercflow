import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Activity } from '@/types';

interface CalendarViewProps {
    activities: Activity[];
    onActivityClick?: (activity: Activity) => void;
}

export function CalendarView({ activities, onActivityClick }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Add padding days for calendar grid
    const startDay = monthStart.getDay();
    const paddingDays = Array(startDay).fill(null);
    const allDays = [...paddingDays, ...days];

    const getActivitiesForDay = (date: Date) => {
        return activities.filter(activity => {
            if (!activity.dataFim) return false;
            return isSameDay(new Date(activity.dataFim), date);
        });
    };

    const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const today = () => setCurrentDate(new Date());

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b bg-secondary/20">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={today} className="gap-2">
                        <Clock size={14} />
                        Hoje
                    </Button>
                    <Button variant="outline" size="icon" onClick={previousMonth}>
                        <ChevronLeft size={16} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 p-4 overflow-auto">
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                        <div key={day} className="text-center text-xs font-bold text-muted-foreground py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {allDays.map((day, index) => {
                        if (!day) {
                            return <div key={`empty-${index}`} className="aspect-square" />;
                        }

                        const dayActivities = getActivitiesForDay(day);
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isTodayDate = isToday(day);

                        return (
                            <Card
                                key={day.toISOString()}
                                className={cn(
                                    'aspect-square overflow-hidden transition-all hover:shadow-lg cursor-pointer',
                                    !isCurrentMonth && 'opacity-40',
                                    isTodayDate && 'ring-2 ring-primary'
                                )}
                            >
                                <CardContent className="p-2 h-full flex flex-col">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={cn(
                                            'text-sm font-bold',
                                            isTodayDate && 'text-primary'
                                        )}>
                                            {format(day, 'd')}
                                        </span>
                                        {dayActivities.length > 0 && (
                                            <Badge variant="secondary" className="h-4 px-1 text-[9px]">
                                                {dayActivities.length}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                                        {dayActivities.slice(0, 3).map((activity) => (
                                            <div
                                                key={activity.id}
                                                onClick={() => onActivityClick?.(activity)}
                                                className={cn(
                                                    'text-[9px] px-1.5 py-0.5 rounded truncate font-medium',
                                                    activity.status === 'PLANEJADO' && 'bg-blue-500/20 text-blue-700',
                                                    activity.status === 'EM_EXECUCAO' && 'bg-yellow-500/20 text-yellow-700',
                                                    activity.status === 'CONCLUIDO' && 'bg-green-500/20 text-green-700',
                                                    activity.status === 'BLOQUEADO' && 'bg-red-500/20 text-red-700'
                                                )}
                                            >
                                                {activity.titulo}
                                            </div>
                                        ))}
                                        {dayActivities.length > 3 && (
                                            <div className="text-[8px] text-muted-foreground text-center">
                                                +{dayActivities.length - 3} mais
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
