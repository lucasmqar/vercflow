"use client"

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft, Palette, Layers, LayoutTemplate,
    FileText, Plus, Search, Filter, Box,
    ChevronDown, CheckCircle2, AlertCircle,
    Calendar, MapPin, Building2, MoreHorizontal,
    Share2, Download, Image as ImageIcon,
    Clock, ArrowRight, Zap, CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';
import { DesignActionWizard } from './DesignActionWizard';

// Mock Data Types
interface ProjectSpec {
    id: string;
    area: string;
    category: string;
    item: string;
    status: 'DEFINIDO' | 'EM APROVAÇÃO' | 'PENDENTE' | 'REVISÃO';
    deadline: string;
    supplier?: string;
}

export function DesignProjectDetails({ project, onBack }: { project: any, onBack: () => void }) {
    const [activeTab, setActiveTab] = useState("specs");
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string }>({
        isOpen: false,
        title: ""
    });
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    const openPlaceholder = (title: string) => setModalConfig({ isOpen: true, title });

    // Mock Checklists
    const checklistItems = [
        { id: 1, text: 'Validação de Planta Baixa', status: 'checked' },
        { id: 2, text: 'Definição de Layout de Iluminação', status: 'checked' },
        { id: 3, text: 'Escolha de Revestimentos (Banheiros)', status: 'unchecked' },
        { id: 4, text: 'Detalhamento de Marcenaria (Cozinha)', status: 'unchecked' },
        { id: 5, text: 'Memorial Descritivo Final', status: 'unchecked' },
    ];

    // Mock Specs Data
    const projectSpecs: ProjectSpec[] = [
        { id: 'S-101', area: 'Banho Master', category: 'Metais', item: 'Misturador Monocomando Gold', status: 'DEFINIDO', deadline: '10/11', supplier: 'Deca' },
        { id: 'S-102', area: 'Banho Master', category: 'Revestimentos', item: 'Porcelanato Calacata 120x120', status: 'DEFINIDO', deadline: '10/11', supplier: 'Portobello' },
        { id: 'S-103', area: 'Cozinha', category: 'Marcenaria', item: 'Armários Planejados - Laca', status: 'EM APROVAÇÃO', deadline: '15/11', supplier: 'Finger' },
        { id: 'S-104', area: 'Cozinha', category: 'Bancada', item: 'Quartzo Branco Star', status: 'PENDENTE', deadline: '20/11' },
        { id: 'S-105', area: 'Living', category: 'Iluminação', item: 'Pendente Anéis LED', status: 'REVISÃO', deadline: '05/12', supplier: 'Llum' },
    ];

    return (
        <div className="flex flex-col h-full bg-background animate-in slide-in-from-right-8 duration-500">
            {/* Header */}
            <div className="shrink-0 pt-8 px-8 pb-6 border-b border-border/40 bg-background/50 backdrop-blur-sm z-10">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="mb-6 pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                >
                    <ArrowLeft size={18} /> Voltar para Projetos
                </Button>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-2 py-1">
                                {project.stage}
                            </Badge>
                            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                <MapPin size={12} /> Curitiba
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground">{project.name}</h1>
                        <p className="text-muted-foreground font-medium mt-2 max-w-2xl">
                            Projeto de interiores completo | Conclusão estimada: {project.completion}%
                        </p>
                    </div>

                    <div className="flex gap-3 w-full lg:w-auto">
                        <Button variant="outline" className="flex-1 lg:flex-none rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2">
                            <Share2 size={16} /> Compartilhar
                        </Button>
                        <Button variant="outline" className="flex-1 lg:flex-none rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2">
                            <Download size={16} /> Relatórios
                        </Button>
                        <Button
                            onClick={() => setIsWizardOpen(true)}
                            className="flex-1 lg:flex-none rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                        >
                            <Zap size={16} className="fill-current" /> Nova Ação
                        </Button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mt-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="bg-transparent p-0 h-auto gap-6 border-b border-transparent">
                            {[
                                { id: 'overview', label: 'Visão Geral', icon: Layers },
                                { id: 'specs', label: 'Especificações', icon: Palette },
                                { id: 'moodboards', label: 'Moodboards', icon: LayoutTemplate },
                                { id: 'checklists', label: 'Checklists', icon: CheckSquare },
                                { id: 'files', label: 'Arquivos & Plantas', icon: FileText },
                            ].map(tab => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className={cn(
                                        "px-0 pb-4 rounded-none border-b-2 bg-transparent transition-all data-[state=active]:shadow-none data-[state=active]:bg-transparent",
                                        activeTab === tab.id
                                            ? "border-primary text-primary"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <tab.icon size={16} className={cn("mb-0.5", activeTab === tab.id ? "fill-current" : "")} />
                                        <span className="font-black text-xs uppercase tracking-widest">{tab.label}</span>
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
                <AnimatePresence mode="wait">
                    {activeTab === 'specs' && (
                        <motion.div
                            key="specs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Toolbar */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input placeholder="Buscar especificação..." className="pl-10 rounded-xl bg-background/50 border-border/40" />
                                    </div>
                                    <Button variant="outline" className="rounded-xl h-10 w-10 p-0 border-border/40">
                                        <Filter size={16} />
                                    </Button>
                                </div>
                                <Button onClick={() => openPlaceholder("Nova Especificação")} className="rounded-xl font-black text-[10px] uppercase tracking-widest">
                                    <Plus size={14} className="mr-2" /> Adicionar Item
                                </Button>
                            </div>

                            {/* Specs Table/List */}
                            <div className="space-y-3">
                                {projectSpecs.map((spec) => (
                                    <Card key={spec.id} className="group p-4 rounded-2xl border-border/40 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer bg-background/60 backdrop-blur-md">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground/40 border border-border/20">
                                                    <Box size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wide px-1.5 h-5 bg-background/50 text-muted-foreground">{spec.area}</Badge>
                                                        <span className="text-[10px] font-black uppercase text-primary/80 tracking-wide">{spec.category}</span>
                                                    </div>
                                                    <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{spec.item}</h4>
                                                    {spec.supplier && <p className="text-[10px] text-muted-foreground mt-0.5">Fornecedor: {spec.supplier}</p>}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <Badge className={cn(
                                                        "border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-widest mb-1",
                                                        spec.status === 'DEFINIDO' ? "bg-emerald-500/10 text-emerald-500" :
                                                            spec.status === 'PENDENTE' ? "bg-red-500/10 text-red-500" :
                                                                spec.status === 'EM APROVAÇÃO' ? "bg-amber-500/10 text-amber-500" :
                                                                    "bg-blue-500/10 text-blue-500"
                                                    )}>
                                                        {spec.status}
                                                    </Badge>
                                                    <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-muted-foreground">
                                                        <Clock size={10} /> {spec.deadline}
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-primary">
                                                    <ArrowRight size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'overview' && (
                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                            <div className="text-center">
                                <Layers size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-medium">Visão Geral do Projeto em desenvolvimento...</p>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'moodboards' || activeTab === 'files') && (
                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                            <div className="text-center">
                                <LayoutTemplate size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-medium">Módulo em construção.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'checklists' && (
                        <motion.div
                            key="checklists"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="max-w-3xl mx-auto"
                        >
                            <Card className="rounded-2xl p-8 border-border/40 bg-background/60 backdrop-blur-md">
                                <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-3">
                                    <CheckSquare className="text-primary" /> Checklist de Etapa
                                </h3>
                                <div className="space-y-4">
                                    {checklistItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/40 cursor-pointer group">
                                            <div className={cn(
                                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                                item.status === 'checked' ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 group-hover:border-primary/50"
                                            )}>
                                                {item.status === 'checked' && <CheckCircle2 size={14} />}
                                            </div>
                                            <span className={cn(
                                                "font-medium flex-1",
                                                item.status === 'checked' && "text-muted-foreground line-through decoration-primary/30"
                                            )}>{item.text}</span>
                                            {item.status === 'unchecked' && <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-[10px] uppercase font-bold text-primary">Marcar</Button>}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <PlaceholderModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
            />

            <DesignActionWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
            />
        </div>
    );
}
