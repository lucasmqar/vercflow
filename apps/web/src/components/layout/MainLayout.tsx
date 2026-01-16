import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { CommandPalette } from './CommandPalette';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import type { DashboardTab } from '@/types';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export function MainLayout({ children, activeTab, onTabChange }: MainLayoutProps) {
  const { isOpen, open, close } = useCommandPalette();
  const [selectedProject, setSelectedProject] = useState<string>();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <TopBar
          activeTab={activeTab}
          onTabChange={onTabChange}
          onOpenCommandPalette={open}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
        />

        <main className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
      <CommandPalette isOpen={isOpen} onClose={close} />
    </div>
  );
}
