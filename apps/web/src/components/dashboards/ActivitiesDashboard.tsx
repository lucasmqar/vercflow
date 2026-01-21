import React, { useState, useEffect } from 'react';
import {
    Briefcase,
    Calendar as CalendarIcon,
    DollarSign,
    User as UserIcon,
    CheckCircle2,
    Clock,
    ExternalLink,
    List,
    LayoutGrid,
    Columns,
    ChevronLeft,
    ChevronRight,
    Building2,
    Hash,
    MoreHorizontal,
    GanttChartSquare,
    Link2,
    Activity as ActivityIcon,
    Plus,
    Search
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { getApiUrl } from '@/lib/api';
import { Activity, Priority, DashboardTab } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRegistros } from '@/hooks/useRegistros';
import { toast } from 'sonner';
import { ActivityDetailsModal } from './ActivityDetailsModal';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarView } from '@/components/tasks/CalendarView';
import { TimelineView } from '@/components/tasks/TimelineView';
import { AdvancedTimeFilter, TimeFilterValue } from '@/components/ui/AdvancedTimeFilter';

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

type ViewMode = 'kanban' | 'list' | 'grid' | 'calendar' | 'timeline';

export function ActivitiesDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        return (localStorage.getItem('activities-view-mode') as ViewMode) || 'kanban';
    });
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [disciplineFilter, setDisciplineFilter] = useState<string>('ALL');
    const [timeFilter, setTimeFilter] = useState<TimeFilterValue>({});
    const { updateActivityStatus } = useRegistros();

    useEffect(() => {
        fetchActivities();
    }, [timeFilter]);

    const fetchActivities = async () => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams();
            if (timeFilter.month !== undefined) query.append('month', timeFilter.month.toString());
            if (timeFilter.year) query.append('year', timeFilter.year.toString());

            const res = await fetch(getApiUrl(`/api/activities?${query.toString()}`));
            if (res.ok) {
                setActivities(await res.json());
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleActivityClick = (activity: Activity) => {
        setSelectedActivity(activity);
        setDetailsOpen(true);
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

        try {
            await updateActivityStatus(activity.id, nextStatus);
        } catch (e) {
            fetchActivities();
        }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-secondary/5 to-background overflow-hidden font-sans">
            {/* Standard Header */}
            <div className="p-4 lg:p-6 border-b bg-background/95 backdrop-blur-sm shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Atividades Técnicas</h1>
                        <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest font-medium opacity-60">Monitoramento e Gestão de Tarefas</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                            <Input placeholder="Buscar atividade..." className="pl-9 h-10 w-64 text-sm rounded-lg bg-background/50" />
                        </div>
                        <Button className="gap-2 shrink-0">
                            <Plus size={16} />
                            Nova Atividade
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sub-header for filters and view modes */}
            <div className="px-6 py-3 border-b border-border/40 bg-background/5 backdrop-blur-md flex items-center justify-between shrink-0">
                <div className="flex gap-2 items-center">
                    <div className="flex gap-1 bg-muted/20 rounded-lg p-1 border border-border/40">
                        {['ALL', '1.x', '2.x', '3.x', '4.x', '5.x'].map(d => (
                            <button
                                key={d}
                                onClick={() => setDisciplineFilter(d)}
                                className={cn(
                                    "px-2.5 py-1 rounded-md text-[9px] font-black uppercase transition-all",
                                    disciplineFilter === d
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-muted/40"
                                )}
                            >
                                {d === 'ALL' ? 'Todas' : d}
                            </button>
                        ))}
                    </div>
                    <Separator orientation="vertical" className="h-6 mx-2" />
                    <AdvancedTimeFilter onFilterChange={setTimeFilter} />
                </div>

                <div className="flex gap-1 bg-muted/20 rounded-lg p-1 border border-border/40">
                    {[
                        { id: 'kanban', icon: Columns, label: 'Kanban' },
                        { id: 'list', icon: List, label: 'Lista' },
                        { id: 'grid', icon: LayoutGrid, label: 'Grid' },
                        { id: 'calendar', icon: CalendarIcon, label: 'Agenda' },
                        { id: 'timeline', icon: GanttChartSquare, label: 'Gantt' },
                    ].map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => {
                                setViewMode(mode.id as ViewMode);
                                localStorage.setItem('activities-view-mode', mode.id);
                            }}
                            className={cn(
                                "h-8 px-3 rounded-md flex items-center gap-2 text-xs font-semibold transition-all duration-200",
                                viewMode === mode.id
                                    ? "bg-primary text-primary-foreground technical-shadow"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                            )}
                        >
                            <mode.icon size={14} />
                            <span className="hidden lg:inline">{mode.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="p-4 lg:p-6 h-full">
                    {/* Kanban View */}
                    {viewMode === 'kanban' && (
                        <div className="flex gap-6 h-full pb-4">
                            {kanbanColumns.map((col) => {
                                const items = activities.filter(a =>
                                    a.status === col.value &&
                                    (disciplineFilter === 'ALL' || a.discipline?.codigo === disciplineFilter)
                                );
                                return (
                                    <div key={col.value} className="flex-shrink-0 w-[320px] flex flex-col h-full bg-muted/10 rounded-xl border border-border/40 overflow-hidden backdrop-blur-sm">
                                        <div className="px-4 py-3 flex items-center justify-between border-b border-border/40 bg-muted/20">
                                            <div className="flex items-center gap-2.5">
                                                <div className={cn("w-1.5 h-1.5 rounded-full", col.color)} />
                                                <h3 className="font-bold text-[11px] uppercase tracking-[0.15em] text-foreground/70">{col.label}</h3>
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
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Card
                                                            className="group glass-card transition-all cursor-pointer p-0 overflow-hidden ring-1 ring-inset ring-white/10"
                                                            onClick={() => handleActivityClick(activity)}
                                                        >
                                                            <CardContent className="p-4 space-y-4">
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {activity.record && (
                                                                        <Badge variant="secondary" className="text-[9px] h-5 gap-1 font-mono uppercase tracking-tighter bg-indigo-500/5 text-indigo-600 border-indigo-500/10">
                                                                            <Link2 size={10} />
                                                                            {activity.record.refCodigo}
                                                                        </Badge>
                                                                    )}
                                                                    <Badge variant="outline" className={cn("text-[9px] h-5 font-bold uppercase tracking-tighter", priorityConfig[activity.prioridade]?.color)}>
                                                                        {activity.prioridade}
                                                                    </Badge>
                                                                </div>

                                                                <div>
                                                                    <h4 className="font-bold text-[13.5px] leading-tight text-foreground/90 group-hover:text-primary transition-colors line-clamp-2">
                                                                        {activity.titulo}
                                                                    </h4>
                                                                    {activity.project && (
                                                                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
                                                                            <Building2 size={10} className="text-muted-foreground/40" />
                                                                            {activity.project.nome}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <div className="flex items-center justify-between pt-3 border-t border-border/40 border-dashed">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                                            <UserIcon size={10} className="text-primary" />
                                                                        </div>
                                                                        <span className="text-[10.5px] font-bold text-foreground/70 truncate max-w-[120px]">
                                                                            {activity.assignments?.[0]?.professional?.nome?.split(' ')[0] || 'TBD'}
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center gap-1.5 text-muted-foreground/60">
                                                                        <CalendarIcon size={10} />
                                                                        <span className="text-[10px] font-mono font-bold tracking-tight">
                                                                            {activity.dataFim ? format(new Date(activity.dataFim), 'dd MMM', { locale: ptBR }) : '--'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                            <Button variant="ghost" className="w-full h-8 border border-dashed border-border/40 text-[11px] font-bold text-muted-foreground/50 hover:text-foreground hover:bg-muted/30">
                                                <Plus size={14} className="mr-1.5" /> Adicionar Atividade
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* List View */}
                    {viewMode === 'list' && (
                        <div className="h-full glass-card rounded-xl overflow-hidden shadow-glow border border-border/40">
                            <div className="overflow-auto max-h-full">
                                <table className="w-full border-collapse text-[13px]">
                                    <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10">
                                        <tr className="border-b border-border/40">
                                            <th className="text-left p-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Atividade</th>
                                            <th className="text-left p-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Vínculo / Origem</th>
                                            <th className="text-left p-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Status</th>
                                            <th className="text-left p-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Prioridade</th>
                                            <th className="text-left p-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Responsável</th>
                                            <th className="text-right p-4 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Prazo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-background/20">
                                        {activities.map((activity) => (
                                            <tr
                                                key={activity.id}
                                                className="border-b border-border/40 hover:bg-primary/[0.02] cursor-pointer transition-colors group"
                                                onClick={() => handleActivityClick(activity)}
                                            >
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-bold text-foreground/90 group-hover:text-primary transition-colors">{activity.titulo}</span>
                                                        <span className="text-[10px] font-mono text-muted-foreground/60 uppercase">Projeto: {activity.project?.nome || 'Geral'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {activity.record ? (
                                                        <Badge variant="outline" className="text-[9px] gap-1 px-1.5 py-0.5 border-indigo-500/10 text-indigo-500 bg-indigo-500/5 font-mono">
                                                            <Link2 size={10} />
                                                            {activity.record.refCodigo}
                                                        </Badge>
                                                    ) : <span className="text-[10px] text-muted-foreground/40 font-mono italic">Sem vínculo</span>}
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="outline" className={cn("text-[9px] h-5 rounded-md", kanbanColumns.find(c => c.value === activity.status)?.border)}>
                                                        {kanbanColumns.find(c => c.value === activity.status)?.label}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="secondary" className={cn("text-[9px] h-5 gap-1 font-bold border-transparent", priorityConfig[activity.prioridade]?.color)}>
                                                        {activity.prioridade}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-muted-foreground font-semibold">
                                                    {activity.assignments?.[0]?.professional?.nome || '--'}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className="text-[11px] font-mono font-bold text-foreground/70">
                                                        {activity.dataFim ? format(new Date(activity.dataFim), 'dd/MM/yyyy') : '--'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Grid View */}
                    {viewMode === 'grid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full">
                            {activities.map((activity) => (
                                <Card
                                    key={activity.id}
                                    className="glass-card hover:translate-y-[-2px] cursor-pointer p-0 group overflow-hidden"
                                    onClick={() => handleActivityClick(activity)}
                                >
                                    <CardContent className="p-4 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <Badge variant="outline" className={cn("text-[9px] h-5 font-bold uppercase", priorityConfig[activity.prioridade]?.color)}>
                                                {activity.prioridade}
                                            </Badge>
                                            <div className={cn("w-2 h-2 rounded-full", kanbanColumns.find(c => c.value === activity.status)?.color)} />
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-sm tracking-tight mb-1 group-hover:text-primary transition-colors">{activity.titulo}</h4>
                                            <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 uppercase tracking-tight">
                                                <Building2 size={10} /> {activity.project?.nome || 'Geral'}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-border/40">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center border border-border/50 overflow-hidden">
                                                    {activity.assignments?.[0]?.professional?.nome ? (
                                                        <span className="text-[8px] font-black uppercase">{activity.assignments[0].professional.nome.charAt(0)}</span>
                                                    ) : <UserIcon size={10} />}
                                                </div>
                                                <span className="text-[11px] font-bold opacity-70 truncate max-w-[80px]">
                                                    {activity.assignments?.[0]?.professional?.nome?.split(' ')[0] || '--'}
                                                </span>
                                            </div>
                                            <Badge variant="secondary" className="text-[9px] font-mono bg-primary/5 text-primary border-primary/10">
                                                {activity.dataFim ? format(new Date(activity.dataFim), 'dd/MM') : '--'}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {(viewMode === 'calendar' || viewMode === 'timeline') && (
                        <div className="h-full glass-card rounded-xl overflow-hidden shadow-glow border border-border/40">
                            {viewMode === 'calendar' ? (
                                <CalendarView activities={activities} onActivityClick={handleActivityClick} />
                            ) : (
                                <TimelineView activities={activities} onActivityClick={handleActivityClick} />
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ActivityDetailsModal
                activity={selectedActivity}
                isOpen={detailsOpen}
                onClose={() => setDetailsOpen(false)}
            />
        </div>
    );
}
