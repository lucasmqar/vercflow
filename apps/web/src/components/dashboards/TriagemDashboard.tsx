"use client"

import React, { useState, useEffect } from 'react';
import {
  Shield, CheckCircle2, XCircle, FileText, AlertCircle,
  Search, Filter, Clock, Eye, History, Activity, Zap,
  ArrowRightCircle, ArrowLeftCircle, MoreVertical, ClipboardList,
  MessageSquare, Share, Layers, User, Building2, MapPin,
  Download, Paperclip, ChevronDown, Send, Briefcase, Hash,
  Maximize2, Minimize2, List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegistros } from '@/hooks/useRegistros';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ViewMode = 'SUMMARY' | 'TECHNICAL' | 'FULL';
type Phase = 'CAPTURE' | 'TRIAGE' | 'ANALYSIS' | 'DISTRIBUTION';

export function TriagemDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
  const { registros, fetchRegistros, updateRegistroStatus } = useRegistros();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('FULL');
  const [currentPhase, setCurrentPhase] = useState<Phase>('TRIAGE');

  // Advanced Distribution State
  const [distributeModalOpen, setDistributeModalOpen] = useState(false);
  const [distributionData, setDistributionData] = useState({
    department: '',
    assignee: '',
    type: '',
    priority: '',
    projectId: '',
    notes: ''
  });

  // Filter only pertinent statutes for Triage
  const triageList = registros.filter(r => ['REGISTRO', 'TRIAGEM', 'REVISAO'].includes(r.status));
  const selectedRecord = registros.find(r => r.id === selectedRecordId) || triageList[0];

  useEffect(() => {
    if (!selectedRecordId && triageList.length > 0) {
      setSelectedRecordId(triageList[0].id);
      const rec = triageList[0];
      setDistributionData(prev => ({
        ...prev,
        type: rec.natureza || '',
        priority: rec.prioridade || '',
        projectId: rec.projectId || 'none'
      }));
    } else if (selectedRecord) {
      setDistributionData(prev => ({
        ...prev,
        type: selectedRecord.natureza || '',
        priority: selectedRecord.prioridade || '',
        projectId: selectedRecord.projectId || 'none'
      }));
      // Auto-set phase based on status (simplified)
      if (selectedRecord.status === 'REGISTRO') setCurrentPhase('TRIAGE');
      else if (selectedRecord.status === 'TRIAGEM') setCurrentPhase('ANALYSIS');
      else if (selectedRecord.status === 'REVISAO') setCurrentPhase('DISTRIBUTION');
    }
  }, [triageList, selectedRecordId, selectedRecord]);

  const handleOpenDistribute = (dept: string) => {
    setDistributionData({ ...distributionData, department: dept });
    setDistributeModalOpen(true);
  };

  const handleConfirmDistribution = () => {
    if (selectedRecordId) {
      updateRegistroStatus(selectedRecordId, 'DISTRIBUICAO');
    }
    setDistributeModalOpen(false);
  };

  const nextPhase = () => {
    if (currentPhase === 'TRIAGE') setCurrentPhase('ANALYSIS');
    else if (currentPhase === 'ANALYSIS') setCurrentPhase('DISTRIBUTION');
  };

  return (
    <div className="flex flex-col h-full bg-background/50 overflow-hidden font-sans">
      {/* Header */}
      <div className="h-20 shrink-0 px-8 flex items-center justify-between border-b border-border/40 bg-background/50 backdrop-blur-sm">
        <HeaderAnimated title="Triagem & Distribuição" />
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Filtrar ocorrências..." className="pl-10 h-10 rounded-xl bg-muted/30 border-border/40" />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/40">
            <Filter size={16} />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar List - Master View */}
        <div className="w-[400px] border-r border-border/40 flex flex-col bg-muted/5 shrink-0">
          <div className="p-4 border-b border-border/40 flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Fila de Entrada ({triageList.length})</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-black uppercase">Live</Badge>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {triageList.map((reg) => (
                <div
                  key={reg.id}
                  onClick={() => setSelectedRecordId(reg.id)}
                  className={cn(
                    "p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02]",
                    selectedRecordId === reg.id
                      ? "bg-background border-primary/40 shadow-lg shadow-primary/5"
                      : "bg-background/40 border-transparent hover:bg-background hover:border-border/40"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={cn(
                      "text-[9px] font-black uppercase px-1.5 h-5",
                      reg.prioridade === 'CRITICA' ? "bg-red-500/10 text-red-500" :
                        "bg-blue-500/10 text-blue-500"
                    )}>
                      {reg.status}
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground">{new Date(reg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h4 className="font-bold text-sm leading-tight line-clamp-2 mb-2 text-foreground/90">
                    {reg.texto || 'Ocorrência sem título'}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                    <User size={12} /> {reg.author?.nome || 'Sistema'}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Area - Detail View */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-background/30 p-8">
          {selectedRecord ? (
            <div className="max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

              {/* Lifecycle Stepper */}
              <div className="mb-8">
                <RecordLifecycle currentPhase={currentPhase} />
              </div>

              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                    {selectedRecord.refCodigo} • Fase Atual: {currentPhase}
                  </Badge>
                  <h1 className="text-3xl font-black tracking-tighter leading-tight text-foreground max-w-2xl">
                    {selectedRecord.texto || 'Ocorrência de Campo s/ Título'}
                  </h1>
                </div>

                {/* View Mode Selector */}
                <div className="bg-muted/30 p-1 rounded-xl flex gap-1 border border-border/40">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setViewMode('SUMMARY')}
                    className={cn("h-8 rounded-lg text-[10px] font-bold uppercase", viewMode === 'SUMMARY' && "bg-background shadow-sm")}
                  >
                    <Minimize2 size={12} className="mr-2" /> Resumo
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setViewMode('TECHNICAL')}
                    className={cn("h-8 rounded-lg text-[10px] font-bold uppercase", viewMode === 'TECHNICAL' && "bg-background shadow-sm")}
                  >
                    <Activity size={12} className="mr-2" /> Técnico
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setViewMode('FULL')}
                    className={cn("h-8 rounded-lg text-[10px] font-bold uppercase", viewMode === 'FULL' && "bg-background shadow-sm")}
                  >
                    <Maximize2 size={12} className="mr-2" /> Full
                  </Button>
                </div>
              </div>

              {/* Content based on Phase & View Mode */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Record Data - Adapts to ViewMode */}
                <div className={cn("space-y-6 transition-all", currentPhase === 'DISTRIBUTION' ? "lg:col-span-2" : "lg:col-span-2")}>
                  <AnimatePresence mode="wait">
                    {viewMode === 'SUMMARY' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="summary">
                        <Card className="rounded-[2rem] border-border/40 bg-background/60 shadow-sm p-6">
                          <div className="grid grid-cols-2 gap-4">
                            <DetailBlock label="Autor" value={selectedRecord.author?.nome} icon={User} />
                            <DetailBlock label="Data" value={new Date(selectedRecord.timestamp || Date.now()).toLocaleDateString()} icon={Clock} />
                          </div>
                        </Card>
                      </motion.div>
                    )}

                    {viewMode === 'TECHNICAL' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="technical">
                        <Card className="rounded-[2rem] border-border/40 bg-background/60 shadow-sm p-6 font-mono text-xs space-y-4">
                          <div className="p-2 border rounded bg-muted/10">GPS: -23.5505, -46.6333 (Verified)</div>
                          <div className="p-2 border rounded bg-muted/10">Device ID: IPHONE_14_PRO_MAX</div>
                          <div className="p-2 border rounded bg-muted/10">Sync Latency: 24ms</div>
                          <div className="p-2 border rounded bg-muted/10">Hash: {selectedRecord.id.substring(0, 8).toUpperCase()}</div>
                        </Card>
                      </motion.div>
                    )}

                    {viewMode === 'FULL' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="full" className="space-y-6">
                        <Card className="rounded-[2rem] border-border/40 bg-background/60 shadow-sm p-6 space-y-4">
                          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                            <FileText size={16} /> Dados Completos
                          </h3>
                          <div className="p-4 bg-muted/20 rounded-xl border border-border/20 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap font-medium">
                            {selectedRecord.texto ? selectedRecord.texto : "Nenhuma descrição textual fornecida."}
                          </div>
                          <div className="flex gap-4 pt-2">
                            <DetailBlock label="Projeto" value={selectedRecord.project?.nome || 'Geral'} icon={Building2} />
                            <DetailBlock label="Prioridade" value={selectedRecord.prioridade} icon={AlertCircle} />
                          </div>

                          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary pt-4">
                            <Paperclip size={16} /> Arquivos ({selectedRecord.items?.length || 2})
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {[1, 2].map((i) => (
                              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/40 group hover:border-primary/30 transition-all cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <FileText size={18} />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-foreground">evidencia_anexo_{i}.jpg</p>
                                    <p className="text-[10px] text-muted-foreground">Preview Available</p>
                                  </div>
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground group-hover:text-primary">
                                  <Download size={14} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action / Phase Panel */}
                <div className="space-y-6">
                  <Card className="rounded-[2rem] border-primary/20 bg-background shadow-lg shadow-primary/5 p-6 space-y-6 h-full border-t-4 border-t-primary">

                    {currentPhase === 'ANALYSIS' && (
                      <div className="space-y-6 animate-in fade-in">
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary mb-1">
                            <Activity size={16} /> Análise & Refinamento
                          </h3>
                          <p className="text-xs text-muted-foreground">Classifique o registro antes de distribuir.</p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Refinar Projeto</Label>
                            <Select onValueChange={(v) => setDistributionData({ ...distributionData, projectId: v })} defaultValue={distributionData.projectId}>
                              <SelectTrigger className="rounded-xl bg-muted/50 h-9 text-xs font-bold"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Geral</SelectItem>
                                <SelectItem value="sky">Residencial Sky</SelectItem>
                                <SelectItem value="alpha">Casa Alpha</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirmar Prioridade</Label>
                            <Select onValueChange={(v) => setDistributionData({ ...distributionData, priority: v })} defaultValue={distributionData.priority}>
                              <SelectTrigger className="rounded-xl bg-muted/50 h-9 text-xs font-bold"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>

                          <Button onClick={nextPhase} className="w-full rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 mt-4 h-12">
                            Validar & Prosseguir <ArrowRightCircle size={16} className="ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {currentPhase === 'DISTRIBUTION' && (
                      <div className="space-y-6 animate-in fade-in">
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary mb-1">
                            <Zap size={16} /> Distribuição Final
                          </h3>
                          <p className="text-xs text-muted-foreground">Selecione o departamento de destino.</p>
                        </div>

                        <div className="space-y-3">
                          <ActionOption title="Engenharia" desc="Técnico" icon={Layers} onClick={() => handleOpenDistribute('Engenharia')} />
                          <ActionOption title="Suprimentos" desc="Compras" icon={ClipboardList} onClick={() => handleOpenDistribute('Suprimentos')} />
                          <ActionOption title="Design" desc="Projetos" icon={FileText} onClick={() => handleOpenDistribute('Design')} />
                        </div>
                      </div>
                    )}

                    {currentPhase === 'TRIAGE' && (
                      <div className="flex flex-col items-center justify-center text-center h-40 space-y-4">
                        <Shield size={32} className="text-muted-foreground/30" />
                        <p className="text-xs font-bold text-muted-foreground">Aguardando Início da Análise</p>
                        <Button onClick={nextPhase} size="sm" variant="outline" className="rounded-xl border-dashed">Iniciar Tratativa</Button>
                      </div>
                    )}

                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
              <Layers size={64} className="mb-4" />
              <p className="font-bold text-lg">Selecione um registro para análise</p>
            </div>
          )}
        </div>

        {/* Distribution Modal (Same as before but simpler context) */}
        <Dialog open={distributeModalOpen} onOpenChange={setDistributeModalOpen}>
          <DialogContent className="sm:max-w-md rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                <Zap size={20} className="text-primary" /> Enviar para {distributionData.department}
              </DialogTitle>
              <DialogDescription>
                Defina o responsável e a natureza da solicitação.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Natureza</Label>
                <Select value={distributionData.type} onValueChange={(v) => setDistributionData({ ...distributionData, type: v })}>
                  <SelectTrigger className="rounded-xl bg-muted/50 border-transparent font-bold h-9"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>{['TECNICO', 'ORCAMENTO', 'VISTORIA', 'FINANCEIRO'].map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Responsável</Label>
                <Select onValueChange={(v) => setDistributionData({ ...distributionData, assignee: v })}>
                  <SelectTrigger className="rounded-xl bg-muted/50 border-transparent font-bold h-9"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roberto">Eng. Roberto Boarini</SelectItem>
                    <SelectItem value="ana">Arq. Ana Silva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Notas</Label>
                <Textarea onChange={(e) => setDistributionData({ ...distributionData, notes: e.target.value })} className="rounded-xl bg-muted/50 border-transparent min-h-[80px] text-xs" placeholder="Adicione observações..." />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleConfirmDistribution} disabled={!distributionData.assignee || !distributionData.type} className="rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest w-full">Confirmar Envio</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function RecordLifecycle({ currentPhase }: { currentPhase: Phase }) {
  const phases: Phase[] = ['CAPTURE', 'TRIAGE', 'ANALYSIS', 'DISTRIBUTION'];
  const currentIndex = phases.indexOf(currentPhase);

  return (
    <div className="w-full relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border/40 -translate-y-1/2 z-0" />
      <div className="relative z-10 flex justify-between">
        {phases.map((phase, idx) => {
          const isActive = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div key={phase} className="flex flex-col items-center gap-2 bg-background px-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                isActive ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-muted-foreground/20 text-muted-foreground",
                isCurrent && "ring-4 ring-primary/20 scale-110"
              )}>
                {isActive ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors",
                isActive ? "text-primary" : "text-muted-foreground/50"
              )}>{phase}</span>
            </div>
          )
        })}
      </div>
    </div>
  );
}

function DetailBlock({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{label}</p>
        <p className="font-bold text-foreground text-sm">{value || '-'}</p>
      </div>
    </div>
  );
}

function ActionOption({ title, desc, color, icon: Icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-background/50 transition-all duration-300 group text-left",
        "hover:border-transparent hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.01]",
        color
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm shrink-0 group-hover:bg-white/20 group-hover:text-current">
        <Icon size={18} />
      </div>
      <div>
        <h4 className="font-bold text-sm tracking-tight">{title}</h4>
        <p className="text-[10px] font-medium opacity-60 mt-0.5">{desc}</p>
      </div>
      <ArrowRightCircle size={18} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

export default TriagemDashboard;
