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
import { toast } from 'sonner';
import {
    Sun,
    Moon,
    Search,
    Bell,
    Menu,
    HardHat,
    Settings,
    LogOut,
    User
} from 'lucide-react';

interface TopBarProps {
    activeTab: DashboardTab;
    onTabChange: (tab: DashboardTab) => void;
    isFieldMode?: boolean;
    onToggleFieldMode?: () => void;
    showSidebar?: boolean;
    onToggleSidebar?: () => void;
}

export function TopBar({
    onTabChange,
    activeTab,
    showSidebar,
    onToggleSidebar,
    isFieldMode,
    onToggleFieldMode
}: TopBarProps) {
    const { actualTheme, setTheme } = useTheme();
    const { user, logout } = useAuth();

    return (
        <header className="flex items-center justify-between h-16 px-6 bg-background/60 backdrop-blur-xl border-b border-border/30 sticky top-0 z-40 select-none">
            {/* Left Section: Context */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-9 w-9 rounded-xl transition-all hover:bg-primary/5 hover:text-primary",
                        showSidebar && "text-primary bg-primary/5"
                    )}
                    onClick={onToggleSidebar}
                >
                    <Menu size={18} />
                </Button>

                <div className="h-6 w-[1px] bg-border/40 mx-2 hidden sm:block" />

                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 leading-none mb-1">Workspace</span>
                    <span className="text-sm font-bold tracking-tight">Painel Operacional</span>
                </div>
            </div>

            {/* Right Section: Global Actions */}
            <div className="flex items-center gap-2">
                {/* Search Trigger */}
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground/60 hover:text-foreground hover:bg-muted/50">
                    <Search size={18} />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 relative">
                    <Bell size={18} />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full border-2 border-background" />
                </Button>

                <div className="h-4 w-[1px] bg-border/40 mx-2" />

                {/* Field Mode Toggle - Premium Stylized */}
                <Button
                    variant="ghost"
                    onClick={onToggleFieldMode}
                    className={cn(
                        "h-9 px-3 gap-2 rounded-xl transition-all border border-transparent",
                        isFieldMode
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 border-orange-400"
                            : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/50"
                    )}
                >
                    <HardHat size={16} />
                    <span className="text-xs font-bold hidden sm:inline">{isFieldMode ? 'MODO CAMPO' : 'Escritório'}</span>
                </Button>

                <div className="h-4 w-[1px] bg-border/40 mx-2" />

                {/* Theme & User */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-muted-foreground/60 hover:text-foreground hover:bg-muted/50"
                    onClick={() => setTheme(actualTheme === 'light' ? 'dark' : 'light')}
                >
                    {actualTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 pl-1 pr-1 rounded-xl hover:bg-muted/50 transition-all">
                            <Avatar className="h-7 w-7 border border-border/50">
                                <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black uppercase">
                                    {user?.nome?.charAt(0) ?? 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 mt-2 p-2 rounded-2xl glass-card border-border/40 shadow-2xl">
                        <div className="p-3 mb-2 bg-secondary/20 rounded-xl">
                            <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest leading-none mb-1.5">Sessão Ativa</p>
                            <p className="text-sm font-bold text-foreground truncate">{user?.nome}</p>
                            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{user?.email}</p>
                        </div>
                        <DropdownMenuItem onClick={() => toast("Ajustes em breve")} className="rounded-xl py-2 gap-3 cursor-pointer">
                            <User size={16} className="text-muted-foreground" /> Perfil Técnico
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onTabChange('config')} className="rounded-xl py-2 gap-3 cursor-pointer">
                            <Settings size={16} className="text-muted-foreground" /> Configurações
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/10 my-2" />
                        <DropdownMenuItem onSelect={logout} className="rounded-xl py-2 gap-3 text-destructive font-bold cursor-pointer uppercase text-[10px] tracking-widest">
                            <LogOut size={16} /> Encerrar Sessão
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
