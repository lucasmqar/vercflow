import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    Clock,
    AlertCircle,
    FileText,
    ShoppingCart,
    TrendingUp,
    Users,
    CheckSquare,
    Calendar,
    ArrowRight,
    Bell,
    Zap,
    Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { getApiUrl } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { AdvancedTimeFilter, TimeFilterValue } from '@/components/ui/AdvancedTimeFilter';
import { DashboardTab } from '@/types';

interface DashboardData {
    obrasAtivas: number;
    obrasEmAprovacao: number;
    pendenciasCriticas: number;
    documentosVencidos: number;
    projetosAtrasados: number;
    comprasUrgentes: number;
    recordsByPhase: Record<string, number>;
    atividadesEmExecucao: any[];
    recentRecords: any[];
    obrasRecentes: any[];
    alertas: Alert[];
}

interface Alert {
    id: string;
    tipo: 'CRITICO' | 'URGENTE' | 'ATENCAO';
    titulo: string;
    descricao: string;
    obraId?: string;
    obraNome?: string;
}

interface HomeDashboardProps {
    onTabChange: (tab: DashboardTab) => void;
}

export function HomeDashboard({ onTabChange }: HomeDashboardProps) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState<TimeFilterValue>({});

    useEffect(() => {
        fetchDashboardData();
    }, [timeFilter]);

    const fetchDashboardData = async () => {
        try {
            const query = new URLSearchParams();
            if (timeFilter.month !== undefined) query.append('month', timeFilter.month.toString());
            if (timeFilter.year) query.append('year', timeFilter.year.toString());
            if (timeFilter.startTime) query.append('startTime', timeFilter.startTime);
            if (timeFilter.endTime) query.append('endTime', timeFilter.endTime);

            const res = await fetch(getApiUrl(`/api/dashboard/home?${query.toString()}`));
            if (res.ok) {
                setDashboardData(await res.json());
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleBasedGreeting = () => {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
        const roleName = user?.role === 'CEO' ? 'CEO' :
            user?.role === 'GESTOR' ? 'Gestor' :
                user?.role === 'OPERACIONAL' ? 'Engenheiro' : 'Usuário';
        return `${greeting}, ${user?.nome.split(' ')[0]} (${roleName})`;
    };

    const getAlertColor = (tipo: string) => {
        switch (tipo) {
            case 'CRITICO': return 'destructive';
            case 'URGENTE': return 'default';
            case 'ATENCAO': return 'secondary';
            default: return 'outline';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground font-medium">Carregando painel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground/90">
                        {getRoleBasedGreeting()}
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm mt-1">
                        Painel de Situação · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <AdvancedTimeFilter onFilterChange={setTimeFilter} />
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative bg-muted/20 border border-border/40">
                        <Bell size={18} className="text-muted-foreground" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                    </Button>
                </div>
            </div>

            {/* Critical Alerts */}
            {dashboardData?.alertas && dashboardData.alertas.length > 0 && (
                <Card className="border-l-4 border-l-red-500 bg-red-50/10 dark:bg-red-950/5">
                    <CardHeader className="py-4">
                        <CardTitle className="flex items-center gap-2 text-red-600 font-black text-base">
                            <Bell className="animate-pulse" size={18} />
                            Alertas Críticos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-4">
                        {dashboardData.alertas.map((alert) => (
                            <div key={alert.id} className="flex items-start justify-between p-3 rounded-xl bg-background/50 border border-border/40">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant={getAlertColor(alert.tipo)} className="text-[9px] h-4">{alert.tipo}</Badge>
                                        {alert.obraNome && <span className="text-[10px] text-muted-foreground font-bold uppercase">{alert.obraNome}</span>}
                                    </div>
                                    <h4 className="font-bold text-[13px]">{alert.titulo}</h4>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">{alert.descricao}</p>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="rounded-full h-8 w-8"
                                    onClick={() => {
                                        if (alert.obraId) {
                                            window.open(getApiUrl(`/api/projects/${alert.obraId}/report`), '_blank');
                                        } else {
                                            onTabChange('atividades');
                                        }
                                    }}
                                >
                                    <ArrowRight size={14} />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <KPICard
                    icon={Building2}
                    label="Obras Ativas"
                    value={dashboardData?.obrasAtivas || 0}
                    color="blue"
                    onClick={() => onTabChange('obras')}
                />
                <KPICard
                    icon={Clock}
                    label="Em Aprovação"
                    value={dashboardData?.obrasEmAprovacao || 0}
                    color="orange"
                    onClick={() => onTabChange('obras')}
                />
                <KPICard
                    icon={AlertCircle}
                    label="Pendências"
                    value={dashboardData?.pendenciasCriticas || 0}
                    color="red"
                    trend="urgent"
                    onClick={() => onTabChange('atividades')}
                />
                <KPICard
                    icon={FileText}
                    label="Docs Vencidos"
                    value={dashboardData?.documentosVencidos || 0}
                    color="red"
                    onClick={() => onTabChange('gestao-projetos')}
                />
                <KPICard
                    icon={TrendingUp}
                    label="Proj. Atraso"
                    value={dashboardData?.projetosAtrasados || 0}
                    color="orange"
                    onClick={() => onTabChange('gestao-projetos')}
                />
                <KPICard
                    icon={ShoppingCart}
                    label="Compras"
                    value={dashboardData?.comprasUrgentes || 0}
                    color="purple"
                    onClick={() => onTabChange('estoque')}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Registros por Fase */}
                <Card className="rounded-2xl border-border/40 shadow-sm">
                    <CardHeader className="py-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <TrendingUp size={18} className="text-primary" />
                            Distribuição de Registros
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-4">
                        {['REGISTRO', 'TRIAGEM', 'CLASSIFICACAO', 'ORDENACAO', 'VALIDACAO', 'DISTRIBUICAO'].map((phase) => (
                            <div key={phase} className="space-y-1">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-muted-foreground/80 uppercase tracking-tighter">{phase}</span>
                                    <span>{dashboardData?.recordsByPhase[phase] || 0}</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${Math.min(100, ((dashboardData?.recordsByPhase[phase] || 0) / 20) * 100)}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Atividades em Execução */}
                <Card className="rounded-2xl border-border/40 shadow-sm lg:col-span-2">
                    <CardHeader className="py-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Zap size={18} className="text-primary" />
                            Atividades em Execução
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-4">
                        {dashboardData?.atividadesEmExecucao?.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                                Nenhuma atividade em execução no momento.
                            </div>
                        ) : (
                            dashboardData?.atividadesEmExecucao?.map((ativ) => (
                                <div
                                    key={ativ.id}
                                    className="p-3 rounded-lg bg-muted/20 border border-transparent hover:border-primary/20 hover:bg-muted/40 transition-all flex items-center justify-between"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <Badge variant="outline" className="text-[8px] font-black uppercase text-primary/60 border-primary/20">{ativ.project?.nome}</Badge>
                                            <span className="text-[10px] text-muted-foreground font-mono">{ativ.id.slice(-4).toUpperCase()}</span>
                                        </div>
                                        <h4 className="font-bold text-[13px] truncate">{ativ.titulo}</h4>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full border border-background bg-muted flex items-center justify-center text-[8px] font-bold">...</div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                                            <ArrowRight size={14} />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Grid: Recently Added & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                <Card className="rounded-2xl border-border/40 shadow-sm">
                    <CardHeader className="py-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Clock size={18} className="text-primary" />
                            Registros Recentes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-4">
                        {dashboardData?.recentRecords?.map((rec) => (
                            <div key={rec.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-all">
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold">{rec.texto.slice(0, 50)}...</span>
                                    <span className="text-[9px] text-muted-foreground uppercase">{rec.author?.nome} · {new Date(rec.criadoEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <Badge variant="secondary" className="text-[8px]">{rec.status}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/40 shadow-sm">
                    <CardHeader className="py-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Building2 size={18} className="text-primary" />
                            Obras em Foco
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-4">
                        {dashboardData?.obrasRecentes?.map((obra) => (
                            <div
                                key={obra.id}
                                onClick={() => navigate(`/obras/${obra.id}`)}
                                className="flex items-center justify-between p-3 rounded-xl bg-primary/[0.02] border border-primary/5 hover:border-primary/20 cursor-pointer transition-all"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-black tracking-tight">{obra.nome}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">{obra.client?.nome}</span>
                                </div>
                                <Badge className="text-[8px] uppercase tracking-tighter bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">{obra.status}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function KPICard({ icon: Icon, label, value, color, trend, onClick }: any) {
    const variants = {
        blue: 'text-blue-600 bg-blue-500/[0.03] border-blue-500/10',
        green: 'text-green-600 bg-green-500/[0.03] border-green-500/10',
        orange: 'text-orange-600 bg-orange-500/[0.03] border-orange-500/10',
        red: 'text-red-600 bg-red-500/[0.03] border-red-500/10',
        purple: 'text-purple-600 bg-purple-500/[0.03] border-purple-500/10',
    };

    return (
        <Card
            className={`p-4 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-md cursor-pointer ${variants[color as keyof typeof variants]}`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-background/50 border border-current/10">
                    <Icon size={18} />
                </div>
                {trend === 'urgent' && <span className="animate-ping w-2 h-2 rounded-full bg-red-500" />}
            </div>
            <div>
                <p className="text-2xl font-black leading-none">{value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">{label}</p>
            </div>
        </Card>
    );
}
