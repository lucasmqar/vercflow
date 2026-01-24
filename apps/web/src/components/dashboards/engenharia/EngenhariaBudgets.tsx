import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    FileText, CheckCircle2, AlertCircle, ChevronRight,
    DollarSign, Filter, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function EngenhariaBudgets({ onOpenScopeValidation }: { onOpenScopeValidation: (item: any) => void }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Orçamentos & Comercial</h2>
                    <p className="text-sm text-muted-foreground mt-1">Validação técnica de leads e aprovação de propostas.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-wide gap-2">
                        <Filter size={14} /> Filtros
                    </Button>
                    <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-wide gap-2">
                        <Download size={14} /> Exportar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Validations List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] bg-background border-border/40 overflow-hidden">
                        <div className="p-8 border-b border-border/40 flex justify-between items-center bg-muted/5">
                            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle size={16} className="text-amber-500" /> Aguardando Validação Técnica
                            </h3>
                            <Badge className="bg-amber-500 text-white border-none">3 Pendentes</Badge>
                        </div>
                        <div className="p-4 space-y-2">
                            {[
                                { client: 'Novo Centro Médico', value: 'R$ 1.2M', date: 'Hoje', status: 'Aguardando Análise', id: 'LEAD-001', location: 'Centro, SP' },
                                { client: 'Residencial Vida Nova', value: 'R$ 450k', date: 'Ontem', status: 'Em Revisão', id: 'LEAD-002', location: 'Jardins, SP' },
                                { client: 'Galpão Logístico Sul', value: 'R$ 3.5M', date: '2 dias', status: 'Urgente', id: 'LEAD-003', location: 'Zona Ind., SP' },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/40 group cursor-pointer" onClick={() => onOpenScopeValidation(item)}>
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold text-sm">
                                            {item.client.substring(0, 1)}
                                        </div>
                                        <div>
                                            <p className="font-black text-base text-foreground group-hover:text-primary transition-colors">{item.client}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest">{item.id}</Badge>
                                                <span className="text-xs text-muted-foreground">{item.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Valor Est.</p>
                                            <p className="text-lg font-black">{item.value}</p>
                                        </div>
                                        <Button size="icon" variant="ghost" className="rounded-xl h-10 w-10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <ChevronRight size={20} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Recently Approved */}
                    <Card className="rounded-[2.5rem] bg-background/50 border-border/40">
                        <div className="p-8 border-b border-border/40 flex justify-between items-center">
                            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" /> Validados Recentemente
                            </h3>
                        </div>
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            Nenhuma validação recente esta semana.
                        </div>
                    </Card>
                </div>

                {/* Performance / Stats */}
                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border-primary/20 p-8">
                        <h3 className="font-black text-sm uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                            <DollarSign size={16} /> Performance
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase">Taxa de Aprovação Técnica</p>
                                <p className="text-4xl font-black mt-2">92%</p>
                                <div className="w-full h-1.5 bg-background/50 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-primary w-[92%]" />
                                </div>
                            </div>
                            <div className="pt-6 border-t border-primary/10">
                                <p className="text-xs font-bold text-muted-foreground uppercase">Tempo Médio de Análise</p>
                                <p className="text-2xl font-black mt-1">4.5 Horas</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
