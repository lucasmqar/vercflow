"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Search, Plus, Sparkles, Mail, Phone,
    MoreHorizontal, Grid, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DesignTeam() {
    const team = [
        { name: 'Ana Silva Arq', role: 'Parceiro Externo', projects: 3, status: 'ATIVO', rating: 5, specs: 'Interiores' },
        { name: 'Studio Béton', role: 'Escritório Parceiro', projects: 1, status: 'ATIVO', rating: 4, specs: 'Luminotécnico' },
        { name: 'Carlos Oliveira', role: 'Freelancer', projects: 0, status: 'DISPONIVEL', rating: 5, specs: '3D Artist' },
        { name: 'Marina Luz', role: 'Arquiteta Lead', projects: 5, status: 'OCCUPY', rating: 5, specs: 'Gestão' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Equipe & Parceiros</h2>
                    <p className="text-sm text-muted-foreground mt-1">Gestão de arquitetos, designers e colabores externos.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button className="rounded-xl font-bold text-xs uppercase tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Plus size={16} className="mr-2" /> Novo Parceiro
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member, i) => (
                    <Card key={i} className="group rounded-2xl border-white/5 bg-background/40 backdrop-blur-md p-8 hover:border-primary/20 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center text-neutral-500 font-black text-xl shadow-inner">
                                {member.name.substring(0, 2).toUpperCase()}
                            </div>
                            <Badge variant="outline" className={cn(
                                "border-none font-black text-[9px] uppercase tracking-widest px-2 py-1",
                                member.status === 'ATIVO' ? "bg-emerald-500/10 text-emerald-500" :
                                    member.status === 'OCCUPY' ? "bg-red-500/10 text-red-500" :
                                        "bg-blue-500/10 text-blue-500"
                            )}>
                                {member.status}
                            </Badge>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-black tracking-tight mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
                            <p className="text-xs font-bold text-muted-foreground">{member.role}</p>
                            <div className="flex items-center gap-1 mt-2 text-amber-500">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} size={12} className={j < member.rating ? "fill-current" : "text-muted opacity-20"} />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[9px] font-black uppercase text-muted-foreground/50 tracking-widest mb-1">Projetos</p>
                                <p className="font-bold text-lg">{member.projects}</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[9px] font-black uppercase text-muted-foreground/50 tracking-widest mb-1">Especialidade</p>
                                <p className="font-bold text-xs truncate">{member.specs}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button className="flex-1 rounded-xl font-bold text-[10px] uppercase tracking-widest" variant="secondary">
                                Ver Perfil
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-xl border-border/40">
                                <Mail size={16} />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
