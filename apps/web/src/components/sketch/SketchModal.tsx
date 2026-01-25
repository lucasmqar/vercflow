import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SketchCanvas } from './SketchCanvas';
import { FileText, Save, X, Palette } from 'lucide-react';
import { useRegistros } from '@/hooks/useRegistros';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SketchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SketchModal({ isOpen, onClose }: SketchModalProps) {
    const { user } = useAuth();
    const { addRegistro, saveSketch } = useRegistros();
    const [title, setTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const canvasRef = React.useRef<{ getData: () => { json: string; image: string } | null }>(null);

    const handleGeneratePDF = async () => {
        if (!title.trim()) {
            toast.error('Dê um título/descrição ao seu esboço');
            return;
        }

        const data = canvasRef.current?.getData();
        if (!data) return;

        setIsSaving(true);
        try {
            console.log('[SketchModal] Creating record...', { authorId: user?.id, title });
            // 1. Create Record
            const newRecord = await addRegistro({
                authorId: user?.id,
                texto: title,
                type: 'ESBOCO',
                status: 'EM_TRIAGEM'
            });

            if (!newRecord?.id) throw new Error('Falha ao obter ID do novo registro');

            console.log('[SketchModal] Saving sketch for record:', newRecord.id);
            // 2. Save Sketch (Triggers PDF stub in backend)
            await saveSketch(newRecord.id, data.json, data.image);

            toast.success('Registro de esboço concluído!');
            onClose();
            setTitle('');
        } catch (error: any) {
            console.error('[SketchModal] Save Error:', error);
            toast.error(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[100vw] w-full lg:max-w-[95vw] lg:w-[1200px] h-[100dvh] lg:h-[90vh] flex flex-col p-0 overflow-hidden bg-background border-none lg:border lg:rounded-2xl shadow-2xl">
                <DialogHeader className="px-4 lg:px-8 py-4 border-b flex flex-col sm:flex-row items-center justify-between gap-4 space-y-0 bg-secondary/5">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Palette size={20} />
                        </div>
                        <div className="flex flex-col">
                            <DialogTitle className="text-lg lg:text-xl font-bold tracking-tight">Modo Esboço</DialogTitle>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground opacity-70">Registro Técnico VERCFLOW</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto lg:flex-1 lg:justify-end lg:max-w-2xl">
                        <Input
                            placeholder="Título/Local do esboço..."
                            className="w-full sm:w-64 h-11 lg:h-10 rounded-xl bg-background border-border/50 focus:ring-primary/20"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                                onClick={handleGeneratePDF}
                                disabled={isSaving}
                                className="flex-1 sm:flex-none h-11 lg:h-10 rounded-xl bg-primary hover:bg-primary/90 text-sm font-bold gap-2 px-6 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                            >
                                <FileText className="w-4 h-4" />
                                {isSaving ? 'Salvando...' : 'Finalizar PDF Timbrado'}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="h-11 w-11 lg:h-10 lg:w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 relative bg-secondary/5 overflow-hidden">
                    <SketchCanvas ref={canvasRef} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
