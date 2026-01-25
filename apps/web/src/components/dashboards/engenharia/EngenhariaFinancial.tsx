import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, DollarSign, Receipt, ArrowUpRight } from 'lucide-react';

export function EngenhariaFinancial() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Financeiro de Obras</h2>
                    <p className="text-sm text-muted-foreground mt-1">Controle de medições, aprovação de pagamentos e fluxo de caixa por obra.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="col-span-1 lg:col-span-2 rounded-2xl border-white/5 bg-background border-border/40 p-8 h-96 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <LineChart className="text-muted-foreground" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-muted-foreground">Gráfico de Fluxo de Caixa</h3>
                    <p className="text-sm text-muted-foreground/60">Selecione uma obra para ver detalhes financeiros.</p>
                </Card>

                <div className="space-y-6">
                    <Card className="rounded-2xl bg-emerald-500/5 border-emerald-500/10 p-6">
                        <h3 className="font-black text-sm uppercase tracking-widest text-emerald-700 mb-4 flex items-center gap-2">
                            <DollarSign size={16} /> Medições a Aprovar
                        </h3>
                        <div className="space-y-3">
                            {[
                                { fornecedor: 'Empreiteira Silva', obra: 'Residencial Sky', valor: 'R$ 15.400,00' },
                                { fornecedor: 'Vidraçaria Top', obra: 'Galpão Alpha', valor: 'R$ 3.200,00' },
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-background rounded-2xl border border-emerald-500/20 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-bold text-sm">{item.fornecedor}</p>
                                        <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200">PENDENTE</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3">{item.obra}</p>
                                    <div className="flex justify-between items-end">
                                        <p className="font-black text-lg">{item.valor}</p>
                                        <Button size="sm" className="h-7 text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">Aprovar</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
