import React from 'react';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Filter,
    Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';

const mockTransactions = [
    { id: '1', desc: 'Compra de Argamassa ACIII', valor: -1250.00, data: '2026-01-18', cat: 'MATERIAIS', status: 'PAGO' },
    { id: '2', desc: 'Medição Pintura - Casa 04', valor: -4500.00, data: '2026-01-19', cat: 'MAO_DE_OBRA', status: 'PENDENTE' },
    { id: '3', desc: 'Aporte Cliente - Vercflow HQ', valor: 25000.00, data: '2026-01-20', cat: 'RECEITA', status: 'PAGO' },
    { id: '4', desc: 'Aluguel Equipamentos', valor: -850.00, data: '2026-01-20', cat: 'LOCACAO', status: 'PAGO' },
];

export function FinancialDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    return (
        <div className="flex flex-col h-full bg-background/50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b bg-background/20 backdrop-blur-md">
                <div>
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <DollarSign className="text-emerald-500" />
                        Gestão Financeira
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 opacity-60">Fluxo de Caixa & Lançamentos</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold gap-2">
                        <Filter size={14} /> Filtros
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold gap-2">
                        <Download size={14} /> Exportar
                    </Button>
                    <Button size="sm" className="h-9 px-6 text-xs font-black uppercase tracking-widest shadow-glow">
                        Novo Lançamento
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin">
                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="glass-card border-emerald-500/20 bg-emerald-500/[0.02]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 font-black">
                                    <TrendingUp size={20} />
                                </div>
                                <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/20 text-emerald-600 bg-emerald-500/5">+12% vs mês ant.</Badge>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Saldo em Conta</span>
                            <div className="text-3xl font-black tracking-tight mt-1 text-emerald-600">R$ 142.500,00</div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-red-500/20 bg-red-500/[0.02]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-red-500/10 rounded-xl text-red-500 font-black">
                                    <TrendingDown size={20} />
                                </div>
                                <Badge variant="outline" className="text-[10px] font-mono border-red-500/20 text-red-600 bg-red-500/5">A pagar este mês</Badge>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Saídas Previstas</span>
                            <div className="text-3xl font-black tracking-tight mt-1 text-red-600">R$ 28.420,00</div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-primary/20 bg-primary/[0.02]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary font-black">
                                    <Calendar size={20} />
                                </div>
                                <Badge variant="outline" className="text-[10px] font-mono border-primary/20 text-primary bg-primary/5">Fechamento 30/01</Badge>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Resultado Operacional</span>
                            <div className="text-3xl font-black tracking-tight mt-1 text-primary">R$ 114.080,00</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Transactions Table */}
                <Card className="glass-card overflow-hidden border-border/40">
                    <CardHeader className="px-6 py-4 flex flex-row items-center justify-between border-b border-border/40 bg-muted/10">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/70">Últimos Lançamentos</CardTitle>
                        <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest">Ver Tudo</Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-border/40 bg-muted/5">
                                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Descrição</th>
                                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Categoria</th>
                                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Valor</th>
                                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Data</th>
                                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {mockTransactions.map(t => (
                                    <tr key={t.id} className="hover:bg-primary/[0.02] transition-colors group">
                                        <td className="p-4">
                                            <span className="text-sm font-bold text-foreground/80">{t.desc}</span>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter opacity-70">
                                                {t.cat}
                                            </Badge>
                                        </td>
                                        <td className="p-4 p-4 font-mono font-bold text-sm">
                                            <div className={cn("flex items-center gap-1.5", t.valor > 0 ? "text-emerald-600" : "text-red-500")}>
                                                {t.valor > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.valor)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs text-muted-foreground font-medium">{t.data}</span>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={cn(
                                                "text-[9px] font-black uppercase tracking-widest h-5 rounded-md",
                                                t.status === 'PAGO' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                            )}>
                                                {t.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
