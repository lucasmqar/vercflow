import React from 'react';
import {
    LayoutDashboard, Building2, Layers, Shield, Zap, Box, Users, DollarSign, PieChart, Hammer, Truck, Settings, Plus, Search, Target, Activity, FileText, ShoppingCart, Camera, ShieldCheck, Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { DashboardTab } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface DesktopNavProps {
    activeTab: DashboardTab;
    onTabChange: (tab: DashboardTab) => void;
}

export function DesktopNav({ activeTab, onTabChange }: DesktopNavProps) {
    const { user } = useAuth();

    const navItems = [
        { id: 'home', icon: LayoutDashboard, label: 'Início' },
        { id: 'captura', icon: Camera, label: 'Captura' },
        { id: 'triagem', icon: ShieldCheck, label: 'Triagem' },
        { id: 'comercial', icon: Target, label: 'Comercial' },
        { id: 'engenharia', icon: Hammer, label: 'Engenharia' },
        { id: 'projetos', icon: Layers, label: 'Projetos' },
        { id: 'design', icon: Palette, label: 'Design' },
        { id: 'estoque', icon: Box, label: 'Compras' },
        { id: 'logistica', icon: Truck, label: 'Logística' },
        { id: 'financeiro', icon: DollarSign, label: 'Financeiro' },
        { id: 'rh-sst', icon: Shield, label: 'RH / SST' },
        { id: 'config', icon: Settings, label: 'Admin' },
    ];

    return (
        <div className="hidden lg:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
            <div className="glass-hub p-2 rounded-[24px] flex items-center gap-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 bg-background/40 backdrop-blur-2xl transition-all">
                {/* Logo section */}
                <div className="pl-3 pr-2 border-r border-white/10 mr-1 flex items-center">
                    <div
                        onClick={() => onTabChange('home')}
                        className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 cursor-pointer hover:scale-110 transition-transform"
                    >
                        <span className="text-white font-black text-xs">V</span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;
                        return (
                            <motion.button
                                key={item.id}
                                onClick={() => onTabChange(item.id as DashboardTab)}
                                layout
                                className={cn(
                                    "relative h-11 flex items-center gap-2 rounded-2xl transition-all duration-300 group overflow-hidden px-3",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg px-4"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                )}
                            >
                                <Icon size={18} className={cn("shrink-0", isActive && "animate-pulse")} strokeWidth={isActive ? 2.5 : 2} />

                                <AnimatePresence initial={false}>
                                    {isActive && (
                                        <motion.span
                                            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                                            animate={{ width: "auto", opacity: 1, marginLeft: 4 }}
                                            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                                            transition={{ duration: 0.3, ease: "circOut" }}
                                            className="text-[11px] font-black uppercase tracking-wider whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
