"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Target, CheckCircle2, Circle,
    ArrowRight, Trophy, TrendingUp,
    Calendar, Users, AlertCircle, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ObrasMetas() {
    const metasSetoriais = [
        {
            setor: 'Infraestrutura',
            meta: 'Concluir Fundações Blocos A-D',
            obra: 'Torre Horizon',
            progresso: 80,
            itens: [
                { id: '1', desc: 'Escavação Bloco A', done: true },
                { id: '2', desc: 'Armação de Ferragens', done: true },
                { id: '3', desc: 'Concretagem Bloco A e B', done: true },
                { id: '4', desc: 'Escavação Bloco C e D', done: false }
            ]
        },
        {
            setor: 'Acabamento',
            meta: 'Revestimento Piso 5º ao 8º',
            obra: 'Residencial Alpha',
            progresso: 45,
            itens: [
                { id: '5', desc: 'Impermeabilização Banheiros', done: true },
                { id: '6', desc: 'Assentamento Cerâmico 5º e 6º', done: true },
                { id: '7', desc: 'Assentamento Cerâmico 7º', done: false },
                { id: '8', desc: 'Rejunte Geral 5º e 6º', done: false }
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header with KPI Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-8 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
                        <Trophy size={160} />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div>
                            <Badge className="bg-white/20 text-white border-none font-black text-[10px] tracking-widest uppercase mb-4">Meta da Semana</Badge>
                            <h2 className="text-4xl font-black tracking-tighter mb-2">Desempenho Geral</h2>
                            <p className="text-white/70 font-medium">Você atingiu 72% das metas planejadas até agora.</p>
                        </div>
                        <div className="mt-12 flex items-center gap-8">
                            <div>
                                <p className="text-[10px] font-black uppercase opacity-60 mb-2">Concluído</p>
                                <p className="text-3xl font-black">24/32</p>
                            </div>
                            <div className="flex-1 max-w-[200px]">
                                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-[72%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6 rounded-[2rem] bg-background border-border/40 shadow-sm flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Velocidade</p>
                            <p className="text-xl font-black">+14.2% <span className="text-[10px] font-bold text-muted-foreground ml-1 uppercase">vs Semana Ant.</span></p>
                        </div>
                    </Card>
                    <Card className="p-6 rounded-[2rem] bg-background border-border/40 shadow-sm flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                            <Target size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Foco Crítico</p>
                            <p className="text-xl font-black">Laje 14º Alpha</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Metas Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {metasSetoriais.map((meta, i) => (
                    <motion.div
                        key={meta.meta}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="rounded-2xl border-white/5 bg-background/40 backdrop-blur-sm p-8 h-full flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase mb-2 text-primary border-primary/20">{meta.setor}</Badge>
                                    <h3 className="text-xl font-black tracking-tight">{meta.meta}</h3>
                                    <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{meta.obra}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-primary">{meta.progresso}%</p>
                                    <p className="text-[9px] font-black uppercase opacity-40">Progresso</p>
                                </div>
                            </div>

                            <div className="space-y-3 flex-1">
                                {meta.itens.map(item => (
                                    <div key={item.id} className={cn(
                                        "p-4 rounded-2xl flex items-center justify-between transition-all border",
                                        item.done ? "bg-emerald-500/5 border-emerald-500/10" : "bg-white/5 border-white/5"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            {item.done ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-muted-foreground opacity-30" />}
                                            <span className={cn(
                                                "text-xs font-bold",
                                                item.done ? "text-emerald-700/80" : "text-muted-foreground"
                                            )}>{item.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button variant="ghost" className="w-full mt-6 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest gap-2 group">
                                Visualizar Checklist Completo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Card>
                    </motion.div>
                ))}

                <Card className="rounded-2xl border-dashed border-2 border-border/40 bg-muted/5 flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:bg-muted/10 transition-all">
                    <div className="w-16 h-16 rounded-full bg-background border border-border/40 flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform mb-4">
                        <Plus size={32} />
                    </div>
                    <h4 className="font-black text-lg">Nova Meta Semanal</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Crie novos objetivos de curto prazo para sua equipe de campo.</p>
                </Card>
            </div>
        </div>
    );
}
