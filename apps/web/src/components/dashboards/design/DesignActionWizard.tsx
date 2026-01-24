"use client"

import React, { useState } from 'react';
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogTrigger, DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Plus, CheckCircle2, AlertCircle, FileText,
    ClipboardCheck, Send, Zap, ArrowRight,
    LayoutTemplate
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function DesignActionWizard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [step, setStep] = useState<'menu' | 'new-demand' | 'review' | 'validate'>('menu');
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    // Menu Options
    const menuOptions = [
        {
            id: 'new-demand',
            title: 'Nova Demanda',
            desc: 'Criar solicitação de projeto ou especificação.',
            icon: Plus,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            id: 'review',
            title: 'Revisar Entregas',
            desc: 'Analisar itens pendentes de aprovação.',
            icon: ClipboardCheck,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            id: 'validate',
            title: 'Validar & Concluir',
            desc: 'Finalizar etapas e marcar como entregue.',
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            id: 'moodboard',
            title: 'Novo Moodboard',
            desc: 'Iniciar um painel de inspiração rápido.',
            icon: LayoutTemplate,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        }
    ];

    // Mock Pending Reviews
    const pendingReviews = [
        { id: 1, title: 'Revestimentos Banho', project: 'Residencial Sky', author: 'Ana Silva', type: 'Especificação' },
        { id: 2, title: 'Layout Marcenaria', project: 'Escritório Verc', author: 'Carlos O.', type: 'Planta Baixa' },
        { id: 3, title: 'Pendente Jantar', project: 'Casa Alpha', author: 'Ana Silva', type: 'Compra' },
    ];

    const renderMenu = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {menuOptions.map((option) => (
                <button
                    key={option.id}
                    onClick={() => setStep(option.id as any)}
                    className="flex flex-col items-start p-6 rounded-3xl border border-border/40 hover:border-primary/40 hover:bg-muted/30 transition-all text-left group"
                >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", option.bg, option.color)}>
                        <option.icon size={24} />
                    </div>
                    <h3 className="font-black text-lg mb-1">{option.title}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{option.desc}</p>
                </button>
            ))}
        </div>
    );

    const renderNewDemand = () => (
        <div className="space-y-6 py-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Título da Demanda</Label>
                    <Input placeholder="Ex: Especificar metais do lavabo..." className="rounded-xl bg-muted/30 border-border/40" />
                </div>
                <div className="space-y-2">
                    <Label>Projeto Vinculado</Label>
                    <select className="flex h-10 w-full rounded-xl border border-border/40 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        <option>Residencial Sky</option>
                        <option>Casa Alpha</option>
                        <option>Escritório Verc</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Descrição / Briefing</Label>
                    <Textarea placeholder="Descreva os detalhes da solicitação..." className="rounded-xl bg-muted/30 border-border/40 min-h-[100px]" />
                </div>
                <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <div className="flex gap-2">
                        {['Baixa', 'Média', 'Alta', 'Urgente'].map(p => (
                            <Button key={p} type="button" variant="outline" size="sm" className="rounded-lg text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/20">
                                {p}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" onClick={() => setStep('menu')}>Cancelar</Button>
                <Button className="rounded-xl px-8 font-black uppercase text-xs tracking-widest">
                    Criar Demanda
                </Button>
            </div>
        </div>
    );

    const renderReview = () => (
        <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground mb-2">Selecione um item para iniciar a revisão:</p>
            <div className="space-y-3">
                {pendingReviews.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-muted/10 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                                <p className="text-xs text-muted-foreground">{item.project} • por {item.author}</p>
                            </div>
                        </div>
                        <Button size="sm" variant="outline" className="rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                            Revisar
                        </Button>
                    </div>
                ))}
            </div>
            <div className="flex justify-start pt-4">
                <Button variant="link" onClick={() => setStep('menu')} className="pl-0 text-muted-foreground hover:text-foreground">
                    <ArrowLeft size={16} className="mr-2" /> Voltar ao Menu
                </Button>
            </div>
        </div>
    );

    const renderValidate = () => (
        <div className="space-y-6 py-4 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-black">Validar Entregas</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Você tem <span className="text-foreground font-bold">12 itens</span> prontos para validação final. Isso irá concluir as demandas e notificar os envolvidos.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/5">
                    <span className="text-2xl font-black text-foreground">4</span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Projetos</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/5">
                    <span className="text-2xl font-black text-foreground">8</span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Specs</span>
                </Button>
            </div>

            <Button className="w-full max-w-sm mx-auto rounded-xl h-12 font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                Iniciar Validação em Lote
            </Button>
            <div className="flex justify-center pt-2">
                <Button variant="link" onClick={() => setStep('menu')} className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft size={16} className="mr-2" /> Voltar
                </Button>
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Zap className="text-primary fill-current" size={24} />
                        Central de Ações
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Gerencie demandas, revisões e validações do setor de Design.
                    </DialogDescription>
                </DialogHeader>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {step === 'menu' && renderMenu()}
                        {step === 'new-demand' && renderNewDemand()}
                        {step === 'review' && renderReview()}
                        {step === 'validate' && renderValidate()}
                        {step === 'moodboard' && renderNewDemand()} {/* Reusing demand form for now */}
                    </motion.div>
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
