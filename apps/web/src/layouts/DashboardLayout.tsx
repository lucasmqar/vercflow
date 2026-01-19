import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarFooter,
} from "@/components/ui/sidebar";
import {
    Briefcase,
    Compass,
    FileCheck,
    CalendarClock,
    ShoppingCart,
    Truck,
    Users,
    FileText,
    DollarSign,
    ShieldAlert,
    Monitor,
    LogOut,
    Settings,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

// Menu Items based on VERCFLOW "ID Verc" Flowchart
const departments = [
    {
        title: "Comercial",
        id: "1.0",
        url: "/comercial",
        icon: Briefcase,
    },
    {
        title: "Engenharia",
        id: "2.0",
        url: "/engenharia",
        icon: Compass,
    },
    {
        title: "Aprovações",
        id: "3.0",
        url: "/aprovacoes",
        icon: FileCheck,
    },
    {
        title: "Planejamento",
        id: "4.0",
        url: "/planejamento",
        icon: CalendarClock,
    },
    {
        title: "Compras",
        id: "5.0",
        url: "/compras",
        icon: ShoppingCart,
    },
    {
        title: "Logística",
        id: "6.0",
        url: "/logistica",
        icon: Truck,
    },
    {
        title: "RH",
        id: "7.0",
        url: "/rh",
        icon: Users,
    },
    {
        title: "DP",
        id: "8.0",
        url: "/dp",
        icon: FileText,
    },
    {
        title: "Financeiro",
        id: "9.0",
        url: "/financeiro",
        icon: DollarSign,
    },
    {
        title: "DST",
        id: "10.0",
        url: "/dst",
        icon: ShieldAlert,
    },
    {
        title: "TI",
        id: "11.0",
        url: "/ti",
        icon: Monitor,
    },
];

export function AppSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <Sidebar className="border-r border-white/10 bg-sidebar/50 backdrop-blur-xl">
            <SidebarHeader className="p-4 border-b border-white/5">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    VERCFLOW
                </h1>
                <p className="text-xs text-muted-foreground">Sistema Unificado</p>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-muted-foreground/60 uppercase tracking-wider text-[10px] font-bold">
                        Departamentos
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {departments.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname.startsWith(item.url)}
                                        className={cn(
                                            "transition-all duration-200 hover:translate-x-1",
                                            location.pathname.startsWith(item.url)
                                                ? "bg-primary/20 text-primary-foreground font-semibold shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                        onClick={() => navigate(item.url)}
                                    >
                                        <button className="flex items-center gap-3 w-full">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                            <span className="ml-auto text-[10px] opacity-40 font-mono">
                                                {item.id}
                                            </span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-white/5 p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => logout()} className="text-red-400 hover:text-red-300 hover:bg-red-950/20">
                            <LogOut className="h-4 w-4" />
                            <span>Sair do Sistema</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background selection:bg-primary/20">
                <AppSidebar />
                <main className="flex-1 overflow-hidden transition-all duration-300 ease-in-out">
                    <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <SidebarTrigger />
                            <div className="h-6 w-px bg-white/10" />
                            <span className="text-sm text-muted-foreground">Bem-vindo ao VERCFLOW</span>
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
