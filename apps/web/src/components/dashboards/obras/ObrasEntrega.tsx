"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2, ClipboardCheck, Home,
    Zap, Droplets, HardHat, Camera,
    ChevronRight, ArrowRight, Star,
    FileCheck, Search, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ObrasEntrega() {
    const deliveryChecklists = [
        {
            id: '1',
            obra: 'Residencial Alpha',
            unidade: 'Apto 402 - Torre A',
            status: 'INSPECAO_FINAL',
            progresso: 92,
            setores: [
                { id: 's1', nome: 'Elétrica', status: 'OK' },
                { id: 's2', nome: 'Hidráulica', status: 'OK' },
                { id: 's3', nome: 'Pintura', status: 'REVISAR' },
                { id: 's4', nome: 'Limpeza Fina', status: 'PENDENTE' }
            ]
        },
        {
            id: '2',
            obra: 'Residencial Alpha',
            unidade: 'Apto 1205 - Torre B',
            status: 'ENTREGUE_CLIENTE',
            progresso: 100,
            setores: [
                { id: 's1', nome: 'Geral', status: 'OK' }
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <ClipboardCheck className="text-primary" />
                        Checklist de Entrega Técnica
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Validação final de qualidade e entrega definitiva ao cliente.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-wide border-border/40 gap-2">
                        <FileCheck size={16} /> Relatórios Emitidos
                    </Button>
                    <Button className="rounded-xl font-bold text-xs uppercase tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Plus size={16} className="mr-2" /> Nova Inspeção
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deliveryChecklists.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-sm p-8 flex flex-col h-full group hover:border-primary/30 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                    <Home size={24} />
                                </div>
                                <Badge className={cn(
                                    "text-[9px] font-black uppercase tracking-widest px-3 py-1 border-none",
                                    item.status === 'ENTREGUE_CLIENTE' ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary shadow-inner"
                                )}>
                                    {item.status.replace('_', ' ')}
                                </Badge>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{item.unidade}</h3>
                                <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60 tracking-widest mt-1">{item.obra}</p>
                            </div>

                            <div className="space-y-3 mb-8 flex-1">
                                {item.setores.map(setor => (
                                    <div key={setor.id} className="flex justify-between items-center text-[10px] font-bold uppercase py-2 border-b border-border/10 last:border-0 opacity-80">
                                        <span className="flex items-center gap-2">
                                            {setor.status === 'OK' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Star size={12} className="text-amber-500 fill-amber-500/20" />}
                                            {setor.nome}
                                        </span>
                                        <span className={setor.status === 'OK' ? "text-emerald-500" : "text-amber-500"}>{setor.status}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                    <span>Qualidade Final</span>
                                    <span className="text-primary">{item.progresso}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000"
                                        style={{ width: `${item.progresso}%` }}
                                    />
                                </div>
                                <Button className="w-full h-12 rounded-xl bg-primary/10 hover:bg-primary shadow-none text-primary hover:text-white font-black uppercase text-[10px] tracking-widest transition-all mt-4 border border-primary/5">
                                    Abrir Checklist Completo
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}

                <Card className="rounded-[2.5rem] border-dashed border-border/40 bg-muted/5 flex items-center justify-center p-8 opacity-40 hover:opacity-100 transition-opacity cursor-pointer text-center">
                    <div>
                        <Plus size={40} className="mx-auto mb-3" />
                        <p className="text-xs font-black uppercase tracking-widest">Adicionar Unidade</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
