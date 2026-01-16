import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import type { User } from "@/shared/types";

interface Props {
  entityType: string;
  entityId: number;
}

interface RaciAssignment {
  id: number;
  user_id: number;
  role: string;
  user_name: string;
  email: string;
  cargo: string;
  photo_url: string | null;
}

const ROLES = [
  { value: "responsible", label: "Responsável (R)", description: "Quem executa a tarefa" },
  { value: "accountable", label: "Aprovador (A)", description: "Quem valida e assina" },
  { value: "consulted", label: "Consultado (C)", description: "Quem participa com opinião" },
  { value: "informed", label: "Informado (I)", description: "Quem acompanha o progresso" },
];

export default function RaciAssignments({ entityType, entityId }: Props) {
  const [assignments, setAssignments] = useState<RaciAssignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [entityType, entityId]);

  const fetchData = async () => {
    try {
      const [assignmentsRes, usersRes] = await Promise.all([
        fetch(`/api/${entityType}/${entityId}/raci`),
        fetch("/api/users"),
      ]);

      const assignmentsData = await assignmentsRes.json();
      const usersData = await usersRes.json();

      setAssignments(assignmentsData);
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch RACI data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/${entityType}/${entityId}/raci`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(selectedUserId),
          role: selectedRole,
        }),
      });

      const newAssignment = await response.json();
      setAssignments([...assignments, newAssignment]);
      setSelectedUserId("");
      setSelectedRole("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add RACI assignment:", error);
    }
  };

  const handleRemove = async (assignmentId: number) => {
    try {
      await fetch(`/api/raci/${assignmentId}`, { method: "DELETE" });
      setAssignments(assignments.filter(a => a.id !== assignmentId));
    } catch (error) {
      console.error("Failed to remove RACI assignment:", error);
    }
  };

  const getRoleLabel = (role: string) => {
    return ROLES.find(r => r.value === role)?.label || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      responsible: "bg-blue-100 text-blue-700",
      accountable: "bg-purple-100 text-purple-700",
      consulted: "bg-amber-100 text-amber-700",
      informed: "bg-slate-100 text-slate-700",
    };
    return colors[role as keyof typeof colors] || "bg-slate-100 text-slate-700";
  };

  if (isLoading) {
    return <div className="text-sm text-slate-500">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-700">Matriz RACI</h3>
          <p className="text-xs text-slate-500 mt-1">Defina responsabilidades para esta disciplina</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Usuário</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Selecione...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.cargo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Papel</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Selecione...</option>
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label} - {role.description}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Adicionar
            </button>
          </div>
        </form>
      )}

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          Nenhuma atribuição RACI definida
        </div>
      ) : (
        <div className="space-y-2">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {assignment.photo_url ? (
                  <img
                    src={assignment.photo_url}
                    alt={assignment.user_name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                    {assignment.user_name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-slate-900">{assignment.user_name}</p>
                  <p className="text-xs text-slate-500">{assignment.cargo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(assignment.role)}`}>
                  {getRoleLabel(assignment.role)}
                </span>
                <button
                  onClick={() => handleRemove(assignment.id)}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
