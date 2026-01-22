import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Activity, CheckCircle2 } from 'lucide-react';

interface VercIntelligenceLoaderProps {
    onComplete?: () => void;
}

export function VercIntelligenceLoader({ onComplete }: VercIntelligenceLoaderProps) {
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(0);

    const steps = [
        "Inicializando VERC Kernel...",
        "Carregando Protocolos...",
        "Sincronizando Dashboards...",
        "Otimizando Fluxos...",
        "VERC Intelligence Ativo"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onComplete?.(), 800);
                    return 100;
                }
                const increment = Math.random() * 5;
                return Math.min(prev + increment, 100);
            });
        }, 100);

        return () => clearInterval(interval);
    }, [onComplete]);

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 1200);
        return () => clearInterval(stepInterval);
    }, []);

    return (
        <div className="fixed inset-0 bg-background z-[99999] flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

            <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8">
                {/* Logo Animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-12 relative"
                >
                    <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center relative shadow-[0_0_40px_rgba(0,0,0,0.2)]">
                        <div className="absolute inset-0 bg-primary rounded-2xl blur-lg opacity-40 animate-pulse" />
                        <span className="text-primary-foreground text-5xl font-black relative z-10">V</span>
                    </div>
                    {/* Orbiting particles */}
                    <motion.div
                        className="absolute inset-0 rounded-2xl border border-primary/20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute -inset-4 rounded-full border border-primary/10 border-dashed"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                </motion.div>

                {/* Text Glitch Effect */}
                <div className="relative mb-8 text-center">
                    <h1 className="text-3xl font-black tracking-tighter mb-2">VERC INTELLIGENCE</h1>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest h-6"
                        >
                            {steps[step]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden relative">
                    <motion.div
                        className="h-full bg-primary"
                        style={{ width: `${progress}%` }}
                        layoutId="progress"
                    />
                    <motion.div
                        className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/50"
                        style={{ left: `${progress}%` }}
                    />
                </div>

                <div className="mt-4 flex justify-between w-full text-[10px] font-mono text-muted-foreground/60 font-bold uppercase tracking-widest">
                    <span>System v2.5</span>
                    <span>{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    );
}
