import React, { useState, useEffect } from 'react';
import { useRegistros } from '@/hooks/useRegistros';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
    Palette,
    FileText,
    Clock,
    ChevronRight,
    TrendingUp,
    MessageSquare,
    Plus,
    Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RegistroModal } from '@/components/shared/RegistroModal';
import { Record } from '@/types';

export function CaptureDashboard() {
    const { user } = useAuth();
    const { registros, fetchRegistros } = useRegistros();
    const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
    const [selectedParent, setSelectedParent] = useState<Record | null>(null);

    useEffect(() => {
        fetchRegistros();
    }, []);

    const recentRegistros = registros.slice(0, 5);

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-secondary/20 overflow-y-auto">

            {/* Central Hero / Action Section */}
            <div className="max-w-4xl mx-auto w-full px-6 pt-12 pb-8 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-background rounded-[40px] p-12 shadow-2xl shadow-black/5 border border-border/50 relative overflow-hidden group"
                >
                    {/* Subtle bg accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors" />

                    <div className="relative z-10">
                        <h1 className="text-4xl font-extrabold tracking-tighter mb-4 text-foreground/90">O que vamos capturar hoje?</h1>
                        <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                            Transforme observações de campo em registros estruturados e esboços técnicos timbrados em segundos.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                onClick={() => {
                                    setSelectedParent(null);
                                    setIsRegistroModalOpen(true);
                                }}
                                className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold gap-3 shadow-xl shadow-primary/20 active:scale-95 transition-all w-full sm:w-auto"
                            >
                                <Plus className="w-6 h-6" />
                                Novo Registro de Campo
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Stats / Quick Info */}
            <div className="max-w-4xl mx-auto w-full px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <Card className="rounded-[2.5rem] border-border/40 shadow-xl shadow-black/5 bg-background/60 backdrop-blur-md">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <FileText size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Em Triagem</p>
                            <p className="text-xl font-bold tracking-tighter">{registros.filter(r => r.status === 'TRIAGEM').length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2.5rem] border-border/40 shadow-xl shadow-black/5 bg-background/60 backdrop-blur-md">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <TrendingUp size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Produtividade</p>
                            <p className="text-xl font-bold tracking-tighter">85%</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2.5rem] border-border/40 shadow-xl shadow-black/5 bg-background/60 backdrop-blur-md">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Clock size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pendências</p>
                            <p className="text-xl font-bold tracking-tighter">04</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Timeline Section */}
            <div className="max-w-4xl mx-auto w-full px-6 pb-20">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold tracking-tighter">Registros Recentes</h2>
                    <Button variant="ghost" size="sm" className="text-xs font-bold gap-1 text-primary hover:text-primary hover:bg-primary/5">
                        Ver Todos <ChevronRight size={14} />
                    </Button>
                </div>

                <div className="space-y-4">
                    {recentRegistros.map((reg, idx) => (
                        <motion.div
                            key={reg.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-background rounded-3xl p-5 border border-border/40 shadow-lg shadow-black/5 flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                                    reg.type === 'ESBOCO' ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                                )}>
                                    {reg.type === 'ESBOCO' ? <Palette size={20} /> : <MessageSquare size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-bold tracking-tight text-foreground/80 line-clamp-1">{reg.texto || 'Sem descrição'}</h4>
                                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                                        {reg.criadoEm && !isNaN(new Date(reg.criadoEm).getTime())
                                            ? format(new Date(reg.criadoEm), "dd 'de' MMM, HH:mm", { locale: ptBR })
                                            : 'Data indisponível'
                                        }
                                        <span className="w-1 h-1 rounded-full bg-border" />
                                        {reg.author?.nome}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[10px] h-8 rounded-lg gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedParent(reg);
                                        setIsRegistroModalOpen(true);
                                    }}
                                >
                                    <Layers size={14} /> Revisão
                                </Button>
                                <Badge variant="outline" className="text-[10px] font-bold h-6 rounded-lg bg-secondary/50 border-none uppercase tracking-tighter">
                                    {reg.status}
                                </Badge>
                                <div className="w-8 h-8 rounded-full bg-secondary opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <ChevronRight size={16} className="text-muted-foreground" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <RegistroModal
                isOpen={isRegistroModalOpen}
                onClose={() => setIsRegistroModalOpen(false)}
                onSuccess={fetchRegistros}
                parentRecord={selectedParent}
            />
        </div>
    );
}
