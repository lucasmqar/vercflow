"use client"

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Plus,
    X,
    User,
    Sun,
    Moon,
    LayoutDashboard,
    Zap,
    Layers,
    Search,
    Settings,
    Building2,
    Target,
    Shield,
    Box,
    Truck,
    DollarSign,
    PieChart,
    Hammer,
    Users,
    ChevronUp,
    Grid,
    Camera,
    ShieldCheck,
    Palette,
    Bell,
    ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/providers/ThemeProvider';
import type { DashboardTab } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileDockProps {
    activeTab: DashboardTab;
    onTabChange: (tab: DashboardTab) => void;
    onOpenCommandPalette: () => void;
}

export function MobileDock({ activeTab, onTabChange, onOpenCommandPalette }: MobileDockProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { user } = useAuth();
    const { theme, setTheme, actualTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(actualTheme === 'dark' ? 'light' : 'dark');
    };

    const navItems = [
        { id: 'home', label: 'Início', icon: LayoutDashboard },
        { id: 'comercial', label: 'Comercial', icon: Target },
        { id: 'captura', label: 'Captura', icon: Plus },
        { id: 'triagem', label: 'Triagem', icon: Zap },
        { id: 'obras', label: 'Obras', icon: Building2 },
        { id: 'projetos', label: 'Projetos', icon: Layers },
        { id: 'design', label: 'Design', icon: Palette },
        { id: 'engenharia', label: 'Engenharia', icon: Hammer },
        { id: 'compras', label: 'Compras', icon: ShoppingCart },
        { id: 'estoque', label: 'Estoque', icon: Box },
        { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
        { id: 'rh-sst', label: 'RH & SST', icon: ShieldCheck },
        { id: 'notifications', label: 'Mensagens', icon: Bell },
        { id: 'config', label: 'Admin', icon: Settings },
        { id: 'logistica', label: 'Logística', icon: Truck }, // Moved to end
    ];

    const activeItem = navItems.find(item => item.id === activeTab) || navItems[0]; // Changed index to 0 for 'home'

    return createPortal(
        <div className="fixed inset-x-0 bottom-6 z-[99999] flex justify-center pointer-events-none lg:hidden">
            <div className="pointer-events-auto contents">
                {/* LiquidGlass Container */}
                <motion.div
                    initial={false}
                    animate={isExpanded ? {
                        width: "calc(100vw - 48px)",
                        height: "auto",
                        borderRadius: "32px",
                        padding: "24px"
                    } : {
                        width: "72px",
                        height: "72px",
                        borderRadius: "36px",
                        padding: "0px"
                    }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="bg-background/65 backdrop-blur-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.2)] overflow-hidden relative"
                >
                    <AnimatePresence mode="wait">
                        {!isExpanded ? (
                            <motion.button
                                key="collapsed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsExpanded(true)}
                                className="w-[72px] h-[72px] flex items-center justify-center text-primary"
                            >
                                <motion.div
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <activeItem.icon size={28} strokeWidth={2.5} />
                                </motion.div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                            </motion.button>
                        ) : (
                            <motion.div
                                key="expanded"
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white">
                                            <Grid size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-widest leading-none">Vercflow OS</h3>
                                            <p className="text-[10px] text-muted-foreground font-bold mt-1">SISTEMA INTEGRADO</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto no-scrollbar py-2">
                                    {navItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                onTabChange(item.id as DashboardTab);
                                                setIsExpanded(false);
                                            }}
                                            className={cn(
                                                "flex flex-col items-center gap-2 p-3 rounded-[24px] transition-all",
                                                activeTab === item.id
                                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            <item.icon size={20} />
                                            <span className="text-[9px] font-black uppercase tracking-tighter text-center">{item.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                    <button
                                        onClick={onOpenCommandPalette}
                                        className="flex items-center justify-center gap-2 h-12 rounded-[20px] bg-muted/40 font-black text-[10px] uppercase tracking-widest text-muted-foreground"
                                    >
                                        <Search size={16} /> Buscar
                                    </button>
                                    <button
                                        onClick={toggleTheme}
                                        className="flex items-center justify-center gap-2 h-12 rounded-[20px] bg-muted/40 font-black text-[10px] uppercase tracking-widest text-muted-foreground"
                                    >
                                        {actualTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                                        {actualTheme === 'dark' ? 'Light' : 'Dark'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>,
        document.body
    );
}
