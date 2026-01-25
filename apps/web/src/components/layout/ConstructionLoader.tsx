'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DottedSurface } from '@/components/ui/dotted-surface';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface ConstructionLoaderProps {
    onComplete: () => void;
}

export function ConstructionLoader({ onComplete }: ConstructionLoaderProps) {
    const [progress, setProgress] = useState(0);
    const { theme } = useTheme();

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500); // Small delay after completion
                    return 100;
                }
                return prev + 2; // Adjust speed here
            });
        }, 30);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-background flex flex-col items-center justify-center">
            {/* Background Animation */}
            <DottedSurface className="absolute inset-0 z-0 opacity-40" />

            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Logo / Icon */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    <div className={cn(
                        "w-24 h-24 rounded-xl flex items-center justify-center shadow-2xl backdrop-blur-xl border border-primary/20",
                        theme === 'dark' ? "bg-white/5" : "bg-black/5"
                    )}>
                        <Building2 size={48} className="text-primary" />
                    </div>
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 rounded-xl border border-primary/30 animate-ping opacity-20" />
                </motion.div>

                {/* Text Branding */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-black tracking-tighter mb-2">VERCFLOW</h1>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                        Construction Intelligence
                    </p>
                </motion.div>

                {/* Progress Bar */}
                <div className="w-64 h-1 bg-muted/30 rounded-full overflow-hidden mt-8">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                    />
                </div>

                <motion.p
                    className="text-[10px] font-mono text-muted-foreground opacity-50"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    INITIALIZING SYSTEMS... {progress}%
                </motion.p>
            </div>
        </div>
    );
}
