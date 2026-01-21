import React from 'react';
import {
    Box,
    ShoppingCart,
    ArrowRightLeft,
    AlertTriangle,
    Package,
    Truck,
    Search,
    Plus,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from '@/components/ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { getApiUrl } from '@/lib/api';
import { DashboardTab } from '@/types';

const mockItems = [
    { id: '1', nome: 'Cimento CP II - 50kg', qtd: 142, min: 50, local: 'Canteiro HQ', status: 'OK' },
    { id: '2', nome: 'Tubo PVC 100mm', qtd: 12, min: 20, local: 'Canteiro HQ', status: 'BAIXO' },
    { id: '3', nome: 'Fio Flexível 2.5mm (Rolo)', qtd: 8, min: 5, local: 'Almoxarifado', status: 'OK' },
    { id: '4', nome: 'Argamassa ACIII', qtd: 0, min: 10, local: 'Canteiro 04', status: 'CRITICO' },
];

export function StockDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [movements, setMovements] = React.useState<any[]>([]);
    const [vehicles, setVehicles] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('insumos');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [movRes, vehRes] = await Promise.all([
                    fetch(getApiUrl('/api/stock/movements')),
                    fetch(getApiUrl('/api/vehicles'))
                ]);
                const movData = await movRes.json();
                const vehData = await vehRes.json();
                setMovements(movData);
                setVehicles(vehData);
            } catch (error) {
                console.error('Error fetching logistics data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-secondary/5 to-background overflow-hidden">
            {/* Standard Header */}
            <div className="p-4 lg:p-6 border-b bg-background/95 backdrop-blur-sm shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Logística & Estoque</h1>
                        <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest font-medium opacity-60">Gestão de Insumos & Fluxo de Materiais</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                            <Input placeholder="Buscar na logística..." className="pl-9 h-10 w-64 text-sm rounded-lg bg-background/50" />
                        </div>
                        <Button className="h-10 rounded-xl text-xs font-black uppercase tracking-widest px-6 shadow-glow">
                            <Plus size={16} /> Novo Registro
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 py-2 border-b bg-muted/5">
                    <TabsList className="bg-transparent gap-6 h-12 p-0">
                        <TabsTrigger value="insumos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-bold text-xs uppercase tracking-widest h-full px-1">Materiais & Insumos</TabsTrigger>
                        <TabsTrigger value="frota" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-bold text-xs uppercase tracking-widest h-full px-1">Frota de Veículos</TabsTrigger>
                        <TabsTrigger value="movimentacoes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-bold text-xs uppercase tracking-widest h-full px-1">Histórico de Fluxo</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin">
                    <TabsContent value="insumos" className="mt-0 space-y-8 outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Itens em Estoque', value: '1.242', icon: Package, color: 'text-primary' },
                                { label: 'Abaixo do Mínimo', value: '14', icon: AlertTriangle, color: 'text-amber-500' },
                                { label: 'Pedidos em Trânsito', value: '6', icon: Truck, color: 'text-blue-500' },
                                { label: 'Total em Patrimônio', value: 'R$ 84k', icon: ShoppingCart, color: 'text-emerald-500' },
                            ].map((stat, idx) => (
                                <Card key={idx} className="bg-background/50 border-border/40 hover:shadow-md transition-shadow">
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                                            <p className="text-2xl font-black mt-1">{stat.value}</p>
                                        </div>
                                        <div className={cn("p-2.5 rounded-xl bg-background border flex items-center justify-center shadow-sm", stat.color)}>
                                            <stat.icon size={20} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="glass-card overflow-hidden border-border/40">
                            <CardHeader className="px-6 py-4 border-b border-border/40 bg-muted/10">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/70 flex items-center gap-2">
                                    <Box size={16} /> Inventário de Campo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-border/40 bg-muted/5">
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Item</th>
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Qtd Atual</th>
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Mínimo</th>
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Localização</th>
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/20">
                                        {mockItems.map(item => (
                                            <tr key={item.id} className="hover:bg-primary/[0.01] transition-colors group cursor-pointer">
                                                <td className="p-4 text-xs font-bold">{item.nome}</td>
                                                <td className="p-4 text-xs font-mono font-black">{item.qtd}</td>
                                                <td className="p-4 text-xs font-mono text-muted-foreground">{item.min}</td>
                                                <td className="p-4 text-[11px] font-bold text-muted-foreground uppercase">{item.local}</td>
                                                <td className="p-4">
                                                    <Badge variant="outline" className={cn(
                                                        "text-[9px] font-black px-1.5 py-0",
                                                        item.status === 'OK' ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/5" :
                                                            item.status === 'BAIXO' ? "border-amber-500/30 text-amber-600 bg-amber-500/5" :
                                                                "border-red-500/30 text-red-600 bg-red-500/5"
                                                    )}>{item.status}</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="frota" className="mt-0 space-y-8 outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Veículos na Frota', value: vehicles.length.toString(), icon: Truck, color: 'text-primary' },
                                { label: 'Em Operação', value: vehicles.filter(v => v.status === 'EM_USO').length.toString(), icon: ArrowRightLeft, color: 'text-blue-500' },
                                { label: 'Manutenção', value: vehicles.filter(v => v.status === 'MANUTENCAO').length.toString(), icon: AlertTriangle, color: 'text-red-500' },
                                { label: 'Disponíveis', value: vehicles.filter(v => v.status === 'DISPONIVEL').length.toString(), icon: CheckCircle2, color: 'text-emerald-500' },
                            ].map((stat, idx) => (
                                <Card key={idx} className="bg-background/50 border-border/40">
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                                            <p className="text-2xl font-black mt-1">{stat.value}</p>
                                        </div>
                                        <div className={cn("p-2.5 rounded-xl bg-background border flex items-center justify-center shadow-sm", stat.color)}>
                                            <stat.icon size={20} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vehicles.length === 0 ? (
                                <div className="lg:col-span-3 p-12 text-center text-muted-foreground border-2 border-dashed rounded-2xl">
                                    Nenhum veículo cadastrado na frota.
                                </div>
                            ) : (
                                vehicles.map(v => (
                                    <Dialog key={v.id}>
                                        <DialogTrigger asChild>
                                            <Card className="glass-card hover:border-primary/40 transition-all group overflow-hidden cursor-pointer">
                                                <div className="h-1 bg-primary/20 w-full" />
                                                <CardContent className="p-5">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <Badge variant="outline" className="font-mono font-black text-primary border-primary/20">{v.placa}</Badge>
                                                        <Badge className={cn(
                                                            "text-[9px] font-black tracking-tighter uppercase",
                                                            v.status === 'DISPONIVEL' ? "bg-emerald-500/10 text-emerald-600" :
                                                                v.status === 'EM_USO' ? "bg-blue-500/10 text-blue-600" : "bg-amber-500/10 text-amber-600"
                                                        )}>{v.status}</Badge>
                                                    </div>
                                                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{v.modelo}</h3>
                                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-4">{v.marca} · {v.tipo}</p>

                                                    <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground pt-3 border-t border-border/20">
                                                        <span className="flex items-center gap-1.5"><Truck size={12} /> {v.quilometragem} km</span>
                                                        <Button size="sm" variant="ghost" className="h-7 text-[10px] font-black uppercase tracking-tighter gap-1 hover:bg-primary/5">
                                                            Gerenciar <ArrowRight className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </DialogTrigger>
                                        <DialogContent className="rounded-[2rem] max-w-xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-black tracking-tighter uppercase">{v.modelo}</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid grid-cols-2 gap-6 py-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Placa</Label>
                                                        <p className="font-mono font-bold text-lg">{v.placa}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Status Atual</Label>
                                                        <Badge className="block w-fit mt-1">{v.status}</Badge>
                                                    </div>
                                                    <div>
                                                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Quilometragem</Label>
                                                        <p className="font-bold">{v.quilometragem} km</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Responsável</Label>
                                                        <p className="font-bold">{v.responsavel?.nome || 'Nenhum atribuído'}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Última Manutenção</Label>
                                                        <p className="font-bold text-muted-foreground">Não registrada</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogFooter className="gap-2">
                                                <Button variant="outline" className="rounded-xl font-bold">Ver Histórico</Button>
                                                <Button className="rounded-xl font-black uppercase tracking-widest">Registrar Uso</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="movimentacoes" className="mt-0 space-y-8 outline-none">
                        <Card className="glass-card overflow-hidden border-border/40">
                            <CardHeader className="px-6 py-4 flex flex-row items-center justify-between border-b border-border/40 bg-muted/10">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/70 flex items-center gap-2">
                                    <ArrowRightLeft size={16} /> Fluxo de Logística (Canteiro ↔ Almoxarifado)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-border/40 bg-muted/5">
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Data</th>
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Tipo</th>
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Item</th>
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Qtd</th>
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Obra</th>
                                            <th className="text-left p-4 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Responsável</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/20">
                                        {movements.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="p-12 text-center text-xs text-muted-foreground">Nenhuma movimentação registrada no banco.</td>
                                            </tr>
                                        ) : (
                                            movements.map(m => (
                                                <tr key={m.id} className="hover:bg-primary/[0.01] transition-colors group">
                                                    <td className="p-4 text-[11px] font-mono text-muted-foreground">
                                                        {new Date(m.criadoEm).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge variant="outline" className={cn(
                                                            "text-[9px] font-black px-1.5 py-0",
                                                            m.tipo === 'ENTRADA' ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/5" : "border-red-500/30 text-red-600 bg-red-500/5"
                                                        )}>{m.tipo}</Badge>
                                                    </td>
                                                    <td className="p-4 text-xs font-bold">{m.item}</td>
                                                    <td className="p-4 text-xs font-mono font-black">{m.quantidade} {m.unidade}</td>
                                                    <td className="p-4 text-[11px] font-bold text-muted-foreground uppercase">{m.obra?.nome || '-'}</td>
                                                    <td className="p-4 text-[11px] text-muted-foreground uppercase">{m.usuario?.nome}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
