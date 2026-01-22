import React, { useState } from 'react';
import { MobileDock } from './components/layout/MobileDock';
import { DesktopNav } from './components/layout/DesktopNav';
import { HomeDashboard } from './components/dashboards/HomeDashboard';
import { GestaoProjetosDashboard } from './components/dashboards/GestaoProjetosDashboard';
import { CaptureDashboard } from './components/dashboards/CaptureDashboard';
import { SettingsDashboard } from './components/dashboards/SettingsDashboard';
import { GenericDashboard } from './components/dashboards/GenericDashboard';
import { EquipeDashboard } from './components/dashboards/EquipeDashboard';
import { FinanceiroDashboard } from './components/dashboards/FinanceiroDashboard';
import { ComprasDashboard } from './components/dashboards/ComprasDashboard';
import { ExecutivoDashboard } from './components/dashboards/ExecutivoDashboard';
import { ObrasDashboard } from './components/dashboards/ObrasDashboard';
import { TriagemDashboard } from './components/dashboards/TriagemDashboard';
import { EngenhariaDashboard } from './components/dashboards/EngenhariaDashboard';
import { EstoqueDashboard } from './components/dashboards/EstoqueDashboard';
import { FrotaDashboard } from './components/dashboards/FrotaDashboard';
import { ClientesDashboard } from './components/dashboards/ClientesDashboard';
import { ComercialDashboard } from './components/dashboards/ComercialDashboard';
import { ProjetosBoard } from './components/dashboards/ProjetosBoard';
import { EngineeringOverview } from './components/dashboards/EngineeringOverview';
import { FinancialProposals } from './components/dashboards/FinancialProposals';
import { PurchasesDashboard } from './components/dashboards/PurchasesDashboard';
import { StockControl } from './components/dashboards/StockControl';
import { CommandPalette } from './components/layout/CommandPalette';
import { VercIntelligenceLoader } from './components/layout/VercIntelligenceLoader';
import { useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import { DashboardTab } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import { ThemeToggleFloating } from './components/layout/ThemeToggleFloating';
import { NewProjectWizard } from './components/projects/NewProjectWizard';
import { toast } from 'sonner';
import { Building2, Shield, Zap, Box, Truck, DollarSign, Users, PieChart } from 'lucide-react';

const queryClient = new QueryClient();

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [appReady, setAppReady] = useState(false);

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!appReady && (
          <motion.div
            key="loader"
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[99999]"
          >
            <VercIntelligenceLoader onComplete={() => setAppReady(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Content */}
      <div className={`min-h-screen bg-background text-foreground flex flex-col transition-opacity duration-1000 ${appReady ? 'opacity-100' : 'opacity-0'}`}>

        {/* Navigation Layer */}
        <DesktopNav activeTab={activeTab} onTabChange={setActiveTab} />
        <MobileDock
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
        />

        {/* Global Command Palette */}
        {/* Global Command Palette */}
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          onSelect={(item) => {
            // Simple mapping for now
            if (item.id === 'new-obra') setShowWizard(true);
            if (item.id === 'new-registro') setActiveTab('captura');
            if (item.id === 'inbox') setActiveTab('triagem');
            setShowCommandPalette(false);
          }}
        />

        {/* Dashboards Area */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto relative overflow-hidden pb-40 lg:pb-32 pt-8 px-4 lg:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full"
            >
              {activeTab === 'home' && <HomeDashboard onTabChange={setActiveTab} onOpenWizard={() => setShowWizard(true)} />}
              {activeTab === 'comercial' && <ComercialDashboard onTabChange={setActiveTab} />}
              {activeTab === 'obras' && <ObrasDashboard onTabChange={setActiveTab} onOpenWizard={() => setShowWizard(true)} />}
              {activeTab === 'captura' && <CaptureDashboard onTabChange={setActiveTab} />}
              {activeTab === 'triagem' && <TriagemDashboard onTabChange={setActiveTab} />}
              {activeTab === 'projetos' && <ProjetosBoard />}
              {activeTab === 'engenharia' && <EngenhariaDashboard onTabChange={setActiveTab} onOpenWizard={() => setShowWizard(true)} />}
              {activeTab === 'estoque' && <EstoqueDashboard onTabChange={setActiveTab} />}
              {activeTab === 'frota' && <FrotaDashboard onTabChange={setActiveTab} />}
              {activeTab === 'financeiro' && <FinanceiroDashboard onTabChange={setActiveTab} />}
              {activeTab === 'equipe' && <EquipeDashboard onTabChange={setActiveTab} />}
              {activeTab === 'config' && <SettingsDashboard onTabChange={setActiveTab} />}
            </motion.div>
          </AnimatePresence>
        </main>

        <ThemeToggleFloating />

        <AnimatePresence>
          {showWizard && (
            <NewProjectWizard
              isOpen={showWizard}
              onClose={() => setShowWizard(false)}
              onComplete={(data) => {
                console.log('Project Created:', data);
                toast.success('Projeto criado e distribuído com sucesso!');
                setShowWizard(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};


export default App;
