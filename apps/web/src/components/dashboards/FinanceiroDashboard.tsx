"use client"

import React, { useState } from 'react';
import {
    LayoutDashboard,
    TrendingUp,
    CreditCard,
    FileText,
    Receipt,
    DollarSign,
    Landmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';

const PlaceholderSection = ({ title, icon: Icon }: any) => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-muted/30 rounded-[2rem] flex items-center justify-center mb-6">
            <Icon size={40} className="opacity-50" />
        </div>
        <h2 className="text-xl font-black tracking-tight mb-2">Seção {title}</h2>
        <p className="max-w-[300px] text-center text-sm font-medium opacity-60">
            Módulo financeiro em desenvolvimento.
        </p>
    </div>
);

export function FinanceiroDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [currentSection, setCurrentSection] = useState<'overview' | 'cashflow' | 'payables' | 'contracts' | 'taxes'>('overview');

    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'cashflow', label: 'Fluxo de Caixa', icon: TrendingUp },
        { id: 'payables', label: 'Contas a Pagar', icon: CreditCard },
        { id: 'contracts', label: 'Propostas', icon: FileText },
        { id: 'taxes', label: 'Fiscal', icon: Receipt },
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden font-sans">
            <div className="flex h-full">
                <div className="w-20 lg:w-64 border-r border-border/40 flex flex-col items-center lg:items-stretch py-8 bg-background/50 backdrop-blur-sm shrink-0 transition-all duration-300">
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
                                        "w-full justify-start h-12 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                                        "lg:px-4 px-0 lg:justify-start justify-center"
                                    )}
                                >
                                    <item.icon size={20} className={cn("shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground", "lg:mr-3")} />
                                    <span className="hidden lg:block font-bold text-xs uppercase tracking-wide truncate">{item.label}</span>
                                </Button>
                            );
                        })}
                    </div>

                    <div className="p-4 mt-auto">
                        <Card className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/10 rounded-2xl hidden lg:block">
                            <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Saldo em Caixa</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-foreground">R$ 1.2M</span>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col bg-muted/5">
                    <div className="h-20 border-b border-border/40 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm shrink-0 lg:hidden">
                        <HeaderAnimated title="Financeiro" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-[1920px] mx-auto h-full"
                            >
                                <PlaceholderSection
                                    title={navItems.find(i => i.id === currentSection)?.label}
                                    icon={navItems.find(i => i.id === currentSection)?.icon}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FinanceiroDashboard;
