import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Discipline } from "@/shared/types";
import DisciplineDetailModal from "./DisciplineDetailModal";

interface Props {
  disciplines: Discipline[];
  onUpdate: (discipline: Discipline) => void;
}

export default function DisciplineList({ disciplines, onUpdate }: Props) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);

  if (disciplines.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
        <p className="text-slate-500">Nenhuma disciplina cadastrada nesta categoria</p>
        <p className="text-sm text-slate-400 mt-1">Clique em "Nova Disciplina" para começar</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Disciplinas Cadastradas</h3>
        {disciplines.map((discipline) => (
          <DisciplineCard
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

function DisciplineCard({ discipline, onClick }: { discipline: Discipline; onClick: () => void }) {
  const statusLabels: Record<string, string> = {
    todo: "A Fazer",
    in_progress: "Em Desenvolvimento",
    in_review: "Em Revisão",
    approved: "Aprovado",
    sent_to_authority: "Enviado ao Órgão",
    awaiting_response: "Aguardando Retorno",
    completed: "Concluído",
  };

  const statusColors: Record<string, string> = {
    todo: "bg-slate-100 text-slate-700",
    in_progress: "bg-blue-100 text-blue-700",
    in_review: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    sent_to_authority: "bg-purple-100 text-purple-700",
    awaiting_response: "bg-orange-100 text-orange-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-medium text-slate-900">{discipline.name}</h4>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[discipline.status]}`}>
              {statusLabels[discipline.status]}
            </span>
          </div>
          {discipline.description && (
            <p className="text-sm text-slate-600 line-clamp-1">{discipline.description}</p>
          )}
          {discipline.current_phase && (
            <p className="text-xs text-slate-500 mt-1">Fase: {discipline.current_phase}</p>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
      </div>
    </div>
  );
}
