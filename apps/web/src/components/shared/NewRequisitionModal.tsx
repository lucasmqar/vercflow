import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppFlow } from '@/store/useAppFlow';
import { toast } from 'sonner';
import { Package, Plus } from 'lucide-react';
import { DepartmentRequest } from '@/store/useAppFlow';

interface NewRequisitionModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId?: string; // Optional context, if opened from a Project
}

export function NewRequisitionModal({ isOpen, onClose, projectId }: NewRequisitionModalProps) {
    const { createRequest, projects } = useAppFlow();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA'>('MEDIA');

    // If projectId is not passed, maybe allow selecting from active projects?
    // For now, let's assume it's mostly used in context. If not, we could add a selector.
    const project = projects.find(p => p.id === projectId);

    const handleSubmit = () => {
        if (!title || !description) {
            toast.error("Preencha título e descrição.");
            return;
        }

        createRequest({
            title,
            description,
            priority,
            fromDepartment: 'ENGENHARIA', // Usually starts from Engineering/Field
            toDepartment: 'COMPRAS',
            type: 'MATERIAL_PURCHASE',
            projectId: projectId,
            status: 'PENDENTE'
        } as any);

        toast.success("Requisição criada com sucesso!");
        setTitle('');
        setDescription('');
        setPriority('MEDIA');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg rounded-[2rem] border-white/10 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Package size={20} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black tracking-tight">Nova Requisição</DialogTitle>
                            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                {project ? `Para: ${project.nome}` : 'Solicitação de Material'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">O que você precisa?</label>
                        <Input
                            placeholder="Ex: 50 sacos de Cimento CP-II"
                            className="h-11 rounded-xl font-bold bg-muted/20"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detalhamento / Justificativa</label>
                        <Textarea
                            placeholder="Especifique marca, aplicação ou urgência..."
                            className="min-h-[100px] rounded-2xl bg-muted/20 resize-none"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prioridade</label>
                            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                                <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/40 font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BAIXA">Baixa</SelectItem>
                                    <SelectItem value="MEDIA">Média (Padrão)</SelectItem>
                                    <SelectItem value="ALTA">Alta</SelectItem>
                                    <SelectItem value="CRITICA">Crítica (Para Obra)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* More fields can be added here like Date Needed */}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold uppercase text-xs">Cancelar</Button>
                    <Button onClick={handleSubmit} className="rounded-xl font-black uppercase text-xs tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Plus size={16} className="mr-2" /> Criar Requisição
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
