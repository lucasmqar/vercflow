"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, CheckCircle2, AlertTriangle, FileText, Check,
    MapPin, DollarSign, Calendar, UploadCloud, MessagesSquare,
    Printer, Share2, History, MoreHorizontal, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ScopeValidationPageProps {
    data: any;
    onBack: () => void;
    onApprove: () => void;
    onReject: (reason: string) => void;
}

export function ScopeValidationPage({ data, onBack, onApprove, onReject }: ScopeValidationPageProps) {
    const [step, setStep] = useState(1);
    const [rejectReason, setRejectReason] = useState('');

    const handleApprove = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Gerando estrutura do projeto...',
                success: () => {
                    onApprove();
                    return 'Projeto ativado com sucesso!';
                },
                error: 'Erro ao ativar projeto'
            }
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full bg-background overflow-hidden"
        >
            {/* Page Header */}
            <div className="flex justify-between items-center p-8 border-b border-border/40 bg-background/50 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl h-12 w-12 hover:bg-muted">
                        <ArrowLeft size={24} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Badge className="bg-amber-500/10 text-amber-600 border-none font-black text-[10px] uppercase tracking-widest px-2">
                                Validação Técnica
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                Lead #{data.id?.substring(0, 6) || 'UNKNOWN'}
                            </span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter">{data.client || 'Cliente Desconhecido'}</h2>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2 font-bold uppercase text-[10px] tracking-widest">
                        <Printer size={14} /> Imprimir
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2 font-bold uppercase text-[10px] tracking-widest">
                        <Share2 size={14} /> Compartilhar
                    </Button>
                </div>
            </div>

            {/* Main Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto">

                    {/* LEFT: Project Context (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Scope Checklist */}
                        <section>
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <FileText size={16} /> Escopo Contratado
                                </h3>
                                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase text-primary">
                                    <Plus size={12} className="mr-1" /> Adicionar Item
                                </Button>
                            </div>
                            <Card className="rounded-[2.5rem] border-white/5 bg-muted/5 p-8 space-y-6">
                                {[
                                    { text: "Execução de Fundações (Sapatas Isoladas)", cat: "INFRA" },
                                    { text: "Estrutura em Concreto Armado (3 Pavimentos)", cat: "SUPRA" },
                                    { text: "Alvenaria de Vedação e Reboco", cat: "VEDAÇÃO" },
                                    { text: "Instalações Elétricas e Hidrossanitárias Básicas", cat: "INST" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-2xl border border-border/20 group hover:border-primary/20 transition-all">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-bold block">{item.text}</span>
                                            <span className="text-[10px] font-black uppercase text-muted-foreground opacity-60">{item.cat}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </Card>
                        </section>

                        {/* Two Columns: Files & Notes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Files */}
                            <section>
                                <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                    <UploadCloud size={16} /> Documentos
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { name: "Planta Baixa.pdf", size: "2.4 MB", type: "PDF" },
                                        { name: "Sondagem SP01.pdf", size: "1.1 MB", type: "PDF" },
                                    ].map((file, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-background border border-border/40 rounded-2xl cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all group">
                                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-[10px] font-black uppercase text-muted-foreground group-hover:text-primary transition-colors">
                                                {file.type}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold truncate max-w-[150px] group-hover:text-primary transition-colors">{file.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{file.size}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full rounded-xl border-dashed h-12">
                                        <UploadCloud size={16} className="mr-2" /> Upload Arquivo
                                    </Button>
                                </div>
                            </section>

                            {/* Notes */}
                            <section>
                                <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                    <MessagesSquare size={16} /> Notas Comerciais
                                </h3>
                                <div className="p-6 bg-amber-500/5 rounded-[2rem] border border-amber-500/10 h-full min-h-[180px]">
                                    <p className="text-sm text-amber-800/80 leading-relaxed font-medium">
                                        "Cliente solicitou prioridade na fundação devido à previsão de chuvas em Março. Verificar acesso para caminhão betoneira (rua estreita)."
                                    </p>
                                    <div className="mt-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-200" />
                                        <div>
                                            <p className="text-xs font-bold text-amber-900">Carlos Vendas</p>
                                            <p className="text-[10px] text-amber-700">12 Jan, 10:30</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* RIGHT: Validation Actions (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="rounded-[2.5rem] bg-gradient-to-br from-background to-secondary/10 border-border/40 p-8 shadow-xl sticky top-0">
                            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-8 text-center flex items-center justify-center gap-2">
                                <DollarSign size={14} /> Resumo Financeiro
                            </h3>

                            <div className="space-y-8 text-center">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">Valor Global Estimado</p>
                                    <p className="text-4xl font-black tracking-tighter text-foreground">{data.value || 'R$ 0,00'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/20">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">Prazo</p>
                                        <p className="text-xl font-black flex items-center justify-center gap-1">12 Meses</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">Lucro Est.</p>
                                        <p className="text-xl font-black flex items-center justify-center gap-1 text-emerald-500">22%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 space-y-4">
                                {step === 1 ? (
                                    <>
                                        <Button
                                            onClick={handleApprove}
                                            className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform"
                                        >
                                            <CheckCircle2 size={18} className="mr-2" /> Aprovar & Ativar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setStep(2)}
                                            className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                        >
                                            <AlertTriangle size={18} className="mr-2" /> Solicitar Ajustes
                                        </Button>
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3"
                                    >
                                        <Textarea
                                            placeholder="Descreva o motivo da devolução..."
                                            className="bg-background/80 min-h-[100px] resize-none border-red-200 mb-2 focus-visible:ring-red-500 rounded-xl"
                                            value={rejectReason}
                                            onChange={e => setRejectReason(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button variant="ghost" className="h-10 rounded-xl font-bold text-xs" onClick={() => setStep(1)}>
                                                Cancelar
                                            </Button>
                                            <Button
                                                className="h-10 rounded-xl font-bold text-xs bg-red-500 hover:bg-red-600 text-white"
                                                onClick={() => onReject(rejectReason)}
                                            >
                                                Confirmar Devolução
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}
