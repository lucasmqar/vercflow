"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ChevronRight, ChevronLeft,
    Building2, MapPin, User, FileText, Briefcase,
    CheckCircle2, AlertCircle, Home, Factory, ShoppingBag, Cross
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ShaderAnimation } from '@/components/ui/shader-animation';
import { cn } from '@/lib/utils';
import { useAppFlow } from '@/store/useAppFlow';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface LeadWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

// ... imports
import { UploadCloud } from 'lucide-react'; // Added icon

// Updated Interface for Classification
interface WorkClassification {
    zona: 'URBANA' | 'RURAL' | 'MISTA_EXPANSAO';
    subzona: string;
    uso: string;
}

export function LeadWizard({ isOpen, onClose }: LeadWizardProps) {
    const [step, setStep] = useState(1);
    const { addClient, addLead } = useAppFlow();

    // Form State
    const [formData, setFormData] = useState({
        // Cliente
        clienteNome: '',
        clienteTipo: 'PJ' as 'PJ' | 'PF',
        clienteDoc: '',
        clienteContato: '',
        clienteEndereco: '',

        // Obra/Lead
        nomeObra: '',
        localizacao: '',
        areaEstimada: '',
        descricao: '',

        // Detailed Classification
        classificacao: {
            zona: 'URBANA',
            subzona: 'VIA_PUBLICA',
            uso: 'HABITACAO_UNIFAMILIAR'
        } as WorkClassification,

        fonteLead: 'INDICACAO' as 'INDICACAO' | 'SOCIAL' | 'SITE' | 'ANTIGO_CLIENTE' | 'OUTROS',
        urgencia: 'NORMAL' as 'BAIXA' | 'NORMAL' | 'ALTA' | 'URGENTE',

        // Attachments
        attachments: [] as any[] // Mock attachments
    });

    const classificationOptions = {
        URBANA: [
            { id: 'VIA_PUBLICA', label: 'Via Pública / Lote Tradicional' },
            { id: 'CONDOMINIO_FECHADO', label: 'Condomínio Fechado' },
            { id: 'LOTEAMENTO_ABERTO', label: 'Loteamento Aberto' },
            { id: 'INSTITUCIONAL', label: 'Área Institucional' },
            { id: 'INDUSTRIAL_PLANEJADA', label: 'Distrito Industrial' }
        ],
        RURAL: [
            { id: 'FAZENDA', label: 'Fazenda' },
            { id: 'SITIO', label: 'Sítio' },
            { id: 'CHACARA', label: 'Chácara' },
            { id: 'RURAL_PRODUTIVA', label: 'Rural Produtiva' },
            { id: 'RURAL_INDUSTRIAL', label: 'Rural Industrial' },
            { id: 'RURAL_EXPANSAO', label: 'Expansão Futura' }
        ],
        MISTA_EXPANSAO: [
            { id: 'MISTA', label: 'Área Mista' }
        ]
    };

    const usageOptions = [
        { id: 'HABITACAO_UNIFAMILIAR', label: 'Habitação Unifamiliar' },
        { id: 'HABITACAO_MULTIFAMILIAR', label: 'Habitação Multifamiliar' },
        { id: 'COMERCIAL_VAREJISTA', label: 'Comercial Varejista' },
        { id: 'SERVICOS', label: 'Serviços' },
        { id: 'INDUSTRIAL_LEVE', label: 'Industrial Leve' },
        { id: 'INDUSTRIAL_PESADO', label: 'Industrial Pesado' },
        { id: 'SAUDE', label: 'Saúde' },
        { id: 'INSTITUCIONAL', label: 'Institucional / Público' }
    ];

    const nextStep = () => setStep(prev => Math.min(prev + 1, 5)); // Increased steps to 5
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleComplete = () => {
        const clientId = addClient({
            nome: formData.clienteNome,
            tipo: formData.clienteTipo,
            documento: formData.clienteDoc,
            contatos: formData.clienteContato,
            enderecoCompleto: formData.clienteEndereco
        });

        addLead({
            clientId,
            nomeObra: formData.nomeObra,
            localizacao: formData.localizacao,
            classificacao: formData.classificacao as any,
            tipoObra: formData.classificacao.uso, // Mapping usage to old type for compatibility or keeping both
            areaEstimada: parseFloat(formData.areaEstimada) || 0,
            attachments: formData.attachments,
            status: 'NOVO'
        });

        toast.success(`Lead "${formData.nomeObra}" registrado no Comercial!`);
        onClose();
        // Reset form...
        setStep(1);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 lg:p-8 overflow-hidden">
            {/* Lighter Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-md" // Lighter overlay
                onClick={onClose}
            />

            <motion.div
                layoutId="wizard-container"
                className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-[2.5rem] shadow-2xl overflow-hidden border border-border/20 flex flex-col"
            >
                {/* Header */}
                <div className="relative z-10 p-6 border-b border-border/10 flex justify-between items-center bg-background/80 backdrop-blur-md">
                    <div>
                        <Badge className="bg-primary text-primary-foreground border-none font-black text-[9px] tracking-widest uppercase mb-2">
                            COMERCIAL • ENTRADA DE LEADS
                        </Badge>
                        <h2 className="text-2xl font-black tracking-tight">Novo Lead Comercial</h2>
                        <p className="text-xs text-muted-foreground mt-1">
                            Etapa {step} de 5 • {['Cliente', 'Obra', 'Classificação', 'Anexos', 'Revisão'][step - 1]}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted/20">
                        <X size={20} />
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="relative z-10 h-1 bg-muted/20">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(step / 5) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: CLIENTE (Same as before but lighter inputs) */}
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto space-y-6">
                                {/* ... Client Form Fields (Simplified for brevity in replacement, assume same structure but with cleaner styling if needed) ... */}
                                <div className="text-center mb-8">
                                    <h3 className="text-xl font-black mb-2">Dados do Cliente</h3>
                                    <p className="text-sm text-muted-foreground">Pessoa física ou jurídica responsável</p>
                                </div>
                                {/* Reusing previous inputs structure */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Nome / Razão Social</label>
                                        <Input
                                            placeholder="Ex: João Silva ou Construtora ABC Ltda"
                                            className="h-12 rounded-xl bg-muted/5 border-border/20"
                                            value={formData.clienteNome}
                                            onChange={e => setFormData({ ...formData, clienteNome: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Tipo</label>
                                        <div className="flex bg-muted/5 rounded-xl p-1 border border-border/20 h-12">
                                            <Button variant="ghost" onClick={() => setFormData({ ...formData, clienteTipo: 'PJ' })} className={cn("flex-1 rounded-lg text-[10px] font-black h-full", formData.clienteTipo === 'PJ' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>PJ</Button>
                                            <Button variant="ghost" onClick={() => setFormData({ ...formData, clienteTipo: 'PF' })} className={cn("flex-1 rounded-lg text-[10px] font-black h-full", formData.clienteTipo === 'PF' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>PF</Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">{formData.clienteTipo === 'PJ' ? 'CNPJ' : 'CPF'}</label>
                                        <Input placeholder={formData.clienteTipo === 'PJ' ? "00.000.000/0000-00" : "000.000.000-00"} className="h-12 rounded-xl bg-muted/5 border-border/20" value={formData.clienteDoc} onChange={e => setFormData({ ...formData, clienteDoc: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Contato</label>
                                        <Input placeholder="(00) 00000-0000" className="h-12 rounded-xl bg-muted/5 border-border/20" value={formData.clienteContato} onChange={e => setFormData({ ...formData, clienteContato: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Endereço Completo</label>
                                    <Input placeholder="Endereço do Cliente" className="h-12 rounded-xl bg-muted/5 border-border/20" value={formData.clienteEndereco} onChange={e => setFormData({ ...formData, clienteEndereco: e.target.value })} />
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: OBRA BASICS */}
                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto space-y-6">
                                <div className="text-center mb-8">
                                    <h3 className="text-xl font-black mb-2">Dados da Obra</h3>
                                    <p className="text-sm text-muted-foreground">Informações básicas do projeto</p>
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Nome da Obra</label>
                                    <Input placeholder="Ex: Edifício Residencial Sky Tower" className="h-14 rounded-xl bg-muted/5 border-border/20 text-lg font-semibold" value={formData.nomeObra} onChange={e => setFormData({ ...formData, nomeObra: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Localização (Cidade/UF)</label>
                                    <Input placeholder="Cidade - UF" className="h-12 rounded-xl bg-muted/5 border-border/20" value={formData.localizacao} onChange={e => setFormData({ ...formData, localizacao: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Área Estimada (m²)</label>
                                    <Input type="number" placeholder="0" className="h-12 rounded-xl bg-muted/5 border-border/20" value={formData.areaEstimada} onChange={e => setFormData({ ...formData, areaEstimada: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Descrição / Observações</label>
                                    <Textarea className="min-h-[100px] rounded-xl bg-muted/5 border-border/20 resize-none" placeholder="Detalhes iniciais..." value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} />
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: DETAILED CLASSIFICATION */}
                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto space-y-8">
                                <div className="text-center mb-8">
                                    <h3 className="text-xl font-black mb-2">Classificação de Contexto</h3>
                                    <p className="text-sm text-muted-foreground">Definição precisa do ambiente e uso</p>
                                </div>

                                <div className="space-y-6">
                                    {/* ZONA */}
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 block">Zona / Contexto</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['URBANA', 'RURAL', 'MISTA_EXPANSAO'].map(z => (
                                                <Button
                                                    key={z}
                                                    variant={formData.classificacao.zona === z ? 'default' : 'outline'}
                                                    onClick={() => setFormData({ ...formData, classificacao: { ...formData.classificacao, zona: z as any, subzona: '' } })} // Reset subzone on zone change
                                                    className="h-12 rounded-xl"
                                                >
                                                    {z.replace('_', ' ')}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SUBZONA */}
                                    {formData.classificacao.zona && (
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 block">Especificação do Local</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {(classificationOptions[formData.classificacao.zona as keyof typeof classificationOptions] || []).map((opt: any) => (
                                                    <Button
                                                        key={opt.id}
                                                        variant={formData.classificacao.subzona === opt.id ? 'default' : 'outline'}
                                                        onClick={() => setFormData({ ...formData, classificacao: { ...formData.classificacao, subzona: opt.id } })}
                                                        className="h-10 text-xs rounded-lg justify-start px-4"
                                                    >
                                                        {opt.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* USO */}
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 block">Uso e Ocupação Principal</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {usageOptions.map(opt => (
                                                <Button
                                                    key={opt.id}
                                                    variant={formData.classificacao.uso === opt.id ? 'default' : 'outline'}
                                                    onClick={() => setFormData({ ...formData, classificacao: { ...formData.classificacao, uso: opt.id } })}
                                                    className="h-auto py-3 text-xs rounded-lg flex-col gap-1 items-center justify-center text-center whitespace-normal"
                                                >
                                                    <span className="font-bold">{opt.label}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: ANEXOS (NEW) */}
                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto space-y-6">
                                <div className="text-center mb-8">
                                    <h3 className="text-xl font-black mb-2">Anexos e Referências</h3>
                                    <p className="text-sm text-muted-foreground">Fotos do local, documentos ou referências (Opcional)</p>
                                </div>

                                <div className="border-2 border-dashed border-border/40 rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/5 transition-colors group">
                                    <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                                        <UploadCloud size={32} className="text-muted-foreground group-hover:text-primary" />
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">Clique para fazer upload</h4>
                                    <p className="text-sm text-muted-foreground max-w-xs">Arraste arquivos ou clique para selecionar fotos e documentos (PDF, JPG, PNG)</p>
                                    <Button variant="outline" className="mt-6 rounded-xl" onClick={() => toast("Funcionalidade de upload simulada")}>
                                        Selecionar Arquivos
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Mock of attached files if any were 'uploaded' */}
                                    {formData.attachments.length > 0 && formData.attachments.map((file, i) => (
                                        <div key={i} className="p-3 bg-muted/10 border rounded-xl flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-[10px] font-black">{file.type}</div>
                                            <p className="text-xs font-medium truncate">{file.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}


                        {/* STEP 5: REVISÃO (Adjusted for 5 steps) */}
                        {step === 5 && (
                            <motion.div key="step5" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="max-w-2xl mx-auto space-y-6">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 size={32} className="text-emerald-500" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-2">Confirmar Registro</h3>
                                </div>

                                <Card className="p-6 rounded-2xl border-border/20 bg-muted/5 space-y-4">
                                    {/* Summary content */}
                                    <div className="flex justify-between border-b border-border/10 pb-3">
                                        <span className="text-xs font-black uppercase text-muted-foreground">Cliente</span>
                                        <span className="text-xs font-bold">{formData.clienteNome}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-border/10 pb-3">
                                        <span className="text-xs font-black uppercase text-muted-foreground">Obra</span>
                                        <span className="text-xs font-bold">{formData.nomeObra}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-border/10 pb-3">
                                        <span className="text-xs font-black uppercase text-muted-foreground">Classificação</span>
                                        <span className="text-xs font-bold text-right">
                                            {formData.classificacao.zona} • {formData.classificacao.subzona}<br />
                                            <span className="opacity-60">{formData.classificacao.uso}</span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs font-black uppercase text-muted-foreground">Próximo Passo</span>
                                        <span className="text-xs font-bold text-primary">Qualificação no Comercial</span>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="relative z-10 p-6 border-t border-border/10 bg-background/80 backdrop-blur-md flex justify-between items-center">
                    <Button variant="ghost" onClick={prevStep} disabled={step === 1} className="rounded-xl h-11 font-black uppercase text-[10px] tracking-widest gap-2">
                        <ChevronLeft size={16} /> Voltar
                    </Button>
                    <Button onClick={step === 5 ? handleComplete : nextStep} className="rounded-xl h-11 font-black uppercase text-[10px] tracking-widest px-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                        {step === 5 ? 'Registrar Lead' : 'Continuar'} <ChevronRight size={16} />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
