"use client"

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    User,
    Shield,
    AppWindow,
    Users,
    History,
    LogOut,
    ChevronRight,
    Plus,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Placeholder for sections in development
const PlaceholderSection = ({ title, icon: Icon }: any) => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-muted/30 rounded-[2rem] flex items-center justify-center mb-6">
            <Icon size={40} className="opacity-50" />
        </div>
        <h2 className="text-xl font-black tracking-tight mb-2">Seção {title}</h2>
        <p className="max-w-[300px] text-center text-sm font-medium opacity-60">
            Painel de configuração em desenvolvimento.
        </p>
    </div>
);

export function SettingsDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const { user, logout } = useAuth();
    const [currentSection, setCurrentSection] = useState<'account' | 'system' | 'users' | 'logs'>('account');

    // User Management State
    const [usersList, setUsersList] = useState<any[]>([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isSavingUser, setIsSavingUser] = useState(false);
    const [newUser, setNewUser] = useState({ nome: '', email: '', role: 'USUARIO_PADRAO', senhaHash: '123456' });

    useEffect(() => {
        if (currentSection === 'users' && (user?.role === 'ADMIN' || user?.role === 'CEO')) {
            fetchUsers();
        }
    }, [currentSection, user]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/users');
            if (res.ok) setUsersList(await res.json());
        } catch (e) { console.error(e); }
    };

    const handleCreateUser = async () => {
        if (!newUser.nome || !newUser.email) return toast.error('Nome e Email são obrigatórios');
        setIsSavingUser(true);
        try {
            const res = await fetch('http://localhost:4000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                toast.success('Usuário criado com sucesso!');
                setIsUserModalOpen(false);
                setNewUser({ nome: '', email: '', role: 'USUARIO_PADRAO', senhaHash: '123456' });
                fetchUsers();
            }
        } catch (e) {
            toast.error('Erro ao criar usuário');
        } finally {
            setIsSavingUser(false);
        }
    };

    const navItems = [
        { id: 'account', label: 'Minha Conta', icon: User },
        { id: 'system', label: 'Sistema & Visual', icon: AppWindow },
        ...(user?.role === 'ADMIN' || user?.role === 'CEO' ? [
            { id: 'users', label: 'Gestão de Usuários', icon: Users },
            { id: 'logs', label: 'Logs de Auditoria', icon: History }
        ] : [])
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden font-sans">
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-20 lg:w-64 border-r border-border/40 flex flex-col items-center lg:items-stretch py-8 bg-background/50 backdrop-blur-sm shrink-0 transition-all duration-300">
                    <div className="px-6 mb-8 hidden lg:block">
                        <HeaderAnimated title="Configurações" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-1">
                            System Settings
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full px-4 flex-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = currentSection === item.id;
                            return (
                                <Button
                                    key={item.id}
                                    variant={isActive ? "secondary" : "ghost"}
                                    onClick={() => setCurrentSection(item.id as any)}
                                    className={cn(
                                        "w-full justify-start h-12 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                                        "lg:px-4 px-0 lg:justify-start justify-center"
                                    )}
                                >
                                    <item.icon size={20} className={cn("shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground", "lg:mr-3")} />
                                    <span className="hidden lg:block font-bold text-xs uppercase tracking-wide truncate">{item.label}</span>
                                </Button>
                            );
                        })}
                    </div>

                    <div className="p-4 mt-auto space-y-4">
                        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/10 rounded-2xl hidden lg:block">
                            <p className="text-[10px] font-black uppercase text-primary mb-1">Status do Sistema</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-foreground">Online</span>
                            </div>
                        </Card>
                        <Button
                            onClick={logout}
                            variant="destructive"
                            className="w-full h-12 rounded-xl font-black uppercase tracking-widest gap-2 shadow-lg shadow-destructive/20 hidden lg:flex"
                        >
                            <LogOut size={18} /> Sair
                        </Button>
                        <Button onClick={logout} variant="destructive" size="icon" className="h-12 w-12 rounded-xl lg:hidden">
                            <LogOut size={18} />
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex flex-col bg-muted/5">
                    <div className="h-20 border-b border-border/40 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm shrink-0 lg:hidden">
                        <HeaderAnimated title="Configurações" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-[1000px] mx-auto h-full"
                            >
                                {currentSection === 'account' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                <User size={32} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black tracking-tight">{user?.nome}</h2>
                                                <p className="text-muted-foreground font-medium">{user?.email}</p>
                                                <Badge className="mt-2 bg-primary/10 text-primary border-none">{user?.role}</Badge>
                                            </div>
                                        </div>

                                        <Card className="rounded-2xl border-white/5 bg-background/60 p-8">
                                            <h3 className="text-lg font-black uppercase tracking-tight mb-6">Informações de Segurança</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-white/5">
                                                    <div className="flex items-center gap-4">
                                                        <Shield className="text-primary" size={20} />
                                                        <div>
                                                            <p className="font-bold text-sm">Senha de Acesso</p>
                                                            <p className="text-xs text-muted-foreground">Última alteração há 3 meses</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="rounded-xl font-bold uppercase text-[10px]">Alterar</Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {currentSection === 'system' && (
                                    <div className="space-y-6">
                                        <Card className="rounded-2xl border-white/5 bg-background/60 p-8">
                                            <h3 className="text-lg font-black uppercase tracking-tight mb-6">Preferências Globais</h3>
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-bold">Tema Escuro</p>
                                                        <p className="text-xs text-muted-foreground">Utilizar aparência dark mode</p>
                                                    </div>
                                                    <Switch defaultChecked={true} />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-bold">Notificações Push</p>
                                                        <p className="text-xs text-muted-foreground">Receber alertas em tempo real</p>
                                                    </div>
                                                    <Switch defaultChecked={true} />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {currentSection === 'users' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-black uppercase tracking-tight">Usuários do Sistema</h3>
                                            <Button onClick={() => setIsUserModalOpen(true)} className="rounded-xl h-10 px-4 font-black uppercase text-[10px] tracking-widest gap-2">
                                                <Plus size={16} /> Novo Usuário
                                            </Button>
                                        </div>

                                        <div className="grid gap-3">
                                            {usersList.map((u: any) => (
                                                <div key={u.id} className="p-4 bg-background/60 border border-border/40 rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary border border-primary/10">
                                                            {u.nome?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-foreground/80">{u.nome}</p>
                                                            <p className="text-xs text-muted-foreground">{u.email}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="bg-secondary/50 text-foreground border-border/40 font-black text-[9px] uppercase tracking-tighter">
                                                        {u.role}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {currentSection === 'logs' && (
                                    <PlaceholderSection title="Logs de Auditoria" icon={History} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* User Management Modal */}
            <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
                <DialogContent className="rounded-2xl max-w-lg p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-primary/5 p-8 border-b border-border/40">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black tracking-tighter flex items-center gap-2">
                                <Users className="text-primary" /> Cadastrar Usuário
                            </DialogTitle>
                        </DialogHeader>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest ml-1">Nome</label>
                                <Input
                                    placeholder="Nome do usuário"
                                    className="rounded-xl h-11 border-border/40 bg-background/50"
                                    value={newUser.nome}
                                    onChange={e => setNewUser({ ...newUser, nome: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest ml-1">Email</label>
                                <Input
                                    placeholder="email@vercflow.com"
                                    className="rounded-xl h-11 border-border/40 bg-background/50"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest ml-1">Papel (Role)</label>
                                <Select value={newUser.role} onValueChange={r => setNewUser({ ...newUser, role: r })}>
                                    <SelectTrigger className="rounded-xl h-11 border-border/40 bg-background/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border/40">
                                        <SelectItem value="CEO" className="rounded-lg">CEO / Proprietário</SelectItem>
                                        <SelectItem value="ADMIN" className="rounded-lg">Administrador</SelectItem>
                                        <SelectItem value="GESTOR" className="rounded-lg">Gestor de Obras</SelectItem>
                                        <SelectItem value="USUARIO_CAMPO" className="rounded-lg">Equipe de Campo</SelectItem>
                                        <SelectItem value="EXTERNO" className="rounded-lg">Colaborador Externo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button
                            onClick={handleCreateUser}
                            disabled={isSavingUser}
                            className="w-full h-12 rounded-xl font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20"
                        >
                            {isSavingUser ? 'Processando...' : <><Plus size={18} /> Criar Usuário</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default SettingsDashboard;
