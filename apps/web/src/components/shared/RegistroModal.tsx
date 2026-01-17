import { useState, useEffect, useRef } from 'react';
import {
    X, Plus, Type, Palette, Camera, CheckSquare,
    Trash2, ChevronDown, ChevronUp, Save,
    Layers, Info, AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SketchCanvas } from '@/components/sketch/SketchCanvas';
import { getApiUrl } from '@/lib/api';
import { Project, Client, Record, RecordType } from '@/types';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface RegistroModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    parentRecord?: Record | null;
}

interface NewRecordItem {
    id: string; // temporary id for UI
    type: RecordType;
    content: string;
    sketchData?: any;
}

export function RegistroModal({ isOpen, onClose, onSuccess, parentRecord }: RegistroModalProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>(parentRecord?.projectId || '');
    const [selectedClientId, setSelectedClientId] = useState<string>(parentRecord?.clientId || '');
    const [natureza, setNatureza] = useState<string>(parentRecord?.natureza || 'TECNICO');
    const [prioridade, setPrioridade] = useState<string>('MEDIA');
    const [items, setItems] = useState<NewRecordItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

    const sketchRef = useRef<any>(null);

    useEffect(() => {
        if (isOpen) {
            fetchData();
            if (parentRecord) {
                // If it's a revision, start with parent items as reference if needed
                // For now, just focus on new items or blank
            }
        }
    }, [isOpen, parentRecord]);

    const fetchData = async () => {
        try {
            const [projRes, clientRes] = await Promise.all([
                fetch(getApiUrl('/api/projects')),
                fetch(getApiUrl('/api/clients'))
            ]);
            if (projRes.ok) setProjects(await projRes.ok ? await projRes.json() : []);
            if (clientRes.ok) setClients(await clientRes.ok ? await clientRes.json() : []);
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
                newItems[activeItemIndex].content = data.image; // Store image for preview
                newItems[activeItemIndex].sketchData = data.json; // Store JSON for db
                setItems(newItems);
                setActiveItemIndex(null);
                toast.success('Esboço capturado com sucesso');
            }
        }
    };

    const handleSubmit = async () => {
        if (!selectedProjectId && !selectedClientId) {
            toast.error('Selecione uma Obra ou Cliente');
            return;
        }

        if (items.length === 0) {
            toast.error('Adicione pelo menos um item ao registro');
            return;
        }

        setIsSubmitting(true);
        try {
            // Get author from session (mocking for now as we don't have full auth context yet)
            const authorId = 'clt0000000000000000000000'; // Real system would take this from context

            const payload = {
                authorId,
                projectId: selectedProjectId || null,
                clientId: selectedClientId || null,
                natureza,
                prioridade,
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
                toast.success('Registro criado com sucesso');
                setItems([]);
                onSuccess?.();
                onClose();
            } else {
                toast.error('Erro ao salvar registro');
            }
        } catch (e) {
            toast.error('Erro de conexão com o servidor');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden bg-background border-none shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b bg-secondary/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <Plus className="text-primary" size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Novo Registro Técnico</DialogTitle>
                            {parentRecord && (
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <Layers size={12} />
                                    <span>Revisão do Registro <strong>{parentRecord.refCodigo}</strong></span>
                                </div>
                            )}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X size={20} />
                    </Button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Metadata & Items List */}
                    <div className="w-1/3 border-r bg-muted/20 flex flex-col">
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-6">
                                {/* Obra/Cliente Selection */}
                                <div className="space-y-4">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contexto</Label>
                                    <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                                        <SelectTrigger className="rounded-xl border-none bg-background shadow-sm">
                                            <SelectValue placeholder="Selecionar Obra" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projects.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={natureza} onValueChange={setNatureza}>
                                        <SelectTrigger className="rounded-xl border-none bg-background shadow-sm">
                                            <SelectValue placeholder="Natureza" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['TECNICO', 'ORCAMENTO', 'FINANCEIRO', 'VISTORIA', 'RECLAMACAO'].map(n => (
                                                <SelectItem key={n} value={n}>{n}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator />

                                {/* Items Added */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conteúdo ({items.length})</Label>
                                    </div>

                                    {items.length === 0 ? (
                                        <div className="text-center py-8 px-4 border-2 border-dashed rounded-2xl bg-background/50">
                                            <Info className="mx-auto mb-2 text-muted-foreground" size={24} />
                                            <p className="text-sm text-muted-foreground">Adicione itens usando os botões abaixo para compor o registro.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {items.map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className={cn(
                                                        "group p-3 rounded-xl border transition-all cursor-pointer",
                                                        activeItemIndex === index ? "border-primary bg-primary/5 shadow-md" : "bg-background hover:border-muted-foreground/30"
                                                    )}
                                                    onClick={() => setActiveItemIndex(index)}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            {item.type === 'TEXTO' && <Type size={14} className="text-blue-500" />}
                                                            {item.type === 'ESBOCO' && <Palette size={14} className="text-purple-500" />}
                                                            {item.type === 'FOTO' && <Camera size={14} className="text-orange-500" />}
                                                            <span className="text-xs font-medium">{item.type}</span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive"
                                                            onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                                                        >
                                                            <Trash2 size={12} />
                                                        </Button>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground line-clamp-2 italic">
                                                        {item.content || 'Sem conteúdo...'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>

                        {/* Quick Actions at Bottom */}
                        <div className="p-4 bg-background border-t space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <Button variant="outline" size="sm" onClick={() => addItem('TEXTO')} className="rounded-xl gap-2 text-xs">
                                    <Type size={14} /> Texto
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => addItem('ESBOCO')} className="rounded-xl gap-2 text-xs">
                                    <Palette size={14} /> Esboço
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => addItem('FOTO')} className="rounded-xl gap-2 text-xs">
                                    <Camera size={14} /> Foto
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Focused Item Editor */}
                    <div className="flex-1 bg-background relative flex flex-col shadow-inner">
                        {activeItemIndex !== null ? (
                            <div className="flex-1 flex flex-col p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Badge variant="outline" className="px-3 py-1 rounded-lg">
                                        Item #{activeItemIndex + 1}: {items[activeItemIndex].type}
                                    </Badge>
                                    {items[activeItemIndex].type === 'ESBOCO' && (
                                        <Button size="sm" onClick={handleSaveSketch} className="gap-2 rounded-xl">
                                            <Save size={16} /> Capturar Esboço
                                        </Button>
                                    )}
                                </div>

                                <div className="flex-1 overflow-hidden rounded-2xl border shadow-sm">
                                    {items[activeItemIndex].type === 'TEXTO' && (
                                        <Textarea
                                            placeholder="Descreva aqui os detalhes técnicos..."
                                            className="h-full w-full border-none resize-none p-6 text-lg focus-visible:ring-0"
                                            value={items[activeItemIndex].content}
                                            onChange={(e) => updateItemContent(activeItemIndex, e.target.value)}
                                        />
                                    )}
                                    {items[activeItemIndex].type === 'ESBOCO' && (
                                        <SketchCanvas ref={sketchRef} />
                                    )}
                                    {items[activeItemIndex].type === 'FOTO' && (
                                        <div className="h-full flex flex-col items-center justify-center p-8 bg-muted/10">
                                            <div className="w-full max-w-sm aspect-video border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 bg-background">
                                                <div className="bg-primary/5 p-6 rounded-full">
                                                    <Camera className="text-primary/40" size={48} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-medium">Webcam or File</p>
                                                    <p className="text-xs text-muted-foreground mt-1">Integração com câmera de campo</p>
                                                </div>
                                                <Input
                                                    placeholder="URL da imagem (simulação)"
                                                    className="max-w-[250px] mt-4"
                                                    value={items[activeItemIndex].content}
                                                    onChange={(e) => updateItemContent(activeItemIndex, e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                                    <Layers className="text-primary/20" size={48} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Composição do Registro</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    Selecione um item da lista lateral para editar ou adicione um novo elemento para compor seu relatório técnico de campo.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Global Footer */}
                <div className="p-6 border-t flex items-center justify-between bg-background">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Obra Selecionada</span>
                            <span className="text-sm font-medium">
                                {projects.find(p => p.id === selectedProjectId)?.nome || 'Nenhuma selecionada'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose} className="rounded-xl">Cancelar</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || items.length === 0}
                            className="rounded-xl px-8 shadow-lg shadow-primary/20"
                        >
                            {isSubmitting ? 'Salvando...' : 'Finalizar Registro'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
