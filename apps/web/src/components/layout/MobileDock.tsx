import React, { useState } from 'react';
import {
    Plus,
    X,
    User,
    Sun,
    Moon,
    ClipboardList,
    LayoutDashboard,
    Zap,
    Layers,
    Search,
    Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import type { DashboardTab } from '@/types';

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
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const navItems = [
        { id: 'config', icon: Settings, label: 'Ajustes' },
        { id: 'equipe', icon: User, label: 'Equipe' },
        { id: 'atividades', icon: Zap, label: 'Tarefas' },
        { id: 'triagem', icon: Layers, label: 'Triagem' },
        { id: 'dashboard', icon: LayoutDashboard, label: 'Painel' },
        { id: 'search', icon: Search, isAction: true, label: 'Busca' },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-[9999] lg:hidden flex flex-col items-end pointer-events-none">
            {/* Dock Menu Container */}
            <div
                className={cn(
                    "flex flex-col-reverse items-end gap-3 mb-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    isExpanded ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-10 pointer-events-none"
                )}
            >
                {/* Theme Toggle */}
                <button
                    onClick={() => {
                        toggleTheme();
                        setIsExpanded(false);
                    }}
                    className="w-12 h-12 rounded-full flex items-center justify-center glass-hub text-foreground shadow-lg hover:scale-105 active:scale-95 transition-transform"
                >
                    {actualTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Nav Items */}
                {navItems.map((item, idx) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <div key={item.label} className="flex items-center gap-3">
                            <span className={cn(
                                "px-2 py-1 bg-background/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest rounded-md border border-white/10 shadow-sm transition-opacity duration-300",
                                isExpanded ? "opacity-100" : "opacity-0"
                            )}>
                                {item.label}
                            </span>
                            <button
                                onClick={() => {
                                    if (item.id === 'search') {
                                        onOpenCommandPalette();
                                    } else {
                                        onTabChange(item.id as DashboardTab);
                                    }
                                    setIsExpanded(false);
                                }}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center glass-hub shadow-lg transition-all duration-300 active:scale-95",
                                    isActive ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                                style={{
                                    transitionDelay: `${idx * 50}ms`
                                }}
                            >
                                <Icon size={20} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Main FAB */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/20 backdrop-blur-xl transition-all duration-500 pointer-events-auto z-[10000]",
                    isExpanded ? "bg-primary text-primary-foreground rotate-45" : "bg-white/10 text-foreground hover:scale-105 active:scale-95"
                )}
                style={{
                    background: isExpanded ? '' : 'rgba(255, 255, 255, 0.05)', // Fallback for glass
                    backdropFilter: 'blur(20px)'
                }}
            >
                <Plus size={32} strokeWidth={1.5} />
            </button>
        </div>
    );
}
