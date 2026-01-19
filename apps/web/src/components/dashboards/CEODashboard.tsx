import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Building2,
    Activity,
    FileText,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Target,
    Zap,
    BarChart3,
    PieChart,
    Calendar as CalendarIcon,
    ArrowUpRight,
    ArrowDownRight,
    Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { getApiUrl } from '@/lib/api';

interface DashboardKPIs {
    kpis: {
        label: string;
        value: string;
        change: string;
        trend: 'up' | 'down' | 'neutral';
    }[];
    topProjects: any[];
}

export function CEODashboard() {
    const [data, setData] = useState<DashboardKPIs | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch(getApiUrl('/api/dashboard/ceo'));
            if (res.ok) {
                setData(await res.json());
            }
        } catch (e) {
            console.error('Dashboard error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    // Mock additional data for comprehensive dashboard
    const stats = {
        totalInvestment: 458750.00,
        activeProjects: 5,
        teamMembers: 12,
        tasksCompleted: 87,
        tasksTotal: 120,
        documentsGenerated: 34,
        criticalIssues: 3,
        pendingApprovals: 7,
        efficiency: 94,
        slaCompliance: 96,
        budgetUtilization: 78,
        clientSatisfaction: 4.8
    };

    return (
        <div className="h-full overflow-y-auto bg-gradient-to-br from-secondary/5 via-background to-primary/5">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Dashboard Executivo
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">Visão estratégica completa do sistema</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        Atualizado agora
                    </Badge>
                </div>
            </div>

            <div className="p-4 lg:p-6 space-y-6">
                {/* Primary KPIs - 4 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="border-l-4 border-l-blue-500 hover:shadow-xl transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Investimento Total</p>
                                        <p className="text-3xl font-bold tracking-tighter">
                                            R$ {stats.totalInvestment.toLocaleString('pt-BR')}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-green-600">
                                            <TrendingUp size={12} />
                                            <span>+12% vs mês anterior</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="border-l-4 border-l-green-500 hover:shadow-xl transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Obras Ativas</p>
                                        <p className="text-3xl font-bold tracking-tighter">{stats.activeProjects}</p>
                                        <div className="flex items-center gap-1 text-xs text-green-600">
                                            <CheckCircle2 size={12} />
                                            <span>100% operacionais</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Equipe Total</p>
                                        <p className="text-3xl font-bold tracking-tighter">{stats.teamMembers}</p>
                                        <div className="flex items-center gap-1 text-xs text-blue-600">
                                            <Users size={12} />
                                            <span>8 internos + 4 externos</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card className="border-l-4 border-l-orange-500 hover:shadow-xl transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Taxa de Conclusão</p>
                                        <p className="text-3xl font-bold tracking-tighter">
                                            {Math.round((stats.tasksCompleted / stats.tasksTotal) * 100)}%
                                        </p>
                                        <Progress value={(stats.tasksCompleted / stats.tasksTotal) * 100} className="h-1.5" />
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                        <Target className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Secondary Metrics - 6 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6 text-center">
                            <FileText className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                            <p className="text-2xl font-bold">{stats.documentsGenerated}</p>
                            <p className="text-xs text-muted-foreground mt-1">Documentos</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6 text-center">
                            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                            <p className="text-2xl font-bold">{stats.criticalIssues}</p>
                            <p className="text-xs text-muted-foreground mt-1">Críticos</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6 text-center">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                            <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                            <p className="text-xs text-muted-foreground mt-1">Pendentes</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6 text-center">
                            <Zap className="w-8 h-8 mx-auto mb-2 text-green-500" />
                            <p className="text-2xl font-bold">{stats.efficiency}%</p>
                            <p className="text-xs text-muted-foreground mt-1">Eficiência</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6 text-center">
                            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                            <p className="text-2xl font-bold">{stats.slaCompliance}%</p>
                            <p className="text-xs text-muted-foreground mt-1">SLA</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6 text-center">
                            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
                            <p className="text-2xl font-bold">{stats.budgetUtilization}%</p>
                            <p className="text-xs text-muted-foreground mt-1">Budget</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle Section - 3 Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Tasks Progress */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Briefcase size={16} />
                                Progresso de Tarefas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">Concluídas</span>
                                    <span className="text-sm font-bold">{stats.tasksCompleted}/{stats.tasksTotal}</span>
                                </div>
                                <Progress value={(stats.tasksCompleted / stats.tasksTotal) * 100} className="h-2" />
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">🟢 Em dia</span>
                                    <span className="text-xs font-bold">78</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">🟡 Atrasadas</span>
                                    <span className="text-xs font-bold">9</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">🔴 Críticas</span>
                                    <span className="text-xs font-bold">{stats.criticalIssues}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Budget Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <DollarSign size={16} />
                                Status Orçamentário
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">Utilizado</span>
                                    <span className="text-sm font-bold">R$ {(stats.totalInvestment * 0.78).toLocaleString('pt-BR')}</span>
                                </div>
                                <Progress value={stats.budgetUtilization} className="h-2" />
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">Previsto Total</span>
                                    <span className="text-xs font-bold">R$ {stats.totalInvestment.toLocaleString('pt-BR')}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">Disponível</span>
                                    <span className="text-xs font-bold text-green-600">
                                        R$ {(stats.totalInvestment * 0.22).toLocaleString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Client Satisfaction */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Users size={16} />
                                Satisfação Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <p className="text-5xl font-bold text-primary">{stats.clientSatisfaction}</p>
                                <div className="flex items-center justify-center gap-0.5 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < Math.floor(stats.clientSatisfaction) ? 'text-yellow-500' : 'text-gray-300'}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Média geral</p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">Reviews positivos</span>
                                    <span className="text-xs font-bold text-green-600">96%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">NPS Score</span>
                                    <span className="text-xs font-bold">+72</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Activity size={16} />
                                Atividades Recentes
                            </span>
                            <Badge variant="secondary" className="text-xs">Últimas 24h</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { action: 'Documento gerado', item: 'Plano de Prioridades #1234', time: '2h atrás', icon: FileText, color: 'text-blue-500' },
                                { action: 'Atividade concluída', item: 'Impermeabilização Laje 12º', time: '4h atrás', icon: CheckCircle2, color: 'text-green-500' },
                                { action: 'Novo registro', item: 'Esboço fachada frontal', time: '6h atrás', icon: AlertTriangle, color: 'text-yellow-500' },
                                { action: 'Profissional designado', item: 'João Silva → Atividade #567', time: '8h atrás', icon: Users, color: 'text-purple-500' },
                            ].map((activity, i) => {
                                const Icon = activity.icon;
                                return (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                                        <div className={`w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0 ${activity.color}`}>
                                            <Icon size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground truncate">{activity.item}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Projects */}
                {data?.topProjects && data.topProjects.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Building2 size={16} />
                                Top Projetos por Atividade
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.topProjects.map((project: any, i: number) => (
                                    <div key={project.id} className="flex items-center gap-3">
                                        <Badge className="w-6 h-6 flex items-center justify-center shrink-0">
                                            {i + 1}
                                        </Badge>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">{project.nome}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Progress value={Math.random() * 100} className="h-1.5 flex-1" />
                                                <span className="text-xs text-muted-foreground">
                                                    {project._count?.activities || 0} atividades
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
