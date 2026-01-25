"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ChevronRight, ChevronLeft, Check,
    Building2, MapPin, User, FileText,
    Zap, Hammer, Shield, Info, CheckCircle2, AlertCircle,
    UserCircle, Briefcase, Truck, Wallet, ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ShaderAnimation } from '@/components/ui/shader-animation';
import { cn } from '@/lib/utils';
import { useAppFlow } from '@/store/useAppFlow';
import { toast } from 'sonner';

interface UniversalEntryWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

// Entry Types
type EntryType = 'LEAD' | 'OBRA_DIRETA' | 'SOLICITACAO' | 'COMPRA';

export function UniversalEntryWizard({ isOpen, onClose }: UniversalEntryWizardProps) {
    const [step, setStep] = useState(1);
    const [entryType, setEntryType] = useState<EntryType>('LEAD');
    const { addLead, addProject } = useAppFlow();

    // Unified Form State
    const [formData, setFormData] = useState({
        nome: '',
        clienteNome: '',
        clienteTipo: 'PJ', // PJ or PF
        clienteDoc: '',
        localizacao: '',
        categoria: 'RESIDENCIAL', // RESIDENCIAL, COMERCIAL, INDUSTRIAL
        subcategoria: 'ALTO PADRAO',
        descricao: '',
        prioridade: 'NORMAL',
        orcamentoEstimado: ''
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleComplete = () => {
        // Logic to dispatch based on Type
        if (entryType === 'LEAD') {
            addLead({
                nomeObra: formData.nome,
                clientId: 'temp-client-id', // Would ideally create client first
                localizacao: formData.localizacao,
                areaEstimada: 0, // Mocked for now
                tipoObra: formData.categoria,
                status: 'NOVO'
            });
            toast.success("Novo Lead Comercial registrado com sucesso!");
        } else if (entryType === 'OBRA_DIRETA') {
            addProject({ // Updated Method
                nome: formData.nome,
                clientId: 'temp-client-id',
                status: 'PLANEJAMENTO',
                categoria: formData.categoria as any,
                endereco: formData.localizacao
            });
            toast.success("Nova Obra registrada em Planejamento!");
        }
        onClose();
    };

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
                className="relative w-full max-w-5xl h-[85vh] bg-background rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col"
            >
                {/* Background Shader */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <ShaderAnimation />
                </div>

                {/* Header */}
                <div className="relative z-10 p-8 border-b border-white/5 flex justify-between items-center bg-background/40 backdrop-blur-md">
                    <div>
                        <Badge className="bg-primary text-white border-none font-black text-[10px] tracking-widest uppercase mb-2">VERC INTELLIGENCE • ENTRY POINT</Badge>
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            Novo Registro Universal
                        </h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/5 text-muted-foreground hover:text-white">
                        <X size={24} />
                    </Button>
                </div>

                {/* Content Area */}
                <div className="relative z-10 flex-1 overflow-y-auto p-12 custom-scrollbar">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: TYPE SELECTION */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="max-w-4xl mx-auto"
                            >
                                <h3 className="text-2xl font-black mb-8 text-center">O que você deseja registrar?</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <TypeCard
                                        icon={Briefcase}
                                        title="Lead Comercial"
                                        desc="Nova oportunidade, prospecção ou contato inicial."
                                        selected={entryType === 'LEAD'}
                                        onClick={() => setEntryType('LEAD')}
                                        color="text-primary"
                                    />
                                    <TypeCard
                                        icon={Building2}
                                        title="Obra Direta"
                                        desc="Projeto já fechado entrando para execução/planejamento."
                                        selected={entryType === 'OBRA_DIRETA'}
                                        onClick={() => setEntryType('OBRA_DIRETA')}
                                        color="text-emerald-500"
                                    />
                                    <TypeCard
                                        icon={Hammer}
                                        title="Solicitação Técnica"
                                        desc="Requisição de serviço, manutenção ou RT."
                                        selected={entryType === 'SOLICITACAO'}
                                        onClick={() => setEntryType('SOLICITACAO')}
                                        color="text-amber-500"
                                    />
                                    <TypeCard
                                        icon={ShoppingCart}
                                        title="Requisição de Compra"
                                        desc="Material ou insumo para obra existente."
                                        selected={entryType === 'COMPRA'}
                                        onClick={() => setEntryType('COMPRA')}
                                        color="text-blue-500"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: DETAILS (Dynamic based on Type) */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-xl mx-auto space-y-8"
                            >
                                <div className="text-center mb-6">
                                    <Badge variant="outline" className="mb-2">{entryType.replace('_', ' ')}</Badge>
                                    <h3 className="text-2xl font-black">Identificação & Cliente</h3>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">Dados do Cliente</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2">
                                            <Input
                                                placeholder="Nome do Cliente / Empresa"
                                                className="h-14 rounded-xl bg-white/5 border-white/10"
                                                value={formData.clienteNome}
                                                onChange={e => setFormData({ ...formData, clienteNome: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setFormData({ ...formData, clienteTipo: 'PJ' })}
                                                className={cn("flex-1 rounded-lg text-[10px] font-black", formData.clienteTipo === 'PJ' ? "bg-primary text-white" : "text-muted-foreground")}
                                            >PJ</Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => setFormData({ ...formData, clienteTipo: 'PF' })}
                                                className={cn("flex-1 rounded-lg text-[10px] font-black", formData.clienteTipo === 'PF' ? "bg-primary text-white" : "text-muted-foreground")}
                                            >PF</Button>
                                        </div>
                                    </div>
                                    <Input
                                        placeholder={formData.clienteTipo === 'PJ' ? "CNPJ" : "CPF"}
                                        className="h-14 rounded-xl bg-white/5 border-white/10"
                                        value={formData.clienteDoc}
                                        onChange={e => setFormData({ ...formData, clienteDoc: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">Dados do Empreendimento</label>
                                    <Input
                                        placeholder="Nome da Obra / Projeto"
                                        className="h-14 rounded-xl bg-white/5 border-white/10"
                                        value={formData.nome}
                                        onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Localização (Cidade/UF)"
                                        className="h-14 rounded-xl bg-white/5 border-white/10"
                                        value={formData.localizacao}
                                        onChange={e => setFormData({ ...formData, localizacao: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: CATEGORIZATION */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-3xl mx-auto space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-black">Categorização & Rotina</h3>
                                    <p className="text-muted-foreground text-xs mt-2">Defina o perfil para gerar o fluxo de trabalho.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {['RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL'].map(cat => (
                                        <Card
                                            key={cat}
                                            onClick={() => setFormData({ ...formData, categoria: cat })}
                                            className={cn(
                                                "p-8 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-4 text-center hover:scale-105",
                                                formData.categoria === cat ? "border-primary bg-primary/5" : "border-white/5 bg-white/5 opacity-60"
                                            )}
                                        >
                                            <Building2 size={32} className={formData.categoria === cat ? "text-primary" : "text-muted-foreground"} />
                                            <span className="font-black text-xs uppercase tracking-widest">{cat}</span>
                                        </Card>
                                    ))}
                                </div>

                                <div className="mt-8">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 block">Descrição da Demanda</label>
                                    <textarea
                                        className="w-full h-32 rounded-2xl bg-white/5 border border-white/10 p-4 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Descreva os detalhes iniciais..."
                                        value={formData.descricao}
                                        onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: REVIEW & CONFIRM */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="max-w-2xl mx-auto text-center space-y-8"
                            >
                                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-500 animate-pulse">
                                    <CheckCircle2 size={48} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black mb-2">Pronto para Registrar</h3>
                                    <p className="text-muted-foreground text-sm">O VERC irá criar os registros e notificar os departamentos responsáveis.</p>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-8 text-left space-y-4 border border-white/5">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-xs uppercase font-black text-muted-foreground">Tipo</span>
                                        <span className="text-xs font-bold text-primary">{entryType}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-xs uppercase font-black text-muted-foreground">Cliente</span>
                                        <span className="text-xs font-bold">{formData.clienteNome} ({formData.clienteTipo})</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-xs uppercase font-black text-muted-foreground">Obra</span>
                                        <span className="text-xs font-bold">{formData.nome}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs uppercase font-black text-muted-foreground">Destino</span>
                                        <span className="text-xs font-bold text-emerald-500">
                                            {entryType === 'LEAD' ? 'Comercial > Qualificação' : 'Engenharia > Planejamento'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="relative z-10 p-8 border-t border-white/5 bg-background/40 backdrop-blur-md flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={step === 1}
                        className="rounded-xl h-12 font-black uppercase text-[10px] tracking-widest gap-2"
                    >
                        <ChevronLeft size={18} /> Voltar
                    </Button>

                    <Button
                        onClick={step === 4 ? handleComplete : nextStep}
                        className="rounded-xl h-12 font-black uppercase text-[10px] tracking-widest px-8 gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                        {step === 4 ? 'Confirmar Registro' : 'Continuar'} <ChevronRight size={18} />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

function TypeCard({ icon: Icon, title, desc, selected, onClick, color }: any) {
    return (
        <Card
            onClick={onClick}
            className={cn(
                "p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-4 text-center hover:scale-105 group relative overflow-hidden",
                selected ? "border-primary bg-primary/5" : "border-white/5 bg-white/5 opacity-60 hover:opacity-100"
            )}
        >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-colors mb-2", selected ? "bg-primary text-white" : "bg-white/5 text-muted-foreground group-hover:bg-white/10")}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="font-black text-sm uppercase tracking-wide mb-2">{title}</h4>
                <p className="text-[10px] font-medium text-muted-foreground leading-tight">{desc}</p>
            </div>
        </Card>
    );
}
