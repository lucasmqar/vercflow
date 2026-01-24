"use client"

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import {
    Building2,
    DollarSign,
    Users,
    Target,
    FileText,
    ShoppingCart,
    AlertCircle,
    TrendingUp,
    Zap,
    Plus,
    LayoutDashboard,
    FolderPlus,
    CheckSquare,
    Upload,
    Bell,
    Activity,
    BarChart3,
    ArrowUpRight,
    Search,
    Filter,
    Layers,
    ChevronRight,
    MessageSquare,
    Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import { TimelineEvent } from '@/components/dashboard/TimelineEvent';
import { ProjectHealthCard } from '@/components/dashboard/ProjectHealthCard';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { useAuth } from '@/hooks/useAuth';
import { getApiUrl } from '@/lib/api';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';
import { useAppFlow } from '@/store/useAppFlow';

interface HomeDashboardProps {
    onTabChange: (tab: DashboardTab) => void;
    onOpenWizard?: () => void;
}

export function HomeDashboard({ onTabChange, onOpenWizard }: HomeDashboardProps) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { setSelectedProject } = useAppFlow();
    const [view, setView] = useState<'geral' | 'insights'>('geral');
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any }>({
        isOpen: false,
        title: "",
    });

    const openPlaceholder = (title: string, icon?: any) => {
        setModalConfig({ isOpen: true, title, icon });
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/dashboard/home?role=${user?.role}&userId=${user?.id}`));
                if (res.ok) {
                    setDashboardData(await res.json());
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    const getRoleBasedGreeting = () => {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
        return `${greeting}, ${user?.nome.split(' ')[0]}`;
    };

    const getQuickActions = () => {
        if (user?.role === 'CEO') {
            return [
                { icon: LayoutDashboard, label: 'Dashboard Executivo', action: () => setView('insights') },
                { icon: DollarSign, label: 'Relatório Financeiro', tab: 'financeiro' as DashboardTab },
                { icon: Users, label: 'Gestão de Clientes', tab: 'comercial' as DashboardTab }
            ];
        } else if (user?.role === 'DIRETOR') { // Changed GESTOR to DIRETOR (valid role)
            return [
                { icon: FolderPlus, label: 'Criar Obra', action: onOpenWizard },
                { icon: Users, label: 'Alocar Equipe', tab: 'comercial' as DashboardTab }, // Changed 'equipe' to 'comercial' (valid tab)
                { icon: CheckSquare, label: 'Ver Triagem', tab: 'triagem' as DashboardTab }
            ];
        } else {
            return [
                { icon: Plus, label: 'Novo Registro', tab: 'captura' as DashboardTab },
                { icon: CheckSquare, label: 'Minhas Atividades', tab: 'projetos' as DashboardTab },
                { icon: Upload, label: 'Upload Documento', tab: 'projetos' as DashboardTab }
            ];
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

    const revenueData = [
        { name: 'Jan', receita: 1200000, custo: 850000 },
        { name: 'Fev', receita: 1350000, custo: 920000 },
        { name: 'Mar', receita: 1100000, custo: 880000 },
        { name: 'Abr', receita: 1550000, custo: 980000 },
        { name: 'Mai', receita: 1400000, custo: 950000 },
        { name: 'Jun', receita: 1800000, custo: 1100000 },
    ];

    return (
        <div className="p-4 lg:p-8 space-y-8 animate-in fade-in duration-500 overflow-y-auto pb-24">
            {/* Unified Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                    <HeaderAnimated title={view === 'geral' ? getRoleBasedGreeting() : "CEO Insights & Analytics"} />
                    <p className="text-muted-foreground font-medium text-sm mt-1">
                        {view === 'geral'
                            ? new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                            : "Inteligência estratégica em tempo real para tomada de decisão global."
                        }
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex p-1 bg-muted/20 rounded-xl border border-border/40 shrink-0">
                        <Button
                            variant="ghost"
                            onClick={() => setView('geral')}
                            className={cn(
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9",
                                view === 'geral' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                            )}
                        >
                            Geral
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setView('insights')}
                            className={cn(
                                "rounded-lg text-[10px] font-black uppercase tracking-widest px-4 h-9",
                                view === 'insights' ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                            )}
                        >
                            Insights
                        </Button>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'geral' ? (
                    <motion.div key="geral" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2">
                            {getQuickActions().map((action, idx) => {
                                const Icon = action.icon;
                                return (
                                    <Button
                                        key={idx}
                                        size="sm"
                                        variant="outline"
                                        className="rounded-full font-bold text-xs gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                                        onClick={() => {
                                            if ('action' in action && action.action) action.action();
                                            else if ('tab' in action && action.tab) onTabChange(action.tab);
                                        }}
                                    >
                                        <Icon size={14} />
                                        {action.label}
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Critical Alerts */}
                        {dashboardData?.alertas?.length > 0 && (
                            <Card className="border-l-4 border-l-red-500 bg-red-50/10 dark:bg-red-950/5 rounded-3xl overflow-hidden">
                                <CardHeader className="py-4">
                                    <CardTitle className="flex items-center gap-2 text-red-600 font-black text-base">
                                        <Bell className="animate-pulse" size={18} />
                                        Alertas Críticos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 pb-4">
                                    {dashboardData.alertas.slice(0, 3).map((alert: any) => (
                                        <div key={alert.id} className="flex items-start justify-between p-3 rounded-xl bg-background/50 border border-border/40 cursor-pointer hover:border-red-500/50 transition-all">
                                            <div>
                                                <Badge variant="destructive" className="text-[9px] h-4 mb-1">{alert.tipo}</Badge>
                                                <h4 className="font-bold text-[13px]">{alert.titulo}</h4>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">{alert.descricao}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Primary KPIs */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {Object.values(dashboardData?.primaryKPIs || {}).map((kpi: any, idx: number) => (
                                <KPICard key={idx} {...kpi} onClick={() => onTabChange('obras')} />
                            ))}
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <QuickStatCard icon={FileText} label="Documentos" value={dashboardData?.quickStats?.documentosGerados || 0} color="blue" onClick={() => openPlaceholder("Repositório", FileText)} />
                            <QuickStatCard icon={ShoppingCart} label="Compras" value={dashboardData?.quickStats?.comprasUrgentes || 0} color="purple" onClick={() => openPlaceholder("Compras", ShoppingCart)} />
                            <QuickStatCard icon={AlertCircle} label="Pendências" value={dashboardData?.quickStats?.pendenciasCriticas || 0} color="red" onClick={() => openPlaceholder("Pendências", AlertCircle)} />
                            <QuickStatCard icon={Zap} label="Eficiência" value={dashboardData?.quickStats?.eficienciaEquipe || 0} color="green" suffix="%" onClick={() => openPlaceholder("Eficiência", Zap)} />
                            <QuickStatCard icon={Target} label="SLA" value={dashboardData?.quickStats?.slaCompliance || 0} color="orange" suffix="%" onClick={() => openPlaceholder("SLA", Target)} />
                            <QuickStatCard icon={TrendingUp} label="Budget" value={dashboardData?.quickStats?.budgetUtilizado || 0} color="indigo" suffix="%" onClick={() => openPlaceholder("Budget", TrendingUp)} />
                        </div>

                        {/* Obras em Foco */}
                        {dashboardData?.obrasRecentes?.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-base font-black uppercase tracking-wider opacity-60">Obras em Foco</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {dashboardData.obrasRecentes.slice(0, 3).map((obra: any) => (
                                        <ProjectHealthCard
                                            key={obra.id}
                                            projectId={obra.id}
                                            projectName={obra.nome}
                                            clientName={obra.client?.nome || 'Cliente'}
                                            progress={Math.floor(Math.random() * 100)}
                                            nextMilestone="Revisão Semanal"
                                            nextMilestoneDate="Amanhã"
                                            responsavel={obra.mestreObra?.nome || 'Engenheiro'}
                                            documentsVencidos={0}
                                            budgetStatus="ok"
                                            budgetStatus="ok"
                                            teamAllocated={3}
                                            onClick={() => {
                                                setSelectedProject(obra.id);
                                                onTabChange('engenharia'); // Redirect to Engineering Control Room
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="insights" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                        {/* Executive Insights (Charts and advanced Metrics) */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <KPIInsight title="EBITDA Consolidado" value="R$ 3.8M" percentage="+18.4%" icon={TrendingUp} state="success" />
                            <KPIInsight title="Pipeline Obras" value="R$ 42M" percentage="+12% VGV" icon={Building2} state="neutral" />
                            <KPIInsight title="H.H Global" value="15.4k" percentage="Eficiência 94%" icon={Zap} state="success" />
                            <KPIInsight title="Ticket Médio" value="R$ 1.2M" percentage="-2.1%" icon={Activity} state="warning" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2 rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
                                <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-black">Performance Financeira</CardTitle>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Série Histórica Consolidada (BRL)</p>
                                    </div>
                                    <Badge variant="outline" className="rounded-full border-primary/20 text-primary font-black uppercase text-[10px] px-3">Live Intelligence</Badge>
                                </CardHeader>
                                <CardContent className="h-[400px] p-8">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'black' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'black' }} tickFormatter={(val) => `R$${val / 1000}k`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(15, 15, 15, 0.95)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                                                itemStyle={{ fontSize: '12px', fontWeight: 'black' }}
                                            />
                                            <Area type="monotone" dataKey="receita" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" name="Receita Bruta" />
                                            <Area type="monotone" dataKey="custo" stroke="#ef4444" strokeWidth={4} fillOpacity={0} fill="transparent" name="Custo Operacional" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="rounded-[2.5rem] border-border/40 bg-background/60 p-8 shadow-sm">
                                <h3 className="font-black text-lg mb-6">Eficiência por Departamento</h3>
                                <div className="space-y-6">
                                    {[
                                        { label: 'Comercial', value: 92, color: 'bg-blue-500' },
                                        { label: 'Projetos', value: 85, color: 'bg-emerald-500' },
                                        { label: 'Engenharia', value: 78, color: 'bg-amber-500' },
                                        { label: 'Logística', value: 95, color: 'bg-purple-500' },
                                    ].map((dept) => (
                                        <div key={dept.label} className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                                <span>{dept.label}</span>
                                                <span>{dept.value}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${dept.value}%` }} className={cn("h-full rounded-full", dept.color)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full mt-10 rounded-xl h-11 text-[10px] font-black uppercase tracking-widest gap-2">
                                    <BarChart3 size={16} /> Relatório Completo
                                </Button>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <PlaceholderModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                icon={modalConfig.icon}
            />
        </div>
    );
}

function KPICard({ label, value, change, trend, color, onClick }: any) {
    const colorClasses: Record<string, string> = {
        blue: 'text-blue-600 bg-blue-500/[0.03] border-blue-500/10',
        green: 'text-green-600 bg-green-500/[0.03] border-green-500/10',
        orange: 'text-orange-600 bg-orange-500/[0.03] border-orange-500/10',
        red: 'text-red-600 bg-red-500/[0.03] border-red-500/10',
        purple: 'text-purple-600 bg-purple-500/[0.03] border-purple-500/10',
    };

    const trendIcons = {
        up: <TrendingUp size={12} className="text-green-600" />,
        down: <TrendingUp size={12} className="text-red-600 rotate-180" />,
        neutral: null
    };

    return (
        <Card
            className={cn(
                "p-6 rounded-[2.5rem] border flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 cursor-pointer",
                colorClasses[color]
            )}
            onClick={onClick}
        >
            <div className="mb-4">
                <p className="text-3xl font-black leading-none tracking-tighter">{value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-60">{label}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                {trendIcons[trend as keyof typeof trendIcons]}
                <span>{change}</span>
            </div>
        </Card>
    );
}

function KPIInsight({ title, value, percentage, icon: Icon, state }: any) {
    const colors = {
        success: "text-emerald-500 bg-emerald-500/10 shadow-emerald-500/10",
        warning: "text-amber-500 bg-amber-500/10 shadow-amber-500/10",
        danger: "text-red-500 bg-red-500/10 shadow-red-500/10",
        neutral: "text-blue-500 bg-blue-500/10 shadow-blue-500/10"
    };

    return (
        <Card className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-md hover:border-border/60 transition-all shadow-sm group">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-2xl font-black tracking-tight mb-1 group-hover:text-primary transition-colors">{value}</h3>
                    <Badge variant="outline" className={cn("text-[8px] font-black px-1.5 h-4 border-none", colors[state as keyof typeof colors])}>
                        {percentage}
                    </Badge>
                </div>
                <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 shadow-lg", colors[state as keyof typeof colors])}>
                    <Icon size={24} />
                </div>
            </CardContent>
        </Card>
    );
}

function QuickStatCard({ icon: Icon, label, value, color, suffix = "", onClick }: any) {
    const colorClasses: Record<string, string> = {
        blue: 'text-blue-500',
        green: 'text-green-500',
        orange: 'text-orange-500',
        red: 'text-red-500',
        purple: 'text-purple-500',
        indigo: 'text-indigo-500',
    };

    return (
        <Card className="rounded-[2.5rem] border-border/40 bg-background/60 backdrop-blur-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer" onClick={onClick}>
            <CardContent className="pt-6 pb-6 text-center">
                <Icon className={cn("w-6 h-6 mx-auto mb-3", colorClasses[color])} strokeWidth={2.5} />
                <p className="text-xl font-black tracking-tight">{value}{suffix}</p>
                <p className="text-[9px] font-black text-muted-foreground uppercase mt-2 tracking-widest opacity-60">{label}</p>
            </CardContent>
        </Card>
    );
}

export default HomeDashboard;
