"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Camera, FileText, ArrowRight,
    Search, Filter, MapPin, Calendar,
    User, CheckSquare, Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DesignFieldRecords() {
    // Mock Data simulating Field Records from "Capture Dashboard"
    const fieldRecords = [
        {
            id: 'REC-001',
            type: 'Vistoria Técnica',
            location: 'Residencial Sky - Apt 402',
            date: '24/10/2026',
            author: 'Eng. Roberto Boarini',
            thumb: 'bg-neutral-200',
            status: 'Novo',
            checklistsLinked: 2,
            assignedTo: null
        },
        {
            id: 'REC-002',
            type: 'Levantamento Inicial',
            location: 'Escritório Verc',
            date: '23/10/2026',
            author: 'Arq. Ana Silva',
            thumb: 'bg-neutral-300',
            status: 'Em Análise',
            checklistsLinked: 5,
            assignedTo: 'Design'
        },
        {
            id: 'REC-003',
            type: 'Diário de Obra',
            location: 'Casa Alpha',
            date: '20/10/2026',
            author: 'Mestre João',
            thumb: 'bg-stone-200',
            status: 'Finalizado',
            checklistsLinked: 0,
            assignedTo: 'Engenharia'
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        Registros de Campo
                        <Badge variant="secondary" className="text-xs font-black px-2">{fieldRecords.length}</Badge>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Acesse vistorias, levantamentos e diários vindos da Captura.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Buscar registro..." className="pl-10 rounded-xl bg-background/50 border-border/40" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fieldRecords.map((record) => (
                    <Card key={record.id} className="group rounded-[2rem] border-white/5 bg-background/40 backdrop-blur-md overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer">
                        <div className="flex p-4 gap-4">
                            {/* Thumbnail / Preview */}
                            <div className={cn("w-24 h-24 rounded-xl flex-shrink-0 flex items-center justify-center", record.thumb)}>
                                <Camera className="text-muted-foreground/50" />
                            </div>

                            <div className="flex flex-col justify-between flex-1 py-1">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider bg-background/50">{record.id}</Badge>
                                        <Badge className={cn("text-[9px] font-bold",
                                            record.status === 'Novo' ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none" :
                                                "bg-secondary text-muted-foreground hover:bg-secondary/80 border-none"
                                        )}>
                                            {record.status}
                                        </Badge>
                                    </div>
                                    <h3 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors mb-1">{record.type}</h3>
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <MapPin size={10} /> {record.location}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="px-4 pb-4">
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/10 pt-3 mt-2">
                                <span className="flex items-center gap-1.5 font-bold"><User size={12} /> {record.author}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={12} /> {record.date}</span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <Button variant="outline" size="sm" className="w-full rounded-lg text-[10px] uppercase font-bold tracking-wider h-8 border-border/40">
                                    <CheckSquare size={12} className="mr-1.5" />
                                    {record.checklistsLinked > 0 ? `${record.checklistsLinked} Checks` : 'Vincular Checks'}
                                </Button>
                                <Button size="sm" className="w-full rounded-lg text-[10px] uppercase font-black tracking-wider h-8 bg-primary/90 hover:bg-primary">
                                    Acessar <ArrowRight size={12} className="ml-1.5" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
