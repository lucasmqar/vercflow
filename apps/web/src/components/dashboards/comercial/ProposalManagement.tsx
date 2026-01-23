"use client"

import React, { useState } from 'react';
import {
    Search,
    ChevronRight,
    FileText,
    DollarSign,
    Clock,
    Briefcase,
    CheckCircle2,
    Calendar,
    Send,
    History
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppFlow } from '@/store/useAppFlow';
import { Proposal } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ProposalListPage({ onSelect }: { onSelect: (proposal: Proposal) => void }) {
    const { proposals } = useAppFlow();
    const [search, setSearch] = useState('');

    const filteredProposals = proposals.filter(p =>
        p.budget?.lead?.nomeObra.toLowerCase().includes(search.toLowerCase())
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

            {filteredProposals.length === 0 ? (
                <div className="py-20 text-center opacity-30">
                    <Briefcase size={64} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest text-sm">Nenhuma proposta em negociação</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredProposals.map((prop) => (
                        <motion.div
                            key={prop.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.01 }}
                            className="cursor-pointer"
                            onClick={() => onSelect(prop)}
                        >
                            <Card className="rounded-[2rem] border-white/10 bg-background/40 backdrop-blur-xl hover:border-primary/30 transition-all group overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
                                                v{prop.versao}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-black text-lg group-hover:text-primary transition-colors">{prop.budget?.lead?.nomeObra}</h3>
                                                    <Badge className={cn(
                                                        "text-[8px] font-black uppercase tracking-widest border-none",
                                                        prop.status === 'APROVADA' ? "bg-emerald-500/10 text-emerald-500" :
                                                            prop.status === 'NEGOCIACAO' ? "bg-amber-500/10 text-amber-500" :
                                                                "bg-blue-500/10 text-blue-500"
                                                    )}>
                                                        {prop.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-4 opacity-60">
                                                    <span className="text-[10px] font-bold uppercase flex items-center gap-1.5 text-primary font-black">
                                                        R$ {prop.valorFinal.toLocaleString()}
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase flex items-center gap-1.5"><Calendar size={12} /> Validade: {prop.dataValidade || '30 dias'}</span>
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

export function ProposalDetailPage({ proposal, onBack, onApprove }: { proposal: Proposal, onBack: () => void, onApprove: (id: string) => void }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl border border-white/5 h-11 w-11">
                    <Briefcase size={20} className="text-primary rotate-180" />
                </Button>
                <div>
                    <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] tracking-widest uppercase mb-1">DETALHES DA PROPOSTA v{proposal.versao}</Badge>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">{proposal.budget?.lead?.nomeObra}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl p-8">
                        <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Vínculos & Origem</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InfoBlock label="Orçamento Base" value={`R$ ${proposal.budget?.valorEstimado.toLocaleString()}`} />
                            <InfoBlock label="Variação" value={`${Math.round(((proposal.valorFinal / (proposal.budget?.valorEstimado || 1)) - 1) * 100)}% em relação ao budget`} />
                        </div>
                    </Card>

                    <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl p-8">
                        <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Condições Especiais</h3>
                        <p className="text-sm font-medium leading-relaxed opacity-70 italic">
                            {proposal.condicoesEspeciais || "Nenhuma condição especial registrada para esta versão da proposta."}
                        </p>
                    </Card>

                    <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl p-8">
                        <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Histórico de Versões</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-primary/20">
                                <div className="flex items-center gap-3">
                                    <History size={16} className="text-primary" />
                                    <span className="text-xs font-black uppercase tracking-widest">Versão Atual (v{proposal.versao})</span>
                                </div>
                                <span className="text-xs font-bold text-primary">ATIVA</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] border-white/10 bg-primary/5 p-8 border-dashed border-2">
                        <div className="mb-6 text-center">
                            <p className="text-[9px] font-black uppercase opacity-40 mb-1 tracking-widest">Valor Final Negociado</p>
                            <p className="text-4xl font-black tracking-tighter text-primary">R$ {proposal.valorFinal.toLocaleString()}</p>
                        </div>

                        <div className="space-y-3 mb-8">
                            <Button className="w-full h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold uppercase text-[10px] gap-2">
                                <FileText size={14} /> Baixar PDF
                            </Button>
                            <Button className="w-full h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold uppercase text-[10px] gap-2">
                                <Send size={14} /> Enviar por E-mail
                            </Button>
                        </div>

                        {proposal.status !== 'APROVADA' && (
                            <Button
                                onClick={() => onApprove(proposal.id)}
                                className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-500/20 gap-2"
                            >
                                <CheckCircle2 size={18} /> Marcar como Aprovada
                            </Button>
                        )}

                        {proposal.status === 'APROVADA' && (
                            <Badge className="w-full h-14 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] justify-center gap-2">
                                <CheckCircle2 size={18} /> Proposta Aprovada
                            </Badge>
                        )}

                        <p className="text-[10px] text-muted-foreground font-medium text-center mt-6">
                            Ao marcar como aprovada, o sistema criará automaticamente a Obra em Planejamento e notificará a Engenharia.
                        </p>
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
