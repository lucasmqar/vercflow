import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Zap,
    LayoutDashboard,
    Users,
    Building2,
    Settings,
    Plus,
    Layers,
    DollarSign,
    Box,
    PieChart,
    Hammer,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import type { DashboardTab } from '@/types';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
    activeTab: DashboardTab;
    onTabChange: (tab: DashboardTab) => void;
    onOpenCommandPalette: () => void;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const navItems = [
    { id: 'home', label: 'Dashboard Geral', icon: LayoutDashboard },
    { id: 'obras', label: 'Gestão de Obras', icon: Building2 },
    { id: 'gestao-projetos', label: 'Fases & Projetos', icon: Layers },
    { id: 'captura', label: 'Captura (Canais)', icon: MessageSquare },
    { id: 'triagem', label: 'Triagem Técnica', icon: Shield },
    { id: 'atividades', label: 'Operações (Zap)', icon: Zap },
    { id: 'disciplinas', label: 'Engenharias', icon: Layers },
    { id: 'estoque', label: 'Logística & Frota', icon: Box },
    { id: 'equipe', label: 'Recursos Humanos', icon: Users },
    { id: 'clientes', label: 'Contratantes', icon: BriefcaseIcon }, // brief case placeholder if brief case is not in imports
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'dashboard', label: 'Insights CEO', icon: PieChart },
];

// Helper for missing icon
function BriefcaseIcon(props: any) {
    return <Hammer {...props} />
}

export function Sidebar({
    activeTab,
    onTabChange,
    collapsed,
    setCollapsed
}: SidebarProps) {
    const { user, logout } = useAuth();

    const getVisibleItems = () => {
        if (!user) return [];
        return navItems; // simplify for now or keep logic
    };

    const visibleItems = getVisibleItems();

    return (
        <div
            className={cn(
                "h-screen bg-background border-r border-border/30 flex flex-col transition-all duration-500 ease-in-out relative z-40",
                collapsed ? "w-[64px]" : "w-[260px]"
            )}
        >
            {/* Minimal Collapse Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-12 w-6 h-6 bg-background border border-border/40 rounded-full flex items-center justify-center z-50 shadow-sm transition-transform hover:scale-110"
            >
                {collapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
            </button>

            {/* Profile / Workspace info */}
            <div className="p-4 mb-4">
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-xl border border-transparent transition-all",
                    !collapsed && "bg-secondary/20 border-border/10"
                )}>
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                        <span className="text-white font-black text-xs">V</span>
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black tracking-tight text-foreground">VERCFLOW</p>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">Pro v2.5</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Core Navigation */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-none">
                {visibleItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id as DashboardTab)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary/10 text-primary font-bold shadow-sm"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                        >
                            <Icon size={18} className={cn(
                                "shrink-0 transition-transform group-hover:scale-110",
                                isActive ? "text-primary" : "text-muted-foreground/50"
                            )} />
                            {!collapsed && (
                                <span className="text-[13px] font-medium tracking-tight truncate">
                                    {item.label}
                                </span>
                            )}
                            {isActive && !collapsed && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 w-1 h-5 bg-primary rounded-r-full"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-border/10 bg-muted/5">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={cn(
                            "w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/80 transition-all",
                            collapsed && "justify-center"
                        )}>
                            <Avatar className="w-7 h-7 border border-border/50">
                                <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black">
                                    {user?.nome.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            {!collapsed && (
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-[12px] font-bold truncate leading-none">{user?.nome}</p>
                                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter mt-1">{user?.role}</p>
                                </div>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border/40 shadow-2xl p-2">
                        <DropdownMenuItem onClick={() => onTabChange('config')} className="rounded-xl py-2 gap-3 cursor-pointer">
                            <Settings size={16} /> Configurações
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/10" />
                        <DropdownMenuItem onClick={logout} className="rounded-xl py-2 gap-3 text-destructive cursor-pointer">
                            <LogOutIcon size={16} /> Encerrar Sessão
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

import { LogOut as LogOutIcon, Briefcase } from 'lucide-react';
