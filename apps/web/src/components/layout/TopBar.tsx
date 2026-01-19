import React from 'react';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Sun,
    Moon,
    ChevronRight,
    Search,
    Bell,
    Menu,
    Zap,
    ClipboardCheck,
    MessageSquare,
    TrendingUp,
} from 'lucide-react';

interface TopBarProps {
    activeTab: DashboardTab;
    onTabChange: (tab: DashboardTab) => void;
}

const tabLabels: Record<DashboardTab, string> = {
    captura: 'Canais de Captura',
    triagem: 'Triagem Técnica',
    atividades: 'Monitoramento',
    dashboard: 'Insights CEO',
    equipe: 'Recursos Humanos',
    obras: 'Empreendimentos',
    clientes: 'Contratantes',
    config: 'Configurações',
    disciplinas: 'Disciplinas Técnicas'
};

const themes = [
    'light',
    'dark',
    'blueprint',
    'industrial',
];

export function TopBar({ activeTab, onTabChange, showSidebar, onToggleSidebar }: TopBarProps & { showSidebar?: boolean; onToggleSidebar?: () => void }) {
    const { actualTheme, setTheme } = useTheme();
    const { user, logout } = useAuth();

    const tabs = [
        { id: 'captura', label: 'Captura', icon: Zap },
        { id: 'triagem', label: 'Triagem', icon: ClipboardCheck },
        { id: 'atividades', label: 'Monitoramento', icon: MessageSquare },
        { id: 'dashboard', label: 'Insights', icon: TrendingUp },
    ];

    return (
        <header className="flex items-center justify-between h-14 px-4 glass-header border-b border-border/40 select-none z-50">
            {/* Left: Brand & Navigation */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 pr-4 border-r border-border/40">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8 rounded-lg hover:bg-primary/5 hover:text-primary transition-all", showSidebar && "bg-primary/10 text-primary")}
                        onClick={onToggleSidebar}
                    >
                        <Menu size={18} />
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-primary flex items-center justify-center technical-shadow">
                            <span className="text-white font-black text-xs tracking-tighter">VF</span>
                        </div>
                        <span className="text-sm font-black tracking-tight text-foreground/90 hidden md:block">VERCFLOW</span>
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id as DashboardTab)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all border border-transparent",
                                    isActive
                                        ? "bg-primary/5 text-primary border-primary/10 shadow-sm"
                                        : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <Icon size={14} className={isActive ? "text-primary" : "text-muted-foreground/40"} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Right: Actions & User */}
            <div className="flex items-center space-x-1">
                {/* Global Search */}
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground/60 hover:text-foreground transition-all">
                    <Search size={18} />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground/60 hover:text-foreground transition-all relative">
                    <Bell size={18} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                </Button>

                <div className="w-[1px] h-4 bg-border/40 mx-2" />

                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground/60 hover:text-foreground transition-all"
                    onClick={() => setTheme(actualTheme === 'light' ? 'dark' : 'light')}
                >
                    {actualTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </Button>

                <div className="w-[1px] h-4 bg-border/40 mx-2" />

                {/* User Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 pl-1 pr-2 gap-2 hover:bg-muted/50 transition-all rounded-xl">
                            <Avatar className="h-7 w-7 border border-border/50">
                                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black uppercase">
                                    {user?.nome?.charAt(0) ?? 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start hidden sm:flex">
                                <span className="text-[12px] font-bold text-foreground/90 leading-none">
                                    {user?.nome?.split(' ')[0]}
                                </span>
                                <span className="text-[9px] font-mono font-black text-muted-foreground/40 uppercase tracking-tighter">
                                    {user?.role}
                                </span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2 p-1.5 glass-card border-border/40 shadow-glow">
                        <div className="px-2 py-2 mb-1.5 bg-muted/30 rounded-lg">
                            <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-0.5">Operador Técnico</p>
                            <p className="text-[12px] font-bold text-foreground/90 truncate">{user?.nome}</p>
                        </div>
                        <DropdownMenuSeparator className="bg-border/20 mx-1 my-1" />
                        <DropdownMenuItem className="text-[13px] font-medium py-2 px-3 rounded-md focus:bg-primary/5 focus:text-primary cursor-pointer gap-2">
                            Configurações do Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px] font-medium py-2 px-3 rounded-md focus:bg-primary/5 focus:text-primary cursor-pointer gap-2">
                            Preferências do Workspace
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/20 mx-1 my-1" />
                        <DropdownMenuItem onSelect={logout} className="text-[13px] font-bold py-2 px-3 rounded-md text-destructive focus:bg-destructive/5 focus:text-destructive cursor-pointer gap-2 uppercase tracking-tight">
                            Encerrar Sessão
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
