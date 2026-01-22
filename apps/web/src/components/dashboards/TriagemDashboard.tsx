"use client"

import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Search,
  Filter,
  Clock,
  Eye,
  History,
  Activity,
  Zap,
  ArrowRightCircle,
  ArrowLeftCircle,
  MoreVertical,
  ClipboardList,
  MessageSquare,
  Share,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ReusableKanbanBoard } from '@/components/tasks/ReusableKanbanBoard';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';
import { useRegistros } from '@/hooks/useRegistros';

export function TriagemDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
  const { registros, fetchRegistros, updateRegistroStatus } = useRegistros();
  const [moduleView, setModuleView] = useState<'pendentes' | 'atividades'>('pendentes');
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any }>({
    isOpen: false,
    title: "",
  });

  const openPlaceholder = (title: string, icon?: any) => {
    setModalConfig({ isOpen: true, title, icon });
  };

  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const openRecordDetail = (reg: any) => {
    setSelectedRecord(reg);
    setIsDetailOpen(true);
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-24">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <HeaderAnimated title="Triagem & Distribuição" />
          <p className="text-muted-foreground font-medium mt-1">
            Garantia de qualidade e compliance operacional: processamento de evidências de campo.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex p-1 bg-muted/20 rounded-xl border border-border/40 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModuleView('pendentes')}
              className={cn(
                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9 transition-all",
                moduleView === 'pendentes' ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:bg-white/5"
              )}
            >
              Motor de Triagem
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModuleView('atividades')}
              className={cn(
                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9 transition-all",
                moduleView === 'atividades' ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:bg-white/5"
              )}
            >
              Atividades Processadas
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {moduleView === 'pendentes' ? (
          <motion.div key="pendentes" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[600px]">
              <TriageColumn
                title="Novo Entry"
                count={registros.filter(r => r.status === 'REGISTRO').length}
                color="bg-blue-500"
              >
                {registros.filter(r => r.status === 'REGISTRO').map(reg => (
                  <TriageCard key={reg.id} reg={reg} onOpenDetail={() => openRecordDetail(reg)} onNext={() => updateRegistroStatus(reg.id, 'TRIAGEM')} />
                ))}
              </TriageColumn>

              <TriageColumn
                title="Análise Técnica"
                count={registros.filter(r => r.status === 'TRIAGEM').length}
                color="bg-amber-500"
              >
                {registros.filter(r => r.status === 'TRIAGEM').map(reg => (
                  <TriageCard
                    key={reg.id}
                    reg={reg}
                    onOpenDetail={() => openRecordDetail(reg)}
                    onBack={() => updateRegistroStatus(reg.id, 'REGISTRO')}
                    onNext={() => updateRegistroStatus(reg.id, 'REVISAO')}
                  />
                ))}
              </TriageColumn>

              <TriageColumn
                title="Pronto p/ Distribuição"
                count={registros.filter(r => (r.status as any) === 'REVISAO').length}
                color="bg-emerald-500"
              >
                {registros.filter(r => (r.status as any) === 'REVISAO').map(reg => (
                  <TriageCard
                    key={reg.id}
                    reg={reg}
                    onBack={() => updateRegistroStatus(reg.id, 'TRIAGEM')}
                    onOpenDetail={() => openRecordDetail(reg)}
                    isFinal
                    onDistribute={(dept) => openPlaceholder(`Distribuindo para ${dept}...`, Zap)}
                  />
                ))}
              </TriageColumn>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <StatCard title="Tempo Médio Triagem" value="45min" icon={Clock} color="text-primary" />
              <StatCard title="Records Distribuídos" value={registros.filter(r => r.status === 'DISTRIBUICAO').length} icon={Zap} color="text-emerald-500" />
              <StatCard title="Efficiency Score" value="94%" icon={Activity} color="text-blue-500" />
            </div>
          </motion.div>
        ) : (
          <motion.div key="atividades" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full min-h-[600px]">
            <ReusableKanbanBoard contextFilter="VAL" title="Fluxo de Aprovações & Compliance" />
          </motion.div>
        )}
      </AnimatePresence>

      <PlaceholderModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        icon={modalConfig.icon}
      />

      <RecordDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}

// Overhauled Helpers
function TriageColumn({ title, count, color, children }: any) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={cn("w-2 h-6 rounded-full", color)} />
          <h3 className="text-sm font-black uppercase tracking-widest opacity-80">{title}</h3>
        </div>
        <Badge variant="secondary" className="rounded-lg font-black text-[10px] px-2.5 bg-muted/30">
          {count}
        </Badge>
      </div>
      <div className="flex-1 space-y-4 no-scrollbar">
        {children}
        {count === 0 && (
          <div className="h-40 border-2 border-dashed border-border/20 rounded-[2rem] flex items-center justify-center text-muted-foreground/30 font-black text-[10px] uppercase tracking-widest">
            Vazio
          </div>
        )}
      </div>
    </div>
  );
}

function TriageCard({ reg, onNext, onBack, isFinal, onDistribute, onOpenDetail }: any) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="rounded-[2rem] border-border/40 bg-background/60 shadow-sm hover:border-primary/20 transition-all group overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <Badge className={cn(
              "text-[8px] font-black uppercase px-2",
              reg.prioridade === 'CRITICA' ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
            )}>
              {reg.prioridade}
            </Badge>
            <div className="flex gap-1">
              {onBack && (
                <Button variant="ghost" size="icon" onClick={onBack} className="h-7 w-7 rounded-lg text-muted-foreground hover:text-primary">
                  <ArrowLeftCircle size={16} />
                </Button>
              )}
              {onNext && (
                <Button variant="ghost" size="icon" onClick={onNext} className="h-7 w-7 rounded-lg text-primary hover:bg-primary/10">
                  <ArrowRightCircle size={18} />
                </Button>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-black text-sm tracking-tight leading-tight group-hover:text-primary transition-colors">
              {reg.texto || 'Ocorrência de Campo'}
            </h4>
            <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase opacity-60">
              {reg.refCodigo} • @{reg.author?.nome}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/20">
            <Button
              variant="link"
              className="p-0 h-auto text-[9px] font-black uppercase tracking-widest text-primary hover:no-underline"
              onClick={onOpenDetail}
            >
              <Eye size={12} className="mr-1" /> Ver Detalhes
            </Button>

            {isFinal && (
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowOptions(!showOptions)}
                  className="h-8 rounded-lg font-black text-[9px] uppercase tracking-widest bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                >
                  Distribuir <Zap size={10} className="ml-1" />
                </Button>

                <AnimatePresence>
                  {showOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full right-0 mb-2 w-52 bg-background border border-border/40 rounded-2xl shadow-xl z-50 p-2 space-y-1"
                    >
                      <DistributionOption
                        label="Engenharia Core"
                        sub="Projetos & Disciplinas"
                        icon={Layers}
                        onClick={() => onDistribute('ENG')}
                      />
                      <DistributionOption
                        label="Manutenção / Canteiro"
                        sub="Execução de Campo"
                        icon={Zap}
                        onClick={() => onDistribute('MAN')}
                      />
                      <DistributionOption
                        label="Suprimentos"
                        sub="Impacto em Custo"
                        icon={ShoppingCart}
                        onClick={() => onDistribute('PUR')}
                      />
                      <DistributionOption
                        label="Financeiro"
                        sub="Aprovação de Verba"
                        icon={DollarSign}
                        onClick={() => onDistribute('FIN')}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DistributionOption({ label, sub, icon: Icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary/5 text-left group transition-all"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-tight">{label}</p>
        <p className="text-[8px] font-bold text-muted-foreground opacity-60 leading-none">{sub}</p>
      </div>
    </button>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="rounded-[2rem] border-border/40 bg-background/60 p-6 flex items-center justify-between border-b-4 border-b-primary shadow-sm hover:translate-y-[-2px] transition-all">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 opacity-60">{title}</p>
        <h3 className="text-2xl font-black tracking-tight">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-2xl bg-muted/50", color)}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
    </Card>
  );
}

function ShoppingCart({ size, className }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
  );
}

function DollarSign({ size, className }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
  );
}

function RecordDetailModal({ isOpen, onClose, record }: any) {
  if (!record) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-background border border-border/40 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-1">
                    {record.refCodigo} • Detalhes da Evidência
                  </Badge>
                  <h2 className="text-3xl font-black tracking-tighter leading-tight">
                    {record.texto || 'Ocorrência de Campo s/ Título'}
                  </h2>
                </div>
                <Button onClick={onClose} variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-white/5">
                  <XCircle size={24} className="text-muted-foreground" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-8 py-8 border-y border-border/20">
                <div className="space-y-6">
                  <DetailItem label="Autor do Registro" value={record.author?.nome} icon={User} />
                  <DetailItem label="Projeto / Obra" value={record.project?.nome || 'Geral'} icon={Building2} />
                </div>
                <div className="space-y-6">
                  <DetailItem label="Timestamp" value={new Date(record.timestamp || Date.now()).toLocaleString()} icon={Clock} />
                  <DetailItem label="Prioridade" value={record.prioridade} icon={AlertCircle} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Contexto de Triagem</h4>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  Este registro foi capturado via mobile e requer avaliação técnica para distribuição departamental.
                  As evidências fotográficas e coordenadas de GPS foram validadas no ato da captura.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs bg-primary shadow-lg shadow-primary/20">
                  Gerar PDF de Evidência
                </Button>
                <Button variant="outline" className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs px-8">
                  <Share size={18} />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function DetailItem({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-2xl bg-muted/30 text-primary">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-0.5">{label}</p>
        <p className="font-bold text-sm tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function User({ size, className }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  );
}

function Building2({ size, className }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
  );
}

export default TriagemDashboard;
