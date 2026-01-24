"use client"

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Shield,
    GraduationCap,
    DollarSign,
    Plus,
    Search,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Clock,
    MapPin,
    Briefcase,
    FileText,
    Zap
} from 'lucide-react';
import { useAppFlow } from '@/store/useAppFlow';
import { DepartmentRequests } from '../shared/DepartmentRequests';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab, Employee, Accident, ASO, EPIDistribution, SafetyInspection } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';

const API_BASE = 'http://localhost:4000/api';

export function RHDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [currentSection, setCurrentSection] = useState<'overview' | 'collaborators' | 'protection' | 'payroll' | 'third-party' | 'activities'>('overview');
    const { getRequestsForDepartment } = useAppFlow();
    const requestsCount = getRequestsForDepartment('RH').filter(r => r.status !== 'CONCLUIDO' && r.status !== 'REJEITADO').length;

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [accidents, setAccidents] = useState<Accident[]>([]);
    const [asos, setAsos] = useState<ASO[]>([]);
    const [epiDistributions, setEpiDistributions] = useState<EPIDistribution[]>([]);
    const [safetyInspections, setSafetyInspections] = useState<SafetyInspection[]>([]);
    const [loading, setLoading] = useState(true);

    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'activities', label: 'Ocorrências (Triagem)', icon: Zap, badge: requestsCount },
        { id: 'collaborators', label: 'Colaboradores', icon: Users },
        { id: 'protection', label: 'SST & EPIs', icon: Shield },
        { id: 'payroll', label: 'Folha & ASOs', icon: DollarSign },
        { id: 'third-party', label: 'Terceirizados', icon: Briefcase },
    ];

    // Fetch data on mount
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [empRes, accRes, asoRes, epiRes, inspRes] = await Promise.all([
                fetch(`${API_BASE}/employees`),
                fetch(`${API_BASE}/accidents`),
                fetch(`${API_BASE}/asos`),
                fetch(`${API_BASE}/epi-distributions`),
                fetch(`${API_BASE}/safety-inspections`)
            ]);

            const empData = await empRes.json();
            const accData = await accRes.json();
            const asoData = await asoRes.json();
            const epiData = await epiRes.json();
            const inspData = await inspRes.json();

            // Validate responses are arrays
            setEmployees(Array.isArray(empData) ? empData : []);
            setAccidents(Array.isArray(accData) ? accData : []);
            setAsos(Array.isArray(asoData) ? asoData : []);
            setEpiDistributions(Array.isArray(epiData) ? epiData : []);
            setSafetyInspections(Array.isArray(inspData) ? inspData : []);
        } catch (error) {
            console.error('Error fetching RH data:', error);
            // Set empty arrays on error
            setEmployees([]);
            setAccidents([]);
            setAsos([]);
            setEpiDistributions([]);
            setSafetyInspections([]);
        } finally {
            setLoading(false);
        }
    };

    // Statistics
    const stats = {
        totalActive: employees.filter(e => e.statusAtual === 'ATIVO').length,
        onVacation: employees.filter(e => e.statusAtual === 'FERIAS').length,
        openAccidents: accidents.filter(a => a.status === 'ABERTO' || a.status === 'INVESTIGACAO').length,
        asosExpiring: asos.filter(a => {
            if (!a.dataValidade) return false;
            const daysUntilExpiry = (new Date(a.dataValidade).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
            return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        }).length,
        pendingInspections: safetyInspections.filter(i => i.status === 'PENDENTE').length,
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden font-sans">
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-20 lg:w-64 border-r border-border/40 flex flex-col items-center lg:items-stretch py-8 bg-background/50 backdrop-blur-sm shrink-0 transition-all duration-300">
                    <div className="px-6 mb-8 hidden lg:block">
                        <HeaderAnimated title="RH & SST" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-1">
                            People & Safety
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
                                    {(item as any).badge > 0 && (
                                        <Badge className="ml-auto bg-primary text-primary-foreground border-none text-[8px] font-black h-4 px-1.5 animate-pulse">
                                            {(item as any).badge}
                                        </Badge>
                                    )}
                                </Button>
                            );
                        })}
                    </div>

                    <div className="p-4 mt-auto">
                        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/10 rounded-2xl hidden lg:block">
                            <p className="text-[10px] font-black uppercase text-primary mb-1">Total Efetivo</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-xs font-bold text-foreground">{stats.totalActive} Ativos</span>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex flex-col bg-muted/5">
                    <div className="h-20 border-b border-border/40 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm shrink-0 lg:hidden">
                        <HeaderAnimated title="RH & SST" />
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
                                                {/* Stats */}
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                                    {[
                                                        { label: 'Ativos', value: stats.totalActive.toString(), change: `${stats.onVacation} férias`, icon: Users, color: 'text-blue-500' },
                                                        { label: 'Acidentes Abertos', value: stats.openAccidents.toString(), change: stats.openAccidents === 0 ? 'Seguro' : 'Atenção', icon: AlertCircle, color: stats.openAccidents === 0 ? 'text-emerald-500' : 'text-red-500' },
                                                        { label: 'ASOs Vencendo', value: stats.asosExpiring.toString(), change: '30 dias', icon: FileText, color: 'text-amber-500' },
                                                        { label: 'Inspeções Pendentes', value: stats.pendingInspections.toString(), change: 'SST', icon: Shield, color: 'text-primary' },
                                                    ].map((s, i) => (
                                                        <Card key={i} className="rounded-[2rem] border-white/5 bg-background/60 backdrop-blur-xl p-8 hover:shadow-lg transition-all">
                                                            <div className="flex justify-between items-start mb-6">
                                                                <div className={cn("p-4 rounded-2xl bg-muted/50", s.color)}>
                                                                    <s.icon size={24} strokeWidth={2.5} />
                                                                </div>
                                                            </div>
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2">{s.label}</p>
                                                            <div className="flex items-end gap-2">
                                                                <h3 className="text-3xl font-black tracking-tighter leading-none">{s.value}</h3>
                                                                <span className="text-[10px] font-black text-emerald-500 mb-1">{s.change}</span>
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>

                                                {/* Recent Accidents */}
                                                {accidents.length > 0 && (
                                                    <div>
                                                        <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground mb-4">Acidentes Recentes</h3>
                                                        <div className="grid gap-4">
                                                            {accidents.slice(0, 3).map(acc => (
                                                                <Card key={acc.id} className="rounded-[2rem] border-white/5 bg-background/60 p-6">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className={cn(
                                                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                                                acc.gravidade === 'GRAVE' || acc.gravidade === 'FATAL' ? 'bg-red-500/10' :
                                                                                    acc.gravidade === 'MODERADO' ? 'bg-amber-500/10' : 'bg-blue-500/10'
                                                                            )}>
                                                                                <AlertCircle size={20} className={
                                                                                    acc.gravidade === 'GRAVE' || acc.gravidade === 'FATAL' ? 'text-red-500' :
                                                                                        acc.gravidade === 'MODERADO' ? 'text-amber-500' : 'text-blue-500'
                                                                                } />
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="font-bold text-sm">{acc.employee?.nome || 'Funcionário'}</h4>
                                                                                <p className="text-xs text-muted-foreground">{acc.local}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            <Badge className="text-[9px] font-black">{acc.gravidade}</Badge>
                                                                            <Badge variant={acc.catEmitida ? "default" : "secondary"} className="text-[9px]">
                                                                                {acc.catEmitida ? 'CAT Emitida' : 'CAT Pendente'}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Collaborators Section */}
                                        {currentSection === 'collaborators' && (
                                            <div className="space-y-8">
                                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                                    <div className="relative flex-1 w-full md:max-w-md">
                                                        <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                                                        <Input placeholder="Buscar colaborador..." className="pl-12 h-12 rounded-xl border-border/40 bg-background/50 font-medium text-sm shadow-inner" />
                                                    </div>
                                                    <Button className="rounded-xl h-11 px-6 font-black uppercase tracking-widest gap-2 bg-primary text-primary-foreground">
                                                        <Plus size={18} /> Novo Colaborador
                                                    </Button>
                                                </div>

                                                <div className="grid gap-4">
                                                    {employees.map(emp => (
                                                        <Card key={emp.id} className="rounded-[2rem] border-white/5 bg-background/60 p-6 hover:border-primary/20 transition-all group">
                                                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                                                <div className="flex items-center gap-6 w-full md:w-auto">
                                                                    <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center text-primary border border-white/5">
                                                                        <Users size={28} />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-black text-lg tracking-tight mb-1">{emp.nome}</h3>
                                                                        <div className="flex items-center gap-2">
                                                                            <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-wider">{emp.cargo}</Badge>
                                                                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                                                                {emp.departamento}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-8">
                                                                    <Badge className={cn(
                                                                        "text-[10px] font-black uppercase tracking-widest px-3 py-1",
                                                                        emp.statusAtual === 'ATIVO' ? "bg-emerald-500/10 text-emerald-500" :
                                                                            emp.statusAtual === 'FERIAS' ? "bg-blue-500/10 text-blue-500" :
                                                                                emp.statusAtual === 'AFASTADO' ? "bg-amber-500/10 text-amber-500" :
                                                                                    "bg-red-500/10 text-red-500"
                                                                    )}>
                                                                        {emp.statusAtual}
                                                                    </Badge>
                                                                    <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white/10">
                                                                        <ChevronRight size={20} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    ))}

                                                    {employees.length === 0 && (
                                                        <Card className="rounded-[2rem] p-12 text-center">
                                                            <Users size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                                                            <p className="text-sm font-bold text-muted-foreground">Nenhum colaborador cadastrado</p>
                                                            <p className="text-xs text-muted-foreground/60 mt-2">Clique em "Novo Colaborador" para começar</p>
                                                        </Card>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Triage Activities Section */}
                                        {currentSection === 'activities' && (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                                <div className="flex flex-col gap-2">
                                                    <h2 className="text-2xl font-black tracking-tight text-foreground">Ocorrências de Campo (SST)</h2>
                                                    <p className="text-sm text-muted-foreground font-medium">Alertas de segurança, incidentes ou condições de risco triadas pelo operacional.</p>
                                                </div>
                                                <DepartmentRequests department="RH" />
                                            </div>
                                        )}
                                        {currentSection === 'protection' && (
                                            <div className="space-y-8">
                                                <h2 className="text-2xl font-black tracking-tight">Segurança do Trabalho</h2>

                                                {/* Safety Inspections */}
                                                <div>
                                                    <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground mb-4">Inspeções de Segurança</h3>
                                                    <div className="grid gap-4">
                                                        {safetyInspections.slice(0, 5).map(insp => (
                                                            <Card key={insp.id} className="rounded-[2rem] p-6 bg-background/60">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-4">
                                                                        <Shield size={20} className="text-primary" />
                                                                        <div>
                                                                            <h4 className="font-bold text-sm">{insp.tipo}</h4>
                                                                            <p className="text-xs text-muted-foreground">{insp.project?.nome || 'Geral'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="text-right text-xs">
                                                                            <p className="text-emerald-500 font-bold">{insp.conformidades} OK</p>
                                                                            <p className="text-red-500 font-bold">{insp.naoConformidades} NC</p>
                                                                        </div>
                                                                        <Badge variant={insp.status === 'REGULARIZADO' ? 'default' : 'secondary'}>
                                                                            {insp.status}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        ))}
                                                        {safetyInspections.length === 0 && (
                                                            <Card className="rounded-[2rem] p-8 text-center">
                                                                <Shield size={40} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                                                                <p className="text-sm font-bold text-muted-foreground">Nenhuma inspeção registrada</p>
                                                            </Card>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* EPI Distributions */}
                                                <div>
                                                    <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground mb-4">Distribuições de EPI Recentes</h3>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        {epiDistributions.slice(0, 6).map(epi => (
                                                            <Card key={epi.id} className="rounded-xl p-4 bg-background/60">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <h4 className="font-bold text-xs uppercase tracking-wide">{epi.epiTipo}</h4>
                                                                        <p className="text-xs text-muted-foreground">{epi.employee?.nome}</p>
                                                                    </div>
                                                                    <Badge className="text-[9px]">{epi.status}</Badge>
                                                                </div>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Payroll & ASOs Section */}
                                        {currentSection === 'payroll' && (
                                            <div className="space-y-8">
                                                <h2 className="text-2xl font-black tracking-tight">ASOs & Conformidade</h2>

                                                <div className="grid gap-4">
                                                    {asos.map(aso => {
                                                        const daysUntilExpiry = aso.dataValidade ?
                                                            Math.floor((new Date(aso.dataValidade).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
                                                        const isExpiring = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                                                        const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;

                                                        return (
                                                            <Card key={aso.id} className={cn(
                                                                "rounded-[2rem] p-6 bg-background/60",
                                                                isExpired ? "border-red-500/50" : isExpiring ? "border-amber-500/50" : ""
                                                            )}>
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className={cn(
                                                                            "w-12 h-12 rounded-xl flex items-center justify-center",
                                                                            isExpired ? "bg-red-500/10" : isExpiring ? "bg-amber-500/10" : "bg-emerald-500/10"
                                                                        )}>
                                                                            {isExpired || isExpiring ? <Clock size={20} className={isExpired ? "text-red-500" : "text-amber-500"} /> :
                                                                                <CheckCircle2 size={20} className="text-emerald-500" />}
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-bold text-sm">{aso.employee?.nome}</h4>
                                                                            <p className="text-xs text-muted-foreground">{aso.tipo}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <Badge className={cn(
                                                                            "text-[9px] font-black",
                                                                            aso.resultado === 'APTO' ? "bg-emerald-500/10 text-emerald-500" :
                                                                                aso.resultado === 'APTO_COM_RESTRICOES' ? "bg-amber-500/10 text-amber-500" :
                                                                                    "bg-red-500/10 text-red-500"
                                                                        )}>
                                                                            {aso.resultado}
                                                                        </Badge>
                                                                        {daysUntilExpiry !== null && (
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {isExpired ? 'Vencido' : `${daysUntilExpiry}d`}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        );
                                                    })}

                                                    {asos.length === 0 && (
                                                        <Card className="rounded-[2rem] p-12 text-center">
                                                            <FileText size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                                                            <p className="text-sm font-bold text-muted-foreground">Nenhum ASO registrado</p>
                                                        </Card>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Third Party Section */}
                                        {currentSection === 'third-party' && (
                                            <div className="space-y-8">
                                                <div className="flex justify-between items-center">
                                                    <h2 className="text-2xl font-black tracking-tight">Contratos Terceirizados</h2>
                                                    <Button className="rounded-xl h-11 px-6 font-black uppercase tracking-widest gap-2">
                                                        <Plus size={18} /> Novo Contrato
                                                    </Button>
                                                </div>

                                                <div className="text-center py-12 text-muted-foreground">
                                                    <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                                                    <p className="text-sm font-bold">Gestão de Terceirizados</p>
                                                    <p className="text-xs opacity-60 mt-2">Conectado ao endpoint `/api/third-party-contracts`</p>
                                                    <p className="text-xs opacity-60 mt-1">Empresas externas, PJ, Contratos temporários</p>
                                                </div>
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

export default RHDashboard;
