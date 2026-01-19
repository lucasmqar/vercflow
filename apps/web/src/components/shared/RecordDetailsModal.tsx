import React from 'react';
import {
    X, FileText, User, Building2,
    Calendar, Tag, Palette, Download,
    Hash, Clock, ExternalLink, CheckSquare, Square
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Record } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getApiUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useRegistros } from '@/hooks/useRegistros';
import { Trash2 } from 'lucide-react';

interface RecordDetailsModalProps {
    record: Record | null;
    isOpen: boolean;
    onClose: () => void;
}

export function RecordDetailsModal({ record: initialRecord, isOpen, onClose }: RecordDetailsModalProps) {
    const { deleteRegistro, updateRecordItem, registros } = useRegistros();

    const record = registros.find(r => r.id === initialRecord?.id) || initialRecord;

    if (!record) return null;

    const handleDownload = (url: string) => {
        const cacheBuster = `t=${Date.now()}`;
        const finalUrl = url.includes('?') ? `${url}&${cacheBuster}` : `${url}?${cacheBuster}`;
        const link = document.createElement('a');
        link.href = finalUrl;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async () => {
        if (confirm('Tem certeza que deseja excluir permanentemente este registro técnico?')) {
            await deleteRegistro(record.id);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col overflow-hidden bg-background/95 backdrop-blur-2xl border border-border/40 shadow-2xl rounded-xl">
                <DialogTitle className="sr-only">Detalhes do Registro {record.refCodigo}</DialogTitle>

                {/* Technical Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-muted/20 backdrop-blur-md">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-0.5">Identificador</span>
                            <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-foreground/60"><Hash size={11} className="opacity-40" /> {record.refCodigo}</span>
                        </div>
                        <div className="w-[1px] h-8 bg-border/40" />
                        <div className="flex flex-col">
                            <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-0.5">Sincronismo</span>
                            <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-foreground/60"><Clock size={11} className="opacity-40" /> {format(new Date(record.criadoEm), "dd/MM/yy HH:mm")}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-md text-[10px] gap-2 font-bold uppercase tracking-wider text-destructive/60 hover:text-destructive hover:bg-destructive/10 px-3"
                            onClick={handleDelete}
                        >
                            <Trash2 size={13} /> Excluir
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-md text-[10px] gap-2 font-bold uppercase tracking-wider border-border/60 hover:bg-muted/50 px-3"
                            onClick={() => handleDownload(getApiUrl(`/api/records/${record.id}/pdf-view`))}
                        >
                            <FileText size={13} /> Exportar PDF
                        </Button>
                        <div className="w-[1px] h-6 bg-border/40 mx-1" />
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-md hover:bg-muted/50">
                            <X size={18} className="opacity-60" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <div className="max-w-[700px] mx-auto py-12 px-8 space-y-12">
                        {/* Title & Status - Technical Hierarchy */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Badge variant="outline" className="rounded-md font-mono text-[10px] font-black uppercase tracking-[0.2em] border-primary/20 text-primary px-2 bg-primary/5">Relatório Técnico Operacional</Badge>
                                <h2 className="text-3xl font-black tracking-tight text-foreground/90 leading-tight">
                                    {record.texto?.split('\n')[0] || 'Captura de Campo sem Título'}
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/40">
                                    <Tag size={12} className="text-muted-foreground/60" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">{record.natureza || 'Geral'}</span>
                                </div>

                                <div className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border",
                                    record.prioridade === 'CRITICA' ? 'bg-red-500/10 border-red-500/20 text-red-600 shadow-[0_0_10px_rgba(239,68,68,0.1)]' :
                                        record.prioridade === 'ALTA' ? 'bg-orange-500/10 border-orange-500/20 text-orange-600' :
                                            'bg-blue-500/10 border-blue-500/20 text-blue-600'
                                )}>
                                    <div className={cn("w-1.5 h-1.5 rounded-full",
                                        record.prioridade === 'CRITICA' ? 'bg-red-500' :
                                            record.prioridade === 'ALTA' ? 'bg-orange-500' : 'bg-blue-500'
                                    )} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{record.prioridade} priority</span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20 text-primary">
                                    <CheckSquare size={12} className="opacity-70" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{record.status} phase</span>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Grid - Premium Card Style */}
                        <div className="grid grid-cols-2 gap-px bg-border/40 rounded-xl overflow-hidden border border-border/40 shadow-sm">
                            <div className="p-5 bg-background/50 flex flex-col gap-1.5">
                                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 block">Responsável Técnico</span>
                                <div className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black uppercase">
                                        {record.author?.nome?.charAt(0)}
                                    </div>
                                    {record.author?.nome}
                                </div>
                            </div>
                            <div className="p-5 bg-background/50 flex flex-col gap-1.5">
                                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 block">Projeto / Ativo</span>
                                <div className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                    <Building2 size={16} className="text-primary/60" />
                                    {record.project?.nome || 'Operação Inbox'}
                                </div>
                            </div>
                            <div className="p-5 bg-background/50 flex flex-col gap-1.5">
                                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 block">Data de Referência</span>
                                <div className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                    <Calendar size={16} className="text-primary/60" />
                                    {format(new Date(record.criadoEm), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                </div>
                            </div>
                            <div className="p-5 bg-background/50 flex flex-col gap-1.5">
                                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 block">UUID de Auditoria</span>
                                <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/60 break-all leading-tight">
                                    {record.id}
                                </div>
                            </div>
                        </div>

                        {/* Document Content */}
                        <div className="space-y-10 pt-4">
                            {record.texto && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-[1px] bg-primary/30" />
                                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Observações Operacionais</span>
                                    </div>
                                    <div className="relative pl-6">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                                        <p className="text-base leading-[1.7] text-foreground/80 whitespace-pre-wrap font-medium">
                                            {record.texto}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Blocks Stream - Technical Feed */}
                            <div className="space-y-16">
                                {record.items?.map((item, idx) => (
                                    <div key={item.id} className="space-y-5 relative group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-center font-mono text-[11px] font-black text-foreground/40">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-[9px] font-black uppercase tracking-widest text-primary/60">Componente Técnico</span>
                                                    <span className="font-mono text-[10px] font-bold text-muted-foreground/60 uppercase">block.engine.{item.type}</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 rounded-md text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/20"
                                                onClick={() => handleDownload(getApiUrl(`/api/records/${record.id}/pdf-view?itemId=${item.id}`))}
                                            >
                                                Exportar <ExternalLink size={12} className="ml-2" />
                                            </Button>
                                        </div>

                                        <div className="pl-12">
                                            {item.type === 'FOTO' ? (
                                                <div className="relative group/photo overflow-hidden rounded-xl border border-border/40 shadow-sm bg-muted/5">
                                                    <img src={item.content} alt={`Technical Image ${idx + 1}`} className="w-full object-contain max-h-[500px] transition-transform duration-500 group-hover/photo:scale-[1.02]" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-end p-4">
                                                        <Button className="h-8 rounded-lg text-[10px] font-bold gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20">
                                                            <Download size={12} /> Baixar Original
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : item.type === 'ESBOCO' ? (
                                                <div className="flex flex-col items-center justify-center py-16 bg-muted/20 rounded-xl border border-dashed border-border/60 hover:border-primary/30 transition-colors">
                                                    <Palette className="w-10 h-10 text-primary/20 mb-3" />
                                                    <span className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-foreground/30">Vector Sketch Data Payload</span>
                                                    <Button variant="ghost" size="sm" className="mt-4 text-[10px] font-bold gap-2 text-primary/60">
                                                        Visualizar Camadas <ExternalLink size={10} />
                                                    </Button>
                                                </div>
                                            ) : item.type === 'CHECKLIST' ? (
                                                <div className={cn(
                                                    "flex items-start gap-4 p-5 rounded-xl border transition-all duration-300",
                                                    item.checked ? "bg-primary/[0.02] border-primary/20" : "bg-muted/30 border-border/40 hover:border-border"
                                                )}>
                                                    <button
                                                        onClick={() => updateRecordItem(item.id, !item.checked)}
                                                        className={cn(
                                                            "mt-0.5 transition-all duration-300",
                                                            item.checked ? "text-primary scale-110" : "text-muted-foreground/40 hover:text-primary/60"
                                                        )}
                                                    >
                                                        {item.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                                                    </button>
                                                    <div className="flex flex-col gap-1">
                                                        <span className={cn(
                                                            "text-[14px] font-bold tracking-tight transition-all duration-300 leading-relaxed",
                                                            item.checked ? "text-muted-foreground/60 line-through decoration-primary/40" : "text-foreground/80"
                                                        )}>
                                                            {item.content}
                                                        </span>
                                                        {item.checked && (
                                                            <span className="text-[10px] font-mono font-black text-primary/40 uppercase tracking-widest">Verificado</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="glass-card p-6 rounded-xl border border-border/40 relative">
                                                    <div className="absolute -left-1 top-6 w-2 h-2 bg-primary/40 rounded-full" />
                                                    <p className="text-[14px] leading-relaxed text-foreground/70 font-medium italic">
                                                        "{item.content}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Sketch Technical Preview - Technical Dark Mode Aesthetic */}
                            {record.sketch && (
                                <div className="space-y-6 pt-10 border-t border-border/40">
                                    <div className="flex items-center gap-3">
                                        <Palette size={14} className="text-primary/70" />
                                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Technical CAD Interface Preview</span>
                                    </div>
                                    <div className="p-1 rounded-xl bg-zinc-950 border border-border/60 shadow-2xl relative group/sketch overflow-hidden">
                                        {record.sketch.imageUrl && record.sketch.imageUrl !== 'data:image/png;base64,placeholder' ? (
                                            <img
                                                src={record.sketch.imageUrl}
                                                alt="Vector Viewport Preview"
                                                className="w-full rounded-lg grayscale contrast-[1.4] brightness-90 opacity-80 group-hover/sketch:opacity-100 transition-all duration-700"
                                            />
                                        ) : (
                                            <div className="py-24 flex flex-col items-center justify-center gap-4 bg-zinc-900/50 rounded-lg">
                                                <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center animate-pulse">
                                                    <div className="w-6 h-6 rounded-full border border-primary/40" />
                                                </div>
                                                <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
                                                    Buffer Payload: {JSON.parse(record.sketch.dataJson).objects?.length || 0} Entities
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-[9px] font-mono text-white/60">LAYER: TECHNICAL</Badge>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Technical Footnote */}
                <div className="px-6 py-2.5 border-t border-border/40 bg-muted/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">Vercflow Ops // Engine 4.0</span>
                        <div className="w-1 h-1 rounded-full bg-border/40" />
                        <span className="font-mono text-[10px] font-bold text-muted-foreground/30 uppercase">Build 2026.01.v1</span>
                    </div>
                    <span className="font-mono text-[9px] font-black text-primary/40 uppercase tracking-widest">Classified Internal Use Only</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
