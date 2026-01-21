import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Plus,
    Building2,
    Mail,
    Shield,
    MoreVertical,
    MapPin,
    FileCheck,
    Phone,
    UserCheck,
    Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Client, DashboardTab } from '@/types';
import { getApiUrl } from '@/lib/api';

// Helper components for consistency
const Separator = () => <div className="h-px bg-border/50 w-full" />;
const ZapIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
);

export function ClientesDashboard({ onTabChange }: { onTabChange: (tab: DashboardTab) => void }) {
    const [clients, setClients] = useState<Client[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        tipo: 'PF',
        documento: '',
        rgIe: '',
        contatos: JSON.stringify({ telefone: '', whatsapp: '', email: '' }),
        enderecoCompleto: '',
        representacao: JSON.stringify({ equatorial: { validade: '', anexoUrl: '' }, saneago: { validade: '', anexoUrl: '' } }),
        configOrgaos: JSON.stringify({ prefeitura: true, condominio: false, suderv: false })
    });

    const [contactData, setContactData] = useState({ telefone: '', whatsapp: '', email: '' });
    const [procurationData, setProcurationData] = useState({
        equatorial: { validade: '', anexoUrl: '' },
        saneago: { validade: '', anexoUrl: '' }
    });

    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch(getApiUrl('/api/clients'));
            if (res.ok) setClients(await res.json());
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async () => {
        if (!formData.nome) return toast.error('O nome do cliente é obrigatório');
        setIsSaving(true);

        const finalData = {
            ...formData,
            contatos: JSON.stringify(contactData),
            representacao: JSON.stringify(procurationData)
        };

        try {
            const res = await fetch(getApiUrl('/api/clients'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });

            if (res.ok) {
                toast.success('Cliente cadastrado com sucesso!');
                setIsModalOpen(false);
                resetForm();
                fetchClients();
            }
        } catch (e) {
            toast.error('Erro ao salvar cliente');
        } finally {
            setIsSaving(false);
        }
    };

    const resetForm = () => {
        setFormData({
            nome: '',
            tipo: 'PF',
            documento: '',
            rgIe: '',
            contatos: JSON.stringify({ telefone: '', whatsapp: '', email: '' }),
            enderecoCompleto: '',
            representacao: JSON.stringify({ equatorial: { validade: '', anexoUrl: '' }, saneago: { validade: '', anexoUrl: '' } }),
            configOrgaos: JSON.stringify({ prefeitura: true, condominio: false, suderv: false })
        });
        setContactData({ telefone: '', whatsapp: '', email: '' });
        setProcurationData({
            equatorial: { validade: '', anexoUrl: '' },
            saneago: { validade: '', anexoUrl: '' }
        });
    };

    if (selectedClient) {
        return (
            <div className="p-4 lg:p-10 h-full flex flex-col bg-background animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" onClick={() => setSelectedClient(null)} className="rounded-xl h-10 px-4 gap-2 font-bold bg-secondary/50">
                        <Plus className="rotate-45" size={18} /> Voltar à Lista
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">{selectedClient.nome}</h1>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{selectedClient.tipo} · {selectedClient.documento}</p>
                    </div>
                </div>

                <Tabs defaultValue="dados" className="flex-1 flex flex-col">
                    <TabsList className="w-full justify-start h-12 bg-transparent border-b border-border/40 rounded-none p-0 gap-6">
                        <TabsTrigger value="dados" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent font-bold text-xs uppercase tracking-widest px-1">Dados Gerais</TabsTrigger>
                        <TabsTrigger value="docs" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent font-bold text-xs uppercase tracking-widest px-1">Documentos do Cliente</TabsTrigger>
                        <TabsTrigger value="procuras" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent font-bold text-xs uppercase tracking-widest px-1">Procurações e Autorizações</TabsTrigger>
                        <TabsTrigger value="concessionarias" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent font-bold text-xs uppercase tracking-widest px-1">Concessionárias e Órgãos</TabsTrigger>
                        <TabsTrigger value="obras" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent font-bold text-xs uppercase tracking-widest px-1">Obras Vinculadas</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 py-8">
                        <TabsContent value="dados" className="mt-0 outline-none">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card className="rounded-[2rem] border-border/40 shadow-sm">
                                    <CardHeader><CardTitle className="text-base font-black uppercase tracking-widest opacity-50">Informações Institucionais</CardTitle></CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Tipo de Pessoa</p>
                                                <p className="font-bold">{selectedClient.tipo}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">{selectedClient.tipo === 'PF' ? 'CPF' : 'CNPJ'}</p>
                                                <p className="font-bold">{selectedClient.documento || '---'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">RG / Inscrição Estadual</p>
                                            <p className="font-bold">{selectedClient.rgIe || '---'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Endereço de Faturamento</p>
                                            <p className="font-bold text-sm">{selectedClient.enderecoCompleto || 'Endereço não cadastrado'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-[2rem] border-border/40 shadow-sm">
                                    <CardHeader><CardTitle className="text-base font-black uppercase tracking-widest opacity-50">Canais de Relacionamento</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        {(function () {
                                            try {
                                                if (!selectedClient.contatos) return null;
                                                const contacts = JSON.parse(selectedClient.contatos);
                                                return (
                                                    <>
                                                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/30 border border-border/50">
                                                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><Mail size={18} /></div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-muted-foreground uppercase">E-mail</p>
                                                                <p className="font-bold text-sm">{contacts.email || '---'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/30 border border-border/50">
                                                            <div className="w-10 h-10 rounded-xl bg-green-500/5 flex items-center justify-center text-green-600"><Phone size={18} /></div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-muted-foreground uppercase">WhatsApp</p>
                                                                <p className="font-bold text-sm">{contacts.whatsapp || '---'}</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            } catch (e) {
                                                return <p className="text-sm font-bold p-4">{selectedClient.contatos}</p>;
                                            }
                                        })()}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="docs" className="mt-0 outline-none">
                            <Card className="rounded-[2rem] border-border/40 min-h-[400px] flex items-center justify-center border-dashed">
                                <div className="text-center">
                                    <FileCheck size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                                    <p className="text-muted-foreground font-bold italic tracking-tight">Módulo de Repositório de Documentos do Cliente</p>
                                    <Button variant="outline" className="mt-4 rounded-xl font-bold">Upload de Documento Legal</Button>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="procuras" className="mt-0 outline-none">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {selectedClient.representacao && (function () {
                                    try {
                                        const representation = JSON.parse(selectedClient.representacao);
                                        return Object.entries(representation).map(([key, data]: [string, any]) => (
                                            <Card key={key} className="rounded-[2rem] border-border/40 overflow-hidden">
                                                <div className="p-6 bg-secondary/20 border-b border-border/40 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Shield size={20} className="text-primary" />
                                                        <h3 className="font-black text-[13px] uppercase tracking-widest">{key}</h3>
                                                    </div>
                                                    <Badge variant={data.validade && new Date(data.validade) > new Date() ? 'secondary' : 'destructive'} className="text-[9px]">
                                                        {data.validade && new Date(data.validade) > new Date() ? 'VÁLIDA' : 'VENCIDA'}
                                                    </Badge>
                                                </div>
                                                <CardContent className="p-6">
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="font-bold opacity-60">Validade</span>
                                                            <span className="font-black">{data.validade ? new Date(data.validade).toLocaleDateString('pt-BR') : '---'}</span>
                                                        </div>
                                                        <Button variant="outline" className="w-full rounded-xl gap-2 font-bold text-xs h-10 border-dashed">
                                                            <Upload size={14} /> Substituir Documento
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ));
                                    } catch (e) {
                                        return <p className="p-4 text-sm text-muted-foreground">Dados de representação inválidos</p>;
                                    }
                                })()}
                            </div>
                        </TabsContent>

                        <TabsContent value="obras" className="mt-0 outline-none">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Placeholder for linked obras */}
                                <div className="p-10 text-center border-2 border-dashed border-border/40 rounded-[2rem] col-span-full">
                                    <Building2 size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                                    <p className="text-muted-foreground font-medium">Buscando obras vinculadas...</p>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-secondary/5 to-background overflow-hidden">
            {/* Standard Header */}
            <div className="p-4 lg:p-6 border-b bg-background/95 backdrop-blur-sm shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestão de Contratantes</h1>
                        <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest font-medium opacity-60">Base de contratantes e parceiros comerciais</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                            <Input placeholder="Buscar contratante..." className="pl-9 h-10 w-64 text-sm rounded-lg bg-background/50" />
                        </div>
                        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
                            <Plus size={16} />
                            Novo Contratante
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8 scrollbar-thin">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {clients.map((client, i) => (
                        <motion.div
                            key={client.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="rounded-[2rem] border-border/40 shadow-2xl shadow-black/5 bg-background/60 backdrop-blur-xl hover:border-primary/40 transition-all group overflow-hidden border-t border-l">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/10 flex items-center justify-center text-primary font-bold text-2xl shadow-inner">
                                                {client.nome.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg tracking-tight truncate max-w-[150px]">{client.nome}</h3>
                                                    <Badge variant="outline" className="text-[9px] uppercase font-black tracking-tighter h-5">
                                                        {client.tipo}
                                                    </Badge>
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                    {client.documento || 'DOC NÃO INFORMADO'}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5">
                                            <MoreVertical size={18} />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="p-3 rounded-xl bg-secondary/30 border border-border/50">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Contato Principal</p>
                                            <p className="text-xs font-semibold truncate">
                                                {(function () {
                                                    try {
                                                        const contacts = client.contatos ? JSON.parse(client.contatos) : {};
                                                        return contacts.email || contacts.telefone || 'N/A';
                                                    } catch (e) {
                                                        return client.contatos || 'N/A';
                                                    }
                                                })()}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-secondary/30 border border-border/50">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Status Legal</p>
                                            <div className="flex items-center gap-1 text-green-600 font-bold text-[10px]">
                                                <Shield size={10} /> REGULAR
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => setSelectedClient(client)}
                                        className="w-full h-12 rounded-2xl bg-secondary hover:bg-primary hover:text-white font-bold transition-all shadow-lg hover:shadow-primary/30"
                                    >
                                        Acessar Registro Completo
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="rounded-[2.5rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
                        <div className="p-8 bg-gradient-to-r from-primary/5 to-purple-500/5 border-b border-border/50">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-black tracking-tighter">Novo Cliente VERCFLOW</DialogTitle>
                            </DialogHeader>
                        </div>

                        <Tabs defaultValue="base" className="w-full">
                            <div className="px-8 mt-4">
                                <TabsList className="grid w-full grid-cols-3 rounded-xl h-12 bg-secondary/50">
                                    <TabsTrigger value="base" className="rounded-lg font-bold text-xs uppercase tracking-widest">Base</TabsTrigger>
                                    <TabsTrigger value="contato" className="rounded-lg font-bold text-xs uppercase tracking-widest">Contato</TabsTrigger>
                                    <TabsTrigger value="procuras" className="rounded-lg font-bold text-xs uppercase tracking-widest">Procurações</TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="p-8 max-h-[60vh] overflow-y-auto">
                                <TabsContent value="base" className="mt-0 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Tipo de Cliente</Label>
                                            <Select value={formData.tipo} onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
                                                <SelectTrigger className="h-12 rounded-xl">
                                                    <SelectValue placeholder="Tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PF">Pessoa Física</SelectItem>
                                                    <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                                                {formData.tipo === 'PF' ? 'CPF' : 'CNPJ'}
                                            </Label>
                                            <Input
                                                placeholder="Documento"
                                                value={formData.documento}
                                                onChange={e => setFormData({ ...formData, documento: e.target.value })}
                                                className="h-12 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Razão Social / Nome Completo</Label>
                                        <Input
                                            placeholder="Nome oficial para contratos"
                                            value={formData.nome}
                                            onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">RG / IE</Label>
                                            <Input
                                                placeholder="Identidade"
                                                value={formData.rgIe}
                                                onChange={e => setFormData({ ...formData, rgIe: e.target.value })}
                                                className="h-12 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Órgãos Vinculados</Label>
                                            <div className="flex gap-2">
                                                <Badge variant="outline" className="h-8 rounded-lg cursor-pointer hover:bg-primary/10">Prefeitura</Badge>
                                                <Badge variant="secondary" className="h-8 rounded-lg cursor-pointer bg-green-500/10 text-green-700 border-green-200">Condomínio</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mt-4">
                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                                            <Shield className="text-amber-500" size={12} /> Prerequisitos das Listas
                                        </p>
                                        <p className="text-[11px] text-muted-foreground mt-1">
                                            O cadastro de <span className="font-bold text-foreground">Procurações</span> e <span className="font-bold text-foreground">Órgãos</span> é obrigatório para a liberação das Listas 2.x (Aprovações) e 14.x (Materiais).
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="contato" className="mt-0 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1">E-mail Principal</Label>
                                        <Input
                                            placeholder="exemplo@verc.com.br"
                                            value={contactData.email}
                                            onChange={e => setContactData({ ...contactData, email: e.target.value })}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Telefone</Label>
                                            <Input
                                                placeholder="(00) 0000-0000"
                                                value={contactData.telefone}
                                                onChange={e => setContactData({ ...contactData, telefone: e.target.value })}
                                                className="h-12 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">WhatsApp</Label>
                                            <Input
                                                placeholder="(00) 90000-0000"
                                                value={contactData.whatsapp}
                                                onChange={e => setContactData({ ...contactData, whatsapp: e.target.value })}
                                                className="h-12 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Endereço Completo</Label>
                                        <Input
                                            placeholder="Rua, Número, Complemento, Bairro, Cidade, UF"
                                            value={formData.enderecoCompleto}
                                            onChange={e => setFormData({ ...formData, enderecoCompleto: e.target.value })}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="procuras" className="mt-0 space-y-6">
                                    <Card className="rounded-2xl border-dashed border-2 bg-secondary/10">
                                        <CardContent className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                                        <ZapIcon size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">Equatorial Energia</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-black">Digital e Física</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="date"
                                                        className="h-9 w-32 rounded-lg text-xs"
                                                        value={procurationData.equatorial.validade}
                                                        onChange={e => setProcurationData({ ...procurationData, equatorial: { ...procurationData.equatorial, validade: e.target.value } })}
                                                    />
                                                    <Button size="icon" variant="outline" className="h-9 w-9 rounded-lg"><Upload size={14} /></Button>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600">
                                                        <Shield size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">Saneago</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-black">Água e Esgoto</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="date"
                                                        className="h-9 w-32 rounded-lg text-xs"
                                                        value={procurationData.saneago.validade}
                                                        onChange={e => setProcurationData({ ...procurationData, saneago: { ...procurationData.saneago, validade: e.target.value } })}
                                                    />
                                                    <Button size="icon" variant="outline" className="h-9 w-9 rounded-lg"><Upload size={14} /></Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </div>
                        </Tabs>

                        <div className="p-8 bg-secondary/20 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6 font-bold uppercase text-[10px] tracking-widest">Cancelar</Button>
                            <Button onClick={handleSave} disabled={isSaving} className="rounded-xl h-12 px-10 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20">
                                {isSaving ? 'Processando...' : 'Finalizar Cadastro'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default ClientesDashboard;
