"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeTransitionProps {
    onComplete: () => void;
    username?: string;
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
}

export function WelcomeTransition({ onComplete, username = "Admin" }: WelcomeTransitionProps) {
    const [step, setStep] = useState<'greeting' | 'date' | 'pause' | 'moving' | 'expanding' | 'done'>('greeting');
    const [typedGreeting, setTypedGreeting] = useState('');
    const [typedDate, setTypedDate] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showCursor, setShowCursor] = useState(true);

    const greetingText = useMemo(() => `${getGreeting()}, ${username}`, [username]);
    const staticDate = useMemo(() => {
        return new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }, []);

    // Phase 1: Typing Greeting
    useEffect(() => {
        if (step !== 'greeting') return;
        let index = 0;
        const interval = setInterval(() => {
            if (index <= greetingText.length) {
                setTypedGreeting(greetingText.substring(0, index));
                index++;
            } else {
                clearInterval(interval);
                setTimeout(() => setStep('date'), 600);
            }
        }, 65); // Slower, more deliberate speed
        return () => clearInterval(interval);
    }, [step, greetingText]);

    // Phase 2: Typing Date
    useEffect(() => {
        if (step !== 'date') return;
        let index = 0;
        const interval = setInterval(() => {
            if (index <= staticDate.length) {
                setTypedDate(staticDate.substring(0, index));
                index++;
            } else {
                clearInterval(interval);
                setTimeout(() => setStep('pause'), 800);
            }
        }, 45);
        return () => clearInterval(interval);
    }, [step, staticDate]);

    // Phase 3: Final Transitions
    useEffect(() => {
        if (step === 'pause') {
            const timer = setTimeout(() => setStep('moving'), 2000);
            return () => clearTimeout(timer);
        }
        if (step === 'moving') {
            const timer = setTimeout(() => setStep('expanding'), 200);
            return () => clearTimeout(timer);
        }
        if (step === 'expanding') {
            const timer = setTimeout(() => {
                setStep('done');
                onComplete();
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [step, onComplete]);

    // Clock and Cursor
    useEffect(() => {
        const clock = setInterval(() => setCurrentTime(new Date()), 1000);
        const cursor = setInterval(() => setShowCursor(prev => !prev), 500);
        return () => {
            clearInterval(clock);
            clearInterval(cursor);
        };
    }, []);

    return (
        <AnimatePresence>
            {step !== 'done' && (
                <motion.div
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-background"
                    exit={{ opacity: 0 }}
                >
                    <div className="flex flex-col items-center text-center px-6 max-w-4xl">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            {/* GREETING: Matches Page Title Style (font-black, uppercase, tight) */}
                            <motion.h1
                                className="text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase leading-none"
                                animate={step === 'moving' ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
                            >
                                {typedGreeting}
                                {step === 'greeting' && showCursor && <span className="text-primary ml-1 font-light opacity-60">|</span>}
                            </motion.h1>

                            {/* DATE: Thinner, smaller, underneath greeting */}
                            {(step === 'date' || step === 'pause' || step === 'moving') && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={step === 'moving' ? { y: -10, opacity: 0 } : { opacity: 1, y: 0 }}
                                    className="flex flex-col items-center space-y-3"
                                >
                                    <h2 className="text-lg md:text-xl font-light text-muted-foreground/80 lowercase tracking-wide">
                                        {typedDate}
                                        {step === 'date' && showCursor && <span className="text-primary ml-1 opacity-60">|</span>}
                                    </h2>

                                    {/* TIME: Even smaller (20% less), font-mono */}
                                    {(step === 'pause' || step === 'moving') && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex flex-col items-center"
                                        >
                                            <p className="text-sm md:text-base font-mono tracking-[0.4em] font-medium text-primary/70">
                                                {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </p>
                                            <div className="w-32 h-[1px] bg-primary/10 mt-3 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-primary/40"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 2, ease: "linear" }}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Reveal/Expanding Background */}
                    {step === 'expanding' && (
                        <motion.div
                            className="absolute inset-0 bg-primary/5 backdrop-blur-3xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
