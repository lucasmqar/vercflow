import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TabItem {
    id: string;
    label: string;
    notificationCount?: number;
}

interface ModuleTabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (id: any) => void;
}

export function ModuleTabs({ tabs, activeTab, onChange }: ModuleTabsProps) {
    return (
        <div className="w-full bg-background border-b border-border/40 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-1 px-8 overflow-x-auto scrollbar-none">
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className={cn(
                                "relative h-14 px-6 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all hover:bg-muted/5",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab.label}
                            {tab.notificationCount !== undefined && tab.notificationCount > 0 && (
                                <span className="flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-amber-500 text-[8px] text-white">
                                    {tab.notificationCount}
                                </span>
                            )}

                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_-2px_10px_rgba(var(--primary),0.5)]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
