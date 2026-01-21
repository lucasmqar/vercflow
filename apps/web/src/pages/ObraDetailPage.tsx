import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileCode2,
    FileText,
    ShoppingCart,
    CheckSquare,
    Calendar,
    FolderTree,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Clock,
    Settings,
    Package,
    Hash,
    MapPin,
    Check,
    DollarSign,
    Construction,
    ShieldAlert,
    ArrowLeft,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getApiUrl } from '@/lib/api';
import { ExpandableTabs } from '@/components/ui/ExpandableTabs';
import { ShaderAnimation } from '@/components/ui/ShaderAnimation';

// Types based on system_rules.md
type ObraState =
    | 'EM_CAPTACAO'
    | 'PROPOSTA_ENVIADA'
    | 'CONTRATO_ASSINADO'
    | 'PROJETOS_EM_DESENVOLVIMENTO'
    | 'EM_APROVACAO_ORGAOS'
    | 'OBRA_INICIADA'
    | 'OBRA_EM_EXECUCAO'
    | 'OBRA_FINALIZADA'
    | 'DOCUMENTACAO_FINALIZADA'
    | 'OBRA_ENCERRADA';

const OBRA_STATES: ObraState[] = [
    'EM_CAPTACAO',
    'PROPOSTA_ENVIADA',
    'CONTRATO_ASSINADO',
    'PROJETOS_EM_DESENVOLVIMENTO',
    'EM_APROVACAO_ORGAOS',
    'OBRA_INICIADA',
    'OBRA_EM_EXECUCAO',
    'OBRA_FINALIZADA',
    'DOCUMENTACAO_FINALIZADA',
    'OBRA_ENCERRADA',
];

interface Obra {
    id: string;
    nome: string;
    status: ObraState;
    endereco: string;
    client: {
        id: string;
        nome: string;
    };
    codigoInterno: string;
    categoria?: string;
    tipoObra?: string;
}

const getStatusLabel = (status: ObraState) => {
    return status.replace(/_/g, ' ');
};

const getStateColor = (status: ObraState) => {
    const colors: Record<string, string> = {
        'EM_CAPTACAO': 'bg-blue-500/10 text-blue-600 border-blue-200',
        'PROPOSTA_ENVIADA': 'bg-orange-500/10 text-orange-600 border-orange-200',
        'CONTRATO_ASSINADO': 'bg-purple-500/10 text-purple-600 border-purple-200',
        'PROJETOS_EM_DESENVOLVIMENTO': 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
        'EM_APROVACAO_ORGAOS': 'bg-amber-500/10 text-amber-600 border-amber-200',
        'OBRA_INICIADA': 'bg-green-500/10 text-green-600 border-green-200',
        'OBRA_EM_EXECUCAO': 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
        'OBRA_FINALIZADA': 'bg-gray-500/10 text-gray-600 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
};

export function ObraDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [obra, setObra] = useState<Obra | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('visao-geral');
    const [isProcessingEnquadramento, setIsProcessingEnquadramento] = useState(false);

    const navigationTabs: any[] = [
        { title: 'Visão Geral', icon: LayoutDashboard },
        { title: 'Projetos', icon: FileCode2 },
        { title: 'Documentos', icon: FileText },
        { type: "separator" },
        { title: 'Compras', icon: ShoppingCart },
        { title: 'Financeiro', icon: DollarSign },
        { title: 'Campo', icon: Construction },
        { title: 'Fiscalizações', icon: ShieldAlert },
    ];

    const tabMap: Record<number, string> = {
        0: 'visao-geral',
        1: 'projetos',
        2: 'documentos',
        4: 'compras',
        5: 'financeiro',
        6: 'checklists',
        7: 'arquivos'
    };

    const reverseTabMap: Record<string, number> = {
        'visao-geral': 0,
        'projetos': 1,
        'documentos': 2,
        'compras': 4,
        'financeiro': 5,
        'checklists': 6,
        'arquivos': 7
    };

    const handleTabChange = (index: number | null) => {
        if (index !== null && tabMap[index]) {
            setActiveTab(tabMap[index]);
        }
    };

    const statusConfig = obra ? {
        color: getStateColor(obra.status)
    } : null;

    useEffect(() => {
        fetchObraDetails();
    }, [id]);

    const fetchObraDetails = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/projects/${id}`));
            if (res.ok) {
                const data = await res.json();
                setObra(data);
            } else {
                toast.error("Erro ao carregar detalhes da obra");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro de conexão");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <SkeletonLoading />;
    if (!obra) return <NotFound />;

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden relative">
            {isProcessingEnquadramento && (
                <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white">
                    <ShaderAnimation />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
                        <div className="w-24 h-24 rounded-full border-4 border-white/20 border-t-white animate-spin mb-10" />
                        <h2 className="text-5xl font-black tracking-tighter uppercase mb-2">Verc Intelligence</h2>
                        <p className="text-[10px] font-black opacity-60 tracking-[0.5em] uppercase">Escalonando Requisitos & Disciplinas...</p>
                    </div>
                </div>
            )}
            {/* Premium Header */}
            <header className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/obras')} className="rounded-full hover:bg-zinc-100">
                        <ArrowLeft size={20} />
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black tracking-tighter">{obra.nome}</h1>
                            <Badge variant="outline" className={`font-black uppercase text-[8px] tracking-widest px-2 py-0.5 rounded-full ${getStateColor(obra.status)}`}>
                                {getStatusLabel(obra.status)}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Users size={12} /> {obra.client?.nome}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {obra.codigoInterno}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <ExpandableTabs
                        tabs={navigationTabs}
                        activeTab={reverseTabMap[activeTab]}
                        onChange={handleTabChange}
                        className="border-none shadow-none bg-secondary/20"
                    />
                    <div className="w-px h-8 bg-border/40" />
                    <Button variant="default" className="rounded-2xl h-10 px-6 font-black uppercase text-[10px] tracking-widest bg-zinc-900 shadow-glow">
                        <Settings size={14} className="mr-2" /> Gerenciar Obra
                    </Button>
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <Tabs value={activeTab} className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto p-8 bg-secondary/5 scrollbar-thin">
                        <TabsContent value="visao-geral" className="mt-0">
                            <div className="flex flex-col gap-6">
                                {/* Lifecycle Card */}
                                <div className="glass-card rounded-[2.5rem] border-primary/10 p-10 relative overflow-hidden group shadow-2xl shadow-primary/5">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-primary/[0.02] pointer-events-none" />
                                    <div className="relative z-10 flex flex-col gap-8">
                                        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="px-2 py-0.5 rounded-md font-mono text-[10px] font-black uppercase tracking-[0.2em] border-primary/20 text-primary bg-primary/5">Obra OS // Target</Badge>
                                                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-muted-foreground/60 uppercase">
                                                        <Hash size={12} className="opacity-40" /> {obra.id.slice(-6).toUpperCase()}
                                                    </div>
                                                </div>
                                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">{obra.nome}</h1>
                                                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                    <MapPin size={16} className="text-primary/60" />
                                                    <span className="text-sm">{obra.endereco || 'Endereço não informado'}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-3">
                                                <Badge className={cn("px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg", statusConfig?.color.replace('text-', 'bg-').replace('600', '500') || 'bg-primary')}>
                                                    {obra.status}
                                                </Badge>
                                                <div className="text-[10px] font-mono font-black text-muted-foreground/30 uppercase tracking-tighter">Current Lifecycle State</div>
                                            </div>
                                        </div>

                                        <div className="w-full pt-4 border-t border-primary/5">
                                            <div className="flex items-center justify-between relative px-2">
                                                <div className="absolute left-8 right-8 top-4 h-[1px] bg-border/40 z-0" />
                                                {OBRA_STATES.map((state, idx) => {
                                                    const isCompleted = OBRA_STATES.indexOf(obra.status as any) > idx;
                                                    const isCurrent = obra.status === state;
                                                    return (
                                                        <div key={state} className="flex flex-col items-center gap-2 relative z-10 group/step">
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                                                                isCurrent ? "bg-primary border-primary text-white scale-125 shadow-glow" :
                                                                    isCompleted ? "bg-emerald-500/20 border-emerald-500 text-emerald-600" :
                                                                        "bg-background border-border text-muted-foreground/40"
                                                            )}>
                                                                {isCompleted ? <Check size={14} strokeWidth={3} /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                                                            </div>
                                                            <span className={cn("text-[8px] font-black uppercase tracking-tighter", isCurrent ? "text-primary opacity-100" : "text-muted-foreground/30")}>
                                                                {state.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enquadramento Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <Card className="lg:col-span-1 rounded-[2rem] border-none shadow-xl bg-zinc-900 text-white p-8 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <Badge variant="outline" className="border-white/20 text-white bg-white/5 uppercase text-[9px] font-black">Configuração OS</Badge>
                                            <h3 className="text-xl font-black leading-tight">Enquadramento Proposital</h3>
                                            <p className="text-zinc-400 text-sm">A categoria <strong>{obra.categoria || obra.tipoObra || 'NÃO DEFINIDA'}</strong> determina as disciplinas e documentos obrigatórios.</p>
                                        </div>
                                        <Button
                                            onClick={async () => {
                                                setIsProcessingEnquadramento(true);
                                                try {
                                                    const res = await fetch(getApiUrl(`/api/projects/${obra.id}/enquadramento`), { method: 'POST' });
                                                    if (res.ok) {
                                                        setTimeout(() => {
                                                            toast.success("Enquadramento processado!");
                                                            fetchObraDetails();
                                                            setIsProcessingEnquadramento(false);
                                                        }, 2500);
                                                    } else {
                                                        setIsProcessingEnquadramento(false);
                                                        toast.error("Erro ao enquadrar");
                                                    }
                                                } catch (e) {
                                                    setIsProcessingEnquadramento(false);
                                                    toast.error("Erro ao enquadrar");
                                                }
                                            }}
                                            className="mt-6 bg-white text-zinc-900 hover:bg-zinc-200 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl"
                                        >
                                            Gerar Requisitos
                                        </Button>
                                    </Card>

                                    <Card className="lg:col-span-2 rounded-[2rem] border-none shadow-xl bg-white p-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-black">Checklist de Enquadramento</h3>
                                            <Badge className="bg-emerald-500 font-black uppercase text-[9px]">Sincronizado VERC-ID</Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600"><Check size={14} strokeWidth={3} /></div>
                                                <span className="text-xs font-bold text-zinc-600">Disciplinas Mapeadas</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-400"><Clock size={14} strokeWidth={3} /></div>
                                                <span className="text-xs font-bold text-zinc-600">Documentação Pendente</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-400"><Hash size={14} strokeWidth={3} /></div>
                                                <span className="text-xs font-bold text-zinc-600">Taxas e Emolumentos</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600"><Check size={14} strokeWidth={3} /></div>
                                                <span className="text-xs font-bold text-zinc-600">Vínculo Documental ID</span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Summaries */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <Card className="lg:col-span-2 rounded-[2rem] border-none shadow-xl bg-white p-8">
                                        <h3 className="text-lg font-black mb-6">Status Legal e Aprovações</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <LegalStatusItem label="Alvará de Construção" status="APROVADO" />
                                            <LegalStatusItem label="ART de Execução" status="PENDENTE" />
                                            <LegalStatusItem label="CNO" status="NAO_INICIADO" />
                                            <LegalStatusItem label="Protocolo Prefeitura" status="EM_ANDAMENTO" />
                                        </div>
                                    </Card>
                                    <Card className="rounded-[2rem] border-none shadow-xl bg-primary text-white p-8 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-black mb-2">Alertas Críticos</h3>
                                            <p className="text-primary-foreground/70 text-sm">Ações que exigem sua atenção imediata</p>
                                        </div>
                                        <div className="mt-6 flex flex-col gap-3">
                                            <AlertItem message="Sondagem do solo pendente" type="error" />
                                            <AlertItem message="Projeto Estrutural aguardando 2.2" type="warning" />
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="projetos" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="rounded-2xl border-dashed border-2 p-10 flex flex-col items-center justify-center text-center">
                                    <p className="text-muted-foreground font-medium">Módulo de Projetos 1.x-14.x em desenvolvimento</p>
                                </Card>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

function TabTrigger({ value, icon: Icon, label }: { value: string, icon: any, label: string }) {
    return (
        <TabsTrigger
            value={value}
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-1 gap-2 text-xs font-bold uppercase tracking-wider"
        >
            <Icon size={16} />
            {label}
        </TabsTrigger>
    );
}

function LegalStatusItem({ label, status }: { label: string, status: 'APROVADO' | 'PENDENTE' | 'EM_ANDAMENTO' | 'NAO_INICIADO' }) {
    const config = {
        'APROVADO': { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
        'PENDENTE': { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
        'EM_ANDAMENTO': { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
        'NAO_INICIADO': { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-50' }
    };
    const { icon: Icon, color, bg } = config[status];

    return (
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${bg}`}>
            <span className="text-sm font-bold text-gray-700">{label}</span>
            <div className={`flex items-center gap-1 font-black text-[10px] uppercase ${color}`}>
                <Icon size={14} />
                {status.replace(/_/g, ' ')}
            </div>
        </div>
    );
}

function AlertItem({ message, type }: { message: string, type: 'error' | 'warning' }) {
    return (
        <div className={`p-3 rounded-xl flex items-center gap-3 text-sm font-medium ${type === 'error' ? 'bg-red-500/20 text-white' : 'bg-orange-500/20 text-white'}`}>
            <AlertCircle size={16} className="shrink-0" />
            {message}
        </div>
    );
}

function SkeletonLoading() {
    return (
        <div className="flex flex-col h-full animate-pulse bg-background p-10 gap-10">
            <div className="h-20 bg-secondary/20 rounded-3xl w-full" />
            <div className="h-10 bg-secondary/20 rounded-full w-2/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-64 bg-secondary/20 rounded-[2rem] lg:col-span-2" />
                <div className="h-64 bg-secondary/20 rounded-[2rem]" />
            </div>
        </div>
    );
}

function NotFound() {
    return <div className="p-10 text-center">Obra não encontrada.</div>;
}

function TabIcon({ icon: Icon }: { icon: any }) {
    return <Icon size={18} />;
}
