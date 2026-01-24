"use client"

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    DollarSign,
    TrendingUp,
    TrendingDown,
    CreditCard,
    FileText,
    Plus,
    Zap
} from 'lucide-react';
import { DepartmentRequests } from '../shared/DepartmentRequests';
import { useAppFlow } from '@/store/useAppFlow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab, Fee } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';

const API_BASE = 'http://localhost:4000/api';

export function FinanceiroDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [currentSection, setCurrentSection] = useState<'overview' | 'income' | 'expenses' | 'fees' | 'reports' | 'activities'>('overview');
    const { getRequestsForDepartment } = useAppFlow();
    const requestsCount = getRequestsForDepartment('FINANCEIRO').filter(r => r.status !== 'CONCLUIDO' && r.status !== 'REJEITADO').length;
    const [fees, setFees] = useState<Fee[]>([]);
    const [loading, setLoading] = useState(true);

    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'activities', label: 'Solicitações (Triagem)', icon: Zap, badge: requestsCount },
        { id: 'income', label: 'Receitas', icon: TrendingUp },
        { id: 'expenses', label: 'Despesas', icon: TrendingDown },
        { id: 'fees', label: 'Honorários', icon: DollarSign },
        { id: 'reports', label: 'Relatórios', icon: FileText },
    ];

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/fees`);
            const data = await res.json();
            setFees(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching fees:', error);
            setFees([]);
        } finally {
            setLoading(false);
        }
    };

    const totalFees = fees.reduce((sum, f) => sum + (f.valor || 0), 0);
    const paidFees = fees.filter(f => f.status === 'PAGO').reduce((sum, f) => sum + (f.valor || 0), 0);
    const pendingFees = fees.filter(f => f.status === 'PENDENTE').length;

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden font-sans">
            <div className="flex h-full">
                <div className="w-20 lg:w-64 border-r border-border/40 flex flex-col items-center lg:items-stretch py-8 bg-background/50 backdrop-blur-sm shrink-0">
                    <div className="px-6 mb-8 hidden lg:block">
                        <HeaderAnimated title="Financeiro" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-1">
                            Financial Control
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full px-4 flex-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = currentSection === item.id;
                            return (
                                <Button
                                    key={item.id}
                                    variant={isActive ? "secondary" : "ghost"}
                                    onClick={() => setCurrentSection(item.id as any)}
                                    className={cn(
                                        "w-full justify-start h-12 rounded-xl transition-all",
                                        isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted/50",
                                        "lg:px-4 px-0 lg:justify-start justify-center"
                                    )}
                                >
                                    <item.icon size={20} className="shrink-0 lg:mr-3" />
                                    <span className="hidden lg:block font-bold text-xs uppercase tracking-wide truncate">{item.label}</span>
                                    {(item as any).badge > 0 && (
                                        <Badge className="ml-auto bg-emerald-500 text-white border-none text-[8px] font-black h-4 px-1.5 animate-pulse">
                                            {(item as any).badge}
                                        </Badge>
                                    )}
                                </Button>
                            );
                        })}
                    </div>

                    <div className="p-4 mt-auto">
                        <Card className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/10 rounded-2xl hidden lg:block">
                            <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Total Honorários</p>
                            <div className="flex items-center gap-2">
                                <DollarSign size={14} className="text-emerald-500" />
                                <span className="text-xs font-bold">R$ {(totalFees / 1000).toFixed(1)}k</span>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="h-20 border-b flex items-center px-8 bg-background/50 backdrop-blur-sm lg:hidden">
                        <HeaderAnimated title="Financeiro" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 lg:p-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-[1920px] mx-auto"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                                    </div>
                                ) : currentSection === 'overview' ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                            {[
                                                { label: 'Total Honorários', value: `R$ ${(totalFees / 1000).toFixed(1)}k`, icon: DollarSign, color: 'text-emerald-500' },
                                                { label: 'Recebido', value: `R$ ${(paidFees / 1000).toFixed(1)}k`, icon: CreditCard, color: 'text-blue-500' },
                                                { label: 'Pendentes', value: pendingFees.toString(), icon: FileText, color: 'text-amber-500' },
                                            ].map((s, i) => (
                                                <Card key={i} className="rounded-[2rem] p-8 bg-background/60">
                                                    <div className="flex justify-between mb-6">
                                                        <div className={cn("p-4 rounded-2xl bg-muted/50", s.color)}>
                                                            <s.icon size={24} strokeWidth={2.5} />
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60 mb-2">{s.label}</p>
                                                    <h3 className="text-3xl font-black">{s.value}</h3>
                                                </Card>
                                            ))}
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground mb-4">Honorários Recentes</h3>
                                            <div className="grid gap-4">
                                                {fees.slice(0, 5).map(fee => (
                                                    <Card key={fee.id} className="rounded-[2rem] p-6 bg-background/60">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-xl bg-muted/40 flex items-center justify-center">
                                                                    <DollarSign size={20} className="text-primary" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-sm">{fee.descricao || 'Honorário'}</h4>
                                                                    <p className="text-xs text-muted-foreground">{fee.project?.nome || 'N/A'}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm font-bold">R$ {fee.valor?.toFixed(2)}</span>
                                                                <Badge className={cn(
                                                                    "text-[9px] font-black",
                                                                    fee.status === 'PAGO' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                                                )}>
                                                                    {fee.status}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}
                                                {fees.length === 0 && (
                                                    <Card className="rounded-[2rem] p-12 text-center">
                                                        <DollarSign size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                                                        <p className="text-sm font-bold text-muted-foreground">Nenhum honorário registrado</p>
                                                    </Card>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : currentSection === 'fees' ? (
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-black">Honorários</h2>
                                            <Button className="rounded-xl h-11 px-6 font-black uppercase tracking-widest gap-2">
                                                <Plus size={18} /> Novo Honorário
                                            </Button>
                                        </div>
                                        <div className="grid gap-4">
                                            {fees.map(fee => (
                                                <Card key={fee.id} className="rounded-[2rem] p-6 bg-background/60">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <h4 className="font-bold">{fee.descricao}</h4>
                                                            <p className="text-xs text-muted-foreground">{fee.project?.nome}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-lg font-black">R$ {fee.valor?.toFixed(2)}</span>
                                                            <Badge>{fee.status}</Badge>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ) : currentSection === 'activities' ? (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-2xl font-black tracking-tight text-foreground">Distribuições Financeiras</h2>
                                            <p className="text-sm text-muted-foreground font-medium">Itens de triagem que exigem reconhecimento de custo ou provisionamento.</p>
                                        </div>
                                        <DepartmentRequests department="FINANCEIRO" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                        {navItems.find(i => i.id === currentSection)?.icon &&
                                            React.createElement(navItems.find(i => i.id === currentSection)!.icon, { size: 48, className: "mb-4 opacity-50" })}
                                        <h3 className="text-lg font-black mb-2">{navItems.find(i => i.id === currentSection)?.label}</h3>
                                        <p className="text-sm">Seção será expandida na Fase 2</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FinanceiroDashboard;
