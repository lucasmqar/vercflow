import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MobileDock } from './MobileDock';
import { CommandPalette } from './CommandPalette';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { useTheme } from '@/components/providers/ThemeProvider';
import type { DashboardTab } from '@/types';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export function MainLayout({ children, activeTab, onTabChange }: MainLayoutProps) {
  const { isOpen, open, close } = useCommandPalette();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isFieldMode, setIsFieldMode] = useState(false);
  const { actualTheme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isFieldMode) {
      root.setAttribute('data-theme', 'industrial');
    } else {
      root.setAttribute('data-theme', actualTheme);
    }
  }, [isFieldMode, actualTheme]);

  return (
    <div className={cn(
      "flex flex-col h-screen bg-background text-foreground overflow-hidden transition-colors duration-500",
      isFieldMode && "industrial-mode"
    )}>
      {/* Top Navigation Bar - Primary Navigator */}
      <TopBar
        onTabChange={onTabChange}
        activeTab={activeTab}
        showSidebar={showSidebar}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        isFieldMode={isFieldMode}
        onToggleFieldMode={() => setIsFieldMode(!isFieldMode)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar - Optional Technical Panel */}
        <AnimatePresence initial={false}>
          {showSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0, x: -20 }}
              animate={{ width: sidebarCollapsed ? 60 : 260, opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: -10 }}
              transition={{ duration: 0.15, ease: 'linear' }}
              className="hidden md:block shrink-0 h-full z-40 relative border-r border-border/40 bg-muted/5 backdrop-blur-sm"
            >
              <Sidebar
                activeTab={activeTab}
                onTabChange={onTabChange}
                onOpenCommandPalette={open}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area - Expands automatically */}
        <main className="flex-1 overflow-hidden w-full relative bg-muted/5 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.12, ease: 'easeInOut' }}
              className="flex-1 overflow-y-auto scrollbar-thin"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileDock
        activeTab={activeTab}
        onTabChange={onTabChange}
        onOpenCommandPalette={open}
      />

      <CommandPalette isOpen={isOpen} onClose={close} />
    </div>
  );
}
