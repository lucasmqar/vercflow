import { useState, useEffect } from "react";
import type { User } from "@/shared/types";

interface Props {
  projectId: number;
  onClose: () => void;
  onSuccess: (request: any) => void;
}

const PREDEFINED_TYPES = [
  { value: "alteracao_projeto", label: "Alteração de projeto" },
  { value: "compatibilizacao", label: "Demanda de compatibilização" },
  { value: "duvida_tecnica", label: "Dúvida técnica" },
  { value: "aprovacao", label: "Solicitação de aprovação" },
  { value: "pergunta_orgao", label: "Pergunta para órgão (Suderv, Vigilância, Bombeiros)" },
  { value: "viabilidade", label: "Estudo de viabilidade" },
  { value: "levantamento", label: "Solicitação de levantamento ou medição" },
  { value: "reuniao", label: "Reunião técnica" },
  { value: "personalizada", label: "Solicitação personalizada" },
];

export default function NewRequestModal({ projectId, onClose, onSuccess }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType === "personalizada" ? "Personalizada" : PREDEFINED_TYPES.find(t => t.value === selectedType)?.label,
          title,
          description,
          category: category || null,
          priority,
          assigned_to: assignedTo ? Number(assignedTo) : null,
        }),
      });

      const request = await response.json();
      onSuccess(request);
    } catch (error) {
      console.error("Failed to create request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Nova Solicitação</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Solicitação *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {PREDEFINED_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setSelectedType(type.value);
                    if (type.value !== "personalizada") {
                      setTitle(type.label);
                    } else {
                      setTitle("");
                    }
                  }}
                  className={`px-4 py-3 text-left rounded-lg border-2 transition-all ${
                    selectedType === type.value
                      ? "border-blue-600 bg-blue-50 text-blue-900"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title (editable if custom) */}
          {selectedType && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={selectedType !== "personalizada"}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                placeholder="Título da solicitação"
              />
            </div>
          )}

          {/* Description */}
          {selectedType && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descrição *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva a solicitação em detalhes..."
              />
            </div>
          )}

          {/* Category and Assigned To */}
          {selectedType && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Categoria (opcional)
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Projeto Legal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Responsável (opcional)
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Priority */}
          {selectedType && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Prioridade *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedType}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Criando..." : "Criar Solicitação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
