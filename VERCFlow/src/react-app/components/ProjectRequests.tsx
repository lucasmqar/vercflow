import { useEffect, useState } from "react";
import { Plus, MessageSquare, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Request } from "@/shared/types";
import NewRequestModal from "./NewRequestModal";
import RequestDetailModal from "./RequestDetailModal";

interface Props {
  projectId: number;
}

const STATUS_CONFIG = {
  open: {
    label: "Aberta",
    icon: MessageSquare,
    color: "blue",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  urgent: {
    label: "Urgente",
    icon: AlertCircle,
    color: "red",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  },
  in_progress: {
    label: "Em Andamento",
    icon: Clock,
    color: "amber",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
  },
  completed: {
    label: "Concluída",
    icon: CheckCircle2,
    color: "green",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  cancelled: {
    label: "Cancelada",
    icon: XCircle,
    color: "slate",
    bgColor: "bg-slate-50",
    textColor: "text-slate-600",
  },
};

export default function ProjectRequests({ projectId }: Props) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [projectId]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/requests`);
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedRequests = {
    active: requests.filter(r => r.status === "open" || r.status === "urgent" || r.status === "in_progress"),
    completed: requests.filter(r => r.status === "completed"),
    cancelled: requests.filter(r => r.status === "cancelled"),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Solicitações</h2>
            <p className="text-sm text-slate-600 mt-1">
              Gerencie alterações, dúvidas e pendências da obra
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Solicitação
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">Nenhuma solicitação cadastrada</p>
            <button
              onClick={() => setShowNewModal(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Criar primeira solicitação
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Requests */}
            {groupedRequests.active.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-700 uppercase tracking-wide">
                  Ativas ({groupedRequests.active.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groupedRequests.active.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onClick={() => setSelectedRequest(request)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Requests */}
            {groupedRequests.completed.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-700 uppercase tracking-wide">
                  Concluídas ({groupedRequests.completed.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groupedRequests.completed.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onClick={() => setSelectedRequest(request)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled Requests */}
            {groupedRequests.cancelled.length > 0 && (
              <details className="space-y-3">
                <summary className="text-sm font-medium text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700">
                  Canceladas ({groupedRequests.cancelled.length})
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {groupedRequests.cancelled.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onClick={() => setSelectedRequest(request)}
                    />
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      {showNewModal && (
        <NewRequestModal
          projectId={projectId}
          onClose={() => setShowNewModal(false)}
          onSuccess={(newRequest) => {
            setRequests([newRequest, ...requests]);
            setShowNewModal(false);
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
    </>
  );
}

function RequestCard({ request, onClick }: { request: Request; onClick: () => void }) {
  const statusConfig = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.open;
  const StatusIcon = statusConfig.icon;

  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all text-left group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`flex items-center gap-2 px-2 py-1 ${statusConfig.bgColor} rounded-lg`}>
          <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.textColor}`} />
          <span className={`text-xs font-medium ${statusConfig.textColor}`}>
            {statusConfig.label}
          </span>
        </div>
        {request.type && (
          <span className="text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded">
            {request.type}
          </span>
        )}
      </div>

      <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
        {request.title}
      </h4>

      <p className="text-sm text-slate-600 line-clamp-2 mb-2">
        {request.description}
      </p>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {new Date(request.created_at).toLocaleDateString('pt-BR')}
        </span>
        {request.due_date && (
          <span>
            Prazo: {new Date(request.due_date).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>
    </button>
  );
}
