"use client"

import React, { useState } from 'react';
import {
    FileText,
    Download,
    Send,
    Plus,
    ChevronRight,
    Clock,
    User,
    CheckCircle2,
    AlertCircle,
    History,
    FileEdit,
    BadgeDollarSign,
    Building2,
    Calendar,
    Save,
    FilePlus,
    Copy,
    Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import HeaderAnimated from '@/components/common/HeaderAnimated';

export function FinancialProposals({ obraName = "Edifício Infinity Coast" }: { obraName?: string }) {
    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-24">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1">
                    <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest uppercase mb-2">Financeiro & Propostas</Badge>
                    <HeaderAnimated title={obraName} />
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl h-12 gap-2 font-black px-6 border-border/40 uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">
                        <History size={18} /> Histórico de Versões
                    </Button>
                    <Button className="rounded-2xl h-12 gap-2 font-black px-6 uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                        <FilePlus size={18} /> Gerar Nova Carta
                    </Button>
                </div>
            </div>

            {/* Editor Preview & Control */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Proposal Metadata */}
                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                        <CardContent className="p-8 space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Dados da Proposta Atual</h3>

                            <div className="space-y-4">
                                <MetadataItem label="Valor Global" value="R$ 4.250.000,00" />
                                <MetadataItem label="Status Financeiro" value="Congelado" />
                                <MetadataItem label="Condição Pgto" value="30/60/90 Dias" />
                                <MetadataItem label="Índice Reajuste" value="INCC-DI" />
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                        v4
                                    </div>
                                    <div>
                                        <p className="font-black text-sm tracking-tight">Versão para Emissão</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Atualizado há 2 horas</p>
                                    </div>
                                </div>
                                <Button className="w-full rounded-2xl h-12 gap-2 font-black px-6 uppercase text-[10px] tracking-widest bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
                                    Finalizar & Publicar <Save size={16} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                        <CardContent className="p-8">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">Templates Disponíveis</h3>
                            <div className="space-y-2">
                                <TemplateItem title="residencial_padrao.pdf" active={true} />
                                <TemplateItem title="industrial_completa.pdf" active={false} />
                                <TemplateItem title="hospitalar_v2.pdf" active={false} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Editor Surface */}
                <Card className="lg:col-span-2 rounded-[2.5rem] border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden shadow-2xl min-h-[800px] flex flex-col">
                    <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5"><FileEdit size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5"><Copy size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5"><Share2 size={14} /></Button>
                        <div className="h-4 w-[1px] bg-white/10 mx-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Editor Ativo: Carta Proposta Residencial</span>
                    </div>

                    <CardContent className="p-12 flex-1">
                        <div className="max-w-3xl mx-auto space-y-12">
                            <div className="flex justify-between items-start border-b border-white/5 pb-12">
                                <Building2 size={48} className="text-primary/40" />
                                <div className="text-right">
                                    <h4 className="font-black text-2xl tracking-tighter uppercase">Proposta Comercial</h4>
                                    <p className="text-xs font-bold text-muted-foreground">REF: {obraName} - 2024.08</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h5 className="font-black text-lg tracking-tight">1. Objeto da Proposta</h5>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                    Esta carta de proposta tem como objetivo formalizar os termos técnicos e financeiros para a execução da obra {obraName}, contemplando todas as disciplinas técnicas aprovadas no estágio inicial de projetos.
                                </p>

                                <h5 className="font-black text-lg tracking-tight">2. Condições Financeiras</h5>
                                <table className="w-full text-left text-sm">
                                    <tr className="border-b border-white/5">
                                        <td className="py-4 font-bold text-muted-foreground">Valor Total do Contrato</td>
                                        <td className="py-4 text-right font-black">R$ 4.250.000,00</td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="py-4 font-bold text-muted-foreground">Percentual de Sinal</td>
                                        <td className="py-4 text-right font-black text-primary">15% (R$ 637.500,00)</td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="py-4 font-bold text-muted-foreground">Parcelamento Estimado</td>
                                        <td className="py-4 text-right font-black">12 Parcelas Fixas</td>
                                    </tr>
                                </table>
                            </div>

                            <div className="pt-24 text-center">
                                <div className="w-48 h-[1px] bg-white/10 mx-auto mb-4" />
                                <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Responsável Financeiro</p>
                            </div>
                        </div>
                    </CardContent>

                    <div className="p-8 border-t border-white/5 bg-white/5 flex justify-between items-center">
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] uppercase px-3 py-1">Ready for Signature</Badge>
                        <div className="flex gap-4">
                            <Button variant="outline" className="rounded-xl h-12 gap-2 font-black px-6 border-white/10 uppercase text-[10px] tracking-widest hover:bg-white/5">
                                <Download size={18} /> Exportar PDF
                            </Button>
                            <Button className="rounded-xl h-12 gap-2 font-black px-8 uppercase text-[10px] tracking-widest bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                <Send size={18} /> Enviar ao Comercial
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

// Helpers
function MetadataItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
            <span className="text-[11px] font-black">{value}</span>
        </div>
    );
}

function TemplateItem({ title, active }: { title: string, active: boolean }) {
    return (
        <div className={cn(
            "flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer",
            active ? "bg-primary/10 border-primary text-primary" : "bg-white/2 border-white/5 hover:bg-white/5 text-muted-foreground"
        )}>
            <FileText size={16} />
            <span className="text-xs font-bold truncate">{title}</span>
        </div>
    );
}
