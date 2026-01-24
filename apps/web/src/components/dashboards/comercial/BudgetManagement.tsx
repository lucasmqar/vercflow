"use client"

import React, { useState } from 'react';
import {
    Search,
    Filter,
    ChevronRight,
    FileText,
    DollarSign,
    Clock,
    Briefcase,
    Plus,
    CheckCircle2,
    History,
    AlertTriangle,
    Check
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppFlow } from '@/store/useAppFlow';
import { Budget } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
                            <Card className="rounded-[2rem] border-white/10 bg-background/40 backdrop-blur-xl hover:border-primary/30 transition-all group overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black">
                                                $
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-black text-lg group-hover:text-primary transition-colors">{budget.lead?.nomeObra}</h3>
                                                    <Badge className={cn(
                                                        "text-[8px] font-black uppercase tracking-widest border-none",
                                                        budget.status === 'EM_ELABORACAO' ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                                                    )}>
                                                        {budget.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-4 opacity-60">
                                                    <span className="text-[10px] font-bold uppercase flex items-center gap-1.5 text-emerald-500 font-black">
                                                        R$ {budget.valorEstimado.toLocaleString()}
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase flex items-center gap-1.5"><Clock size={12} /> {budget.prazoEstimadoMeses} Meses</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary group-hover:text-white">
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
    const { updateBudgetStatus, createRequest, createBudgetRevision } = useAppFlow();
    const [isRevising, setIsRevising] = useState(false);
    const [revisionData, setRevisionData] = useState({
        escopoMacro: budget.escopoMacro,
        valorEstimado: budget.valorEstimado,
        prazoEstimadoMeses: budget.prazoEstimadoMeses,
        resumoAlteracoes: ''
    });

    const handleSendToEngineering = () => {
        updateBudgetStatus(budget.id, 'AGUARDANDO_ENGENHARIA');
        createRequest({
            fromDepartment: 'COMERCIAL',
            toDepartment: 'ENGENHARIA',
            type: 'BUDGET_VALIDATION',
            title: `Validação Técnica: ${budget.lead?.nomeObra}`,
            description: `Orçamento de R$ ${budget.valorEstimado.toLocaleString()} aguardando validação de escopo e viabilidade técnica.`,
            priority: 'ALTA',
            status: 'PENDENTE'
        });
    };

    const handleCreateRevision = () => {
        if (!revisionData.resumoAlteracoes) return;
        createBudgetRevision(budget.id, {
            ...revisionData,
            responsavelId: 'current-user-id' // Mock
        });
        setIsRevising(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl border border-white/5 h-11 w-11">
                    <ChevronRight size={20} className="text-primary rotate-180" />
                </Button>
                <div>
                    <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] tracking-widest uppercase mb-1">
                            {budget.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">{budget.lead?.nomeObra}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl p-8">
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                            <h3 className="text-xl font-black uppercase tracking-widest">Escopo Macro & Premissas</h3>
                            {!isRevising && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsRevising(true)}
                                    className="rounded-xl h-9 font-black text-[10px] uppercase tracking-widest"
                                >
                                    Gerar Nova Revisão
                                </Button>
                            )}
                        </div>

                        {isRevising ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-muted-foreground mb-2 block">Motivo da Alteração</label>
                                    <Input
                                        placeholder="Ex: Mudança de tipo de fundação a pedido do cliente"
                                        className="h-11 rounded-xl bg-white/5 border-white/10"
                                        value={revisionData.resumoAlteracoes}
                                        onChange={e => setRevisionData({ ...revisionData, resumoAlteracoes: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-muted-foreground mb-2 block">Novo Valor (R$)</label>
                                        <Input
                                            type="number"
                                            className="h-11 rounded-xl bg-white/5 border-white/10"
                                            value={revisionData.valorEstimado}
                                            onChange={e => setRevisionData({ ...revisionData, valorEstimado: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-muted-foreground mb-2 block">Novo Prazo (Meses)</label>
                                        <Input
                                            type="number"
                                            className="h-11 rounded-xl bg-white/5 border-white/10"
                                            value={revisionData.prazoEstimadoMeses}
                                            onChange={e => setRevisionData({ ...revisionData, prazoEstimadoMeses: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button onClick={handleCreateRevision} className="flex-1 rounded-xl font-black uppercase text-[11px]">Salvar Revisão</Button>
                                    <Button variant="ghost" onClick={() => setIsRevising(false)} className="rounded-xl font-black uppercase text-[11px]">Cancelar</Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm font-medium leading-relaxed opacity-70">
                                {budget.escopoMacro || "Nenhum detalhamento de escopo disponível para este orçamento."}
                            </p>
                        )}
                    </Card>

                    {/* Histórico de Revisões */}
                    {budget.revisions && budget.revisions.length > 0 && (
                        <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl p-8">
                            <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
                                <History size={20} className="text-primary" /> Histórico de Propostas
                            </h3>
                            <div className="space-y-4">
                                {budget.revisions.map((rev, idx) => {
                                    const isLast = idx === (budget.revisions?.length || 0) - 1;
                                    return (
                                        <div key={rev.id} className={cn(
                                            "p-4 rounded-2xl border transition-all",
                                            isLast ? "bg-primary/5 border-primary/20" : "bg-muted/10 border-white/5 opacity-60"
                                        )}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-black uppercase text-primary">Revisão v{rev.version}</span>
                                                        {!isLast && (
                                                            <Badge variant="outline" className="text-[8px] bg-rose-500/10 text-rose-500 border-rose-500/20">OBSOLETA</Badge>
                                                        )}
                                                        {isLast && (
                                                            <Badge variant="outline" className="text-[8px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">ATUAL</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-bold">{rev.resumoAlteracoes}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black">R$ {rev.valorEstimado.toLocaleString()}</p>
                                                    <p className="text-[9px] text-muted-foreground">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] border-white/10 bg-emerald-500/5 p-8 border-dashed border-2">
                        <div className="mb-6">
                            <p className="text-[9px] font-black uppercase opacity-40 mb-1 tracking-widest">Valor Total Estimado</p>
                            <p className="text-4xl font-black tracking-tighter text-emerald-500">R$ {budget.valorEstimado.toLocaleString()}</p>
                        </div>
                        <div className="mb-8">
                            <p className="text-[9px] font-black uppercase opacity-40 mb-1 tracking-widest">Prazo de Execução</p>
                            <p className="text-xl font-black tracking-tighter">{budget.prazoEstimadoMeses} Meses</p>
                        </div>

                        {budget.status === 'EM_ELABORACAO' && (
                            <Button
                                onClick={handleSendToEngineering}
                                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 mb-3"
                            >
                                Enviar para Validação Técnica
                            </Button>
                        )}

                        {budget.status === 'AGUARDANDO_ENGENHARIA' && (
                            <div className="w-full p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center mb-3">
                                <p className="text-amber-500 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Clock size={14} /> Em Análise pela Engenharia
                                </p>
                            </div>
                        )}

                        <Button
                            onClick={() => onCreateProposal(budget)}
                            disabled={budget.status !== 'APROVADO' && budget.status !== 'EM_ELABORACAO'} // Allow if approved or draft (if bypass needed, but ideally approved)
                            className={cn(
                                "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg",
                                budget.status === 'APROVADO'
                                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                                    : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                            )}
                        >
                            Gerar Proposta Comercial
                        </Button>

                        {budget.status !== 'APROVADO' && (
                            <p className="text-[9px] text-center mt-3 text-muted-foreground opacity-60">
                                Necessário aprovação técnica para gerar proposta.
                            </p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

function InfoBlock({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-[9px] font-black uppercase text-muted-foreground opacity-50 tracking-widest mb-1.5">{label}</p>
            <p className="text-sm font-bold">{value}</p>
        </div>
    );
}
