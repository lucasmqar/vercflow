"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Activity, Calendar, Clock,
    CheckCircle2, AlertTriangle, ChevronRight,
    GanttChartSquare, Layers, MessageSquare, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ObrasCronograma() {
    const milestones = [
        {
            id: '1',
            obra: 'Residencial Alpha',
            etapa: 'Estrutura',
            atividade: 'Concretagem Laje 12º Pavimento',
            dataInicio: '2026-01-20',
            dataFim: '2026-01-25',
            progresso: 85,
            status: 'EM_ANDAMENTO',
            prioridade: 'ALTA'
        },
        {
            id: '2',
            obra: 'Residencial Alpha',
            etapa: 'Instalações',
            atividade: 'Passagem de tubulação hidráulica (Prumada B)',
            dataInicio: '2026-01-22',
            dataFim: '2026-02-05',
            progresso: 15,
            status: 'ATRASADO',
            prioridade: 'CRITICA'
        },
        {
            id: '3',
            obra: 'Torre Horizon',
            etapa: 'Infraestrutura',
            atividade: 'Escavação de Blocos de Fundação',
            dataInicio: '2026-01-15',
            dataFim: '2026-01-30',
            progresso: 60,
            status: 'EM_ANDAMENTO',
            prioridade: 'MEDIA'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <GanttChartSquare className="text-primary" />
                        Cronograma Master
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Acompanhamento de metas críticas e prazos contratuais.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-wide border-border/40 gap-2">
                        <Layers size={16} /> Visão Gantt
                    </Button>
                    <Button className="rounded-xl font-bold text-xs uppercase tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Plus size={16} className="mr-2" /> Nova Atividade
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {milestones.map((task, i) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="p-8 rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-sm overflow-hidden relative group">
                            {/* Priority Indicator */}
                            <div className={cn(
                                "absolute top-0 left-0 bottom-0 w-2",
                                task.prioridade === 'CRITICA' ? "bg-red-500" :
                                    task.prioridade === 'ALTA' ? "bg-amber-500" : "bg-blue-500"
                            )} />

                            <div className="flex flex-col lg:flex-row justify-between gap-8">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest">{task.etapa}</Badge>
                                        <span className="text-xs font-bold text-muted-foreground opacity-60">{task.obra}</span>
                                    </div>

                                    <h4 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{task.atividade}</h4>

                                    <div className="flex flex-wrap gap-6 text-xs font-bold text-muted-foreground/60 uppercase">
                                        <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> Início: {new Date(task.dataInicio).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-2"><Clock size={14} className="text-primary" /> Previsão: {new Date(task.dataFim).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="w-full lg:w-80 space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Progresso físico</span>
                                        <span className={cn(
                                            "text-lg font-black",
                                            task.status === 'ATRASADO' ? "text-red-500" : "text-primary"
                                        )}>{task.progresso}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-muted/30 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${task.progresso}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={cn(
                                                "h-full rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]",
                                                task.status === 'ATRASADO' ? "bg-red-500" : "bg-primary"
                                            )}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            {task.status === 'ATRASADO' && <AlertTriangle size={14} className="text-red-500" />}
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                task.status === 'ATRASADO' ? "text-red-500" : "text-emerald-500"
                                            )}>{task.status.replace('_', ' ')}</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] uppercase font-black tracking-widest gap-2">
                                            <MessageSquare size={14} /> Reportar Obstáculo
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
