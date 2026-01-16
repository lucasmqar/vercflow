import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Calendar as CalendarIcon,
    DollarSign,
    Search,
    Filter,
    User as UserIcon,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function ActivitiesDashboard() {
    const [view, setView] = useState<'board' | 'list' | 'calendar'>('list');
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/activities');
            if (res.ok) setActivities(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 lg:p-6 h-[calc(100vh-64px)] flex flex-col bg-secondary/10">

            {/* Sub Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tighter">Atividades de Obra</h1>
                    <p className="text-muted-foreground text-sm font-medium">Gestão técnica e operacional de tarefas</p>
                </div>

                <div className="flex items-center gap-2">
                    <Tabs value={view} onValueChange={(v: any) => setView(v)} className="bg-background border rounded-xl p-1">
                        <TabsList className="bg-transparent border-none">
                            <TabsTrigger value="board" className="rounded-lg px-4 h-8 data-[state=active]:bg-primary data-[state=active]:text-white">Board</TabsTrigger>
                            <TabsTrigger value="list" className="rounded-lg px-4 h-8 data-[state=active]:bg-primary data-[state=active]:text-white">Lista</TabsTrigger>
                            <TabsTrigger value="calendar" className="rounded-lg px-4 h-8 data-[state=active]:bg-primary data-[state=active]:text-white">Calendário</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Stats Quick Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-background/80 backdrop-blur-md border-border/50 shadow-sm rounded-3xl">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Previsto (Próx. 7 dias)</p>
                                <p className="text-2xl font-bold tracking-tighter">
                                    R$ {activities.reduce((acc, a) => acc + (a.assignments?.[0]?.valorPrevisto || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-background/80 backdrop-blur-md border-border/50 shadow-sm rounded-3xl">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Atividades Ativas</p>
                                <p className="text-2xl font-bold tracking-tighter">{activities.length} Tarefas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-background/80 backdrop-blur-md border-border/50 shadow-sm rounded-3xl">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Concluído (SLA)</p>
                                <p className="text-2xl font-bold tracking-tighter">100%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Buscar atividade, profissional ou obra..." className="pl-10 h-11 rounded-xl bg-background border-border/50 shadow-sm" />
                </div>
                <Button onClick={fetchActivities} variant="outline" className="h-11 px-4 gap-2 rounded-xl bg-background border-border/50 font-bold">
                    <Filter size={18} /> Atualizar
                </Button>
            </div>

            {/* Main Table/List */}
            <div className="flex-1 bg-background rounded-3xl border border-border/50 shadow-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b bg-secondary/10 flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <div className="w-1/3">Atividade / Obra</div>
                    <div className="w-1/4">Responsável</div>
                    <div className="w-1/6">Prazo</div>
                    <div className="w-1/6">Valor Previsto</div>
                    <div className="w-1/12 text-right">Status</div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {activities.length === 0 && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                            <Briefcase size={40} className="opacity-20" />
                            <p className="font-bold text-sm">Nenhuma atividade formalizada ainda</p>
                            <p className="text-xs">Formalize registros técnicos na aba de Triagem</p>
                        </div>
                    )}
                    {activities.map((act, i) => (
                        <motion.div
                            key={act.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center p-4 rounded-2xl hover:bg-secondary/20 transition-colors border border-transparent hover:border-border/60 group cursor-pointer"
                        >
                            <div className="w-1/3">
                                <p className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{act.titulo}</p>
                                <p className="text-xs text-muted-foreground font-medium">{act.project?.nome || 'Obra não definida'}</p>
                            </div>
                            <div className="w-1/4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                    <UserIcon size={14} />
                                </div>
                                <p className="text-sm font-semibold">{act.assignments?.[0]?.professional?.nome || 'Não designado'}</p>
                            </div>
                            <div className="w-1/6">
                                <p className="text-xs font-bold text-foreground/80">
                                    {act.dataFim ? new Date(act.dataFim).toLocaleDateString() : 'Sem prazo'}
                                </p>
                            </div>
                            <div className="w-1/6">
                                <p className="text-sm font-bold text-primary tracking-tighter">
                                    R$ {(act.assignments?.[0]?.valorPrevisto || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="w-1/12 text-right">
                                <Badge className="bg-blue-500/10 text-blue-600 border-none shadow-none text-[9px] h-5 tracking-tight uppercase font-bold">{act.status}</Badge>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
