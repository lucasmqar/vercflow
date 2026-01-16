import { useState } from "react";
import { X, Check, Sparkles } from "lucide-react";
import { DISCIPLINE_CATEGORIES, getTasksForSubcategory } from "@/shared/disciplineTemplates";
import type { Discipline } from "@/shared/types";

interface Props {
  projectId: number;
  onClose: () => void;
  onSuccess: (disciplines: Discipline[]) => void;
}

export default function QuickAddDisciplineModal({ projectId, onClose, onSuccess }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set());
  const [includeAutoTasks, setIncludeAutoTasks] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const category = DISCIPLINE_CATEGORIES.find(c => c.id === selectedCategory);

  const handleToggleSubcategory = (subcategoryId: string) => {
    const newSet = new Set(selectedSubcategories);
    if (newSet.has(subcategoryId)) {
      newSet.delete(subcategoryId);
    } else {
      newSet.add(subcategoryId);
    }
    setSelectedSubcategories(newSet);
  };

  const handleSubmit = async () => {
    if (!category || selectedSubcategories.size === 0) return;

    setIsSubmitting(true);
    try {
      const createdDisciplines: Discipline[] = [];

      for (const subcategoryId of Array.from(selectedSubcategories)) {
        const subcategory = category.subcategories.find(s => s.id === subcategoryId);
        if (!subcategory) continue;

        // Create discipline
        const disciplineRes = await fetch(`/api/projects/${projectId}/disciplines`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: category.id,
            name: category.name,
            subcategory: subcategory.name,
            description: `${category.name} - ${subcategory.name}`,
            icon: category.icon,
            color: category.color,
          }),
        });

        const discipline = await disciplineRes.json();
        createdDisciplines.push(discipline);

        // Create auto tasks if enabled
        if (includeAutoTasks) {
          const tasks = getTasksForSubcategory(subcategoryId);
          for (const task of tasks) {
            await fetch(`/api/disciplines/${discipline.id}/tasks`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: task.title,
                description: task.description,
                is_template: true,
              }),
            });
          }
        }
      }

      onSuccess(createdDisciplines);
    } catch (error) {
      console.error("Failed to create disciplines:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Adicionar Disciplinas Rapidamente</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!selectedCategory ? (
            <>
              <p className="text-slate-600 mb-4">Selecione uma categoria de projeto:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DISCIPLINE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-lg hover:border-${cat.color}-400`}
                    style={{ borderColor: `var(--${cat.color}-300)` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className={`p-2 rounded-lg bg-${cat.color}-100`}
                        style={{ backgroundColor: `var(--${cat.color}-100)` }}
                      >
                        <div className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      {cat.subcategories.length} {cat.subcategories.length === 1 ? 'opção' : 'opções'}
                    </p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{category?.name}</h3>
                  <p className="text-sm text-slate-600">Selecione as disciplinas que deseja adicionar</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedSubcategories(new Set());
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Trocar categoria
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {category?.subcategories.map((sub) => {
                  const isSelected = selectedSubcategories.has(sub.id);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleToggleSubcategory(sub.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-blue-500 bg-blue-500"
                            : "border-slate-300"
                        }`}>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{sub.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {getTasksForSubcategory(sub.id).length} tarefas sugeridas
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAutoTasks}
                    onChange={(e) => setIncludeAutoTasks(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-slate-900">Criar tarefas automaticamente</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Adiciona tarefas pré-definidas para cada disciplina selecionada, economizando tempo no setup inicial
                    </p>
                  </div>
                </label>
              </div>
            </>
          )}
        </div>

        {selectedCategory && (
          <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || selectedSubcategories.size === 0}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting 
                ? "Criando..." 
                : `Adicionar ${selectedSubcategories.size} ${selectedSubcategories.size === 1 ? 'disciplina' : 'disciplinas'}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
