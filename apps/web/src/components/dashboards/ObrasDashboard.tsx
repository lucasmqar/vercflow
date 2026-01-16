import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Users,
  BarChart3,
  Calendar,
  Plus,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, Client } from '@/types';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ObrasDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', endereco: '', clientId: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('http://localhost:4000/api/projects'),
        fetch('http://localhost:4000/api/clients')
      ]);
      if (pRes.ok) setProjects(await pRes.json());
      if (cRes.ok) setClients(await cRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async () => {
    if (!formData.nome || !formData.clientId) return toast.error('Nome e Cliente são obrigatórios');
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:4000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Obra cadastrada com sucesso!');
        setIsModalOpen(false);
        setFormData({ nome: '', endereco: '', clientId: '' });
        fetchData();
      }
    } catch (e) {
      toast.error('Erro ao cadastrar obra');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 lg:p-10 h-[calc(100vh-64px)] flex flex-col bg-secondary/10 overflow-y-auto custom-scrollbar">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Obras & Projetos</h1>
          <p className="text-muted-foreground font-medium">Gestão centralizada de ativos e cronogramas</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl h-12 px-6 gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus size={20} /> Nova Obra
        </Button>
      </div>

      {/* Modern Search */}
      <div className="relative max-w-xl mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input placeholder="Buscar obra por nome ou localização..." className="pl-12 h-14 rounded-2xl bg-background border-border/50 shadow-xl shadow-black/5" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        {projects.map((proj) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="rounded-[40px] border-border/50 shadow-2xl shadow-black/5 bg-background overflow-hidden hover:border-primary/30 transition-all cursor-pointer group">
              <div className="aspect-[16/10] bg-secondary/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-success text-white border-none h-6 px-3 rounded-full font-bold">ATIVO</Badge>
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold tracking-tight">{proj.nome}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-medium opacity-80 mt-1">
                    <MapPin size={12} />
                    <span>{proj.endereco || 'Endereço não definido'}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Cliente</p>
                    <Building2 className="mx-auto text-primary mb-1" size={20} />
                    <p className="text-[10px] font-bold truncate">{proj.client?.nome || 'N/A'}</p>
                  </div>
                  <div className="text-center border-x px-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                    <BarChart3 className="mx-auto text-primary mb-1" size={20} />
                    <p className="text-sm font-bold">Início</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Atividades</p>
                    <CheckCircle2 className="mx-auto text-primary mb-1" size={20} />
                    <p className="text-sm font-bold">0</p>
                  </div>
                </div>

                <Button className="w-full h-12 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-bold group-hover:bg-primary group-hover:text-white transition-all">
                  Gerenciar Obra
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Nova Obra Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-[2.5rem] p-8 max-w-md border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tighter">Cadastrar Nova Obra</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest ml-1">Nome do Projeto/Obra</label>
              <Input
                placeholder="Ex: Edifício Horizonte"
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest ml-1">Endereço</label>
              <Input
                placeholder="Ex: Av. Paulista, 1000"
                value={formData.endereco}
                onChange={e => setFormData({ ...formData, endereco: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest ml-1">Cliente Solicitante</label>
              <Select value={formData.clientId} onValueChange={id => setFormData({ ...formData, clientId: id })}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Selecione o Cliente" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {clients.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-3 sm:justify-center">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Cancelar</Button>
            <Button onClick={handleCreate} disabled={isSaving} className="rounded-xl h-12 px-8 font-bold text-white shadow-lg shadow-primary/20">
              {isSaving ? 'Salvando...' : 'Criar Projeto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

