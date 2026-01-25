"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, AlertTriangle, Building, Map,
    FileText, ShieldCheck, ArrowRight, User, Briefcase,
    Upload, Trash2, HardDrive, AlertCircle, Plus, Info, ChevronRight,
    X, ChevronLeft
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useAppFlow } from '@/store/useAppFlow';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import {
    NATUREZAS_OBRA,
    CONTEXTOS,
    TIPOLOGIAS,
    PADROES,
    FINALIDADES,
    REGULARIZACAO,
    getRecommendedDisciplines
} from '@/lib/project-taxonomy';
import { WorkClassification, RegulatoryData, Attachment } from '@/types';

interface LeadWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onRegisterClient?: () => void; // Callback to switch to ClientWizard
}

export function LeadWizard({ isOpen, onClose, onRegisterClient }: LeadWizardProps) {
    const [step, setStep] = useState(1);
    const { addLead, createBudget, clients } = useAppFlow();

    // -- STATE --
    // 1. Client Link
    const [selectedClientId, setSelectedClientId] = useState('');

    // 2. Work Basic
    const [workName, setWorkName] = useState('');
    const [workCity, setWorkCity] = useState('');

    // 3. Classification
    const [classification, setClassification] = useState<WorkClassification>({
        natureza: 'RESIDENCIAL',
        contexto: 'URBANA',
        subcontexto: 'RUA_ABERTA',
        tipologia: 'CASA_TERREA',
        padrao: 'MEDIO',
        finalidade: 'USO_PROPRIO',
        objetos: [],
        requerLegalizacao: false,
        legalizacao: { orgaos: [], cenario: 'NAO_INICIADA' }
    });

    // 4. Documents
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    // 4. Analysis
    const [disciplines, setDisciplines] = useState<string[]>([]);

    useEffect(() => {
        setDisciplines(getRecommendedDisciplines(classification));
    }, [classification]);

    // -- HANDLERS --
    const updateClass = (key: keyof WorkClassification, value: any) => {
        setClassification(prev => ({ ...prev, [key]: value }));
    };

    const updateLegal = (key: keyof RegulatoryData, value: any) => {
        setClassification(prev => ({
            ...prev,
            legalizacao: { ...(prev.legalizacao || { orgaos: [], cenario: 'NAO_INICIADA' }), [key]: value }
        }));
    };

    const handleToggleList = (listKey: 'objetos' | 'orgaos', item: string) => {
        if (listKey === 'objetos') {
            const list = classification.objetos || [];
            const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
            updateClass('objetos', newList);
        } else {
            const list = classification.legalizacao?.orgaos || [];
            const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
            updateLegal('orgaos', newList);
        }
    };

    const handleFileUpload = (type: string) => {
        const newDoc: Attachment = {
            id: uuidv4(),
            name: `${type}_${workName || 'Obra'}.pdf`,
            url: '#',
            type: 'PDF',
            size: 1024 * 500, // 500KB
            uploadedAt: new Date().toISOString()
        };
        setAttachments(prev => [...prev, newDoc]);
        toast.success(`Documento ${type} anexado ao dossiê.`);
    };

    const removeAttachment = (id: string) => {
        setAttachments(prev => prev.filter(a => a.id !== id));
    };

    const handleComplete = () => {
        if (!selectedClientId) { toast.error("Selecione um cliente vinculado."); return; }
        if (!workName) { toast.error("Dê um nome à obra."); return; }

        try {
            const client = clients.find(c => c.id === selectedClientId);

            // 1. Create Lead
            const leadId = addLead({
                clientId: selectedClientId,
                nomeObra: workName,
                localizacao: workCity || 'Não informada',
                classificacao: classification,
                tipoObra: classification.natureza,
                nomeValidacao: client?.nome || 'Cliente Desconhecido',
                status: 'NOVO',
                attachments: attachments
            });

            // 2. Create Budget
            createBudget({
                leadId,
                escopoMacro: `OBJETO DO CONTRATO:\n${classification.objetos.join(', ')}\n\nCLASSIFICAÇÃO:\n${classification.natureza} | ${classification.tipologia}\n\nREGULARIZAÇÃO:\n${classification.requerLegalizacao ? `Órgãos: ${classification.legalizacao?.orgaos.join(', ')}` : 'Não requer'}`,
                valorEstimado: 0,
                prazoEstimadoMeses: 0,
                validacaoTecnica: 'PENDENTE',
                validacaoFinanceira: 'PENDENTE',
                status: 'EM_ELABORACAO'
            });

            toast.success("Nova Obra Registrada!");
            onClose();
            setStep(1);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao registrar obra.");
        }
    };

    if (!isOpen) return null;

    const currentNaturezaLabel = NATUREZAS_OBRA.find(n => n.id === classification.natureza)?.label;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 lg:p-6 overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                layoutId="work-wizard-container"
                className="relative w-full max-w-7xl h-[90vh] bg-background rounded-xl shadow-2xl overflow-hidden border border-border/20 flex flex-col lg:flex-row"
            >
                {/* LEFT: Context */}
                <div className="w-full lg:w-1/4 bg-muted/10 border-r border-border/10 p-8 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent" />
                    <Badge variant="outline" className="w-fit mb-6 border-blue-500/20 text-blue-500 font-black">OBJETIVO: NOVA OBRA</Badge>

                    <div className="space-y-6 mt-4">
                        {[
                            { id: 1, label: 'Vínculo & Nome', icon: User },
                            { id: 2, label: 'Zona & Natureza', icon: Building },
                            { id: 3, label: 'Tipologia Física', icon: FileText },
                            { id: 4, label: 'Objeto do Contrato', icon: Briefcase },
                            { id: 5, label: 'Legalização', icon: ShieldCheck },
                            { id: 6, label: 'Dossiê da Obra', icon: HardDrive },
                            { id: 7, label: 'Revisão Final', icon: CheckCircle2 }
                        ].map((s) => (
                            <div key={s.id} className={cn("flex items-center gap-4 transition-all", step === s.id ? "opacity-100 translate-x-1" : "opacity-40")}>
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", step === s.id ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20" : "border-border bg-background")}>
                                    <s.icon size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground">Etapa {s.id}</span>
                                    <span className="font-bold text-xs tracking-tight">{s.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle size={14} className="text-blue-600" />
                            <span className="text-[10px] font-black uppercase text-blue-600">DNA do Projeto</span>
                        </div>
                        <p className="text-[10px] text-blue-800/70 font-medium leading-relaxed">
                            A correta classificação permite que o VERCFLOW sugira as disciplinas adequadas e preveja riscos normativos.
                        </p>
                    </div>
                </div>

                {/* RIGHT: Form */}
                <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                        <AnimatePresence mode="wait">

                            {/* STEP 1: CLIENTE */}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto space-y-10">
                                    <div className="mb-4">
                                        <h2 className="text-4xl font-black tracking-tighter mb-2">Vínculo do Cliente</h2>
                                        <p className="text-muted-foreground">Toda obra no VERCFLOW deve estar vinculada a um cliente já registrado.</p>
                                    </div>

                                    <div className="p-8 rounded-xl border border-border/20 bg-muted/5 space-y-6">
                                        <div>
                                            <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground ml-1">Selecione o Cliente em Carteira</Label>
                                            <select
                                                className="w-full mt-2 h-14 rounded-2xl bg-background border-border/20 px-4 font-bold text-lg"
                                                value={selectedClientId}
                                                onChange={e => setSelectedClientId(e.target.value)}
                                            >
                                                <option value="">Buscar cliente...</option>
                                                {clients.map(c => <option key={c.id} value={c.id}>{c.nome} ({c.documento})</option>)}
                                            </select>
                                        </div>

                                        <div className="pt-4 border-t border-border/10 flex items-center justify-between">
                                            <p className="text-sm text-muted-foreground italic">Não encontrou o cliente?</p>
                                            <Button variant="outline" onClick={onRegisterClient} className="rounded-xl border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/5 font-bold">
                                                Cadastrar Novo Cliente Agora
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-6">
                                        <div>
                                            <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground ml-1">Nome da Obra (Identificação)</Label>
                                            <Input
                                                value={workName}
                                                onChange={e => setWorkName(e.target.value)}
                                                placeholder="Ex: Reforma Clínica Central"
                                                className="h-12 bg-muted/5 border-border/20 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground ml-1">Cidade / Localidade Principal</Label>
                                            <Input
                                                value={workCity}
                                                onChange={e => setWorkCity(e.target.value)}
                                                placeholder="Goiânia - GO"
                                                className="h-12 bg-muted/5 border-border/20 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: CLASSIFICAÇÃO */}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-8">
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-black tracking-tight mb-2 italic">Classificação Fundamental</h2>
                                        <p className="text-muted-foreground italic uppercase text-xs tracking-tighter">O tronco da árvore de decisão da engenharia.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground ml-1">Natureza Principal</Label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {NATUREZAS_OBRA.map(n => (
                                                    <div
                                                        key={n.id}
                                                        onClick={() => updateClass('natureza', n.id)}
                                                        className={cn(
                                                            "p-4 rounded-2xl border cursor-pointer transition-all hover:bg-muted/5",
                                                            classification.natureza === n.id ? "border-blue-600 bg-blue-500/5 shadow-inner" : "border-border/20"
                                                        )}
                                                    >
                                                        <h4 className={cn("font-bold text-sm", classification.natureza === n.id && "text-blue-600")}>{n.label}</h4>
                                                        <p className="text-[10px] text-muted-foreground">{n.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-8 bg-muted/5 p-6 rounded-xl border border-border/20">
                                            <div>
                                                <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground mb-3 block">Zona Territorial</Label>
                                                <div className="flex gap-2">
                                                    {(['URBANA', 'RURAL', 'PERIURBANA'] as const).map(z => (
                                                        <Button
                                                            key={z}
                                                            variant={classification.contexto === z ? 'default' : 'outline'}
                                                            onClick={() => updateClass('contexto', z)}
                                                            className="flex-1 text-xs font-bold"
                                                        >
                                                            {z}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground mb-3 block">Inserção / Logística</Label>
                                                <div className="grid grid-cols-1 gap-1.5 h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {CONTEXTOS[classification.contexto].map((s: any) => (
                                                        <Button
                                                            key={s.id}
                                                            variant={classification.subcontexto === s.id ? 'secondary' : 'ghost'}
                                                            onClick={() => updateClass('subcontexto', s.id)}
                                                            className={cn("justify-start font-normal h-11 text-xs px-4", classification.subcontexto === s.id && "bg-white dark:bg-muted font-bold border border-border/20 shadow-sm")}
                                                        >
                                                            {s.label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: TIPOLOGIA */}
                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-8">
                                    <div className="mb-6 text-center">
                                        <h2 className="text-3xl font-black tracking-tight mb-2">Tipologia Física</h2>
                                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">{currentNaturezaLabel}</Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                        <div className="space-y-4">
                                            <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground ml-1">Tipologia Arquitetônica</Label>
                                            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {(TIPOLOGIAS as any)[classification.natureza]?.map((t: any) => (
                                                    <div
                                                        key={t.id}
                                                        onClick={() => updateClass('tipologia', t.id)}
                                                        className={cn(
                                                            "p-4 rounded-2xl border cursor-pointer transition-all hover:border-blue-500/40",
                                                            classification.tipologia === t.id ? "border-blue-600 bg-blue-500/5 shadow-inner translate-x-1" : "border-border/20"
                                                        )}
                                                    >
                                                        <h4 className={cn("font-black text-xs uppercase tracking-tight", classification.tipologia === t.id && "text-blue-600")}>{t.label}</h4>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <Card className="p-8 border-border/20 bg-muted/5 space-y-8">
                                                <div>
                                                    <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground mb-4 block">Padrão Construtivo</Label>
                                                    <select
                                                        className="w-full h-12 rounded-xl bg-background border px-4 text-sm font-bold shadow-sm"
                                                        value={classification.padrao}
                                                        onChange={e => updateClass('padrao', e.target.value)}
                                                    >
                                                        {PADROES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground mb-4 block">Finalidade do Ativo</Label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {FINALIDADES.map(f => (
                                                            <Button
                                                                key={f.id}
                                                                size="sm"
                                                                variant={classification.finalidade === f.id ? 'default' : 'outline'}
                                                                onClick={() => updateClass('finalidade', f.id)}
                                                                className="h-10 text-[10px] font-black tracking-tighter"
                                                            >
                                                                {f.label.toUpperCase().split('(')[0]}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: OBJETO DO CONTRATO */}
                            {step === 4 && (
                                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-8">
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-black tracking-tight mb-2 italic">Objeto do Contrato</h2>
                                        <p className="text-muted-foreground">O que foi acordado com o cliente? Marque todas as frentes técnicas.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {REGULARIZACAO.OBJETOS.map(obj => (
                                            <div
                                                key={obj.id}
                                                onClick={() => handleToggleList('objetos', obj.id)}
                                                className={cn(
                                                    "p-6 rounded-xl border cursor-pointer transition-all flex items-center gap-4",
                                                    classification.objetos.includes(obj.id) ? "border-blue-600 bg-blue-500/5" : "border-border/20 bg-muted/5 hover:bg-muted/10"
                                                )}
                                            >
                                                <Checkbox
                                                    id={`obj-${obj.id}`}
                                                    checked={classification.objetos.includes(obj.id)}
                                                    className="border-blue-400"
                                                />
                                                <div>
                                                    <h4 className={cn("font-bold text-sm", classification.objetos.includes(obj.id) && "text-blue-700")}>{obj.label}</h4>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-4 bg-muted/20 border border-dashed border-border/40 rounded-2xl flex gap-3 text-muted-foreground">
                                        <AlertTriangle size={18} />
                                        <p className="text-[10px] font-medium leading-relaxed italic uppercase">Estes objetos definem o escopo macro do contrato e as responsas técnicas que deverão ser emitidas pela equipe interna.</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 5: REGULARIZAÇÃO */}
                            {step === 5 && (
                                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-8">
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-black tracking-tight mb-2">Legalização & Aprovação</h2>
                                        <p className="text-muted-foreground">Esta obra requer submissão a órgãos públicos?</p>
                                    </div>

                                    <div className="bg-muted/10 p-8 rounded-xl border border-border/20 flex items-center justify-between">
                                        <div className="flex gap-6 items-center">
                                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all", classification.requerLegalizacao ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground")}>
                                                <ShieldCheck size={28} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-xl uppercase tracking-widest">Requer Aprovação Pública?</h4>
                                                <p className="text-sm text-muted-foreground">Ative para configurar o fluxo de licenciamento necessário.</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={classification.requerLegalizacao}
                                            onCheckedChange={(c) => updateClass('requerLegalizacao', c)}
                                            className="scale-150"
                                        />
                                    </div>

                                    {classification.requerLegalizacao && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                                            <div className="space-y-6">
                                                <Label className="uppercase text-[10px] font-black tracking-widest text-blue-600 mb-2 block">Órgãos Envolvidos</Label>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {REGULARIZACAO.ORGAOS.map(org => (
                                                        <div
                                                            key={org.id}
                                                            onClick={() => handleToggleList('orgaos', org.id)}
                                                            className={cn("p-3 rounded-xl border flex items-center gap-3 cursor-pointer", classification.legalizacao?.orgaos.includes(org.id) ? "border-blue-500 bg-blue-500/5 font-bold" : "border-border/10")}
                                                        >
                                                            <Checkbox checked={classification.legalizacao?.orgaos.includes(org.id)} />
                                                            <span className="text-xs">{org.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <Label className="uppercase text-[10px] font-black tracking-widest text-blue-600 mb-2 block">Cenário Fático de Regularização</Label>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {REGULARIZACAO.CENARIOS.map(cen => (
                                                        <div
                                                            key={cen.id}
                                                            onClick={() => updateLegal('cenario', cen.id)}
                                                            className={cn("p-4 rounded-xl border cursor-pointer", classification.legalizacao?.cenario === cen.id ? "border-blue-500 bg-blue-600 text-white" : "border-border/10")}
                                                        >
                                                            <h4 className="font-bold text-xs">{cen.label}</h4>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {/* STEP 6: DOSSIÊ DE DOCUMENTOS */}
                            {step === 6 && (
                                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-8">
                                    <div className="text-center">
                                        <h2 className="text-4xl font-black tracking-tighter mb-2 italic">Dossiê da Obra</h2>
                                        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Documentação base para o início do planejamento técnico.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { id: 'MATRICULA', label: 'Matrícula do Imóvel / Escritura' },
                                            { id: 'LEVANTAMENTO', label: 'Levantamento Topográfico / Planialtimétrico' },
                                            { id: 'SOTAGEM', label: 'Laudo de Sondagem (SPT)' },
                                            { id: 'IPTU', label: 'Espelho do IPTU / ITR' },
                                            { id: 'CROQUI', label: 'Croquis ou Fotos do Local' },
                                            { id: 'VIABILIDADE', label: 'Consulta de Viabilidade / Uso do Solo' }
                                        ].map((doc) => {
                                            const isUploaded = attachments.some(a => a.name.startsWith(doc.id));
                                            return (
                                                <div
                                                    key={doc.id}
                                                    className={cn("p-6 rounded-xl border flex items-center justify-between transition-all", isUploaded ? "bg-blue-500/5 border-blue-500/40" : "bg-muted/5 border-border/10")}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", isUploaded ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground")}>
                                                            {isUploaded ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm tracking-tight">{doc.label}</h4>
                                                            <p className="text-[10px] text-muted-foreground italic uppercase">{isUploaded ? 'Arquivo Vinculado' : 'Aguardando Documento'}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant={isUploaded ? "ghost" : "secondary"}
                                                        onClick={() => handleFileUpload(doc.id)}
                                                        className="font-black text-[10px] uppercase tracking-widest px-4"
                                                    >
                                                        {isUploaded ? 'Alterar' : 'Anexar'}
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {attachments.length > 0 && (
                                        <div className="mt-8 space-y-3">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Arquivos Selecionados ({attachments.length})</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {attachments.map(file => (
                                                    <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/10 group">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <FileText size={14} className="text-blue-500 shrink-0" />
                                                            <span className="text-[10px] font-bold truncate">{file.name}</span>
                                                        </div>
                                                        <button onClick={() => removeAttachment(file.id)} className="p-1 hover:bg-red-500/10 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 bg-blue-500/5 border border-dashed border-blue-500/20 rounded-2xl flex gap-3 text-blue-800/60">
                                        <Info size={18} />
                                        <p className="text-[10px] font-medium leading-relaxed italic uppercase">Documentos anexados agora facilitam a validação técnica pela engenharia e aceleram o orçamento comercial.</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 7: REVISÃO FINAL */}
                            {step === 7 && (
                                <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-10">
                                    <div className="text-center">
                                        <h2 className="text-4xl font-black tracking-tighter mb-2">Resumo da Obra</h2>
                                        <p className="text-muted-foreground italic mb-8 uppercase tracking-widest text-xs font-bold">Confirmação de DNA e Dossiê</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <Card className="col-span-2 p-8 border-border/20 bg-muted/5 space-y-6">
                                            <div className="flex justify-between items-start border-b pb-6">
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Cliente Vinculado</p>
                                                    <h3 className="text-2xl font-black">{clients.find(c => c.id === selectedClientId)?.nome}</h3>
                                                </div>
                                                <Badge variant="outline" className="border-blue-500 text-blue-600 font-bold px-3 py-1">{currentNaturezaLabel}</Badge>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Obra: {workName}</p>
                                                    <p className="font-bold text-lg">{classification.tipologia.replace(/_/g, ' ')}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{classification.contexto} / {classification.subcontexto.replace(/_/g, ' ')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Dossiê Documental</p>
                                                    <p className="font-black text-lg text-blue-600">{attachments.length} Arquivos Anexados</p>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {attachments.map(a => <Badge key={a.id} className="text-[8px] bg-blue-500/10 text-blue-600 border-none">{a.name.split('_')[0]}</Badge>)}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className="p-8 border-blue-500/20 bg-blue-500/5 space-y-6">
                                            <h4 className="font-black text-xs uppercase tracking-widest text-blue-600 border-b border-blue-200 pb-2">Sugestão Técnica</h4>
                                            <div className="flex flex-col gap-2 h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                                {disciplines.map(d => (
                                                    <div key={d} className="flex items-center gap-2 p-2 bg-white dark:bg-muted rounded-lg border border-blue-100 shadow-sm text-[10px] font-bold uppercase tracking-tight">
                                                        <CheckCircle2 size={12} className="text-blue-500 shrink-0" />
                                                        {d}
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    </div>

                                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <p className="font-black uppercase tracking-wider text-emerald-800">Pronto para Validação</p>
                                                <p className="text-xs text-emerald-600 font-medium">Os dados serão enviados para a fila de Triagem da Engenharia.</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 border-t border-border/10 bg-background/80 backdrop-blur-md flex justify-between items-center z-20">
                        <Button
                            variant="ghost"
                            onClick={() => setStep(prev => Math.max(1, prev - 1))}
                            disabled={step === 1}
                            className="text-muted-foreground hover:text-foreground font-black uppercase tracking-widest text-xs gap-2"
                        >
                            <ChevronLeft size={16} /> Retroceder
                        </Button>

                        <Button
                            onClick={() => step === 7 ? handleComplete() : setStep(prev => Math.min(7, prev + 1))}
                            className={cn(
                                "rounded-2xl px-12 font-black tracking-[0.2em] gap-3 transition-all h-14 uppercase shadow-2xl",
                                step === 7 ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 scale-105" : "bg-blue-600 text-white shadow-blue-600/20"
                            )}
                        >
                            {step === 7 ? 'Efetivar Registro' : 'Avançar Etapa'}
                            {step !== 7 && <ArrowRight size={18} />}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
