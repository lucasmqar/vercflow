import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid,
    Search,
    Filter,
    Layers,
    ChevronRight,
    FileText,
    CheckCircle2,
    Clock,
    User,
    ArrowUpRight,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppFlow } from '@/store/useAppFlow';
import { Project, Activity } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GestaoProjetosDashboardProps {
    onTabChange: (tab: any) => void;
    onOpenWizard?: () => void;
}

export function GestaoProjetosDashboard({ onTabChange, onOpenWizard }: GestaoProjetosDashboardProps) {
    const { projects } = useAppFlow();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProjects = projects.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.classificacao.natureza?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Mock Disciplines (Eventually should come from store/API)
    // Connecting simplified disciplines to the selected project
    const projectDisciplines = [
        { id: '1', name: 'Arquitetônico', status: 'EM_ANDAMENTO', progress: 65, responsible: 'Arq. Juliana' },
        { id: '2', name: 'Estrutural', status: 'AGUARDANDO', progress: 0, responsible: 'Eng. Roberto' },
        { id: '3', name: 'Elétrico', status: 'AGUARDANDO', progress: 0, responsible: 'Eng. Lucas' },
        { id: '4', name: 'Hidrossanitário', status: 'AGUARDANDO', progress: 0, responsible: 'Eng. Lucas' },
        { id: '5', name: 'Interiores', status: 'EM_ANDAMENTO', progress: 30, responsible: 'Design Team' },
    ];

    return (
        <div className="flex h-full bg-background font-sans overflow-hidden">
            {/* Left Column: Project Selector (Macro View) */}
            <div className="w-[400px] border-r border-border/40 flex flex-col bg-muted/5">
                <div className="p-8 pb-4">
                    <HeaderAnimated title="Projetos" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 mb-6">Central de Criação</p>

                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-3.5 text-muted-foreground" size={16} />
                        <Input
                            placeholder="Buscar projeto..."
                            className="pl-10 h-10 rounded-xl bg-background border-border/40"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Portfólio Ativo</span>
                        <Badge variant="secondary" className="text-[9px] h-5">{filteredProjects.length}</Badge>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className={`
                                group p-4 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden
                                ${selectedProject?.id === project.id
                                    ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20'
                                    : 'bg-background border-border/40 hover:border-primary/30 hover:bg-white'
                                }
                            `}
                        >
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-sm leading-tight mb-1">{project.nome}</h4>
                                    <p className={`text-[10px] uppercase tracking-wider font-bold ${selectedProject?.id === project.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                        {project.classificacao.natureza} • {project.classificacao.zona}
                                    </p>
                                </div>
                                {selectedProject?.id === project.id && (
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                        <ChevronRight size={14} />
                                    </div>
                                )}
                            </div>

                            {/* Project Progress Bar Mini */}
                            <div className="mt-4 h-1 w-full bg-black/10 rounded-full overflow-hidden">
                                <div className="h-full bg-current w-1/3 rounded-full opacity-50" />
                            </div>
                        </div>
                    ))}

                    {filteredProjects.length === 0 && (
                        <div className="text-center py-10 opacity-50">
                            <Layers size={32} className="mx-auto mb-2 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground font-medium">Nenhum projeto encontrado</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Project Details & Disciplines (Micro View) */}
            <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
                {selectedProject ? (
                    <>
                        <div className="h-64 relative shrink-0">
                            {/* Hero Header for Project */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 z-0">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                            </div>

                            <div className="relative z-10 p-10 h-full flex flex-col justify-end text-white">
                                <Badge className="self-start mb-4 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
                                    {selectedProject.status}
                                </Badge>
                                <h1 className="text-4xl font-black tracking-tighter mb-2">{selectedProject.nome}</h1>
                                <div className="flex items-center gap-6 text-sm font-medium text-white/70">
                                    <span className="flex items-center gap-2"><LayoutGrid size={16} /> {selectedProject.areaConstruida || 0}m²</span>
                                    <span className="flex items-center gap-2"><User size={16} /> {selectedProject.client?.nome || 'Cliente'}</span>
                                    <span className="flex items-center gap-2"><Clock size={16} /> Início: {format(new Date(selectedProject.criadoEm), 'MMM yyyy', { locale: ptBR })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 bg-muted/5">
                            <div className="max-w-5xl mx-auto space-y-10">
                                {/* Disciplines Grid */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                                            <Layers className="text-primary" /> Disciplinas Técnicas
                                        </h3>
                                        <Button variant="outline" size="sm" className="gap-2 text-xs font-bold uppercase tracking-widest rounded-xl">
                                            <Filter size={14} /> Filtrar
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {projectDisciplines.map((discipline, idx) => (
                                            <div
                                                key={idx}
                                                className="group bg-background rounded-[2rem] p-6 border border-border/40 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer relative overflow-hidden"
                                            >
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className={`p-3 rounded-2xl ${discipline.status === 'EM_ANDAMENTO' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'}`}>
                                                        <FileText size={20} />
                                                    </div>
                                                    <Badge variant="outline" className="border-border/40 text-[9px] font-black uppercase tracking-widest">{discipline.status}</Badge>
                                                </div>

                                                <h4 className="font-bold text-lg mb-1">{discipline.name}</h4>
                                                <p className="text-xs text-muted-foreground font-medium mb-4 flex items-center gap-1.5">
                                                    <User size={10} /> {discipline.responsible}
                                                </p>

                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                        <span>Progresso</span>
                                                        <span>{discipline.progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${discipline.progress}%` }}
                                                            className={`h-full rounded-full ${discipline.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                                                    <ArrowUpRight size={20} className="text-primary" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Placeholder for Documents */}
                                <div className="p-10 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center space-y-4 opacity-50 hover:opacity-100 transition-opacity cursor-pointer bg-muted/20">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                        <Plus size={24} className="text-muted-foreground" />
                                    </div>
                                    <h3 className="font-bold text-lg">Adicionar Nova Disciplina</h3>
                                    <p className="text-sm text-muted-foreground max-w-sm">Vincule novos projetos complementares ou estudos preliminares a esta obra.</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-40">
                        <div className="w-24 h-24 rounded-[2rem] bg-muted flex items-center justify-center mb-6 animate-pulse">
                            <Layers size={32} className="text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight mb-2">Selecione um Projeto</h2>
                        <p className="text-sm font-medium text-muted-foreground max-w-sm">
                            Escolha um projeto no menu lateral para visualizar suas disciplinas técnicas, status e documentos.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

