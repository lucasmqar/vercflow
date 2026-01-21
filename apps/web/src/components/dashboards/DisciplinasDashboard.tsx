import React from 'react';
import { Layers, ShieldCheck, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardTab } from '@/types';

export function DisciplinasDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-secondary/5 to-background overflow-hidden font-sans">
            {/* Standard Header */}
            <div className="p-4 lg:p-6 border-b bg-background/95 backdrop-blur-sm shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Matriz de Disciplinas</h1>
                        <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest font-medium opacity-60">Base de Conhecimento Vercflow</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8 scrollbar-none pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { code: '1.x', label: 'Documentação Inicial', items: 12 },
                        { code: '2.x', label: 'Arquitetura', items: 45 },
                        { code: '3.x', label: 'Estrutural', items: 28 },
                        { code: '4.x', label: 'Hidráulica', items: 32 },
                        { code: '5.x', label: 'Elétrica', items: 40 },
                    ].map(d => (
                        <Card key={d.code} className="glass-card hover:border-primary/40 transition-all cursor-pointer group outline-none overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <Badge variant="outline" className="font-mono font-black border-primary/20 text-primary bg-primary/5">{d.code}</Badge>
                                    <div className="p-2 bg-primary/5 rounded-lg text-primary opacity-40 group-hover:opacity-100 transition-opacity">
                                        <ShieldCheck size={16} />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{d.label}</h3>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                    <FileText size={12} /> {d.items} Procedimentos Padronizados
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DisciplinasDashboard;
