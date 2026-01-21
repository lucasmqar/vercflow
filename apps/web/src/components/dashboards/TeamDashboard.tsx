import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    Briefcase,
    Plus,
    Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DashboardTab } from '@/types';

export function TeamDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [activeType, setActiveType] = useState<'ALL' | 'INTERNO' | 'EXTERNO'>('ALL');
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        nome: '',
        tipo: 'INTERNO',
        documento: '',
        contatos: ''
    });

    useEffect(() => {
        fetchProfessionals();
    }, []);

    const fetchProfessionals = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/professionals');
            if (res.ok) setProfessionals(await res.json());
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async () => {
        if (!formData.nome) {
            toast.error('O nome é obrigatório');
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('http://localhost:4000/api/professionals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success('Profissional cadastrado com sucesso!');
                setIsModalOpen(false);
                setFormData({ nome: '', tipo: 'INTERNO', documento: '', contatos: '' });
                fetchProfessionals();
            }
        } catch (e) {
            toast.error('Erro ao salvar profissional');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredProfessionals = professionals.filter(p =>
        activeType === 'ALL' || p.tipo === activeType
    );

    return (
        <div className="p-4 lg:p-10 h-[calc(100vh-64px)] flex flex-col bg-secondary/10 overflow-y-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter">Equipe & Profissionais</h1>
                    <p className="text-muted-foreground font-medium">Gestão de colaboradores internos e prestadores externos</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-2xl h-12 px-6 gap-2 font-bold shadow-lg shadow-primary/20"
                >
                    <Plus size={20} /> Adicionar Profissional
                </Button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Buscar por nome, especialidade ou documento..." className="pl-12 h-12 rounded-2xl bg-background shadow-sm border-border/50" />
                </div>
                <div className="flex p-1 bg-secondary/50 rounded-2xl border">
                    <button
                        onClick={() => setActiveType('ALL')}
                        className={cn("px-4 py-2 text-xs font-bold rounded-xl transition-all", activeType === 'ALL' ? "bg-background shadow-sm text-primary" : "text-muted-foreground")}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setActiveType('INTERNO')}
                        className={cn("px-4 py-2 text-xs font-bold rounded-xl transition-all", activeType === 'INTERNO' ? "bg-background shadow-sm text-primary" : "text-muted-foreground")}
                    >
                        Internos
                    </button>
                    <button
                        onClick={() => setActiveType('EXTERNO')}
                        className={cn("px-4 py-2 text-xs font-bold rounded-xl transition-all", activeType === 'EXTERNO' ? "bg-background shadow-sm text-primary" : "text-muted-foreground")}
                    >
                        Externos
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProfessionals.map((prof, i) => (
                    <motion.div
                        key={prof.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card className="rounded-3xl border-border/50 shadow-xl shadow-black/5 bg-background hover:border-primary/30 transition-all group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-14 h-14 border-2 border-primary/10 rounded-2xl">
                                            <AvatarFallback className="bg-primary/5 text-primary text-lg font-bold">
                                                {prof.nome.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold tracking-tight">{prof.nome}</h3>
                                            <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                                                <Briefcase size={12} /> {prof.tipo === 'INTERNO' ? 'Equipe VERC' : 'Prestador Externo'}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge className={cn(
                                        "border-none uppercase text-[9px] font-bold",
                                        prof.tipo === 'INTERNO' ? "bg-blue-500/10 text-blue-600" : "bg-orange-500/10 text-orange-600"
                                    )}>
                                        {prof.tipo}
                                    </Badge>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail size={14} className="opacity-60" />
                                        <span className="font-medium truncate">{prof.contatos || 'Sem contato'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Shield size={14} className="opacity-60" />
                                        <span className="font-medium">{prof.documento || 'Sem registro'}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tarefas Ativas</p>
                                        <p className="font-bold">{(prof.assignments || []).length.toString().padStart(2, '0')}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="rounded-xl text-primary font-bold">Ver Perfil</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Registration Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="rounded-[2rem] max-w-lg p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tighter">Novo Profissional</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Nome Completo</Label>
                            <Input
                                placeholder="Ex: João da Silva"
                                className="h-12 rounded-2xl"
                                value={formData.nome}
                                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Tipo</Label>
                                <Select
                                    value={formData.tipo}
                                    onValueChange={v => setFormData({ ...formData, tipo: v })}
                                >
                                    <SelectTrigger className="h-12 rounded-2xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="INTERNO">Interno</SelectItem>
                                        <SelectItem value="EXTERNO">Externo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Documento (CPF/CNPJ)</Label>
                                <Input
                                    placeholder="000.000.000-00"
                                    className="h-12 rounded-2xl"
                                    value={formData.documento}
                                    onChange={e => setFormData({ ...formData, documento: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Contatos (Email/Tel)</Label>
                            <Input
                                placeholder="email@exemplo.com"
                                className="h-12 rounded-2xl"
                                value={formData.contatos}
                                onChange={e => setFormData({ ...formData, contatos: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                            className="rounded-2xl h-12 font-bold"
                        >
                            Cancelar
                        </Button>
                        <Button
                            disabled={isSaving}
                            onClick={handleSave}
                            className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20"
                        >
                            {isSaving ? 'Salvando...' : 'Cadastrar Profissional'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
