import React from 'react';
import { Building2, Calendar, User, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectHealthCardProps {
    projectId: string;
    projectName: string;
    clientName: string;
    progress: number;
    nextMilestone?: string;
    nextMilestoneDate?: string;
    responsavel?: string;
    documentsVencidos?: number;
    budgetStatus?: 'ok' | 'warning' | 'critical';
    teamAllocated?: number;
    onClick?: () => void;
    onAddRecord?: () => void;
}

export function ProjectHealthCard({
    projectId,
    projectName,
    clientName,
    progress,
    nextMilestone,
    nextMilestoneDate,
    responsavel,
    documentsVencidos = 0,
    budgetStatus = 'ok',
    teamAllocated = 0,
    onClick,
    onAddRecord
}: ProjectHealthCardProps) {
    const getBudgetColor = () => {
        switch (budgetStatus) {
            case 'critical': return 'text-red-600';
            case 'warning': return 'text-yellow-600';
            default: return 'text-green-600';
        }
    };

    return (
        <Card
            className="rounded-2xl border-border/40 hover:border-primary/30 transition-all cursor-pointer overflow-hidden bg-card"
            onClick={onClick}
        >
            <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-black tracking-tight truncate">{projectName}</h3>
                        <p className="text-xs text-muted-foreground truncate">{clientName}</p>
                    </div>
                    <Badge variant="secondary" className="text-[9px] font-bold">
                        {progress}%
                    </Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                    <Progress value={progress} className="h-2" />
                    <p className="text-[10px] text-muted-foreground">
                        {progress >= 100 ? 'Concluído' : progress >= 75 ? 'Finalizando' : progress >= 50 ? 'Meio caminho' : 'Iniciando'}
                    </p>
                </div>

                {/* Next Milestone */}
                {nextMilestone && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                        <Calendar size={14} className="text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold truncate">{nextMilestone}</p>
                            {nextMilestoneDate && (
                                <p className="text-[9px] text-muted-foreground">{nextMilestoneDate}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Health Indicators */}
                <div className="flex items-center gap-3 text-[10px]">
                    {documentsVencidos > 0 && (
                        <div className="flex items-center gap-1 text-red-600">
                            <AlertCircle size={12} />
                            <span className="font-bold">{documentsVencidos} docs vencidos</span>
                        </div>
                    )}
                    <div className={`flex items-center gap-1 ${getBudgetColor()}`}>
                        <TrendingUp size={12} />
                        <span className="font-bold">Budget {budgetStatus === 'ok' ? 'OK' : budgetStatus === 'warning' ? '⚠️' : '🔴'}</span>
                    </div>
                    {teamAllocated > 0 && (
                        <div className="flex items-center gap-1 text-purple-600">
                            <User size={12} />
                            <span className="font-bold">{teamAllocated} alocados</span>
                        </div>
                    )}
                </div>

                {/* Responsável */}
                {responsavel && (
                    <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-black text-primary">
                            {responsavel.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">{responsavel}</span>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 pt-1">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-[10px] font-bold rounded-lg"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick?.();
                        }}
                    >
                        Ver Detalhes
                    </Button>
                    <Button
                        size="sm"
                        className="flex-1 h-8 text-[10px] font-bold rounded-lg"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddRecord?.();
                        }}
                    >
                        + Registro
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
