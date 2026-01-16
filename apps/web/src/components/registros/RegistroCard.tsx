import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  PenTool,
  FileText,
  Image,
  Clock,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  FileSignature,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Registro } from '@/types';
import { cn } from '@/lib/utils';

interface RegistroCardProps {
  registro: Registro;
  index: number;
  onView?: () => void;
  onEdit?: () => void;
  onGenerate?: () => void;
  onDelete?: () => void;
}

const typeIcons = {
  SKETCH: PenTool,
  NOTE: FileText,
  INSPECTION: AlertCircle,
  INCIDENT: AlertCircle,
  // Fallbacks
  sketch: PenTool,
  document: FileText,
  photo: Image,
  note: FileText,
};

const priorityColors = {
  LOW: 'bg-muted text-muted-foreground',
  MEDIUM: 'bg-info/15 text-info',
  HIGH: 'bg-warning/15 text-warning',
  URGENT: 'bg-destructive/15 text-destructive',
  // Fallbacks
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-info/15 text-info',
  high: 'bg-warning/15 text-warning',
  urgent: 'bg-destructive/15 text-destructive',
};

const statusIcons = {
  SENT_TO_TRIAGE: Clock,
  PROCESSING: MoreHorizontal,
  CONVERTED: CheckCircle,
  ARCHIVED: CheckCircle,
  DRAFT: PenTool,
  // Fallbacks
  pending: Clock,
  triaged: AlertCircle,
  in_progress: Clock,
  completed: CheckCircle,
};

export function RegistroCard({ registro, index, onView, onEdit, onGenerate, onDelete }: RegistroCardProps) {
  const TypeIcon = typeIcons[registro.type] || FileText;
  const StatusIcon = statusIcons[registro.status] || Clock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="group relative glass rounded-xl p-4 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex gap-4">
        {/* Thumbnail / Type Icon */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
            {registro.thumbnail ? (
              <img
                src={registro.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <TypeIcon className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          {registro.hasSketch && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <PenTool className="h-3 w-3 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-sm line-clamp-1">{registro.title}</h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={onView}>Ver detalhes</DropdownMenuItem>
                <DropdownMenuItem onSelect={onEdit}>Editar registro</DropdownMenuItem>
                <DropdownMenuItem onSelect={onGenerate}>Gerar documento</DropdownMenuItem>
                <DropdownMenuItem onSelect={onDelete} className="text-destructive">Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {registro.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {registro.obraName}
            </Badge>
            <Badge className={cn('text-[10px] px-1.5 py-0', priorityColors[registro.priority])}>
              {registro.priority === 'URGENT' ? 'Urgente' :
                registro.priority === 'HIGH' ? 'Alta' :
                  registro.priority === 'MEDIUM' ? 'Média' : 'Baixa'}
            </Badge>
            {registro.requiresSignature && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center"
                title="Requer assinatura"
              >
                <FileSignature className="h-3 w-3 text-accent" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <StatusIcon className="h-3 w-3" />
          <span>
            {format(new Date(registro.createdAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {registro.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
          {registro.tags.length > 2 && (
            <span className="text-[10px] text-muted-foreground">
              +{registro.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
