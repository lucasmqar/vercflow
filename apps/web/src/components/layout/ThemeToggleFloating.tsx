"use client"

import React from 'react';
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ThemeToggleFloating() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="fixed bottom-8 left-8 z-[100] hidden lg:block">
            <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 1, duration: 0.6, ease: "circOut" }}
                className="p-1.5 rounded-[20px] bg-background/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] glass-hub flex items-center gap-1"
            >
                <button
                    onClick={() => setTheme("light")}
                    className={cn(
                        "w-10 h-10 rounded-[14px] flex items-center justify-center transition-all duration-300 relative overflow-hidden group",
                        theme === 'light' ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-white/5"
                    )}
                >
                    <Sun size={18} className={cn("relative z-10 transition-transform duration-500", theme === 'light' ? "scale-110 rotate-0" : "scale-100 -rotate-12")} />
                    {theme === 'light' && (
                        <motion.div layoutId="theme-active" className="absolute inset-0 bg-primary -z-10" />
                    )}
                </button>

                <button
                    onClick={() => setTheme("dark")}
                    className={cn(
                        "w-10 h-10 rounded-[14px] flex items-center justify-center transition-all duration-300 relative overflow-hidden group",
                        theme === 'dark' ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-white/5"
                    )}
                >
                    <Moon size={18} className={cn("relative z-10 transition-transform duration-500", theme === 'dark' ? "scale-110 rotate-0" : "scale-100 12")} />
                    {theme === 'dark' && (
                        <motion.div layoutId="theme-active" className="absolute inset-0 bg-primary -z-10" />
                    )}
                </button>
            </motion.div>
        </div>
    );
}
