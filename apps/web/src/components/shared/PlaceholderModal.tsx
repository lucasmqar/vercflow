"use client"

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Construction, ArrowRight, Save, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type RegistrationType = 'obra' | 'projeto' | 'lead' | 'financial' | 'item' | 'vehicle' | 'none';

interface PlaceholderModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    icon?: React.ElementType;
    type?: RegistrationType;
}

export function PlaceholderModal({
    isOpen,
    onClose,
    title,
    description = "Defina os valores mínimos necessários abaixo para registro no sistema.",
    icon: Icon = Construction,
    type = 'none'
}: PlaceholderModalProps) {
    const [isSaving, setIsSaving] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 1500);
        }, 1200);
    };

    if (isSuccess) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[400px] rounded-[3rem] border-none bg-background/95 backdrop-blur-3xl p-12 text-center">
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <CheckCircle2 size={40} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black">Registro Concluído</h3>
                            <p className="text-sm text-muted-foreground font-medium mt-2">Os dados foram integrados ao barramento operacional com sucesso.</p>
                        </div>
                    </motion.div>
                </DialogContent>
            </Dialog>
        );
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-white/10 bg-background/95 backdrop-blur-3xl shadow-2xl overflow-hidden p-0">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

                <div className="p-8 pb-0">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-white/5">
                                <Icon size={24} />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black tracking-tight">{title}</DialogTitle>
                                <Badge variant="outline" className="mt-1 text-[8px] font-black uppercase tracking-widest border-primary/20 text-primary px-2">EM DEFINIÇÃO</Badge>
                            </div>
                        </div>
                        <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
                            {description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-8 space-y-6">
                        {type === 'none' ? (
                            <div className="p-6 rounded-2xl bg-muted/30 border border-white/5 space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Info size={14} /> Requisitos Mínimos
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span>Estrutura de dados inicial (JSON)</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span>Mapeamento de permissões por cargo</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {type === 'obra' && (
                                    <>
                                        <FormItem label="Nome da Obra" placeholder="Ex: Edifício Infinity" />
                                        <FormItem label="Endereço" placeholder="Logradouro, Número, Cidade" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormItem label="Área (m²)" placeholder="0.00" />
                                            <FormItem label="Budget (R$)" placeholder="0.00" />
                                        </div>
                                    </>
                                )}
                                {type === 'projeto' && (
                                    <>
                                        <FormItem label="Título do Projeto" placeholder="Ex: Projeto Executivo Hidráulica" />
                                        <FormItem label="Disciplina" placeholder="Engenharia / Arquitetura" />
                                        <FormItem label="Responsável Técnico" placeholder="Nome do Engenheiro" />
                                    </>
                                )}
                                {type === 'lead' && (
                                    <>
                                        <FormItem label="Nome do Cliente / Empresa" placeholder="Ex: Construtora Alpha" />
                                        <FormItem label="Contato Principal" placeholder="Telefone ou Email" />
                                        <FormItem label="Valor Estimado (R$)" placeholder="0.00" />
                                    </>
                                )}
                                {type === 'financial' && (
                                    <>
                                        <FormItem label="Descrição da Operação" placeholder="Ex: Pagamento Fornecedor Aço" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormItem label="Valor (R$)" placeholder="0.00" />
                                            <FormItem label="Data Vencimento" placeholder="DD/MM/AAAA" />
                                        </div>
                                        <FormItem label="Categoria" placeholder="Custo Fixo / Variável" />
                                    </>
                                )}
                                {type === 'item' && (
                                    <>
                                        <FormItem label="Nome do Insumo" placeholder="Ex: Cimento CP-II" />
                                        <FormItem label="Unidade de Medida" placeholder="kg, m, un" />
                                        <FormItem label="Quantidade Inicial" placeholder="0" />
                                    </>
                                )}
                                {type === 'vehicle' && (
                                    <>
                                        <FormItem label="Modelo do Veículo" placeholder="Ex: Toyota Hilux" />
                                        <FormItem label="Placa" placeholder="ABC-1234" />
                                        <FormItem label="Responsável / Motorista" placeholder="Nome" />
                                    </>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-white/5 bg-secondary/20">
                                <p className="text-[9px] font-black uppercase opacity-60 mb-1">Status</p>
                                <p className="text-xs font-black">PROCESSAMENTO ATIVO</p>
                            </div>
                            <div className="p-4 rounded-xl border border-white/5 bg-secondary/20">
                                <p className="text-[9px] font-black uppercase opacity-60 mb-1">Prioridade</p>
                                <p className="text-xs font-black text-emerald-500">MÉDIA / ALTA</p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-8 pt-6">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px] bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2"
                    >
                        {isSaving ? (
                            <>Processando... <Loader2 size={16} className="animate-spin" /></>
                        ) : (
                            <>Finalizar Registro <ArrowRight size={16} /></>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function FormItem({ label, placeholder }: { label: string, placeholder: string }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60 px-1">{label}</Label>
            <Input
                placeholder={placeholder}
                className="h-11 rounded-xl border-white/10 bg-white/5 text-xs font-bold shadow-inner placeholder:text-muted-foreground/30 focus-visible:ring-primary/20"
            />
        </div>
    );
}
