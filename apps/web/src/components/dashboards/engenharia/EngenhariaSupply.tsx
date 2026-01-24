import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, Truck, AlertTriangle, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function EngenhariaSupply() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Suprimentos & Compras</h2>
                    <p className="text-sm text-muted-foreground mt-1">Gestão de requisições de materiais e serviços.</p>
                </div>
                <Button className="rounded-xl font-bold text-xs uppercase tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <Plus size={16} className="mr-2" /> Nova Requisição
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="p-6 rounded-[2rem] border-border/40 bg-background/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                            <ShoppingCart size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase text-muted-foreground">Requisições</p>
                            <p className="text-2xl font-black">12 Abertas</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 rounded-[2rem] border-border/40 bg-background/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                            <Truck size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase text-muted-foreground">Entregas Hoje</p>
                            <p className="text-2xl font-black">5 Agendadas</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="rounded-[2.5rem] border-border/40 bg-background overflow-hidden">
                <div className="p-6 border-b border-border/40 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Minhas Requisições</h3>
                    <div className="w-64 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Buscar item ou obra..." className="pl-10 h-9 rounded-xl" />
                    </div>
                </div>
                <div className="p-0">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-muted/30 text-muted-foreground font-black">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-2xl">Item / Serviço</th>
                                <th className="px-6 py-4">Obra</th>
                                <th className="px-6 py-4">Data Req.</th>
                                <th className="px-6 py-4">Prioridade</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 rounded-tr-2xl"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {[
                                { item: 'Cimento CP-II (500 sc)', obra: 'Residencial Sky', date: 'Hoje', prio: 'ALTA', status: 'Em Cotação' },
                                { item: 'Locação Container', obra: 'Galpão Alpha', date: 'Ontem', prio: 'MEDIA', status: 'Aprovado' },
                                { item: 'Aço CA-50 10mm', obra: 'Residencial Sky', date: '22 Jan', prio: 'CRITICA', status: 'Comprado' },
                            ].map((req, i) => (
                                <tr key={i} className="hover:bg-muted/5 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-foreground">{req.item}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{req.obra}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{req.date}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className={cn("text-[10px] uppercase font-black", req.prio === 'CRITICA' ? 'text-red-500 border-red-200 bg-red-50' : req.prio === 'ALTA' ? 'text-amber-500 border-amber-200 bg-amber-50' : 'text-slate-500')}>{req.prio}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20">{req.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase">Detalhes</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
