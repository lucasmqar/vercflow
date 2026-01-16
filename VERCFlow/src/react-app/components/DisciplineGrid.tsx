import { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  User,
  ChevronRight
} from "lucide-react";
import type { Discipline } from "@/shared/types";
import DisciplineDetailModal from "./DisciplineDetailModal";

interface Props {
  disciplines: Discipline[];
  category: any;
  viewMode: "grid" | "list";
  onUpdate: (discipline: Discipline) => void;
}

const STATUS_CONFIG = {
  todo: { 
    label: "A Fazer", 
    icon: Circle, 
    color: "text-slate-400 bg-slate-50 border-slate-200" 
  },
  in_progress: { 
    label: "Em Andamento", 
    icon: Clock, 
    color: "text-blue-600 bg-blue-50 border-blue-200" 
  },
  in_review: { 
    label: "Em Revisão", 
    icon: Clock, 
    color: "text-amber-600 bg-amber-50 border-amber-200" 
  },
  approved: { 
    label: "Aprovado", 
    icon: CheckCircle2, 
    color: "text-green-600 bg-green-50 border-green-200" 
  },
  completed: { 
    label: "Concluído", 
    icon: CheckCircle2, 
    color: "text-green-600 bg-green-50 border-green-200" 
  },
};

export default function DisciplineGrid({ disciplines, category, viewMode, onUpdate }: Props) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);

  if (viewMode === "grid") {
    return (
      <>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {disciplines.map((discipline) => (
            <DisciplineCard
              key={discipline.id}
              discipline={discipline}
              categoryColor={category.color}
              onClick={() => setSelectedDiscipline(discipline)}
            />
          ))}
        </div>
        
        {selectedDiscipline && (
          <DisciplineDetailModal
            discipline={selectedDiscipline}
            onClose={() => setSelectedDiscipline(null)}
            onUpdate={(updated) => {
              onUpdate(updated);
              setSelectedDiscipline(updated);
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="divide-y divide-slate-100">
        {disciplines.map((discipline) => (
          <DisciplineListItem
            key={discipline.id}
            discipline={discipline}
            onClick={() => setSelectedDiscipline(discipline)}
          />
        ))}
      </div>
      
      {selectedDiscipline && (
        <DisciplineDetailModal
          discipline={selectedDiscipline}
          onClose={() => setSelectedDiscipline(null)}
          onUpdate={(updated) => {
            onUpdate(updated);
            setSelectedDiscipline(updated);
          }}
        />
      )}
    </>
  );
}

function DisciplineCard({ 
  discipline, 
  categoryColor, 
  onClick 
}: { 
  discipline: Discipline; 
  categoryColor: string; 
  onClick: () => void;
}) {
  const statusConfig = STATUS_CONFIG[discipline.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.todo;
  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl border-2 hover:shadow-lg transition-all cursor-pointer group"
      style={{ borderColor: `var(--${categoryColor}-200)` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${statusConfig.color} border`}>
          <StatusIcon className="h-5 w-5" />
        </div>
      </div>
      
      <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
        {discipline.subcategory || discipline.name}
      </h3>
      
      {discipline.description && (
        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{discipline.description}</p>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className={`text-xs font-medium ${statusConfig.color.split(' ')[0]}`}>
          {statusConfig.label}
        </span>
        {(discipline as any).assigned_to && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <User className="h-3 w-3" />
            <span>Atribuído</span>
          </div>
        )}
      </div>
    </div>
  );
}

function DisciplineListItem({ 
  discipline, 
  onClick 
}: { 
  discipline: Discipline; 
  onClick: () => void;
}) {
  const statusConfig = STATUS_CONFIG[discipline.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.todo;
  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={onClick}
      className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${statusConfig.color} border flex-shrink-0`}>
          <StatusIcon className="h-4 w-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
            {discipline.subcategory || discipline.name}
          </h3>
          {discipline.description && (
            <p className="text-sm text-slate-600 line-clamp-1">{discipline.description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className={`text-sm font-medium ${statusConfig.color.split(' ')[0]}`}>
            {statusConfig.label}
          </span>
          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </div>
  );
}
