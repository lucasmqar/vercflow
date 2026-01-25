"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Calendar, User, Tag, Activity, FileText,
    FileCheck, Zap, History, Upload, Download, MessageSquare,
    CheckCircle2, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DisciplineManagementPageProps {
    discipline: any;
    onBack: () => void;
}

export function DisciplineManagementPage({ discipline, onBack }: DisciplineManagementPageProps) {
    if (!discipline) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full bg-background overflow-hidden"
        >
            {/* Header */}
            <div className="p-8 border-b border-border/40 bg-background/50 backdrop-blur-xl shrink-0 flex justify-between items-start">
                <div className="flex gap-6 items-start">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl h-12 w-12 hover:bg-muted mt-1">
                        <ArrowLeft size={24} />
                    </Button>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary/20 text-primary border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                                {discipline.category}
                            </Badge>
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-border text-muted-foreground">
                                Ref. {discipline.id}
                            </Badge>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight leading-none">{discipline.title}</h2>
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                <User size={14} className="text-primary" /> {discipline.responsible}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                <Calendar size={14} className="text-primary" /> Prazo: {discipline.deadline}
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] uppercase">
                                {discipline.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-xl h-12 font-black uppercase text-[10px] tracking-widest border-border px-8 hidden lg:flex">
                        Ver Histórico
                    </Button>
                    <Button className="rounded-xl h-12 gap-2 font-black px-8 uppercase text-[10px] tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                        <Upload size={16} /> Nova Versão
                    </Button>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex-1 overflow-y-auto bg-muted/5">
                <Tabs defaultValue="overview" className="w-full flex flex-col h-full">
                    <div className="px-8 border-b border-border/40 bg-background sticky top-0 z-10">
                        <TabsList className="bg-transparent h-16 gap-8 w-full justify-start overflow-x-auto no-scrollbar">
                            <DetailTabTrigger value="overview" icon={Activity} label="Painel Geral" />
                            <DetailTabTrigger value="files" icon={FileText} label="Arquivos (v3)" />
                            <DetailTabTrigger value="checklists" icon={FileCheck} label="Qualidade" />
                            <DetailTabTrigger value="tasks" icon={Zap} label="Tarefas" />
                        </TabsList>
                    </div>

                    <div className="p-8 pb-32 max-w-[1600px] mx-auto w-full">
                        <TabsContent value="overview" className="mt-0 outline-none space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <DetailCard title="Descrição do Escopo">
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                        Detalhamento técnico completo para execução do {discipline.title.toLowerCase()}. Inclui prumadas, diagramas de carga e especificações de materiais homologados.
                                        Todos os desenhos devem seguir o padrão ISO-19650 de nomenclatura.
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {['Lajes Nervuradas', 'Armadura Passante', 'Concreto 35MPa', 'BIM LOD-350'].map((item, i) => (
                                            <Badge key={i} variant="secondary" className="font-bold text-[10px] uppercase py-1 px-3">
                                                {item}
                                            </Badge>
                                        ))}
                                    </div>
                                </DetailCard>

                                <DetailCard title="Fluxo de Aprovação">
                                    <div className="space-y-4">
                                        <ApprovalItem label="Pré-Análise (Coordenação)" status="done" user="Eng. Marcelo" date="Hoje, 09:00" />
                                        <ApprovalItem label="Validação Técnica (Especialista)" status="pending" />
                                        <ApprovalItem label="Liberação para Obra (Gerente)" status="none" />
                                    </div>
                                </DetailCard>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <DetailCard title="Progresso Físico">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-24 h-24">
                                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                                <circle className="text-muted/20 stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent"></circle>
                                                <circle className="text-primary stroke-current" strokeWidth="10" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 45) / 100} transform="rotate(-90 50 50)"></circle>
                                            </svg>
                                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-black text-xl">45%</div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground">Executado</p>
                                            <p className="text-sm font-black">45%</p>
                                            <p className="text-xs font-bold text-muted-foreground mt-2">Planejado</p>
                                            <p className="text-sm font-black text-emerald-500">42% (+3%)</p>
                                        </div>
                                    </div>
                                </DetailCard>

                                <DetailCard title="Documentação">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-muted-foreground">Versão Atual</span>
                                            <span className="font-black text-lg">v3.2</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-muted-foreground">Total Revisões</span>
                                            <span className="font-black text-lg">12</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-muted-foreground">Último Upload</span>
                                            <span className="font-bold text-xs">Há 2 horas</span>
                                        </div>
                                    </div>
                                </DetailCard>

                                <DetailCard title="Pendências">
                                    <div className="text-center py-6">
                                        <div className="text-4xl font-black text-amber-500 mb-2">3</div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Comentários não resolvidos</p>
                                        <Button variant="link" className="text-primary text-xs font-black mt-2">Ver Lista</Button>
                                    </div>
                                </DetailCard>
                            </div>
                        </TabsContent>

                        <TabsContent value="files" className="mt-0 outline-none space-y-6">
                            {/* Reusing file list styling from modal but expanded */}
                            <div className="space-y-4">
                                {[
                                    { ver: 'v3.2', date: 'Hoje, 09:12', user: 'Ricardo M.', note: 'Inclusão de armaduras de pico.', status: 'CURRENT' },
                                    { ver: 'v3.1', date: 'Ontem, 18:30', user: 'Ricardo M.', note: 'Compatibilização com Shafts.', status: 'OLD' },
                                    { ver: 'v2.0', date: '22 Jan, 14:00', user: 'Ricardo M.', note: 'Emissão para aprovação.', status: 'OLD' },
                                ].map((file, i) => (
                                    <div key={i} className="p-6 rounded-[2rem] bg-background border border-border/40 flex items-center justify-between group hover:border-primary/20 hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl", file.status === 'CURRENT' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                                                {file.ver}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <p className="font-black text-base tracking-tight">{file.note}</p>
                                                    {file.status === 'CURRENT' && <Badge className="bg-emerald-500 text-white border-none font-bold text-[9px] uppercase">Atual</Badge>}
                                                </div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Postado por {file.user} • {file.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5">
                                                <MessageSquare size={20} />
                                            </Button>
                                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border/40">
                                                <Download size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </motion.div>
    );
}

// Helpers
function DetailTabTrigger({ value, icon: Icon, label }: any) {
    return (
        <TabsTrigger
            value={value}
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary border-b-4 border-transparent data-[state=active]:border-primary rounded-none h-full px-6 gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground/60 transition-all"
        >
            <Icon size={16} />
            {label}
        </TabsTrigger>
    );
}

function DetailCard({ title, children }: any) {
    return (
        <Card className="rounded-2xl border-border/40 bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden h-full">
            <CardContent className="p-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {title}
                </h3>
                {children}
            </CardContent>
        </Card>
    );
}

function ApprovalItem({ label, status, user, date }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/20">
            <div>
                <span className="text-sm font-bold text-foreground block">{label}</span>
                {user && <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1 block">{user} • {date}</span>}
            </div>
            {status === 'done' ? <CheckCircle2 size={24} className="text-emerald-500" /> :
                status === 'pending' ? <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase">Em Análise</div> :
                    <div className="w-6 h-6 rounded-full border-2 border-muted" />}
        </div>
    );
}
