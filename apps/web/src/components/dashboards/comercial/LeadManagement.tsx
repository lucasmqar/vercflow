"use client"

import React, { useState } from 'react';
import {
    Search,
    Filter,
    ChevronRight,
    MapPin,
    Building2,
    Clock,
    MoreVertical,
    Target
} from 'lucide-react';
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
                <div className="flex gap-2">
                    <Button variant="outline" className="h-11 rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest border-white/10">
                        <Filter size={16} /> Filtros
                    </Button>
                </div>
            </div>

            {filteredLeads.length === 0 ? (
                <div className="py-20 text-center opacity-30">
                    <Target size={64} className="mx-auto mb-4" />
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
                            <Card className="rounded-[2rem] border-white/10 bg-background/40 backdrop-blur-xl hover:border-primary/30 transition-all group overflow-hidden">
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
            )}
        </div>
    );
}

export function LeadDetailPage({ lead, onBack, onConvert }: { lead: Lead, onBack: () => void, onConvert: (lead: Lead) => void }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl border border-white/5 h-11 w-11">
                    <Target size={20} className="text-primary rotate-180" />
                </Button>
                <div>
                    <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] tracking-widest uppercase mb-1">DETALHES DO LEAD</Badge>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">{lead.nomeObra}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl p-8">
                        <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Informações do Cliente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InfoBlock label="Nome / Razão Social" value={lead.client?.nome || 'Não definido'} />
                            <InfoBlock label="Documento" value={lead.client?.documento || 'Não definido'} />
                            <InfoBlock label="Contatos" value={lead.client?.contatos || 'Não definido'} />
                            <InfoBlock label="Localização da Obra" value={lead.localizacao} />
                        </div>
                    </Card>

                    <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl p-8">
                        <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Histórico de Contatos</h3>
                        <div className="py-12 text-center opacity-30">
                            <Clock size={40} className="mx-auto mb-4" />
                            <p className="font-bold text-sm">Sem histórico de atividades registrado</p>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] border-white/5 bg-primary/5 p-8 border-dashed border-2">
                        <h3 className="text-xl font-black uppercase text-primary mb-4">Ações do Lead</h3>
                        <p className="text-xs text-muted-foreground font-medium mb-6 leading-relaxed">
                            Converta este lead em um orçamento técnico para iniciar o processo de precificação.
                        </p>
                        <Button
                            onClick={() => onConvert(lead)}
                            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20"
                        >
                            Converter em Orçamento
                        </Button>
                    </Card>

                    <Card className="rounded-[2.5rem] border-white/5 bg-background/40 backdrop-blur-xl p-8">
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
