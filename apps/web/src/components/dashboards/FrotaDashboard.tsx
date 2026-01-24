"use client"

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Truck,
    Wrench,
    Users,
    Fuel,
    MapPin,
    CalendarClock,
    Activity,
    Plus,
    Search,
    ChevronRight,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab, Vehicle, MaintenanceRecord } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';

const API_BASE = 'http://localhost:4000/api';

export function FrotaDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [currentSection, setCurrentSection] = useState<'overview' | 'vehicles' | 'maintenance' | 'drivers' | 'fuel'>('overview');
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);

    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'vehicles', label: 'Veículos', icon: Truck },
        { id: 'maintenance', label: 'Manutenção', icon: Wrench },
        { id: 'drivers', label: 'Motoristas', icon: Users },
        { id: 'fuel', label: 'Combustível', icon: Fuel },
    ];

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/vehicles`);
            const data = await res.json();
            setVehicles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats
    const stats = {
        totalVehicles: vehicles.length,
        active: vehicles.filter(v => v.status === 'ATIVO').length,
        maintenance: vehicles.filter(v => v.status === 'MANUTENCAO').length,
        inactive: vehicles.filter(v => v.status === 'INATIVO').length,
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden font-sans">
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-20 lg:w-64 border-r border-border/40 flex flex-col items-center lg:items-stretch py-8 bg-background/50 backdrop-blur-sm shrink-0 transition-all duration-300">
                    <div className="px-6 mb-8 hidden lg:block">
                        <HeaderAnimated title="Frotas" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-1">
                            Fleet Management
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

                    <div className="p-4 mt-auto">
                        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/10 rounded-2xl hidden lg:block">
                            <p className="text-[10px] font-black uppercase text-primary mb-1">Veículos Ativos</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-xs font-bold text-foreground">{stats.active} em Rota</span>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex flex-col bg-muted/5">
                    <div className="h-20 border-b border-border/40 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm shrink-0 lg:hidden">
                        <HeaderAnimated title="Frotas" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 lg:p-10 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-[1920px] mx-auto h-full"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                                    </div>
                                ) : (
                                    <>
                                        {/* Overview Section */}
                                        {currentSection === 'overview' && (
                                            <div className="space-y-8">
                                                {/* Stats Cards */}
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                                    {[
                                                        { label: 'Total Veículos', value: stats.totalVehicles.toString(), icon: Truck, color: 'text-blue-500' },
                                                        { label: 'Em Operação', value: stats.active.toString(), icon: CheckCircle2, color: 'text-emerald-500' },
                                                        { label: 'Manutenção', value: stats.maintenance.toString(), icon: Wrench, color: 'text-amber-500' },
                                                        { label: 'Inativos', value: stats.inactive.toString(), icon: AlertTriangle, color: 'text-red-500' },
                                                    ].map((stat, i) => (
                                                        <Card key={i} className="rounded-[2rem] border-white/5 bg-background/60 backdrop-blur-xl p-8 hover:shadow-lg transition-all">
                                                            <div className="flex justify-between items-start mb-6">
                                                                <div className={cn("p-4 rounded-2xl bg-muted/50", stat.color)}>
                                                                    <stat.icon size={24} strokeWidth={2.5} />
                                                                </div>
                                                            </div>
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2">{stat.label}</p>
                                                            <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
                                                        </Card>
                                                    ))}
                                                </div>

                                                {/* Quick Overview List */}
                                                <div>
                                                    <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground mb-4">Frota Recente</h3>
                                                    <div className="grid gap-4">
                                                        {vehicles.slice(0, 5).map(vehicle => (
                                                            <Card key={vehicle.id} className="rounded-[2rem] p-6 bg-background/60 hover:border-primary/20 transition-all">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-14 h-14 rounded-xl bg-muted/40 flex items-center justify-center">
                                                                            <Truck size={24} className="text-primary" />
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-bold text-sm">{vehicle.placa}</h4>
                                                                            <p className="text-xs text-muted-foreground">{vehicle.modelo} - {vehicle.tipo}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Badge className={cn(
                                                                        "text-[9px] font-black uppercase",
                                                                        vehicle.status === 'ATIVO' ? "bg-emerald-500/10 text-emerald-500" :
                                                                            vehicle.status === 'MANUTENCAO' ? "bg-amber-500/10 text-amber-500" :
                                                                                "bg-red-500/10 text-red-500"
                                                                    )}>
                                                                        {vehicle.status}
                                                                    </Badge>
                                                                </div>
                                                            </Card>
                                                        ))}
                                                        {vehicles.length === 0 && (
                                                            <Card className="rounded-[2rem] p-12 text-center">
                                                                <Truck size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                                                                <p className="text-sm font-bold text-muted-foreground">Nenhum veículo cadastrado</p>
                                                            </Card>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Vehicles Section */}
                                        {currentSection === 'vehicles' && (
                                            <div className="space-y-8">
                                                <div className="flex justify-between items-center">
                                                    <div className="relative flex-1 max-w-md">
                                                        <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                                                        <Input placeholder="Buscar veículo..." className="pl-12 h-12 rounded-xl" />
                                                    </div>
                                                    <Button className="rounded-xl h-11 px-6 font-black uppercase tracking-widest gap-2">
                                                        <Plus size={18} /> Novo Veículo
                                                    </Button>
                                                </div>

                                                <div className="grid gap-4">
                                                    {vehicles.map(vehicle => (
                                                        <Card key={vehicle.id} className="rounded-[2rem] p-6 bg-background/60 hover:border-primary/20 transition-all group">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-6">
                                                                    <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center">
                                                                        <Truck size={28} className="text-primary" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-black text-lg tracking-tight mb-1">{vehicle.placa}</h3>
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge variant="secondary" className="text-[9px] font-black uppercase">{vehicle.tipo}</Badge>
                                                                            <span className="text-[10px] text-muted-foreground font-bold">{vehicle.modelo}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    {vehicle.responsavelId && (
                                                                        <div className="text-right text-xs">
                                                                            <p className="text-muted-foreground font-bold uppercase tracking-wide">Responsável</p>
                                                                            <p className="font-bold">{vehicle.responsavel?.nome || 'N/A'}</p>
                                                                        </div>
                                                                    )}
                                                                    <Badge className={cn(
                                                                        "text-[10px] font-black uppercase px-3",
                                                                        vehicle.status === 'ATIVO' ? "bg-emerald-500/10 text-emerald-500" :
                                                                            vehicle.status === 'MANUTENCAO' ? "bg-amber-500/10 text-amber-500" :
                                                                                "bg-red-500/10 text-red-500"
                                                                    )}>
                                                                        {vehicle.status}
                                                                    </Badge>
                                                                    <Button size="icon" variant="ghost" className="rounded-xl">
                                                                        <ChevronRight size={20} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Maintenance Section */}
                                        {currentSection === 'maintenance' && (
                                            <div className="space-y-8">
                                                <h2 className="text-2xl font-black tracking-tight">Manutenções</h2>
                                                <div className="text-center py-12">
                                                    <Wrench size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                                                    <p className="text-sm font-bold text-muted-foreground">Histórico de manutenções</p>
                                                    <p className="text-xs text-muted-foreground/60 mt-2">Conectado ao endpoint `/api/vehicles/:id/maintenances`</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Drivers Section */}
                                        {currentSection === 'drivers' && (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                                <Users size={48} className="mb-4 opacity-50" />
                                                <h3 className="text-lg font-black mb-2">Motoristas</h3>
                                                <p className="text-sm">Gestão de motoristas vinculados aos veículos</p>
                                            </div>
                                        )}

                                        {/* Fuel Section */}
                                        {currentSection === 'fuel' && (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                                <Fuel size={48} className="mb-4 opacity-50" />
                                                <h3 className="text-lg font-black mb-2">Combustível</h3>
                                                <p className="text-sm">Controle de abastecimento e consumo</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FrotaDashboard;
