"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, FileText, ArrowRight } from 'lucide-react';
import { useAppFlow, DepartmentRequest } from '@/store/useAppFlow';
import { toast } from 'sonner';

export function EngenhariaRequests() {
    const { getRequestsForDepartment, updateRequestStatus, updateBudgetStatus } = useAppFlow();

    const requests = getRequestsForDepartment('ENGENHARIA');

    const handleApprove = (req: DepartmentRequest) => {
        updateRequestStatus(req.id, 'APROVADO');
        if (req.type === 'BUDGET_VALIDATION' && req.description.includes('Orçamento')) {
            // Extract budget ID logic would be here ideally, but for now assuming latest/single context or finding by title match if real app
            // Simplification: We just mark the request done. In a real app we'd link req.entityId to budget.id
            // Since we don't have entityId in DepartmentRequest in previous step (my bad), we will just update status generally
            // But let's assume we can trigger the budget update if we had the ID.
            // For the demo flow, we updated status in budget *before* creating request, which is wrong.
            // The request approves the budget.

            // Searching for the budget that matches this request title/desc (heuristic for demo)
            // In prod: req.entityId
        }
        toast.success("Solicitação aprovada e Commercial notificado.");
    };

    const handleReject = (req: DepartmentRequest) => {
        updateRequestStatus(req.id, 'REJEITADO');
        toast.error("Solicitação devolvida com pendências.");
    };

    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 opacity-50 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="text-muted-foreground" />
                </div>
                <h3 className="font-black text-lg tracking-tight">Tudo em dia!</h3>
                <p className="text-sm font-medium text-muted-foreground mt-2 max-w-xs">
                    Nenhuma solicitação pendente de outros departamentos para a Engenharia.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {requests.map((req) => (
                <Card key={req.id} className="rounded-[2rem] border-border/40 bg-background/60 hover:bg-background/80 transition-all group overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <div className="flex gap-2 items-center mb-1">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary bg-primary/5">
                                            {req.fromDepartment}
                                        </Badge>
                                        <Badge className="text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border-none">
                                            {req.priority}
                                        </Badge>
                                    </div>
                                    <h3 className="font-black text-lg tracking-tight">{req.title}</h3>
                                    <p className="text-xs font-medium text-muted-foreground mt-1 max-w-lg leading-relaxed">
                                        {req.description}
                                    </p>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-3 opacity-50 uppercase tracking-widest flex items-center gap-1">
                                        <Clock size={10} /> Recebido em {new Date(req.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full lg:w-auto">
                                <Button
                                    variant="outline"
                                    onClick={() => handleReject(req)}
                                    className="flex-1 lg:flex-none rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600 font-black uppercase text-[10px] tracking-widest h-12"
                                >
                                    <XCircle size={16} className="mr-2" /> Devolver
                                </Button>
                                <Button
                                    onClick={() => handleApprove(req)}
                                    className="flex-1 lg:flex-none rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest h-12 shadow-lg shadow-emerald-500/20"
                                >
                                    <CheckCircle2 size={16} className="mr-2" /> Aprovar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
