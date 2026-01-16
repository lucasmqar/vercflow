import { useState, useEffect } from "react";
import { 
  Plus, 
  Check, 
  Circle,
  FileText,
  Pencil,
  Ruler,
  Lightbulb,
  CheckCircle,
  Eye,
  GitMerge,
  Calculator,
  Edit2,
  User
} from "lucide-react";
import type { Task, User as UserType } from "@/shared/types";
import { TASK_CATEGORIES, getCategoryConfig } from "@/shared/taskCategories";

interface Props {
  disciplineId: number;
  tasks: Task[];
  onUpdate: (task: Task) => void;
  onAdd: (task: Task) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  documentation: FileText,
  development: Pencil,
  dimensioning: Ruler,
  concept: Lightbulb,
  approval: CheckCircle,
  review: Eye,
  coordination: GitMerge,
  calculation: Calculator,
};

export default function TaskList({ disciplineId, tasks, onUpdate, onAdd }: Props) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState("");
  const [isCreating, setIsCreating] = useState(false);

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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch(`/api/disciplines/${disciplineId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          category: newTaskCategory || null,
          assigned_to: newTaskAssignedTo ? Number(newTaskAssignedTo) : null,
        }),
      });

      const task = await response.json();
      onAdd(task);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskCategory("");
      setNewTaskAssignedTo("");
      setShowNewTask(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    const newStatus = task.status === "completed" ? "todo" : "completed";
    
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const updated = await response.json();
      onUpdate(updated);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const groupedTasks = {
    todo: tasks.filter(t => t.status === "todo" || t.status === "in_progress"),
    completed: tasks.filter(t => t.status === "completed"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">Lista de Tarefas</h3>
        <button
          onClick={() => setShowNewTask(!showNewTask)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </button>
      </div>

      {showNewTask && (
        <form onSubmit={handleCreateTask} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Título da tarefa"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Categoria (opcional)</option>
              {TASK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <select
              value={newTaskAssignedTo}
              onChange={(e) => setNewTaskAssignedTo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Responsável (opcional)</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Descrição (opcional)"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowNewTask(false)}
              className="px-3 py-1.5 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isCreating ? "Criando..." : "Criar Tarefa"}
            </button>
          </div>
        </form>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          Nenhuma tarefa cadastrada
        </div>
      ) : (
        <>
          {/* Pending Tasks */}
          {groupedTasks.todo.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Pendentes</h4>
              {groupedTasks.todo.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  users={users}
                  onToggle={handleToggleTask}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          )}

          {/* Completed Tasks */}
          {groupedTasks.completed.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Concluídas</h4>
              {groupedTasks.completed.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  users={users}
                  onToggle={handleToggleTask}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TaskItem({ 
  task, 
  users,
  onToggle,
  onUpdate
}: { 
  task: Task; 
  users: UserType[];
  onToggle: (task: Task) => void;
  onUpdate: (task: Task) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editCategory, setEditCategory] = useState(task.category || "");
  const [editAssignedTo, setEditAssignedTo] = useState(task.assigned_to?.toString() || "");
  const [isSaving, setIsSaving] = useState(false);

  const isCompleted = task.status === "completed";
  const categoryConfig = getCategoryConfig(task.category);
  const CategoryIcon = categoryConfig ? CATEGORY_ICONS[categoryConfig.id] : null;
  const assignedUser = users.find(u => u.id === task.assigned_to);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription || null,
          category: editCategory || null,
          assigned_to: editAssignedTo ? Number(editAssignedTo) : null,
        }),
      });

      const updated = await response.json();
      onUpdate(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50 space-y-3">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Categoria (opcional)</option>
            {TASK_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          <select
            value={editAssignedTo}
            onChange={(e) => setEditAssignedTo(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Responsável (opcional)</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Descrição (opcional)"
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditTitle(task.title);
              setEditDescription(task.description || "");
              setEditCategory(task.category || "");
              setEditAssignedTo(task.assigned_to?.toString() || "");
            }}
            className="px-3 py-1.5 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
        isCompleted
          ? "bg-slate-50 border-slate-200"
          : "bg-white border-slate-200 hover:border-slate-300"
      }`}
    >
      <button
        onClick={() => onToggle(task)}
        className={`mt-0.5 flex-shrink-0 transition-colors ${
          isCompleted
            ? "text-green-600"
            : "text-slate-300 hover:text-blue-600"
        }`}
      >
        {isCompleted ? (
          <Check className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      {CategoryIcon && categoryConfig && (
        <div className={`p-1.5 bg-${categoryConfig.color}-50 rounded flex-shrink-0 mt-0.5`}>
          <CategoryIcon className={`h-3.5 w-3.5 text-${categoryConfig.color}-600`} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className={`text-sm font-medium ${isCompleted ? "text-slate-500 line-through" : "text-slate-900"}`}>
            {task.title}
          </p>
          {categoryConfig && (
            <span className={`text-xs px-2 py-0.5 bg-${categoryConfig.color}-50 text-${categoryConfig.color}-700 rounded`}>
              {categoryConfig.label}
            </span>
          )}
        </div>
        {task.description && (
          <p className={`text-sm mt-1 ${isCompleted ? "text-slate-400" : "text-slate-600"}`}>
            {task.description}
          </p>
        )}
        {assignedUser && (
          <div className="flex items-center gap-1.5 mt-2">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs text-slate-600">{assignedUser.name}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsEditing(true)}
        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
        title="Editar tarefa"
      >
        <Edit2 className="h-4 w-4" />
      </button>
    </div>
  );
}
