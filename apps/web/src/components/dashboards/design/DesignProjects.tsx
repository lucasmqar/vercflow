"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search, Plus, MapPin, Building2,
    Calendar, ArrowUpRight, CheckSquare,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DesignProjectsProps {
    onSelectProject?: (project: any) => void;
}

export function DesignProjects({ onSelectProject }: DesignProjectsProps) {
    const projects = [
        {
            id: 1,
            name: "Residencial Sky",
            type: "Apartamento",
            stage: "Projeto Executivo",
            completion: 75,
            address: "Av. Batel, 1550",
            specsCount: 124,
            pendingCount: 3,
            thumb: "bg-sky-500"
        },
        {
            id: 2,
            name: "Casa Alpha",
            type: "Residencial",
            stage: "Estudo Preliminar",
            completion: 30,
            address: "Condomínio Alphaville",
            specsCount: 45,
            pendingCount: 12,
            thumb: "bg-emerald-500"
        },
        {
            id: 3,
            name: "Escritório Verc",
            type: "Corporativo",
            stage: "Acompanhamento Obra",
            completion: 90,
            address: "Centro Cívico",
            specsCount: 210,
            pendingCount: 0,
            thumb: "bg-indigo-500"
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        Projetos de Design
                        <Badge variant="secondary" className="text-xs font-black px-2">{projects.length}</Badge>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Visão geral dos projetos ativos e status de entrega.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Buscar projeto..." className="pl-10 rounded-xl bg-background/50 border-border/40" />
                    </div>
                    <Button className="rounded-xl font-bold text-xs uppercase tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Plus size={16} className="mr-2" /> Novo Projeto
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card
                        key={project.id}
                        onClick={() => onSelectProject && onSelectProject(project)}
                        className="group rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-md hover:border-primary/20 hover:shadow-xl transition-all cursor-pointer overflow-hidden p-0 flex flex-col"
                    >
                        <div className={cn("h-32 w-full relative overflow-hidden", project.thumb)}>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
                            <div className="absolute top-6 right-6">
                                <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none font-black text-[10px] uppercase tracking-widest hover:bg-background">
                                    {project.stage}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-8 -mt-12 relative z-10">
                            <h3 className="text-2xl font-black tracking-tight mb-1 group-hover:text-primary transition-colors">{project.name}</h3>
                            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground mb-6">
                                <span className="flex items-center gap-1.5"><Building2 size={12} /> {project.type}</span>
                                <span className="flex items-center gap-1.5"><MapPin size={12} /> Curitiba</span>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                    <span>Progresso</span>
                                    <span>{project.completion}%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                                        style={{ width: `${project.completion}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pb-2 border-t border-border/20 pt-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest mb-1">Especificações</p>
                                    <p className="font-bold text-sm">{project.specsCount} Itens</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest mb-1">Pendências</p>
                                    <p className={cn("font-bold text-sm", project.pendingCount > 0 ? "text-amber-500" : "text-muted-foreground")}>
                                        {project.pendingCount} Ações
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
