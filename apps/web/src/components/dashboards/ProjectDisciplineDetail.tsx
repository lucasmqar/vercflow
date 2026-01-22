"use client"

import React, { useState } from 'react';
import {
    X,
    CheckCircle2,
    Clock,
    User,
    FileText,
    History,
    MessageSquare,
    Download,
    Upload,
    Plus,
    ChevronRight,
    AlertCircle,
    Activity,
    FileCheck,
    Calendar,
    Zap,
    Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProjectDisciplineDetailProps {
    isOpen: boolean;
    onClose: () => void;
    discipline: any;
}

export function ProjectDisciplineDetail({ isOpen, onClose, discipline }: ProjectDisciplineDetailProps) {
    if (!isOpen || !discipline) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-end p-4 lg:p-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full max-w-4xl h-full bg-background rounded-[3rem] shadow-2xl overflow-hidden border-l border-white/10 flex flex-col"
            >
                {/* Header */}
                <div className="p-8 border-b border-white/5 bg-background/50 backdrop-blur-xl flex justify-between items-start">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary/20 text-primary border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                                {discipline.category}
                            </Badge>
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-white/10 text-muted-foreground">
                                Ref. {discipline.id}
                            </Badge>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight leading-none">{discipline.title}</h2>
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
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/5 h-12 w-12 text-muted-foreground">
                        <X size={24} />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar bg-secondary/5">
                    <Tabs defaultValue="overview" className="w-full">
                        <div className="px-8 border-b border-white/5 bg-background/30 backdrop-blur-md sticky top-0 z-10">
                            <TabsList className="bg-transparent h-14 gap-8">
                                <DetailTabTrigger value="overview" icon={Activity} label="Overview" />
                                <DetailTabTrigger value="files" icon={FileText} label="Arquivos (Versions)" />
                                <DetailTabTrigger value="checklists" icon={FileCheck} label="Checklists" />
                                <DetailTabTrigger value="tasks" icon={Zap} label="Tarefas Internas" />
                                <DetailTabTrigger value="history" icon={History} label="Audit Log" />
                            </TabsList>
                        </div>

                        <div className="p-8 pb-32">
                            <TabsContent value="overview" className="mt-0 outline-none space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <DetailCard title="Descrição do Escopo">
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                            Detalhamento técnico completo para execução do {discipline.title.toLowerCase()}. Inclui prumadas, diagramas de carga e especificações de materiais homologados.
                                        </p>
                                        <div className="mt-4 space-y-2">
                                            {['Lajes Nervuradas', 'Armadura Passante', 'Concreto 35MPa'].map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80">
                                                    <Tag size={12} className="text-primary" /> {item}
                                                </div>
                                            ))}
                                        </div>
                                    </DetailCard>

                                    <DetailCard title="Status de Aprovação">
                                        <div className="space-y-4">
                                            <ApprovalItem label="Aprovação Interna (CEO/Eng)" status="done" />
                                            <ApprovalItem label="Aprovação Cliente" status="pending" />
                                            <ApprovalItem label="Órgão Público / Prefeitura" status="none" />
                                        </div>
                                    </DetailCard>
                                </div>

                                <DetailCard title="Kpis de Disciplina">
                                    <div className="grid grid-cols-3 gap-6">
                                        <KpiItem label="Eficiência" value="92%" sub="vs Planejado" />
                                        <KpiItem label="Revisões" value={String(discipline.revisions)} sub="Ciclos de ajuste" />
                                        <KpiItem label="Arquivos" value={String(discipline.versions)} sub="Versões doc" />
                                    </div>
                                </DetailCard>
                            </TabsContent>

                            <TabsContent value="files" className="mt-0 outline-none space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest opacity-40">Versionamento de Arquivos</h3>
                                    <Button className="rounded-xl h-10 gap-2 font-black px-4 uppercase text-[10px] tracking-widest bg-primary">
                                        <Upload size={14} /> Upload Nova Versão
                                    </Button>
                                </div>

                                {[
                                    { ver: 'v3', date: 'Hoje, 09:12', user: 'Ricardo M.', note: 'Inclusão de armaduras de pico.' },
                                    { ver: 'v2', date: '22 Jan, 14:00', user: 'Ricardo M.', note: 'Ajuste de bitolas conforme cálculo.' },
                                    { ver: 'v1', date: '15 Jan, 10:30', user: 'Ricardo M.', note: 'Emissão inicial para revisão.' },
                                ].map((file, i) => (
                                    <div key={i} className="p-6 rounded-[2rem] bg-background/40 border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
                                                {file.ver}
                                            </div>
                                            <div>
                                                <p className="font-black text-sm tracking-tight">{file.note}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Postado por {file.user} em {file.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 opacity-0 group-hover:opacity-100"><Download size={18} /></Button>
                                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 opacity-0 group-hover:opacity-100"><MessageSquare size={18} /></Button>
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="checklists" className="mt-0 outline-none space-y-6">
                                <DetailCard title="Checklist Técnico de Engenharia">
                                    <div className="space-y-4">
                                        <ChecklistItem label="Norma NBR 6118 respeitada" checked={true} />
                                        <ChecklistItem label="Compatibilização com Elétrico validada" checked={true} />
                                        <ChecklistItem label="Quantidade de aço otimizada" checked={false} />
                                        <ChecklistItem label="Carimbo de projeto atualizado" checked={true} />
                                    </div>
                                </DetailCard>
                            </TabsContent>

                            {/* Other tabs simplified for brevity or can be expanded similarly */}
                            <TabsContent value="tasks" className="mt-0 outline-none">
                                <div className="text-center py-20 opacity-40">
                                    <Zap size={48} className="mx-auto mb-4" />
                                    <h3 className="font-black text-sm uppercase tracking-widest">Mini-Kanban Interno em Breve</h3>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-white/5 bg-background/50 backdrop-blur-xl flex justify-between items-center">
                    <Button variant="ghost" className="rounded-xl h-12 font-black uppercase text-[10px] tracking-widest text-muted-foreground hover:bg-white/5">
                        Arquivar Disciplina
                    </Button>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={onClose} className="rounded-xl h-12 font-black uppercase text-[10px] tracking-widest border-white/10 px-8">
                            Fechar
                        </Button>
                        <Button className="rounded-xl h-12 gap-2 font-black px-8 uppercase text-[10px] tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                            Marcar como Aprovado <CheckCircle2 size={16} />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Helpers
function DetailTabTrigger({ value, icon: Icon, label }: any) {
    return (
        <TabsTrigger
            value={value}
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-0 gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 transition-all"
        >
            <Icon size={14} />
            {label}
        </TabsTrigger>
    );
}

function DetailCard({ title, children }: any) {
    return (
        <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-md overflow-hidden">
            <CardContent className="p-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">{title}</h3>
                {children}
            </CardContent>
        </Card>
    );
}

function ApprovalItem({ label, status }: { label: string, status: 'done' | 'pending' | 'none' }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xs font-bold text-muted-foreground">{label}</span>
            {status === 'done' ? <CheckCircle2 size={18} className="text-emerald-500" /> :
                status === 'pending' ? <Clock size={18} className="text-amber-500 animate-pulse" /> :
                    <div className="w-4 h-4 rounded-full border-2 border-white/10" />}
        </div>
    );
}

function ChecklistItem({ label, checked }: { label: string, checked: boolean }) {
    return (
        <label className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer group hover:bg-white/10 transition-all">
            <div className={cn(
                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                checked ? "bg-primary border-primary text-white" : "border-white/10 text-transparent"
            )}>
                <CheckCircle2 size={14} />
            </div>
            <span className={cn("text-xs font-bold transition-all", checked ? "text-foreground" : "text-muted-foreground")}>
                {label}
            </span>
        </label>
    );
}

function KpiItem({ label, value, sub }: { label: string, value: string, sub: string }) {
    return (
        <div className="text-center p-6 rounded-3xl bg-white/5 border border-white/5">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">{label}</p>
            <p className="text-2xl font-black tracking-tight">{value}</p>
            <p className="text-[8px] font-bold text-primary uppercase mt-1">{sub}</p>
        </div>
    );
}
