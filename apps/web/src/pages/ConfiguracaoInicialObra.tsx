import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    CheckSquare,
    Home,
    Building,
    FileCheck,
    ArrowRight,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '@/lib/api';

// Discipline list from ChecklistEngine (1.x-14.x)
const DisciplineList = [
    { codigo: '1.x', name: 'Documentação Inicial', category: 'ADMINISTRATIVO' },
    { codigo: '2.1', name: 'Arquitetura - Estudo Preliminar', category: 'ARQUITETURA', fase: 'PRELIMINAR' },
    { codigo: '2.2', name: 'Arquitetura - Executivo', category: 'ARQUITETURA', fase: 'EXECUTIVO' },
    { codigo: '2.3', name: 'Arquitetura - Aprovação Prefeitura', category: 'ARQUITETURA', fase: 'LEGAL' },
    { codigo: '2.4', name: 'Arquitetura - Aprovação Condomínio', category: 'ARQUITETURA', fase: 'CONDOMINIO' },
    { codigo: '3.x', name: 'Estrutural', category: 'ENGENHARIA' },
    { codigo: '4.x', name: 'Hidrossanitário', category: 'ENGENHARIA' },
    { codigo: '5.x', name: 'Elétrico', category: 'ENGENHARIA' },
    { codigo: '6.x', name: 'Gás', category: 'ENGENHARIA' },
    { codigo: '7.x', name: 'Incêndio', category: 'ENGENHARIA' },
    { codigo: '8.x', name: 'Ar Condicionado', category: 'ENGENHARIA' },
    { codigo: '9.x', name: 'Automação', category: 'ENGENHARIA' },
    { codigo: '10.x', name: 'Piscina', category: 'ENGENHARIA' },
    { codigo: '11.x', name: 'Paisagismo', category: 'ENGENHARIA' },
    { codigo: '12.x', name: 'Interiores', category: 'ARQUITETURA' },
    { codigo: '13.x', name: 'Luminotécnico', category: 'ARQUITETURA' },
    { codigo: '14.1', name: 'Pintura', category: 'ESPECIFICACOES' },
    { codigo: '14.2', name: 'Revestimentos', category: 'ESPECIFICACOES' },
    { codigo: '14.3', name: 'Marchetaria/Pedras', category: 'ESPECIFICACOES' },
    { codigo: '14.4', name: 'Louças e Metais', category: 'ESPECIFICACOES' },
];

const AMBIENTES = [
    'Sala de Estar',
    'Sala de Jantar',
    'Cozinha',
    'Área de Serviço',
    'Lavanderia',
    'Despensa',
    'Suíte Master',
    'Suíte 2',
    'Suíte 3',
    'Banheiro Social',
    'Banheiro Hóspedes',
    'Lavabo',
    'Escritório',
    'Home Office',
    'Home Theater',
    'Varanda Gourmet',
    'Churrasqueira',
    'Piscina',
    'Área Externa',
    'Jardim',
    'Garagem',
    'Depósito'
];

const ORGAOS_APROVACAO = [
    { id: 'prefeitura', label: 'Prefeitura Municipal', required: true },
    { id: 'condominio', label: 'Condomínio', required: false },
    { id: 'cbm', label: 'Corpo de Bombeiros (CBM)', required: false },
    { id: 'visa', label: 'Vigilância Sanitária', required: false },
    { id: 'suderv', label: 'SUDERV', required: false },
    { id: 'equatorial', label: 'Equatorial (Energia)', required: false },
    { id: 'saneago', label: 'Saneago (Água/Esgoto)', required: false }
];

export function ConfiguracaoInicialObra() {
    const { obraId } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1: Disciplines
    const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([
        '1.x', // Always include documentation
        '2.1', '2.2', '2.3', // Architecture basics
        '3.x', '4.x', '5.x' // Structural, Hydro, Electric
    ]);

    // Step 2: Environments
    const [selectedAmbientes, setSelectedAmbientes] = useState<string[]>([
        'Sala de Estar',
        'Cozinha',
        'Suíte Master',
        'Banheiro Social'
    ]);

    // Step 3: Approval Bodies
    const [selectedOrgaos, setSelectedOrgaos] = useState<{ [key: string]: boolean }>({
        prefeitura: true,
        condominio: false,
        cbm: false,
        visa: false,
        suderv: false,
        equatorial: false,
        saneago: false
    });

    const toggleDiscipline = (codigo: string) => {
        if (codigo === '1.x') return; // Cannot deselect documentation
        setSelectedDisciplines(prev =>
            prev.includes(codigo)
                ? prev.filter(c => c !== codigo)
                : [...prev, codigo]
        );
    };

    const toggleAmbiente = (ambiente: string) => {
        setSelectedAmbientes(prev =>
            prev.includes(ambiente)
                ? prev.filter(a => a !== ambiente)
                : [...prev, ambiente]
        );
    };

    const toggleOrgao = (orgaoId: string) => {
        setSelectedOrgaos(prev => ({
            ...prev,
            [orgaoId]: !prev[orgaoId]
        }));
    };

    const handleFinalize = async () => {
        setLoading(true);
        try {
            const response = await fetch(getApiUrl(`/api/projects/${obraId}/configure`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedDisciplines,
                    selectedAmbientes,
                    selectedOrgaos
                })
            });

            if (response.ok) {
                toast.success('Configuração concluída! Checklists gerados automaticamente.');
                navigate(`/obras/${obraId}`);
            } else {
                toast.error('Erro ao configurar obra');
            }
        } catch (error) {
            toast.error('Erro ao conectar com servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary/5 to-background p-4 lg:p-10">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Configuração Inicial da Obra
                    </h1>
                    <p className="text-muted-foreground font-medium mt-2">
                        Defina disciplinas, ambientes e aprovações para gerar checklists automaticamente
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-10 gap-4">
                    <StepIndicator number={1} label="Disciplinas" active={currentStep === 1} completed={currentStep > 1} />
                    <div className="h-px bg-border w-16" />
                    <StepIndicator number={2} label="Ambientes" active={currentStep === 2} completed={currentStep > 2} />
                    <div className="h-px bg-border w-16" />
                    <StepIndicator number={3} label="Aprovações" active={currentStep === 3} completed={currentStep > 3} />
                    <div className="h-px bg-border w-16" />
                    <StepIndicator number={4} label="Confirmar" active={currentStep === 4} completed={false} />
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <StepContent key="step1">
                            <Card className="rounded-[2rem] shadow-2xl border-border/40">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckSquare size={24} />
                                        Selecione as Disciplinas Aplicáveis (1.x - 14.x)
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Marque todas as disciplinas que se aplicam a esta obra. O sistema gerará checklists automáticos para cada uma.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {DisciplineList.map((discipline) => (
                                            <div
                                                key={discipline.codigo}
                                                onClick={() => toggleDiscipline(discipline.codigo)}
                                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedDisciplines.includes(discipline.codigo)
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                    } ${discipline.codigo === '1.x' ? 'opacity-100 cursor-not-allowed' : ''}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <Checkbox
                                                        checked={selectedDisciplines.includes(discipline.codigo)}
                                                        disabled={discipline.codigo === '1.x'}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="text-[9px] font-black">
                                                                {discipline.codigo}
                                                            </Badge>
                                                            {discipline.codigo === '1.x' && (
                                                                <Badge variant="default" className="text-[8px]">OBRIG.</Badge>
                                                            )}
                                                        </div>
                                                        <p className="font-bold text-sm mt-1">{discipline.name}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                                            {discipline.category}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200">
                                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                                            ✓ {selectedDisciplines.length} disciplinas selecionadas
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </StepContent>
                    )}

                    {currentStep === 2 && (
                        <StepContent key="step2">
                            <Card className="rounded-[2rem] shadow-2xl border-border/40">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Home size={24} />
                                        Defina os Ambientes da Obra
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Selecione todos os ambientes presentes. Isso gerará listas de materiais (14.x) específicas para cada um.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {AMBIENTES.map((ambiente) => (
                                            <div
                                                key={ambiente}
                                                onClick={() => toggleAmbiente(ambiente)}
                                                className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${selectedAmbientes.includes(ambiente)
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Checkbox checked={selectedAmbientes.includes(ambiente)} />
                                                    <Label className="font-semibold text-xs cursor-pointer">{ambiente}</Label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200">
                                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                                            ✓ {selectedAmbientes.length} ambientes configurados
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </StepContent>
                    )}

                    {currentStep === 3 && (
                        <StepContent key="step3">
                            <Card className="rounded-[2rem] shadow-2xl border-border/40">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileCheck size={24} />
                                        Órgãos e Aprovações Necessárias
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Indique quais órgãos exigem aprovação. Isso criará checklists documentais específicos.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {ORGAOS_APROVACAO.map((orgao) => (
                                            <div
                                                key={orgao.id}
                                                onClick={() => !orgao.required && toggleOrgao(orgao.id)}
                                                className={`p-4 rounded-xl border-2 transition-all ${orgao.required
                                                    ? 'border-primary bg-primary/5 cursor-not-allowed'
                                                    : selectedOrgaos[orgao.id]
                                                        ? 'border-primary bg-primary/5 cursor-pointer'
                                                        : 'border-border hover:border-primary/50 cursor-pointer'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            checked={selectedOrgaos[orgao.id]}
                                                            disabled={orgao.required}
                                                        />
                                                        <div>
                                                            <Label className="font-bold text-sm cursor-pointer">{orgao.label}</Label>
                                                            {orgao.required && (
                                                                <Badge variant="default" className="ml-2 text-[9px]">OBRIGATÓRIO</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </StepContent>
                    )}

                    {currentStep === 4 && (
                        <StepContent key="step4">
                            <Card className="rounded-[2rem] shadow-2xl border-border/40">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building size={24} />
                                        Confirmar Configuração
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Revise as configurações. Após confirmar, o sistema gerará automaticamente todos os checklists.
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="font-bold text-sm mb-3">Disciplinas ({selectedDisciplines.length})</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDisciplines.map(code => (
                                                <Badge key={code} variant="outline">{code}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm mb-3">Ambientes ({selectedAmbientes.length})</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedAmbientes.map(amb => (
                                                <Badge key={amb} variant="secondary">{amb}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm mb-3">Órgãos de Aprovação</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(selectedOrgaos)
                                                .filter(([_, selected]) => selected)
                                                .map(([id]) => {
                                                    const orgao = ORGAOS_APROVACAO.find(o => o.id === id);
                                                    return <Badge key={id} variant="default">{orgao?.label}</Badge>;
                                                })
                                            }
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-2 border-green-200 dark:border-green-800">
                                        <h4 className="font-black text-sm mb-2">O que será gerado automaticamente:</h4>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                            <li>✓ {selectedDisciplines.length} registros de disciplinas (1.x-14.x)</li>
                                            <li>✓ Checklists de documentos por fase (início, andamento, final)</li>
                                            <li>✓ Checklists de projetos por disciplina e fase</li>
                                            <li>✓ Listas de materiais por ambiente (14.x)</li>
                                            <li>✓ Vínculos com órgãos de aprovação</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </StepContent>
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                        disabled={currentStep === 1 || loading}
                        className="rounded-xl h-12 px-6"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Voltar
                    </Button>

                    {currentStep < 4 ? (
                        <Button
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            className="rounded-xl h-12 px-8 shadow-xl shadow-primary/20"
                        >
                            Próximo
                            <ArrowRight size={16} className="ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleFinalize}
                            disabled={loading}
                            className="rounded-xl h-12 px-10 shadow-xl shadow-primary/20 font-black"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={16} />
                                    Gerando Checklists...
                                </>
                            ) : (
                                'Finalizar Configuração'
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

interface StepIndicatorProps {
    number: number;
    label: string;
    active: boolean;
    completed: boolean;
}

function StepIndicator({ number, label, active, completed }: StepIndicatorProps) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm transition-all ${completed
                    ? 'bg-green-500 text-white'
                    : active
                        ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30'
                        : 'bg-secondary text-muted-foreground'
                    }`}
            >
                {completed ? '✓' : number}
            </div>
            <span className={`text-xs font-bold ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {label}
            </span>
        </div>
    );
}

function StepContent({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
}
