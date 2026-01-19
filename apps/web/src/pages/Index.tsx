import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CaptureDashboard } from '@/components/dashboards/CaptureDashboard';
import { TriagemDashboard } from '@/components/dashboards/TriagemDashboard';
import { ActivitiesDashboard } from '@/components/dashboards/ActivitiesDashboard';
import { CEODashboard } from '@/components/dashboards/CEODashboard';
import { TeamDashboard } from '@/components/dashboards/TeamDashboard';
import { ObrasDashboard } from '@/components/dashboards/ObrasDashboard';
import { SettingsDashboard } from '@/components/dashboards/SettingsDashboard';
import { ClientesDashboard } from '@/components/dashboards/ClientesDashboard';
import type { DashboardTab } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('captura');

  const renderDashboard = () => {
    switch (activeTab) {
      case 'captura':
        return <CaptureDashboard />;
      case 'triagem':
        return <TriagemDashboard />;
      case 'atividades':
        return <ActivitiesDashboard />;
      case 'dashboard':
        return <CEODashboard />;
      case 'equipe':
        return <TeamDashboard />;
      case 'obras':
        return <ObrasDashboard />;
      case 'clientes':
        return <ClientesDashboard />;
      case 'config':
        return <SettingsDashboard />;
      default:
        return <CaptureDashboard />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderDashboard()}
    </MainLayout>
  );
};

export default Index;
