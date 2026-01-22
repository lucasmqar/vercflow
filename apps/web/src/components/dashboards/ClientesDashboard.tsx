"use client"

import React, { useState } from 'react';
import {
    Users,
    Building,
    Phone,
    Mail,
    Search,
    Filter,
    MoreHorizontal,
    Star,
    Clock,
    CheckCircle2,
    Plus,
    ChevronRight,
    MessageSquare,
    Globe,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { DashboardTab } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReusableKanbanBoard } from '@/components/tasks/ReusableKanbanBoard';

export function ClientesDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    const [moduleView, setModuleView] = useState<'geral' | 'atividades'>('geral');

    const clientes = [
        { id: 1, nome: "Incorporadora Alpha", contato: "Roberto Sales", tipo: "PJ", status: "ATIVO", projetos: 3, nps: 9.5, logo: "A" },
        { id: 2, nome: "Condomínio Jardins", contato: "Síndica Maria", tipo: "PJ", status: "ATIVO", projetos: 1, nps: 8.0, logo: "J" },
        { id: 3, nome: "Dr. Fernando Costa", contato: "Fernando", tipo: "PF", status: "PROSPECT", projetos: 0, nps: null, logo: "F" },
    ];

    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-24">
            {/* Header Content */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <HeaderAnimated title="Gestão de Stakeholders" />
                    <p className="text-muted-foreground font-medium mt-1">
                        CRM Corporativo: acompanhamento de clientes e parcerias estratégicas.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex p-1 bg-muted/20 rounded-xl border border-border/40 shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setModuleView('geral')}
                            className={cn(
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9",
                                moduleView === 'geral' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                            )}
                        >
                            Overview
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setModuleView('atividades')}
                            className={cn(
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9",
                                moduleView === 'atividades' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                            )}
                        >
                            Relacionamento (Kanban)
                        </Button>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {moduleView === 'geral' ? (
                    <motion.div key="geral" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                                <Input placeholder="Buscar por nome, CNPJ ou responsável..." className="pl-12 h-12 rounded-xl border-border/40 bg-background/50 text-sm font-medium shadow-inner" />
                            </div>
                            <Button variant="outline" className="rounded-xl h-12 gap-2 font-black px-6 border-border/40 uppercase text-[10px] tracking-widest"><Filter size={18} /> Filtros</Button>
                        </div>

                        <div className="grid gap-4">
                            {clientes.map((c) => (
                                <ClienteRow key={c.id} c={c} />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="atividades" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full min-h-[600px]">
                        <ReusableKanbanBoard contextFilter="CRM" title="Gestão de Atendimento & Fidelização" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helpers
function ClienteRow({ c }: any) {
    return (
        <Card className="rounded-[2rem] border-border/40 bg-background/60 backdrop-blur-xl hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden">
            <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-black text-2xl shadow-inner border border-primary/5">
                            {c.logo}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1.5">
                                <h3 className="font-black text-xl tracking-tight leading-none group-hover:text-primary transition-colors">{c.nome}</h3>
                                <Badge variant="secondary" className="text-[9px] font-black tracking-widest uppercase border-none px-2 py-0.5 bg-secondary">{c.tipo}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-2 font-bold uppercase tracking-wider">
                                <Building size={14} className="text-primary/60" /> {c.contato}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/60 mb-2 tracking-widest">Contratos</p>
                            <p className="text-lg font-black leading-none">{c.projetos}</p>
                        </div>
                        <Badge className={cn(
                            "font-black text-[10px] tracking-widest uppercase px-3 py-1.5 border-none",
                            c.status === 'ATIVO' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                        )}>
                            {c.status}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ClientesDashboard;
