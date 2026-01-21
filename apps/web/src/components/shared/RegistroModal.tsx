import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import {
    X, Plus, Type, Palette, Camera,
    Trash2, Save, Layers, Info, Hash,
    Briefcase, Activity, Zap, ClipboardList,
    Image as ImageIcon, CheckSquare
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { SketchCanvas } from '@/components/sketch/SketchCanvas';
import { getApiUrl } from '@/lib/api';
import { ShaderAnimation } from '@/components/ui/ShaderAnimation';
import { Project, Client, Record, RecordType } from '@/types';
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
    content: string;
    sketchData?: any;
}

export function RegistroModal({ isOpen, onClose, onSuccess, parentRecord }: RegistroModalProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>(parentRecord?.projectId || 'none');
    const [natureza, setNatureza] = useState<string>(parentRecord?.natureza || 'TECNICO');
    const [prioridade, setPrioridade] = useState<string>('MEDIA');
    const [observacao, setObservacao] = useState<string>(parentRecord?.texto || '');
    const [items, setItems] = useState<NewRecordItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
    const [showRefinement, setShowRefinement] = useState(false);

    const sketchRef = useRef<any>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
            content: '',
        };
        setItems([...items, newItem]);
        setActiveItemIndex(items.length);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
        if (activeItemIndex === index) setActiveItemIndex(null);
        else if (activeItemIndex !== null && activeItemIndex > index) setActiveItemIndex(activeItemIndex - 1);
    };

    const updateItemContent = (index: number, content: string) => {
        const newItems = [...items];
        newItems[index].content = content;
        setItems(newItems);
    };

    const handleSaveSketch = () => {
        if (sketchRef.current && activeItemIndex !== null) {
            const data = sketchRef.current.getData();
            if (data) {
                const newItems = [...items];
                newItems[activeItemIndex].content = data.image;
                newItems[activeItemIndex].sketchData = data.json;
                setItems(newItems);
                setActiveItemIndex(null);
                toast.success('Esboço capturado');
            }
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const user = useAuth.getState().user;
            console.log('Current user from auth:', user);

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

            console.log('Sending payload:', payload);

            const res = await fetch(getApiUrl('/api/records'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success('Registro finalizado');
                setItems([]);
                onSuccess?.();
                onClose();
            } else {
                const errorData = await res.json();
                console.error('API Error:', errorData);
                toast.error(errorData.error || 'Erro ao salvar');
            }
        } catch (e) {
            console.error('Request Error:', e);
            toast.error('Erro de conexão');
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasContent = items.length > 0 || observacao.trim().length > 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[1000px] h-[85vh] p-0 overflow-hidden bg-background border border-border/40 shadow-2xl flex flex-col rounded-[4px]">
                <DialogTitle className="sr-only">Novo Registro de Campo</DialogTitle>
                <div className="flex items-center justify-between px-6 py-3 border-b bg-background shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[8px] bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <Plus size={18} strokeWidth={3} />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm tracking-tight leading-none">Novo Registro</h2>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground opacity-70">Captura Técnica de Campo</span>
                        </div>
                        {parentRecord && (
                            <Badge variant="secondary" className="font-mono text-[9px] h-5 ml-2 bg-muted/50 text-muted-foreground border-transparent">
                                REF: {parentRecord.refCodigo}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-7 text-[10px] font-bold uppercase tracking-wider gap-1.5 px-2",
                                showRefinement ? "text-primary bg-primary/5" : "text-muted-foreground"
                            )}
                            onClick={() => setShowRefinement(!showRefinement)}
                        >
                            <Layers size={12} /> {showRefinement ? "Ocultar Detalhes" : "Refinar Depois"}
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !hasContent}
                            size="sm"
                            className="h-7 rounded-[4px] px-4 text-xs font-bold gap-2"
                        >
                            <Save size={14} /> Finalizar
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden relative">
                    {/* Compact Sidebar for Meta - Floating/Optional */}
                    <AnimatePresence>
                        {showRefinement && (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 256, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="border-r bg-muted/10 flex flex-col overflow-hidden shrink-0"
                            >
                                <div className="w-64 p-4 space-y-5">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="font-mono text-[9px] uppercase font-bold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                                                <Briefcase size={10} /> Projeto / Obra
                                            </label>
                                            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                                                <SelectTrigger className="h-8 rounded-[4px] border-border/40 bg-background text-xs">
                                                    <SelectValue placeholder="Opcional" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-[4px]">
                                                    <SelectItem value="none" className="text-xs italic opacity-50">(Nenhum Projeto)</SelectItem>
                                                    {projects.map(p => (
                                                        <SelectItem key={p.id} value={p.id} className="text-xs">{p.nome}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="font-mono text-[9px] uppercase font-bold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                                                <Activity size={10} /> Natureza
                                            </label>
                                            <Select value={natureza} onValueChange={setNatureza}>
                                                <SelectTrigger className="h-8 rounded-[4px] border-border/40 bg-background text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-[4px]">
                                                    {['TECNICO', 'ORCAMENTO', 'VISTORIA', 'FINANCEIRO'].map(n => (
                                                        <SelectItem key={n} value={n} className="text-xs">{n}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="font-mono text-[9px] uppercase font-bold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                                                <Zap size={10} /> Prioridade
                                            </label>
                                            <Select value={prioridade} onValueChange={setPrioridade}>
                                                <SelectTrigger className="h-8 rounded-[4px] border-border/40 bg-background text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-[4px]">
                                                    {['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'].map(p => (
                                                        <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submitting Overlay */}
                    {isSubmitting && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-white bg-black">
                            <ShaderAnimation />
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
                                <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin mb-8" />
                                <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">Verc Formalize</h2>
                                <p className="text-[9px] font-black opacity-60 tracking-[0.4em] uppercase">Protocolando Registro Técnico...</p>
                            </div>
                        </div>
                    )}

                    {/* Main Editor Surface */}
                    <div className="flex-1 flex flex-col bg-background">
                        <ScrollArea className="flex-1">
                            <div className="max-w-[700px] mx-auto py-12 px-8 space-y-8">
                                {/* Large Title-like Textarea */}
                                <div className="group relative">
                                    <div className="absolute -left-10 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ClipboardList className="text-muted-foreground/30" size={18} />
                                    </div>
                                    <Textarea
                                        ref={textareaRef}
                                        placeholder="Digite as observações principais aqui..."
                                        className="min-h-[60px] w-full border-none resize-none p-0 text-2xl font-bold focus-visible:ring-0 placeholder:opacity-20 bg-transparent"
                                        value={observacao}
                                        onChange={(e) => setObservacao(e.target.value)}
                                    />
                                </div>

                                {/* Dynamic Blocks List */}
                                <div className="space-y-4 pt-4">
                                    {items.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "group relative border-l-2 pl-6 transition-all",
                                                activeItemIndex === index ? "border-primary" : "border-transparent hover:border-muted-foreground/20"
                                            )}
                                            onClick={() => setActiveItemIndex(index)}
                                        >
                                            {/* Block Controls */}
                                            <div className="absolute -left-8 top-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-[2px] text-destructive hover:bg-destructive/10"
                                                    onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                                                >
                                                    <Trash2 size={12} />
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-2 mb-2 font-mono text-[9px] uppercase font-bold text-muted-foreground/50">
                                                {item.type === 'TEXTO' && <Type size={10} />}
                                                {item.type === 'FOTO' && <Camera size={10} />}
                                                {item.type === 'ESBOCO' && <Palette size={10} />}
                                                {item.type === 'CHECKLIST' && <CheckSquare size={10} />}
                                                Block {index + 1} // {item.type}
                                            </div>

                                            <div className="bg-muted/5 rounded-[2px] border border-border/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
                                                {item.type === 'TEXTO' && (
                                                    <Textarea
                                                        autoFocus
                                                        placeholder="Detalhes adicionais..."
                                                        className="min-h-[80px] w-full border-none resize-none p-3 text-sm focus-visible:ring-0 bg-transparent"
                                                        value={item.content}
                                                        onChange={(e) => updateItemContent(index, e.target.value)}
                                                    />
                                                )}
                                                {item.type === 'ESBOCO' && (
                                                    <div className="bg-background">
                                                        <div className="flex justify-between items-center px-3 py-1 border-b bg-muted/20">
                                                            <span className="font-mono text-[8px] uppercase opacity-50">Technical Canvas</span>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-6 text-[10px] font-bold gap-1.5"
                                                                onClick={handleSaveSketch}
                                                            >
                                                                <Save size={10} /> Gravar
                                                            </Button>
                                                        </div>
                                                        <div className="h-[300px]">
                                                            <SketchCanvas ref={sketchRef} />
                                                        </div>
                                                    </div>
                                                )}
                                                {item.type === 'FOTO' && (
                                                    <div className="p-4 flex flex-col gap-3 items-center justify-center bg-muted/5 min-h-[150px]">
                                                        {item.content ? (
                                                            <img src={item.content} className="max-w-full h-auto rounded-[2px] border" />
                                                        ) : (
                                                            <ImageIcon className="opacity-10" size={40} />
                                                        )}
                                                        <Input
                                                            placeholder="URL da foto..."
                                                            className="h-7 rounded-[2px] text-xs border-border/40 max-w-[300px]"
                                                            value={item.content}
                                                            onChange={(e) => updateItemContent(index, e.target.value)}
                                                        />
                                                    </div>
                                                )}\n                                                {item.type === 'CHECKLIST' && (
                                                    <div className="flex items-center gap-3 p-3 bg-muted/5 group/checkitem transition-all hover:bg-muted/10">
                                                        <div className="flex-shrink-0 w-5 h-5 rounded-[4px] border-2 border-primary/40 flex items-center justify-center bg-background group-focus-within/checkitem:border-primary transition-colors">
                                                            <div className="w-2.5 h-2.5 rounded-[1px] bg-primary opacity-20" />
                                                        </div>
                                                        <Input
                                                            autoFocus
                                                            placeholder="Item do checklist..."
                                                            className="h-8 border-none shadow-none focus-visible:ring-0 bg-transparent text-sm p-0 font-medium placeholder:opacity-30"
                                                            value={item.content}
                                                            onChange={(e) => updateItemContent(index, e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    if (item.content.trim()) {
                                                                        addItem('CHECKLIST');
                                                                    }
                                                                } else if (e.key === 'Backspace' && !item.content && items.length > 1) {
                                                                    e.preventDefault();
                                                                    removeItem(index);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {items.length === 0 && (
                                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-20 hover:opacity-40 transition-opacity cursor-pointer border-2 border-dashed border-muted-foreground/20 rounded-[4px]" onClick={() => addItem('TEXTO')}>
                                            <Plus size={32} strokeWidth={1} />
                                            <div className="font-mono text-[10px] uppercase font-bold mt-2">Clique para adicionar bloco de nota</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>

                        {/* Quick Action Footer for Blocks */}
                        <div className="p-4 border-t bg-muted/5 flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addItem('TEXTO')}
                                className="h-9 rounded-full gap-2 text-xs border-border/40 bg-background px-6 shadow-sm hover:scale-105 transition-transform"
                            >
                                <Type size={14} className="text-blue-500" /> Texto
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addItem('FOTO')}
                                className="h-9 rounded-full gap-2 text-xs border-border/40 bg-background px-6 shadow-sm hover:scale-105 transition-transform"
                            >
                                <Camera size={14} className="text-orange-500" /> Foto
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addItem('ESBOCO')}
                                className="h-9 rounded-full gap-2 text-xs border-border/40 bg-background px-6 shadow-sm hover:scale-105 transition-transform"
                            >
                                <Palette size={14} className="text-purple-500" /> Esboço
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addItem('CHECKLIST')}
                                className="h-9 rounded-full gap-2 text-xs border-border/40 bg-background px-6 shadow-sm hover:scale-105 transition-transform"
                            >
                                <CheckSquare size={14} className="text-emerald-500" /> Checklist
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Micro Status Bar */}
                <div className="h-6 border-t bg-muted/30 flex items-center px-4 justify-between font-mono text-[8px] text-muted-foreground/60">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Hash size={8} /> ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                        <span>STATUS: EDITING</span>
                        <span>AUTH: {useAuth.getState().user?.nome || 'UNKNOWN'}</span>
                    </div>
                    <div>
                        COMMANDS: [CMD+ENTER] SAVE | [ESC] EXIT
                    </div>
                </div>
            </DialogContent >
        </Dialog >
    );
}
