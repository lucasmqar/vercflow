"use client"

import React, { useState } from 'react';
import {
    Zap,
    MessageCircle,
    CheckSquare,
    MapPin,
    Camera,
    Mic,
    MoreVertical,
    Send,
    Play,
    Pause,
    History,
    Filter,
    Plus,
    LayoutGrid,
    Users,
    ChevronRight,
    Search,
    Image as ImageIcon,
    FileText,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ReusableKanbanBoard } from '@/components/tasks/ReusableKanbanBoard';

export function AtividadesDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    const [moduleView, setModuleView] = useState<'geral' | 'atividades'>('geral');

    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-24">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <HeaderAnimated title="Campo & Operações" />
                    <p className="text-muted-foreground font-medium mt-1">
                        Sincronização em tempo real com equipes de canteiro via VERC-Link.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex p-1 bg-muted/20 rounded-xl border border-border/40 shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setModuleView('geral')}
                            className={cn(
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9",
                                moduleView === 'geral' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                            )}
                        >
                            Overview
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setModuleView('atividades')}
                            className={cn(
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9",
                                moduleView === 'atividades' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                            )}
                        >
                            Roadmap (Kanban)
                        </Button>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {moduleView === 'geral' ? (
                    <motion.div
                        key="geral"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                    >
                        {/* Task List Section */}
                        <Card className="lg:col-span-8 rounded-[2rem] border-border/40 bg-background/60 backdrop-blur-xl flex flex-col overflow-hidden shadow-sm min-h-[600px]">
                            <div className="p-8 border-b border-border/20 flex justify-between items-center">
                                <div>
                                    <h3 className="font-black text-xl flex items-center gap-3"><CheckSquare size={24} className="text-primary" /> Atividades em Tempo Real</h3>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Status atual das frentes de serviço</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="rounded-xl px-4 font-black text-[10px] h-9 gap-2">
                                        <History size={14} /> HISTÓRICO
                                    </Button>
                                </div>
                            </div>
                            <div className="p-8 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                                {[
                                    { id: 1, task: "Concretagem Laje Nível 2", obra: "Edifício Sky", equipe: "Técnica A", time: "08:00", progress: 65, priority: "ALTA", type: 'DOC' },
                                    { id: 2, task: "Instalação Hidrossanitária", obra: "Residencial Park", equipe: "Instalações B", time: "10:30", progress: 20, priority: "NORMAL", type: 'IMG' },
                                    { id: 3, task: "Armação de Viga Principal", obra: "Galpão Alpha", equipe: "Armação C", time: "14:00", progress: 0, priority: "URGENTE", type: 'ALERT' },
                                ].map((task) => (
                                    <motion.div
                                        key={task.id}
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-6 p-6 rounded-xl bg-background/40 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                            {task.type === 'DOC' && <FileText size={20} />}
                                            {task.type === 'IMG' && <ImageIcon size={20} />}
                                            {task.type === 'ALERT' && <AlertTriangle size={20} className="text-amber-500" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-black text-base tracking-tight">{task.task}</h4>
                                                <Badge variant="outline" className={cn(
                                                    "text-[8px] font-black border-none px-2 py-0.5",
                                                    task.priority === 'URGENTE' ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                                                )}>{task.priority}</Badge>
                                            </div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{task.obra} • {task.equipe}</p>
                                        </div>
                                        <div className="w-48 hidden md:block">
                                            <div className="flex justify-between text-[9px] font-black text-muted-foreground mb-1">
                                                <span>PROGRESSO</span>
                                                <span>{task.progress}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${task.progress}%` }} />
                                            </div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="rounded-xl text-muted-foreground hover:text-primary">
                                            <ChevronRight size={20} />
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>

                        {/* WhatsApp Bridge Mock */}
                        <Card className="lg:col-span-4 rounded-[2rem] border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl flex flex-col relative overflow-hidden shadow-sm h-[600px]">
                            <div className="p-8 bg-emerald-600 text-white shadow-lg">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-black text-lg flex items-center gap-3"><MessageCircle size={24} /> VERC-Link</h3>
                                    <Badge className="bg-white/20 text-white border-none text-[8px] font-black tracking-widest uppercase">LIVE</Badge>
                                </div>
                                <p className="text-[10px] font-bold text-emerald-100 mt-1 uppercase tracking-widest opacity-80">Sincronização Nativa</p>
                            </div>
                            <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-5 scrollbar-none dark:invert">
                                <ChatMessage sender="Mestre João" message="O concreto já está chegando, pessoal. Preparem as mangueiras." time="08:15" isMe={false} />
                                <ChatMessage sender="Você" message="Confirmado Mestre! Equipe de armação já liberou o setor B." time="08:17" isMe={true} />
                                <ChatMessage sender="Eng. Roberto" message="João, mande foto da consistência (slump test) assim que bater." time="08:20" isMe={false} isSystem />
                            </div>
                            <div className="p-6 bg-background/80 border-t border-border/20 flex gap-2">
                                <div className="flex-1 h-12 bg-secondary/30 rounded-2xl flex items-center px-4 italic text-[11px] text-muted-foreground font-medium">Responder via WhatsApp...</div>
                                <Button size="icon" className="rounded-2xl h-12 w-12 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"><Send size={20} /></Button>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="atividades"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full min-h-[600px]"
                    >
                        <ReusableKanbanBoard contextFilter="OPS" title="Painel de Atividades de Campo" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ChatMessage({ sender, message, time, isMe, isSystem }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={cn(
                "max-w-[85%] p-4 rounded-xl shadow-sm relative",
                isSystem ? "self-center bg-primary/10 text-primary border border-primary/20 text-center" :
                    isMe ? "self-end bg-emerald-500 text-white rounded-tr-none" : "self-start bg-background text-foreground border border-white/10 rounded-tl-none"
            )}
        >
            {!isMe && !isSystem && <p className="text-[9px] font-black text-primary uppercase mb-1">{sender}</p>}
            <p className={cn("text-[11px] leading-relaxed font-medium", isSystem ? "text-[10px] uppercase font-black" : "")}>{message}</p>
            <span className={cn("text-[8px] block text-right mt-1 font-bold", isMe ? "text-white/60" : "text-muted-foreground/60")}>{time}</span>
        </motion.div>
    );
}

export default AtividadesDashboard;
