import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    FileText, Search, Plus, Filter, Calendar,
    ArrowRight, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Proposal } from '@/types';
import { ProposalDetailPage } from './ProposalManagement';

export function ComercialProposals({
    proposals,
    selectedProposalId,
    onSelectProposal,
    onBack,
    onApprove
}: any) {

    if (selectedProposalId) {
        const proposal = proposals.find((p: Proposal) => p.id === selectedProposalId);
        if (!proposal) return null;
        return (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                <ProposalDetailPage
                    proposal={proposal}
                    onBack={onBack}
                    onApprove={(id: string) => onApprove(id)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Propostas Comerciais</h2>
                    <p className="text-sm text-muted-foreground mt-1">Gestão de propostas enviadas e negociações.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Buscar proposta..." className="pl-10 rounded-xl bg-background/50 border-border/40" />
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {proposals.map((proposal: Proposal) => (
                    <Card
                        key={proposal.id}
                        onClick={() => onSelectProposal(proposal.id)}
                        className="group p-6 rounded-[2rem] border-white/5 bg-background/40 backdrop-blur-sm hover:shadow-lg hover:border-purple-500/20 transition-all cursor-pointer"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className="hidden md:flex w-14 h-14 rounded-2xl bg-purple-500/10 items-center justify-center text-purple-600 font-bold">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-bold text-lg text-foreground group-hover:text-purple-600 transition-colors">
                                            {proposal.budget?.lead?.client?.nome || 'Cliente'}
                                        </h4>
                                        <Badge variant="outline" className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            proposal.status === 'APROVADA' ? "text-emerald-600 border-emerald-200" :
                                                proposal.status === 'RECUSADA' ? "text-red-600 border-red-200" : "text-muted-foreground"
                                        )}>
                                            {proposal.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Versão {proposal.versao} • Válida até {proposal.dataValidade || '-'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Valor Final</p>
                                    <p className="text-xl font-black">{proposal.valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                </div>
                                <Button size="icon" variant="ghost" className="rounded-xl h-12 w-12 text-muted-foreground group-hover:text-purple-600 group-hover:bg-purple-500/10 transition-all">
                                    <ArrowRight size={24} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
