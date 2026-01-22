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

export function ObrasDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
  const [moduleView, setModuleView] = useState<'geral' | 'atividades'>('geral');
  const [activeTab, setActiveTab] = useState('vis-geral');
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any; type?: any }>({
    isOpen: false,
    title: "",
    type: "none"
  });
  const [selectedObra, setSelectedObra] = useState<number | null>(null);

  const openPlaceholder = (title: string, icon?: any, type: any = "none") => {
    setModalConfig({ isOpen: true, title, icon, type });
  };

  // Mock Obras
  const obras = [
    { id: 1, nome: "Edifício Sky Tower", endereco: "Av. Paulista, 1000", progresso: 78, status: "EM ANDAMENTO", entrega: "Dez/2024", equipe: 45, orcamento: "R$ 12.5M", custo: "R$ 9.2M" },
    { id: 2, nome: "Residencial Park View", endereco: "Rua das Flores, 500", progresso: 32, status: "EM ANDAMENTO", entrega: "Jun/2025", equipe: 28, orcamento: "R$ 4.8M", custo: "R$ 1.5M" },
    { id: 3, nome: "Galpão Logístico Alpha", endereco: "Rod. Anhanguera, km 20", progresso: 95, status: "RETA FINAL", entrega: "Ago/2024", equipe: 12, orcamento: "R$ 8.2M", custo: "R$ 7.9M" },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-32 no-scrollbar">
      {/* Context Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <HeaderAnimated title="Gestão de Obras" />
            {selectedObra && (
              <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] flex items-center gap-2 px-3 h-7">
                <ChevronRight size={14} /> {obras.find(o => o.id === selectedObra)?.nome.toUpperCase()}
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
              <Card className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl p-8 shadow-sm">
                <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground mb-6 opacity-60">Operações de Campo</h4>
                <nav className="space-y-2">
                  <LocalNavItem icon={LayoutGrid} label="Portfolio Global" active={!selectedObra} onClick={() => setSelectedObra(null)} />
                  <LocalNavItem icon={ClipboardList} label="Diários de Obra" onClick={() => openPlaceholder("Diário de Obra Digital", ClipboardList)} />
                  <LocalNavItem icon={Activity} label="Cronograma Master" onClick={() => openPlaceholder("Cronograma Master (Gantt)", Activity)} />
                  <LocalNavItem icon={Target} label="Metas Semanais" onClick={() => openPlaceholder("Metas & KPIs Semanais", Target)} />
                  <LocalNavItem icon={AlertTriangle} label="Ocorrências SST" onClick={() => openPlaceholder("Gestão de Ocorrências SST", AlertTriangle)} />
                  <LocalNavItem icon={CheckCircle2} label="Checklist Entrega" onClick={() => openPlaceholder("Checklist de Entrega Técnica", CheckCircle2)} />
                </nav>
              </Card>

              {selectedObra && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 p-8 border-dashed border-2 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <BarChart3 size={100} />
                    </div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest text-primary mb-6 relative z-10">Economic Status</h4>
                    <div className="space-y-6 relative z-10">
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1 opacity-60">Budget Projetado</p>
                        <p className="text-2xl font-black tracking-tighter">{obras.find(o => o.id === selectedObra)?.orcamento}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1 opacity-60">Custo Real Acumulado</p>
                        <p className="text-2xl font-black tracking-tighter text-primary">{obras.find(o => o.id === selectedObra)?.custo}</p>
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
                    {!selectedObra ? (
                      <motion.div
                        key="portfolio"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-6"
                      >
                        {obras.map((obra) => (
                          <div
                            key={obra.id}
                            className="p-1 rounded-[2.5rem] transition-all bg-transparent"
                            onClick={() => setSelectedObra(obra.id)}
                          >
                            <Card className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl hover:border-primary/20 transition-all cursor-pointer group shadow-sm">
                              <CardContent className="p-8">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                  <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-secondary/50 border border-white/5 flex items-center justify-center text-primary font-black shadow-inner group-hover:scale-110 transition-transform relative overflow-hidden">
                                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      <span className="text-xl relative z-10">{obra.id}</span>
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-4 mb-2">
                                        <h3 className="text-xl font-black tracking-tight leading-none group-hover:text-primary transition-colors">{obra.nome}</h3>
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">{obra.status}</Badge>
                                      </div>
                                      <div className="flex flex-wrap gap-4">
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-2 font-black uppercase tracking-widest opacity-60">
                                          <MapPin size={12} className="text-primary" /> {obra.endereco}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-2 font-black uppercase tracking-widest opacity-60">
                                          <Users size={12} className="text-primary" /> {obra.equipe} H.H
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-10 text-right">
                                    <div className="hidden sm:block">
                                      <p className="text-[9px] font-black uppercase text-muted-foreground opacity-50 mb-1 tracking-widest">Entrega</p>
                                      <p className="text-base font-black tracking-tight">{obra.entrega}</p>
                                    </div>
                                    <Button variant="ghost" className="w-12 h-12 rounded-[1rem] border border-white/5 group-hover:bg-primary group-hover:text-white transition-all p-0 hover:scale-110 active:scale-90 shadow-sm">
                                      <ChevronRight size={24} />
                                    </Button>
                                  </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                                  <div className="lg:col-span-8 space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                                      <span>Cronograma Físico</span>
                                      <span className="text-primary">{obra.progresso}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${obra.progresso}%` }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className="h-full bg-primary"
                                      />
                                    </div>
                                  </div>
                                  <div className="lg:col-span-4 flex justify-end gap-2">
                                    <Badge variant="secondary" className="bg-secondary/40 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 border border-white/5">Budget {obra.orcamento}</Badge>
                                    <Badge
                                      variant="secondary"
                                      className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 hover:bg-primary hover:text-white transition-all cursor-pointer"
                                      onClick={(e: any) => {
                                        e.stopPropagation();
                                        openPlaceholder(`Relatório BI: ${obra.nome}`, BarChart3);
                                      }}
                                    >
                                      Relatório BI
                                    </Badge>
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
                      >
                        <ObraDetailView
                          obra={obras.find(o => o.id === selectedObra)}
                          onBack={() => setSelectedObra(null)}
                          openPlaceholder={openPlaceholder}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
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

// Detail View Component
function ObraDetailView({ obra, onBack, openPlaceholder }: any) {
  if (!obra) return null;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Detail Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <Button onClick={onBack} variant="ghost" size="icon" className="rounded-2xl h-12 w-12 hover:bg-white/5 border border-white/5 shadow-sm">
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h2 className="text-3xl font-black tracking-tighter">{obra.nome}</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-2">
              <MapPin size={12} className="text-primary" /> {obra.endereco}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl h-12 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-background/50 backdrop-blur-xl border-border/40">
            <Settings size={18} /> Configurações
          </Button>
          <Button className="rounded-xl h-12 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-primary shadow-lg shadow-primary/20">
            <Camera size={18} /> Nova Evidência
          </Button>
        </div>
      </div>

      {/* Grid summarizing all departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Engenharia"
          value={`${obra.progresso}%`}
          sub="Físico-Financeiro"
          icon={Zap}
          color="text-primary"
          onClick={() => openPlaceholder("Engenharia Detalhada - " + obra.nome, Zap)}
        />
        <StatusCard
          title="Financeiro"
          value={obra.custo}
          sub="Realizado Acumulado"
          icon={DollarSign}
          color="text-emerald-500"
          onClick={() => openPlaceholder("Financeiro Obra - " + obra.nome, DollarSign)}
        />
        <StatusCard
          title="Suprimentos"
          value="14"
          sub="Pedidos em Trânsito"
          icon={Truck}
          color="text-amber-500"
          onClick={() => openPlaceholder("Suprimentos Obra - " + obra.nome, Truck)}
        />
        <StatusCard
          title="SST & Equipe"
          value={obra.equipe}
          sub="H.H Ativos no Local"
          icon={ShieldCheck}
          color="text-blue-500"
          onClick={() => openPlaceholder("SST & Equipe - " + obra.nome, ShieldCheck)}
        />
      </div>

      {/* Main Detail Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[3rem] border-white/5 bg-background/60 backdrop-blur-xl p-10 overflow-hidden shadow-2xl space-y-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black">Cronograma Crítico</h3>
            <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest px-4">Master View</Badge>
          </div>

          <div className="space-y-8">
            {[
              { title: 'Conclusão de Estrutura Pav. 12', date: '15/05', prog: 85 },
              { title: 'Início Revestimento Externo', date: '02/06', prog: 12 },
              { title: 'Instalação de Elevadores', date: '20/07', prog: 0 },
            ].map((m, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-black group-hover:text-primary transition-colors">{m.title}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Estimado para {m.date}</p>
                  </div>
                  <span className="text-xs font-black">{m.prog}%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary/40 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.prog}%` }} className="h-full bg-primary" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-wrap gap-4">
            <QuickTool icon={FileText} label="Gerar RDO" />
            <QuickTool icon={Mail} label="Notificar Equipe" />
            <QuickTool icon={BarChart3} label="Dashboard BI" />
            <QuickTool icon={MoreHorizontal} label="Opções" />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-white/5 bg-background/60 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-black text-sm">Status de Compliance</h4>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">100% Validado hoje</p>
              </div>
            </div>
            <div className="space-y-4">
              <ComplianceCheck label="Diário de Obra Assinado" checked />
              <ComplianceCheck label="EPIs Verificados" checked />
              <ComplianceCheck label="Checklist de Perímetro" checked />
            </div>
          </Card>

          <Card className="rounded-[2.5rem] border-white/5 bg-primary p-10 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">Próxima Medição</h4>
            <p className="text-3xl font-black tracking-tighter">15 Outubro</p>
            <Button variant="secondary" className="w-full mt-8 rounded-xl h-12 font-black uppercase text-[10px] tracking-widest bg-white text-primary hover:bg-white/90">
              Preparar Medição
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, value, sub, icon: Icon, color, onClick }: any) {
  return (
    <Card
      onClick={onClick}
      className="rounded-[2.5rem] border-white/5 bg-background/60 p-8 flex flex-col justify-between h-44 hover:border-primary/20 transition-all cursor-pointer group shadow-sm active:scale-95"
    >
      <div className="flex justify-between items-start">
        <div className={cn("p-4 rounded-3xl bg-secondary/50 group-hover:bg-primary/10 transition-colors", color)}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <Badge variant="secondary" className="text-[8px] font-black uppercase py-0.5 px-2 bg-muted/40">{sub}</Badge>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 opacity-60">{title}</p>
        <h3 className="text-3xl font-black tracking-tighter group-hover:text-primary transition-colors">{value}</h3>
      </div>
    </Card>
  );
}

function QuickTool({ icon: Icon, label }: any) {
  return (
    <Button variant="outline" className="rounded-2xl h-14 px-6 gap-3 font-black uppercase text-[9px] tracking-widest border-white/5 bg-white/2 hover:bg-white/5 shadow-sm">
      <Icon size={16} /> {label}
    </Button>
  );
}

function ComplianceCheck({ label, checked }: { label: string, checked: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-muted-foreground uppercase">{label}</span>
      {checked ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Clock size={16} className="text-amber-500" />}
    </div>
  );
}

export default ObrasDashboard;
