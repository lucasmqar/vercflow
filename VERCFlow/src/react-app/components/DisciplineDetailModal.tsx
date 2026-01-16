import { useState, useEffect } from "react";
import { X, CheckCircle2, MessageSquare, Users, Edit2 } from "lucide-react";
import type { Discipline, Task, Comment, User } from "@/shared/types";
import TaskListEnhanced from "./TaskListEnhanced";
import CommentList from "./CommentList";
import RaciAssignments from "./RaciAssignments";

interface Props {
  discipline: Discipline;
  onClose: () => void;
  onUpdate: (discipline: Discipline) => void;
}

const STATUS_OPTIONS = [
  { value: "todo", label: "A Fazer" },
  { value: "in_progress", label: "Em Desenvolvimento" },
  { value: "in_review", label: "Em Revisão" },
  { value: "approved", label: "Aprovado Internamente" },
  { value: "sent_to_authority", label: "Enviado ao Órgão" },
  { value: "awaiting_response", label: "Aguardando Retorno" },
  { value: "completed", label: "Concluído" },
];

export default function DisciplineDetailModal({ discipline, onClose, onUpdate }: Props) {
  const [activeTab, setActiveTab] = useState<"tasks" | "comments" | "raci">("tasks");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<string>(discipline.status);
  const [currentPhase, setCurrentPhase] = useState(discipline.current_phase || "");
  const [assignedTo, setAssignedTo] = useState<number | null>((discipline as any).assigned_to || null);
  const [description, setDescription] = useState(discipline.description || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [discipline.id]);

  const fetchData = async () => {
    const [tasksRes, commentsRes, usersRes] = await Promise.all([
      fetch(`/api/disciplines/${discipline.id}/tasks`),
      fetch(`/api/disciplines/${discipline.id}/comments`),
      fetch(`/api/users`),
    ]);
    
    const tasksData = await tasksRes.json();
    const commentsData = await commentsRes.json();
    const usersData = await usersRes.json();
    
    setTasks(tasksData);
    setComments(commentsData);
    setUsers(usersData);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/disciplines/${discipline.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          current_phase: currentPhase,
          assigned_to: assignedTo,
          description,
        }),
      });
      const updated = await response.json();
      onUpdate(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update discipline:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const tasksCompleted = tasks.filter(t => t.status === "completed").length;
  const tasksTotal = tasks.length;
  const assignedUser = users.find(u => u.id === assignedTo);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-5xl w-full my-4 sm:my-0 sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {discipline.subcategory || discipline.name}
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 truncate">{discipline.name}</p>
              {assignedUser && !isEditing && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                    <Users className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">{assignedUser.name}</span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Edit Section */}
        {isEditing && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-slate-50 to-blue-50 border-b border-slate-200 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Responsável</label>
                <select
                  value={assignedTo || ""}
                  onChange={(e) => setAssignedTo(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Não atribuído</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.cargo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Fase Atual</label>
              <input
                type="text"
                value={currentPhase}
                onChange={(e) => setCurrentPhase(e.target.value)}
                placeholder="Ex: Desenvolvimento inicial"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Observações</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Detalhes ou observações sobre esta disciplina"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="w-full sm:w-auto px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 shadow-md shadow-blue-500/30"
              >
                {isUpdating ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-slate-200 overflow-x-auto">
          <div className="flex px-4 sm:px-6 min-w-max">
            <TabButton
              active={activeTab === "tasks"}
              onClick={() => setActiveTab("tasks")}
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Tarefas"
              badge={tasksTotal > 0 ? `${tasksCompleted}/${tasksTotal}` : undefined}
            />
            <TabButton
              active={activeTab === "comments"}
              onClick={() => setActiveTab("comments")}
              icon={<MessageSquare className="h-4 w-4" />}
              label="Comentários"
              badge={comments.length > 0 ? String(comments.length) : undefined}
            />
            <TabButton
              active={activeTab === "raci"}
              onClick={() => setActiveTab("raci")}
              icon={<Users className="h-4 w-4" />}
              label="RACI"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === "tasks" && (
            <TaskListEnhanced
              disciplineId={discipline.id}
              tasks={tasks}
              users={users}
              onUpdate={(updated) => {
                setTasks(tasks.map(t => t.id === updated.id ? updated : t));
              }}
              onAdd={(newTask) => {
                setTasks([...tasks, newTask]);
              }}
              onDelete={(taskId) => {
                setTasks(tasks.filter(t => t.id !== taskId));
              }}
              subcategory={discipline.subcategory || ""}
            />
          )}
          {activeTab === "comments" && (
            <CommentList
              entityType="disciplines"
              entityId={discipline.id}
              comments={comments}
              onAdd={(newComment) => {
                setComments([...comments, newComment]);
              }}
            />
          )}
          {activeTab === "raci" && (
            <RaciAssignments
              entityType="disciplines"
              entityId={discipline.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ 
  active, 
  onClick, 
  icon, 
  label, 
  badge 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string; 
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-slate-600 hover:text-slate-900"
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
          {badge}
        </span>
      )}
    </button>
  );
}
