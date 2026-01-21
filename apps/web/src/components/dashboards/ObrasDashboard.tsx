import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, MapPin, Users, BarChart3, Calendar, Plus, Search, CheckCircle2,
  ShieldCheck, FileText, MessageSquare, ArrowRight, LayoutGrid, Columns, List,
  Home, Building, Zap, Factory, Truck, Settings, Hammer, HardHat, Check, DollarSign
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, Client, DashboardTab } from '@/types';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import AnimatedTextCycle from '@/components/ui/AnimatedTextCycle';
import { ShaderAnimation } from '@/components/ui/ShaderAnimation';

export function ObrasDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'kanban' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nome: '',
    codigoInterno: `V-OB-${Math.floor(Math.random() * 9000) + 1000}`,
    clientId: '',
    responsavelTecnico: '',
    localizacao: '',
    areaConstruida: '',
    prazoEstimado: '',
    urgencia: 'MEDIA',
    tipoObra: 'RESIDENCIAL_ALTO_PADRAO',
    // Technical Params
    estrutura: 'CONCRETO_ARMADO',
    pavimentos: '1',
    subsolo: false,
    piscina: false,
    condominio: false,
    corpoBombeiros: false,
    vigilanciaSanitaria: false,
    operacaoContinua: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(getApiUrl('/api/projects')),
        fetch(getApiUrl('/api/clients'))
      ]);
      if (pRes.ok) setProjects(await pRes.json());
      if (cRes.ok) setClients(await cRes.json());
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(getApiUrl('/api/projects'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erro ao configurar ecossistema da obra');

      toast.success('Ecossistema Operacional da Obra ativado com sucesso!');

      // Wait a bit to show animation
      setTimeout(() => {
        setIsModalOpen(false);
        resetForm();
        fetchData();
      }, 3000);
    } catch (error: any) {
      toast.error(error.message);
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      codigoInterno: `V-OB-${Math.floor(Math.random() * 9000) + 1000}`,
      clientId: '',
      responsavelTecnico: '',
      localizacao: '',
      areaConstruida: '',
      prazoEstimado: '',
      urgencia: 'MEDIA',
      tipoObra: 'RESIDENCIAL_ALTO_PADRAO',
      estrutura: 'CONCRETO_ARMADO',
      pavimentos: '1',
      subsolo: false,
      piscina: false,
      condominio: false,
      corpoBombeiros: false,
      vigilanciaSanitaria: false,
      operacaoContinua: false,
    });
    setCurrentStep(1);
    setIsSaving(false);
  };

  if (loading) return <div className="p-8 font-black uppercase tracking-widest text-muted-foreground animate-pulse">Iniciando Vercflow Intelligence...</div>;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden font-sans">
      {/* Premium Header */}
      <div className="p-6 border-b bg-background/95 backdrop-blur-sm shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-black tracking-tighter">Centro de Comando</h1>
              <AnimatedTextCycle
                words={['de Obras', 'Estratégico', 'Operacional', 'High-End']}
                className="text-3xl font-black tracking-tighter text-primary"
                interval={3000}
              />
            </div>
            <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-60">VERC Intelligence - Lifecycle v2.5</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex p-1 bg-muted/20 rounded-xl border border-border/40">
              <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')} className={cn("h-8 w-8 rounded-lg", viewMode === 'grid' && "bg-background shadow-sm text-primary")}><LayoutGrid size={14} /></Button>
              <Button variant="ghost" size="icon" onClick={() => setViewMode('kanban')} className={cn("h-8 w-8 rounded-lg", viewMode === 'kanban' && "bg-background shadow-sm text-primary")}><Columns size={14} /></Button>
              <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} className={cn("h-8 w-8 rounded-lg", viewMode === 'list' && "bg-background shadow-sm text-primary")}><List size={14} /></Button>
            </div>
            <div className="w-px h-8 bg-border/40 mx-1" />
            <Button onClick={() => setIsModalOpen(true)} className="h-10 rounded-xl font-black uppercase tracking-widest px-6 shadow-glow bg-primary hover:translate-y-[-1px] transition-all">
              <Plus size={16} className="mr-2" /> Ativar Obra
            </Button>
          </div>
        </div>

        {/* Access Panel */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { label: 'Novo Cliente', icon: Users, color: 'bg-blue-500/10 text-blue-600', action: () => onTabChange('clientes') },
            { label: 'Controle de Frota', icon: Truck, color: 'bg-orange-500/10 text-orange-600', action: () => onTabChange('estoque') },
            { label: 'Atividades IA', icon: Zap, color: 'bg-primary/10 text-primary', action: () => onTabChange('atividades') },
            { label: 'Financeiro', icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-600', action: () => onTabChange('financeiro') },
            { label: 'Documentação', icon: FileText, color: 'bg-zinc-500/10 text-zinc-600', action: () => onTabChange('gestao-projetos') },
            { label: 'Configurações', icon: Settings, color: 'bg-secondary/10 text-muted-foreground', action: () => onTabChange('config') },
          ].map((item, idx) => (
            <button key={idx} onClick={item.action} className="group flex flex-col items-center justify-center p-4 rounded-3xl bg-background/40 border border-border/40 hover:border-primary/40 hover:bg-background/80 transition-all">
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm", item.color)}><item.icon size={18} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 group-hover:text-foreground transition-colors">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-20 scrollbar-thin space-y-8">
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Card key={p.id} onClick={() => navigate(`/obras/${p.id}`)} className="group cursor-pointer rounded-[2.5rem] overflow-hidden border-border/40 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-background/60 backdrop-blur-xl">
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{p.codigoInterno}</p>
                      <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{p.nome}</h3>
                    </div>
                    <Badge variant="outline" className={cn("text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full", p.status === 'ATIVA' ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600')}>
                      {p.status}
                    </Badge>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-border/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center"><Users size={14} className="text-muted-foreground" /></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Contratante</p>
                        <p className="text-sm font-semibold truncate">{p.client?.nome || 'Não vinculado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center"><MapPin size={14} className="text-muted-foreground" /></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Localização</p>
                        <p className="text-sm font-semibold truncate line-clamp-1">{p.endereco || 'Localização não definida'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-border/10">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-tighter leading-none mb-0.5">Categorização</span>
                      <span className="text-[10px] font-bold uppercase text-primary">{p.tipoObra?.replace(/_/g, ' ') || 'Indefinido'}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTabChange('gestao-projetos');
                      }}
                      className="h-8 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all"
                    >
                      Gerenciar <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl bg-background">
          <DialogHeader className="sr-only">
            <DialogTitle>Verc Intelligence: Setup de Nova Obra</DialogTitle>
          </DialogHeader>
          <div className="flex h-[750px] overflow-hidden">
            <div className="w-72 bg-secondary/10 p-10 border-r border-border/20 flex flex-col justify-between backdrop-blur-md shrink-0">
              <div className="space-y-12">
                <div className="w-16 h-16 rounded-[2rem] bg-primary flex items-center justify-center text-white shadow-glow animate-pulse"><Zap size={32} /></div>
                <div className="space-y-8">
                  {[
                    { s: 1, l: 'Identificação', d: 'Dados mestres da obra' },
                    { s: 2, l: 'Classificação', d: 'Tipo estratégico de uso' },
                    { s: 3, l: 'Parâmetros', d: 'Definição das disciplinas' },
                    { s: 4, l: 'Inteligência', d: 'Ecossistema gerado' },
                  ].map(step => (
                    <div key={step.s} className={cn("transition-all duration-500 relative", currentStep === step.s ? "opacity-100 translate-x-2" : "opacity-30")}>
                      <div className="flex items-center gap-4">
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2", currentStep === step.s ? "border-primary bg-primary text-white" : "border-muted-foreground/40")}>{step.s}</div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight leading-none">{step.l}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.3em]">VERC INTELLIGENCE v2.5</p>
            </div>

            <div className="flex-1 flex flex-col bg-background/50 relative overflow-hidden">
              {isSaving && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-white bg-black">
                  <ShaderAnimation />
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/20 backdrop-blur-sm">
                    <div className="w-20 h-20 rounded-full border-4 border-white/20 border-t-white animate-spin mb-8" />
                    <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Verc Intelligence</h2>
                    <p className="text-[10px] font-black opacity-70 tracking-[0.4em] uppercase">Sincronizando Ecossistema de Obra...</p>
                  </div>
                </div>
              )}

              <div className="p-12 flex-1 overflow-y-auto scrollbar-none space-y-12">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                      <div className="space-y-1">
                        <h4 className="text-2xl font-black tracking-tight text-zinc-900">Identificação da Obra</h4>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">Etapa Obrigatória de Registro</p>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-2">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Título Operacional</Label>
                          <Input value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} placeholder="Ex: Casa Lago Sul – Edifício Mirante" className="h-14 rounded-2xl text-lg font-bold border-zinc-200" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Cliente / Contratante</Label>
                          <Select value={formData.clientId} onValueChange={v => setFormData({ ...formData, clientId: v })}>
                            <SelectTrigger className="h-14 rounded-2xl border-zinc-200"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent className="rounded-2xl">
                              {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Responsável Técnico</Label>
                          <Input value={formData.responsavelTecnico} onChange={e => setFormData({ ...formData, responsavelTecnico: e.target.value })} placeholder="Nome (CREA/CAU)" className="h-14 rounded-2xl border-zinc-200" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="space-y-8">
                      <div className="space-y-1">
                        <h4 className="text-2xl font-black tracking-tight text-zinc-900">Classificação Estratégica</h4>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">Define a Inteligência Operacional</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'RESIDENCIAL_SIMPLES', l: 'Residencial Simples', i: Home },
                          { id: 'RESIDENCIAL_ALTO_PADRAO', l: 'Residencial Alto Padrão', i: ShieldCheck },
                          { id: 'COMERCIAL', l: 'Comercial', i: Building2 },
                          { id: 'INDUSTRIAL', l: 'Industrial', i: Factory },
                          { id: 'HOSPITALAR', l: 'Hospitalar / Saúde', i: HardHat },
                          { id: 'REFORMA', l: 'Reforma / Ampliação', i: Hammer },
                        ].map(t => (
                          <button key={t.id} onClick={() => setFormData({ ...formData, tipoObra: t.id })} className={cn("flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all gap-3 overflow-hidden", formData.tipoObra === t.id ? "border-zinc-900 bg-zinc-900 text-white shadow-xl" : "border-zinc-100 text-zinc-400 hover:border-zinc-200")}>
                            <t.i size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{t.l}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <div className="space-y-1">
                        <h4 className="text-2xl font-black tracking-tight text-zinc-900">Parâmetros Técnicos</h4>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">Habilitação de Módulos</p>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: 'subsolo', l: 'A obra possui Subsolo?' },
                          { id: 'piscina', l: 'Incluir Piscina / Lazer?' },
                          { id: 'condominio', l: 'Situada em Condomínio?' },
                          { id: 'corpoBombeiros', l: 'Exige Projeto Incêndio?' },
                          { id: 'vigilanciaSanitaria', l: 'Exige Vigilância Sanitária?' },
                        ].map(opt => (
                          <div key={opt.id} className="flex items-center justify-between p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
                            <span className="text-xs font-black uppercase text-zinc-600 tracking-tight">{opt.l}</span>
                            <Switch checked={(formData as any)[opt.id]} onCheckedChange={(v) => setFormData({ ...formData, [opt.id]: v })} />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                      <div className="text-center space-y-4 py-8">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
                          <Check size={40} className="animate-bounce" />
                        </div>
                        <h4 className="text-2xl font-black text-zinc-900">Inteligência Operacional</h4>
                        <p className="text-zinc-500 text-sm max-w-xs mx-auto font-medium leading-relaxed">O ecossistema VERCFLOW está pronto para ser ativado para esta obra.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-10 border-t border-zinc-100 flex justify-between items-center bg-white/80 backdrop-blur-md">
                <Button variant="ghost" className="rounded-2xl font-black uppercase tracking-widest opacity-40 text-[10px]" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <div className="flex gap-4">
                  {currentStep > 1 && <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="rounded-2xl h-12 font-black uppercase tracking-widest px-8 text-[10px]">Voltar</Button>}
                  {currentStep < 4 ? (
                    <Button onClick={() => setCurrentStep(currentStep + 1)} className="rounded-2xl h-12 font-black uppercase tracking-widest px-8 bg-zinc-900 text-white text-[10px]">Avançar</Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={isSaving} className="rounded-2xl h-12 font-black uppercase tracking-widest px-12 bg-zinc-900 text-white shadow-glow text-[10px]">{isSaving ? 'Ativando...' : 'Ativar Sistema'}</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ObrasDashboard;
