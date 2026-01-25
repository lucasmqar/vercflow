"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ChevronRight, ChevronLeft,
    CheckCircle2, User, Building, FileText,
    ShieldCheck, ArrowRight, MapPin, Phone, Mail, CreditCard,
    Plus, Trash2, Upload, AlertCircle, HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAppFlow } from '@/store/useAppFlow';
import { toast } from 'sonner';
import { Client, ClientAddress, ClientDocument } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ClientWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ClientWizard({ isOpen, onClose }: ClientWizardProps) {
    const [step, setStep] = useState(1);
    const { addClient } = useAppFlow();

    // -- STATE --
    const [clientData, setClientData] = useState<Omit<Client, 'id' | 'criadoEm' | 'ativo' | 'docStatus'>>({
        nome: '',
        tipo: 'PJ',
        documento: '',
        razaoSocial: '',
        nomeFantasia: '',
        email: '',
        contatos: '',
        enderecos: [
            { id: uuidv4(), tipo: 'PRINCIPAL', logradouro: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' }
        ],
        documentosAnexos: [],
        responsavelLegal: '',
        cpfResponsavel: '',
        fiscal: {
            regimeTributario: 'SIMPLES_NACIONAL',
            inscricaoEstadual: '',
            inscricaoMunicipal: '',
            isentoIE: false
        }
    });

    const updateData = (key: string, value: any) => {
        if (key.startsWith('fiscal.')) {
            const fiscalKey = key.split('.')[1];
            setClientData(prev => ({
                ...prev,
                fiscal: { ...(prev.fiscal || {}), [fiscalKey]: value }
            }));
        } else {
            setClientData(prev => ({ ...prev, [key]: value }));
        }
    };

    const handleAddAddress = () => {
        setClientData(prev => ({
            ...prev,
            enderecos: [
                ...prev.enderecos,
                { id: uuidv4(), tipo: 'OUTRO', logradouro: '', numero: '', bairro: '', cidade: '', estado: '', cep: '' }
            ]
        }));
    };

    const handleRemoveAddress = (id: string) => {
        if (clientData.enderecos.length === 1) return;
        setClientData(prev => ({
            ...prev,
            enderecos: prev.enderecos.filter(a => a.id !== id)
        }));
    };

    const updateAddress = (index: number, field: keyof ClientAddress, value: string) => {
        const newAddresses = [...clientData.enderecos];
        newAddresses[index] = { ...newAddresses[index], [field]: value };
        setClientData(prev => ({ ...prev, enderecos: newAddresses }));
    };

    const handleFileUpload = (tipo: ClientDocument['tipo']) => {
        // Simulating upload for UI demonstration
        const newDoc: ClientDocument = {
            id: uuidv4(),
            tipo,
            nome: `${tipo}_${clientData.nome.replace(/\s/g, '_')}.pdf`,
            url: '#',
            dataUpload: new Date().toISOString()
        };

        setClientData(prev => ({
            ...prev,
            documentosAnexos: [...prev.documentosAnexos, newDoc]
        }));
        toast(`Documento ${tipo} simulado com sucesso.`);
    };

    const handleComplete = () => {
        if (!clientData.nome || !clientData.documento) {
            toast.error("Nome e Documento são obrigatórios.");
            return;
        }

        const isDocComplete = clientData.documentosAnexos.length >= 2; // Arbitrary rule for demo

        addClient({
            ...clientData,
            ativo: true,
            docStatus: isDocComplete ? 'COMPLETO' : 'PENDENTE'
        });

        toast.success("Cliente Cadastrado com Sucesso!");
        onClose();
        setStep(1);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 lg:p-6 overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                layoutId="client-wizard-container"
                className="relative w-full max-w-6xl h-[90vh] bg-background rounded-xl shadow-2xl overflow-hidden border border-border/20 flex flex-col lg:flex-row"
            >
                {/* LEFT: Context */}
                <div className="w-full lg:w-1/4 bg-muted/10 border-r border-border/10 p-8 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent" />
                    <Badge variant="outline" className="w-fit mb-6 border-emerald-500/20 text-emerald-500 font-black">CRM PREMIUM</Badge>

                    <div className="space-y-6 mt-4">
                        {[
                            { id: 1, label: 'Identificação', icon: User },
                            { id: 2, label: 'Fiscal & PJ', icon: CreditCard },
                            { id: 3, label: 'Endereços', icon: MapPin },
                            { id: 4, label: 'Responsáveis', icon: ShieldCheck },
                            { id: 5, label: 'Documentação', icon: HardDrive },
                            { id: 6, label: 'Review', icon: CheckCircle2 }
                        ].map((s) => (
                            <div key={s.id} className={cn("flex items-center gap-4 transition-all", step === s.id ? "opacity-100 translate-x-1" : "opacity-40")}>
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", step === s.id ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20" : "border-border bg-background")}>
                                    <s.icon size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Etapa {s.id}</span>
                                    <span className="font-bold text-xs">{s.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle size={14} className="text-emerald-600" />
                            <span className="text-[10px] font-black uppercase text-emerald-600">Compliance Check</span>
                        </div>
                        <p className="text-[10px] text-emerald-800/70 font-medium leading-relaxed">
                            Clientes com documentação pendente serão marcados com a tag <Badge variant="destructive" className="h-3 text-[8px] px-1">DOC_PENDENTE</Badge> e terão limitações em faturamento.
                        </p>
                    </div>
                </div>

                {/* RIGHT: Form */}
                <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                        <AnimatePresence mode="wait">

                            {/* STEP 1: IDENTIFICAÇÃO */}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto space-y-10">
                                    <div className="text-center">
                                        <h2 className="text-4xl font-black tracking-tighter mb-2 italic">Identificação de Clientela</h2>
                                        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Defina a personalidade jurídica do parceiro.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            onClick={() => updateData('tipo', 'PJ')}
                                            className={cn("p-8 rounded-xl border-2 cursor-pointer transition-all text-center group", clientData.tipo === 'PJ' ? "border-emerald-500 bg-emerald-500/5 shadow-inner" : "border-border/10 hover:border-emerald-500/30")}
                                        >
                                            <Building size={32} className={cn("mx-auto mb-4", clientData.tipo === 'PJ' ? "text-emerald-600" : "text-muted-foreground")} />
                                            <span className={cn("font-black tracking-tighter uppercase", clientData.tipo === 'PJ' ? "text-emerald-700" : "text-muted-foreground")}>Pessoa Jurídica</span>
                                        </div>
                                        <div
                                            onClick={() => updateData('tipo', 'PF')}
                                            className={cn("p-8 rounded-xl border-2 cursor-pointer transition-all text-center group", clientData.tipo === 'PF' ? "border-emerald-500 bg-emerald-500/5 shadow-inner" : "border-border/10 hover:border-emerald-500/30")}
                                        >
                                            <User size={32} className={cn("mx-auto mb-4", clientData.tipo === 'PF' ? "text-emerald-600" : "text-muted-foreground")} />
                                            <span className={cn("font-black tracking-tighter uppercase", clientData.tipo === 'PF' ? "text-emerald-700" : "text-muted-foreground")}>Pessoa Física</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground ml-1 mb-2 block">Nome Principal (Exibição no Sistema)</Label>
                                            <Input
                                                value={clientData.nome}
                                                onChange={e => updateData('nome', e.target.value)}
                                                className="h-16 text-2xl font-black bg-muted/5 border-border/20 rounded-2xl px-6 focus:ring-emerald-500"
                                                placeholder="Sleek Dev Inc."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground ml-1 mb-2 block">{clientData.tipo === 'PJ' ? 'CNPJ' : 'CPF'}</Label>
                                                <Input
                                                    value={clientData.documento}
                                                    onChange={e => updateData('documento', e.target.value)}
                                                    className="h-12 bg-muted/5 border-border/20 rounded-xl px-4"
                                                    placeholder="00.000.000/0000-00"
                                                />
                                            </div>
                                            <div>
                                                <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground ml-1 mb-2 block">Canais de Contato</Label>
                                                <Input
                                                    value={clientData.contatos}
                                                    onChange={e => updateData('contatos', e.target.value)}
                                                    className="h-12 bg-muted/5 border-border/20 rounded-xl px-4"
                                                    placeholder="(11) 99999-9999"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: FISCAL */}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto space-y-8">
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-black tracking-tight mb-2">Engrenagem Fiscal</h2>
                                        <p className="text-muted-foreground text-sm">Dados fundamentais para a emissão de Notas Fiscais de Serviço (NFS-e).</p>
                                    </div>

                                    {clientData.tipo === 'PJ' ? (
                                        <div className="grid grid-cols-1 gap-8">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="col-span-2">
                                                    <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground mb-2 block">Razão Social Completa</Label>
                                                    <Input
                                                        value={clientData.razaoSocial}
                                                        onChange={e => updateData('razaoSocial', e.target.value)}
                                                        className="h-12 bg-muted/5 border-border/20 rounded-xl"
                                                        placeholder="NOME EMPRESARIAL LTDA"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground mb-2 block">Incrição Estadual</Label>
                                                    <Input
                                                        value={clientData.fiscal?.inscricaoEstadual}
                                                        onChange={e => updateData('fiscal.inscricaoEstadual', e.target.value)}
                                                        className="h-12 bg-muted/5 border-border/20 rounded-xl"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground mb-2 block">Regime Tributário</Label>
                                                    <select
                                                        className="w-full h-12 rounded-xl bg-muted/5 border border-border/20 px-4 text-sm font-bold"
                                                        value={clientData.fiscal?.regimeTributario}
                                                        onChange={e => updateData('fiscal.regimeTributario', e.target.value)}
                                                    >
                                                        <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                                                        <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                                                        <option value="LUCRO_REAL">Lucro Real</option>
                                                        <option value="MEI">MEI</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Card className="p-12 border-dashed border-2 flex flex-col items-center justify-center text-center space-y-4">
                                            <CreditCard size={48} className="text-muted-foreground/30" />
                                            <p className="text-muted-foreground font-medium italic">Como Pessoa Física, os dados fiscais são simplificados e vinculados ao CPF informado na etapa anterior.</p>
                                        </Card>
                                    )}
                                </motion.div>
                            )}

                            {/* STEP 3: ENDEREÇOS (MULTI) */}
                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h2 className="text-3xl font-black tracking-tight mb-2">Gestão de Endereços</h2>
                                            <p className="text-muted-foreground text-sm">Adicione múltiplos endereços (Faturamento, Obra, Sede).</p>
                                        </div>
                                        <Button
                                            onClick={handleAddAddress}
                                            variant="outline"
                                            className="rounded-xl border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/5 font-black uppercase tracking-widest text-[10px]"
                                        >
                                            <Plus size={14} className="mr-2" /> Adicionar Outro
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {clientData.enderecos.map((addr, idx) => (
                                            <Card key={addr.id} className="p-8 border-border/20 bg-muted/5 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveAddress(addr.id)}
                                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-6 gap-6">
                                                    <div className="col-span-2">
                                                        <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground mb-2 block">Tipo de Endereço</Label>
                                                        <select
                                                            className="w-full h-10 rounded-xl bg-background border border-border/20 px-3 text-xs font-bold"
                                                            value={addr.tipo}
                                                            onChange={e => updateAddress(idx, 'tipo', e.target.value as any)}
                                                        >
                                                            <option value="PRINCIPAL">Principal / Sede</option>
                                                            <option value="COBRANCA">Faturamento / Cobrança</option>
                                                            <option value="OBRA">Endereço da Obra</option>
                                                            <option value="OUTRO">Outro</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-span-3">
                                                        <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground mb-2 block">Logradouro / Rua</Label>
                                                        <Input
                                                            value={addr.logradouro}
                                                            onChange={e => updateAddress(idx, 'logradouro', e.target.value)}
                                                            className="h-10 bg-background"
                                                            placeholder="Av. das Nações"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground mb-2 block">Nº</Label>
                                                        <Input
                                                            value={addr.numero}
                                                            onChange={e => updateAddress(idx, 'numero', e.target.value)}
                                                            className="h-10 bg-background"
                                                        />
                                                    </div>

                                                    <div className="col-span-2">
                                                        <Label className="text-xs">Bairro</Label>
                                                        <Input value={addr.bairro} onChange={e => updateAddress(idx, 'bairro', e.target.value)} className="h-10 bg-background" />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Label className="text-xs">Cidade</Label>
                                                        <Input value={addr.cidade} onChange={e => updateAddress(idx, 'cidade', e.target.value)} className="h-10 bg-background" />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <Label className="text-xs">UF</Label>
                                                        <Input value={addr.estado} onChange={e => updateAddress(idx, 'estado', e.target.value)} className="h-10 bg-background" maxLength={2} />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <Label className="text-xs">CEP</Label>
                                                        <Input value={addr.cep} onChange={e => updateAddress(idx, 'cep', e.target.value)} className="h-10 bg-background" />
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: RESPONSÁVEIS */}
                            {step === 4 && (
                                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto space-y-8">
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-black tracking-tight mb-2">Responsáveis Jurídicos</h2>
                                        <p className="text-muted-foreground text-sm">Designação de quem responde legalmente pela entidade perante os órgãos de engenharia.</p>
                                    </div>

                                    <div className="space-y-6 p-8 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <ShieldCheck size={120} />
                                        </div>

                                        <div>
                                            <Label className="uppercase text-[10px] font-black tracking-widest text-emerald-600 mb-2 block">Nome Completo (Conforme Identidade)</Label>
                                            <Input
                                                value={clientData.responsavelLegal}
                                                onChange={e => updateData('responsavelLegal', e.target.value)}
                                                className="h-12 bg-background border-emerald-500/20"
                                            />
                                        </div>
                                        <div>
                                            <Label className="uppercase text-[10px] font-black tracking-widest text-emerald-600 mb-2 block">CPF do Responsável</Label>
                                            <Input
                                                value={clientData.cpfResponsavel}
                                                onChange={e => updateData('cpfResponsavel', e.target.value)}
                                                className="h-12 bg-background border-emerald-500/20"
                                                placeholder="000.000.000-00"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 5: DOCUMENTAÇÃO */}
                            {step === 5 && (
                                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-8">
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tight mb-2 italic">Dossiê Documental</h2>
                                        <p className="text-muted-foreground text-sm font-bold uppercase tracking-tight">Anexe as provas de existência e representação.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { id: 'RG', label: 'RG / Identidade' },
                                            { id: 'CPF', label: 'CPF / Cartão CPF' },
                                            { id: 'CNPJ', label: 'Cartão CNPJ Atualziado' },
                                            { id: 'CONTRATO_SOCIAL', label: 'Contrato Social / Estatuto' },
                                            { id: 'COMPROVANTE_ENDERECO', label: 'Comprovante de Endereço' },
                                            { id: 'PROCURACAO', label: 'Procuração (Se houver)' }
                                        ].map((doc) => {
                                            const isUploaded = clientData.documentosAnexos.some(d => d.tipo === doc.id);
                                            return (
                                                <div
                                                    key={doc.id}
                                                    className={cn("p-6 rounded-xl border flex items-center justify-between transition-all", isUploaded ? "bg-emerald-500/5 border-emerald-500/40" : "bg-muted/5 border-border/10")}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", isUploaded ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground")}>
                                                            {isUploaded ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm tracking-tight">{doc.label}</h4>
                                                            <p className="text-[10px] text-muted-foreground italic uppercase">{isUploaded ? 'Documento Vinculado' : 'Aguardando Upload'}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant={isUploaded ? "ghost" : "secondary"}
                                                        onClick={() => handleFileUpload(doc.id as any)}
                                                        className="font-black text-[10px] uppercase tracking-widest px-4"
                                                    >
                                                        {isUploaded ? 'Alterar' : 'Upload'}
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="p-4 bg-muted/20 border border-dashed border-border/40 rounded-2xl flex gap-3 text-muted-foreground">
                                        <HardDrive size={18} />
                                        <p className="text-[10px] font-medium leading-relaxed italic uppercase">Os arquivos anexados ficam armazenados no cofre digital de documentos do VERCFLOW v2.0 com criptografia E2E.</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 6: REVISÃO FINAL */}
                            {step === 6 && (
                                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-8">
                                    <div className="text-center">
                                        <CheckCircle2 size={64} className="mx-auto text-emerald-500 mb-4" />
                                        <h2 className="text-4xl font-black tracking-tighter mb-2">Conclusão de Cadastro</h2>
                                        <p className="text-muted-foreground">Revise os pontos críticos antes de efetivar.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <Card className="p-8 border-emerald-500/20 bg-emerald-500/5 flex flex-col justify-between">
                                            <div>
                                                <Badge className="bg-emerald-500 mb-4">IDENTIFICAÇÃO</Badge>
                                                <h3 className="text-2xl font-black mb-1">{clientData.nome}</h3>
                                                <p className="text-sm text-muted-foreground">{clientData.tipo} | {clientData.documento}</p>
                                            </div>
                                            <div className="mt-8 pt-8 border-t border-emerald-500/10">
                                                <p className="text-[10px] uppercase font-black text-emerald-600 mb-2">Endereço Principal</p>
                                                <p className="text-xs font-bold">{clientData.enderecos[0].logradouro}, {clientData.enderecos[0].numero}</p>
                                                <p className="text-xs text-muted-foreground">{clientData.enderecos[0].cidade} - {clientData.enderecos[0].estado}</p>
                                            </div>
                                        </Card>

                                        <div className="space-y-6">
                                            <Card className="p-6 border-border/20 bg-muted/5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Documentação</p>
                                                    {clientData.documentosAnexos.length >= 2 ? (
                                                        <Badge className="bg-emerald-500 uppercase text-[8px]">Completo</Badge>
                                                    ) : (
                                                        <Badge variant="destructive" className="uppercase text-[8px]">DOC_PENDENTE</Badge>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    {clientData.documentosAnexos.length > 0 ? (
                                                        clientData.documentosAnexos.map(d => (
                                                            <div key={d.id} className="text-[10px] flex items-center gap-2 font-bold text-muted-foreground">
                                                                <FileText size={12} className="text-emerald-500" /> {d.tipo}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-[10px] italic text-muted-foreground">Nenhum documento anexado.</p>
                                                    )}
                                                </div>
                                            </Card>

                                            <Card className="p-6 border-border/20 bg-muted/5">
                                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-4">Multi-Endereço</p>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold">Total de endereços: {clientData.enderecos.length}</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {clientData.enderecos.map(a => <Badge key={a.id} variant="outline" className="text-[8px]">{a.tipo}</Badge>)}
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 border-t border-border/10 bg-background/80 backdrop-blur-md flex justify-between items-center z-20">
                        <Button
                            variant="ghost"
                            onClick={() => setStep(prev => Math.max(1, prev - 1))}
                            disabled={step === 1}
                            className="text-muted-foreground hover:text-foreground gap-2 font-black uppercase tracking-widest text-xs"
                        >
                            <ChevronLeft size={16} /> Retroceder
                        </Button>

                        <Button
                            onClick={() => step === 6 ? handleComplete() : setStep(prev => Math.min(6, prev + 1))}
                            className={cn(
                                "rounded-2xl px-12 font-black tracking-[0.2em] gap-3 transition-all h-14 uppercase shadow-2xl",
                                step === 6 ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 scale-105" : "bg-primary text-primary-foreground"
                            )}
                        >
                            {step === 6 ? 'Registrar Vitalício' : 'Avançar Etapa'}
                            {step !== 6 && <ArrowRight size={18} />}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
