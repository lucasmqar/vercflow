"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    CheckSquare, Plus, Search, MoreHorizontal,
    FileText, Trash2, Edit2, Copy, Save, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChecklistTemplate {
    id: number;
    title: string;
    category: string;
    items: { id: number; text: string }[];
    usageCount: number;
}

export function DesignChecklists() {
    const [templates, setTemplates] = useState<ChecklistTemplate[]>([
        {
            id: 1,
            title: "01. Onboarding & Briefing",
            category: "Gestão",
            items: [
                { id: 1, text: "Reunião de Kick-off com cliente agendada" },
                { id: 2, text: "Questionário de Briefing enviado e respondido" },
                { id: 3, text: "Levantamento fotográfico e medição in loco" },
                { id: 4, text: "Pasta do projeto criada no Drive/Cloud" },
                { id: 5, text: "Contrato assinado e primeira parcela paga" },
                { id: 6, text: "Cronograma inicial validado com cliente" }
            ],
            usageCount: 24
        },
        {
            id: 2,
            title: "02. Estudo Preliminar (EP)",
            category: "Criação",
            items: [
                { id: 1, text: "Definição de Conceito e Partido (Moodboard)" },
                { id: 2, text: "Estudo de fluxos e layout (2 a 3 opções)" },
                { id: 3, text: "Modelagem 3D volumétrica" },
                { id: 4, text: "Seleção preliminar de materiais chave" },
                { id: 5, text: "Apresentação de EP montada" }
            ],
            usageCount: 18
        },
        {
            id: 3,
            title: "03. Anteprojeto & Legal",
            category: "Técnico",
            items: [
                { id: 1, text: "Revisão de medidas após levantamento fino" },
                { id: 2, text: "Plantas de demolir/construir definidas" },
                { id: 3, text: "Pontos elétricos e hidráulicos locados" },
                { id: 4, text: "Consulta às normas do condomínio/prefeitura" },
                { id: 5, text: "RRT/ART de projeto emitida" }
            ],
            usageCount: 15
        },
        {
            id: 4,
            title: "04. Projeto Executivo",
            category: "Técnico",
            items: [
                { id: 1, text: "Planta de Layout Final cotada" },
                { id: 2, text: "Paginação de Pisos e Revestimentos" },
                { id: 3, text: "Planta de Forro e Iluminação (Circuitos)" },
                { id: 4, text: "Detalhamento de Marcenaria (Cozinha/Banho)" },
                { id: 5, text: "Detalhamento de Marcenaria (Armários/Painéis)" },
                { id: 6, text: "Especificação de Marmoraria e Pedras" },
                { id: 7, text: "Memorial Descritivo de acabamentos" }
            ],
            usageCount: 12
        },
        {
            id: 5,
            title: "05. Orçamentos & Compras",
            category: "Gestão",
            items: [
                { id: 1, text: "Mapa de cotação de marcenaria (3 fornecedores)" },
                { id: 2, text: "Mapa de cotação de obra civil" },
                { id: 3, text: "Pedido de revestimentos e louças realizado" },
                { id: 4, text: "Conferência de prazos de entrega vs Cronograma" }
            ],
            usageCount: 10
        },
        {
            id: 6,
            title: "06. Entrega & Finalização",
            category: "Obra",
            items: [
                { id: 1, text: "Vistoria de entrega de obra civil" },
                { id: 2, text: "Conferência de montagem de marcenaria" },
                { id: 3, text: "Verificação de iluminação e elétrica" },
                { id: 4, text: "Limpeza fina realizada" },
                { id: 5, text: "Produção e Staging para fotos" },
                { id: 6, text: "Manual do proprietário entregue" },
                { id: 7, text: "Sessão de fotos final realizada" }
            ],
            usageCount: 8
        }
    ]);

    const [isCreating, setIsCreating] = useState(false);
    const [newTemplate, setNewTemplate] = useState<{ title: string; category: string; items: string[] }>({
        title: "",
        category: "",
        items: [""]
    });

    const handleAddItem = () => {
        setNewTemplate({ ...newTemplate, items: [...newTemplate.items, ""] });
    };

    const handleItemChange = (index: number, value: string) => {
        const updatedItems = [...newTemplate.items];
        updatedItems[index] = value;
        setNewTemplate({ ...newTemplate, items: updatedItems });
    };

    const handleSaveTemplate = () => {
        const template: ChecklistTemplate = {
            id: Date.now(),
            title: newTemplate.title,
            category: newTemplate.category || "Geral",
            items: newTemplate.items.filter(i => i.trim() !== "").map((text, idx) => ({ id: idx, text })),
            usageCount: 0
        };
        setTemplates([...templates, template]);
        setIsCreating(false);
        setNewTemplate({ title: "", category: "", items: [""] });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        Gestão de Checklists
                        <Badge variant="secondary" className="text-xs font-black px-2">{templates.length}</Badge>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Crie e gerencie modelos de checklist para padronizar processos.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {!isCreating && (
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input placeholder="Buscar modelo..." className="pl-10 rounded-xl bg-background/50 border-border/40" />
                        </div>
                    )}
                    <Button
                        onClick={() => setIsCreating(!isCreating)}
                        className={cn(
                            "rounded-xl font-bold text-xs uppercase tracking-wide shadow-lg transition-all",
                            isCreating ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" : "bg-primary text-primary-foreground shadow-primary/20"
                        )}
                    >
                        {isCreating ? <><X size={16} className="mr-2" /> Cancelar</> : <><Plus size={16} className="mr-2" /> Novo Modelo</>}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* List of Templates */}
                <div className={cn("grid gap-6 w-full transition-all", isCreating ? "lg:w-2/3 grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
                    {templates.map((template) => (
                        <Card key={template.id} className="group p-6 rounded-[2rem] border-border/40 bg-background/40 backdrop-blur-md hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-background/80"><Edit2 size={14} /></Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-background/80 hover:text-red-500"><Trash2 size={14} /></Button>
                            </div>

                            <div className="mb-6">
                                <Badge variant="outline" className="mb-3 bg-primary/5 text-primary border-primary/10">{template.category}</Badge>
                                <h3 className="text-lg font-black tracking-tight mb-2 group-hover:text-primary transition-colors">{template.title}</h3>
                                <p className="text-xs font-bold text-muted-foreground">{template.items.length} itens • Usado {template.usageCount}x</p>
                            </div>

                            <div className="space-y-2 bg-muted/20 p-4 rounded-xl">
                                {template.items.slice(0, 3).map((item) => (
                                    <div key={item.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                        <span className="truncate">{item.text}</span>
                                    </div>
                                ))}
                                {template.items.length > 3 && (
                                    <p className="text-[10px] font-bold text-muted-foreground pl-3.5 pt-1">+ {template.items.length - 3} itens</p>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Creation Form */}
                <AnimatePresence>
                    {isCreating && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="w-full lg:w-1/3 sticky top-4"
                        >
                            <Card className="p-6 rounded-2xl border-primary/20 bg-background/60 backdrop-blur-xl shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-black text-lg flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <Plus size={18} />
                                        </div>
                                        Criar Modelo
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Título do Checklist</label>
                                        <Input
                                            value={newTemplate.title}
                                            onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                                            placeholder="Ex: Vistoria de Entrega"
                                            className="rounded-xl bg-background/50 border-border/40 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Categoria</label>
                                        <Input
                                            value={newTemplate.category}
                                            onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                                            placeholder="Ex: Obra, Cliente, Interno"
                                            className="rounded-xl bg-background/50 border-border/40"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-border/20">
                                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3 block">Itens de Verificação</label>
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                                            {newTemplate.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <span className="text-xs font-bold text-muted-foreground/30 pt-3 w-4 text-center">{idx + 1}</span>
                                                    <Input
                                                        value={item}
                                                        onChange={(e) => handleItemChange(idx, e.target.value)}
                                                        placeholder="Item de verificação..."
                                                        className="rounded-xl bg-background/50 border-border/40 text-sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={handleAddItem}
                                            className="w-full mt-3 rounded-xl border-dashed border-border/60 hover:border-primary/40 hover:text-primary"
                                        >
                                            <Plus size={14} className="mr-2" /> Adicionar Item
                                        </Button>
                                    </div>

                                    <Button
                                        onClick={handleSaveTemplate}
                                        disabled={!newTemplate.title}
                                        className="w-full rounded-xl font-black uppercase tracking-widest h-12 mt-4 shadow-lg shadow-primary/20"
                                    >
                                        <Save size={18} className="mr-2" /> Salvar Modelo
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
