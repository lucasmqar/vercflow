import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Building2,
    UserPlus,
    FileText,
    ArrowRight,
    Search,
    User,
    Briefcase,
    FileEdit,
    CheckCircle2
} from 'lucide-react';
import { useAppFlow } from '@/store/useAppFlow';
import { toast } from 'sonner';

type EntryType = 'WORK' | 'LEAD' | 'REVISION' | null;
type RevisionType = 'BUDGET' | 'PROPOSAL' | 'CONTRACT' | null;

interface ComercialNewEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ComercialNewEntryModal({ isOpen, onClose, onSuccess }: ComercialNewEntryModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [entryType, setEntryType] = useState<EntryType>(null);
    const [revisionType, setRevisionType] = useState<RevisionType>(null);

    // Form States
    const [formData, setFormData] = useState({
        clientId: '',
        clientName: '', // For new lead
        workName: '',
        description: '',
        contact: '',
        revisionSourceId: ''
    });

    const { clients, addLead, createRequest, budgets, proposals } = useAppFlow();

    const reset = () => {
        setStep(1);
        setEntryType(null);
        setRevisionType(null);
        setFormData({
            clientId: '',
            clientName: '',
            workName: '',
            description: '',
            contact: '',
            revisionSourceId: ''
        });
    };

    const handleClose = () => {
        onClose();
        setTimeout(reset, 300);
    };

    const handleSelectType = (type: EntryType) => {
        setEntryType(type);
        if (type === 'REVISION') {
            // Stay on step 1 to select revision subtype
        } else {
            setStep(2);
        }
    };

    const handleSelectRevisionType = (type: RevisionType) => {
        setRevisionType(type);
        setStep(2);
    };

    const handleSubmit = () => {
        try {
            if (entryType === 'LEAD') {
                // New Lead (New Client & Work)
                addLead({
                    nomeValidacao: formData.clientName,
                    nomeObra: formData.workName,
                    status: 'NOVO',
                    origem: 'MANUAL',
                    localizacao: 'A Definir', // Placeholder
                    tipoObra: 'RESIDENCIAL', // Default
                    contato: formData.contact
                });
                toast.success("Novo Lead cadastrado com sucesso!");
            } else if (entryType === 'WORK') {
                // New Work (Existing Client)
                const client = clients.find(c => c.id === formData.clientId);
                if (client) {
                    addLead({
                        nomeValidacao: client.razaoSocial || client.nomeFantasia,
                        clientId: client.id,
                        nomeObra: formData.workName,
                        status: 'QUALIFICADO', // Skip to qualified since client exists
                        origem: 'CLIENTE_BASE',
                        localizacao: 'A Definir',
                        tipoObra: 'RESIDENCIAL',
                        contato: formData.contact || client.email
                    });
                    toast.success("Nova Obra vinculada ao Cliente com sucesso!");
                }
            } else if (entryType === 'REVISION') {
                // Revision Request (Creates an internal task for now)
                createRequest({
                    fromDepartment: 'COMERCIAL',
                    toDepartment: 'COMERCIAL',
                    type: 'REVISION_REQUEST',
                    title: `Revisão de ${revisionType}: ${formData.workName || 'Geral'}`,
                    description: `Solicitação de revisão manual.\nOrigem: ${formData.revisionSourceId}\nMotivo: ${formData.description}`,
                    priority: 'ALTA',
                    status: 'PENDENTE'
                });
                toast.success("Solicitação de revisão criada!");
            }

            if (onSuccess) onSuccess();
            handleClose();
        } catch (error) {
            toast.error("Erro ao processar entrada.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-2xl rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
                <div className="p-8 border-b border-border/40 bg-muted/20">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <Zap className="text-primary fill-primary/20" />
                            {step === 1 ? "Nova Entrada Comercial" :
                                entryType === 'LEAD' ? "Cadastro de Novo Lead" :
                                    entryType === 'WORK' ? "Nova Obra (Cliente Base)" :
                                        "Solicitar Revisão"}
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            {step === 1 ? "Selecione o tipo de atividade para iniciar o fluxo." :
                                "Preencha os detalhes para registrar a operação."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 min-h-[300px]">
                    {step === 1 ? (
                        <div className="space-y-6">
                            {!entryType || (entryType === 'REVISION' && !revisionType) ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <SelectionCard
                                        icon={Building2}
                                        title="Nova Obra"
                                        desc="Cliente já existente na base"
                                        onClick={() => handleSelectType('WORK')}
                                        active={entryType === 'WORK'}
                                    />
                                    <SelectionCard
                                        icon={UserPlus}
                                        title="Novo Lead"
                                        desc="Cadastrar novo cliente e obra"
                                        onClick={() => handleSelectType('LEAD')}
                                        active={entryType === 'LEAD'}
                                    />
                                    <SelectionCard
                                        icon={FileEdit}
                                        title="Revisão"
                                        desc="Alterar orçamento ou proposta"
                                        onClick={() => handleSelectType('REVISION')}
                                        active={entryType === 'REVISION'}
                                    />
                                </div>
                            ) : null}

                            {/* Revision Sub-selection */}
                            {entryType === 'REVISION' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">O que será revisado?</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <SelectionCard
                                            icon={FileText}
                                            title="Orçamento"
                                            desc="Revisão de escopo/preço"
                                            onClick={() => handleSelectRevisionType('BUDGET')}
                                            compact
                                        />
                                        <SelectionCard
                                            icon={Briefcase}
                                            title="Proposta"
                                            desc="Revisão comercial"
                                            onClick={() => handleSelectRevisionType('PROPOSAL')}
                                            compact
                                        />
                                        <SelectionCard
                                            icon={CheckCircle2}
                                            title="Contrato"
                                            desc="Termos e condições"
                                            onClick={() => handleSelectRevisionType('CONTRACT')}
                                            compact
                                        />
                                    </div>
                                    <Button variant="ghost" className="w-full text-xs" onClick={() => setEntryType(null)}>Voltar</Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            {entryType === 'WORK' && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Selecionar Cliente</Label>
                                        <Select onValueChange={(v) => setFormData({ ...formData, clientId: v })}>
                                            <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-transparent"><SelectValue placeholder="Busque por nome ou CNPJ..." /></SelectTrigger>
                                            <SelectContent>
                                                {clients.map(c => (
                                                    <SelectItem key={c.id} value={c.id}>{c.razaoSocial} ({c.cnpj})</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nome da Obra</Label>
                                        <Input
                                            placeholder="Ex: Reforma Cobertura Garden"
                                            className="h-12 rounded-xl bg-muted/30 border-transparent"
                                            value={formData.workName}
                                            onChange={e => setFormData({ ...formData, workName: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {entryType === 'LEAD' && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Nome do Cliente / Empresa</Label>
                                        <Input
                                            placeholder="Ex: João da Silva ou Tech Solutions Ltda"
                                            className="h-12 rounded-xl bg-muted/30 border-transparent"
                                            value={formData.clientName}
                                            onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nome da Obra (Opcional)</Label>
                                        <Input
                                            placeholder="Ex: Nova Sede Administrativa"
                                            className="h-12 rounded-xl bg-muted/30 border-transparent"
                                            value={formData.workName}
                                            onChange={e => setFormData({ ...formData, workName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Contato (Tel/Email)</Label>
                                        <Input
                                            placeholder="(11) 99999-9999"
                                            className="h-12 rounded-xl bg-muted/30 border-transparent"
                                            value={formData.contact}
                                            onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {entryType === 'REVISION' && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Buscar {revisionType === 'BUDGET' ? 'Orçamento' : revisionType === 'PROPOSAL' ? 'Proposta' : 'Documento'}</Label>
                                        <Select onValueChange={(v) => setFormData({ ...formData, revisionSourceId: v })}>
                                            <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-transparent"><SelectValue placeholder="Selecione o documento original..." /></SelectTrigger>
                                            <SelectContent>
                                                {revisionType === 'BUDGET' && budgets.map(b => (
                                                    <SelectItem key={b.id} value={b.id}>Orç. {b.leadId.substring(0, 4)} - R$ {b.valorEstimado}</SelectItem>
                                                ))}
                                                {revisionType === 'PROPOSAL' && proposals.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>Prop. {p.id.substring(0, 4)} v{p.versao}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Motivo da Revisão</Label>
                                        <Textarea
                                            placeholder="Descreva as alterações necessárias..."
                                            className="min-h-[100px] rounded-xl bg-muted/30 border-transparent"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-border/40 bg-muted/20 flex justify-between items-center">
                    {step === 2 && (
                        <Button variant="ghost" onClick={() => setStep(1)} className="font-bold text-muted-foreground">Voltar</Button>
                    )}
                    <div className="ml-auto flex gap-3">
                        <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
                        {step === 2 && (
                            <Button className="bg-primary text-primary-foreground font-bold px-8" onClick={handleSubmit}>
                                Confirmar Entrada
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function SelectionCard({ icon: Icon, title, desc, onClick, active, compact }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 group hover:scale-[1.02]
                ${active ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-background border-border/40 hover:border-primary/40 hover:shadow-md'}
                ${compact ? 'py-4 px-2' : ''}
            `}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${active ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10'}`}>
                <Icon size={24} />
            </div>
            <h3 className="font-black text-sm uppercase tracking-tight text-foreground">{title}</h3>
            <p className="text-[10px] text-muted-foreground mt-1 text-center leading-tight">{desc}</p>
        </button>
    );
}
