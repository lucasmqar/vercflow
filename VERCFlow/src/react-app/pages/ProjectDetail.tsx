import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { 
  ArrowLeft, 
  MessageSquare, 
  Info,
  Building2,
  CheckSquare
} from "lucide-react";
import type { Project, Discipline } from "@/shared/types";
import DisciplineCompactGrid from "@/react-app/components/DisciplineCompactGrid";
import ProjectRequests from "@/react-app/components/ProjectRequests";
import ProjectInfo from "@/react-app/components/ProjectInfo";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [activeTab, setActiveTab] = useState<"disciplines" | "requests" | "info">("disciplines");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, disciplinesRes] = await Promise.all([
          fetch(`/api/projects/${id}`),
          fetch(`/api/projects/${id}/disciplines`),
        ]);

        const projectData = await projectRes.json();
        const disciplinesData = await disciplinesRes.json();

        setProject(projectData);
        setDisciplines(disciplinesData);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">Projeto não encontrado</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "disciplines" as const, label: "Disciplinas", icon: CheckSquare },
    { id: "requests" as const, label: "Solicitações", icon: MessageSquare },
    { id: "info" as const, label: "Informações", icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{project.name}</h1>
                  {project.client_name && (
                    <p className="text-sm text-slate-500">{project.client_name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-slate-200/50 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
                    activeTab === tab.id
                      ? "text-blue-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "disciplines" && (
          <DisciplineCompactGrid
            projectId={Number(id)}
            disciplines={disciplines}
            onDisciplineAdded={(discipline) => {
              setDisciplines([...disciplines, discipline]);
            }}
            onDisciplineUpdated={(updatedDiscipline) => {
              setDisciplines(
                disciplines.map((d) =>
                  d.id === updatedDiscipline.id ? updatedDiscipline : d
                )
              );
            }}
          />
        )}

        {activeTab === "requests" && (
          <ProjectRequests projectId={Number(id)} />
        )}

        {activeTab === "info" && (
          <ProjectInfo
            project={project}
            onUpdate={(updatedProject) => {
              setProject(updatedProject);
            }}
          />
        )}
      </div>
    </div>
  );
}
