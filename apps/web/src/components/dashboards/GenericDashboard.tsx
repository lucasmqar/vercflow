import React from 'react';
import HeaderAnimated from '@/components/common/HeaderAnimated';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Construction, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GenericDashboardProps {
    title: string;
    description?: string;
    icon?: React.ElementType;
    status?: 'active' | 'development' | 'maintenance';
}

export function GenericDashboard({
    title,
    description = "Módulo Integrado ao Ecossistema VERCFLOW",
    icon: Icon,
    status = 'development'
}: GenericDashboardProps) {

    const statusMap = {
        active: { label: 'ONLINE', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
        development: { label: 'EM DESENVOLVIMENTO', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
        maintenance: { label: 'MANUTENÇÃO', color: 'text-red-500 bg-red-500/10 border-red-500/20' }
    };

    const currentStatus = statusMap[status];

    return (
        <div className="flex flex-col h-full bg-secondary/10 overflow-hidden font-sans">
            <div className="p-8 lg:p-12 pb-0">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
                        <div>
                            <HeaderAnimated title={title} />
                            <p className="text-muted-foreground font-medium mt-2 max-w-2xl text-lg opacity-80">
                                {description}
                            </p>
                        </div>
                        <Badge variant="outline" className={`rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.2em] ${currentStatus.color}`}>
                            {currentStatus.label}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-8 lg:p-12 pt-0 overflow-y-auto">
                <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="glass-card rounded-[2.5rem] p-12 lg:p-20 border-border/40 text-center max-w-2xl relative overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 rounded-3xl bg-primary/5 flex items-center justify-center mb-8 shadow-inner border border-primary/10">
                                {Icon ? <Icon size={48} className="text-primary opacity-80" strokeWidth={1.5} /> : <Construction size={48} className="text-primary opacity-80" strokeWidth={1.5} />}
                            </div>

                            <h2 className="text-3xl font-black tracking-tight mb-4">Módulo {title}</h2>
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                Estamos finalizando a integração deste módulo com o <strong>VERC Intelligence v2.5</strong>.
                                Novas funcionalidades de automação e dados em tempo real estarão disponíveis em breve.
                            </p>

                            <div className="flex gap-4">
                                <Button variant="outline" className="rounded-xl h-12 px-8 font-bold border-border/50 hover:bg-secondary/50">
                                    Documentação
                                </Button>
                                <Button className="rounded-xl h-12 px-8 font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
                                    Notificar Disponibilidade <ArrowRight size={16} />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
