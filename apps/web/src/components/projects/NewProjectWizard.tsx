"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ChevronRight, ChevronLeft, Check,
    Building2, MapPin, User, FileText,
    Zap, Hammer, Shield, Info, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ShaderAnimation } from '@/components/ui/shader-animation';
import { cn } from '@/lib/utils';
import { classifyProjectDisciplines } from '@/lib/project-type-classifier';
import { DISCIPLINE_TREE } from '@/lib/discipline-tree';

interface NewProjectWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: any) => void;
}

// Helpers
function SummaryItem({ label, value, icon: Icon }: any) {
    return (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 mb-1 opacity-40">
                <Icon size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-sm font-black uppercase tracking-tight">{value || 'N/D'}</p>
        </div>
    );
}

export function NewProjectWizard({ isOpen, onClose, onComplete }: NewProjectWizardProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nome: '',
        localizacao: '',
        cliente: '',
        tipo: '',
        area: '',
        pavimentos: '',
        prio: 'NORMAL',
        complexidade: 'MEDIA',
        leisEspeciais: [] as string[],
        estrategia: 'PRÓPRIA'
    });

    const steps = [
        { id: 1, title: 'Briefing Inicial', icon: Info },
        { id: 2, title: 'Classificação VERC', icon: Zap },
        { id: 3, title: 'Disciplinas Técnicas', icon: Hammer },
        { id: 4, title: 'Revisão & Início', icon: Shield },
    ];

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 lg:p-12 overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                onClick={onClose}
            />

            <motion.div
                layoutId="wizard-container"
                className="relative w-full max-w-5xl h-[80vh] bg-background rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 flex flex-col"
            >
                {/* Background Shader Layer */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <ShaderAnimation />
                </div>

                {/* Header */}
                <div className="relative z-10 p-8 border-b border-white/5 flex justify-between items-center bg-background/40 backdrop-blur-md">
                    <div>
                        <Badge className="bg-primary text-white border-none font-black text-[10px] tracking-widest uppercase mb-2">VERC INTELLIGENCE • PIPELINE</Badge>
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            Ref. {formData.nome || 'Nova Obra'}
                        </h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/5 text-muted-foreground hover:text-white">
                        <X size={24} />
                    </Button>
                </div>

                {/* Stepper */}
                <div className="relative z-10 px-8 py-4 bg-muted/30 border-b border-white/5 flex gap-4 overflow-x-auto no-scrollbar">
                    {steps.map((s) => (
                        <div key={s.id} className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-xl transition-all whitespace-nowrap",
                            step === s.id ? "bg-primary text-white shadow-lg" : "text-muted-foreground opacity-60"
                        )}>
                            <s.icon size={16} />
                            <span className="text-[10px] font-black uppercase tracking-wider">{s.title}</span>
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 overflow-y-auto p-12 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-xl mx-auto space-y-8"
                            >
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">Identificação Base</label>
                                    <Input
                                        placeholder="Nome do Empreendimento"
                                        className="h-16 rounded-2xl bg-white/5 border-white/10 text-xl font-bold px-6"
                                        value={formData.nome}
                                        onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Localização / Cidade"
                                            className="h-14 rounded-xl bg-white/5 border-white/10"
                                            value={formData.localizacao}
                                            onChange={e => setFormData({ ...formData, localizacao: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Cliente / Proprietário"
                                            className="h-14 rounded-xl bg-white/5 border-white/10"
                                            value={formData.cliente}
                                            onChange={e => setFormData({ ...formData, cliente: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-3xl mx-auto space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-black mb-2">Classificação Automática</h3>
                                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-black opacity-60">O VERC identicará as disciplinas necessárias</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {['RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL'].map(tipo => (
                                        <Card
                                            key={tipo}
                                            onClick={() => setFormData({ ...formData, tipo })}
                                            className={cn(
                                                "p-8 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-4 text-center",
                                                formData.tipo === tipo ? "border-primary bg-primary/5 scale-105" : "border-white/5 bg-white/5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                                            )}
                                        >
                                            <Building2 size={40} className={formData.tipo === tipo ? "text-primary" : "text-muted-foreground"} />
                                            <span className="font-black text-xs uppercase tracking-widest">{tipo}</span>
                                        </Card>
                                    ))}
                                </div>

                                {/* DNA Addition: Complexity & Strategies */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Complexidade Técnica</label>
                                        <div className="flex gap-2">
                                            {['BAIXA', 'MEDIA', 'ALTA'].map(c => (
                                                <Button
                                                    key={c}
                                                    variant="ghost"
                                                    onClick={() => setFormData({ ...formData, complexidade: c })}
                                                    className={cn(
                                                        "flex-1 h-12 rounded-xl border font-black text-[9px] uppercase tracking-widest",
                                                        formData.complexidade === c ? "bg-primary text-white border-primary" : "border-white/5 text-muted-foreground"
                                                    )}
                                                >
                                                    {c}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Estratégia de Execução</label>
                                        <div className="flex gap-2">
                                            {['PRÓPRIA', 'MISTA', 'TERCEIRIZADA'].map(e => (
                                                <Button
                                                    key={e}
                                                    variant="ghost"
                                                    onClick={() => setFormData({ ...formData, estrategia: e })}
                                                    className={cn(
                                                        "flex-1 h-12 rounded-xl border font-black text-[9px] uppercase tracking-widest",
                                                        formData.estrategia === e ? "bg-primary text-white border-primary" : "border-white/5 text-muted-foreground"
                                                    )}
                                                >
                                                    {e}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-4xl mx-auto space-y-8"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-2xl font-black">Árvore Técnica Ativada</h3>
                                        <p className="text-muted-foreground text-xs uppercase font-black opacity-60">Disciplinas geradas automaticamente pelo DNA do projeto</p>
                                    </div>
                                    <Badge className="bg-primary/20 text-primary border-none font-black px-4 py-2">8 DISCIPLINAS ATIVAS</Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['Arquitetura & Design', 'Estrutural (Concreto)', 'Instalações Elétricas', 'Hidrosanitário', 'Climatização (HVAC)', 'SST - Segurança', 'Logística de Canteiro', 'Gestão Ambiental'].map((disc, idx) => (
                                        <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                                                    0{idx + 1}
                                                </div>
                                                <span className="font-bold text-sm">{disc}</span>
                                            </div>
                                            <CheckCircle2 size={18} className="text-emerald-500 opacity-60 group-hover:opacity-100" />
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 flex gap-6 items-center">
                                    <AlertCircle className="text-amber-500 shrink-0" size={32} />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Atenção Automação VERC</p>
                                        <p className="text-xs font-medium text-muted-foreground">Com base na complexidade <strong>{formData.complexidade}</strong>, incluímos revisões técnicas extras no fluxo de Projetos.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="max-w-2xl mx-auto space-y-8"
                            >
                                <div className="text-center mb-12">
                                    <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 border border-primary/20">
                                        <Zap size={40} className="animate-pulse" />
                                    </div>
                                    <h3 className="text-3xl font-black">DNA Consolidado</h3>
                                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-60 mt-2">Pronto para ativação e distribuição</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <SummaryItem label="Tipo de Obra" value={formData.tipo} icon={Building2} />
                                    <SummaryItem label="Complexidade" value={formData.complexidade} icon={Zap} />
                                    <SummaryItem label="Estratégia" value={formData.estrategia} icon={Hammer} />
                                    <SummaryItem label="Prioridade" value={formData.prio} icon={Shield} />
                                </div>

                                <Card className="p-8 rounded-[2rem] border-white/10 bg-white/5 backdrop-blur-md">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Checklist de Ativação</span>
                                        <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black tracking-widest">READY</Badge>
                                    </div>
                                    <ul className="space-y-3">
                                        {[
                                            'Mapeamento de 8 disciplinas técnicas',
                                            'Criação de Centros de Custo VERC',
                                            'Ativação de Workflow na Engenharia',
                                            'Congelamento de Dados Comerciais'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="relative z-10 p-8 border-t border-white/5 bg-background/40 backdrop-blur-md flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={step === 1}
                        className="rounded-xl h-12 font-black uppercase text-[10px] tracking-widest gap-2"
                    >
                        <ChevronLeft size={18} /> Voltar
                    </Button>

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl h-12 font-black uppercase text-[10px] tracking-widest border-white/10"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={step === 4 ? () => {
                                onComplete(formData);
                            } : nextStep}
                            className="rounded-xl h-12 font-black uppercase text-[10px] tracking-widest px-8 gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                        >
                            {step === 4 ? 'Distribuir Tarefas' : 'Próximo Passo'} <ChevronRight size={18} />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
