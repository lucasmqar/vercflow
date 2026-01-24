"use client"

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Package,
    ArrowUpRight,
    AlertTriangle,
    History,
    Plus,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab, StockMovement } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';

const API_BASE = 'http://localhost:4000/api';

export function EstoqueDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [currentSection, setCurrentSection] = useState<'overview' | 'inventory' | 'movements' | 'lowstock' | 'history'>('overview');
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);

    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'inventory', label: 'Itens em Estoque', icon: Package },
        { id: 'movements', label: 'Movimentações', icon: ArrowUpRight },
        { id: 'lowstock', label: 'Estoque Baixo', icon: AlertTriangle },
        { id: 'history', label: 'Histórico', icon: History },
    ];

    useEffect(() => {
        fetchMovements();
    }, []);

    const fetchMovements = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/stock`);
            const data = await res.json();
            setMovements(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching stock:', error);
            setMovements([]);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        totalMovements: movements.length,
        entries: movements.filter(m => m.tipo === 'ENTRADA').length,
        exits: movements.filter(m => m.tipo === 'SAIDA').length,
        pending: movements.filter(m => m.status === 'PENDENTE').length,
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden font-sans">
            <div className="flex h-full">
                <div className="w-20 lg:w-64 border-r border-border/40 flex flex-col items-center lg:items-stretch py-8 bg-background/50 backdrop-blur-sm shrink-0">
                    <div className="px-6 mb-8 hidden lg:block">
                        <HeaderAnimated title="Estoque" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-1">
                            Inventory Control
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
                                    <item.icon size={20} className={cn("shrink-0", "lg:mr-3")} />
                                    <span className="hidden lg:block font-bold text-xs uppercase tracking-wide truncate">{item.label}</span>
                                </Button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="h-20 border-b flex items-center px-8 bg-background/50 backdrop-blur-sm lg:hidden">
                        <HeaderAnimated title="Estoque" />
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
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                            {[
                                                { label: 'Movimentações', value: stats.totalMovements.toString(), icon: History },
                                                { label: 'Entradas', value: stats.entries.toString(), icon: ArrowUpRight },
                                                { label: 'Saídas', value: stats.exits.toString(), icon: Package },
                                                { label: 'Pendentes', value: stats.pending.toString(), icon: AlertTriangle },
                                            ].map((s, i) => (
                                                <Card key={i} className="rounded-[2rem] p-8 bg-background/60">
                                                    <div className="flex justify-between mb-6">
                                                        <div className="p-4 rounded-2xl bg-muted/50 text-primary">
                                                            <s.icon size={24} strokeWidth={2.5} />
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60 mb-2">{s.label}</p>
                                                    <h3 className="text-3xl font-black">{s.value}</h3>
                                                </Card>
                                            ))}
                                        </div>

                                        {movements.length === 0 && (
                                            <Card className="rounded-[2rem] p-12 text-center">
                                                <Package size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                                                <p className="text-sm font-bold text-muted-foreground">Nenhuma movimentação registrada</p>
                                            </Card>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                        {navItems.find(i => i.id === currentSection)?.icon &&
                                            React.createElement(navItems.find(i => i.id === currentSection)!.icon, { size: 48, className: "mb-4 opacity-50" })}
                                        <h3 className="text-lg font-black mb-2">{navItems.find(i => i.id === currentSection)?.label}</h3>
                                        <p className="text-sm">Conectado ao endpoint `/api/stock`</p>
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

export default EstoqueDashboard;
