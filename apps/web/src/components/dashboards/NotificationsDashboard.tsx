"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Info, AlertTriangle, CheckCircle2, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'info' | 'warning' | 'error' | 'success';
    unread: boolean;
}

const notifications: Notification[] = [
    {
        id: '1',
        title: 'Novo Lead Qualificado',
        description: 'Um novo lead para a Obra Residencial Silva foi qualificado pelo comercial.',
        time: '5 min atrás',
        type: 'info',
        unread: true
    },
    {
        id: '2',
        title: 'Orçamento Aprovado',
        description: 'O orçamento para o Projeto Industrial Norte foi aprovado pelo cliente.',
        time: '2 horas atrás',
        type: 'success',
        unread: true
    },
    {
        id: '3',
        title: 'Atraso na Entrega',
        description: 'A entrega de materiais para a Obra Centro está atrasada em 2 dias.',
        time: '4 horas atrás',
        type: 'warning',
        unread: false
    },
    {
        id: '4',
        title: 'Erro de Sincronização',
        description: 'Falha ao sincronizar dados com o módulo de logística.',
        time: '1 dia atrás',
        type: 'error',
        unread: false
    }
];

export function NotificationsDashboard() {
    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Centro de Mensagens</h1>
                    <p className="text-muted-foreground mt-1">Gerencie suas notificações e alertas do sistema</p>
                </div>

                <div className="flex items-center gap-2">
                    <button className="h-10 px-4 rounded-xl bg-muted/50 text-sm font-bold border border-white/5 hover:bg-muted transition-colors">
                        Marcar todas como lidas
                    </button>
                    <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 border border-white/5">
                        <Filter size={18} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                    {notifications.map((notif, idx) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "p-4 rounded-[24px] border border-white/5 glass-card group transition-all duration-300",
                                notif.unread ? "bg-primary/5 border-primary/20" : "bg-muted/10"
                            )}
                        >
                            <div className="flex gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                    notif.type === 'info' && "bg-blue-500/20 text-blue-400",
                                    notif.type === 'success' && "bg-emerald-500/20 text-emerald-400",
                                    notif.type === 'warning' && "bg-amber-500/20 text-amber-400",
                                    notif.type === 'error' && "bg-red-500/20 text-red-400",
                                )}>
                                    {notif.type === 'info' && <Info size={24} />}
                                    {notif.type === 'success' && <CheckCircle2 size={24} />}
                                    {notif.type === 'warning' && <AlertTriangle size={24} />}
                                    {notif.type === 'error' && <Bell size={24} />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-lg truncate pr-4">{notif.title}</h3>
                                        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">{notif.time}</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {notif.description}
                                    </p>
                                </div>

                                <div className="flex flex-col justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground">
                                        <CheckCircle2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-[32px] border border-white/5 glass-hub bg-primary/5">
                        <h3 className="font-black uppercase tracking-widest text-sm mb-4">Estatísticas</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Não lidas</span>
                                <span className="font-bold text-primary">02</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Urgentes</span>
                                <span className="font-bold text-red-500">00</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-[32px] border border-white/5 glass-hub">
                        <h3 className="font-black uppercase tracking-widest text-sm mb-4">Preferências</h3>
                        <div className="space-y-3">
                            {['E-mail', 'App Desktop', 'Push Mobile'].map(pref => (
                                <label key={pref} className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{pref}</span>
                                    <div className="w-10 h-6 rounded-full bg-muted flex items-center px-1 relative">
                                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
