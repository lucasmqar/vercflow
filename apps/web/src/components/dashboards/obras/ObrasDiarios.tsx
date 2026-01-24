"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ClipboardList, Search, Plus, Calendar,
    CloudRain, Sun, Users, Cloud, FileText,
    ChevronRight, Eye, Edit, CheckCircle, XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppFlow } from '@/store/useAppFlow';
import { DiarioObra, ClimaType } from '@/types';
import { DiarioObraModal } from '@/components/shared/DiarioObraModal';
import { toast } from 'sonner';

export function ObrasDiarios() {
    const { projects, diariosObra, updateDiarioObraStatus } = useAppFlow();
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDiario, setSelectedDiario] = useState<DiarioObra | undefined>();

    // Filter diarios based on search
    const filteredDiarios = diariosObra.filter(rdo => {
        if (!search) return true;
        const project = projects.find(p => p.id === rdo.projectId);
        const searchLower = search.toLowerCase();
        return (
            project?.nome?.toLowerCase().includes(searchLower) ||
            rdo.responsavel?.toLowerCase().includes(searchLower) ||
            rdo.status?.toLowerCase().includes(searchLower)
        );
    });

    const climaIcons: Record<ClimaType, any> = {
        SOL: Sun,
        NUBLADO: Cloud,
        CHUVA_LEVE: CloudRain,
        CHUVA_FORTE: CloudRain,
        TEMPESTADE: CloudRain,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APROVADO': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
            case 'EM_PREENCHIMENTO': return 'bg-amber-500/10 text-amber-600 border-amber-200';
            case 'AGUARDANDO_APROVACAO': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'REJEITADO': return 'bg-red-500/10 text-red-600 border-red-200';
            default: return 'bg-muted';
        }
    };

    const handleEdit = (diario: DiarioObra) => {
        setSelectedDiario(diario);
        setIsModalOpen(true);
    };

    const handleNewRDO = () => {
        setSelectedDiario(undefined);
        setIsModalOpen(true);
    };

    const handleAprovar = (id: string) => {
        updateDiarioObraStatus(id, 'APROVADO');
        toast.success('Diário de Obra aprovado com sucesso!');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Diários de Obra (RDO)</h2>
                    <p className="text-sm text-muted-foreground mt-1">Registro diário completo: atividades, efetivo, clima e materiais.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Buscar RDO..."
                            className="pl-10 rounded-xl bg-background/50 border-border/40"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleNewRDO}
                        className="rounded-xl font-bold text-xs uppercase tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/20 gap-2"
                    >
                        <Plus size={16} /> Novo RDO
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredDiarios.length === 0 ? (
                    <Card className="p-12 text-center rounded-[2rem] border-border/40">
                        <ClipboardList size={48} className="mx-auto mb-4 text-muted-foreground/40" />
                        <h3 className="font-bold text-lg mb-2">Nenhum Diário de Obra encontrado</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            {search ? 'Tente outro termo de busca' : 'Comece criando seu primeiro RDO'}
                        </p>
                        {!search && (
                            <Button onClick={handleNewRDO} className="gap-2">
                                <Plus size={16} /> Criar Primeiro RDO
                            </Button>
                        )}
                    </Card>
                ) : (
                    filteredDiarios.map((rdo, i) => {
                        const IconManha = climaIcons[rdo.climaManha] || Sun;
                        const IconTarde = climaIcons[rdo.climaTarde] || Sun;

                        return (
                            <motion.div
                                key={rdo.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="group p-6 rounded-[2rem] border-border/40 bg-background/60 backdrop-blur-sm hover:border-primary/20 hover:shadow-xl transition-all">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center font-black",
                                                getStatusColor(rdo.status)
                                            )}>
                                                <ClipboardList size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                                        {rdo.project?.nome || 'Obra'}
                                                    </h4>
                                                    <Badge variant="outline" className={cn("text-[10px] font-black uppercase tracking-widest", getStatusColor(rdo.status))}>
                                                        {rdo.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar size={14} /> {new Date(rdo.data).toLocaleDateString('pt-BR')}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Users size={14} /> {rdo.profissionaisPresentes.length} Profissionais
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <FileText size={14} /> {rdo.atividadesExecutadas.length} Atividades
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 justify-between lg:justify-end">
                                            <div className="flex gap-4">
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black uppercase opacity-40 mb-1">Manhã</p>
                                                    <IconManha size={18} className="text-amber-500 mx-auto" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black uppercase opacity-40 mb-1">Tarde</p>
                                                    <IconTarde size={18} className="text-amber-500 mx-auto" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black uppercase opacity-40 mb-1">Temp</p>
                                                    <p className="text-xs font-bold">{rdo.temperaturaMedia}°C</p>
                                                </div>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[9px] font-black uppercase opacity-40 mb-1">Submetido por</p>
                                                <p className="text-xs font-bold">{rdo.responsavel}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {rdo.status === 'AGUARDANDO_APROVACAO' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="rounded-xl text-emerald-600 hover:bg-emerald-50"
                                                        onClick={() => handleAprovar(rdo.id)}
                                                    >
                                                        <CheckCircle size={20} />
                                                    </Button>
                                                )}
                                                {rdo.status !== 'APROVADO' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="rounded-xl hover:bg-primary hover:text-white transition-all"
                                                        onClick={() => handleEdit(rdo)}
                                                    >
                                                        <Edit size={20} />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted transition-all">
                                                    <Eye size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })
                )}
            </div>

            <DiarioObraModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedDiario(undefined);
                }}
                diario={selectedDiario}
            />
        </div>
    );
}
