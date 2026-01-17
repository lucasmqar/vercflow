import { useState, useEffect } from 'react';
import { X, Building2, Calendar, Users, DollarSign, FileText, Palette, CheckCircle2, Clock, TrendingUp, Activity } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Project } from '@/types';
import { getApiUrl } from '@/lib/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProjectDetailsModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

interface ProjectDetails extends Project {
    activities?: any[];
    records?: any[];
    disciplines?: any[];
    tasks?: any[];
}

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
    const [details, setDetails] = useState<ProjectDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && project) {
            fetchProjectDetails();
        }
    }, [isOpen, project]);

    const fetchProjectDetails = async () => {
        if (!project) return;

        setIsLoading(true);
        try {
            // Fetch aggregated data for this project
            const [activitiesRes, recordsRes] = await Promise.all([
                fetch(getApiUrl(`/api/activities?projectId=${project.id}`)),
                fetch(getApiUrl(`/api/records?projectId=${project.id}`))
            ]);

            const activities = activitiesRes.ok ? await activitiesRes.json() : [];
            const records = recordsRes.ok ? await recordsRes.json() : [];

            setDetails({
                ...project,
                activities: activities.filter((a: any) => a.projectId === project.id),
                records: records.filter((r: any) => r.projectId === project.id)
            });
        } catch (e) {
            console.error('Error fetching project details:', e);
        } finally {
            setIsLoading(false);
        }
    };

    if (!project) return null;

    const activities = details?.activities || [];
    const records = details?.records || [];

    // Calculate stats
    const totalActivities = activities.length;
    const activitiesConcluidas = activities.filter((a: any) => a.status === 'CONCLUIDO').length;
    const activitiesEmExecucao = activities.filter((a: any) => a.status === 'EM_EXECUCAO').length;
    const progressPercentage = totalActivities > 0 ? (activitiesConcluidas / totalActivities) * 100 : 0;

    const totalInvestment = activities.reduce((acc: number, a: any) => {
        return acc + (a.assignments?.[0]?.valorPrevisto || 0);
    }, 0);

    const esbocos = records.filter((r: any) => r.type === 'ESBOCO');
    const documentos = records.reduce((acc: number, r: any) => acc + (r.documents?.length || 0), 0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{project.nome}</h2>
                            <p className="text-sm text-muted-foreground font-normal">{project.endereco || 'Endereço não informado'}</p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {/* KPI Cards Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <Card>
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-md bg-green-500/10 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">Progresso</p>
                                            <p className="text-lg font-bold">{Math.round(progressPercentage)}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <Activity className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">Atividades</p>
                                            <p className="text-lg font-bold">{totalActivities}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-md bg-purple-500/10 flex items-center justify-center shrink-0">
                                            <DollarSign className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">Investimento</p>
                                            <p className="text-lg font-bold truncate">R$ {totalInvestment.toLocaleString('pt-BR')}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center shrink-0">
                                            <Palette className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">Esboços</p>
                                            <p className="text-lg font-bold">{esbocos.length}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Progress Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <TrendingUp size={16} />
                                    Visão Geral do Progresso
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold">Status da Obra</span>
                                        <Badge>{project.status}</Badge>
                                    </div>
                                    <Progress value={progressPercentage} className="h-2" />
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-2">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Concluídas</p>
                                        <p className="text-2xl font-bold text-green-600">{activitiesConcluidas}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Em Execução</p>
                                        <p className="text-2xl font-bold text-yellow-600">{activitiesEmExecucao}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Planejadas</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {totalActivities - activitiesConcluidas - activitiesEmExecucao}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabs for different views */}
                        <Tabs defaultValue="activities" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="activities">Atividades ({totalActivities})</TabsTrigger>
                                <TabsTrigger value="records">Registros ({records.length})</TabsTrigger>
                                <TabsTrigger value="info">Informações</TabsTrigger>
                            </TabsList>

                            <TabsContent value="activities" className="space-y-2 mt-4">
                                {activities.length === 0 ? (
                                    <Card className="border-dashed">
                                        <CardContent className="flex flex-col items-center justify-center py-8">
                                            <Activity size={32} className="opacity-20 mb-2" />
                                            <p className="text-sm text-muted-foreground">Nenhuma atividade cadastrada</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                                        {activities.map((activity: any) => (
                                            <Card key={activity.id} className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-3">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-sm truncate">{activity.titulo}</p>
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {activity.descricao || 'Sem descrição'}
                                                            </p>
                                                        </div>
                                                        <Badge className={`text-[9px] h-5 shrink-0 ${activity.status === 'CONCLUIDO' ? 'bg-green-500' :
                                                                activity.status === 'EM_EXECUCAO' ? 'bg-yellow-500' :
                                                                    activity.status === 'BLOQUEADO' ? 'bg-red-500' :
                                                                        'bg-blue-500'
                                                            }`}>
                                                            {activity.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span>💰 R$ {activity.assignments?.[0]?.valorPrevisto?.toLocaleString('pt-BR') || '0'}</span>
                                                        {activity.dataFim && (
                                                            <span>📅 {format(new Date(activity.dataFim), 'dd/MM/yyyy')}</span>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="records" className="space-y-2 mt-4">
                                {records.length === 0 ? (
                                    <Card className="border-dashed">
                                        <CardContent className="flex flex-col items-center justify-center py-8">
                                            <FileText size={32} className="opacity-20 mb-2" />
                                            <p className="text-sm text-muted-foreground">Nenhum registro encontrado</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                                        {records.map((record: any) => (
                                            <Card key={record.id} className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-3">
                                                    <div className="flex items-start gap-2 mb-2">
                                                        {record.type === 'ESBOCO' ? (
                                                            <Palette className="w-4 h-4 text-purple-500 shrink-0" />
                                                        ) : (
                                                            <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-semibold line-clamp-2">{record.texto}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge variant="outline" className="text-[8px] h-4">{record.type}</Badge>
                                                                <Badge className="text-[8px] h-4">{record.prioridade}</Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="info" className="mt-4">
                                <Card>
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Cliente</p>
                                                <p className="font-semibold">{project.client?.nome || 'Não vinculado'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Status</p>
                                                <Badge>{project.status}</Badge>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Data de Criação</p>
                                                <p className="font-semibold">
                                                    {format(new Date(project.criadoEm), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Documentos Gerados</p>
                                                <p className="font-semibold">{documentos} arquivo(s)</p>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <p className="text-xs text-muted-foreground mb-2">Resumo Financeiro</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-secondary/20 rounded-md">
                                                    <p className="text-xs text-muted-foreground">Investimento Previsto</p>
                                                    <p className="text-xl font-bold">R$ {totalInvestment.toLocaleString('pt-BR')}</p>
                                                </div>
                                                <div className="p-3 bg-secondary/20 rounded-md">
                                                    <p className="text-xs text-muted-foreground">Custo médio/atividade</p>
                                                    <p className="text-xl font-bold">
                                                        R$ {totalActivities > 0 ? Math.round(totalInvestment / totalActivities).toLocaleString('pt-BR') : '0'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
