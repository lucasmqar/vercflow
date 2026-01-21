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
  Truck,
  Columns,
  List,
  LayoutGrid,
  Filter,
  History
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRegistros } from '@/hooks/useRegistros';
import { Record, Professional, Project, RecordItem, DashboardTab } from '@/types';
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
  { id: 'REGISTRO', title: 'Registro', icon: Clock, color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20' },
  { id: 'TRIAGEM', title: 'Triagem', icon: Search, color: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/20' },
  { id: 'CLASSIFICACAO', title: 'Classificação', icon: ListChecks, color: 'text-blue-600', bg: 'bg-blue-600/10', border: 'border-blue-600/20' },
  { id: 'ORDENACAO', title: 'Ordenação', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-600/10', border: 'border-purple-600/20' },
  { id: 'VALIDACAO', title: 'Validação', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-600/10', border: 'border-orange-600/20' },
  { id: 'DISTRIBUICAO', title: 'Distribuição', icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-600/10', border: 'border-emerald-600/20' },
];

interface ActivityForm {
  titulo: string;
  descricao: string;
  professionalId: string;
  valorPrevisto: string;
  dataFim?: string;
  category?: string;
}

type ViewMode = 'kanban' | 'list' | 'grid';

export function TriagemDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
  const { registros, fetchRegistros, updateRegistroStatus, deleteRegistro } = useRegistros();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('triagem-view-mode') as ViewMode) || 'kanban';
  });
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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este registro técnico?')) {
      await deleteRegistro(id);
    }
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
    <div className="flex flex-col h-full bg-gradient-to-br from-secondary/5 to-background overflow-hidden font-sans">
      {/* Standard Header */}
      <div className="p-4 lg:p-6 border-b bg-background/95 backdrop-blur-sm shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Triagem Técnica</h1>
            <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest font-medium opacity-60">Classificação e Distribuição de Registros</p>
          </div>
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-muted/20 rounded-lg p-1 border border-border/40">
              {[
                { id: 'kanban', icon: Columns, label: 'Kanban' },
                { id: 'list', icon: List, label: 'Lista' },
                { id: 'grid', icon: LayoutGrid, label: 'Grid' },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setViewMode(mode.id as ViewMode);
                    localStorage.setItem('triagem-view-mode', mode.id);
                  }}
                  className={cn(
                    "h-8 px-3 rounded-md flex items-center gap-2 text-xs font-semibold transition-all duration-200",
                    viewMode === mode.id
                      ? "bg-primary text-primary-foreground technical-shadow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <mode.icon size={14} />
                  <span className="hidden lg:inline">{mode.label}</span>
                </button>
              ))}
            </div>

            <div className="w-[1px] h-6 bg-border/40 mx-1" />

            <Button variant="outline" className="h-10 rounded-xl text-xs font-bold gap-2 px-4 shadow-none">
              <History size={15} /> Histórico
            </Button>
            <Button
              onClick={() => onTabChange('captura')}
              className="h-10 rounded-xl text-xs font-black uppercase tracking-widest px-6 shadow-glow"
            >
              <Plus size={16} /> Novo Registro
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Hierarchy View & Active Documents - Technical Aesthetic */}
        <aside className="w-[300px] border-r border-border/40 bg-muted/10 flex flex-col shrink-0">
          <div className="p-4 border-b border-border/40 bg-background/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/60 flex items-center gap-2">
                <Layers size={14} /> Ciclo de Revisão
              </h3>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black tracking-widest text-emerald-600 opacity-80 uppercase">Ativo</span>
              </div>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground/40" />
              <Input
                placeholder="Filtrar por código..."
                className="pl-9 h-9 text-[13px] rounded-md border-border/40 bg-background/50 focus:bg-background transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none">
            {recordsWithHierarchy.filter(r => r.isInicial).map(reg => (
              <div key={reg.id} className="space-y-1">
                <div
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer group relative",
                    detailsRecord?.id === reg.id
                      ? "border-primary/40 bg-primary/5 technical-shadow"
                      : "border-transparent hover:bg-muted/50 hover:border-border/40"
                  )}
                  onClick={() => openDetails(reg)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-black text-primary/70">{reg.refCodigo}</span>
                    {reg.revisionsCount > 0 && (
                      <Badge variant="secondary" className="text-[8px] h-4 px-1.5 bg-muted/80 text-muted-foreground/80 lowercase italic font-mono">
                        {reg.revisionsCount} revs
                      </Badge>
                    )}
                  </div>
                  <p className="text-[12.5px] font-bold text-foreground/80 line-clamp-1 group-hover:text-primary transition-colors">
                    {reg.texto || 'Registro Técnico'}
                  </p>
                </div>

                {registros.filter(r => r.parentId === reg.id).map(child => (
                  <div key={child.id} className="ml-4 pl-4 border-l border-border/60">
                    <div
                      className={cn(
                        "p-2 rounded-md text-[11px] cursor-pointer transition-all border border-transparent",
                        detailsRecord?.id === child.id
                          ? "bg-primary/5 text-primary font-bold border-primary/20"
                          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      )}
                      onClick={() => openDetails(child)}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono font-bold opacity-60 tracking-tight">{child.refCodigo}</span>
                        <span className="opacity-30">/</span>
                        <span className="truncate">{child.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 overflow-x-auto p-6 bg-background/5 h-full relative">
          {/* Kanban View - Modern Technical Layout */}
          {viewMode === 'kanban' && (
            <div className="flex gap-6 h-full min-h-[600px] pb-4">
              {columnsConfig.map((col) => {
                const items = registros.filter(r => r.status === col.id);
                const Icon = col.icon;
                return (
                  <div key={col.id} className="flex-shrink-0 w-[320px] flex flex-col h-full bg-muted/5 rounded-xl border border-border/40 overflow-hidden backdrop-blur-sm">
                    {/* Column Header */}
                    <div className={cn("px-4 py-3.5 flex items-center justify-between border-b bg-background/40", col.border)}>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-1.5 h-6 rounded-full", col.color.replace('text-', 'bg-'))} />
                        <div>
                          <h3 className="font-bold text-xs uppercase tracking-widest text-foreground/80">{col.title}</h3>
                          <p className="text-[10px] text-muted-foreground font-mono font-bold opacity-60">{items.length} ITENS</p>
                        </div>
                      </div>
                      <Icon size={16} className={cn("opacity-40", col.color)} />
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-none">
                      <AnimatePresence mode="popLayout">
                        {items.map((record) => (
                          <motion.div
                            key={record.id}
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          >
                            <Card
                              className={cn(
                                "glass-card rounded-lg transition-all border-border/40 shadow-none hover:border-primary/40 cursor-pointer group relative overflow-hidden",
                                detailsRecord?.id === record.id ? "ring-1 ring-primary/40 border-primary/40 bg-primary/[0.03]" : ""
                              )}
                              onClick={() => openDetails(record)}
                            >
                              <CardContent className="p-4 outline-none">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-1.5">
                                    <div className={cn(
                                      "w-2 h-2 rounded-full",
                                      record.prioridade === 'CRITICA' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' :
                                        record.prioridade === 'ALTA' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'bg-primary/40'
                                    )} />
                                    <span className="text-[9px] font-mono font-black text-primary/80 uppercase tracking-tighter">
                                      {record.refCodigo}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                      onClick={(e) => handleDelete(e, record.id)}
                                    >
                                      <Trash2 size={12} />
                                    </Button>
                                    <div className="w-[1px] h-3 bg-border/40 mx-0.5" />
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      disabled={getPhaseIndex(record.status) === 0}
                                      onClick={(e) => { e.stopPropagation(); moveCard(record, 'backward'); }}
                                    >
                                      <ChevronLeft size={12} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      disabled={getPhaseIndex(record.status) === columnsConfig.length - 1}
                                      onClick={(e) => { e.stopPropagation(); moveCard(record, 'forward'); }}
                                    >
                                      <ChevronRight size={12} />
                                    </Button>
                                  </div>
                                </div>

                                <h4 className="font-bold text-[13px] tracking-tight mb-3 line-clamp-2 leading-[1.4] text-foreground/90 group-hover:text-primary transition-colors">
                                  {record.texto || 'Captura de Campo s/ Título'}
                                </h4>

                                <div className="space-y-2 mb-4">
                                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                                    <Building2 size={11} className="opacity-40" />
                                    <span className="truncate uppercase tracking-wider">{record.project?.nome || 'Inbox / Geral'}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                                    <UserPlus size={11} className="opacity-40" />
                                    <span className="truncate">{record.author?.nome}</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-border/30 pt-3">
                                  <span className="text-[9px] font-mono font-bold text-muted-foreground/40 uppercase tracking-widest">{record.natureza || 'Geral'}</span>
                                  {(record.status === 'DISTRIBUICAO' || record.status === 'VALIDACAO') && (
                                    <Button
                                      size="sm"
                                      className="h-7 rounded-md text-[10px] gap-1.5 px-3 uppercase font-black bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
                                      onClick={(e) => { e.stopPropagation(); openAnalysis(record); }}
                                    >
                                      Distribuir <ArrowRight size={10} />
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* List View - Technical Grid */}
          {viewMode === 'list' && (
            <div className="h-full overflow-hidden glass-card rounded-xl border border-border/40">
              <ScrollArea className="h-full">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-background/80 backdrop-blur-xl z-10">
                    <tr className="border-b border-border/40">
                      <th className="text-left p-4 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">Código</th>
                      <th className="text-left p-4 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">Documento Técnico</th>
                      <th className="text-left p-4 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">Status</th>
                      <th className="text-left p-4 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">Contexto</th>
                      <th className="text-left p-4 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">Carga</th>
                      <th className="text-right p-4 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {registros.map((record) => {
                      const statusConfig = columnsConfig.find(c => c.id === record.status);
                      return (
                        <tr
                          key={record.id}
                          onClick={() => openDetails(record)}
                          className="hover:bg-primary/[0.02] cursor-pointer transition-colors group"
                        >
                          <td className="p-4">
                            <span className="text-[11px] font-mono font-black text-primary/80">{record.refCodigo}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-0.5">
                              <p className="text-[13px] font-bold text-foreground/80 line-clamp-1">{record.texto || 'Captura de Campo'}</p>
                              <span className="text-[10px] text-muted-foreground/60">{record.author?.nome}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className={cn("text-[10px] font-mono font-bold border-transparent px-2 py-0.5", statusConfig?.bg, statusConfig?.color)}>
                              {statusConfig?.title}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Building2 size={12} className="text-muted-foreground/40" />
                              <span className="text-[11px] font-medium text-muted-foreground">{record.project?.nome || 'Inbox'}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-2 h-2 rounded-full shadow-glow",
                                record.prioridade === 'CRITICA' ? 'bg-red-500' :
                                  record.prioridade === 'ALTA' ? 'bg-orange-500' : 'bg-primary/40'
                              )} />
                              <span className="text-[10px] font-mono font-bold text-muted-foreground/80">{record.prioridade}</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                              onClick={(e) => handleDelete(e, record.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          )}

          {/* Grid View - Technical Cards */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 h-full overflow-y-auto pb-4 scrollbar-none">
              {registros.map((record) => {
                const statusConfig = columnsConfig.find(c => c.id === record.status);
                const Icon = statusConfig?.icon || Clock;
                return (
                  <Card
                    key={record.id}
                    className="glass-card rounded-xl border-border/40 hover:border-primary/40 cursor-pointer transition-all hover:translate-y-[-2px] group relative h-fit"
                    onClick={() => openDetails(record)}
                  >
                    <CardContent className="p-5 outline-none">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-[10px] font-mono font-black text-primary/70 tracking-tighter">{record.refCodigo}</span>
                        <div className={cn("p-2 rounded-lg", statusConfig?.bg)}>
                          <Icon size={16} className={cn("opacity-80", statusConfig?.color)} />
                        </div>
                      </div>

                      <h4 className="font-bold text-sm mb-4 line-clamp-2 leading-snug text-foreground/90 group-hover:text-primary transition-colors">
                        {record.texto || 'Captura de Campo'}
                      </h4>

                      <div className="grid grid-cols-2 gap-3 mb-5 border-y border-border/20 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">Autor</span>
                          <span className="text-[10px] font-medium truncate">{record.author?.nome}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">Projeto</span>
                          <span className="text-[10px] font-medium truncate">{record.project?.nome || 'Inbox'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={cn("text-[9px] font-mono font-bold px-2 py-0 border-transparent", statusConfig?.bg, statusConfig?.color)}>
                          {statusConfig?.title}
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono font-bold text-muted-foreground/60">{record.prioridade}</span>
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            record.prioridade === 'CRITICA' ? 'bg-red-500' :
                              record.prioridade === 'ALTA' ? 'bg-orange-500' : 'bg-primary/40'
                          )} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
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
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-2xl border border-border/40 shadow-2xl rounded-xl">
          <DialogHeader className="px-8 py-5 border-b border-border/40 bg-muted/20">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 shadow-glow">
                <Truck className="text-primary" size={20} />
              </div>
              <div>
                <DialogTitle className="text-base font-bold tracking-tight text-foreground">Gerenciamento de Distribuição Técnica</DialogTitle>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="outline" className="text-[9px] font-mono font-bold bg-primary/5 text-primary border-primary/10">ORIGEM: {analysisRecord?.refCodigo}</Badge>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider opacity-60">/ {analysisRecord?.natureza}</span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-8 bg-muted/[0.02]">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="bg-primary/5 border border-primary/10 p-5 rounded-xl flex gap-4 items-start shadow-sm">
                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5 opacity-70" />
                <div className="space-y-1">
                  <p className="text-[11px] text-primary/80 uppercase font-black tracking-widest leading-tight">Diretriz de Operação</p>
                  <p className="text-[12px] text-muted-foreground font-medium leading-relaxed">
                    Converta este registro em atividades executáveis. Os profissionais são priorizados com base na natureza do serviço ({analysisRecord?.natureza || 'Geral'}).
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <Card key={index} className="glass-card rounded-xl border border-border/40 shadow-none overflow-hidden hover:border-primary/20 transition-all">
                    <div className="px-5 py-3 bg-muted/10 border-b border-border/40 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-foreground/40 text-muted-foreground">Escopo Operacional #{index + 1}</span>
                      </div>
                      {activities.length > 1 && (
                        <Button size="icon" variant="ghost" onClick={() => removeActivity(index)} className="h-7 w-7 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-md">
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                    <CardContent className="p-6 space-y-5">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 font-sans ml-1">Título da Atividade</Label>
                        <Input
                          placeholder="Ex: Instalação de infraestrutura elétrica e pontos de rede..."
                          value={activity.titulo}
                          onChange={(e) => updateActivity(index, 'titulo', e.target.value)}
                          className="rounded-lg h-10 text-[13px] border-border/40 bg-background/50 focus:bg-background transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 font-sans ml-1">Profissional Responsável</Label>
                          <Select value={activity.professionalId} onValueChange={(v) => updateActivity(index, 'professionalId', v)}>
                            <SelectTrigger className="rounded-lg h-10 text-[13px] border-border/40 bg-background/50">
                              <SelectValue placeholder="Escolher Profissional" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-border/40 backdrop-blur-xl">
                              {professionals
                                .sort((a, b) => {
                                  const aMatches = a.categories?.some(c => c.category.toLowerCase() === analysisRecord?.natureza?.toLowerCase());
                                  const bMatches = b.categories?.some(c => c.category.toLowerCase() === analysisRecord?.natureza?.toLowerCase());
                                  if (aMatches && !bMatches) return -1;
                                  if (!aMatches && bMatches) return 1;
                                  return 0;
                                })
                                .map(p => {
                                  const matches = p.categories?.some(c => c.category.toLowerCase() === analysisRecord?.natureza?.toLowerCase());
                                  return (
                                    <SelectItem key={p.id} value={p.id} className="text-[13px] rounded-md focus:bg-primary/5 focus:text-primary py-2">
                                      <div className="flex items-center justify-between w-full gap-4">
                                        <span className="font-semibold">{p.nome}</span>
                                        {matches && (
                                          <Badge className="text-[8px] h-4 px-1.5 bg-primary/10 text-primary border-none font-black tracking-tighter shadow-sm animate-pulse">MATCH</Badge>
                                        )}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 font-sans ml-1">Valor Previsto (BRL)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-[11px] font-bold text-muted-foreground/40">R$</span>
                            <Input
                              type="number"
                              value={activity.valorPrevisto}
                              onChange={(e) => updateActivity(index, 'valorPrevisto', e.target.value)}
                              className="rounded-lg h-10 pl-9 text-[13px] border-border/40 bg-background/50 font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full h-12 rounded-xl border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/[0.02] gap-2.5 text-[11px] uppercase font-bold tracking-[0.1em] transition-all" onClick={addActivity}>
                <Plus size={16} className="text-primary/60" /> Adicionar Desdobramento Técnico
              </Button>
            </div>
          </ScrollArea>

          <DialogFooter className="px-8 py-5 border-t border-border/40 bg-muted/5 flex items-center justify-between sm:justify-between gap-4">
            <Button variant="ghost" onClick={() => setIsAnalysisOpen(false)} className="rounded-lg text-[11px] uppercase font-bold tracking-wider text-muted-foreground hover:text-foreground">Cancelar</Button>
            <Button onClick={handleCreateActivities} className="rounded-xl px-10 h-10 text-[11px] uppercase font-black tracking-widest shadow-glow hover:translate-y-[-1px] transition-all">
              Efetivar Distribuição
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
  return <div className={cn("overflow-y-auto scrollbar-none", className)}>{children}</div>
}
