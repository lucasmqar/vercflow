import { useEffect, useState } from "react";
import { Plus, MessageCircle, User } from "lucide-react";

interface Movement {
  id: number;
  task_id: number;
  user_id: number;
  user_name: string;
  user_photo: string | null;
  movement_type: string;
  description: string | null;
  created_at: string;
}

interface Props {
  taskId: number;
}

const MOVEMENT_TYPES = [
  { id: "update", label: "Atualização" },
  { id: "comment", label: "Comentário" },
  { id: "progress", label: "Progresso" },
  { id: "review", label: "Revisão" },
  { id: "approval", label: "Aprovação" },
  { id: "question", label: "Dúvida" },
  { id: "issue", label: "Problema" },
];

export default function TaskMovements({ taskId }: Props) {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [movementType, setMovementType] = useState("update");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMovements();
  }, [taskId]);

  const fetchMovements = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/movements`);
      const data = await response.json();
      setMovements(data);
    } catch (error) {
      console.error("Failed to fetch movements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/tasks/${taskId}/movements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movement_type: movementType,
          description,
        }),
      });

      const newMovement = await response.json();
      setMovements([newMovement, ...movements]);
      setDescription("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create movement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4 text-slate-500">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Movimentações</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-lg space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipo
            </label>
            <select
              value={movementType}
              onChange={(e) => setMovementType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MOVEMENT_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a movimentação..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {movements.length === 0 ? (
          <div className="text-center py-6 text-slate-500">
            <MessageCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm">Nenhuma movimentação registrada</p>
          </div>
        ) : (
          movements.map((movement) => (
            <MovementCard key={movement.id} movement={movement} />
          ))
        )}
      </div>
    </div>
  );
}

function MovementCard({ movement }: { movement: Movement }) {
  const typeLabel = MOVEMENT_TYPES.find(t => t.id === movement.movement_type)?.label || movement.movement_type;

  return (
    <div className="flex gap-3 p-3 bg-white border border-slate-200 rounded-lg">
      <div className="flex-shrink-0">
        {movement.user_photo ? (
          <img
            src={movement.user_photo}
            alt={movement.user_name}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
            <User className="h-4 w-4 text-slate-500" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <div>
            <span className="font-medium text-slate-900">{movement.user_name}</span>
            <span className="text-slate-500 text-sm ml-2">• {typeLabel}</span>
          </div>
          <span className="text-xs text-slate-500">
            {new Date(movement.created_at).toLocaleDateString('pt-BR')}
          </span>
        </div>
        {movement.description && (
          <p className="text-sm text-slate-600">{movement.description}</p>
        )}
      </div>
    </div>
  );
}
