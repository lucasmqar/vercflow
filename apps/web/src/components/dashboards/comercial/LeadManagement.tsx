"use client"

import React, { useState } from 'react';
import {
    Search,
    Filter,
    ChevronRight,
    MapPin,
    Building2,
    Clock,
    CheckCircle2,
    Calendar,
    Paperclip,
    ShieldCheck,
    Briefcase,
    LayoutDashboard
} from 'lucide-react';
import { MapSelector } from '@/components/shared/MapSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppFlow } from '@/store/useAppFlow';
import { Lead } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function LeadListPage({ onSelect }: { onSelect: (lead: Lead) => void }) {
    const { leads } = useAppFlow();
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'LIST' | 'KANBAN'>('LIST');

    const filteredLeads = leads.filter(l =>
        l.nomeObra.toLowerCase().includes(search.toLowerCase()) ||
        l.client?.nome.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Buscar por obra ou cliente..."
                        className="pl-10 h-11 rounded-xl border-white/10 bg-white/5"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 bg-background/50 p-1 rounded-xl border border-white/5">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode('LIST')}
                        className={cn("rounded-lg text-[10px] font-black uppercase tracking-widest", viewMode === 'LIST' ? "bg-white/10 text-white" : "text-muted-foreground")}
                    >
                        Lista
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode('KANBAN')}
                        className={cn("rounded-lg text-[10px] font-black uppercase tracking-widest", viewMode === 'KANBAN' ? "bg-white/10 text-white" : "text-muted-foreground")}
                    >
                        Kanban
                    </Button>
                </div>
            </div>

            {viewMode === 'KANBAN' ? (
                <div className="grid grid-cols-4 gap-4 overflow-x-auto pb-4">
                    {['NOVO', 'EM_QUALIFICACAO', 'QUALIFICADO', 'CONVERTIDO'].map(status => (
                        <div key={status} className="min-w-[280px] space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{status.replace('_', ' ')}</p>
                                <Badge variant="secondary" className="text-[9px] h-5">{filteredLeads.filter(l => l.status === status).length}</Badge>
                            </div>
                            <div className="space-y-3">
                                {filteredLeads.filter(l => l.status === status).map(lead => (
                                    <div key={lead.id} onClick={() => onSelect(lead)} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 cursor-pointer transition-all">
                                        <p className="font-bold text-xs mb-1">{lead.nomeObra}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{lead.client?.nome || 'Cliente Desconhecido'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (

                filteredLeads.length === 0 ? (
                    <div className="py-20 text-center opacity-30">
                        <LayoutDashboard size={64} className="mx-auto mb-4" />
                        <p className="font-black uppercase tracking-widest text-sm">Nenhum lead encontrado</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredLeads.map((lead) => (
                            <motion.div
                                key={lead.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.01 }}
                                className="cursor-pointer"
                                onClick={() => onSelect(lead)}
                            >
                                <Card className="rounded-2xl border-white/10 bg-background/40 backdrop-blur-xl hover:border-primary/30 transition-all group overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors font-black">
                                                    {lead.nomeObra.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="font-black text-lg group-hover:text-primary transition-colors">{lead.nomeObra}</h3>
                                                        <Badge className={cn(
                                                            "text-[8px] font-black uppercase tracking-widest border-none",
                                                            lead.status === 'NOVO' ? "bg-blue-500/10 text-blue-500" :
                                                                lead.status === 'EM_QUALIFICACAO' ? "bg-amber-500/10 text-amber-500" :
                                                                    "bg-emerald-500/10 text-emerald-500"
                                                        )}>
                                                            {lead.status.replace('_', ' ')}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex gap-4 opacity-60">
                                                        <span className="text-[10px] font-bold uppercase flex items-center gap-1.5"><MapPin size={12} /> {lead.localizacao}</span>
                                                        <span className="text-[10px] font-bold uppercase flex items-center gap-1.5"><Building2 size={12} /> {lead.tipoObra}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right hidden md:block">
                                                    <p className="text-[9px] font-black uppercase opacity-40 mb-1 tracking-widest">Criado em</p>
                                                    <p className="text-xs font-bold">{new Date(lead.criadoEm).toLocaleDateString()}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary group-hover:text-white">
                                                    <ChevronRight size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}

export function LeadDetailPage({ lead, onBack, onConvert }: { lead: Lead, onBack: () => void, onConvert: (lead: Lead) => void }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl border border-white/5 h-11 w-11">
                    <LayoutDashboard size={20} className="text-primary rotate-180" />
                </Button>
                <div>
                    <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] tracking-widest uppercase mb-1">DETALHES DO LEAD</Badge>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">{lead.nomeObra}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-2xl border-white/5 bg-background/40 backdrop-blur-xl p-8">
                        <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Informações do Cliente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InfoBlock label="Nome / Razão Social" value={lead.client?.nome || 'Não definido'} />
                            <InfoBlock label="Documento" value={lead.client?.documento || 'Não definido'} />
                            <InfoBlock label="Contatos" value={lead.client?.contatos || 'Não definido'} />
                            <InfoBlock label="Localização da Obra" value={lead.localizacao} />
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-white/5 bg-background/40 backdrop-blur-xl p-8">
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                            <h3 className="text-xl font-black uppercase tracking-widest">DNA do Projeto</h3>
                            <Badge className="bg-blue-500/10 text-blue-500 border-none font-black uppercase text-[8px]">{lead.classificacao?.natureza}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <InfoBlock label="Tipologia Física" value={lead.classificacao?.tipologia.replace(/_/g, ' ') || 'N/A'} />
                            <InfoBlock label="Zona Territorial" value={lead.classificacao?.contexto || 'N/A'} />
                            <InfoBlock label="Inserção" value={lead.classificacao?.subcontexto.replace(/_/g, ' ') || 'N/A'} />
                            <InfoBlock label="Padrão" value={lead.classificacao?.padrao || 'N/A'} />
                            <InfoBlock label="Finalidade" value={lead.classificacao?.finalidade || 'N/A'} />
                            <div className="col-span-1 md:col-span-3">
                                <p className="text-[9px] font-black uppercase text-muted-foreground opacity-50 tracking-widest mb-1.5">Objeto do Contrato</p>
                                <div className="flex flex-wrap gap-2">
                                    {lead.classificacao?.objetos.map(o => (
                                        <Badge key={o} variant="outline" className="text-[9px] uppercase border-white/10">{o.replace(/_/g, ' ')}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {lead.classificacao?.requerLegalizacao && (
                            <div className="mt-8 p-6 rounded-xl bg-amber-500/5 border border-amber-500/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <ShieldCheck size={18} className="text-amber-500" />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-amber-600">Requisitos Normativos</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoBlock label="Órgãos" value={lead.classificacao?.legalizacao?.orgaos.join(', ') || 'N/A'} />
                                    <InfoBlock label="Cenário de Regularização" value={lead.classificacao?.legalizacao?.cenario.replace(/_/g, ' ') || 'N/A'} />
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="rounded-2xl border-white/5 bg-background/40 backdrop-blur-xl p-8">
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                            <h3 className="text-xl font-black uppercase tracking-widest">Dossiê da Obra</h3>
                            <Badge variant="outline" className="border-white/10 text-[9px] font-black">{lead.attachments?.length || 0} DOCUMENTOS</Badge>
                        </div>

                        {lead.attachments && lead.attachments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {lead.attachments.map(file => (
                                    <div key={file.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <Paperclip size={16} className="text-primary" />
                                            <div>
                                                <p className="text-xs font-bold truncate max-w-[150px]">{file.name}</p>
                                                <p className="text-[8px] uppercase font-black text-muted-foreground">{file.type} • {(file.size / 1024).toFixed(0)}KB</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                            <Paperclip size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center opacity-30 border-2 border-dashed border-white/5 rounded-xl">
                                <Paperclip size={40} className="mx-auto mb-4" />
                                <p className="font-black uppercase tracking-widest text-[10px]">Nenhum arquivo anexado ao dossiê</p>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-2xl border-white/5 bg-primary/5 p-8 border-dashed border-2">
                        <h3 className="text-xl font-black uppercase text-primary mb-4">Análise Estratégica</h3>
                        <p className="text-xs text-muted-foreground mb-6 font-medium">
                            A conversão deste lead em orçamento exige a validação do escopo técnico de acordo com a classificação do projeto.
                        </p>
                        <Button
                            onClick={() => onConvert(lead)}
                            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20"
                        >
                            Gerar Orçamento Técnico
                        </Button>
                    </Card>

                    <Card className="rounded-2xl border-white/5 bg-background/40 backdrop-blur-xl p-8">
                        <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-6">Próximas Tarefas</h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 opacity-50">
                                <p className="text-[10px] font-black uppercase text-primary mb-1">Pendente</p>
                                <p className="text-[11px] font-bold">Ligar para cliente validar escopo</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function InfoBlock({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-[9px] font-black uppercase text-muted-foreground opacity-50 tracking-widest mb-1.5">{label}</p>
            <p className="text-sm font-bold">{value}</p>
        </div>
    );
}
