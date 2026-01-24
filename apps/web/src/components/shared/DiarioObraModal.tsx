"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Plus, X, Save, Sun, CloudRain, Cloud, CloudSnow,
    Users, Package, Wrench, ClipboardList, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppFlow } from '@/store/useAppFlow';
import { useAuth } from '@/hooks/useAuth';
import { DiarioObra, ClimaType, AtividadeDiaria, ProfissionalDiario, MaterialUtilizado } from '@/types';
import { cn } from '@/lib/utils';

interface DiarioObraModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId?: string;
    diario?: DiarioObra; // For editing
}

export function DiarioObraModal({ isOpen, onClose, projectId, diario }: DiarioObraModalProps) {
    const { projects, createDiarioObra, updateDiarioObra } = useAppFlow();
    const { user } = useAuth();
    const [currentTab, setCurrentTab] = useState('geral');

    // Form State
    const [formData, setFormData] = useState({
        projectId: diario?.projectId || projectId || '',
        data: diario?.data || new Date().toISOString().split('T')[0],
        climaManha: diario?.climaManha || 'SOL' as ClimaType,
        climaTarde: diario?.climaTarde || 'SOL' as ClimaType,
        temperaturaMedia: diario?.temperaturaMedia || 25,
        observacoesClima: diario?.observacoesClima || '',
        observacoes: diario?.observacoes || '',
        ocorrencias: diario?.ocorrencias || '',
        visitantes: diario?.visitantes || '',
    });

    const [atividades, setAtividades] = useState<Partial<AtividadeDiaria>[]>(diario?.atividadesExecutadas || []);
    const [profissionais, setProfissionais] = useState<Partial<ProfissionalDiario>[]>(diario?.profissionaisPresentes || []);
    const [materiais, setMateriais] = useState<Partial<MaterialUtilizado>[]>(diario?.materiaisUtilizados || []);

    const handleSave = () => {
        if (!formData.projectId) {
            toast.error('Selecione uma obra');
            return;
        }

        if (!user) {
            toast.error('Usuário não autenticado');
            return;
        }

        const rdoData: Omit<DiarioObra, 'id' | 'criadoEm'> = {
            ...formData,
            atividadesExecutadas: atividades as AtividadeDiaria[],
            profissionaisPresentes: profissionais as ProfissionalDiario[],
            materiaisUtilizados: materiais as MaterialUtilizado[],
            responsavelId: user.id,
            responsavel: user.nome,
            status: diario ? diario.status : 'EM_PREENCHIMENTO'
        };

        if (diario) {
            // Update existing
            updateDiarioObra(diario.id, rdoData);
            toast.success('Diário de Obra atualizado com sucesso!');
        } else {
            // Create new
            createDiarioObra(rdoData);
            toast.success('Diário de Obra criado com sucesso!');
        }

        onClose();
    };

    const climaIcons = {
        SOL: Sun,
        NUBLADO: Cloud,
        CHUVA_LEVE: CloudRain,
        CHUVA_FORTE: CloudRain,
        TEMPESTADE: CloudSnow,
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black flex items-center gap-3">
                        <ClipboardList className="text-primary" />
                        {diario ? 'Editar' : 'Novo'} Diário de Obra (RDO)
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="geral">Geral</TabsTrigger>
                        <TabsTrigger value="atividades">Atividades</TabsTrigger>
                        <TabsTrigger value="profissionais">Efetivo</TabsTrigger>
                        <TabsTrigger value="materiais">Materiais</TabsTrigger>
                        <TabsTrigger value="observacoes">Observações</TabsTrigger>
                    </TabsList>

                    {/* TAB 1: GERAL */}
                    <TabsContent value="geral" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Obra *</Label>
                                <Select value={formData.projectId} onValueChange={(v) => setFormData({ ...formData, projectId: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a obra" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Data *</Label>
                                <Input
                                    type="date"
                                    value={formData.data}
                                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                                />
                            </div>
                        </div>

                        <Card className="p-6 bg-muted/30 border-border/40">
                            <h3 className="font-bold text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Sun size={16} className="text-amber-500" /> Condições Climáticas
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label>Clima - Manhã</Label>
                                    <Select value={formData.climaManha} onValueChange={(v) => setFormData({ ...formData, climaManha: v as ClimaType })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(climaIcons).map(clima => (
                                                <SelectItem key={clima} value={clima}>{clima.replace('_', ' ')}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Clima - Tarde</Label>
                                    <Select value={formData.climaTarde} onValueChange={(v) => setFormData({ ...formData, climaTarde: v as ClimaType })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(climaIcons).map(clima => (
                                                <SelectItem key={clima} value={clima}>{clima.replace('_', ' ')}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Temperatura Média (°C)</Label>
                                    <Input
                                        type="number"
                                        value={formData.temperaturaMedia}
                                        onChange={(e) => setFormData({ ...formData, temperaturaMedia: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* TAB 2: ATIVIDADES */}
                    <TabsContent value="atividades" className="space-y-4 mt-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">Atividades Executadas</h3>
                            <Button
                                size="sm"
                                onClick={() => setAtividades([...atividades, { descricao: '', percentualConcluido: 0 }])}
                                className="gap-2"
                            >
                                <Plus size={16} /> Adicionar Atividade
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {atividades.map((ativ, idx) => (
                                <Card key={idx} className="p-4 bg-muted/20">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Input
                                            placeholder="Descrição da atividade"
                                            value={ativ.descricao}
                                            onChange={(e) => {
                                                const updated = [...atividades];
                                                updated[idx].descricao = e.target.value;
                                                setAtividades(updated);
                                            }}
                                        />
                                        <Input
                                            placeholder="Local (ex: 3º Pavimento)"
                                            value={ativ.local || ''}
                                            onChange={(e) => {
                                                const updated = [...atividades];
                                                updated[idx].local = e.target.value;
                                                setAtividades(updated);
                                            }}
                                        />
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="% Concluído"
                                                value={ativ.percentualConcluido || 0}
                                                onChange={(e) => {
                                                    const updated = [...atividades];
                                                    updated[idx].percentualConcluido = parseFloat(e.target.value);
                                                    setAtividades(updated);
                                                }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setAtividades(atividades.filter((_, i) => i !== idx))}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* TAB 3: PROFISSIONAIS */}
                    <TabsContent value="profissionais" className="space-y-4 mt-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Users size={20} /> Efetivo Presente
                            </h3>
                            <Button
                                size="sm"
                                onClick={() => setProfissionais([...profissionais, { nome: '', funcao: '', horasNormais: 8 }])}
                                className="gap-2"
                            >
                                <Plus size={16} /> Adicionar Profissional
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {profissionais.map((prof, idx) => (
                                <Card key={idx} className="p-4 bg-muted/20">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <Input
                                            placeholder="Nome"
                                            value={prof.nome}
                                            onChange={(e) => {
                                                const updated = [...profissionais];
                                                updated[idx].nome = e.target.value;
                                                setProfissionais(updated);
                                            }}
                                        />
                                        <Input
                                            placeholder="Função (ex: Pedreiro)"
                                            value={prof.funcao}
                                            onChange={(e) => {
                                                const updated = [...profissionais];
                                                updated[idx].funcao = e.target.value;
                                                setProfissionais(updated);
                                            }}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Horas Normais"
                                            value={prof.horasNormais}
                                            onChange={(e) => {
                                                const updated = [...profissionais];
                                                updated[idx].horasNormais = parseFloat(e.target.value);
                                                setProfissionais(updated);
                                            }}
                                        />
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="HE"
                                                value={prof.horasExtras || 0}
                                                onChange={(e) => {
                                                    const updated = [...profissionais];
                                                    updated[idx].horasExtras = parseFloat(e.target.value);
                                                    setProfissionais(updated);
                                                }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setProfissionais(profissionais.filter((_, i) => i !== idx))}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* TAB 4: MATERIAIS */}
                    <TabsContent value="materiais" className="space-y-4 mt-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Package size={20} /> Materiais Utilizados
                            </h3>
                            <Button
                                size="sm"
                                onClick={() => setMateriais([...materiais, { material: '', quantidade: 0, unidade: 'm³' }])}
                                className="gap-2"
                            >
                                <Plus size={16} /> Adicionar Material
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {materiais.map((mat, idx) => (
                                <Card key={idx} className="p-4 bg-muted/20">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                        <Input
                                            placeholder="Material"
                                            value={mat.material}
                                            onChange={(e) => {
                                                const updated = [...materiais];
                                                updated[idx].material = e.target.value;
                                                setMateriais(updated);
                                            }}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Qtd"
                                            value={mat.quantidade}
                                            onChange={(e) => {
                                                const updated = [...materiais];
                                                updated[idx].quantidade = parseFloat(e.target.value);
                                                setMateriais(updated);
                                            }}
                                        />
                                        <Input
                                            placeholder="Unidade (m³, kg, un)"
                                            value={mat.unidade}
                                            onChange={(e) => {
                                                const updated = [...materiais];
                                                updated[idx].unidade = e.target.value;
                                                setMateriais(updated);
                                            }}
                                        />
                                        <Input
                                            placeholder="Fornecedor"
                                            value={mat.fornecedor || ''}
                                            onChange={(e) => {
                                                const updated = [...materiais];
                                                updated[idx].fornecedor = e.target.value;
                                                setMateriais(updated);
                                            }}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setMateriais(materiais.filter((_, i) => i !== idx))}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* TAB 5: OBSERVAÇÕES */}
                    <TabsContent value="observacoes" className="space-y-6 mt-6">
                        <div className="space-y-2">
                            <Label>Observações Gerais</Label>
                            <Textarea
                                rows={4}
                                placeholder="Descreva atividades extras, visitas, entregas..."
                                value={formData.observacoes}
                                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-amber-600">
                                <AlertTriangle size={16} /> Ocorrências e Problemas
                            </Label>
                            <Textarea
                                rows={3}
                                placeholder="Acidentes, atrasos, falta de material, etc..."
                                value={formData.ocorrencias}
                                onChange={(e) => setFormData({ ...formData, ocorrencias: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Visitantes (Clientes, Fiscais, Fornecedores)</Label>
                            <Textarea
                                rows={2}
                                placeholder="Registro de visitas técnicas ou inspeções..."
                                value={formData.visitantes}
                                onChange={(e) => setFormData({ ...formData, visitantes: e.target.value })}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave} className="gap-2">
                        <Save size={16} /> Salvar Diário
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
