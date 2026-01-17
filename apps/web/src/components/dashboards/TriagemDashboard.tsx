import { useState, useEffect } from 'react';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  ListChecks,
  MoreHorizontal,
  FileText,
  Palette,
  UserPlus,
  Building2,
  Plus,
  Trash2,
  ExternalLink,
  TrendingUp,
  Archive,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Layers,
  Search,
  CheckSquare,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRegistros } from '@/hooks/useRegistros';
import { Record, Professional, Project, RecordItem } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RecordDetailsModal } from '@/components/shared/RecordDetailsModal';
import { RegistroModal } from '@/components/shared/RegistroModal';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const columnsConfig = [
  { id: 'REGISTRO', title: 'Registro', icon: Clock, color: 'bg-slate-500/10 text-slate-600', borderColor: 'border-slate-300' },
  { id: 'TRIAGEM', title: 'Triagem', icon: Search, color: 'bg-yellow-500/10 text-yellow-600', borderColor: 'border-yellow-300' },
  { id: 'CLASSIFICACAO', title: 'Classificação', icon: ListChecks, color: 'bg-blue-500/10 text-blue-600', borderColor: 'border-blue-300' },
  { id: 'ORDENACAO', title: 'Ordenação', icon: TrendingUp, color: 'bg-purple-500/10 text-purple-600', borderColor: 'border-purple-300' },
  { id: 'VALIDACAO', title: 'Validação', icon: ShieldCheck, color: 'bg-orange-500/10 text-orange-600', borderColor: 'border-orange-300' },
  { id: 'DISTRIBUICAO', title: 'Distribuição', icon: Truck, color: 'bg-green-500/10 text-green-600', borderColor: 'border-green-300' },
];

interface ActivityForm {
  titulo: string;
  descricao: string;
  professionalId: string;
  valorPrevisto: string;
  dataFim?: string;
  category?: string;
}

export function TriagemDashboard() {
  const { registros, fetchRegistros, updateRegistroStatus } = useRegistros();
  const [detailsRecord, setDetailsRecord] = useState<Record | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewRevisionOpen, setIsNewRevisionOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Record | null>(null);

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');

  // Multi-Activity Creation
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [analysisRecord, setAnalysisRecord] = useState<Record | null>(null);
  const [activities, setActivities] = useState<ActivityForm[]>([
    { titulo: '', descricao: '', professionalId: '', valorPrevisto: '', category: '' }
  ]);

  useEffect(() => {
    fetchRegistros();
    loadContextData();
  }, []);

  const loadContextData = async () => {
    try {
      const [pRes, projRes] = await Promise.all([
        fetch(getApiUrl('/api/professionals')),
        fetch(getApiUrl('/api/projects'))
      ]);
      if (pRes.ok) setProfessionals(await pRes.json());
      if (projRes.ok) setProjects(await projRes.json());
    } catch (e) {
      console.error('Context data error', e);
    }
  };

  const recordsWithHierarchy = registros.map(reg => ({
    ...reg,
    revisionsCount: registros.filter(r => r.parentId === reg.id).length
  }));

  const openAnalysis = (record: Record) => {
    setAnalysisRecord(record);
    setActivities([{ titulo: '', descricao: '', professionalId: '', valorPrevisto: '', category: '' }]);
    setIsAnalysisOpen(true);
  };

  const openDetails = (record: Record) => {
    setDetailsRecord(record);
    setIsDetailsOpen(true);
  };

  const getPhaseIndex = (status: string) => {
    return columnsConfig.findIndex(c => c.id === status);
  };

  const moveCard = async (record: Record, direction: 'forward' | 'backward') => {
    const currentIndex = getPhaseIndex(record.status);
    const newIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex < 0 || newIndex >= columnsConfig.length) return;

    const newStatus = columnsConfig[newIndex].id;
    setAnimationDirection(direction);
    setAnimatingCard(record.id);

    await new Promise(resolve => setTimeout(resolve, 100));
    await updateRegistroStatus(record.id, newStatus);

    setTimeout(() => {
      setAnimatingCard(null);
      toast.success(`→ ${columnsConfig[newIndex].title}`);
    }, 150);
  };

  const addActivity = () => {
    setActivities([...activities, { titulo: '', descricao: '', professionalId: '', valorPrevisto: '', category: '' }]);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const updateActivity = (index: number, field: keyof ActivityForm, value: string) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [field]: value } as ActivityForm;
    setActivities(updated);
  };

  const handleCreateActivities = async () => {
    if (!analysisRecord) return;
    try {
      const validActivities = activities.filter(a => a.titulo && a.professionalId && a.valorPrevisto);
      if (validActivities.length === 0) {
        toast.error('Add at least one valid activity');
        return;
      }
      for (const activity of validActivities) {
        await fetch(getApiUrl(`/api/records/${analysisRecord.id}/convert`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: activity.titulo,
            descricao: activity.descricao || `Derived from ${analysisRecord.refCodigo}`,
            projectId: analysisRecord.projectId,
            professionalId: activity.professionalId,
            valorPrevisto: parseFloat(activity.valorPrevisto),
          }),
        });
      }
      toast.success(`${validActivities.length} activities created!`);
      setIsAnalysisOpen(false);
      fetchRegistros();
    } catch (e) {
      toast.error('Error creating activities');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-secondary/5 to-background overflow-hidden">
      <div className="p-4 lg:p-6 border-b bg-background/95 backdrop-blur-sm shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Workspace Profissional
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Fluxo de Triagem, Validação e Distribuição</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl gap-2 shadow-sm">
            <Archive size={16} /> Arquivo
          </Button>
          <Button className="rounded-xl gap-2 shadow-lg shadow-primary/10">
            <Plus size={16} /> Novo Registro
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Hierarchy View & Active Documents */}
        <aside className="w-80 border-r bg-muted/10 flex flex-col">
          <div className="p-4 border-b bg-background/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Layers size={14} /> Revisões & Versões
              </h3>
              <Badge className="bg-primary/10 text-primary border-none">LIVE</Badge>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
              <Input placeholder="Buscar por Código..." className="pl-9 h-9 rounded-xl border-none shadow-sm bg-background" />
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {recordsWithHierarchy.filter(r => r.isInicial).map(reg => (
                <div key={reg.id} className="space-y-1">
                  <div
                    className={cn(
                      "p-3 rounded-2xl bg-background border shadow-sm cursor-pointer hover:border-primary/30 transition-all",
                      detailsRecord?.id === reg.id ? "border-primary/50 ring-1 ring-primary/50" : ""
                    )}
                    onClick={() => openDetails(reg)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold">{reg.refCodigo}</span>
                      {reg.revisionsCount > 0 && <Badge variant="secondary" className="text-[8px] h-4 px-1">+{reg.revisionsCount} REVS</Badge>}
                    </div>
                    <p className="text-xs font-medium line-clamp-1">{reg.texto || 'Registro de Campo'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[8px] px-1 h-4">{reg.natureza}</Badge>
                      <span className="text-[9px] text-muted-foreground">{new Date(reg.criadoEm).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Visual indication of children if selected or expanded */}
                  {registros.filter(r => r.parentId === reg.id).map(child => (
                    <div key={child.id} className="ml-4 pl-4 border-l-2 border-primary/20 flex items-center gap-2 py-1">
                      <div className="w-2 h-2 rounded-full bg-primary/30" />
                      <div
                        className="flex-1 p-2 rounded-xl bg-background/50 border border-muted text-[10px] cursor-pointer hover:bg-background"
                        onClick={() => openDetails(child)}
                      >
                        <span className="font-bold">{child.refCodigo}</span> - {child.status}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Workspace: 6-Phase Kanban */}
        <main className="flex-1 overflow-x-auto p-4 lg:p-6 bg-secondary/5 h-full">
          <div className="flex gap-4 h-full min-h-[600px]">
            {columnsConfig.map((col) => {
              const items = registros.filter(r => r.status === col.id);
              const Icon = col.icon;
              return (
                <div key={col.id} className="flex-shrink-0 w-72 flex flex-col h-full bg-background/40 rounded-3xl border border-dashed border-muted-foreground/20 p-3 shadow-inner">
                  <div className={cn(
                    "rounded-2xl p-3 mb-4 flex items-center justify-between shadow-sm",
                    col.color
                  )}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-background/50 backdrop-blur-sm">
                        <Icon size={18} />
                      </div>
                      <h3 className="font-extrabold text-xs uppercase tracking-tighter">{col.title}</h3>
                    </div>
                    <Badge variant="secondary" className="rounded-lg h-6 px-2">{items.length}</Badge>
                  </div>

                  <ScrollArea className="flex-1">
                    <AnimatePresence mode="popLayout">
                      {items.map((record) => (
                        <motion.div
                          key={record.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="mb-3"
                        >
                          <Card
                            className={cn(
                              "rounded-2xl hover:shadow-xl transition-all border-none shadow-md cursor-pointer group relative overflow-hidden",
                              detailsRecord?.id === record.id ? "ring-2 ring-primary" : ""
                            )}
                            onClick={() => openDetails(record)}
                          >
                            {/* Status Accents */}
                            <div className={cn(
                              "absolute top-0 left-0 bottom-0 w-1",
                              record.prioridade === 'CRITICA' ? 'bg-red-500' :
                                record.prioridade === 'ALTA' ? 'bg-orange-500' : 'bg-primary/20'
                            )} />

                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-black text-primary bg-primary/5 px-2 py-0.5 rounded-lg">
                                    {record.refCodigo}
                                  </span>
                                  {!record.isInicial && <Badge className="text-[8px] h-4 bg-purple-500/20 text-purple-600 border-none">REVISÃO</Badge>}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 rounded-lg hover:bg-secondary"
                                    disabled={getPhaseIndex(record.status) === 0}
                                    onClick={(e) => { e.stopPropagation(); moveCard(record, 'backward'); }}
                                  >
                                    <ChevronLeft size={14} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 rounded-lg hover:bg-secondary"
                                    disabled={getPhaseIndex(record.status) === columnsConfig.length - 1}
                                    onClick={(e) => { e.stopPropagation(); moveCard(record, 'forward'); }}
                                  >
                                    <ChevronRight size={14} />
                                  </Button>
                                </div>
                              </div>

                              <h4 className="font-bold text-sm tracking-tight mb-2 line-clamp-2">
                                {record.texto || 'Análise Técnica de Campo'}
                              </h4>

                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex -space-x-2">
                                  <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center overflow-hidden">
                                    <UserPlus size={10} />
                                  </div>
                                </div>
                                <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[80px]">
                                  {record.author?.nome}
                                </span>
                                <div className="ml-auto flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                                  <Building2 size={10} />
                                  <span className="truncate max-w-[60px]">{record.project?.nome}</span>
                                </div>
                              </div>

                              <Separator className="mb-3 opacity-50" />

                              <div className="flex items-center justify-between pt-1">
                                <Badge variant="outline" className="text-[9px] h-5 rounded-md border-muted-foreground/20">
                                  {record.natureza || 'GERAL'}
                                </Badge>
                                {record.status === 'DISTRIBUICAO' && (
                                  <Button
                                    size="sm"
                                    className="h-6 rounded-lg text-[9px] gap-1 px-3 shadow-lg shadow-primary/20"
                                    onClick={(e) => { e.stopPropagation(); openAnalysis(record); }}
                                  >
                                    Distribuir <ArrowRight size={10} />
                                  </Button>
                                )}
                                {record.status !== 'DISTRIBUICAO' && record.documents?.length ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 rounded-lg text-[9px] gap-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(getApiUrl(`/api/records/${record.id}/pdf-view`), '_blank');
                                    }}
                                  >
                                    <FileText size={10} /> PDF
                                  </Button>
                                ) : null}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </ScrollArea>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      <RecordDetailsModal
        record={detailsRecord}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      <RegistroModal
        isOpen={isNewRevisionOpen}
        onClose={() => setIsNewRevisionOpen(false)}
        parentRecord={selectedParent}
        onSuccess={fetchRegistros}
      />

      <Dialog open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden bg-background border-none shadow-2xl">
          <DialogHeader className="p-6 border-b bg-secondary/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Truck className="text-primary" size={24} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Distribuição Profissional</DialogTitle>
                <p className="text-sm text-muted-foreground">Original: {analysisRecord?.refCodigo} - {analysisRecord?.natureza}</p>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6 bg-muted/10">
            <div className="max-w-2xl mx-auto space-y-6">
              <Alert className="bg-primary/5 border-primary/20 rounded-2xl">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-xs text-primary/80">
                  Converta este registro em atividades executáveis. Profissionais são filtrados por categoria de serviço.
                </AlertDescription>
              </Alert>

              {activities.map((activity, index) => (
                <Card key={index} className="rounded-3xl border-none shadow-lg overflow-hidden">
                  <div className="p-4 bg-background border-b flex justify-between items-center">
                    <span className="font-bold text-sm">Escopo #{index + 1}</span>
                    {activities.length > 1 && (
                      <Button size="icon" variant="ghost" onClick={() => removeActivity(index)} className="h-8 w-8 text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">O que será feito?</Label>
                      <Input
                        placeholder="Ex: Instalação de pontos elétricos conforme esboço"
                        value={activity.titulo}
                        onChange={(e) => updateActivity(index, 'titulo', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profissional Especializado</Label>
                        <Select value={activity.professionalId} onValueChange={(v) => updateActivity(index, 'professionalId', v)}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Selecionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {professionals.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Verba Prevista (R$)</Label>
                        <Input
                          type="number"
                          value={activity.valorPrevisto}
                          onChange={(e) => updateActivity(index, 'valorPrevisto', e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" className="w-full h-12 rounded-2xl border-dashed border-2 gap-2" onClick={addActivity}>
                <Plus size={16} /> Adicionar Novo Desdobramento (Sub-Atividade)
              </Button>
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 border-t bg-background">
            <Button variant="ghost" onClick={() => setIsAnalysisOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button onClick={handleCreateActivities} className="rounded-xl px-10 shadow-lg shadow-primary/20">
              Confirmar Distribuição & Gerar Atividades
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Alert({ children, className, ...props }: any) {
  return <div role="alert" className={cn("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground", className)} {...props}>{children}</div>
}
function AlertDescription({ children, className, ...props }: any) {
  return <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props}>{children}</div>
}
function ScrollArea({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10", className)}>{children}</div>
}
