import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Inbox,
    Users,
    Package,
    FileText,
    ChevronLeft,
    ChevronRight,
    ClipboardCheck,
    Building2,
    Gavel,
    Layers,
    LayoutDashboard,
    Settings,
    PenTool,
    Briefcase
} from 'lucide-react';
import type { DashboardTab } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
    activeTab: DashboardTab;
    onTabChange: (tab: DashboardTab) => void;
    onOpenRegistro?: () => void;
}

const navItems: { label: string; items: { id: DashboardTab; icon: React.ElementType; label: string; count?: number }[] }[] = [
    {
        label: 'PRINCIPAL',
        items: [
            { id: 'inbox', icon: Inbox, label: 'Inbox', count: 12 },
            { id: 'triagem', icon: ClipboardCheck, label: 'Triagem', count: 5 },
        ]
    },
    {
        label: 'OPERACIONAL',
        items: [
            { id: 'obras', icon: Building2, label: 'Obras' },
            { id: 'registros', icon: PenTool, label: 'Registros' },
            // tasks mapped to 'registros' or separate tab? DR says Task Management. 
            // Adding 'tarefas' to types/index.ts might be needed later, for now mapping to existing types.
        ]
    },
    {
        label: 'GESTÃO',
        items: [
            { id: 'gestao', icon: Briefcase, label: 'Clientes & Contratos' },
            { id: 'profissionais', icon: Users, label: 'Equipe' },
            { id: 'insumos', icon: Package, label: 'Insumos' },
        ]
    },
    {
        label: 'ARQUIVO',
        items: [
            { id: 'documentos', icon: FileText, label: 'Documentos' },
            { id: 'processos', icon: Gavel, label: 'Jurídico' },
            { id: 'arquivo', icon: Layers, label: 'Arquivo Morto' },
        ]
    }
];

// Add special action for Sketch/Registro
const sketchAction = { id: 'novo-registro', icon: PenTool, label: 'Novo Registro' };

export function Sidebar({ activeTab, onTabChange, onOpenRegistro }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.div
            initial={{ width: 260 }}
            animate={{ width: collapsed ? 80 : 260 }}
            className="h-screen bg-sidebar border-r border-sidebar-border sticky top-0 hidden md:flex flex-col z-50 transition-all duration-300 shadow-xl"
        >
            {/* Header */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-sidebar-primary flex items-center justify-center shadow-lg shadow-sidebar-primary/20">
                    <Layers className="text-white w-5 h-5" />
                </div>
                {!collapsed && (
                    <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-lg tracking-tight whitespace-nowrap text-sidebar-foreground">VERCFLOW</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider whitespace-nowrap">Construction OS</span>
                    </div>
                )}
            </div>

            {/* Quick Action - New Registro */}
            <div className={cn("px-4 mb-2", collapsed ? "flex justify-center" : "")}>
                <button
                    onClick={onOpenRegistro}
                    className={cn(
                        "flex items-center gap-3 w-full bg-gradient-to-r from-primary to-primary/80 hover:to-primary text-white shadow-lg shadow-primary/25 transition-all duration-300 group",
                        collapsed ? "p-3 rounded-xl justify-center" : "px-4 py-3 rounded-xl"
                    )}
                    title="Novo Registro"
                >
                    <PenTool size={20} className="shrink-0" />
                    {!collapsed && <span className="font-bold text-sm">Novo Registro</span>}
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-3 py-4 space-y-8 overflow-y-auto custom-scrollbar">
                {navItems.map((group, gIndex) => (
                    <div key={gIndex} className="space-y-2">
                        {!collapsed && (
                            <h4 className="px-4 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-3">
                                {group.label}
                            </h4>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = activeTab === item.id;
                                const Icon = item.icon;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onTabChange(item.id as DashboardTab)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                                            isActive
                                                ? "bg-sidebar-accent text-sidebar-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                                        )}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-r-full"
                                            />
                                        )}
                                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={cn("shrink-0 transition-transform duration-300", isActive && "text-sidebar-primary")} />

                                        {!collapsed && (
                                            <span className="flex-1 text-left text-sm truncate font-medium">{item.label}</span>
                                        )}

                                        {!collapsed && item.count && (
                                            <span className={cn(
                                                "text-[10px] px-2 py-0.5 rounded-full font-bold",
                                                isActive ? "bg-sidebar-primary text-white" : "bg-sidebar-border text-muted-foreground"
                                            )}>
                                                {item.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border space-y-2 bg-sidebar-accent/10">
                <button
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                        collapsed && "justify-center"
                    )}
                    title="Configurações"
                >
                    <Settings size={18} />
                    {!collapsed && <span className="text-sm font-medium">Configurações</span>}
                </button>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                        collapsed && "justify-center"
                    )}
                >
                    {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /> <span className="text-sm font-medium">Recolher</span></>}
                </button>
            </div>
        </motion.div>
    );
}
