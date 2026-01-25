"use client"

import React, { useState } from 'react';
import {
    LayoutDashboard,
    ShoppingCart,
    FileText,
    Users,
    Package,
    Truck,
    Receipt,
    ClipboardList,
    Tags,
    AlertCircle,
    Plus,
    Search,
    BarChart3,
    Building2,
    ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DashboardTab } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { DepartmentRequests } from '../shared/DepartmentRequests';
import { useAppFlow } from '@/store/useAppFlow';
import { Input } from '@/components/ui/input';

// Placeholder components for sections
const PlaceholderSection = ({ title, icon: Icon }: any) => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-muted/30 rounded-[2rem] flex items-center justify-center mb-6">
            <Icon size={40} className="opacity-50" />
        </div>
        <h2 className="text-xl font-black tracking-tight mb-2">Seção {title}</h2>
        <p className="max-w-[300px] text-center text-sm font-medium opacity-60">
            Módulo de compras em desenvolvimento.
        </p>
    </div>
);

// Helpers from deleted PurchasesDashboard.tsx merged in
function PurchaseStat({ label, value, sub, icon: Icon, color }: any) {
    return (
        <Card className="rounded-2xl border-white/5 bg-background/40 backdrop-blur-xl hover:border-primary/20 transition-all group overflow-hidden">
            <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                        <Icon size={20} />
                    </div>
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">{label}</p>
                    <h4 className={cn("text-2xl font-black tracking-tighter", color)}>{value}</h4>
                    <p className="text-[8px] font-bold text-muted-foreground/60 mt-1 uppercase">{sub}</p>
                </div>
            </div>
        </Card>
    );
}

function RequisitionItem({ id, obra, item, status, date }: any) {
    return (
        <div className="p-5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
            <div className="flex items-center gap-6">
                <div className="text-center w-12">
                    <p className="text-[10px] font-black text-primary">{id}</p>
                    <p className="text-[8px] font-bold text-muted-foreground opacity-40 uppercase">{date}</p>
                </div>
                <div>
                    <p className="text-sm font-black tracking-tight leading-none mb-1.5">{item}</p>
                    <div className="flex items-center gap-2">
                        <Building2 size={10} className="text-muted-foreground/40" />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">{obra}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Badge className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-none",
                    status === 'received' ? "bg-emerald-500/10 text-emerald-500" :
                        status === 'approved' ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-500"
                )}>
                    {status}
                </Badge>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 opacity-40 group-hover:opacity-100">
                    <ArrowUpRight size={18} />
                </Button>
            </div>
        </div>
    );
}

export function ComprasDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    // Navigation State
    const [currentSection, setCurrentSection] = useState<'overview' | 'requisitions' | 'quotes' | 'orders' | 'suppliers' | 'catalogs'>('overview');
    const { getRequestsForDepartment } = useAppFlow();
    const requestsCount = getRequestsForDepartment('COMPRAS').filter(r => r.status !== 'CONCLUIDO' && r.status !== 'REJEITADO').length;

    // Navigation Items
    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'requisitions', label: 'Requisições', icon: ClipboardList, badge: requestsCount },
        { id: 'purchasing', label: 'Central de Compras', icon: ShoppingCart }, // Renamed/New
        { id: 'stock', label: 'Estoque Físico', icon: Package }, // New as requested
        { id: 'quotes', label: 'Cotações (BIDs)', icon: Tags },
        { id: 'orders', label: 'Pedidos / OCs', icon: FileText },
        { id: 'suppliers', label: 'Fornecedores', icon: Users },
        { id: 'catalogs', label: 'Catálogos', icon: Receipt },
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden font-sans">
            {/* Main Layout */}
            <div className="flex h-full">
                {/* Sidebar Navigation */}
                <div className="w-20 lg:w-64 border-r border-border/40 flex flex-col items-center lg:items-stretch py-8 bg-background/50 backdrop-blur-sm shrink-0 transition-all duration-300">
                    <div className="px-6 mb-8 hidden lg:block">
                        <HeaderAnimated title="Compras" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-1">
                            Procurement
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
                                    {item.badge > 0 && (
                                        <Badge className="ml-auto bg-amber-500 text-white border-none text-[8px] font-black h-4 px-1.5 animate-pulse">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </Button>
                            );
                        })}
                    </div>

                    <div className="p-4 mt-auto">
                        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/10 rounded-2xl hidden lg:block">
                            <p className="text-[10px] font-black uppercase text-amber-600 mb-1">Requisições Abertas</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-xs font-bold text-foreground">{requestsCount} Pendentes</span>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col bg-muted/5">
                    {/* Top Bar (Mobile) */}
                    <div className="h-20 border-b border-border/40 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm shrink-0 lg:hidden">
                        <HeaderAnimated title="Compras" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        <motion.div
                            key={currentSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-[1920px] mx-auto h-full"
                        >
                            {currentSection === 'overview' ? (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <PurchaseStat label="Requisições Abertas" value={requestsCount} sub="Aguardando cotação" icon={ShoppingCart} />
                                        <PurchaseStat label="OCs Emitidas" value="R$ 1.2M" sub="Este mês" icon={FileText} />
                                        <PurchaseStat label="Entregas Perto" value="08" sub="Para hoje/amanhã" icon={Truck} color="text-emerald-500" />
                                        <PurchaseStat label="Itens Críticos" value="04" sub="Ruptura iminente" icon={AlertCircle} color="text-rose-500" />
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Active Requisitions */}
                                        <Card className="lg:col-span-2 rounded-2xl border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                                            <div className="p-8">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div>
                                                        <h3 className="text-xl font-black tracking-tight">Requisições Recentes</h3>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Acompanhamento por obra</p>
                                                    </div>
                                                    <div className="relative w-48">
                                                        <Search className="absolute left-3 top-2.5 text-muted-foreground/40" size={14} />
                                                        <Input placeholder="Buscar..." className="pl-9 h-9 rounded-xl text-[10px] bg-white/5 border-white/10" />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <RequisitionItem
                                                        id="REQ-882"
                                                        obra="Infinity Coast"
                                                        item="Cimento CP-II (500 sacos)"
                                                        status="quoting"
                                                        date="22 Jan"
                                                    />
                                                    <RequisitionItem
                                                        id="REQ-881"
                                                        obra="Residencial Orion"
                                                        item="Aço CA-50 10mm (2t)"
                                                        status="approved"
                                                        date="21 Jan"
                                                    />
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Logistics Feed */}
                                        <Card className="rounded-2xl border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                                            <div className="p-8">
                                                <h3 className="text-xl font-black tracking-tight mb-8">Fluxo de Entregas</h3>
                                                <div className="space-y-6">
                                                    {[
                                                        { status: 'A caminho', location: 'Infinity Coast', supplier: 'Zandoná Mat.', time: '14:30' },
                                                        { status: 'Carregando', location: 'Res. Orion', supplier: 'Gerdau', time: 'Amanhã' },
                                                        { status: 'Atrasado', location: 'Infinity Coast', supplier: 'Hydra S.A.', time: 'Ontem' },
                                                    ].map((log, i) => (
                                                        <div key={i} className="flex gap-4 group cursor-pointer">
                                                            <div className="flex flex-col items-center">
                                                                <div className={cn(
                                                                    "w-3 h-3 rounded-full",
                                                                    log.status === 'Atrasado' ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-primary"
                                                                )} />
                                                                <div className="w-[1px] h-full bg-white/5 my-1" />
                                                            </div>
                                                            <div className="pb-6">
                                                                <p className="text-xs font-black tracking-tight group-hover:text-primary transition-colors">{log.supplier}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-white/5 px-1 py-0">{log.location}</Badge>
                                                                    <span className="text-[10px] font-bold text-muted-foreground opacity-60 uppercase tracking-tighter">{log.status} • {log.time}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            ) : currentSection === 'requisitions' ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-2xl font-black tracking-tight">Requisições de Compra & Triagem</h2>
                                        <p className="text-sm text-muted-foreground font-medium">Itens distribuídos pelo hub de campo aguardando cotação.</p>
                                    </div>
                                    <DepartmentRequests department="COMPRAS" />
                                </div>
                            ) : (
                                <PlaceholderSection
                                    title={navItems.find(i => i.id === currentSection)?.label}
                                    icon={navItems.find(i => i.id === currentSection)?.icon}
                                />
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComprasDashboard;
