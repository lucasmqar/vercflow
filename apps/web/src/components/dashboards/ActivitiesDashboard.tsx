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
    LayoutGrid
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataView } from '@/components/shared/DataView';
import { CalendarView } from '@/components/shared/CalendarView';
import { getApiUrl } from '@/lib/api';
import { Activity, ActivityStatus } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ActivitiesDashboard() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'dataview' | 'calendar' | 'kanban'>('kanban');

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(getApiUrl('/api/activities'));
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        {
            key: 'titulo',
            header: 'Atividade',
            render: (act: Activity) => (
                <div>
                    <p className="font-bold text-sm tracking-tight">{act.titulo}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        {act.project?.nome || 'Sem Obra'}
                    </p>
                </div>
            )
        },
        {
            key: 'assignments',
            header: 'Responsável',
            render: (act: Activity) => {
                const prof = act.assignments?.[0]?.professional;
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <UserIcon size={12} />
                        </div>
                        <span className="text-xs font-semibold">{prof?.nome || 'Não designado'}</span>
                    </div>
                );
            }
        },
        {
            key: 'dataFim',
            header: 'Prazo',
            render: (act: Activity) => (
                <span className="text-xs font-medium">
                    {act.dataFim ? format(new Date(act.dataFim), 'dd MMM yyyy', { locale: ptBR }) : '-'}
                </span>
            )
        },
        {
            key: 'valor',
            header: 'Investimento',
            render: (act: Activity) => (
                <span className="text-xs font-bold text-primary">
                    R$ {(act.assignments?.[0]?.valorPrevisto || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (act: Activity) => {
                const colors: Record<string, string> = {
                    PLANEJADO: 'bg-blue-500/10 text-blue-600',
                    EM_EXECUCAO: 'bg-yellow-500/10 text-yellow-600',
                    CONCLUIDO: 'bg-green-500/10 text-green-600',
                    BLOQUEADO: 'bg-red-500/10 text-red-600',
                };
                return (
                    <Badge className={cn("border-none shadow-none text-[9px] h-5 tracking-tight uppercase font-bold", colors[act.status] || 'bg-secondary')}>
                        {act.status}
                    </Badge>
                );
            }
        }
    ];

    const kanbanColumns = [
        { value: 'PLANEJADO', label: 'Planejado', color: '#3B82F6' },
        { value: 'EM_EXECUCAO', label: 'Em Execução', color: '#F59E0B' },
        { value: 'CONCLUIDO', label: 'Concluído', color: '#10B981' },
        { value: 'BLOQUEADO', label: 'Bloqueado', color: '#EF4444' },
    ];

    // Stats
    const totalPrevisto = activities.reduce((acc, a) => acc + (a.assignments?.[0]?.valorPrevisto || 0), 0);
    const activeTasks = activities.filter(a => a.status === 'EM_EXECUCAO').length;

    return (
        <div className="flex flex-col h-full overflow-hidden bg-secondary/10">
            {/* KPI Section */}
            <div className="p-4 lg:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                <Card className="bg-background/80 backdrop-blur-md border-border/50 shadow-sm rounded-3xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent group-hover:opacity-100 transition-opacity" />
                    <CardContent className="pt-6 relative">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Previsto (Investimento)</p>
                                <p className="text-2xl font-bold tracking-tighter">R$ {totalPrevisto.toLocaleString('pt-BR')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-background/80 backdrop-blur-md border-border/50 shadow-sm rounded-3xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent group-hover:opacity-100 transition-opacity" />
                    <CardContent className="pt-6 relative">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Atividades em Curso</p>
                                <p className="text-2xl font-bold tracking-tighter">{activeTasks} Tarefas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-background/80 backdrop-blur-md border-border/50 shadow-sm rounded-3xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent group-hover:opacity-100 transition-opacity" />
                    <CardContent className="pt-6 relative">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">SLA de Entrega</p>
                                <p className="text-2xl font-bold tracking-tighter">94% <span className="text-[10px] text-muted-foreground font-normal">Sazonal</span></p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Data View */}
            <div className="flex-1 min-h-0 bg-background rounded-t-[40px] border-t border-border/50 shadow-2xl overflow-hidden flex flex-col">
                {/* View Mode Toggle */}
                <div className="p-4 border-b flex items-center justify-between bg-secondary/10">
                    <h3 className="font-bold">Visualização</h3>
                    <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg">
                        <Button
                            variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('kanban')}
                            className="gap-2"
                        >
                            <LayoutGrid size={14} />
                            Kanban
                        </Button>
                        <Button
                            variant={viewMode === 'dataview' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('dataview')}
                            className="gap-2"
                        >
                            <List size={14} />
                            Lista
                        </Button>
                        <Button
                            variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('calendar')}
                            className="gap-2"
                        >
                            <CalendarIcon size={14} />
                            Calendário
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    {viewMode === 'calendar' ? (
                        <CalendarView
                            activities={activities}
                            onActivityClick={(item) => console.log('Activity clicked', item)}
                        />
                    ) : (
                        <DataView
                            data={activities}
                            columns={columns}
                            kanbanProperty="status"
                            kanbanColumns={kanbanColumns}
                            isLoading={isLoading}
                            searchPlaceholder="Buscar por atividade, profissional ou projeto..."
                            onAddClick={() => console.log('Adicionar Atividade')}
                            onItemClick={(item) => console.log('Click item', item)}
                            defaultView={viewMode === 'kanban' ? 'kanban' : 'table'}
                            viewModes={['table', 'grid', 'kanban']}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
