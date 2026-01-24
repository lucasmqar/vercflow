import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Building2, MapPin, Search, Plus, Calendar,
    FileText, User, ChevronRight, BarChart3,
    MoreHorizontal, Filter, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project } from '@/types';
import { motion } from 'framer-motion';

export function EngenhariaProjects({ projects, onSelectProject }: { projects: Project[], onSelectProject: (p: Project) => void }) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        Obras em Andamento
                        <Badge variant="secondary" className="text-xs font-black px-2">{projects.length}</Badge>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Gerenciamento de cronogramas, RDOs e delegações.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Buscar obra..." className="pl-10 rounded-xl bg-background/50 border-border/40" />
                    </div>
                    <Button variant="outline" size="icon" className="rounded-xl border-border/40" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                        <Filter size={16} />
                    </Button>
                    <Button className="rounded-xl font-bold text-xs uppercase tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Plus size={16} className="mr-2" /> Nova Obra
                    </Button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}>
                {projects.map(project => (
                    <Card
                        key={project.id}
                        onClick={() => onSelectProject(project)}
                        className="group rounded-[2rem] border-white/5 bg-background/40 backdrop-blur-sm overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer relative"
                    >
                        {/* Progress Indicator Top Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
                            <div className="h-full bg-gradient-to-r from-primary to-emerald-400 w-[65%]" />
                        </div>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-105 transition-transform">
                                    <Building2 size={28} />
                                </div>
                                <Badge variant="outline" className={cn(
                                    "font-black uppercase tracking-widest text-[9px] px-3 py-1 bg-background/50 backdrop-blur",
                                    project.status === 'ATIVA' ? 'text-emerald-500 border-emerald-500/20' : 'text-muted-foreground'
                                )}>
                                    {project.status}
                                </Badge>
                            </div>

                            <h3 className="text-xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors">{project.nome}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mb-6">
                                <MapPin size={14} /> {project.endereco}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 rounded-2xl bg-muted/30 border border-border/10">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Início</p>
                                    <p className="text-xs font-black flex items-center gap-1">
                                        <Calendar size={12} /> 12 Jan 24
                                    </p>
                                </div>
                                <div className="p-3 rounded-2xl bg-muted/30 border border-border/10">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Previsão</p>
                                    <p className="text-xs font-black flex items-center gap-1">
                                        <Calendar size={12} /> 30 Out 24
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-border/20">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                            U{i}
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                        +5
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary hover:text-white transition-colors">
                                    <ArrowUpRight size={20} />
                                </Button>
                            </div>
                        </div>

                        {/* Quick Actions Hover Overlay - Optional Enhancement */}
                    </Card>
                ))}
            </div>
        </div>
    );
}
