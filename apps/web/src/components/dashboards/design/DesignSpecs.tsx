"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search, Plus, MapPin, Building2,
    ArrowRight, Box
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DesignSpecsProps {
    onSelectProject?: (project: any) => void;
}

export function DesignSpecs({ onSelectProject }: DesignSpecsProps) {
    // Reusing Project Data model for consistency in navigation
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
                        Especificações por Obra
                        <Badge variant="secondary" className="text-xs font-black px-2">{projects.length}</Badge>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Selecione um projeto para gerenciar seus materiais e acabamentos.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Buscar projeto..." className="pl-10 rounded-xl bg-background/50 border-border/40" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card
                        key={project.id}
                        onClick={() => onSelectProject && onSelectProject(project)}
                        className="group rounded-[2rem] border-white/5 bg-background/40 backdrop-blur-md hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer p-6 flex flex-col items-start gap-4"
                    >
                        <div className="flex items-center gap-4 w-full">
                            <div className={cn("w-16 h-16 rounded-2xl flex-shrink-0", project.thumb)} />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-black tracking-tight truncate group-hover:text-primary transition-colors">{project.name}</h3>
                                <p className="text-xs font-bold text-muted-foreground truncate">{project.address}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground/50 group-hover:text-primary transition-colors">
                                <ArrowRight size={20} />
                            </Button>
                        </div>

                        <div className="w-full h-px bg-border/20 my-2" />

                        <div className="grid grid-cols-2 w-full gap-4">
                            <div className="bg-muted/10 p-3 rounded-xl">
                                <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest mb-1 flex items-center gap-1">
                                    <Box size={10} /> Itens
                                </p>
                                <p className="font-bold text-lg">{project.specsCount}</p>
                            </div>
                            <div className="bg-muted/10 p-3 rounded-xl">
                                <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest mb-1 flex items-center gap-1">
                                    <Building2 size={10} /> Status
                                </p>
                                <p className="font-bold text-xs truncate mt-1">{project.stage}</p>
                            </div>
                        </div>

                        <Button className="w-full rounded-xl font-bold uppercase text-[10px] tracking-widest mt-2" variant="outline">
                            Gerenciar Especificações
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
