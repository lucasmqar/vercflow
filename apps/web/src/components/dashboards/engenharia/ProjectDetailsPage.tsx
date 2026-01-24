import React, { useState } from 'react';
import { Project, Activity } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    AlertCircle,
    CheckCircle2,
    Clock,
    User,
    FileText,
    TrendingUp,
    Layout
} from 'lucide-react';
import { useAppFlow } from '@/store/useAppFlow';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProjectDetailsPageProps {
    project: Project;
    onBack: () => void;
    onNavigateTo: (section: string) => void;
}

export function ProjectDetailsPage({ project, onBack, onNavigateTo }: ProjectDetailsPageProps) {
    const { clients } = useAppFlow();
    const client = clients.find(c => c.id === project.clientId);

    // Mock Data for Prototype
    const progress = 65;
    const timeline = [
        { phase: 'Fundação', status: 'CONCLUIDO', date: '10/01/2026' },
        { phase: 'Estrutura', status: 'EM_ANDAMENTO', date: '25/02/2026' },
        { phase: 'Alvenaria', status: 'PLANEJADO', date: '15/03/2026' },
    ];

    return (
        <div className="flex flex-col h-full bg-background animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="h-20 shrink-0 border-b border-border/40 px-8 flex items-center gap-4 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
                    <ArrowLeft size={20} className="text-muted-foreground" />
                </Button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-black tracking-tight text-foreground">{project.nome}</h1>
                        <Badge variant="outline" className={cn(
                            "text-[10px] uppercase font-black tracking-widest px-2",
                            project.status === 'ATIVA' ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" : "bg-muted text-muted-foreground"
                        )}>
                            {project.status}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <MapPin size={10} /> {project.endereco || 'Localização não definida'}
                        <span className="opacity-30">|</span>
                        <User size={10} /> {client?.razaoSocial || client?.nome || 'Cliente não identificado'}
                    </p>
                </div>
                <div className="ml-auto flex gap-3">
                    <Button variant="outline" className="h-9 px-4 text-xs font-bold uppercase tracking-wide border-border/40">
                        Relatório
                    </Button>
                    <Button
                        onClick={() => onNavigateTo('captura')}
                        className="h-9 px-4 text-xs font-bold uppercase tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    >
                        Diário de Obra
                    </Button>
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="max-w-7xl mx-auto p-8 space-y-8">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <KPICard title="Progresso Físico" value={`${progress}%`} icon={TrendingUp} color="text-emerald-500" />
                        <KPICard title="Cronograma" value="Em Dia" icon={Calendar} color="text-blue-500" />
                        <KPICard title="Financeiro" value="R$ 1.2M" sub="Executado" icon={Layout} color="text-indigo-500" />
                        <KPICard title="Pendências" value="3" icon={AlertCircle} color="text-orange-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Context */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="p-6 rounded-[2rem] border-border/40 shadow-sm space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg">Evolução da Obra</h3>
                                    <Badge variant="secondary" className="text-[10px] font-black uppercase">Semanal</Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1">
                                        <span>Geral</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-3 rounded-full bg-muted" />
                                </div>

                                <div className="grid grid-cols-3 gap-4 border-t border-border/40 pt-6">
                                    {timeline.map((t, i) => (
                                        <div key={i} className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    t.status === 'CONCLUIDO' ? "bg-emerald-500" :
                                                        t.status === 'EM_ANDAMENTO' ? "bg-blue-500 animate-pulse" : "bg-muted"
                                                )} />
                                                <p className="text-[10px] font-black uppercase text-muted-foreground">{t.status}</p>
                                            </div>
                                            <p className="font-bold text-sm">{t.phase}</p>
                                            <p className="text-[10px] text-muted-foreground">{t.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Tabs defaultValue="activities" className="w-full">
                                <TabsList className="bg-muted/30 p-1 rounded-xl w-full justify-start h-12 mb-6">
                                    <TabsTrigger value="activities" className="rounded-lg text-xs font-bold uppercase px-6 h-10">Atividades</TabsTrigger>
                                    <TabsTrigger value="docs" className="rounded-lg text-xs font-bold uppercase px-6 h-10">Documentos</TabsTrigger>
                                    <TabsTrigger value="team" className="rounded-lg text-xs font-bold uppercase px-6 h-10">Equipe</TabsTrigger>
                                </TabsList>

                                <TabsContent value="activities" className="space-y-4 animate-in fade-in slide-in-from-left-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-background hover:bg-muted/10 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center">
                                                <CheckCircle2 size={18} className="text-muted-foreground/50" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm">Instalação Elétrica Piso {i}</h4>
                                                <p className="text-[10px] text-muted-foreground">Responsável: João Silva • Prazo: 20/02</p>
                                            </div>
                                            <Badge variant="outline" className="border-border/40 text-[10px]">PLANEJADO</Badge>
                                        </div>
                                    ))}
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar Context */}
                        <div className="space-y-6">
                            <Card className="p-6 rounded-[2rem] border-border/40 bg-muted/5 space-y-4">
                                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Dados Técnicos</h3>
                                <div className="space-y-3 pt-2">
                                    <InfoRow label="Área Total" value={`${project.areaConstruida || 0} m²`} />
                                    <InfoRow label="Pavimentos" value={project.pavimentos || 1} />
                                    <InfoRow label="Tipo Contrutivo" value={project.classificacao?.tipo || 'Convencional'} />
                                    <InfoRow label="Início" value={format(new Date(project.criadoEm), "dd/MM/yyyy")} />
                                </div>
                            </Card>

                            <Card className="p-6 rounded-[2rem] border-border/40 bg-muted/5 space-y-4">
                                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Gestão</h3>
                                <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border/40">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        EN
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs">Eng. Responsável</p>
                                        <p className="text-[10px] text-muted-foreground">Não atribuído</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

function KPICard({ title, value, sub, icon: Icon, color }: any) {
    return (
        <Card className="p-6 rounded-[2rem] border-border/40 flex items-center gap-4 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-muted/20", color)}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">{title}</p>
                <h3 className="text-2xl font-black tracking-tighter leading-none">{value}</h3>
                {sub && <p className="text-[9px] font-bold text-muted-foreground/60 mt-1">{sub}</p>}
            </div>
        </Card>
    );
}

function InfoRow({ label, value }: any) {
    return (
        <div className="flex justify-between items-center border-b border-border/20 pb-2 last:border-0 last:pb-0">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <span className="text-xs font-bold text-foreground">{value}</span>
        </div>
    );
}
