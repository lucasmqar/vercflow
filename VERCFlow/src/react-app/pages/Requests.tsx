import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { ArrowLeft, Plus, AlertCircle } from "lucide-react";
import type { Project } from "@/shared/types";
import NewRequestModal from "@/react-app/components/NewRequestModal";
import RequestDetailModal from "@/react-app/components/RequestDetailModal";

interface Request {
  id: number;
  type: string;
  category: string | null;
  title: string;
  description: string;
  status: string;
  priority: string | null;
  requested_by_name: string;
  created_at: string;
  cancellation_reason: string | null;
}

export default function RequestsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isPending } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/");
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, requestsRes] = await Promise.all([
          fetch(`/api/projects/${id}`),
          fetch(`/api/projects/${id}/requests`),
        ]);

        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProject(projectData);
        }

        const requestsData = await requestsRes.json();
        setRequests(requestsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const groupedRequests = {
    open: requests.filter(r => r.status === "open"),
    urgent: requests.filter(r => r.status === "urgent"),
    in_progress: requests.filter(r => r.status === "in_progress"),
    completed: requests.filter(r => r.status === "completed"),
    cancelled: requests.filter(r => r.status === "cancelled"),
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate(`/projects/${id}`)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Solicitações</h1>
              {project && <p className="text-xs text-slate-500">{project.name}</p>}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="grid grid-cols-4 gap-4 flex-1 mr-6">
            <StatBadge label="Abertas" count={groupedRequests.open.length} color="blue" />
            <StatBadge label="Urgentes" count={groupedRequests.urgent.length} color="red" />
            <StatBadge label="Em Progresso" count={groupedRequests.in_progress.length} color="amber" />
            <StatBadge label="Concluídas" count={groupedRequests.completed.length} color="green" />
          </div>
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Solicitação
          </button>
        </div>

        <div className="space-y-6">
          {groupedRequests.urgent.length > 0 && (
            <RequestSection
              title="Solicitações Urgentes"
              requests={groupedRequests.urgent}
              onSelect={setSelectedRequest}
            />
          )}
          {groupedRequests.open.length > 0 && (
            <RequestSection
              title="Solicitações Abertas"
              requests={groupedRequests.open}
              onSelect={setSelectedRequest}
            />
          )}
          {groupedRequests.in_progress.length > 0 && (
            <RequestSection
              title="Em Progresso"
              requests={groupedRequests.in_progress}
              onSelect={setSelectedRequest}
            />
          )}
          {groupedRequests.completed.length > 0 && (
            <RequestSection
              title="Concluídas"
              requests={groupedRequests.completed}
              onSelect={setSelectedRequest}
            />
          )}
          {groupedRequests.cancelled.length > 0 && (
            <RequestSection
              title="Canceladas"
              requests={groupedRequests.cancelled}
              onSelect={setSelectedRequest}
            />
          )}
        </div>

        {requests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">Nenhuma solicitação cadastrada</p>
            <button
              onClick={() => setShowNewRequestModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Criar Primeira Solicitação
            </button>
          </div>
        )}
      </div>

      {showNewRequestModal && (
        <NewRequestModal
          projectId={Number(id)}
          onClose={() => setShowNewRequestModal(false)}
          onSuccess={(newRequest) => {
            setRequests([newRequest, ...requests]);
            setShowNewRequestModal(false);
          }}
        />
      )}

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdate={(updated) => {
            setRequests(requests.map(r => r.id === updated.id ? updated : r));
            setSelectedRequest(updated);
          }}
        />
      )}
    </div>
  );
}

function StatBadge({ label, count, color }: { label: string; count: number; color: string }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    green: "bg-green-50 text-green-700 border-green-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div className={`px-4 py-3 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-2xl font-bold mb-1">{count}</p>
      <p className="text-xs font-medium">{label}</p>
    </div>
  );
}

function RequestSection({ 
  title, 
  requests, 
  onSelect
}: { 
  title: string; 
  requests: Request[]; 
  onSelect: (request: Request) => void;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-700 mb-3">{title}</h2>
      <div className="grid gap-3">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} onClick={() => onSelect(request)} />
        ))}
      </div>
    </div>
  );
}

function RequestCard({ request, onClick }: { request: Request; onClick: () => void }) {
  const priorityColors = {
    urgent: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-slate-100 text-slate-700",
  };

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-slate-900">{request.title}</h3>
            {request.priority && (
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[request.priority as keyof typeof priorityColors]}`}>
                {request.priority}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 line-clamp-2">{request.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>Tipo: {request.type}</span>
        <span>Por: {request.requested_by_name}</span>
        <span>{new Date(request.created_at).toLocaleDateString("pt-BR")}</span>
      </div>
    </div>
  );
}
