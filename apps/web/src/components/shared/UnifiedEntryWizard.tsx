import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppFlow } from '@/store/useAppFlow';
import { toast } from 'sonner';
import {
    MapPin, Building, Ruler, Truck, Home, Briefcase, Zap, UserPlus, CheckCircle2
} from 'lucide-react';
import { WorkClassification } from '@/types';

interface UnifiedEntryWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const STEP_TITLES = [
    "Identificação do Cliente",
    "Classificação da Obra",
    "Detalhes Físicos"
];

// Default initial state for Classification
const initialClassification: WorkClassification = {
    zona: 'URBANA',
    tipo: 'OBRA_NOVA',
    natureza: 'RESIDENCIAL',
    padrao: 'MEDIO',
    uso: 'UNIFAMILIAR'
};

export function UnifiedEntryWizard({ isOpen, onClose, onSuccess }: UnifiedEntryWizardProps) {
    const [step, setStep] = useState(0);
    const { clients, addLead, addClient } = useAppFlow();

    // Form State
    const [clientMode, setClientMode] = useState<'EXISTING' | 'NEW' | null>(null);
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [newClientData, setNewClientData] = useState({ name: '', phone: '', email: '', type: 'PF' });

    const [workData, setWorkData] = useState({
        name: '',
        address: '',
        area: '',
        description: ''
    });

    const [classification, setClassification] = useState<WorkClassification>(initialClassification);

    const handleNext = () => {
        if (ValidateStep(step)) {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => setStep(prev => prev - 1);

    const ValidateStep = (currentStep: number) => {
        if (currentStep === 0) {
            if (!clientMode) { toast.error("Selecione se o cliente é novo ou existente."); return false; }
            if (clientMode === 'EXISTING' && !selectedClientId) { toast.error("Selecione um cliente da base."); return false; }
            if (clientMode === 'NEW' && !newClientData.name) { toast.error("Preencha o nome do cliente."); return false; }
            return true;
        }
        if (currentStep === 1) {
            if (!workData.name) { toast.error("Dê um nome para a obra."); return false; }
            return true;
        }
        return true;
    };

    const handleFinish = () => {
        try {
            // 1. Resolve Client
            let finalClientId = selectedClientId;
            if (clientMode === 'NEW') {
                // Auto-register client invisible
                finalClientId = addClient({
                    nome: newClientData.name,
                    contatos: JSON.stringify([{ type: 'phone', value: newClientData.phone }, { type: 'email', value: newClientData.email }]),
                    tipo: newClientData.type,
                    ativo: true
                });
            }

            // 2. Register Lead/Work
            addLead({
                clientId: finalClientId,
                nomeObra: workData.name,
                localizacao: workData.address,
                areaEstimada: parseFloat(workData.area) || 0,
                tipoObra: classification.natureza, // High level mapping
                classificacao: classification, // Detailed mapping
                status: 'NOVO',
                origem: 'WIZARD_UNIFICADO',
                nomeValidacao: clientMode === 'NEW' ? newClientData.name : undefined // Fallback
            });

            toast.success("Oportunidade cadastrada com sucesso!");
            if (onSuccess) onSuccess();
            onClose();
            // Reset after close
            setTimeout(() => {
                setStep(0);
                setClientMode(null);
                setWorkData({ name: '', address: '', area: '', description: '' });
            }, 500);

        } catch (error) {
            console.error(error);
            toast.error("Erro ao criar registro.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none bg-background/95 backdrop-blur-2xl transition-all duration-300">
                {/* Header */}
                <div className="bg-muted/30 p-8 border-b border-border/10 flex justify-between items-center">
                    <div>
                        <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                            <Zap size={20} className="text-primary" /> Novo Cadastro Unificado
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                            Passo {step + 1} de 3: {STEP_TITLES[step]}
                        </DialogDescription>
                    </div>
                    {/* Stepper Dots */}
                    <div className="flex gap-2">
                        {[0, 1, 2].map(i => (
                            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-primary w-6' : 'bg-muted-foreground/30'}`} />
                        ))}
                    </div>
                </div>

                <div className="p-8 min-h-[400px]">
                    {/* STEP 0: CLIENTE */}
                    {step === 0 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <SelectionCard
                                    icon={UserPlus}
                                    title="Novo Cliente"
                                    desc="Não está na base de dados"
                                    active={clientMode === 'NEW'}
                                    onClick={() => setClientMode('NEW')}
                                />
                                <SelectionCard
                                    icon={CheckCircle2}
                                    title="Cliente Existente"
                                    desc="Selecionar da carteira"
                                    active={clientMode === 'EXISTING'}
                                    onClick={() => setClientMode('EXISTING')}
                                />
                            </div>

                            {clientMode === 'EXISTING' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <Label>Buscar Cliente</Label>
                                    <Select onValueChange={setSelectedClientId} value={selectedClientId}>
                                        <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/20 font-medium">
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.nome || c.razaoSocial}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {clientMode === 'NEW' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Nome Completo / Razão Social</Label>
                                            <Input
                                                value={newClientData.name}
                                                onChange={e => setNewClientData({ ...newClientData, name: e.target.value })}
                                                className="h-11 rounded-xl bg-muted/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tipo</Label>
                                            <Select value={newClientData.type} onValueChange={(v) => setNewClientData({ ...newClientData, type: v })}>
                                                <SelectTrigger className="h-11 rounded-xl bg-muted/20"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PF">Pessoa Física</SelectItem>
                                                    <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Telefone / WhatsApp</Label>
                                            <Input
                                                value={newClientData.phone}
                                                onChange={e => setNewClientData({ ...newClientData, phone: e.target.value })}
                                                className="h-11 rounded-xl bg-muted/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>E-mail</Label>
                                            <Input
                                                value={newClientData.email}
                                                onChange={e => setNewClientData({ ...newClientData, email: e.target.value })}
                                                className="h-11 rounded-xl bg-muted/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 1: CLASSIFICAÇÃO */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="space-y-2">
                                <Label>Nome de Identificação da Obra</Label>
                                <Input
                                    placeholder="Ex: Residência Alphaville - Lote 04"
                                    value={workData.name}
                                    onChange={e => setWorkData({ ...workData, name: e.target.value })}
                                    className="h-12 rounded-xl bg-muted/20 font-bold text-lg"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="space-y-4">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Natureza</Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {['RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL', 'AGROINDUSTRIA'].map((opt) => (
                                            <SelectableOption
                                                key={opt}
                                                label={opt}
                                                selected={classification.natureza === opt}
                                                onClick={() => setClassification({ ...classification, natureza: opt as any })}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tipo de Intervenção</Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {['OBRA_NOVA', 'REFORMA', 'AMPLIACAO', 'DEMOLICAO'].map((opt) => (
                                            <SelectableOption
                                                key={opt}
                                                label={opt.replace('_', ' ')}
                                                selected={classification.tipo === opt}
                                                onClick={() => setClassification({ ...classification, tipo: opt as any })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: DETALHES FÍSICOS */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Localização (Endereço / Coordenadas)</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-muted-foreground opacity-50" size={18} />
                                        <Input
                                            className="pl-10 h-11 rounded-xl bg-muted/20"
                                            placeholder="Rua, número, bairro..."
                                            value={workData.address}
                                            onChange={e => setWorkData({ ...workData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Área Estimada (m²)</Label>
                                    <div className="relative">
                                        <Ruler className="absolute left-3 top-3 text-muted-foreground opacity-50" size={18} />
                                        <Input
                                            type="number"
                                            className="pl-10 h-11 rounded-xl bg-muted/20"
                                            placeholder="0.00"
                                            value={workData.area}
                                            onChange={e => setWorkData({ ...workData, area: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 border-t border-border/10 pt-6">
                                <div className="space-y-2">
                                    <Label>Zona</Label>
                                    <Select value={classification.zona} onValueChange={(v: any) => setClassification({ ...classification, zona: v })}>
                                        <SelectTrigger className="h-10 rounded-xl bg-muted/20"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="URBANA">Urbana</SelectItem>
                                            <SelectItem value="RURAL">Rural</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Padrão Construtivo</Label>
                                    <Select value={classification.padrao} onValueChange={(v: any) => setClassification({ ...classification, padrao: v })}>
                                        <SelectTrigger className="h-10 rounded-xl bg-muted/20"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BAIXO">Popular / Baixo</SelectItem>
                                            <SelectItem value="MEDIO">Normal / Médio</SelectItem>
                                            <SelectItem value="ALTO">Alto Padrão</SelectItem>
                                            <SelectItem value="LUXO">Luxo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Uso</Label>
                                    <Select value={classification.uso} onValueChange={(v: any) => setClassification({ ...classification, uso: v })}>
                                        <SelectTrigger className="h-10 rounded-xl bg-muted/20"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UNIFAMILIAR">Unifamiliar</SelectItem>
                                            <SelectItem value="MULTIFAMILIAR">Multifamiliar</SelectItem>
                                            <SelectItem value="CORPORATIVO">Corporativo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Observações Iniciais</Label>
                                <Textarea
                                    className="h-20 rounded-xl bg-muted/20 resize-none"
                                    placeholder="Detalhes adicionais sobre o terreno ou projeto..."
                                    value={workData.description}
                                    onChange={e => setWorkData({ ...workData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-8 border-t border-border/10 bg-muted/10 flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={step === 0 ? onClose : handleBack}
                        className="rounded-xl font-bold text-muted-foreground hover:text-foreground"
                    >
                        {step === 0 ? 'Cancelar' : 'Voltar'}
                    </Button>

                    <Button
                        onClick={step === 2 ? handleFinish : handleNext}
                        className="rounded-xl px-8 font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                    >
                        {step === 2 ? 'Finalizar Cadastro' : 'Continuar'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// UI Helper
function SelectionCard({ icon: Icon, title, desc, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                flex flex-col items-center justify-center p-6 rounded-[1.5rem] border transition-all duration-300
                ${active
                    ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5 scale-[1.02]'
                    : 'border-border/20 bg-background hover:bg-muted/30 hover:border-border/40'
                }
            `}
        >
            <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors
                ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
            `}>
                <Icon size={24} />
            </div>
            <h3 className={`font-black text-sm uppercase tracking-tight ${active ? 'text-primary' : 'text-foreground'}`}>{title}</h3>
            <p className="text-[10px] text-muted-foreground font-medium mt-1">{desc}</p>
        </button>
    )
}

function SelectableOption({ label, selected, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                w-full text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all
                ${selected
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }
            `}
        >
            {label}
        </button>
    )
}
