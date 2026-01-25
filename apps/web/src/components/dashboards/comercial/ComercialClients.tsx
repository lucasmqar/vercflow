import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Users, Search, Plus, Filter, MessageSquare,
    ChevronRight, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useAppFlow } from '@/store/useAppFlow';
import { Client } from '@/types';

export function ComercialClients({ onOpenProfile }: any) {
    const { clients } = useAppFlow();
    const [search, setSearch] = useState('');

    const filteredClients = clients.filter(c =>
        c.nome.toLowerCase().includes(search.toLowerCase()) ||
        c.documento?.includes(search)
    );

    const handleOpenProfile = (client: Client) => {
        if (onOpenProfile) {
            onOpenProfile(client);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        Carteira de Clientes
                        <Badge variant="secondary" className="text-xs font-black px-2">{filteredClients.length}</Badge>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Gestão de relacionamento e histórico.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Buscar cliente..."
                            className="pl-10 rounded-xl bg-background/50 border-border/40"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {filteredClients.map(c => (
                    <Card key={c.id} className="rounded-2xl border-border/40 bg-background/60 backdrop-blur-xl hover:border-primary/20 hover:shadow-2xl transition-all group overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                                {/* Company Info */}
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-black text-3xl shadow-inner border border-primary/5">
                                        {c.logo}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-black text-2xl tracking-tight leading-none group-hover:text-primary transition-colors">{c.nome}</h3>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="secondary" className="text-[10px] font-black tracking-widest uppercase border-none px-2 py-0.5 bg-primary/10 text-primary">{c.tipo}</Badge>
                                            <span className="text-[10px] font-bold text-muted-foreground/60">{c.documento}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact & Metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 flex-1 lg:max-w-2xl">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-2 tracking-widest flex items-center gap-1.5"><Users size={12} /> Contato Principal</p>
                                        <p className="text-xs font-black">{c.contatos || 'Não informado'}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground mt-1 lowercase">email@exemplo.com</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-2 tracking-widest flex items-center gap-1.5"><TrendingUp size={12} /> Volume Comercial</p>
                                        <p className="text-xs font-black text-primary">{c.valorTotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">{c.contratos || 0} Contratos</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-2 tracking-widest">Satisfaction (NPS)</p>
                                        <div className="flex flex-col items-center">
                                            <p className="text-lg font-black leading-none">{c.nps || '-'}</p>
                                            <div className="flex gap-0.5 mt-1">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} className={cn("w-1 h-1 rounded-full", c.nps && c.nps > i * 2 ? "bg-primary" : "bg-muted")} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-2 tracking-widest text-right">Saúde Comercial</p>
                                        <Badge className={cn(
                                            "font-black text-[10px] tracking-widest uppercase px-3 py-1.5 border-none",
                                            c.saude === 'Excelente' ? 'bg-emerald-500/10 text-emerald-600' :
                                                c.saude === 'Alerta' ? 'bg-red-500/10 text-red-600' : 'bg-primary/10 text-primary'
                                        )}>
                                            {c.saude}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <Button variant="outline" className="rounded-xl h-12 w-12 p-0 border-border/40 hover:bg-primary/10 hover:text-primary">
                                        <MessageSquare size={18} />
                                    </Button>
                                    <Button
                                        onClick={() => handleOpenProfile(c)}
                                        className="rounded-xl h-12 gap-2 font-black px-6 uppercase text-[10px] tracking-widest bg-primary hover:bg-primary/90"
                                    >
                                        Abrir Perfil <ChevronRight size={18} />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
