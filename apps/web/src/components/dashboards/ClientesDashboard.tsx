import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Plus,
    Building2,
    Mail,
    Shield,
    MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Client } from '@/types';

export function ClientesDashboard() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ nome: '', documento: '', contatos: '' });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/clients');
            if (res.ok) setClients(await res.json());
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async () => {
        if (!formData.nome) return toast.error('O nome do cliente é obrigatório');
        setIsSaving(true);
        try {
            const res = await fetch('http://localhost:4000/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success('Cliente cadastrado com sucesso!');
                setIsModalOpen(false);
                setFormData({ nome: '', documento: '', contatos: '' });
                fetchClients();
            }
        } catch (e) {
            toast.error('Erro ao salvar cliente');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-4 lg:p-10 h-[calc(100vh-64px)] flex flex-col bg-secondary/10 overflow-y-auto custom-scrollbar">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter">Gestão de Clientes</h1>
                    <p className="text-muted-foreground font-medium">Base de contratantes e parceiros comerciais</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl h-12 px-6 gap-2 font-bold shadow-lg shadow-primary/20">
                    <Plus size={20} /> Novo Cliente
                </Button>
            </div>

            <div className="relative max-w-xl mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Buscar cliente por nome ou CNPJ..." className="pl-12 h-14 rounded-2xl bg-background border-border/50 shadow-xl shadow-black/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {clients.map((client, i) => (
                    <motion.div
                        key={client.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card className="rounded-3xl border-border/50 shadow-xl shadow-black/5 bg-background hover:border-primary/30 transition-all group overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                            {client.nome.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold tracking-tight">{client.nome}</h3>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{client.documento || 'CNPJ NÃO INFORMADO'}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-xl">
                                        <MoreVertical size={18} />
                                    </Button>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail size={14} className="opacity-60" />
                                        <span className="font-medium truncate">{client.contatos || 'Sem e-mail cadastrado'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Building2 size={14} className="opacity-60" />
                                        <span className="font-medium">Ativo no VERCFLOW</span>
                                    </div>
                                </div>

                                <Button className="w-full h-11 rounded-xl bg-secondary hover:bg-primary hover:text-white font-bold transition-all">
                                    Ver Portfólio de Obras
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="rounded-[2rem] max-w-md p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tighter">Cadastrar Cliente</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Razão Social / Nome</Label>
                            <Input
                                placeholder="Ex: Construtora Horizonte S.A"
                                value={formData.nome}
                                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">CNPJ / CPF</Label>
                            <Input
                                placeholder="00.000.000/0001-00"
                                value={formData.documento}
                                onChange={e => setFormData({ ...formData, documento: e.target.value })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Contatos Corporativos</Label>
                            <Input
                                placeholder="email@cliente.com.br"
                                value={formData.contatos}
                                onChange={e => setFormData({ ...formData, contatos: e.target.value })}
                                className="h-12 rounded-xl"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancelar</Button>
                        <Button onClick={handleSave} disabled={isSaving} className="rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/20">
                            {isSaving ? 'Salvando...' : 'Salvar Cliente'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
