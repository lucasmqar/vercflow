"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    TrendingUp, MapPin, Clock, DollarSign,
    ChevronRight, ArrowRight, Briefcase,
    CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import { Lead, Project, Budget, Proposal } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ComercialPipelineProps {
    leads: Lead[];
    projects: Project[];
    budgets: Budget[];
    proposals: Proposal[];
    onSelectLead: (id: string) => void;
}

export function ComercialPipeline({ leads, projects, budgets, proposals, onSelectLead }: ComercialPipelineProps) {
    const stages = [
        {
            id: 'leads',
            label: 'Captação / Leads',
            color: 'orange',
            items: leads.filter(l => l.status === 'NOVO' || l.status === 'EM_QUALIFICACAO').map(l => ({
                id: l.id,
                title: l.nomeObra,
                subtitle: l.localizacao,
                value: l.areaEstimada ? `${l.areaEstimada} m²` : '--',
                status: l.status,
                icon: TrendingUp
            }))
        },
        {
            id: 'budgets',
            label: 'Em Orçamento',
            color: 'blue',
            items: budgets.filter(b => b.status === 'EM_ELABORACAO' || b.status === 'AGUARDANDO_ENGENHARIA').map(b => {
                const lead = leads.find(l => l.id === b.leadId);
                return {
                    id: b.id,
                    title: lead?.nomeObra || 'Orçamento S/N',
                    subtitle: lead?.localizacao || 'Local não definido',
                    value: b.valorEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                    status: b.status,
                    icon: FileText
                };
            })
        },
        {
            id: 'proposals',
            label: 'Propostas / Negociação',
            color: 'purple',
            items: proposals.filter(p => p.status === 'PENDENTE' || p.status === 'NEGOCIACAO').map(p => {
                const budget = budgets.find(b => b.id === p.budgetId);
                const lead = leads.find(l => l.id === budget?.leadId);
                return {
                    id: p.id,
                    title: lead?.nomeObra || 'Proposta S/N',
                    subtitle: lead?.localizacao || 'Local não definido',
                    value: p.valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                    status: p.status,
                    icon: Briefcase
                };
            })
        },
        {
            id: 'active',
            label: 'Obras Ativas',
            color: 'emerald',
            items: projects.map(p => ({
                id: p.id,
                title: p.nome,
                subtitle: p.endereco,
                value: p.area ? `${p.area} m²` : '--',
                status: p.status,
                icon: CheckCircle2
            }))
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full min-h-[600px]">
            {stages.map((stage, sIdx) => (
                <div key={stage.id} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-3">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                stage.color === 'orange' ? "bg-orange-500" :
                                    stage.color === 'blue' ? "bg-blue-500" :
                                        stage.color === 'purple' ? "bg-purple-500" :
                                            "bg-emerald-500"
                            )} />
                            <h3 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">
                                {stage.label}
                            </h3>
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-bold">
                            {stage.items.length}
                        </Badge>
                    </div>

                    <div className="flex-1 space-y-3 p-1 overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-none">
                        {stage.items.map((item, iIdx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (sIdx * 0.1) + (iIdx * 0.05) }}
                            >
                                <Card
                                    className="p-4 rounded-2xl border-white/5 bg-background/50 backdrop-blur-sm hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group cursor-pointer"
                                    onClick={() => stage.id === 'leads' && onSelectLead(item.id)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center",
                                            stage.color === 'orange' ? "bg-orange-500/10 text-orange-600" :
                                                stage.color === 'blue' ? "bg-blue-500/10 text-blue-600" :
                                                    stage.color === 'purple' ? "bg-purple-500/10 text-purple-600" :
                                                        "bg-emerald-500/10 text-emerald-600"
                                        )}>
                                            <item.icon size={16} />
                                        </div>
                                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter opacity-70">
                                            {item.status}
                                        </Badge>
                                    </div>

                                    <h4 className="font-black text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                                        <MapPin size={10} />
                                        <p className="text-[10px] truncate">{item.subtitle}</p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-xs font-black text-foreground">
                                            {item.value}
                                        </p>
                                        <div className="w-6 h-6 rounded-full bg-muted/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            <ChevronRight size={12} />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}

                        {stage.items.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/10 rounded-[2rem] opacity-40">
                                <p className="text-[10px] uppercase font-black tracking-widest text-center">Vazio</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
