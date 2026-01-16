import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  ListChecks,
  MoreHorizontal,
  ChevronRight,
  FileText,
  Palette,
  Eye,
  UserPlus,
  Building2,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRegistros } from '@/hooks/useRegistros';
import { Record, Professional, Project } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from 'sonner';

const columnsConfig = [
  { id: 'EM_TRIAGEM', title: 'Análise', icon: AlertCircle, color: 'text-info' },
  { id: 'RASCUNHO', title: 'Novos', icon: Clock, color: 'text-warning' },
  { id: 'PLANEJADO', title: 'Planejado', icon: ListChecks, color: 'text-primary' },
  { id: 'EXECUTANDO', title: 'Em Execução', icon: MoreHorizontal, color: 'text-accent' },
  { id: 'CONVERTIDO', title: 'Concluído', icon: CheckCircle2, color: 'text-success' },
  { id: 'ARQUIVADO', title: 'Arquivado', icon: Eye, color: 'text-muted-foreground opacity-50' },
];

export function TriagemDashboard() {
  const { registros, fetchRegistros, updateRegistroStatus, convertRegistro } = useRegistros();
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Form State for Conversion
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [targetProjectId, setTargetProjectId] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    fetchRegistros();
    loadContextData();
  }, []);

  const loadContextData = async () => {
    try {
      const [pRes, projRes] = await Promise.all([
        fetch('http://localhost:4000/api/professionals'),
        fetch('http://localhost:4000/api/projects')
      ]);
      if (pRes.ok) setProfessionals(await pRes.json());
      if (projRes.ok) setProjects(await projRes.json());
    } catch (e) {
      console.error('Context data error', e);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination, source } = result;
    if (destination.droppableId !== source.droppableId) {
      updateRegistroStatus(draggableId, destination.droppableId);
    }
  };

  const handleFormalize = async () => {
    if (!selectedRecord) return;
    if (!targetProjectId) {
      toast.error('Selecione uma obra para formalizar');
      return;
    }

    setIsConverting(true);
    try {
      await convertRegistro(selectedRecord.id, {
        titulo: selectedRecord.texto || 'Atividade de Obra',
        descricao: `Convertido de Registro/Esboço #${selectedRecord.id}`,
        projectId: targetProjectId,
        professionalId: assigneeId || null,
        valorPrevisto: 0
      });
      toast.success('Registro formalizado com sucesso! Veja na aba de Tarefas.');
      setSelectedRecord(null);
    } catch (e: any) {
      toast.error(`Erro ao formalizar: ${e.message || 'Erro desconhecido'}`);
      console.error(e);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 h-[calc(100vh-64px)] flex flex-col bg-secondary/10 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter">Triagem & Formalização</h1>
          <p className="text-muted-foreground text-sm font-medium">Pipeline de análise e conversão de registros operacionais</p>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full overflow-x-auto pb-4 custom-scrollbar">
            {columnsConfig.map((col) => {
              const Icon = col.icon;
              const items = registros.filter(r => r.status === col.id);

              return (
                <div key={col.id} className="w-80 flex flex-col h-full bg-secondary/40 rounded-3xl border border-border/50 overflow-hidden flex-shrink-0">
                  {/* Column Header */}
                  <div className="p-4 flex items-center justify-between border-b border-border/50 bg-background/30">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1.5 rounded-lg bg-background shadow-sm", col.color)}>
                        <Icon size={16} />
                      </div>
                      <span className="text-sm font-bold tracking-tight">{col.title}</span>
                    </div>
                    <Badge variant="secondary" className="bg-background/50 rounded-lg">{items.length}</Badge>
                  </div>

                  {/* Droppable wrapper fix to avoid nested scroll issue */}
                  <div className="flex-1 min-h-0 flex flex-col">
                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={cn(
                            "flex-1 p-3 space-y-3 overflow-y-auto transition-colors custom-scrollbar",
                            snapshot.isDraggingOver ? "bg-primary/5" : ""
                          )}
                        >
                          {items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => {
                                    setSelectedRecord(item);
                                    setTargetProjectId(item.projectId || '');
                                  }}
                                  className={cn(
                                    "bg-background p-4 rounded-2xl border border-border/60 shadow-sm group hover:border-primary/40 transition-all cursor-pointer",
                                    snapshot.isDragging ? "shadow-xl border-primary scale-105 z-50" : ""
                                  )}
                                >
                                  {item.type === 'ESBOCO' && (
                                    <div className="aspect-video bg-muted/20 rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-border/40 relative">
                                      {item.sketch?.imageUrl ? (
                                        <img src={item.sketch.imageUrl} className="w-full h-full object-cover" />
                                      ) : (
                                        <Palette className="opacity-10" size={24} />
                                      )}
                                      <div className="absolute top-2 right-2">
                                        <Badge className="bg-primary/80 text-white border-none text-[8px] h-4">PDF</Badge>
                                      </div>
                                    </div>
                                  )}
                                  <h4 className="text-sm font-bold leading-snug line-clamp-2 text-foreground/80">{item.texto || 'Sem descrição'}</h4>

                                  <div className="mt-3 flex items-center justify-between gap-2">
                                    <div className="flex flex-wrap gap-1">
                                      <Badge variant="outline" className="text-[9px] h-4 uppercase tracking-tighter opacity-60">
                                        {item.project?.nome || 'Pendente'}
                                      </Badge>
                                      <Badge
                                        className={cn(
                                          "text-[9px] h-4 uppercase tracking-tighter",
                                          item.prioridade === 'CRITICA' ? "bg-destructive text-white" : "bg-primary/10 text-primary"
                                        )}
                                      >
                                        {item.prioridade}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Side Panel (Details & Conversion) */}
      <AnimatePresence>
        {selectedRecord && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-xl h-full bg-background shadow-2xl z-[70] flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-8 border-b flex items-center justify-between bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Eye size={20} />
                  </div>
                  <h3 className="text-xl font-bold tracking-tighter">Formalizar Registro</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedRecord(null)} className="rounded-full h-10 w-10">
                  <ChevronRight size={24} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Content Section */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={16} className="text-muted-foreground" />
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Conteído Original</label>
                  </div>
                  <div className="p-5 bg-secondary/30 rounded-2xl border border-border/50">
                    <p className="text-lg font-medium leading-relaxed tracking-tight">{selectedRecord.texto}</p>
                  </div>
                </section>

                {selectedRecord.type === 'ESBOCO' && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Palette size={16} className="text-muted-foreground" />
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Documento Técnico / Esboço</label>
                    </div>
                    <div className="aspect-video bg-white border-2 border-primary/5 rounded-[2rem] overflow-hidden relative group shadow-inner">
                      <img src={selectedRecord.sketch?.imageUrl} className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm">
                        <Button
                          onClick={() => window.open(`http://localhost:4000/api/records/${selectedRecord.id}/pdf-view`, '_blank')}
                          className="font-bold gap-2 rounded-2xl bg-white text-primary hover:bg-white/90"
                        >
                          <FileText size={20} /> Ver PDF Timbrado
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                <Separator className="opacity-50" />

                {/* Assignment Form */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <UserPlus size={16} className="text-primary" />
                    <h4 className="text-sm font-bold tracking-tight">Designação & Conversão</h4>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest ml-1">Vincular à Obra</label>
                      <Select value={targetProjectId} onValueChange={setTargetProjectId}>
                        <SelectTrigger className="h-12 rounded-xl border-border/60 bg-secondary/10">
                          <Building2 size={16} className="mr-2 opacity-50 text-primary" />
                          <SelectValue placeholder="Selecione o projeto" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                          {projects.map(p => (
                            <SelectItem key={p.id} value={p.id} className="rounded-lg">{p.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest ml-1">Designar para Profissional</label>
                      <Select value={assigneeId} onValueChange={setAssigneeId}>
                        <SelectTrigger className="h-12 rounded-xl border-border/60 bg-secondary/10">
                          <UserPlus size={16} className="mr-2 opacity-50 text-primary" />
                          <SelectValue placeholder="Selecione o responsável" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                          {professionals.map(p => (
                            <SelectItem key={p.id} value={p.id} className="rounded-lg">{p.nome} ({p.tipo})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>
              </div>

              {/* Action Buttons */}
              <div className="p-8 pt-4 border-t bg-background grid grid-cols-2 gap-4">
                <Button
                  onClick={handleFormalize}
                  disabled={isConverting}
                  className="h-14 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {isConverting ? 'Formalizando...' : 'Formalizar & Converter'}
                </Button>
                <Button variant="secondary" className="h-14 rounded-2xl font-bold bg-secondary/50 text-foreground/70">
                  Arquivar Registro
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
