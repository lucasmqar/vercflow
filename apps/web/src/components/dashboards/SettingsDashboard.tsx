import React, { useState, useEffect } from 'react';
import {
    User as UserIcon,
    Bell,
    Shield,
    Palette,
    Smartphone,
    Cloud,
    ChevronRight,
    LogOut,
    AppWindow,
    Users as UsersIcon,
    Plus,
    Mail,
    Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

export function SettingsDashboard() {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isSavingUser, setIsSavingUser] = useState(false);
    const [newUser, setNewUser] = useState({ nome: '', email: '', role: 'USUARIO_PADRAO', senhaHash: '123456' });

    useEffect(() => {
        if (user?.role === 'ADMIN' || user?.role === 'CEO') {
            fetchUsers();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/users');
            if (res.ok) setUsers(await res.json());
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

    const settingsGroups = [
        {
            title: "Conta & Perfil",
            icon: UserIcon,
            items: [
                { label: "Informações Pessoais", description: user?.nome || "Carregando...", action: "Editar" },
                { label: "Segurança & Autenticação", description: "Senha e chaves de acesso", action: "Gerenciar" }
            ]
        },
        {
            title: "Administração do Sistema",
            icon: Shield,
            isAdmin: true,
            items: [
                {
                    label: "Gestão de Usuários",
                    description: `${users.length} usuários cadastrados no VERCFLOW`,
                    action: "Ver Lista",
                    onClick: () => setIsUserModalOpen(true)
                },
                { label: "Logs de Atividade", description: "Auditoria de alterações globais", action: "Acessar" }
            ]
        },
        {
            title: "Sistema & Visual",
            icon: AppWindow,
            items: [
                { label: "Tema Dark Mode", description: "Exclusivo VERCFLOW Glass", type: "toggle", value: true },
                { label: "Notificações Push", description: "Alertas de obra em tempo real", type: "toggle", value: true },
            ]
        }
    ];

    const filteredGroups = settingsGroups.filter(g => !g.isAdmin || (user?.role === 'ADMIN' || user?.role === 'CEO'));

    return (
        <div className="p-4 lg:p-10 h-[calc(100vh-64px)] flex flex-col bg-secondary/10 overflow-y-auto custom-scrollbar">

            <div className="max-w-4xl mx-auto w-full">
                <div className="mb-10 text-center lg:text-left flex flex-col lg:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tighter">Configurações</h1>
                        <p className="text-muted-foreground font-medium">Controle total da sua experiência e do ecossistema VERCFLOW</p>
                    </div>
                    <Badge variant="outline" className="rounded-full px-4 py-1.5 border-primary/20 bg-primary/5 text-primary font-bold">
                        Sessão como: {user?.role}
                    </Badge>
                </div>

                <div className="space-y-8">
                    {filteredGroups.map((group, idx) => (
                        <div key={idx} className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <group.icon size={18} className="text-primary" />
                                <h3 className="text-sm font-bold uppercase tracking-widest opacity-50">{group.title}</h3>
                            </div>

                            <Card className="rounded-[2rem] border-border/50 shadow-xl shadow-black/5 bg-background overflow-hidden relative isolate">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 -z-10" />
                                <CardContent className="p-0">
                                    {group.items.map((item: any, iIndex) => (
                                        <React.Fragment key={iIndex}>
                                            <div
                                                onClick={item.onClick}
                                                className="p-6 flex items-center justify-between hover:bg-secondary/20 transition-colors group cursor-pointer"
                                            >
                                                <div className="space-y-1">
                                                    <p className="font-bold tracking-tight">{item.label}</p>
                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                </div>

                                                {item.type === 'toggle' ? (
                                                    <Switch defaultChecked={item.value} />
                                                ) : (
                                                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                                        {item.action}
                                                        <ChevronRight size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            {iIndex < group.items.length - 1 && <Separator className="opacity-50" />}
                                        </React.Fragment>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    ))}

                    <div className="pt-6 pb-20">
                        <Button
                            onClick={logout}
                            variant="destructive"
                            className="w-full h-14 rounded-2xl font-bold gap-2 shadow-lg shadow-destructive/20 hover:scale-[1.01] transition-transform"
                        >
                            <LogOut size={20} /> Encerrar Sessão
                        </Button>
                    </div>
                </div>
            </div>

            {/* User Management Modal */}
            <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
                <DialogContent className="rounded-[2.5rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-primary/5 p-8 border-b">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                                <UsersIcon className="text-primary" /> Gestão de Usuários
                            </DialogTitle>
                        </DialogHeader>
                    </div>

                    <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {/* Add User Section */}
                        <div className="space-y-6 bg-secondary/20 p-6 rounded-3xl border border-border/50">
                            <h4 className="text-sm font-bold uppercase tracking-widest opacity-60">Cadastrar Novo Usuário</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Nome</Label>
                                    <Input
                                        placeholder="Nome do usuário"
                                        className="rounded-xl h-11"
                                        value={newUser.nome}
                                        onChange={e => setNewUser({ ...newUser, nome: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Email</Label>
                                    <Input
                                        placeholder="email@vercflow.com"
                                        className="rounded-xl h-11"
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Papel (Role)</Label>
                                    <Select value={newUser.role} onValueChange={r => setNewUser({ ...newUser, role: r })}>
                                        <SelectTrigger className="rounded-xl h-11">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="CEO">CEO / Proprietário</SelectItem>
                                            <SelectItem value="ADMIN">Administrador</SelectItem>
                                            <SelectItem value="GESTOR">Gestor de Obras</SelectItem>
                                            <SelectItem value="USUARIO_CAMPO">Equipe de Campo</SelectItem>
                                            <SelectItem value="EXTERNO">Colaborador Externo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        onClick={handleCreateUser}
                                        disabled={isSavingUser}
                                        className="w-full h-11 rounded-xl font-bold gap-2"
                                    >
                                        <Plus size={18} /> Criar Usuário
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* List Users */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-widest opacity-60">Usuários Ativos</h4>
                            <div className="space-y-3">
                                {users.map((u: any) => (
                                    <div key={u.id} className="p-4 bg-background border rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {u.nome?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{u.nome}</p>
                                                <p className="text-xs text-muted-foreground">{u.email}</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-secondary text-foreground border-none font-bold text-[10px]">
                                            {u.role}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-secondary/10 border-t">
                        <Button variant="ghost" className="rounded-xl" onClick={() => setIsUserModalOpen(false)}>Fechar Gerenciador</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const Label = ({ children, className }: any) => (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
        {children}
    </label>
);
