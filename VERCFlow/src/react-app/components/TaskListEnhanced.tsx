import { useState } from "react";
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
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import type { Task, User } from "@/shared/types";
import { TASK_CATEGORIES, getCategoryConfig } from "@/shared/taskCategories";
import { getTasksForSubcategory } from "@/shared/disciplineTemplates";

interface Props {
  disciplineId: number;
  tasks: Task[];
  users: User[];
  onUpdate: (task: Task) => void;
  onAdd: (task: Task) => void;
  onDelete: (taskId: number) => void;
  subcategory?: string;
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

export default function TaskListEnhanced({ 
  disciplineId, 
  tasks, 
  users,
  onUpdate, 
  onAdd,
  onDelete,
  subcategory = ""
}: Props) {
  const [showNewTask, setShowNewTask] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState<number | null>(null);

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
          assigned_to: newTaskAssignedTo,
        }),
      });

      const task = await response.json();
      onAdd(task);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskCategory("");
      setNewTaskAssignedTo(null);
      setShowNewTask(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateFromSuggestion = async (suggestion: { title: string; description: string }) => {
    try {
      const response = await fetch(`/api/disciplines/${disciplineId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: suggestion.title,
          description: suggestion.description,
          category: "development",
        }),
      });

      const task = await response.json();
      onAdd(task);
    } catch (error) {
      console.error("Failed to create task from suggestion:", error);
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

  const handleUpdateTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          category: editCategory || null,
          assigned_to: editAssignedTo,
        }),
      });

      const updated = await response.json();
      onUpdate(updated);
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      onDelete(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditCategory(task.category || "");
    setEditAssignedTo(task.assigned_to || null);
  };

  const groupedTasks = {
    todo: tasks.filter(t => t.status === "todo" || t.status === "in_progress"),
    completed: tasks.filter(t => t.status === "completed"),
  };

  // Get suggestions based on discipline subcategory
  const subcategoryId = subcategory.toLowerCase().replace(/\s+/g, '_').replace(/\//g, '_');
  const suggestions = getTasksForSubcategory(subcategoryId);
  const existingTitles = tasks.map(t => t.title.toLowerCase());
  const filteredSuggestions = suggestions.filter(
    s => !existingTitles.includes(s.title.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-slate-700">Lista de Tarefas</h3>
        <button
          onClick={() => setShowNewTask(!showNewTask)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-md shadow-blue-500/30"
        >
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </button>
      </div>

      {/* Task Suggestions */}
      {filteredSuggestions.length > 0 && (
        <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200/50">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">
                Sugestões de Tarefas ({filteredSuggestions.length})
              </span>
            </div>
            {showSuggestions ? (
              <ChevronUp className="h-4 w-4 text-purple-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-purple-600" />
            )}
          </button>
          
          {showSuggestions && (
            <div className="space-y-2">
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 bg-white rounded-lg border border-purple-200/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 mb-1">
                      {suggestion.title}
                    </p>
                    <p className="text-xs text-slate-600">
                      {suggestion.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCreateFromSuggestion(suggestion)}
                    className="w-full sm:w-auto px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="h-3 w-3" />
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Task Form */}
      {showNewTask && (
        <form onSubmit={handleCreateTask} className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200/50 space-y-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Título da tarefa"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              value={newTaskAssignedTo || ""}
              onChange={(e) => setNewTaskAssignedTo(e.target.value ? Number(e.target.value) : null)}
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
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => setShowNewTask(false)}
              className="w-full sm:w-auto px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full sm:w-auto px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isCreating ? "Criando..." : "Criar Tarefa"}
            </button>
          </div>
        </form>
      )}

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200/50">
          <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl w-fit mx-auto mb-3">
            <CheckCircle className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm">Nenhuma tarefa cadastrada</p>
        </div>
      ) : (
        <>
          {/* Pending Tasks */}
          {groupedTasks.todo.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Pendentes ({groupedTasks.todo.length})
              </h4>
              {groupedTasks.todo.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  users={users}
                  isEditing={editingTask === task.id}
                  editTitle={editTitle}
                  editDescription={editDescription}
                  editCategory={editCategory}
                  editAssignedTo={editAssignedTo}
                  onToggle={() => handleToggleTask(task)}
                  onEdit={() => startEdit(task)}
                  onCancelEdit={() => setEditingTask(null)}
                  onSaveEdit={() => handleUpdateTask(task.id)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onEditTitleChange={setEditTitle}
                  onEditDescriptionChange={setEditDescription}
                  onEditCategoryChange={setEditCategory}
                  onEditAssignedToChange={setEditAssignedTo}
                />
              ))}
            </div>
          )}

          {/* Completed Tasks */}
          {groupedTasks.completed.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Concluídas ({groupedTasks.completed.length})
              </h4>
              {groupedTasks.completed.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  users={users}
                  isEditing={editingTask === task.id}
                  editTitle={editTitle}
                  editDescription={editDescription}
                  editCategory={editCategory}
                  editAssignedTo={editAssignedTo}
                  onToggle={() => handleToggleTask(task)}
                  onEdit={() => startEdit(task)}
                  onCancelEdit={() => setEditingTask(null)}
                  onSaveEdit={() => handleUpdateTask(task.id)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onEditTitleChange={setEditTitle}
                  onEditDescriptionChange={setEditDescription}
                  onEditCategoryChange={setEditCategory}
                  onEditAssignedToChange={setEditAssignedTo}
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
  isEditing,
  editTitle,
  editDescription,
  editCategory,
  editAssignedTo,
  onToggle,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onEditTitleChange,
  onEditDescriptionChange,
  onEditCategoryChange,
  onEditAssignedToChange,
}: { 
  task: Task;
  users: User[];
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  editCategory: string;
  editAssignedTo: number | null;
  onToggle: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
  onEditTitleChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onEditCategoryChange: (value: string) => void;
  onEditAssignedToChange: (value: number | null) => void;
}) {
  const isCompleted = task.status === "completed";
  const categoryConfig = getCategoryConfig(task.category);
  const CategoryIcon = categoryConfig ? CATEGORY_ICONS[categoryConfig.id] : null;
  const assignedUser = users.find(u => u.id === task.assigned_to);

  if (isEditing) {
    return (
      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 space-y-3">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => onEditTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <select
            value={editCategory}
            onChange={(e) => onEditCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Categoria</option>
            {TASK_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          <select
            value={editAssignedTo || ""}
            onChange={(e) => onEditAssignedToChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Responsável</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={editDescription}
          onChange={(e) => onEditDescriptionChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Descrição"
        />
        <div className="flex flex-col-reverse sm:flex-row gap-2">
          <button
            onClick={onCancelEdit}
            className="w-full sm:w-auto px-3 py-1.5 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSaveEdit}
            className="w-full sm:w-auto px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex flex-col sm:flex-row items-start gap-3 p-4 rounded-xl border transition-all ${
        isCompleted
          ? "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
          : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg"
      }`}
    >
      <button
        onClick={onToggle}
        className={`mt-0.5 flex-shrink-0 transition-all ${
          isCompleted
            ? "text-emerald-600"
            : "text-slate-300 hover:text-blue-600 hover:scale-110"
        }`}
      >
        {isCompleted ? (
          <div className="p-0.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full">
            <Check className="h-4 w-4 text-white" />
          </div>
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {CategoryIcon && categoryConfig && (
            <div className={`p-1.5 bg-gradient-to-br from-${categoryConfig.color}-50 to-${categoryConfig.color}-100 rounded-lg`}>
              <CategoryIcon className={`h-3.5 w-3.5 text-${categoryConfig.color}-600`} />
            </div>
          )}
          <p className={`text-sm font-semibold ${isCompleted ? "text-slate-500 line-through" : "text-slate-900"}`}>
            {task.title}
          </p>
          {categoryConfig && (
            <span className={`text-xs px-2 py-0.5 bg-gradient-to-br from-${categoryConfig.color}-50 to-${categoryConfig.color}-100 text-${categoryConfig.color}-700 rounded-lg font-medium`}>
              {categoryConfig.label}
            </span>
          )}
        </div>

        {task.description && (
          <p className={`text-sm mb-2 ${isCompleted ? "text-slate-400" : "text-slate-600"}`}>
            {task.description}
          </p>
        )}

        {assignedUser && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">
              👤 {assignedUser.name}
            </span>
          </div>
        )}
      </div>

      {!isCompleted && (
        <div className="flex sm:flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity w-full sm:w-auto">
          <button
            onClick={onEdit}
            className="flex-1 sm:flex-none p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="flex-1 sm:flex-none p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
