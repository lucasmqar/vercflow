import React from 'react';
import {
    X,
    Calendar,
    User,
    Building2,
    DollarSign,
    CheckCircle2,
    Clock,
    AlertTriangle,
    FileText,
    Briefcase
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useRegistros } from '@/hooks/useRegistros';

interface ActivityDetailsModalProps {
    activity: Activity | null;
    isOpen: boolean;
    onClose: () => void;
}

const statusConfig: Record<string, { label: string, color: string, icon: React.ElementType }> = {
    'PLANEJADO': { label: 'Planejado', color: 'bg-blue-500/10 text-blue-700 border-blue-200', icon: Clock },
    'EM_EXECUCAO': { label: 'Em Execução', color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200', icon: Briefcase },
    'CONCLUIDO': { label: 'Concluído', color: 'bg-green-500/10 text-green-700 border-green-200', icon: CheckCircle2 },
    'BLOQUEADO': { label: 'Bloqueado', color: 'bg-red-500/10 text-red-700 border-red-200', icon: AlertTriangle },
    'CANCELADO': { label: 'Cancelado', color: 'bg-slate-500/10 text-slate-700 border-slate-200', icon: X },
};

const priorityConfig: Record<string, { label: string, color: string }> = {
    'BAIXA': { label: 'Baixa', color: 'bg-slate-100 text-slate-700' },
    'MEDIA': { label: 'Média', color: 'bg-blue-100 text-blue-700' },
    'ALTA': { label: 'Alta', color: 'bg-orange-100 text-orange-700' },
    'CRITICA': { label: 'Crítica', color: 'bg-red-100 text-red-700' },
};

export function ActivityDetailsModal({ activity, isOpen, onClose }: ActivityDetailsModalProps) {
    if (!activity) return null;

    const status = statusConfig[activity.status] || statusConfig['PLANEJADO'];
    const StatusIcon = status.icon;
    const priority = priorityConfig[activity.prioridade] || priorityConfig['MEDIA'];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
                <DialogTitle className="sr-only">Detalhes da Atividade</DialogTitle>

                {/* Header */}
                <div className="p-6 border-b bg-muted/10">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="font-mono text-xs">
                                    #{activity.id.slice(-4).toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className={cn("border-transparent", priority.color)}>
                                    Prioridade {priority.label}
                                </Badge>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">{activity.titulo}</h2>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="bg-background/50 hover:bg-background h-8 w-8 rounded-full">
                            <X size={16} />
                        </Button>
                    </div>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Status Bar */}
                    <div className={cn("flex items-center gap-3 p-3 rounded-lg border", status.color)}>
                        <div className="p-2 bg-white/50 rounded-md">
                            <StatusIcon size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">Status Atual</p>
                            <p className="font-medium">{status.label}</p>
                        </div>
                    </div>

                    {/* Description */}
                    {activity.descricao && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <FileText size={14} />
                                Descrição
                            </h3>
                            <div className="p-4 bg-muted/20 rounded-lg border text-sm leading-relaxed whitespace-pre-wrap">
                                {activity.descricao}
                            </div>
                        </div>
                    )}

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <Building2 size={14} />
                                Projeto
                            </h3>
                            <div className="p-3 bg-background border rounded-lg">
                                <p className="font-medium text-sm">{activity.project?.nome || 'Projeto Geral'}</p>
                                {activity.project?.endereco && (
                                    <p className="text-xs text-muted-foreground mt-1 truncate">{activity.project.endereco}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <Calendar size={14} />
                                Prazos
                            </h3>
                            <div className="p-3 bg-background border rounded-lg space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Início:</span>
                                    <span className="font-medium">
                                        {activity.dataInicio ? format(new Date(activity.dataInicio), 'dd/MM/yyyy') : '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Término:</span>
                                    <span className="font-medium">
                                        {activity.dataFim ? format(new Date(activity.dataFim), 'dd/MM/yyyy') : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignments */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                            <User size={14} />
                            Responsáveis e Custos
                        </h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/30 border-b">
                                    <tr>
                                        <th className="text-left p-3 font-medium text-muted-foreground">Profissional</th>
                                        <th className="text-right p-3 font-medium text-muted-foreground">Valor Previsto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {activity.assignments?.map((assignment) => (
                                        <tr key={assignment.id} className="bg-background">
                                            <td className="p-3 font-medium">{assignment.professional?.nome || 'N/A'}</td>
                                            <td className="p-3 text-right font-mono text-muted-foreground">
                                                R$ {assignment.valorPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!activity.assignments || activity.assignments.length === 0) && (
                                        <tr>
                                            <td colSpan={2} className="p-4 text-center text-muted-foreground italic">
                                                Nenhum responsável atribuído
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-muted/10 flex justify-end">
                    <Button variant="outline" onClick={onClose}>Fechar</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
