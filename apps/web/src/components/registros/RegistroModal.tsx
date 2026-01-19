import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { SketchCanvas } from '@/components/sketch/SketchCanvas';
import {
    PenTool,
    FileText,
    Tags,
    AlertCircle,
    Save,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface RegistroModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

export function RegistroModal({ isOpen, onClose, onSave }: RegistroModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('text');

    const handleSave = async () => {
        if (!title) {
            toast.error('O título é obrigatório');
            return;
        }

        setIsSaving(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        onSave({
            title,
            description,
            tags: tags.split(',').map(t => t.trim()),
            type: activeTab === 'sketch' ? 'sketch' : 'note',
            createdAt: new Date().toISOString(),
        });

        setIsSaving(false);
        toast.success('Registro salvo com sucesso!');
        onClose();

        // Reset form
        setTitle('');
        setDescription('');
        setTags('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden glass-strong">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                            <Plus className="h-4 w-4 text-primary-foreground" />
                        </div>
                        Novo Registro Universal
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6">
                    {/* Title and Obra Area */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título do Registro</Label>
                            <Input
                                id="title"
                                placeholder="Ex: Verificação de ferragem - Bloco A"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-muted/30"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                            <div className="relative">
                                <Tags className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="tags"
                                    placeholder="ferragem, nivel 12, inspeção"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="pl-9 bg-muted/30"
                                />
                            </div>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-muted/30">
                            <TabsTrigger value="text" className="gap-2">
                                <FileText size={16} />
                                Notas de Texto
                            </TabsTrigger>
                            <TabsTrigger value="sketch" className="gap-2">
                                <PenTool size={16} />
                                Esboço / Desenho
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-4 h-[55vh]">
                            <TabsContent value="text" className="h-full m-0">
                                <RichTextEditor
                                    content={description}
                                    onChange={setDescription}
                                    placeholder="Descreva aqui os detalhes da verificação, ocorrência ou anotação..."
                                />
                            </TabsContent>
                            <TabsContent value="sketch" className="h-full m-0">
                                <SketchCanvas onSave={(img) => console.log('Image saved', img)} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                <DialogFooter className="p-6 pt-2 bg-muted/10 border-t border-border/50">
                    <Button variant="ghost" onClick={onClose} disabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="gap-2 px-8 shadow-glow">
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Salvar Registro
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Simple Plus icon as I forgot to import it
function Plus({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
}
