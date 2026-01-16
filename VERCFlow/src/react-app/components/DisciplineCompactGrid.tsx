import { useState } from "react";
import {
  FileText,
  Home,
  Layers,
  Droplet,
  Zap,
  Wind,
  Flame,
  Shield,
  Fuel,
  Waves,
  Trees,
  Palette,
  List,
  Plus,
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye
} from "lucide-react";
import type { Discipline } from "@/shared/types";
import DisciplineDetailModal from "./DisciplineDetailModal";
import NewDisciplineModal from "./NewDisciplineModal";
import { DISCIPLINE_CATEGORIES } from "@/shared/disciplineTemplates";

interface Props {
  projectId: number;
  disciplines: Discipline[];
  onDisciplineAdded: (discipline: Discipline) => void;
  onDisciplineUpdated: (discipline: Discipline) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  levantamento: FileText,
  arquitetonico: Home,
  implantacao: Layers,
  estrutural: Layers,
  hidrossanitario: Droplet,
  eletrico: Zap,
  climatizacao: Wind,
  incendio: Flame,
  vigilancia: Shield,
  gas: Fuel,
  piscina: Waves,
  paisagismo: Trees,
  interiores: Palette,
  listas: List,
};

const CATEGORY_COLORS: Record<string, { from: string; to: string; border: string }> = {
  levantamento: { from: 'from-slate-500', to: 'to-slate-600', border: 'border-slate-200' },
  arquitetonico: { from: 'from-blue-500', to: 'to-blue-600', border: 'border-blue-200' },
  implantacao: { from: 'from-indigo-500', to: 'to-indigo-600', border: 'border-indigo-200' },
  estrutural: { from: 'from-violet-500', to: 'to-violet-600', border: 'border-violet-200' },
  hidrossanitario: { from: 'from-cyan-500', to: 'to-cyan-600', border: 'border-cyan-200' },
  eletrico: { from: 'from-amber-500', to: 'to-amber-600', border: 'border-amber-200' },
  climatizacao: { from: 'from-sky-500', to: 'to-sky-600', border: 'border-sky-200' },
  incendio: { from: 'from-red-500', to: 'to-red-600', border: 'border-red-200' },
  vigilancia: { from: 'from-emerald-500', to: 'to-emerald-600', border: 'border-emerald-200' },
  gas: { from: 'from-orange-500', to: 'to-orange-600', border: 'border-orange-200' },
  piscina: { from: 'from-teal-500', to: 'to-teal-600', border: 'border-teal-200' },
  paisagismo: { from: 'from-green-500', to: 'to-green-600', border: 'border-green-200' },
  interiores: { from: 'from-purple-500', to: 'to-purple-600', border: 'border-purple-200' },
  listas: { from: 'from-pink-500', to: 'to-pink-600', border: 'border-pink-200' },
};

const CATEGORY_LABELS: Record<string, string> = {
  levantamento: "Levantamento",
  arquitetonico: "Arquitetônico",
  implantacao: "Implantação",
  estrutural: "Estrutural",
  hidrossanitario: "Hidrossanitário",
  eletrico: "Elétrico",
  climatizacao: "Climatização",
  incendio: "Incêndio",
  vigilancia: "Vigilância Sanitária",
  gas: "Gás",
  piscina: "Piscina",
  paisagismo: "Paisagismo",
  interiores: "Interiores",
  listas: "Listas",
};

export default function DisciplineCompactGrid({ 
  projectId, 
  disciplines,
  onDisciplineAdded,
  onDisciplineUpdated
}: Props) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<Array<{ id: string; name: string }>>([]);

  const groupedDisciplines = disciplines.reduce((acc, discipline) => {
    if (!acc[discipline.category]) {
      acc[discipline.category] = [];
    }
    acc[discipline.category].push(discipline);
    return acc;
  }, {} as Record<string, Discipline[]>);

  const categories = Object.keys(CATEGORY_LABELS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Disciplinas do Projeto</h2>
        <button
          onClick={() => {
            setSelectedCategory("");
            setSelectedSubcategories([]);
            setShowNewModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30"
        >
          <Plus className="h-4 w-4" />
          Nova Disciplina
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => {
          const categoryDisciplines = groupedDisciplines[category] || [];
          const Icon = CATEGORY_ICONS[category] || FileText;
          const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.levantamento;
          
          const statusCounts = {
            completed: categoryDisciplines.filter(d => d.status === 'completed').length,
            inProgress: categoryDisciplines.filter(d => d.status === 'in_progress' || d.status === 'in_review').length,
            todo: categoryDisciplines.filter(d => d.status === 'todo').length,
          };

          return (
            <div
              key={category}
              className={`group bg-white rounded-2xl border ${colors.border} hover:shadow-xl transition-all overflow-hidden`}
            >
              <div className={`px-5 py-4 bg-gradient-to-br ${colors.from} ${colors.to}`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-sm">
                      {CATEGORY_LABELS[category]}
                    </h3>
                    <p className="text-xs text-white/80">
                      {categoryDisciplines.length} {categoryDisciplines.length === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {categoryDisciplines.length === 0 ? (
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      const template = DISCIPLINE_CATEGORIES.find((t: any) => t.id === category);
                      setSelectedSubcategories(template?.subcategories || []);
                      setShowNewModal(true);
                    }}
                    className="w-full px-4 py-3 border-2 border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded-xl transition-all text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 mx-auto mb-1" />
                    Adicionar
                  </button>
                ) : (
                  <div className="space-y-2">
                    {/* Status Summary */}
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                      {statusCounts.completed > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-700">{statusCounts.completed}</span>
                        </div>
                      )}
                      {statusCounts.inProgress > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                          <Clock className="h-3 w-3 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-700">{statusCounts.inProgress}</span>
                        </div>
                      )}
                      {statusCounts.todo > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                          <Circle className="h-3 w-3 text-slate-600" />
                          <span className="text-xs font-semibold text-slate-700">{statusCounts.todo}</span>
                        </div>
                      )}
                    </div>

                    {/* Discipline Items */}
                    {categoryDisciplines.slice(0, 3).map((discipline) => (
                      <DisciplineItem
                        key={discipline.id}
                        discipline={discipline}
                        onClick={() => setSelectedDiscipline(discipline)}
                      />
                    ))}

                    {categoryDisciplines.length > 3 && (
                      <button
                        className="w-full mt-2 px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center justify-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Ver mais {categoryDisciplines.length - 3}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        const template = DISCIPLINE_CATEGORIES.find((t: any) => t.id === category);
                        setSelectedSubcategories(template?.subcategories || []);
                        setShowNewModal(true);
                      }}
                      className="w-full mt-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-lg transition-all"
                    >
                      <Plus className="h-3 w-3 mx-auto" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDiscipline && (
        <DisciplineDetailModal
          discipline={selectedDiscipline}
          onClose={() => setSelectedDiscipline(null)}
          onUpdate={onDisciplineUpdated}
        />
      )}

      {showNewModal && selectedCategory && (
        <NewDisciplineModal
          projectId={projectId}
          category={selectedCategory}
          subcategories={selectedSubcategories}
          onClose={() => {
            setShowNewModal(false);
            setSelectedCategory("");
            setSelectedSubcategories([]);
          }}
          onSuccess={(discipline) => {
            onDisciplineAdded(discipline);
            setShowNewModal(false);
            setSelectedCategory("");
            setSelectedSubcategories([]);
          }}
        />
      )}
    </div>
  );
}

function DisciplineItem({ 
  discipline, 
  onClick 
}: { 
  discipline: Discipline; 
  onClick: () => void;
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />;
      case 'in_progress':
      case 'in_review':
        return <Clock className="h-3.5 w-3.5 text-blue-600" />;
      case 'approved':
        return <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />;
      case 'sent_to_authority':
      case 'awaiting_response':
        return <AlertCircle className="h-3.5 w-3.5 text-amber-600" />;
      default:
        return <Circle className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full px-3 py-2 flex items-center gap-2 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all text-left group"
    >
      <div className="flex-shrink-0">
        {getStatusIcon(discipline.status)}
      </div>
      <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 truncate">
        {discipline.name}
      </span>
    </button>
  );
}
