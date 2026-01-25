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
    History,
    FileCheck,
    Users,
    ArrowUpRight,
    Lock,
    Eye,
    Download
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppFlow } from '@/store/useAppFlow';
import { Proposal } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { generateProfessionalPDF } from '@/lib/pdf-service';

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
                        placeholder="Buscar proposta comercial..."
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
                            <Card className="rounded-2xl border-white/10 bg-background/40 backdrop-blur-xl hover:border-primary/30 transition-all group overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black">
                                                <FileCheck size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-black text-lg group-hover:text-primary transition-colors">{prop.budget?.lead?.nomeObra}</h3>
                                                    <Badge className={cn(
                                                        "text-[8px] font-black uppercase tracking-widest border-none",
                                                        prop.status === 'APROVADA' ? "bg-emerald-500/10 text-emerald-500" :
                                                            prop.status === 'RECUSADA' ? "bg-rose-500/10 text-rose-500" :
                                                                "bg-primary/10 text-primary"
                                                    )}>
                                                        {prop.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-4 opacity-60">
                                                    <span className="text-[10px] font-black uppercase flex items-center gap-1.5 text-indigo-500">
                                                        {prop.valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase flex items-center gap-1.5">v{prop.versao}.0 • Ativa</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right hidden sm:block mr-4">
                                                <p className="text-[8px] font-black uppercase text-muted-foreground">Último envio</p>
                                                <p className="text-xs font-bold">{new Date(prop.criadoEm).toLocaleDateString()}</p>
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

export function ProposalDetailPage({ proposal, onBack, onApprove }: { proposal: Proposal, onBack: () => void, onApprove: (id: string) => void }) {
    const handleDownloadPDF = async () => {
        toast("Gerando Proposta Executiva...", {
            description: "Estruturando termos comerciais e financeiros."
        });

        const data = {
            id_proposta: proposal.id,
            versao: `${proposal.versao}.0`,
            obra: proposal.budget?.lead?.nomeObra || 'N/A',
            cliente: proposal.budget?.lead?.nomeValidacao || 'N/A',
            documento: proposal.budget?.lead?.client?.documento || 'N/A',
            natureza: proposal.budget?.lead?.classificacao?.natureza || 'N/A',
            valor_final: proposal.valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            prazo_execucao: `${proposal.budget?.prazoEstimadoMeses} Meses`,
            status_comercial: proposal.status,
            condicoes: proposal.condicoesEspeciais || "Condições padrão VERCFLOW",
            emissao: new Date(proposal.criadoEm).toLocaleDateString('pt-BR')
        };

        try {
            await generateProfessionalPDF(
                `Proposta Comercial: ${proposal.budget?.lead?.nomeObra}`,
                data,
                `PROP_${proposal.id.substring(0, 8)}.pdf`
            );
            toast.success("Proposta gerada com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Falha ao gerar proposta.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl border border-white/5 h-12 w-12 bg-background/50 backdrop-blur-sm">
                        <ChevronRight size={20} className="text-primary rotate-180" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-indigo-500/10 text-indigo-500 border-none font-black text-[9px] tracking-[0.2em] uppercase">
                                Proposal v{proposal.versao}
                            </Badge>
                            <Badge className={cn("font-black text-[9px] tracking-[0.2em] uppercase", proposal.status === 'APROVADA' ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary")}>
                                {proposal.status}
                            </Badge>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic">{proposal.budget?.lead?.nomeObra}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleDownloadPDF}
                        className="rounded-xl border-white/10 h-11 px-6 font-black text-[10px] uppercase tracking-widest gap-2"
                    >
                        <Eye size={14} /> Pré-visualizar PDF
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => toast.success("Link enviado!", { description: "O link da proposta foi enviado para o e-mail do cliente." })}
                        className="rounded-xl border-white/10 h-11 px-6 font-black text-[10px] uppercase tracking-widest gap-2"
                    >
                        <Send size={14} /> Reenviar Link
                    </Button>
                </div>
            </div>

            {/* Matrix View */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Contractual/Draft View */}
                <div className="lg:col-span-3 space-y-8">

                    {/* Executive Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-6 rounded-xl bg-secondary/20 border-white/5">
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Investimento Global</p>
                            <div className="flex items-end justify-between">
                                <h4 className="text-3xl font-black tracking-tighter">{proposal.valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h4>
                                <Badge className="bg-primary/10 text-primary text-[8px]">+12.5% vs Base</Badge>
                            </div>
                        </Card>
                        <Card className="p-6 rounded-xl bg-secondary/20 border-white/5">
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Prazo de Entrega</p>
                            <div className="flex items-end justify-between">
                                <h4 className="text-3xl font-black tracking-tighter">{proposal.budget?.prazoEstimadoMeses} <span className="text-xs uppercase opacity-40">Meses</span></h4>
                            </div>
                        </Card>
                        <Card className="p-6 rounded-xl bg-secondary/20 border-white/5">
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Data Limite (Validade)</p>
                            <div className="flex items-end justify-between">
                                <h4 className="text-2xl font-black tracking-tighter uppercase italic">{proposal.dataValidade || 'Em 30 Dias'}</h4>
                            </div>
                        </Card>
                    </div>

                    {/* The "Document" Surface */}
                    <Card className="rounded-2xl border-white/5 bg-background shadow-2xl relative overflow-hidden min-h-[600px]">
                        {/* Letterhead Header */}
                        <div className="p-12 border-b border-white/5 flex justify-between items-start bg-secondary/[0.02]">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-primary flex items-center justify-center font-black text-white text-2xl rounded-xl">V</div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Proposta Técnica-Comercial</p>
                                    <p className="text-xs font-bold text-muted-foreground">Emitido por: VERCFLOW Engineering Solutions</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-muted-foreground">Documento de Referência</p>
                                <p className="text-xs font-bold">PROP-2026-0042</p>
                                <p className="text-[10px] text-muted-foreground opacity-40">{new Date(proposal.criadoEm).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Document Body */}
                        <div className="p-16 space-y-12">
                            <div className="space-y-4">
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] border-l-4 border-primary pl-4">1. Identificação do Objeto</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    Esta proposta refere-se à prestação de serviços de engenharia e gestão para a obra denominada "{proposal.budget?.lead?.nomeObra}", conforme detalhamento técnico validado pelo departamento de engenharia em {new Date(proposal.budget?.criadoEm || '').toLocaleDateString()}.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] border-l-4 border-primary pl-4">2. Condições Especiais & Negociação</h4>
                                <div className="p-10 rounded-xl bg-secondary/[0.03] border border-white/5 italic text-sm text-muted-foreground leading-relaxed">
                                    {proposal.condicoesEspeciais || "Não há condições excepcionais registradas para esta versão."}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] border-l-4 border-primary pl-4">3. Cronograma Físico-Financeiro</h4>
                                <div className="grid grid-cols-4 gap-4">
                                    {['Mobilização', 'Infraestrutura', 'Acabamentos', 'Entrega'].map((phase, i) => (
                                        <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                            <p className="text-[8px] font-black text-primary uppercase mb-1">{phase}</p>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${(i + 1) * 25}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Watermark/Security */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 rotate-45 pointer-events-none select-none">
                            <FileCheck size={400} />
                        </div>
                    </Card>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <Card className="rounded-[3rem] p-8 bg-indigo-500/5 border-2 border-indigo-500/20 shadow-xl relative group overflow-hidden">
                        <div className="relative z-10 space-y-8">
                            <div>
                                <p className="text-[10px] font-black uppercase text-indigo-500 mb-2 tracking-widest">Ações do Comercial</p>
                                <h3 className="text-xl font-black italic">Fechamento do Negócio</h3>
                            </div>

                            <div className="space-y-3">
                                {proposal.status !== 'APROVADA' ? (
                                    <Button
                                        onClick={() => onApprove(proposal.id)}
                                        className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-emerald-500/20"
                                    >
                                        <CheckCircle2 size={18} className="mr-2" /> Ativar Obra Agora
                                    </Button>
                                ) : (
                                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                        <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                                        <p className="text-[10px] font-black uppercase text-emerald-600">Obra em Execução</p>
                                    </div>
                                )}

                                <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 font-black uppercase text-[9px] tracking-widest">
                                    Sugerir Revisão (v{proposal.versao + 1})
                                </Button>
                                <Button variant="ghost" className="w-full h-10 rounded-xl text-rose-500 font-black uppercase text-[9px] tracking-widest hover:bg-rose-500/5">
                                    Perder Proposta
                                </Button>
                            </div>

                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground">
                                    <span>Compliance Financeiro</span>
                                    <Badge className="bg-emerald-500 border-none text-[8px]">VALIDADO</Badge>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground">
                                    <span>Análise do CEO</span>
                                    <Badge className="bg-indigo-500 border-none text-[8px]">CONFIRMADO</Badge>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Shared Collaboration Widget */}
                    <Card className="p-6 rounded-[2rem] bg-background/40 border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users size={16} className="text-primary" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Interações Recentes</p>
                        </div>
                        <div className="space-y-4">
                            {proposal.auditLog && proposal.auditLog.length > 0 ? (
                                proposal.auditLog.slice(-3).reverse().map((log, i) => (
                                    <div key={log.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[8px] font-bold">
                                            {log.userName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold">{log.userName}</p>
                                            <p className="text-[8px] text-muted-foreground uppercase">{log.action}: {log.description} • {new Date(log.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] text-muted-foreground italic">Nenhuma interação registrada.</p>
                            )}
                        </div>
                        <Button variant="ghost" className="w-full text-[9px] font-black uppercase text-primary">Ver Audit Log Completo</Button>
                    </Card>

                    <Card className="p-8 rounded-[2rem] border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent">
                        <Download size={24} className="text-indigo-400 mb-4" />
                        <p className="text-xs font-bold leading-relaxed">A Proposta Comercial é o trigger jurídico para ativação de faturamentos e alocação de equipes no VERCFLOW v2.0.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function InfoBlock({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-[10px] font-black uppercase text-muted-foreground opacity-50 tracking-[0.2em] mb-2">{label}</p>
            <p className="text-lg font-black">{value}</p>
        </div>
    );
}
