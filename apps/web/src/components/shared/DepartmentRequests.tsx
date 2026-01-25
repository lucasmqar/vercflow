"use client"

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2, XCircle, Clock, FileText, Zap,
    ArrowRight, ChevronRight, Edit3, Trash2,
    PlayCircle, CheckCircle, Info, Maximize2,
    Layout, DollarSign, Paperclip, Plus, X, UploadCloud
} from 'lucide-react';
import { useAppFlow } from '@/store/useAppFlow';
import { DepartmentRequest } from '@/types';
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
    const [feedback, setFeedback] = useState<any>({
        observations: '',
        adjustedValue: 0,
        adjustedDeadline: 0,
        attachments: [] as { id: string, name: string, url: string }[]
    });

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

        const isValidation = selectedReq.type === 'BUDGET_VALIDATION' || selectedReq.type === 'FINANCIAL_VALIDATION';
        const finalStatus = isValidation ? 'APROVADO' : 'CONCLUIDO';

        updateRequestStatus(selectedReq.id, finalStatus, feedback);
        setIsModalOpen(false);
        toast.success(`Solicitação ${isValidation ? 'aprovada' : 'finalizada'} com sucesso.`);
    };

    const handleFileUpload = () => {
        // Simulação de upload
        const newFile = {
            id: Math.random().toString(36).substr(2, 9),
            name: `documento_${Date.now()}.pdf`,
            url: '#'
        };
        setFeedback({ ...feedback, attachments: [...feedback.attachments, newFile] });
        toast.success("Documento anexado.");
    };

    const removeAttachment = (id: string) => {
        setFeedback({ ...feedback, attachments: feedback.attachments.filter((a: any) => a.id !== id) });
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
                        className="rounded-2xl border-border/40 bg-background/60 backdrop-blur-xl hover:border-primary/40 hover:bg-background/80 transition-all group overflow-hidden shadow-sm cursor-pointer relative"
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
                                    <div className="lg:col-span-8 space-y-8">
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
                                                        className="rounded-xl border-border/40 min-h-[150px] font-medium leading-relaxed"
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

                                                {/* Specialized Feedback Form for Validations */}
                                                {(selectedReq.type === 'BUDGET_VALIDATION' || selectedReq.type === 'FINANCIAL_VALIDATION') && (
                                                    <div className="space-y-6 pt-6 border-t border-border/20 animate-in fade-in slide-in-from-bottom-2">
                                                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                                                            <CheckCircle size={16} /> Parecer Técnico/Financeiro
                                                        </h3>

                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div className="col-span-2">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Observações e Ressalvas</label>
                                                                <Textarea
                                                                    placeholder="Detalhe o motivo da aprovação ou ajustes necessários..."
                                                                    className="rounded-2xl border-border/40 min-h-[100px]"
                                                                    value={feedback.observations}
                                                                    onChange={e => setFeedback({ ...feedback, observations: e.target.value })}
                                                                />
                                                            </div>
                                                            {selectedReq.type === 'BUDGET_VALIDATION' && (
                                                                <>
                                                                    <div>
                                                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Valor Sugerido (R$)</label>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="Valor final ajustado"
                                                                            className="rounded-xl border-border/40"
                                                                            value={feedback.adjustedValue}
                                                                            onChange={e => setFeedback({ ...feedback, adjustedValue: Number(e.target.value) })}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Prazo Sugerido (Meses)</label>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="Prazo final ajustado"
                                                                            className="rounded-xl border-border/40"
                                                                            value={feedback.adjustedDeadline}
                                                                            onChange={e => setFeedback({ ...feedback, adjustedDeadline: Number(e.target.value) })}
                                                                        />
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Attachment Management */}
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Documentos e Anexos</label>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={handleFileUpload}
                                                                    className="rounded-lg h-8 text-[9px] font-black uppercase tracking-widest gap-2 bg-primary/5 border-primary/20"
                                                                >
                                                                    <Plus size={12} /> Adicionar Arquivo
                                                                </Button>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {feedback.attachments.map((file: any) => (
                                                                    <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/10 group">
                                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                                            <Paperclip size={14} className="text-muted-foreground shrink-0" />
                                                                            <span className="text-[10px] font-bold truncate">{file.name}</span>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => removeAttachment(file.id)}
                                                                            className="p-1 hover:bg-red-500/10 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <X size={12} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                {feedback.attachments.length === 0 && (
                                                                    <div className="col-span-2 py-8 border-2 border-dashed border-border/20 rounded-2xl flex flex-col items-center justify-center text-muted-foreground/30">
                                                                        <UploadCloud size={24} className="mb-2" />
                                                                        <span className="text-[9px] font-black uppercase tracking-widest">Nenhum arquivo anexado</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
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

                                    {/* Sidebar actions / Metadata (Purchasing & Finance) */}
                                    <div className="lg:col-span-4 space-y-6">
                                        {/* Purchase Metadata Input */}
                                        {selectedReq.type === 'MATERIAL_PURCHASE' && department === 'COMPRAS' && (
                                            <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10 space-y-4">
                                                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                                                    <Zap size={14} /> Dados da Compra
                                                </h3>

                                                <div className="space-y-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Fornecedor</label>
                                                        <Input
                                                            placeholder="Nome do Fornecedor"
                                                            className="bg-white/50 h-9 text-xs"
                                                            value={selectedReq.metadata?.supplier || ''}
                                                            onChange={(e) => updateRequest(selectedReq.id, { metadata: { ...selectedReq.metadata, supplier: e.target.value } })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Valor Negociado (R$)</label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            className="bg-white/50 h-9 text-xs"
                                                            value={selectedReq.metadata?.cost || ''}
                                                            onChange={(e) => updateRequest(selectedReq.id, { metadata: { ...selectedReq.metadata, cost: parseFloat(e.target.value) } })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Previsão Entrega</label>
                                                        <Input
                                                            type="date"
                                                            className="bg-white/50 h-9 text-xs"
                                                            value={selectedReq.metadata?.deliveryDate || ''}
                                                            onChange={(e) => updateRequest(selectedReq.id, { metadata: { ...selectedReq.metadata, deliveryDate: e.target.value } })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Financial Approval Panel */}
                                        {selectedReq.type === 'PAYMENT_AUTHORIZATION' && department === 'FINANCEIRO' && selectedReq.metadata && (
                                            <div className="bg-emerald-500/5 rounded-[2rem] p-6 border border-emerald-500/10 space-y-4">
                                                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-emerald-600">
                                                    <DollarSign size={14} /> Detalhes do Pagamento
                                                </h3>

                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Valor a Pagar</p>
                                                        <p className="text-3xl font-black text-emerald-600 tracking-tighter">
                                                            R$ {selectedReq.metadata.amount?.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Beneficiário</p>
                                                        <p className="text-sm font-bold text-foreground">{selectedReq.metadata.supplier}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Vencimento</p>
                                                        <p className="text-sm font-bold text-foreground">{selectedReq.metadata.dueDate || 'Imediato'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Budget Validation Details (For Engineering or Finance) */}
                                        {(selectedReq.type === 'BUDGET_VALIDATION' || selectedReq.type === 'FINANCIAL_VALIDATION') && (
                                            <div className="bg-indigo-500/5 rounded-[2rem] p-6 border border-indigo-500/10 space-y-4">
                                                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-indigo-600">
                                                    <FileText size={14} /> Dados do Orçamento
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="p-4 rounded-xl bg-background border border-border/20">
                                                        <p className="text-[8px] font-black uppercase text-muted-foreground mb-1">Status Interno</p>
                                                        <Badge variant="outline" className="text-[8px] border-indigo-500/20 text-indigo-500">AGUARDANDO VALIDAÇÃO</Badge>
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-background border border-border/20">
                                                        <p className="text-[8px] font-black uppercase text-muted-foreground mb-1">Fase do Fluxo</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className={cn("w-2 h-2 rounded-full", selectedReq.type === 'BUDGET_VALIDATION' ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} title="Engenharia" />
                                                            <div className="w-4 h-[1px] bg-muted-foreground/20" />
                                                            <div className={cn("w-2 h-2 rounded-full", selectedReq.type === 'FINANCIAL_VALIDATION' ? "bg-amber-500 animate-pulse" : "bg-muted")} title="Financeiro" />
                                                        </div>
                                                        <p className="text-[8px] font-bold mt-1 uppercase text-muted-foreground">
                                                            {selectedReq.type === 'BUDGET_VALIDATION' ? 'Ponto de Controle: Engenharia' : 'Ponto de Controle: Financeiro'}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                                        <p className="text-[8px] font-black text-indigo-600 uppercase mb-1">Dica de Processo</p>
                                                        <p className="text-[10px] italic leading-tight text-indigo-900/60 font-medium">
                                                            {selectedReq.type === 'BUDGET_VALIDATION'
                                                                ? 'Analise se o escopo macro condiz com a natureza da obra e o padrão solicitado pelo cliente.'
                                                                : 'Verifique se as margens brutas estão acima de 12% antes de liberar para o comercial.'}
                                                        </p>
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
                                        onClick={() => {
                                            // Special Logic for Purchasing Completion
                                            if (department === 'COMPRAS' && selectedReq.type === 'MATERIAL_PURCHASE') {
                                                if (!selectedReq.metadata?.cost || !selectedReq.metadata?.supplier) {
                                                    toast.error("Preencha Fornecedor e Valor antes de concluir.");
                                                    return;
                                                }
                                                // Create Financial Request automatically
                                                const { createRequest } = useAppFlow.getState();
                                                createRequest({
                                                    title: `PGTO: ${selectedReq.title}`, // Payment for X
                                                    description: `Pagamento autorizado para ${selectedReq.metadata.supplier}. Ref: Requisição de Compra.`,
                                                    priority: 'ALTA',
                                                    fromDepartment: 'COMPRAS',
                                                    toDepartment: 'FINANCEIRO',
                                                    type: 'PAYMENT_AUTHORIZATION',
                                                    projectId: selectedReq.projectId,
                                                    recordId: selectedReq.id, // Link back to Purchase Request
                                                    status: 'PENDENTE',
                                                    metadata: {
                                                        amount: selectedReq.metadata.cost,
                                                        supplier: selectedReq.metadata.supplier,
                                                        dueDate: selectedReq.metadata.deliveryDate
                                                    }
                                                } as any);
                                                toast.success("Enviado para o Financeiro!");
                                            }
                                            handleComplete();
                                        }}
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
