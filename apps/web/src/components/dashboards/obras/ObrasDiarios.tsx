"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ClipboardList, Search, Plus, Calendar,
    CloudRain, Sun, Users, HardHat, Camera,
    ChevronRight, MoreHorizontal, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppFlow } from '@/store/useAppFlow';

export function ObrasDiarios() {
    const { projects } = useAppFlow();
    const [search, setSearch] = useState('');

    const mockDiarios = [
        {
            id: '1',
            obraNome: 'Residencial Alpha',
            data: '2026-01-24',
            climaManha: 'SOL',
            climaTarde: 'CHUVA_LEVE',
            efetivo: 14,
            atividades: 5,
            status: 'CONCLUIDO',
            responsavel: 'Eng. Roberto'
        },
        {
            id: '2',
            obraNome: 'Torre Horizon',
            data: '2026-01-24',
            climaManha: 'SOL',
            climaTarde: 'SOL',
            efetivo: 22,
            atividades: 8,
            status: 'EM_PREENCHIMENTO',
            responsavel: 'Mestre Silva'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Diários de Obra (RDO)</h2>
                    <p className="text-sm text-muted-foreground mt-1">Registro diário de atividades, clima e efetivo.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Buscar RDO..."
                            className="pl-10 rounded-xl bg-background/50 border-border/40"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button className="rounded-xl font-bold text-xs uppercase tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Plus size={16} className="mr-2" /> Novo RDO
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {mockDiarios.map((rdo, i) => (
                    <motion.div
                        key={rdo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="group p-6 rounded-[2rem] border-white/5 bg-background/40 backdrop-blur-sm hover:border-primary/20 hover:shadow-xl transition-all cursor-pointer">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center font-black",
                                        rdo.status === 'CONCLUIDO' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                    )}>
                                        <ClipboardList size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{rdo.obraNome}</h4>
                                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">{rdo.status}</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(rdo.data).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1.5"><Users size={14} /> {rdo.efetivo} Homens</span>
                                            <span className="flex items-center gap-1.5"><FileText size={14} /> {rdo.atividades} Atividades</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 justify-between lg:justify-end">
                                    <div className="flex gap-4">
                                        <div className="text-center">
                                            <p className="text-[9px] font-black uppercase opacity-40 mb-1">Manhã</p>
                                            {rdo.climaManha === 'SOL' ? <Sun size={18} className="text-amber-500 mx-auto" /> : <CloudRain size={18} className="text-blue-500 mx-auto" />}
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[9px] font-black uppercase opacity-40 mb-1">Tarde</p>
                                            {rdo.climaTarde === 'SOL' ? <Sun size={18} className="text-amber-500 mx-auto" /> : <CloudRain size={18} className="text-blue-500 mx-auto" />}
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[9px] font-black uppercase opacity-40 mb-1">Submetido por</p>
                                        <p className="text-xs font-bold">{rdo.responsavel}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12 hover:bg-primary hover:text-white transition-all">
                                        <ChevronRight size={24} />
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
