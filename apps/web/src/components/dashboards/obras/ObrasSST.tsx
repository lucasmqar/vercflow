"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertTriangle, ShieldCheck, ShieldAlert,
    FileWarning, HardHat, Camera,
    ChevronRight, Plus, MapPin,
    CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ObrasSST() {
    const ocorrencias = [
        {
            id: '1',
            tipo: 'FALTA_EPI',
            descricao: 'Colaborador sem uso de protetor auricular em zona de ruído elevado.',
            local: 'Torre Horizon - Garagem G2',
            gravidade: 'ALTA',
            data: '2026-01-24',
            status: 'PENDENTE_RESOLUCAO',
            responsavel: 'Téc. Seg. Marcos'
        },
        {
            id: '2',
            tipo: 'RISCO_QUEDA',
            descricao: 'Guarda-corpo provisório com fixação comprometida no 12º pavimento.',
            local: 'Residencial Alpha - Pav 12',
            gravidade: 'CRITICA',
            data: '2026-01-23',
            status: 'CONCLUIDO',
            responsavel: 'Eng. Roberto'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <ShieldAlert className="text-red-500" />
                        Ocorrências SST / Segurança
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Controle de segurança do trabalho e mitigação de riscos em campo.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-wide border-border/40 gap-2">
                        <ShieldCheck size={16} /> Inspeção Diária
                    </Button>
                    <Button className="rounded-xl font-bold text-xs uppercase tracking-wide bg-red-500 text-white shadow-lg shadow-red-500/20">
                        <Plus size={16} className="mr-2" /> Reportar Incidente
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 rounded-[2rem] bg-background border-border/40 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 size={24} />
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-none font-black text-[9px] uppercase tracking-widest">OK</Badge>
                    </div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60 mb-1">Índice de Acidentes</p>
                    <p className="text-2xl font-black">Zero <span className="text-[10px] font-bold text-muted-foreground ml-1 uppercase">Dias</span></p>
                </Card>
                <Card className="p-6 rounded-[2rem] bg-background border-border/40 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
                            <AlertCircle size={24} />
                        </div>
                        <Badge variant="outline" className="bg-red-500/5 text-red-500 border-none font-black text-[9px] uppercase tracking-widest">Critical</Badge>
                    </div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60 mb-1">Pendências Críticas</p>
                    <p className="text-2xl font-black">12 <span className="text-[10px] font-bold text-muted-foreground ml-1 uppercase">Itens</span></p>
                </Card>
                <Card className="p-6 rounded-[2rem] bg-background border-border/40 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                            <Clock size={24} />
                        </div>
                        <Badge variant="outline" className="bg-blue-500/5 text-blue-500 border-none font-black text-[9px] uppercase tracking-widest">ASO</Badge>
                    </div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60 mb-1">Vencimentos Médicos</p>
                    <p className="text-2xl font-black">04 <span className="text-[10px] font-bold text-muted-foreground ml-1 uppercase">ASO Prox.</span></p>
                </Card>
            </div>

            {/* Timeline of Occurrences */}
            <div className="space-y-4">
                {ocorrencias.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="group p-6 rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-sm hover:border-red-500/20 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center",
                                        item.gravidade === 'CRITICA' ? "bg-red-500/20 text-red-500" : "bg-amber-500/20 text-amber-500"
                                    )}>
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-black text-sm uppercase tracking-tight">{item.tipo.replace('_', ' ')}</h4>
                                            <Badge variant="outline" className={cn(
                                                "text-[9px] font-black uppercase tracking-widest border-none px-2 py-0.5",
                                                item.gravidade === 'CRITICA' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                                            )}>
                                                {item.gravidade}
                                            </Badge>
                                        </div>
                                        <p className="text-[13px] font-medium text-muted-foreground leading-snug max-w-xl">{item.descricao}</p>
                                        <div className="flex items-center gap-4 pt-1">
                                            <span className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1.5"><MapPin size={12} /> {item.local}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1.5 uppercase leading-none">{new Date(item.data).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 justify-between lg:justify-end">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(p => (
                                            <div key={p} className="w-8 h-8 rounded-full border-2 border-background bg-muted bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed='+p)] bg-cover" />
                                        ))}
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[9px] font-black uppercase opacity-40 mb-1">Resolvido por</p>
                                        <p className="text-xs font-black">{item.status === 'CONCLUIDO' ? item.responsavel : 'Pendente'}</p>
                                    </div>
                                    <Button variant="ghost" className={cn(
                                        "h-12 rounded-2xl gap-2 font-black text-[10px] uppercase tracking-widest px-6",
                                        item.status === 'CONCLUIDO' ? "text-emerald-500" : "text-amber-500 bg-amber-500/5 hover:bg-amber-500/10"
                                    )}>
                                        {item.status === 'CONCLUIDO' ? <CheckCircle2 size={16} /> : <FileWarning size={16} />}
                                        {item.status === 'CONCLUIDO' ? 'Resolvido' : 'Tratar Agora'}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
