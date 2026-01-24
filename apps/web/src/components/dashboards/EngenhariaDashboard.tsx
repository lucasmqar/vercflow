"use client"

import React, { useState } from 'react';
import {
    LayoutDashboard,
    Building2,
    FileText,
    ShoppingCart,
    Truck,
    Users,
    Package,
    Wallet,
    Zap,
    ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab, Project } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated'; // Restored Import
import { useAppFlow } from '@/store/useAppFlow';
import { toast } from 'sonner';

// Sub-components
// Sub-components
import { EngenhariaOverview } from './engenharia/EngenhariaOverview';
import { EngenhariaProjects } from './engenharia/EngenhariaProjects';
import { EngenhariaBudgets } from './engenharia/EngenhariaBudgets';
import { EngenhariaSupply } from './engenharia/EngenhariaSupply';
import { EngenhariaFinancial } from './engenharia/EngenhariaFinancial';
import { ScopeValidationPage } from './engenharia/ScopeValidationPage';
import { DisciplineManagementPage } from './engenharia/DisciplineManagementPage';
import { ProjectDetailsPage } from './engenharia/ProjectDetailsPage'; // Added Import
import { DepartmentRequests } from '../shared/DepartmentRequests';

// Placeholder components for sections not yet implemented
const PlaceholderSection = ({ title, icon: Icon }: any) => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-muted/30 rounded-[2rem] flex items-center justify-center mb-6">
            <Icon size={40} className="opacity-50" />
        </div>
        <h2 className="text-xl font-black tracking-tight mb-2">Seção {title}</h2>
        <p className="max-w-[300px] text-center text-sm font-medium opacity-60">
            Este mōdulo de gestão está em desenvolvimento e estará disponível em breve.
        </p>
    </div>
);

export function EngenhariaDashboard({ onTabChange, onOpenWizard }: { onTabChange: (tab: DashboardTab) => void, onOpenWizard?: () => void }) {
    // Navigation State
    const [currentSection, setCurrentSection] = useState<'overview' | 'projects' | 'budgets' | 'supply' | 'financial' | 'fleet' | 'stock' | 'activities'>('overview');

    // Detailed View Logic
    const [viewMode, setViewMode] = useState<'dashboard' | 'validation' | 'discipline' | 'project-detail'>('dashboard');
    const [scopeValidationData, setScopeValidationData] = useState<any>(null);
    const [selectedDiscipline, setSelectedDiscipline] = useState<any>(null); // Kept for Discipline Page logic if needed via projects
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const { projects, getRequestsForDepartment } = useAppFlow();
    const requests = getRequestsForDepartment('ENGENHARIA');
    const activeRequestsCount = requests.filter(r => r.status !== 'CONCLUIDO' && r.status !== 'REJEITADO').length;
    const activeProjectsCount = projects.filter(p => p.status === 'ATIVA' || p.status === 'PLANEJAMENTO').length;

    // Navigation Items
    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'activities', label: 'Solicitações (Triagem)', icon: Zap, badge: activeRequestsCount },
        { id: 'projects', label: 'Obras', icon: Building2 },
        { id: 'budgets', label: 'Orçamentos', icon: FileText },
        { id: 'supply', label: 'Suprimentos', icon: ShoppingCart },
        { id: 'financial', label: 'Financeiro', icon: Wallet },
        { id: 'stock', label: 'Estoque', icon: Package },
        { id: 'fleet', label: 'Frota', icon: Truck },
    ];

    // Handlers
    const openScopeValidationPage = (item: any) => {
        setScopeValidationData(item);
        setViewMode('validation');
    };

    const handleScopeAction = (approved: boolean, reason?: string) => {
        if (approved) {
            toast.success(`Orçamento de ${scopeValidationData.client} aprovado! Obra iniciada.`);
        } else {
            toast.error(`Orçamento devolvido ao comercial: ${reason}`);
        }
        setViewMode('dashboard');
        setScopeValidationData(null);
    };

    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
        setViewMode('project-detail');
    };

    // Render Logic
    if (viewMode === 'project-detail' && selectedProject) {
        return (
            <ProjectDetailsPage
                project={selectedProject}
                onBack={() => {
                    setViewMode('dashboard');
                    setSelectedProject(null);
                }}
                onNavigateTo={(section) => onTabChange(section as DashboardTab)}
            />
        );
    }

    if (viewMode === 'validation' && scopeValidationData) {
        return (
            <ScopeValidationPage
                data={scopeValidationData}
                onBack={() => setViewMode('dashboard')}
                onApprove={() => handleScopeAction(true)}
                onReject={(reason) => handleScopeAction(false, reason)}
            />
        );
    }

    if (viewMode === 'discipline' && selectedDiscipline) {
        return (
            <DisciplineManagementPage
                discipline={selectedDiscipline}
                onBack={() => setViewMode('dashboard')}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden font-sans">
            {/* Main Layout */}
            <div className="flex h-full">
                {/* Sidebar Navigation */}
                <div className="w-20 lg:w-64 border-r border-border/40 flex flex-col items-center lg:items-stretch py-8 bg-background/50 backdrop-blur-sm shrink-0 transition-all duration-300">
                    <div className="px-6 mb-8 hidden lg:block">
                        <HeaderAnimated title="Engenharia" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-1">
                            Control Room
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
                                        <Badge className="ml-auto bg-primary-foreground text-primary border-none text-[8px] font-black h-4 px-1.5 animate-pulse">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </Button>
                            );
                        })}
                    </div>

                    <div className="p-4 mt-auto">
                        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/10 rounded-2xl hidden lg:block">
                            <p className="text-[10px] font-black uppercase text-primary mb-1">Status Global</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-foreground">Operacional</span>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col bg-muted/5">
                    {/* Top Bar (Mobile/Responsive or Contextual) */}
                    <div className="h-20 border-b border-border/40 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm shrink-0 lg:hidden">
                        <HeaderAnimated title="Engenharia" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        <motion.div
                            key={currentSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-[1920px] mx-auto"
                        >
                            {currentSection === 'overview' && (
                                <EngenhariaOverview
                                    projects={projects}
                                    requestsCount={activeRequestsCount}
                                    activeProjectsCount={activeProjectsCount}
                                    onNavigate={setCurrentSection}
                                />
                            )}

                            {currentSection === 'activities' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-2xl font-black tracking-tight">Solicitações Interdepartamentais</h2>
                                        <p className="text-sm text-muted-foreground font-medium">Itens distribuídos via triagem ou solicitados por outros setores.</p>
                                    </div>
                                    <DepartmentRequests department="ENGENHARIA" />
                                </div>
                            )}

                            {currentSection === 'projects' && (
                                <EngenhariaProjects
                                    projects={projects}
                                    onSelectProject={handleSelectProject}
                                />
                            )}

                            {currentSection === 'budgets' && (
                                <EngenhariaBudgets
                                    onOpenScopeValidation={openScopeValidationPage}
                                />
                            )}

                            {currentSection === 'supply' && <EngenhariaSupply />}

                            {currentSection === 'financial' && <EngenhariaFinancial />}

                            {(currentSection === 'fleet' || currentSection === 'stock') && (
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

export default EngenhariaDashboard;
