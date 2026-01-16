import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { 
  LogOut, 
  Plus, 
  Building2,
  MessageSquarePlus,
  ChevronRight,
  Circle,
  CheckCircle2,
  Clock,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Users,
  Menu,
  X
} from "lucide-react";
import type { Project, DashboardStats, Discipline, Request } from "@/shared/types";
import NotificationBell from "@/react-app/components/NotificationBell";
import MyTasksCard from "@/react-app/components/MyTasksCard";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isPending, redirectToLogin, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectDisciplines, setProjectDisciplines] = useState<Record<number, Discipline[]>>({});
  const [recentRequests, setRecentRequests] = useState<(Request & { project_name: string })[]>([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectClient, setNewProjectClient] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      redirectToLogin();
    }
  }, [user, isPending, redirectToLogin]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes, requestsRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/projects"),
          fetch("/api/dashboard/recent-requests"),
        ]);

        const statsData = await statsRes.json();
        const projectsData = await projectsRes.json();
        const requestsData = await requestsRes.json();

        setStats(statsData);
        setProjects(projectsData);
        setRecentRequests(requestsData);

        const disciplinesMap: Record<number, Discipline[]> = {};
        await Promise.all(
          projectsData.map(async (project: Project) => {
            const res = await fetch(`/api/projects/${project.id}/disciplines`);
            const disciplines = await res.json();
            disciplinesMap[project.id] = disciplines;
          })
        );
        setProjectDisciplines(disciplinesMap);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjectName,
          client_name: newProjectClient,
        }),
      });

      const project = await response.json();
      setProjects([project, ...projects]);
      setNewProjectName("");
      setNewProjectClient("");
      setShowNewProject(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta obra? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  VERCFlow
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">Gestão de Projetos</p>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-3 sm:gap-4">
              <NotificationBell />
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white rounded-xl border border-slate-200/50 shadow-sm">
                {user?.google_user_data?.picture && (
                  <img
                    src={user.google_user_data.picture}
                    alt={user.email}
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-blue-100"
                  />
                )}
                <span className="text-xs sm:text-sm font-medium text-slate-700 hidden lg:block">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 sm:p-2.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <NotificationBell />
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-slate-200/50 mb-3">
                {user?.google_user_data?.picture && (
                  <img
                    src={user.google_user_data.picture}
                    alt={user.email}
                    className="h-8 w-8 rounded-full ring-2 ring-blue-100"
                  />
                )}
                <span className="text-sm font-medium text-slate-700">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-white rounded-lg transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatCard 
              label="Obras Ativas" 
              value={stats.projectsActive} 
              icon={Building2}
              gradient="from-blue-500 to-blue-600"
              onClick={() => {
                const element = document.getElementById('projects-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <StatCard 
              label="Pendentes" 
              value={stats.tasksPending} 
              icon={Clock}
              gradient="from-amber-500 to-orange-500"
              onClick={() => {
                const element = document.getElementById('my-tasks-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <StatCard 
              label="Concluídas" 
              value={stats.tasksCompleted} 
              icon={CheckCircle2}
              gradient="from-emerald-500 to-green-600"
              onClick={() => {
                const element = document.getElementById('my-tasks-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <StatCard 
              label="Solicitações" 
              value={stats.requestsOpen} 
              icon={MessageSquarePlus}
              gradient="from-purple-500 to-indigo-600"
              onClick={() => {
                const element = document.getElementById('recent-requests-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* My Tasks Card */}
        <div id="my-tasks-section" className="mb-6 sm:mb-8">
          <MyTasksCard />
        </div>

        {/* Projects Section */}
        <div id="projects-section" className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Obras</h2>
            </div>
            <button
              onClick={() => setShowNewProject(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              <Plus className="h-4 w-4" />
              Nova Obra
            </button>
          </div>

          {/* New Project Form */}
          {showNewProject && (
            <div className="mb-6 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-slate-200/50 shadow-xl">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Criar Nova Obra</h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome da Obra
                  </label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Ex: Residência Maria Silva"
                    required
                    autoFocus
                    className="w-full px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome do Cliente
                  </label>
                  <input
                    type="text"
                    value={newProjectClient}
                    onChange={(e) => setNewProjectClient(e.target.value)}
                    placeholder="Ex: Maria Silva"
                    className="w-full px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  />
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewProject(false)}
                    className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? "Criando..." : "Criar Obra"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                disciplines={projectDisciplines[project.id] || []}
                onNavigate={() => navigate(`/projects/${project.id}`)}
                onQuickRequest={() => navigate(`/projects/${project.id}/requests`)}
                onDelete={() => handleDeleteProject(project.id)}
              />
            ))}
          </div>

          {projects.length === 0 && !showNewProject && (
            <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl border border-slate-200/50">
              <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl w-fit mx-auto mb-4">
                <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400" />
              </div>
              <p className="text-sm sm:text-base text-slate-500 mb-4">Nenhuma obra cadastrada</p>
              <button
                onClick={() => setShowNewProject(true)}
                className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium"
              >
                Criar primeira obra
              </button>
            </div>
          )}
        </div>

        {/* Recent Requests Section */}
        {recentRequests.length > 0 && (
          <div id="recent-requests-section" className="mt-8 sm:mt-12">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg sm:rounded-xl">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Últimas Solicitações</h2>
            </div>
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <RecentRequestCard
                  key={request.id}
                  request={request}
                  onClick={() => {
                    navigate(`/projects/${request.project_id}/requests`);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon: Icon,
  gradient,
  onClick
}: { 
  label: string; 
  value: number; 
  icon: any;
  gradient: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`group p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-slate-200/50 text-left transition-all shadow-sm hover:shadow-xl ${
        onClick ? 'hover:-translate-y-1 cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className={`inline-flex p-2 sm:p-3 bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl transition-all`}>
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </div>
      <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">{label}</p>
      <p className={`text-2xl sm:text-4xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
        {value}
      </p>
    </button>
  );
}

function ProjectCard({ 
  project, 
  disciplines,
  onNavigate,
  onQuickRequest,
  onDelete
}: { 
  project: Project; 
  disciplines: Discipline[];
  onNavigate: () => void;
  onQuickRequest: () => void;
  onDelete: () => void;
}) {
  const total = disciplines.length;
  const completed = disciplines.filter(d => d.status === 'completed').length;
  const inProgress = disciplines.filter(d => d.status === 'in_progress' || d.status === 'in_review').length;
  const notStarted = disciplines.filter(d => d.status === 'todo').length;
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200/50 hover:shadow-xl transition-all overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
              {project.name}
            </h3>
            {project.client_name && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                <span className="truncate">{project.client_name}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickRequest();
              }}
              className="p-1.5 sm:p-2 text-purple-600 hover:bg-purple-50 rounded-lg sm:rounded-xl transition-all"
              title="Nova Solicitação"
            >
              <MessageSquarePlus className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all"
              title="Excluir Obra"
            >
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Progress Summary */}
        {total > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg sm:rounded-xl">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                <span className="text-xs sm:text-sm font-semibold text-emerald-700">{completed}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl">
                <Circle className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700">{notStarted}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-semibold text-blue-700">{inProgress}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Progresso</span>
                <span className="font-semibold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-green-600 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-500 py-4">Nenhuma disciplina cadastrada</p>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-slate-50 to-blue-50 border-t border-slate-200/50">
        <button
          onClick={onNavigate}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 text-sm sm:text-base"
        >
          Ver Disciplinas
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function RecentRequestCard({ 
  request, 
  onClick 
}: { 
  request: Request & { project_name: string }; 
  onClick: () => void;
}) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'urgent':
        return { 
          icon: AlertTriangle, 
          gradient: 'from-red-500 to-rose-600', 
          bg: 'from-red-50 to-rose-50', 
          text: 'text-red-700', 
          label: 'Urgente' 
        };
      case 'in_progress':
        return { 
          icon: Clock, 
          gradient: 'from-amber-500 to-orange-500', 
          bg: 'from-amber-50 to-orange-50', 
          text: 'text-amber-700', 
          label: 'Em Andamento' 
        };
      case 'completed':
        return { 
          icon: CheckCircle2, 
          gradient: 'from-emerald-500 to-green-600', 
          bg: 'from-emerald-50 to-green-50', 
          text: 'text-emerald-700', 
          label: 'Concluída' 
        };
      default:
        return { 
          icon: MessageSquarePlus, 
          gradient: 'from-blue-500 to-indigo-600', 
          bg: 'from-blue-50 to-indigo-50', 
          text: 'text-blue-700', 
          label: 'Aberta' 
        };
    }
  };

  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;

  return (
    <button
      onClick={onClick}
      className="w-full p-4 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-slate-200/50 hover:shadow-xl transition-all text-left group"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`p-2 sm:p-3 bg-gradient-to-br ${statusConfig.bg} rounded-lg sm:rounded-xl flex-shrink-0`}>
          <StatusIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${statusConfig.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
              {request.title}
            </h4>
            <span className={`text-xs font-medium ${statusConfig.text} bg-gradient-to-br ${statusConfig.bg} px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap w-fit`}>
              {statusConfig.label}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mb-3 line-clamp-2">{request.description}</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="truncate max-w-[150px] sm:max-w-none">{request.project_name}</span>
            </span>
            <span>{new Date(request.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
