"use client"

import React, { useState, useEffect } from 'react';
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
    CheckCircle2,
    FileText,
    TrendingDown,
    Filter,
    QrCode,
    History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';

// Placeholder components for sections
const PlaceholderSection = ({ title, icon: Icon }: any) => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-muted/30 rounded-[2rem] flex items-center justify-center mb-6">
            <Icon size={40} className="opacity-50" />
        </div>
        <h2 className="text-xl font-black tracking-tight mb-2">Seção {title}</h2>
        <p className="max-w-[300px] text-center text-sm font-medium opacity-60">
            Módulo de estoque em desenvolvimento.
        </p>
    </div>
);

export function EstoqueDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
                                </div >
                            </div >
        <div className="grid gap-4">
            {[
                { id: 'OC-902', supplier: 'Açolab S.A', value: 'R$ 45.200', status: 'COTACAO', date: '22/05' },
                { id: 'OC-903', supplier: 'Cimento Forte', value: 'R$ 12.800', status: 'APROVADO', date: '23/05' },
                { id: 'OC-904', supplier: 'HidroCenter', value: 'R$ 8.450', status: 'EM TRANSITO', date: '21/05' },
            ].map((oc) => (
                <Card key={oc.id} className="rounded-[2rem] border-border/40 bg-background/60 p-6 hover:border-primary/20 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors"><Receipt size={24} /></div>
                            <div>
                                <p className="font-black text-sm tracking-tight">{oc.id} · {oc.supplier}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{oc.date} · {oc.value}</p>
                            </div>
                        </div>
                        <Badge className={cn("text-[9px] font-black uppercase tracking-widest", oc.status === 'COTACAO' ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500")}>
                            {oc.status}
                        </Badge>
                    </div>
                </Card>
            ))}
        </div>
                        </motion.div >
                    </TabsContent >

                    <TabsContent value="almoxarifado" className="mt-0 outline-none">
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                                <Input placeholder="Buscar insumo no inventário..." className="pl-12 h-14 rounded-2xl border-border/40 bg-background/50 text-sm font-medium shadow-inner" />
                            </div>
                            <Card className="rounded-[2.5rem] border-border/40 bg-background/60 overflow-hidden shadow-sm">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-border/40 bg-muted/30">
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-left">Insumo</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-left">Qtd Atual</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/20">
                                        {[
                                            { name: 'Cimento CP II - 50kg', qtd: 142, status: 'OK' },
                                            { name: 'Tubo PVC 100mm', qtd: 12, status: 'BAIXO' },
                                            { name: 'Argamassa ACIII', qtd: 0, status: 'CRITICO' },
                                        ].map((item, idx) => (
                                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-sm font-black">{item.name}</td>
                                                <td className="p-6 text-sm font-mono font-black">{item.qtd} un</td>
                                                <td className="p-6">
                                                    <Badge variant="outline" className={cn("text-[8px] font-black uppercase px-2", item.status === 'OK' ? "bg-emerald-500/10 text-emerald-500 border-none" : "bg-red-500/10 text-red-500 border-none")}>
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="logistica" className="mt-0 outline-none">
                        <div className="text-center py-20 opacity-40">
                            <Truck size={48} className="mx-auto mb-4" />
                            <h3 className="font-black text-sm uppercase tracking-widest">Painel de Movimentações em Breve</h3>
                        </div>
                    </TabsContent>
                </AnimatePresence >
            </Tabs >

        <PlaceholderModal
            isOpen={modalConfig.isOpen}
            onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
            title={modalConfig.title}
            icon={modalConfig.icon}
            type={(modalConfig as any).type}
        />
        </div >
    );
}

// Helpers
function TabItem({ value, icon: Icon, label, isActive }: any) {
    return (
        <TabsTrigger
            value={value}
            className={cn(
                "relative bg-transparent h-14 rounded-none px-0 gap-3 text-[10px] font-black uppercase tracking-widest transition-all border-none data-[state=active]:bg-transparent data-[state=active]:text-primary",
                isActive ? "text-primary" : "text-muted-foreground hover:text-white/60"
            )}
        >
            <Icon size={18} /> {label}
            {isActive && <motion.div layoutId="active-tab-estoque" className="absolute -bottom-[9px] left-0 right-0 h-1 bg-primary rounded-t-full" />}
        </TabsTrigger>
    );
}

function SummaryCard({ title, value, sub, icon: Icon, type }: any) {
    const colors = {
        success: "text-emerald-500 bg-emerald-500/10",
        warning: "text-amber-500 bg-amber-500/10",
        danger: "text-red-500 bg-red-500/10",
        neutral: "text-blue-500 bg-blue-500/10"
    };
    return (
        <Card className="rounded-[2.5rem] border-white/5 bg-background/60 p-8 flex flex-col justify-between h-44 shadow-sm group">
            <div className="flex justify-between items-start">
                <div className={cn("p-4 rounded-3xl", colors[type as keyof typeof colors])}>
                    <Icon size={28} strokeWidth={2.5} />
                </div>
                <Badge variant="secondary" className="text-[9px] font-black uppercase px-3 bg-muted/30">{sub}</Badge>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-1">{title}</p>
                <h3 className="text-3xl font-black tracking-tighter group-hover:text-primary transition-colors">{value}</h3>
            </div>
        </Card>
    );
}

function Layers({ size, className }: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
    )
}

export default EstoqueDashboard;
