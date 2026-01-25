"use client"

import React, { useState } from 'react';
import {
  CalendarDays,
  ClipboardList,
  HardHat,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  Search,
  Filter,
  Plus,
  MoreVertical,
  ChevronRight,
  LayoutGrid,
  List,
  Camera,
  Activity,
  Zap,
  Building2,
  Clock,
  Target,
  BarChart3,
  Users,
  ArrowLeft,
  Settings,
  ShieldCheck,
  Truck,
  DollarSign,
  FileText,
  Mail,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import { ReusableKanbanBoard } from '@/components/tasks/ReusableKanbanBoard';
import { getApiUrl } from '@/lib/api';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';
import { ObraDetailPage } from './ObraDetailPage';

import { useAppFlow } from '@/store/useAppFlow';
import { toast } from 'sonner';

// Obras Sub-pages
import { ObrasDiarios } from './obras/ObrasDiarios';
import { ObrasCronograma } from './obras/ObrasCronograma';
import { ObrasMetas } from './obras/ObrasMetas';
import { ObrasSST } from './obras/ObrasSST';
import { ObrasEntrega } from './obras/ObrasEntrega';

export function ObrasDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
  const [moduleView, setModuleView] = useState<'geral' | 'atividades'>('geral');
  const [currentSubView, setCurrentSubView] = useState<'portfolio' | 'diarios' | 'cronograma' | 'metas' | 'sst' | 'entrega'>('portfolio');
  const [activeTab, setActiveTab] = useState('vis-geral');
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any; type?: any }>({
    isOpen: false,
    title: "",
    type: "none"
  });
  const [selectedObraId, setSelectedObraId] = useState<string | null>(null);

  const { projects } = useAppFlow();

  // Filter only active or relevant projects for Construction Management
  const activeObras = projects.filter(p => p.status === 'ATIVA' || p.status === 'CONCLUIDA' || p.status === 'PLANEJAMENTO');

  const openPlaceholder = (title: string, icon?: any, type: any = "none") => {
    setModalConfig({ isOpen: true, title, icon, type });
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-32 no-scrollbar">
      {/* Context Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <HeaderAnimated title="Gestão de Obras" />
            {selectedObraId && (
              <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] flex items-center gap-2 px-3 h-7">
                <ChevronRight size={14} /> {activeObras.find(o => o.id === selectedObraId)?.nome.toUpperCase()}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground font-medium mt-1">
            Engenharia de campo, diário de obra e controle físico-financeiro em tempo real.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex p-1 bg-muted/20 rounded-2xl border border-border/40 shrink-0 backdrop-blur-xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModuleView('geral')}
              className={cn(
                "rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10 transition-all",
                moduleView === 'geral' ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:bg-white/5"
              )}
            >
              Visão Geral
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModuleView('atividades')}
              className={cn(
                "rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10 transition-all",
                moduleView === 'atividades' ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:bg-white/5"
              )}
            >
              Canteiro
            </Button>
          </div>
          {/* Note: In App.tsx we handle 'new-obra' globally to show the wizard. 
              But for consistency, we'll keep the button here. In a real app, 
              this would trigger the same state or dispatch an event. */}
          <Button
            onClick={() => openPlaceholder("Registro de Nova Obra", Plus, "obra")}
            className="rounded-xl h-11 px-8 font-black uppercase tracking-widest text-[11px] gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={20} /> Nova Obra
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {moduleView === 'geral' ? (
          <motion.div
            key="geral"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Local Context Menu */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="rounded-2xl border-border/40 bg-background/60 backdrop-blur-xl p-8 shadow-sm">
                <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground mb-6 opacity-60">Operações de Campo</h4>
                <nav className="space-y-2">
                  <LocalNavItem
                    icon={LayoutGrid}
                    label="Portfolio Global"
                    active={currentSubView === 'portfolio'}
                    onClick={() => {
                      setCurrentSubView('portfolio');
                      setSelectedObraId(null);
                    }}
                  />
                  <LocalNavItem
                    icon={ClipboardList}
                    label="Diários de Obra"
                    active={currentSubView === 'diarios'}
                    onClick={() => setCurrentSubView('diarios')}
                  />
                  <LocalNavItem
                    icon={Activity}
                    label="Cronograma Master"
                    active={currentSubView === 'cronograma'}
                    onClick={() => setCurrentSubView('cronograma')}
                  />
                  <LocalNavItem
                    icon={Target}
                    label="Metas Semanais"
                    active={currentSubView === 'metas'}
                    onClick={() => setCurrentSubView('metas')}
                  />
                  <LocalNavItem
                    icon={AlertTriangle}
                    label="Ocorrências SST"
                    active={currentSubView === 'sst'}
                    onClick={() => setCurrentSubView('sst')}
                  />
                  <LocalNavItem
                    icon={CheckCircle2}
                    label="Checklist Entrega"
                    active={currentSubView === 'entrega'}
                    onClick={() => setCurrentSubView('entrega')}
                  />
                </nav>
              </Card>

              {selectedObraId && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="rounded-2xl border-primary/20 bg-primary/5 p-8 border-dashed border-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <BarChart3 size={100} />
                    </div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest text-primary mb-6 relative z-10">Economic Status</h4>
                    <div className="space-y-6 relative z-10">
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1 opacity-60">Budget Projetado</p>
                        <p className="text-2xl font-black tracking-tighter">R$ 1.5M</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1 opacity-60">Custo Real Acumulado</p>
                        <p className="text-2xl font-black tracking-tighter text-primary">R$ 450k</p>
                      </div>
                      <div className="pt-4 border-t border-primary/10">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          <span>Eficiência</span>
                          <span className="text-emerald-500">+12.4%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9 space-y-8">
              {currentSubView === 'portfolio' && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2 overflow-x-auto no-scrollbar">
                    <TabsList className="bg-transparent h-auto p-0 gap-10">
                      <TabItem value="vis-geral" icon={LayoutGrid} label="Portfolio Ativo" isActive={activeTab === 'vis-geral'} />
                      <TabItem value="mapa" icon={MapPin} label="Geolocalização" isActive={activeTab === 'mapa'} />
                      <TabItem value="inspecao" icon={ClipboardList} label="Qualidade" isActive={activeTab === 'inspecao'} />
                      <TabItem value="equipe" icon={HardHat} label="Gestão de Equipes" isActive={activeTab === 'equipe'} />
                    </TabsList>
                  </div>

                  <TabsContent value="vis-geral" className="space-y-6 mt-0">
                    <AnimatePresence mode="wait">
                      {!selectedObraId ? (
                        <motion.div
                          key="portfolio"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          className="space-y-6"
                        >
                          {activeObras.length === 0 && (
                            <Card className="p-12 text-center rounded-2xl bg-muted/5 border-dashed border-2">
                              <Building2 size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
                              <h3 className="text-xl font-black text-muted-foreground">Nenhuma Obra Ativa</h3>
                              <p className="text-sm opacity-60 mt-2">Use o botão "Nova Obra" para começar.</p>
                            </Card>
                          )}

                          {activeObras.map((obra) => (
                            <div
                              key={obra.id}
                              className="p-1 rounded-2xl transition-all bg-transparent"
                              onClick={() => setSelectedObraId(obra.id)}
                            >
                              <Card className="rounded-2xl border-border/40 bg-background/60 backdrop-blur-xl hover:border-primary/20 transition-all cursor-pointer group shadow-sm">
                                <CardContent className="p-8">
                                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                      <div className="w-16 h-16 rounded-[1.5rem] bg-secondary/50 border border-white/5 flex items-center justify-center text-primary font-black shadow-inner group-hover:scale-110 transition-transform relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-xl relative z-10">OB</span>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-4 mb-2">
                                          <h3 className="text-xl font-black tracking-tight leading-none group-hover:text-primary transition-colors">{obra.nome}</h3>
                                          <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">{obra.status}</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                          <p className="text-[10px] text-muted-foreground flex items-center gap-2 font-black uppercase tracking-widest opacity-60">
                                            <MapPin size={12} className="text-primary" /> {obra.endereco || 'Local não definido'}
                                          </p>
                                          <p className="text-[10px] text-muted-foreground flex items-center gap-2 font-black uppercase tracking-widest opacity-60">
                                            <Users size={12} className="text-primary" /> 12 H.H
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-10 text-right">
                                      <div className="hidden sm:block">
                                        <p className="text-[9px] font-black uppercase text-muted-foreground opacity-50 mb-1 tracking-widest">Entrega</p>
                                        <p className="text-base font-black tracking-tight">Em Planejamento</p>
                                      </div>
                                      <Button variant="ghost" className="w-12 h-12 rounded-[1rem] border border-white/5 group-hover:bg-primary group-hover:text-white transition-all p-0 hover:scale-110 active:scale-90 shadow-sm">
                                        <ChevronRight size={24} />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ))}
                        </motion.div>
                      ) : (

                        <motion.div
                          key="detail"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="fixed inset-0 z-50 bg-background"
                        >
                          <ObraDetailPage
                            obra={activeObras.find(o => o.id === selectedObraId)!}
                            onBack={() => setSelectedObraId(null)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </TabsContent>
                </Tabs>
              )}

              {currentSubView === 'diarios' && <ObrasDiarios />}
              {currentSubView === 'cronograma' && <ObrasCronograma />}
              {currentSubView === 'metas' && <ObrasMetas />}
              {currentSubView === 'sst' && <ObrasSST />}
              {currentSubView === 'entrega' && <ObrasEntrega />}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="atividades"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="h-full min-h-[600px]"
          >
            <ReusableKanbanBoard contextFilter="OBRA" title="Roadmap de Atividades de Campo" />
          </motion.div>
        )}
      </AnimatePresence>

      <PlaceholderModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        icon={modalConfig.icon}
        type={modalConfig.type}
      />
    </div>
  );
}

function LocalNavItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all group",
        active
          ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      )}
    >
      <Icon size={18} className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "text-primary")} strokeWidth={2.5} />
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight size={16} className={cn("opacity-0 transition-all", active ? "opacity-100" : "group-hover:opacity-100 group-hover:translate-x-1")} />
    </button>
  );
}

function TabItem({ value, icon: Icon, label, isActive }: any) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "relative bg-transparent h-14 rounded-none px-0 gap-3 text-[10px] font-black uppercase tracking-widest transition-all border-none shadow-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none",
        isActive ? "text-primary" : "text-muted-foreground hover:text-white/60"
      )}
    >
      <Icon size={18} /> {label}
      {isActive && (
        <motion.div
          layoutId="active-tab-obras"
          className="absolute -bottom-[9px] left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-5px_15px_rgba(var(--primary),0.5)]"
        />
      )}
    </TabsTrigger>
  );
}

// Detail View Logic has been moved to ObraDetailPage.tsx

export default ObrasDashboard;
