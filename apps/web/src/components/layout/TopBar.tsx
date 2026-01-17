import { motion } from 'framer-motion';
import {
  Search,
  Bell,
  Settings,
  User,
  ChevronDown,
  Building2,
  MessageSquare,
  ClipboardCheck,
  Zap,
  LayoutDashboard,
  LogOut,
  Users
} from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import type { DashboardTab } from '@/types';
import { cn } from '@/lib/utils';

interface TopBarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onOpenCommandPalette: () => void;
  selectedProject?: string;
  onSelectProject: (id: string) => void;
}

const navItems = [
  { id: 'captura', label: 'Captura', icon: MessageSquare },
  { id: 'triagem', label: 'Triagem', icon: ClipboardCheck },
  { id: 'atividades', label: 'Atividades', icon: Zap },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'equipe', label: 'Equipe', icon: Users },
  { id: 'obras', label: 'Obras', icon: Building2 },
  { id: 'clientes', label: 'Clientes', icon: Users },
];

export function TopBar({
  activeTab,
  onTabChange,
  onOpenCommandPalette,
}: TopBarProps) {
  const { user, logout } = useAuth();

  const getVisibleItems = () => {
    if (!user) return [];

    // CEO & ADMIN: Total Control
    if (user.role === 'ADMIN' || user.role === 'CEO') return navItems;

    // GESTOR: Management & Operations
    if (user.role === 'GESTOR') return navItems.filter(i => ['captura', 'triagem', 'atividades', 'obras', 'dashboard', 'clientes'].includes(i.id));

    // TRIAGISTA: Specialized in Capture & Triagem
    if (user.role === 'TRIAGISTA') return navItems.filter(i => ['captura', 'triagem'].includes(i.id));

    // OPERACIONAL / INTERNO: Field work & Tasks
    if (user.role === 'OPERACIONAL' || user.role === 'PROFISSIONAL_INTERNO') return navItems.filter(i => ['captura', 'atividades'].includes(i.id));

    return navItems.filter(i => ['captura'].includes(i.id));
  };

  const visibleNavItems = getVisibleItems();

  return (
    <div className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto h-16 px-4 lg:px-6 flex items-center justify-between gap-4">

        {/* Left: Branding */}
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer"
            onClick={() => onTabChange('captura')}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform active:scale-95">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="hidden md:inline-block tracking-tighter">VERCFLOW</span>
          </div>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-secondary/50 p-1 rounded-xl">
          {visibleNavItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as DashboardTab)}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                  isActive
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                )}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Right: User & Utils */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onOpenCommandPalette} className="text-muted-foreground hover:text-foreground">
            <Search size={20} />
          </Button>

          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="pl-2 gap-2 rounded-full hover:bg-secondary/50">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {user?.nome.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <DropdownMenuLabel className="font-normal px-2 pb-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{user?.nome}</p>
                  <p className="text-xs leading-none text-muted-foreground uppercase tracking-wider font-semibold">{user?.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg">
                <User className="mr-2 h-4 w-4" /> Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTabChange('config')} className="rounded-lg">
                <Settings className="mr-2 h-4 w-4" /> Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
