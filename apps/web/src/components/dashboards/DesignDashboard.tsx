"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import {
    Palette, Layers, Image, LayoutDashboard,
    Users, Grid, LayoutTemplate, Zap, CheckSquare, Camera,
    ClipboardList, ShoppingCart
} from 'lucide-react';
import { useAppFlow } from '@/store/useAppFlow';
import { Badge } from '@/components/ui/badge';
import { DepartmentRequests } from '../shared/DepartmentRequests';

// Sub-components
import { DesignOverview } from './design/DesignOverview';
import { DesignSpecs } from './design/DesignSpecs';
import { DesignProjects } from './design/DesignProjects';
import { DesignTeam } from './design/DesignTeam';
import { DesignMoodboards } from './design/DesignMoodboards';
import { DesignProjectDetails } from './design/DesignProjectDetails';
import { DesignChecklists } from './design/DesignChecklists';
import { DesignFieldRecords } from './design/DesignFieldRecords';

export function DesignDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    // Navigation State
    const [currentSection, setCurrentSection] = useState<'overview' | 'projects' | 'specs' | 'moodboards' | 'team' | 'checklists' | 'records' | 'activities'>('overview');
    const { getRequestsForDepartment } = useAppFlow();
    const requestsCount = getRequestsForDepartment('PROJETOS').filter(r => r.status !== 'CONCLUIDO' && r.status !== 'REJEITADO').length;

    // Detailed View State
    // Detailed View State
    const [selectedProject, setSelectedProject] = useState<any | null>(null);

    // Navigation Items
    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'activities', label: 'Solicitações (Triagem)', icon: Zap, badge: requestsCount },
        { id: 'projects', label: 'Projetos', icon: Layers },
        { id: 'budgets', label: 'Orçamentos & Requisições', icon: ShoppingCart }, // Added as requested
        { id: 'records', label: 'Registros de Campo', icon: Camera },
        { id: 'specs', label: 'Especificações', icon: Palette },
        { id: 'moodboards', label: 'Moodboards', icon: LayoutTemplate },
        { id: 'checklists', label: 'Checklists', icon: CheckSquare },
        { id: 'team', label: 'Equipe', icon: Users },
    ];

    // Handler to open project details
    const handleSelectProject = (project: any) => {
        setSelectedProject(project);
    };

    // If a project is selected, show the details view (Full Page)
    if (selectedProject) {
        return (
            <DesignProjectDetails
                project={selectedProject}
                onBack={() => setSelectedProject(null)}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-secondary/5 overflow-hidden font-sans">
            <div className="flex h-full">
                {/* Sidebar Navigation */}
                <div className="w-20 lg:w-64 border-r border-border/40 flex flex-col items-center lg:items-stretch py-8 bg-background/50 backdrop-blur-sm shrink-0 transition-all duration-300">
                    <div className="px-6 mb-8 hidden lg:block">
                        <HeaderAnimated title="Design Studio" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60 mt-1">
                            Creative Control
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
                                        <Badge className="ml-auto bg-pink-500 text-white border-none text-[8px] font-black h-4 px-1.5">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </Button>
                            );
                        })}
                    </div>

                    <div className="p-4 mt-auto">
                        <Card className="p-4 bg-gradient-to-br from-pink-500/10 to-pink-500/5 border-pink-500/10 rounded-2xl hidden lg:block">
                            <p className="text-[10px] font-black uppercase text-pink-500 mb-1">Aprovações</p>
                            <div className="w-full h-1.5 bg-background/50 rounded-full overflow-hidden">
                                <div className="h-full bg-pink-500 w-[60%]" />
                            </div>
                            <p className="text-[10px] font-bold text-right mt-1 text-muted-foreground">12 Pendentes</p>
                        </Card>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col bg-muted/5">
                    {/* Top Bar (Mobile/Responsive or Contextual) */}
                    <div className="h-20 border-b border-border/40 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm shrink-0 lg:hidden">
                        <HeaderAnimated title="Design Studio" />
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
                                <DesignOverview onNavigate={(section) => setCurrentSection(section as any)} />
                            )}

                            {currentSection === 'projects' && (
                                <DesignProjects onSelectProject={handleSelectProject} />
                            )}

                            {currentSection === 'specs' && (
                                <DesignSpecs onSelectProject={handleSelectProject} />
                            )}

                            {currentSection === 'records' && (
                                <DesignFieldRecords />
                            )}

                            {currentSection === 'moodboards' && (
                                <DesignMoodboards />
                            )}

                            {currentSection === 'checklists' && (
                                <DesignChecklists />
                            )}

                            {currentSection === 'activities' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-2xl font-black tracking-tight">Solicitações de Projeto</h2>
                                        <p className="text-sm text-muted-foreground font-medium">Itens distribuídos para detalhamento técnico ou revisão de design.</p>
                                    </div>
                                    <DepartmentRequests department="PROJETOS" />
                                </div>
                            )}

                            {currentSection === 'team' && (
                                <DesignTeam />
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DesignDashboard;
