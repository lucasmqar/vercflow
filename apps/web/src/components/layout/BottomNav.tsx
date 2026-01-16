import React from 'react';
import {
  Home,
  Layers,
  Briefcase,
  LayoutDashboard,
  Settings,
  Users,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardTab } from '@/types';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const items = [
    { id: 'captura', icon: Home, label: 'Início' },
    { id: 'triagem', icon: Layers, label: 'Triagem' },
    { id: 'atividades', icon: Briefcase, label: 'Tarefas' },
    { id: 'obras', icon: Building2, label: 'Obras' },
    { id: 'clientes', icon: Users, label: 'Clientes' },
    { id: 'config', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-background/90 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[2.5rem] p-2 flex items-center justify-around h-20"
      >
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as DashboardTab)}
              className="relative flex flex-col items-center justify-center flex-1 h-full gap-1 group outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-[2rem] z-0"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}

              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0
                }}
                className={cn(
                  "relative z-10 p-2 rounded-2xl transition-all duration-300",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                <Icon size={22} className={cn(isActive ? "stroke-[2.5]" : "stroke-2")} />
              </motion.div>

              <span className={cn(
                "relative z-10 text-[9px] font-black uppercase tracking-[0.1em] transition-all duration-300",
                isActive ? "text-primary opacity-100" : "text-muted-foreground opacity-60"
              )}>
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute -bottom-1 w-1.5 h-1.5 bg-primary rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </motion.div>
    </nav>
  );
}
