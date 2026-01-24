"use client"

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2, XCircle, Clock, FileText, Zap,
    ArrowRight, ChevronRight, Edit3, Trash2,
    PlayCircle, CheckCircle, Info, Maximize2,
    Layout
} from 'lucide-react';
import { useAppFlow, DepartmentRequest } from '@/store/useAppFlow';
import { useRegistros } from '@/hooks/useRegistros';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface DepartmentRequestsProps {
    department: 'COMERCIAL' | 'ENGENHARIA' | 'PROJETOS' | 'FINANCEIRO' | 'COMPRAS' | 'RH' | 'LOGISTICA';
}

type RequestStatus = DepartmentRequest['status'];

const STATUS_CONFIG: Record<RequestStatus, { label: string, color: string, icon: any, step: number }> = {
    'PENDENTE': { label: 'Pendente', color: 'bg-slate-500', icon: Clock, step: 1 },
    'EM_ANALISE': { label: 'Em Análise', color: 'bg-amber-500', icon: PlayCircle, step: 2 },
    'APROVADO': { label: 'Em Execução', color: 'bg-blue-500', icon: CheckCircle2, step: 3 },
    'CONCLUIDO': { label: 'Concluído', color: 'bg-emerald-500', icon: CheckCircle, step: 4 },
    'REJEITADO': { label: 'Arquivado', color: 'bg-red-500', icon: XCircle, step: 0 }
};

const PHASES: RequestStatus[] = ['PENDENTE', 'EM_ANALISE', 'APROVADO', 'CONCLUIDO'];

export function DepartmentRequests({ department }: DepartmentRequestsProps) {
    const { requests, updateRequestStatus, updateRequest } = useAppFlow();
    const { registros } = useRegistros();

    const [selectedReq, setSelectedReq] = useState<DepartmentRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [tempData, setTempData] = useState({ title: '', description: '' });

    // Filter requests for this department that are active (not concluded or rejected)
    const activeRequests = requests.filter(r =>
        r.toDepartment === department &&
        r.status !== 'REJEITADO' &&
        r.status !== 'CONCLUIDO'
    );

    const handleOpenRequest = (req: DepartmentRequest) => {
        setSelectedReq(req);
        setTempData({ title: req.title, description: req.description });
        setIsModalOpen(true);
        setEditMode(false);
    };

    const handleStepClick = (status: RequestStatus) => {
        if (!selectedReq) return;
        updateRequestStatus(selectedReq.id, status);
        setSelectedReq({ ...selectedReq, status });
        toast.success(`Status atualizado para ${STATUS_CONFIG[status].label}`);
    };

    const handleSaveEdits = () => {
        if (!selectedReq) return;
        updateRequest(selectedReq.id, {
            title: tempData.title,
            description: tempData.description
        });
        setSelectedReq({ ...selectedReq, title: tempData.title, description: tempData.description });
        toast.success("Dados atualizados com sucesso.");
        setEditMode(false);
    };

    const handleDiscard = () => {
        if (!selectedReq) return;
        updateRequestStatus(selectedReq.id, 'REJEITADO');
        setIsModalOpen(false);
        toast.error("Solicitação arquivada.");
    };

    const handleComplete = () => {
        if (!selectedReq) return;
        updateRequestStatus(selectedReq.id, 'CONCLUIDO');
        setIsModalOpen(false);
        toast.success("Solicitação finalizada com sucesso.");
    };

    const relatedRecord = selectedReq?.recordId ? registros.find(r => r.id === selectedReq.recordId) : null;

    if (activeRequests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 opacity-50 text-center animate-in fade-in duration-700">
                <div className="w-20 h-20 rounded-[2rem] bg-muted/30 flex items-center justify-center mb-6 border border-border/20">
                    <CheckCircle2 size={32} className="text-muted-foreground" />
                </div>
                <h3 className="font-black text-xl tracking-tight">Fila Vazia</h3>
                <p className="text-sm font-medium text-muted-foreground mt-2 max-w-xs">
                    Sem novas solicitações para {department} neste momento.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {activeRequests.map((req, i) => (
                <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Card
                        onClick={() => handleOpenRequest(req)}
                        className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl hover:border-primary/40 hover:bg-background/80 transition-all group overflow-hidden shadow-sm cursor-pointer relative"
                    >
                        <CardContent className="p-8">
                            <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
                                <div className="flex gap-6 items-start">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner",
                                        STATUS_CONFIG[req.status].color + " bg-opacity-10 text-" + STATUS_CONFIG[req.status].color.replace('bg-', '')
                                    )}>
                                        {React.createElement(STATUS_CONFIG[req.status].icon, { size: 28 })}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex gap-2 items-center">
                                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary bg-primary/5 px-2">
                                                {STATUS_CONFIG[req.status].label}
                                            </Badge>
                                            <Badge className={cn(
                                                "text-[10px] font-black uppercase tracking-widest border-none px-2",
                                                req.priority === 'CRITICA' ? "bg-red-500/10 text-red-500" :
                                                    req.priority === 'ALTA' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                                            )}>
                                                {req.priority}
                                            </Badge>
                                        </div>
                                        <h3 className="font-black text-xl tracking-tight leading-none text-foreground/90">{req.title}</h3>
                                        <p className="text-sm font-medium text-muted-foreground max-w-xl leading-relaxed line-clamp-2">
                                            {req.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden lg:block">
                                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">RECEBIDO EM</p>
                                        <p className="text-xs font-bold text-foreground/70">{new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <ChevronRight size={24} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}

            {/* Request Detail Modal (Pipefy/Notion Style) */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[3rem] border-none shadow-2xl bg-background/95 backdrop-blur-2xl h-[85vh] flex flex-col">
                    {selectedReq && (
                        <>
                            {/* Phase Management Header (Pipefy Style) */}
                            <div className="bg-muted/30 border-b border-border/20 p-8 pt-10">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Layout size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Workflow: {department}</p>
                                            <h2 className="text-lg font-black tracking-tight">{selectedReq.title}</h2>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => setEditMode(!editMode)} className="rounded-xl">
                                            <Edit3 size={18} />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={handleDiscard} className="rounded-xl text-red-500 hover:bg-red-500/10">
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Progress Track */}
                                <div className="relative flex justify-between items-center">
                                    <div className="absolute h-1 bg-muted left-4 right-4 top-1/2 -translate-y-1/2 z-0 rounded-full" />
                                    <div
                                        className="absolute h-1 bg-primary left-4 top-1/2 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
                                        style={{ width: `${(STATUS_CONFIG[selectedReq.status].step / (PHASES.length)) * 100}%` }}
                                    />

                                    {PHASES.map((phase) => {
                                        const config = STATUS_CONFIG[phase];
                                        const isCurrent = selectedReq.status === phase;
                                        const isPast = STATUS_CONFIG[selectedReq.status].step >= config.step;

                                        return (
                                            <button
                                                key={phase}
                                                onClick={() => handleStepClick(phase)}
                                                className="relative z-10 flex flex-col items-center group"
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-4 border-background shadow-md",
                                                    isCurrent ? "bg-primary text-primary-foreground scale-125" :
                                                        isPast ? "bg-primary/90 text-primary-foreground" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {React.createElement(config.icon, { size: 16 })}
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest mt-3 transition-colors",
                                                    isCurrent ? "text-primary" : "text-muted-foreground/60"
                                                )}>
                                                    {config.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                    {/* Main Info */}
                                    <div className="lg:col-span-12 space-y-8">
                                        {editMode ? (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Título da Atividade</label>
                                                    <Input
                                                        value={tempData.title}
                                                        onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                                                        className="rounded-2xl border-border/40 font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detalhamento Técnico</label>
                                                    <Textarea
                                                        value={tempData.description}
                                                        onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
                                                        className="rounded-3xl border-border/40 min-h-[150px] font-medium leading-relaxed"
                                                    />
                                                </div>
                                                <div className="flex gap-2 justify-end">
                                                    <Button variant="ghost" onClick={() => setEditMode(false)} className="rounded-xl">Cancelar</Button>
                                                    <Button onClick={handleSaveEdits} className="rounded-xl bg-primary">Salvar Alterações</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary mb-4">
                                                        <Info size={16} /> Descrição do Chamado
                                                    </h3>
                                                    <p className="text-base font-medium text-foreground/80 leading-relaxed whitespace-pre-wrap bg-muted/20 p-6 rounded-[2rem] border border-border/10">
                                                        {selectedReq.description}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Contextual Record Data (Origin) */}
                                        {relatedRecord && (
                                            <div className="space-y-6 pt-6 border-t border-border/20">
                                                <div>
                                                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary mb-4">
                                                        <Maximize2 size={16} /> Evidências de Origem ({relatedRecord.refCodigo})
                                                    </h3>
                                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {relatedRecord.items?.map((item, idx) => (
                                                            <div key={idx} className="group relative rounded-2xl overflow-hidden border border-border/20 aspect-video bg-muted">
                                                                {item.type === 'FOTO' ? (
                                                                    <img src={item.content} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                ) : (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                                                        <FileText size={24} className="text-muted-foreground/50 mb-2" />
                                                                        <span className="text-[10px] font-black text-muted-foreground/60 uppercase text-center">{item.type}</span>
                                                                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 text-center font-medium">{item.content}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-8 border-t border-border/20 bg-background/50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sincronizado via VERC-OS v2.5</span>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleDiscard}
                                        className="rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/5 font-black uppercase text-[10px] tracking-widest h-12 shadow-sm"
                                    >
                                        Descartar
                                    </Button>
                                    <Button
                                        onClick={handleComplete}
                                        className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest h-12 shadow-lg shadow-emerald-500/20"
                                    >
                                        Efetivar / Concluir
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
