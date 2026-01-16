import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  CheckSquare, 
  Circle, 
  Check,
  FileText,
  Pencil,
  Ruler,
  Lightbulb,
  CheckCircle,
  Eye,
  GitMerge,
  Calculator,
  ChevronRight
} from "lucide-react";
import { getCategoryConfig } from "@/shared/taskCategories";

interface MyTask {
  id: number;
  title: string;
  description: string | null;
  status: string;
  category: string | null;
  discipline_name: string;
  discipline_category: string;
  project_name: string;
  project_id: number;
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

export default function MyTasksCard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<MyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/users/me/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleToggleTask = async (task: MyTask) => {
    const newStatus = task.status === "completed" ? "todo" : "completed";
    
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, status: newStatus } : t
      ));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Minhas Tarefas</h3>
            <p className="text-sm text-slate-600">
              {tasks.length} {tasks.length === 1 ? 'tarefa atribuída' : 'tarefas atribuídas'}
            </p>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl w-fit mx-auto mb-4">
            <CheckSquare className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm">Nenhuma tarefa atribuída a você</p>
        </div>
      ) : (
        <div className="p-6 space-y-3">
          {tasks.slice(0, 5).map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => handleToggleTask(task)}
              onNavigate={() => navigate(`/projects/${task.project_id}`)}
            />
          ))}
          
          {tasks.length > 5 && (
            <button
              onClick={() => navigate('/my-tasks')}
              className="w-full mt-4 px-4 py-3 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Ver todas as tarefas
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TaskItem({ 
  task, 
  onToggle, 
  onNavigate 
}: { 
  task: MyTask; 
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const isCompleted = task.status === "completed";
  const categoryConfig = getCategoryConfig(task.category);
  const CategoryIcon = categoryConfig ? CATEGORY_ICONS[categoryConfig.id] : null;

  return (
    <div
      className={`group p-4 rounded-xl border transition-all ${
        isCompleted
          ? "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
          : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`mt-1 flex-shrink-0 transition-all ${
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
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {CategoryIcon && categoryConfig && (
                <div className={`p-1.5 bg-gradient-to-br from-${categoryConfig.color}-50 to-${categoryConfig.color}-100 rounded-lg`}>
                  <CategoryIcon className={`h-3.5 w-3.5 text-${categoryConfig.color}-600`} />
                </div>
              )}
              <p className={`text-sm font-semibold ${isCompleted ? "text-slate-500 line-through" : "text-slate-900"}`}>
                {task.title}
              </p>
            </div>
            {categoryConfig && (
              <span className={`text-xs px-2 py-1 bg-gradient-to-br from-${categoryConfig.color}-50 to-${categoryConfig.color}-100 text-${categoryConfig.color}-700 rounded-lg font-medium whitespace-nowrap`}>
                {categoryConfig.label}
              </span>
            )}
          </div>

          {task.description && (
            <p className={`text-sm mb-2 line-clamp-2 ${isCompleted ? "text-slate-400" : "text-slate-600"}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="px-2 py-1 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 rounded-lg font-medium">
              {task.project_name}
            </span>
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg">
              {task.discipline_name}
            </span>
          </div>
        </div>

        <button
          onClick={onNavigate}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
