"use client"

import React from 'react';
import { Settings, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardTab } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface SystemActionsFloatingProps {
    activeTab: DashboardTab;
    onTabChange: (tab: DashboardTab) => void;
}

export function SystemActionsFloating({ activeTab, onTabChange }: SystemActionsFloatingProps) {
    const items = [
        { id: 'notifications', icon: Bell, label: 'Avisos', unread: 2 },
        { id: 'config', icon: Settings, label: 'Ajustes' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6, ease: "circOut" }}
            className="glass-hub p-1.5 rounded-[24px] flex items-center gap-1 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 bg-background/25 backdrop-blur-2xl transition-all"
        >
            <div className="flex items-center gap-1">
                {items.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => onTabChange(item.id as DashboardTab)}
                            layout
                            className={cn(
                                "relative h-11 flex items-center gap-2 rounded-2xl transition-all duration-300 group overflow-hidden px-3",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg px-4"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            )}
                        >
                            <div className="relative">
                                <Icon size={18} className={cn("shrink-0", isActive && "animate-pulse")} strokeWidth={isActive ? 2.5 : 2} />
                                {item.unread && item.unread > 0 && !isActive && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-background animate-pulse" />
                                )}
                            </div>

                            <AnimatePresence initial={false}>
                                {isActive && (
                                    <motion.span
                                        initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                                        animate={{ width: "auto", opacity: 1, marginLeft: 4 }}
                                        exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                                        transition={{ duration: 0.3, ease: "circOut" }}
                                        className="text-[11px] font-black uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {isActive && (
                                <motion.div
                                    layoutId="system-active-pill"
                                    className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}
