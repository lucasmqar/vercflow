import React, { useState } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Building2,
    AlertCircle,
    Activity,
    Target,
    PieChart,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Layers,
    ChevronRight,
    Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import HeaderAnimated from '@/components/common/HeaderAnimated';
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
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import { PlaceholderModal } from '@/components/shared/PlaceholderModal';

export function ExecutivoDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; icon?: any }>({
        isOpen: false,
        title: "",
    });

    const openPlaceholder = (title: string, icon?: any) => {
        setModalConfig({ isOpen: true, title, icon });
    };
    // Mock Data
    const revenueData = [
        { name: 'Jan', receita: 1200000, custo: 850000 },
        { name: 'Fev', receita: 1350000, custo: 920000 },
        { name: 'Mar', receita: 1100000, custo: 880000 },
        { name: 'Abr', receita: 1550000, custo: 980000 },
        { name: 'Mai', receita: 1400000, custo: 950000 },
        { name: 'Jun', receita: 1800000, custo: 1100000 },
    ];

    const projectPerformance = [
        { name: 'Ed. Sky', progresso: 78, status: 'NO PRAZO' },
        { name: 'Res. Park', progresso: 45, status: 'NO PRAZO' },
        { name: 'Galpão A', progresso: 92, status: 'ATENÇÃO' },
        { name: 'Shopping B', progresso: 15, status: 'NO PRAZO' },
    ];

    return (
        <div className="p-4 lg:p-8 space-y-8 h-full overflow-y-auto font-sans bg-secondary/10 pb-24">
            {/* Context Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <HeaderAnimated title="CEO Insights & Analytics" />
                    <p className="text-muted-foreground font-medium mt-1">
                        Inteligência estratégica em tempo real para tomada de decisão global.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="rounded-xl h-11 font-black px-6 border-border/40 gap-2"
                        onClick={() => openPlaceholder("Filtrar Período Executivo", Filter)}
                    >
                        <Filter size={18} /> Filtrar Periodo
                    </Button>
                    <Button
                        className="rounded-xl h-11 font-black uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                        onClick={() => openPlaceholder("Relatório Trimestral Verc", TrendingUp)}
                    >
                        <TrendingUp size={18} /> Relatório Trimestral
                    </Button>
                </div>
            </div>

            {/* Premium KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard title="EBITDA Consolidado" value="R$ 3.8M" percentage="+18.4%" icon={TrendingUp} state="success" />
                <KPICard title="Pipeline Obras" value="R$ 42M" percentage="+12% VGV" icon={Building2} state="neutral" />
                <KPICard title="H.H Global" value="15.4k" percentage="Eficiência 94%" icon={Zap} state="success" />
                <KPICard title="Ticket Médio" value="R$ 1.2M" percentage="-2.1%" icon={Activity} state="warning" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Revenue Chart */}
                <Card className="lg:col-span-2 rounded-[2rem] border-border/40 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
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

                {/* Vertical Progress Bar for Projects */}
                <Card className="rounded-[2rem] border-border/40 bg-background/60 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-lg">Projetos Ativos</h3>
                        <Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal size={20} /></Button>
                    </div>
                    <div className="space-y-8">
                        {projectPerformance.map((proj) => (
                            <div key={proj.name} className="space-y-3 group cursor-pointer" onClick={() => onTabChange('obras')}>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black tracking-tight group-hover:text-primary transition-colors">{proj.name}</span>
                                    <Badge className={cn("text-[8px] font-black border-none", proj.status === 'ATENÇÃO' ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500")}>
                                        {proj.status}
                                    </Badge>
                                </div>
                                <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${proj.progresso}%` }}
                                        className={cn("absolute h-full rounded-full transition-all", proj.status === 'ATENÇÃO' ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]")}
                                    />
                                </div>
                                <div className="flex justify-between text-[9px] font-black text-muted-foreground">
                                    <span>AVANÇO FÍSICO</span>
                                    <span>{proj.progresso}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="link" className="w-full mt-8 font-black text-xs group" onClick={() => onTabChange('obras')}>
                        VER TODOS OS EMPREENDIMENTOS <ArrowUpRight size={14} className="ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                </Card>
            </div>

            <PlaceholderModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                icon={modalConfig.icon}
            />
        </div>
    );
}

function KPICard({ title, value, percentage, icon: Icon, state }: any) {
    const colors = {
        success: "text-emerald-500 bg-emerald-500/10 shadow-emerald-500/10",
        warning: "text-amber-500 bg-amber-500/10 shadow-amber-500/10",
        danger: "text-red-500 bg-red-500/10 shadow-red-500/10",
        neutral: "text-blue-500 bg-blue-500/10 shadow-blue-500/10"
    };

    return (
        <Card className="rounded-[1.5rem] border-border/40 bg-background/60 backdrop-blur-md hover:border-border/60 transition-all shadow-sm group">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-2xl font-black tracking-tight mb-1 group-hover:text-primary transition-colors">{value}</h3>
                    <Badge variant="outline" className={cn("text-[8px] font-black px-1.5 h-4 border-none", colors[state as keyof typeof colors])}>
                        {percentage}
                    </Badge>
                </div>
                <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", colors[state as keyof typeof colors])}>
                    <Icon size={24} />
                </div>
            </CardContent>
        </Card>
    );
}

const MoreHorizontal = ({ size, className }: { size?: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
    </svg>
);

export default ExecutivoDashboard;
