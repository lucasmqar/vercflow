import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Bell,
    CheckCircle2,
    Clock,
    ArrowRight,
    FileText,
    AlertCircle,
    User,
    Zap
} from 'lucide-react';
import { useAppFlow } from '@/store/useAppFlow';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ComercialActivities() {
    const { getRequestsForDepartment, updateRequestStatus } = useAppFlow();

    // Fetch alerts/requests specifically for Commercial department
    const requests = getRequestsForDepartment('COMERCIAL').filter(r => r.status !== 'CONCLUIDO' && r.status !== 'REJEITADO');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-foreground">Caixa de Entrada</h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Solicitações da Triagem & Engenharia</p>
                </div>
                <Badge variant="outline" className="h-8 px-3 border-primary/20 bg-primary/5 text-primary gap-2">
                    <Bell size={14} className="animate-pulse" />
                    {requests.length} Pendentes
                </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {requests.length === 0 ? (
                    <Card className="p-12 flex flex-col items-center justify-center text-center opacity-50 bg-background/50 border-dashed border-border/40">
                        <CheckCircle2 size={48} className="text-muted-foreground mb-4" />
                        <h3 className="font-bold text-lg">Tudo em dia!</h3>
                        <p className="text-sm text-muted-foreground">Nenhuma atividade pendente no momento.</p>
                    </Card>
                ) : (
                    requests.map((req) => (
                        <Card key={req.id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:shadow-lg transition-all border-border/40 bg-background relative overflow-hidden">
                            <div className={cn(
                                "absolute left-0 top-0 bottom-0 w-1",
                                req.priority === 'CRITICA' ? "bg-red-500" :
                                    req.priority === 'ALTA' ? "bg-orange-500" :
                                        "bg-blue-500"
                            )} />

                            <div className="w-12 h-12 rounded-xl bg-muted/20 flex items-center justify-center shrink-0">
                                {req.type === 'TECHNICAL_TASK' ? <Zap size={20} className="text-amber-600" /> :
                                    req.type === 'CREATE_BUDGET' ? <FileText size={20} className="text-blue-600" /> :
                                        <AlertCircle size={20} className="text-primary" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-border/40">
                                        {req.fromDepartment}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                        {format(new Date(req.createdAt), "dd MMM · HH:mm", { locale: ptBR })}
                                    </span>
                                </div>
                                <h4 className="font-bold text-foreground text-lg leading-tight">{req.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{req.description}</p>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                                <Button
                                    variant="outline"
                                    className="flex-1 md:flex-none border-border/40 hover:bg-muted/10 font-bold text-xs uppercase"
                                    onClick={() => updateRequestStatus(req.id, 'EM_ANALISE')}
                                >
                                    Analisar
                                </Button>
                                <Button
                                    className="flex-1 md:flex-none bg-primary text-primary-foreground font-bold text-xs uppercase shadow-lg shadow-primary/20"
                                    onClick={() => updateRequestStatus(req.id, 'CONCLUIDO')}
                                >
                                    Concluir <ArrowRight size={14} className="ml-2" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

// Utility for conditional classes (referencing imports)
import { cn } from '@/lib/utils';
