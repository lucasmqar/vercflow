"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import {
    X, Plus, Type, Palette, Camera,
    Trash2, Save, Layers, Info, Hash,
    Briefcase, Activity, Zap, ClipboardList,
    CheckCircle2, AlertCircle,
    Layout, Filter, Settings2, Sparkles,
    MousePointer2, ListTodo, FileSearch,
    Mic, Upload, Check, ChevronLeft, ChevronRight,
    CheckSquare, Image as ImageIcon
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SketchCanvas } from '@/components/sketch/SketchCanvas';
import { getApiUrl } from '@/lib/api';
import { ShaderAnimation } from '@/components/ui/ShaderAnimation';
import { Project, Record, RecordType } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RegistroModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    parentRecord?: Record | null;
}

interface NewRecordItem {
    id: string;
    type: RecordType;
    content: string; // For text/photo, it's string. For checklist, it's stringified JSON.
    sketchData?: any;
}

interface ChecklistSubItem {
    id: string;
    text: string;
    checked: boolean;
}

const STEPS = [
    { id: 1, label: 'Contexto', icon: FileSearch },
    { id: 2, label: 'Evidências', icon: Camera },
    { id: 3, label: 'Checklist', icon: ListTodo },
    { id: 4, label: 'Revisão', icon: CheckCircle2 },
];

export function RegistroModal({ isOpen, onClose, onSuccess, parentRecord }: RegistroModalProps) {
    const [step, setStep] = useState(1);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>(parentRecord?.projectId || 'none');
    const [natureza, setNatureza] = useState<string>(parentRecord?.natureza || 'TECNICO');
    const [prioridade, setPrioridade] = useState<string>('MEDIA');
    const [observacao, setObservacao] = useState<string>(parentRecord?.texto || '');
    const [items, setItems] = useState<NewRecordItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sketchRef = useRef<any>(null);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            const projRes = await fetch(getApiUrl('/api/projects'));
            if (projRes.ok) setProjects(await projRes.json());
        } catch (e) {
            console.error('Error fetching data for RegistroModal', e);
        }
    };

    const addItem = (type: RecordType) => {
        const newItem: NewRecordItem = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: type === 'CHECKLIST' ? '[]' : '',
        };
        setItems([...items, newItem]);
        toast(`${type} adicionado à área de evidências`);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(it => it.id !== id));
    };

    const updateItemContent = (id: string, content: string) => {
        setItems(items.map(it => it.id === id ? { ...it, content } : it));
    };

    const handleSaveSketch = (id: string, data: { image: string, json: any }) => {
        setItems(items.map(it => it.id === id ? { ...it, content: data.image, sketchData: data.json } : it));
        toast.success('Esboço capturado');
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const user = useAuth.getState().user;
            if (!user?.id) {
                toast.error('Sessão expirada');
                setIsSubmitting(false);
                return;
            }

            const payload = {
                authorId: user.id,
                projectId: selectedProjectId === 'none' ? null : selectedProjectId,
                natureza,
                prioridade,
                texto: observacao,
                parentId: parentRecord?.id || null,
                items: items.map(it => ({
                    type: it.type,
                    content: it.type === 'ESBOCO' ? it.sketchData : it.content
                }))
            };

            const res = await fetch(getApiUrl('/api/records'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success('Protocolo de captura registrado com sucesso');
                setItems([]);
                setStep(1);
                onSuccess?.();
                onClose();
            } else {
                toast.error('Erro ao salvar registro');
            }
        } catch (e) {
            toast.error('Erro de conexão');
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[1200px] h-[90vh] p-0 overflow-hidden bg-background border-none shadow-2xl flex flex-col rounded-[2.5rem]">
                <DialogTitle className="sr-only">Verc OS Capture Wizard</DialogTitle>
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <ShaderAnimation />
                </div>

                {/* Main Layout Grid */}
                <div className="relative z-10 flex h-full">

                    {/* Left Sidebar Stepper */}
                    <div className="w-64 border-r border-white/5 bg-background/40 backdrop-blur-xl flex flex-col py-10 px-6">
                        <div className="mb-12">
                            <h2 className="text-2xl font-black tracking-tighter text-foreground flex items-center gap-2">
                                <Sparkles className="text-primary" size={20} /> VERC OS
                            </h2>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Field Intelligence</p>
                        </div>

                        <div className="space-y-4 flex-1">
                            {STEPS.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => s.id < step && setStep(s.id)}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                                        step === s.id ? "bg-primary border-primary shadow-lg shadow-primary/20 text-primary-foreground" :
                                            step > s.id ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-transparent border-white/5 text-muted-foreground opacity-40 hover:opacity-100"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                                        step === s.id ? "bg-white/20" : "bg-muted/50"
                                    )}>
                                        {step > s.id ? <CheckCircle2 size={16} /> : <s.icon size={16} />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">PASSO 0{s.id}</p>
                                        <p className="font-bold text-xs">{s.label}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <div className="p-4 rounded-2xl bg-muted/20 border border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Mic size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground text-center">Protocolo Ativado</p>
                                    <div className="flex justify-center gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-3 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-background/60 backdrop-blur-sm relative">
                        {isSubmitting && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-white bg-black/80 backdrop-blur-2xl transition-all duration-700">
                                <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-8 shadow-lg shadow-primary/20" />
                                <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Protocolando...</h2>
                                <p className="text-[10px] font-black opacity-60 tracking-[0.5em] uppercase animate-pulse">Transmitindo dados técnicos para triagem técnica</p>
                            </div>
                        )}

                        <ScrollArea className="flex-1">
                            <div className="max-w-4xl mx-auto p-12 lg:p-20">
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-12"
                                        >
                                            <div className="space-y-4">
                                                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5">Identificação do Registro</Badge>
                                                <h2 className="text-5xl font-black tracking-tighter leading-none">Contexto do Registro</h2>
                                                <p className="text-muted-foreground font-medium text-lg">Defina a natureza e o escopo desta captura.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-6">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                                            <Briefcase size={12} /> Projeto / Local da Obra
                                                        </label>
                                                        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                                                            <SelectTrigger className="h-14 rounded-2xl bg-muted/20 border-white/5 text-sm font-bold shadow-inner">
                                                                <SelectValue placeholder="Selecione o Projeto" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-white/10 bg-background/95 backdrop-blur-xl">
                                                                <SelectItem value="none" className="italic opacity-50">Geral (Sem vínculo direto)</SelectItem>
                                                                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                                            <Zap size={12} /> Nível de Prioridade
                                                        </label>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'].map(p => (
                                                                <button
                                                                    key={p}
                                                                    onClick={() => setPrioridade(p)}
                                                                    className={cn(
                                                                        "h-12 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                                                        prioridade === p ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/10" : "bg-muted/10 border-white/5 text-muted-foreground hover:bg-muted/20"
                                                                    )}
                                                                >
                                                                    {p}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                                            <Activity size={12} /> Natureza Técnica
                                                        </label>
                                                        <Select value={natureza} onValueChange={setNatureza}>
                                                            <SelectTrigger className="h-14 rounded-2xl bg-muted/20 border-white/5 text-sm font-bold">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-white/10 bg-background/95 backdrop-blur-xl">
                                                                {['TECNICO', 'ORCAMENTO', 'VISTORIA', 'FINANCEIRO', 'SEGURANÇA'].map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                                            <Info size={12} /> Assunto / Título Curto
                                                        </label>
                                                        <Input
                                                            value={observacao}
                                                            onChange={e => setObservacao(e.target.value)}
                                                            placeholder="Ex: Divergência na locação da viga V04..."
                                                            className="h-14 rounded-2xl bg-muted/20 border-white/5 font-bold text-sm shadow-inner"
                                                        />
                                                    </div>
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
                                            className="space-y-12"
                                        >
                                            <div className="space-y-4">
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5">Evidências Técnicas</Badge>
                                                <h2 className="text-5xl font-black tracking-tighter leading-none">Dados de Campo</h2>
                                                <p className="text-muted-foreground font-medium text-lg">Adicione fotos, esboços e descrições detalhadas.</p>
                                            </div>

                                            {/* Action Bar for Adding Blocks */}
                                            <div className="flex gap-4">
                                                <BlockAction icon={Type} label="Texto" onClick={() => addItem('TEXTO')} color="bg-blue-500" />
                                                <BlockAction icon={Camera} label="Foto" onClick={() => addItem('FOTO')} color="bg-orange-500" />
                                                <BlockAction icon={Palette} label="Esboço" onClick={() => addItem('ESBOCO')} color="bg-purple-500" />
                                                <BlockAction icon={Mic} label="Áudio" onClick={() => toast('Captação de áudio em breve')} color="bg-rose-500" />
                                            </div>

                                            <div className="space-y-8 min-h-[400px]">
                                                {items.filter(i => i.type !== 'CHECKLIST').map((item, index) => (
                                                    <motion.div
                                                        key={item.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="group relative bg-muted/5 rounded-[2.5rem] border border-white/5 p-8 transition-all hover:border-primary/20"
                                                    >
                                                        <div className="absolute -right-3 -top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                className="h-10 w-10 rounded-full shadow-lg"
                                                                onClick={() => removeItem(item.id)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </div>

                                                        <div className="flex items-center gap-3 mb-6 font-black text-[10px] tracking-widest text-muted-foreground/40 uppercase">
                                                            {item.type === 'TEXTO' && <Type size={14} className="text-blue-500" />}
                                                            {item.type === 'FOTO' && <Camera size={14} className="text-orange-500" />}
                                                            {item.type === 'ESBOCO' && <Palette size={14} className="text-purple-500" />}
                                                            Bloco de {item.type}
                                                        </div>

                                                        {item.type === 'TEXTO' && (
                                                            <Textarea
                                                                placeholder="Descreva os detalhes técnicos aqui..."
                                                                className="min-h-[120px] bg-transparent border-none p-0 text-base font-medium leading-relaxed resize-none focus:ring-0 focus-visible:ring-0"
                                                                value={item.content}
                                                                onChange={e => updateItemContent(item.id, e.target.value)}
                                                            />
                                                        )}

                                                        {item.type === 'FOTO' && (
                                                            <div className="space-y-4">
                                                                <div className="aspect-video rounded-3xl bg-muted/20 border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 overflow-hidden group/photo relative cursor-pointer">
                                                                    {item.content ? (
                                                                        <img src={item.content} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <>
                                                                            <Upload size={48} className="text-muted-foreground opacity-20 group-hover/photo:scale-110 group-hover/photo:text-primary transition-all" />
                                                                            <p className="text-xs font-black uppercase text-muted-foreground opacity-40">Solte a foto ou clique para colar URL</p>
                                                                        </>
                                                                    )}
                                                                </div>
                                                                <Input
                                                                    placeholder="URL da Imagem / Evidência"
                                                                    className="rounded-xl bg-muted/10 border-white/5 h-12 font-medium"
                                                                    value={item.content}
                                                                    onChange={e => updateItemContent(item.id, e.target.value)}
                                                                />
                                                            </div>
                                                        )}

                                                        {item.type === 'ESBOCO' && (
                                                            <div className="space-y-4 bg-background rounded-3xl overflow-hidden border border-white/5">
                                                                <div className="p-4 bg-muted/20 flex justify-between items-center border-b border-white/5">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Technical Canvas</span>
                                                                    <Button
                                                                        size="sm"
                                                                        className="rounded-full bg-emerald-500 h-8 px-4 text-[10px] font-black uppercase"
                                                                        onClick={() => {
                                                                            if (sketchRef.current) {
                                                                                const d = sketchRef.current.getData();
                                                                                handleSaveSketch(item.id, { image: d.image, json: d.json });
                                                                            }
                                                                        }}
                                                                    >
                                                                        Gravar Esboço
                                                                    </Button>
                                                                </div>
                                                                <div className="h-[400px]">
                                                                    <SketchCanvas ref={sketchRef} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                ))}

                                                {items.filter(i => i.type !== 'CHECKLIST').length === 0 && (
                                                    <div className="py-24 border-2 border-dashed border-white/5 rounded-[4.5rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-muted/5 transition-all" onClick={() => addItem('TEXTO')}>
                                                        <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground mb-6 group-hover:scale-110 transition-transform">
                                                            <Plus size={32} />
                                                        </div>
                                                        <h3 className="font-black text-xl mb-2 opacity-60">Nenhuma evidência capturada</h3>
                                                        <p className="text-sm text-muted-foreground max-w-xs px-6 font-medium">Use a barra de ações acima para adicionar fotos, desenhos ou textos.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-12"
                                        >
                                            <div className="space-y-4">
                                                <Badge className="bg-amber-500/10 text-amber-500 border-none text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5">Checklist de Verificação</Badge>
                                                <h2 className="text-5xl font-black tracking-tighter leading-none">Itens de Conformidade</h2>
                                                <p className="text-muted-foreground font-medium text-lg">Crie uma lista de checagem para a equipe técnica.</p>
                                            </div>

                                            <div className="space-y-6">
                                                {items.filter(i => i.type === 'CHECKLIST').map((block) => {
                                                    const subItems: ChecklistSubItem[] = JSON.parse(block.content || '[]');

                                                    const addSubItem = () => {
                                                        const updated = [...subItems, { id: Math.random().toString(36).substr(2, 6), text: '', checked: false }];
                                                        updateItemContent(block.id, JSON.stringify(updated));
                                                    };

                                                    const updateSubItem = (sId: string, text: string) => {
                                                        const updated = subItems.map(s => s.id === sId ? { ...s, text } : s);
                                                        updateItemContent(block.id, JSON.stringify(updated));
                                                    };

                                                    const toggleSubItem = (sId: string) => {
                                                        const updated = subItems.map(s => s.id === sId ? { ...s, checked: !s.checked } : s);
                                                        updateItemContent(block.id, JSON.stringify(updated));
                                                    };

                                                    const removeSubItem = (sId: string) => {
                                                        const updated = subItems.filter(s => s.id !== sId);
                                                        updateItemContent(block.id, JSON.stringify(updated));
                                                    };

                                                    return (
                                                        <Card key={block.id} className="rounded-[3.5rem] border-white/5 bg-muted/5 p-10 overflow-hidden relative group">
                                                            <div className="absolute top-8 right-8">
                                                                <Button variant="ghost" size="icon" className="rounded-full text-red-500 hover:bg-red-500/10" onClick={() => removeItem(block.id)}>
                                                                    <Trash2 size={18} />
                                                                </Button>
                                                            </div>
                                                            <div className="space-y-4">
                                                                {subItems.map((si, idx) => (
                                                                    <motion.div
                                                                        key={si.id}
                                                                        className="flex items-center gap-4 group/si"
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                    >
                                                                        <button
                                                                            onClick={() => toggleSubItem(si.id)}
                                                                            className={cn(
                                                                                "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all",
                                                                                si.checked ? "bg-emerald-500 border-emerald-500 text-white" : "bg-background border-white/10 hover:border-primary/40"
                                                                            )}
                                                                        >
                                                                            {si.checked && <Check size={14} strokeWidth={4} />}
                                                                        </button>
                                                                        <Input
                                                                            value={si.text}
                                                                            autoFocus={si.text === ''}
                                                                            onChange={e => updateSubItem(si.id, e.target.value)}
                                                                            onKeyDown={e => e.key === 'Enter' && addSubItem()}
                                                                            placeholder="Digite o item para checagem..."
                                                                            className="flex-1 bg-transparent border-none text-lg font-bold p-0 focus-visible:ring-0 shadow-none h-auto placeholder:opacity-20"
                                                                        />
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover/si:opacity-100 transition-opacity" onClick={() => removeSubItem(si.id)}>
                                                                            <X size={14} />
                                                                        </Button>
                                                                    </motion.div>
                                                                ))}
                                                                <div className="pt-4">
                                                                    <Button
                                                                        onClick={addSubItem}
                                                                        className="rounded-2xl border-2 border-dashed border-white/10 bg-transparent text-muted-foreground font-black text-[10px] uppercase tracking-widest h-14 w-full hover:bg-white/5 gap-2"
                                                                    >
                                                                        <Plus size={16} /> Novo Item de Verificação
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    );
                                                })}

                                                {items.filter(i => i.type === 'CHECKLIST').length === 0 && (
                                                    <div className="py-24 border-2 border-dashed border-white/5 rounded-[4.5rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-muted/5 transition-all" onClick={() => addItem('CHECKLIST')}>
                                                        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                            <CheckSquare size={32} />
                                                        </div>
                                                        <h3 className="font-black text-xl mb-2 opacity-60">Checklist não definido</h3>
                                                        <p className="text-sm text-muted-foreground max-w-xs px-6 font-medium">Clique aqui para criar uma lista de verificação passo-a-passo.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 4 && (
                                        <motion.div
                                            key="step4"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="space-y-12"
                                        >
                                            <div className="text-center space-y-4">
                                                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary animate-pulse shadow-lg shadow-primary/20">
                                                    <CheckCircle2 size={48} />
                                                </div>
                                                <h2 className="text-5xl font-black tracking-tighter leading-none">Protocolo Pronto</h2>
                                                <p className="text-muted-foreground font-medium text-lg mx-auto max-w-xl">
                                                    Revise as informações antes de transmitir para os departamentos técnicos.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <ReviewInfo label="Natureza" value={natureza} icon={Activity} />
                                                <ReviewInfo label="Prioridade" value={prioridade} icon={Zap} />
                                                <ReviewInfo label="Projeto" value={projects.find(p => p.id === selectedProjectId)?.nome || 'Geral'} icon={Briefcase} />
                                                <ReviewInfo label="Assunto" value={observacao} icon={Info} className="md:col-span-3" />
                                                <ReviewInfo
                                                    label="Conteúdo Capturado"
                                                    value={`${items.length} blocos de dados (${items.filter(i => i.type === 'FOTO').length} fotos, ${items.filter(i => i.type === 'ESBOCO').length} esboços)`}
                                                    icon={Layers}
                                                    className="md:col-span-3"
                                                />
                                            </div>

                                            <div className="p-8 rounded-[3.5rem] bg-muted/10 border border-white/10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                                                    <Sparkles size={32} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-black text-lg mb-1">IA Verc OS - Pronta</h4>
                                                    <p className="text-sm text-muted-foreground font-medium">Os dados serão automaticamente processados, geolocalizados e disponibilizados para triagem.</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>

                        {/* Footer Controls */}
                        <div className="p-10 lg:px-20 border-t border-white/5 bg-background/40 backdrop-blur-xl flex justify-between items-center">
                            <div className="flex gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={prevStep}
                                    disabled={step === 1}
                                    className="h-14 rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2"
                                >
                                    <ChevronLeft size={18} /> Anterior
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    className="h-14 rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest text-red-500 hover:bg-red-500/5"
                                >
                                    Cancelar
                                </Button>
                            </div>

                            <div className="flex gap-4">
                                {step < 4 ? (
                                    <Button
                                        onClick={nextStep}
                                        className="h-14 rounded-2xl px-12 font-black uppercase text-[10px] tracking-widest gap-2 bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                                    >
                                        Próximo Passo <ChevronRight size={18} />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="h-14 rounded-3xl px-16 font-black uppercase text-[11px] tracking-[0.2em] gap-3 bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all"
                                    >
                                        <Upload size={20} /> Transmitir Protocolo
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent >
        </Dialog >
    );
}

function BlockAction({ icon: Icon, label, onClick, color }: any) {
    return (
        <Button
            onClick={onClick}
            variant="ghost"
            className="flex-1 min-w-[120px] h-24 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all group"
        >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110", color)}>
                <Icon size={20} className="text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">{label}</span>
        </Button>
    )
}

function ReviewInfo({ label, value, icon: Icon, className }: any) {
    return (
        <div className={cn("bg-muted/10 p-6 rounded-3xl border border-white/5 flex items-start gap-4 hover:bg-muted/20 transition-colors", className)}>
            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary shrink-0">
                <Icon size={18} />
            </div>
            <div className="overflow-hidden">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-1 opacity-50">{label}</label>
                <p className="font-bold text-foreground text-sm truncate">{value || '-'}</p>
            </div>
        </div>
    );
}
