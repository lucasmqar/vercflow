import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    MessageSquare,
    ClipboardCheck,
    Zap,
    LayoutDashboard,
    Users,
    Building2,
    Settings,
    Plus,
    Bell,
    LogOut,
    User as UserIcon,
    HelpCircle,
    Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import type { DashboardTab } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
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
    { id: 'captura', label: 'Canais de Captura', icon: MessageSquare, shortcut: '1' },
    { id: 'triagem', label: 'Triagem Técnica', icon: ClipboardCheck, shortcut: '2' },
    { id: 'atividades', label: 'Monitoramento', icon: Zap, shortcut: '3' },
    { id: 'disciplinas', label: 'Disciplinas', icon: Layers, shortcut: '4' },
    { id: 'dashboard', label: 'Insights CEO', icon: LayoutDashboard, shortcut: '5' },
    { id: 'equipe', label: 'Recursos Humanos', icon: Users, shortcut: '6' },
    { id: 'obras', label: 'Empreendimentos', icon: Building2, shortcut: '7' },
    { id: 'clientes', label: 'Contratantes', icon: Users, shortcut: '8' },
];

export function Sidebar({
    activeTab,
    onTabChange,
    onOpenCommandPalette,
    collapsed,
    setCollapsed
}: SidebarProps) {
    const { user, logout } = useAuth();

    const getVisibleItems = () => {
        if (!user) return [];
        // Same logic but including 'disciplinas' where relevant
        if (user.role === 'ADMIN' || user.role === 'CEO') return navItems;
        if (user.role === 'GESTOR') return navItems.filter(i => ['captura', 'triagem', 'atividades', 'obras', 'dashboard', 'clientes', 'disciplinas'].includes(i.id));
        if (user.role === 'TRIAGISTA') return navItems.filter(i => ['captura', 'triagem'].includes(i.id));
        if (user.role === 'OPERACIONAL' || user.role === 'PROFISSIONAL_INTERNO') return navItems.filter(i => ['captura', 'atividades', 'disciplinas'].includes(i.id));
        return navItems.filter(i => ['captura'].includes(i.id));
    };

    const visibleItems = getVisibleItems();

    return (
        <div
            className={cn(
                "h-screen bg-muted/20 border-r border-border/40 flex flex-col transition-all duration-300 relative group/sidebar select-none",
                collapsed ? "w-[60px]" : "w-[240px]"
            )}
        >
            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 w-6 h-6 bg-background border border-border/60 rounded-full flex items-center justify-center z-50 opacity-0 group-hover/sidebar:opacity-100 transition-opacity shadow-sm hover:scale-110 active:scale-95"
            >
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>

            {/* Header / Workspace Profile */}
            <div className="p-3 mb-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className={cn(
                            "flex items-center gap-2 p-2 rounded-lg hover:bg-muted/80 cursor-pointer transition-all active:scale-[0.98]",
                            collapsed && "justify-center p-1"
                        )}>
                            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0 technical-shadow">
                                <span className="text-white font-black text-sm tracking-tighter">VF</span>
                            </div>
                            {!collapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-bold truncate tracking-tight text-foreground/90">VERCFLOW</p>
                                    <p className="text-[10px] text-muted-foreground/60 truncate uppercase font-mono leading-none tracking-tighter">Gestão Técnica</p>
                                </div>
                            )}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 p-1 ml-2 border-border/50 shadow-glow">
                        <DropdownMenuItem className="text-[13px] py-1.5 focus:bg-primary/5 cursor-pointer">
                            Preferências do Workspace
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px] py-1.5 focus:bg-primary/5 cursor-pointer">
                            Importar Dados (JSON/SQL)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/40" />
                        <DropdownMenuItem onClick={logout} className="text-[13px] py-1.5 text-destructive focus:bg-destructive/5 cursor-pointer">
                            Logout de VERCFLOW
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Quick Action - New Registry (Prominent) */}
            <div className="px-3 mb-4">
                <Button
                    onClick={() => {/* Trigger global new record flow */ }}
                    className={cn(
                        "w-full h-9 flex items-center gap-2 px-3 rounded-md shadow-glow transition-all hover:translate-y-[-1px] active:translate-y-[1px]",
                        collapsed ? "justify-center px-0" : "justify-start"
                    )}
                >
                    <Plus size={18} />
                    {!collapsed && <span className="text-[13px] font-semibold tracking-tight">Novo Registro</span>}
                </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3 space-y-0.5 scrollbar-thin">
                {!collapsed && (
                    <p className="px-2.5 py-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-1">
                        Plataforma
                    </p>
                )}
                {visibleItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id as DashboardTab)}
                            className={cn(
                                "w-full flex items-center gap-3 px-2.5 py-1.5 rounded-md transition-all group",
                                isActive
                                    ? "bg-primary/[0.03] text-primary font-semibold border border-primary/10"
                                    : "text-muted-foreground/70 hover:bg-muted/60 hover:text-foreground border border-transparent"
                            )}
                        >
                            <Icon size={18} className={cn(
                                "shrink-0 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground"
                            )} />
                            {!collapsed && <span className="text-[13.5px] truncate tracking-tight">{item.label}</span>}
                            {!collapsed && isActive && (
                                <motion.div layoutId="active-indicator" className="ml-auto w-1 h-3 rounded-full bg-primary/40" />
                            )}
                        </button>
                    );
                })}

                <div className="h-4" />

                {!collapsed && (
                    <p className="px-2.5 py-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-1">
                        Sessão Admin
                    </p>
                )}
                <button
                    onClick={() => onTabChange('config')}
                    className={cn(
                        "w-full flex items-center gap-3 px-2.5 py-1.5 rounded-md transition-all text-muted-foreground/70 hover:bg-muted/60 hover:text-foreground border border-transparent",
                        activeTab === 'config' && "bg-primary/[0.03] text-primary font-semibold border border-primary/10"
                    )}
                >
                    <Settings size={18} className={cn(
                        "shrink-0",
                        activeTab === 'config' ? "text-primary" : "text-muted-foreground/40"
                    )} />
                    {!collapsed && <span className="text-[13px] tracking-tight">Configurações</span>}
                </button>
            </div>

            {/* Footer / User Profile Context */}
            <div className="mt-auto p-3 border-t border-border/30 bg-muted/10">
                {!collapsed && (
                    <div className="mb-4 space-y-3">
                        <div className="space-y-1">
                            <div className="flex items-center justify-between px-2 text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                <span>Sistema v2.5.0</span>
                                <div className="flex items-center gap-1 text-[8px]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Sync</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={cn(
                    "flex items-center gap-2.5 p-1.5 rounded-lg border border-transparent transition-all",
                    collapsed ? "justify-center p-0" : "bg-background/40 technical-shadow"
                )}>
                    <Avatar className="w-7 h-7 border border-border/50">
                        <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold uppercase">
                            {user?.nome.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold truncate leading-tight text-foreground/90">{user?.nome}</p>
                            <p className="text-[10px] text-muted-foreground/60 truncate font-mono tracking-tighter">{user?.role}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
