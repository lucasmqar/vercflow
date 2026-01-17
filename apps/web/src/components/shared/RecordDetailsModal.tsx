import React from 'react';
import { X, FileText, User, Building2, Calendar, Tag, Palette } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Record } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecordDetailsModalProps {
    record: Record | null;
    isOpen: boolean;
    onClose: () => void;
}

export function RecordDetailsModal({ record, isOpen, onClose }: RecordDetailsModalProps) {
    if (!record) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        {record.type === 'ESBOCO' ? (
                            <Palette className="w-5 h-5 text-purple-500" />
                        ) : (
                            <FileText className="w-5 h-5 text-blue-500" />
                        )}
                        Detalhes do Registro
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Header Info */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono text-xs">
                                    #{record.id.slice(-8).toUpperCase()}
                                </Badge>
                                <Badge className={
                                    record.prioridade === 'CRITICA' ? 'bg-red-500' :
                                        record.prioridade === 'ALTA' ? 'bg-orange-500' :
                                            record.prioridade === 'MEDIA' ? 'bg-yellow-500' :
                                                'bg-blue-500'
                                }>
                                    {record.prioridade}
                                </Badge>
                                <Badge variant="secondary">{record.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(record.criadoEm), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                        </div>
                        <Badge className={
                            record.status === 'RASCUNHO' ? 'bg-slate-500' :
                                record.status === 'EM_TRIAGEM' ? 'bg-yellow-500' :
                                    record.status === 'CLASSIFICADO' ? 'bg-blue-500' :
                                        record.status === 'PRIORIZADO' ? 'bg-purple-500' :
                                            record.status === 'CONVERTIDO' ? 'bg-green-500' :
                                                'bg-gray-500'
                        }>
                            {record.status}
                        </Badge>
                    </div>

                    <Separator />

                    {/* Content */}
                    <Card>
                        <CardContent className="pt-6">
                            <h4 className="font-bold mb-2">Conteúdo</h4>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {record.texto || 'Sem texto descritivo'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Autor</p>
                                        <p className="font-semibold">{record.author?.nome}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Obra</p>
                                        <p className="font-semibold">{record.project?.nome || 'Não vinculado'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sketch Preview */}
                    {record.sketch && (
                        <>
                            <Separator />
                            <Card>
                                <CardContent className="pt-6">
                                    <h4 className="font-bold mb-3 flex items-center gap-2">
                                        <Palette size={16} />
                                        Esboço Técnico
                                    </h4>
                                    {record.sketch.imageUrl && record.sketch.imageUrl !== 'data:image/png;base64,placeholder' ? (
                                        <img
                                            src={record.sketch.imageUrl}
                                            alt="Preview do esboço"
                                            className="w-full rounded-lg border"
                                        />
                                    ) : (
                                        <div className="bg-secondary/20 rounded-lg p-8 text-center">
                                            <Palette className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                            <p className="text-sm text-muted-foreground">
                                                Dados do canvas salvos • {JSON.parse(record.sketch.dataJson).objects?.length || 0} objetos
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Documents */}
                    {record.documents && record.documents.length > 0 && (
                        <>
                            <Separator />
                            <Card>
                                <CardContent className="pt-6">
                                    <h4 className="font-bold mb-3 flex items-center gap-2">
                                        <FileText size={16} />
                                        Documentos Gerados ({record.documents.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {record.documents.map((doc) => (
                                            <div key={doc.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                                                <div>
                                                    <p className="font-semibold text-sm">{doc.tipo}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Versão {doc.versao} • {format(new Date(doc.criadoEm), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                                    </p>
                                                </div>
                                                <Badge variant="secondary">{doc.status}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Fechar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
