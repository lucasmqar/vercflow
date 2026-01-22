import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CaptureDashboard } from '@/components/dashboards/CaptureDashboard';
import { TriagemDashboard } from '@/components/dashboards/TriagemDashboard';
import { ActivitiesDashboard } from '@/components/dashboards/ActivitiesDashboard';
import { CEODashboard } from '@/components/dashboards/CEODashboard';
import { TeamDashboard } from '@/components/dashboards/TeamDashboard';
import { ObrasDashboard } from '@/components/dashboards/ObrasDashboard';
import { DesktopSettingsDashboard } from '@/components/dashboards/SettingsDashboard';
import { ClientesDashboard } from '@/components/dashboards/ClientesDashboard';
import { HomeDashboard } from '@/components/dashboards/HomeDashboard';
import { FinancialDashboard } from '@/components/dashboards/FinancialDashboard';
import { StockDashboard } from '@/components/dashboards/StockDashboard';
import DisciplinasDashboard from '@/components/dashboards/DisciplinasDashboard';
import { ProjectManagementDashboard } from '@/components/dashboards/ProjectManagementDashboard';
import { GestaoProjetosDashboard } from '@/components/dashboards/GestaoProjetosDashboard';
import { FrotaDashboard } from '@/components/dashboards/FrotaDashboard';
import type { DashboardTab } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
  };

  const renderDashboard = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard onTabChange={handleTabChange} />;
      case 'captura':
        return <CaptureDashboard onTabChange={handleTabChange} />;
      case 'triagem':
        return <TriagemDashboard onTabChange={handleTabChange} />;
      case 'atividades':
        return <ActivitiesDashboard onTabChange={handleTabChange} />;
      case 'dashboard':
        return <CEODashboard onTabChange={handleTabChange} />;
      case 'equipe':
        return <TeamDashboard onTabChange={handleTabChange} />;
      case 'obras':
        return <ObrasDashboard onTabChange={handleTabChange} />;
      case 'clientes':
        return <ClientesDashboard onTabChange={handleTabChange} />;
      case 'disciplinas':
        return <DisciplinasDashboard onTabChange={handleTabChange} />;
      case 'financeiro':
        return <FinancialDashboard onTabChange={handleTabChange} />;
      case 'estoque':
        return <StockDashboard onTabChange={handleTabChange} />;
      case 'gestao-projetos':
        return <GestaoProjetosDashboard onTabChange={handleTabChange} />;
      case 'frota':
        return <FrotaDashboard onTabChange={handleTabChange} />;
      case 'config':
        return <DesktopSettingsDashboard onTabChange={handleTabChange} />;
      default:
        return <HomeDashboard onTabChange={handleTabChange} />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderDashboard()}
    </MainLayout>
  );
};

export default Index;
