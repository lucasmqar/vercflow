"use client"

import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, User, Phone, Mail, MapPin, Building2,
    Calendar, FileText, TrendingUp, DollarSign,
    Clock, CheckCircle2, AlertCircle, ArrowUpRight,
    Briefcase, MoreHorizontal, Download, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ClientProfilePageProps {
    client: any;
    onBack: () => void;
}

export function ClientProfilePage({ client, onBack }: ClientProfilePageProps) {
    if (!client) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full bg-background overflow-hidden"
        >
            {/* Page Header */}
            <div className="p-8 border-b border-border/40 bg-background/50 backdrop-blur-xl shrink-0">
                <div className="flex justify-between items-start mb-6">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl h-12 w-12 hover:bg-muted -ml-2">
                        <ArrowLeft size={24} />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2 font-bold uppercase text-[10px] tracking-widest border-border/40 hover:bg-white/5">
                        <Briefcase size={14} /> Histórico Completo
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-4xl shadow-inner border border-primary/10">
                        {client.logo || client.nome.substring(0, 1)}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-black tracking-tighter text-foreground leading-none">{client.nome}</h2>
                            <Badge className={cn(
                                "text-[10px] uppercase font-black tracking-widest px-2 py-0.5 border-none",
                                client.status === 'ATIVO' ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                            )}>
                                {client.status}
                            </Badge>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground flex flex-wrap gap-4 items-center">
                            <span className="flex items-center gap-1.5"><Building2 size={14} className="text-primary" /> {client.tipo}</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1.5"><FileText size={14} /> {client.documento}</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1.5"><MapPin size={14} /> Curitiba, PR</span>
                        </p>

                        <div className="flex gap-2 mt-4 pt-2">
                            <Button size="sm" className="h-9 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold text-xs gap-2 px-4 shadow-none">
                                <MessageSquare size={14} /> Enviar Mensagem
                            </Button>
                            <Button size="sm" variant="ghost" className="h-9 rounded-xl font-bold text-xs gap-2 text-muted-foreground border border-border/40">
                                <Mail size={14} /> {client.email}
                            </Button>
                            <Button size="sm" variant="ghost" className="h-9 rounded-xl font-bold text-xs gap-2 text-muted-foreground border border-border/40">
                                <Phone size={14} /> +55 (41) 99999-9999
                            </Button>
                        </div>
                    </div>

                    {/* Quick Financial Stats */}
                    <div className="flex gap-8 pr-12 border-l border-border/20 pl-8 hidden lg:flex">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">Lifetime Value (LTV)</p>
                            <p className="text-3xl font-black tracking-tight text-emerald-500">{client.valorTotal}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">Contratos Ativos</p>
                            <p className="text-3xl font-black tracking-tight">{client.contratos}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <div className="flex-1 overflow-hidden flex flex-col bg-muted/5">
                <Tabs defaultValue="visao-geral" className="flex-1 flex flex-col">
                    <div className="px-8 border-b border-border/40 bg-background/50 backdrop-blur-xl sticky top-0 z-10">
                        <TabsList className="bg-transparent h-16 p-0 gap-8 justify-start">
                            <TabItem value="visao-geral" label="Visão 360°" />
                            <TabItem value="obras" label="Projetos & Obras" count={client.contratos} />
                            <TabItem value="financeiro" label="Financeiro" />
                            <TabItem value="documentos" label="Documentos" count={5} />
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="max-w-[1920px] mx-auto">
                            <TabsContent value="visao-geral" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Timeline & Active Items */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left: Recent Activity */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                <Clock size={16} /> Linha do Tempo
                                            </h3>
                                        </div>

                                        <div className="relative pl-4 border-l-2 border-border/40 space-y-8">
                                            {[
                                                { title: "Pagamento Confirmado", desc: "Referente à 2ª Medição da Obra Alpha.", date: "Hoje, 10:30", type: "fin", color: "bg-emerald-500" },
                                                { title: "Proposta Aprovada", desc: "Cliente aceitou o orçamento revisado #ORC-229.", date: "Ontem, 16:45", type: "com", color: "bg-blue-500" },
                                                { title: "Reunião de Alinhamento", desc: "Definição de acabamentos com Arquiteta.", date: "22 Jan, 14:00", type: "eng", color: "bg-amber-500" },
                                            ].map((item, i) => (
                                                <div key={i} className="relative group">
                                                    <div className={cn("absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-background shadow-sm", item.color)} />
                                                    <div className="bg-background border border-border/40 p-6 rounded-[2rem] hover:border-primary/20 transition-all shadow-sm hover:shadow-md">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-bold text-base text-foreground">{item.title}</h4>
                                                            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-lg">{item.date}</span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: Quick Info Cards */}
                                    <div className="space-y-6">
                                        <Card className="rounded-[2.5rem] p-8 bg-gradient-to-br from-background to-secondary/5 border-border/40 shadow-sm">
                                            <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-6 opacity-60">Status do Cliente</h3>
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center pb-4 border-b border-border/20 last:border-0 last:pb-0">
                                                    <span className="text-sm font-bold">Relacionamento</span>
                                                    <Badge className="bg-emerald-500/10 text-emerald-500 text-[10px] border-none font-black uppercase px-3 py-1">Excelente</Badge>
                                                </div>
                                                <div className="flex justify-between items-center pb-4 border-b border-border/20 last:border-0 last:pb-0">
                                                    <span className="text-sm font-bold">NPS (Último)</span>
                                                    <span className="font-black text-xl text-primary">9.5</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-4 border-b border-border/20 last:border-0 last:pb-0">
                                                    <span className="text-sm font-bold">Cliente Desde</span>
                                                    <span className="text-xs text-muted-foreground font-bold uppercase">Jan 2024</span>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className="rounded-[2.5rem] p-8 border-dashed border-2 border-border/40 bg-muted/5 flex flex-col items-center justify-center text-center gap-4">
                                            <div className="w-14 h-14 rounded-full bg-background border border-border/40 flex items-center justify-center text-muted-foreground">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">Contratos Pendentes</p>
                                                <p className="text-xs text-muted-foreground mt-1">Não há minutas pendentes de assinatura.</p>
                                            </div>
                                            <Button size="sm" variant="outline" className="rounded-xl h-9 text-[10px] uppercase font-black tracking-widest w-full">
                                                Gerar Minuta
                                            </Button>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="obras" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <ProjectCard
                                        name="Residencial Alpha"
                                        status="EM_ANDAMENTO"
                                        progress={65}
                                        address="Rua das Flores, 123"
                                        manager="Ricardo M."
                                    />
                                    <ProjectCard
                                        name="Reforma Corporativa"
                                        status="CONCLUIDA"
                                        progress={100}
                                        address="Av. Paulista, 1000"
                                        manager="Ana P."
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="financeiro" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-col items-center justify-center p-20 text-center text-muted-foreground border-2 border-dashed border-border/40 rounded-[3rem]">
                                    <DollarSign size={64} className="mb-6 opacity-20" />
                                    <h3 className="font-black text-2xl mb-2">Módulo Financeiro Detalhado</h3>
                                    <p className="text-base opacity-60 max-w-md">Visualize aqui o histórico completo de faturas, boletos emitidos e fluxo de caixa consolidado deste cliente.</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="documentos" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {/* Mock Docs */}
                                    {['Contrato Social.pdf', 'RG Sócios.pdf', 'Comprovante Endereço.pdf', 'Minuta Contrato v2.pdf', 'Proposta Comercial.pdf'].map((doc, i) => (
                                        <Card key={i} className="rounded-[2rem] p-6 hover:border-primary/50 hover:shadow-lg cursor-pointer transition-all group border-border/40 flex flex-col items-center text-center gap-4 bg-background">
                                            <div className="w-16 h-16 rounded-2xl bg-muted/10 group-hover:bg-primary/5 flex items-center justify-center transition-colors">
                                                <FileText size={32} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-xs truncate w-full px-2">{doc}</p>
                                                <p className="text-[10px] text-muted-foreground mt-1">22 Jan 2024</p>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>
        </motion.div>
    );
}

// Helpers
function TabItem({ value, label, count }: any) {
    return (
        <TabsTrigger
            value={value}
            className="rounded-none bg-transparent border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-4 mb-[-1px] text-xs font-black uppercase tracking-widest text-muted-foreground data-[state=active]:text-primary transition-all flex items-center gap-2 hover:text-primary/70"
        >
            {label}
            {count && <span className="bg-muted px-1.5 py-0.5 rounded-md text-[9px] font-bold text-foreground">{count}</span>}
        </TabsTrigger>
    );
}

function ProjectCard({ name, status, progress, address, manager }: any) {
    return (
        <Card className="rounded-[2.5rem] border-white/5 bg-background p-8 hover:shadow-xl transition-all cursor-pointer group hover:border-primary/20">
            <div className="flex justify-between items-start mb-6">
                <Badge variant={status === 'CONCLUIDA' ? 'secondary' : 'default'} className="text-[10px] font-black uppercase tracking-widest px-3 py-1">
                    {status.replace('_', ' ')}
                </Badge>
                <div className="w-10 h-10 rounded-full bg-muted/10 flex items-center justify-center -mr-2 -mt-2 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <ArrowUpRight size={20} />
                </div>
            </div>

            <h3 className="font-black text-2xl mb-2 tracking-tight group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mb-8 font-medium">
                <MapPin size={14} /> {address}
            </p>

            <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                    <span>Progresso Atual</span>
                    <span className="text-foreground">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary border border-primary/20">
                    {manager.charAt(0)}
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase text-muted-foreground/50 tracking-widest">Gestor Responsável</p>
                    <p className="text-xs font-bold text-foreground">{manager}</p>
                </div>
            </div>
        </Card>
    );
}
