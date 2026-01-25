"use client"

import React, { useState } from 'react';
import {
    Search,
    ChevronRight,
    FileText,
    Clock,
    CheckCircle2,
    History,
    AlertTriangle,
    ShieldCheck,
    ArrowRight,
    Info,
    CreditCard,
    Zap,
    Scale
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppFlow } from '@/store/useAppFlow';
import { Budget } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { generateProfessionalPDF } from '@/lib/pdf-service';

export function BudgetListPage({ onSelect }: { onSelect: (budget: Budget) => void }) {
    const { budgets } = useAppFlow();
    const [search, setSearch] = useState('');

    const filteredBudgets = budgets.filter(b =>
        b.lead?.nomeObra.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Buscar por obra..."
                        className="pl-10 h-11 rounded-xl border-white/10 bg-white/5"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {filteredBudgets.length === 0 ? (
                <div className="py-20 text-center opacity-30">
                    <FileText size={64} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest text-sm">Nenhum orçamento em andamento</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredBudgets.map((budget) => (
                        <motion.div
                            key={budget.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.01 }}
                            className="cursor-pointer"
                            onClick={() => onSelect(budget)}
                        >
                            <Card className="rounded-2xl border-white/10 bg-background/40 backdrop-blur-xl hover:border-primary/30 transition-all group overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black">
                                                <Zap size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-black text-lg group-hover:text-primary transition-colors">{budget.lead?.nomeObra}</h3>
                                                    <Badge className={cn(
                                                        "text-[8px] font-black uppercase tracking-widest border-none",
                                                        budget.status === 'APROVADO' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                                    )}>
                                                        {budget.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-4 opacity-60">
                                                    <span className="text-[10px] font-black uppercase flex items-center gap-1.5 text-emerald-600">
                                                        {budget.valorEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase flex items-center gap-1.5"><Clock size={12} /> {budget.prazoEstimadoMeses} Meses</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                <div className={cn("w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[8px] font-black", budget.validacaoTecnica === 'APROVADO' ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground")} title="Engenharia">E</div>
                                                <div className={cn("w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[8px] font-black", budget.validacaoFinanceira === 'APROVADO' ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground")} title="Financeiro">F</div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                                                <ChevronRight size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function BudgetDetailPage({ budget, onBack, onCreateProposal }: { budget: Budget, onBack: () => void, onCreateProposal: (budget: Budget) => void }) {
    const { createBudgetRevision } = useAppFlow();
    const [isRevising, setIsRevising] = useState(false);
    const [revisionData, setRevisionData] = useState({
        escopoMacro: budget.escopoMacro,
        valorEstimado: budget.valorEstimado,
        prazoEstimadoMeses: budget.prazoEstimadoMeses,
        resumoAlteracoes: ''
    });

    const handleCreateRevision = () => {
        if (!revisionData.resumoAlteracoes) return;
        createBudgetRevision(budget.id, {
            ...revisionData,
            responsavelId: 'current-user-id'
        }, revisionData.resumoAlteracoes);
        setIsRevising(false);
        toast.success("Nova revisão técnica gerada com sucesso!");
    };

    const handleDownloadPDF = async () => {
        toast("Gerando PDF Profissional...", {
            description: "Aguarde enquanto estruturamos o dossiê técnico."
        });

        const data = {
            id_orcamento: budget.id,
            obra: budget.lead?.nomeObra || 'N/A',
            cliente: budget.lead?.nomeValidacao || 'N/A',
            documento: budget.lead?.client?.documento || 'N/A',
            natureza: budget.lead?.classificacao?.natureza || 'N/A',
            valor_estimado: budget.valorEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            prazo_estimado: `${budget.prazoEstimadoMeses} Meses`,
            status: budget.status,
            validacao_engenharia: budget.validacaoTecnica,
            validacao_financeira: budget.validacaoFinanceira,
            escopo: budget.escopoMacro
        };

        try {
            await generateProfessionalPDF(
                `Orçamento Técnico: ${budget.lead?.nomeObra}`,
                data,
                `ORC_${budget.id.substring(0, 8)}.pdf`
            );
            toast.success("Download Concluído!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao gerar PDF.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl border border-white/5 h-12 w-12 bg-background/50 backdrop-blur-sm">
                        <ChevronRight size={20} className="text-primary rotate-180" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-amber-500/10 text-amber-500 border-none font-black text-[9px] tracking-[0.2em] uppercase">
                                Budget ID: {budget.id.split('-')[0]}
                            </Badge>
                            <Badge className={cn("font-black text-[9px] tracking-[0.2em] uppercase", budget.status === 'APROVADO' ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary")}>
                                {budget.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic">{budget.lead?.nomeObra}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleDownloadPDF}
                        className="rounded-xl font-black text-[10px] uppercase tracking-widest border-white/10 flex items-center gap-2"
                    >
                        <FileText size={14} /> PDF
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsRevising(true)}
                        className="rounded-xl font-black text-[10px] uppercase tracking-widest border-white/10"
                    >
                        Nova Revisão
                    </Button>
                    <Button
                        onClick={() => onCreateProposal(budget)}
                        disabled={budget.status !== 'APROVADO'}
                        className={cn(
                            "rounded-xl px-8 font-black text-[10px] uppercase tracking-[0.2em] h-12 shadow-2xl transition-all",
                            budget.status === 'APROVADO' ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20" : "bg-muted text-muted-foreground opacity-50"
                        )}
                    >
                        Gerar Proposta Comercial
                    </Button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Process Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Validation Stepper */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Elaboração', status: 'CONCLUIDO', icon: Zap },
                            { label: 'Engenharia', status: budget.validacaoTecnica === 'APROVADO' ? 'CONCLUIDO' : 'PENDENTE', icon: Scale },
                            { label: 'Financeiro', status: budget.validacaoFinanceira === 'APROVADO' ? 'CONCLUIDO' : 'PENDENTE', icon: CreditCard }
                        ].map((step, i) => (
                            <Card key={i} className={cn(
                                "p-6 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-3",
                                step.status === 'CONCLUIDO' ? "bg-emerald-500/5 border-emerald-500/40" : "bg-muted/5 border-border/10 opacity-50"
                            )}>
                                <step.icon size={24} className={step.status === 'CONCLUIDO' ? "text-emerald-500" : "text-muted-foreground"} />
                                <span className="font-black text-[10px] uppercase tracking-widest">{step.label}</span>
                                {step.status === 'CONCLUIDO' && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                            </Card>
                        ))}
                    </div>

                    {/* Escopo & Revisão Form */}
                    <Card className="rounded-2xl border-white/5 bg-background/40 backdrop-blur-xl p-8 overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            {isRevising ? (
                                <motion.div
                                    key="revising"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <History size={20} />
                                        </div>
                                        <h3 className="font-black text-xl uppercase italic">Nova Revisão Técnica</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <Label className="uppercase text-[10px] font-black mb-2 block tracking-widest text-muted-foreground">O que mudou nesta revisão?</Label>
                                            <Input
                                                value={revisionData.resumoAlteracoes}
                                                onChange={e => setRevisionData({ ...revisionData, resumoAlteracoes: e.target.value })}
                                                placeholder="Ex: Atualização do custo de fundações após sondagem..."
                                                className="h-12 bg-white/5 border-white/10 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <Label className="uppercase text-[10px] font-black mb-2 block tracking-widest text-muted-foreground">Valor Estimado (Global)</Label>
                                            <Input
                                                type="number"
                                                value={revisionData.valorEstimado}
                                                onChange={e => setRevisionData({ ...revisionData, valorEstimado: Number(e.target.value) })}
                                                className="h-12 bg-white/5 border-white/10 rounded-xl font-bold"
                                            />
                                        </div>
                                        <div>
                                            <Label className="uppercase text-[10px] font-black mb-2 block tracking-widest text-muted-foreground">Prazo (Meses)</Label>
                                            <Input
                                                type="number"
                                                value={revisionData.prazoEstimadoMeses}
                                                onChange={e => setRevisionData({ ...revisionData, prazoEstimadoMeses: Number(e.target.value) })}
                                                className="h-12 bg-white/5 border-white/10 rounded-xl font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button onClick={handleCreateRevision} className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-xs">Confirmar Alterações</Button>
                                        <Button variant="ghost" onClick={() => setIsRevising(false)} className="rounded-xl h-12 font-black uppercase text-xs">Cancelar</Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-black uppercase tracking-widest italic flex items-center gap-2">
                                            <Info size={18} className="text-primary" /> Detalhamento de Escopo
                                        </h3>
                                        <Badge variant="outline" className="text-[9px] font-bold py-1 px-3 border-white/10">v{budget.revisions?.length ? budget.revisions.length + 1 : 1}.0</Badge>
                                    </div>
                                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 min-h-[150px]">
                                        <p className="text-sm font-medium leading-relaxed opacity-80 whitespace-pre-line text-muted-foreground">
                                            {budget.escopoMacro}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>

                    {/* Revision List */}
                    {budget.revisions && budget.revisions.length > 0 && (
                        <Card className="rounded-2xl border-white/5 bg-background/40 backdrop-blur-xl p-8">
                            <h3 className="text-lg font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <History size={20} className="text-primary" /> Histórico Evolutivo
                            </h3>
                            <div className="space-y-3">
                                {budget.revisions.map((rev, idx) => (
                                    <div key={rev.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-[10px] font-black border border-white/5">
                                                v{rev.version}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-foreground">{rev.resumoAlteracoes || 'Ajuste de escopo técnico'}</p>
                                                <p className="text-[9px] text-muted-foreground uppercase">{new Date(rev.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-emerald-500">R$ {rev.valorEstimado.toLocaleString()}</p>
                                            <p className="text-[9px] font-bold opacity-40">{rev.prazoEstimadoMeses} Meses</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar Widget */}
                <div className="space-y-6">
                    <Card className="rounded-[3rem] p-8 border-2 border-primary/20 bg-primary/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

                        <div className="relative space-y-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Valor Estimado</p>
                                <p className="text-4xl font-black tracking-tighter italic">
                                    {budget.valorEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-background/40 border border-white/5">
                                    <p className="text-[8px] font-black uppercase opacity-50 mb-1">Prazo</p>
                                    <p className="text-sm font-black">{budget.prazoEstimadoMeses} Meses</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-background/40 border border-white/5">
                                    <p className="text-[8px] font-black uppercase opacity-50 mb-1">Status</p>
                                    <p className="text-[10px] font-black uppercase text-emerald-500">{budget.status.split('_')[0]}</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className={cn("shrink-0", budget.validacaoTecnica === 'APROVADO' ? "text-emerald-500" : "text-muted-foreground")} size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Escopo Técnico</span>
                                    </div>
                                    <Badge variant="outline" className={cn("text-[8px] font-black uppercase border-none", budget.validacaoTecnica === 'APROVADO' ? "text-emerald-500" : "text-amber-500")}>
                                        {budget.validacaoTecnica}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className={cn("shrink-0", budget.validacaoFinanceira === 'APROVADO' ? "text-emerald-500" : "text-muted-foreground")} size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Viabilidade Fin.</span>
                                    </div>
                                    <Badge variant="outline" className={cn("text-[8px] font-black uppercase border-none", budget.validacaoFinanceira === 'APROVADO' ? "text-emerald-500" : "text-amber-500")}>
                                        {budget.validacaoFinanceira}
                                    </Badge>
                                </div>
                            </div>

                            {budget.status !== 'APROVADO' && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3 text-amber-600">
                                        <AlertTriangle size={16} className="shrink-0" />
                                        <p className="text-[9px] font-bold uppercase leading-tight">Aguardando aprovação das engrenagens técnica e financeira para liberação comercial.</p>
                                    </div>

                                    {budget.validacaoTecnica === 'PENDENTE' && (
                                        <Button
                                            variant="secondary"
                                            className="w-full h-12 rounded-xl border border-primary/20 bg-primary/10 text-primary font-black uppercase text-[9px] tracking-widest hover:bg-primary/20"
                                            onClick={() => toast("Engenharia notificada!", { description: "Uma nova solicitação foi enviada para a fila técnica." })}
                                        >
                                            Notificar Engenharia
                                        </Button>
                                    )}

                                    {budget.validacaoTecnica === 'APROVADO' && budget.validacaoFinanceira === 'PENDENTE' && (
                                        <Button
                                            variant="secondary"
                                            className="w-full h-12 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-black uppercase text-[9px] tracking-widest hover:bg-emerald-500/20"
                                            onClick={() => toast("Financeiro notificado!", { description: "Aguardando validação de margens e viabilidade." })}
                                        >
                                            Cobrar Financeiro
                                        </Button>
                                    )}
                                </div>
                            )}

                            {budget.status === 'APROVADO' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <Button
                                        onClick={() => onCreateProposal(budget)}
                                        className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-emerald-500/20 group"
                                    >
                                        Gerar Proposta <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </Card>

                    <Card className="p-6 rounded-[2rem] bg-background/40 border border-white/5">
                        <h4 className="text-[10px] font-black uppercase text-muted-foreground mb-4 opacity-50 tracking-[0.2em]">Interações do Workflow</h4>
                        <div className="space-y-4 mb-4">
                            {budget.auditLog && budget.auditLog.length > 0 ? (
                                budget.auditLog.slice(-2).reverse().map((log, i) => (
                                    <div key={log.id} className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-bold text-foreground">{log.description}</p>
                                            <p className="text-[8px] text-muted-foreground uppercase">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <p className="text-[10px] font-bold text-foreground">Engenharia foi notificada via BOT.</p>
                                </div>
                            )}
                        </div>
                        <Button variant="ghost" className="w-full h-10 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">Acelerar Validação</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
