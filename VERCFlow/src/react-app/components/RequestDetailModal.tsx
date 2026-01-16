import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import type { Comment } from "@/shared/types";
import CommentList from "./CommentList";

interface Props {
  request: any;
  onClose: () => void;
  onUpdate: (request: any) => void;
}

const STATUS_OPTIONS = [
  { value: "open", label: "Aberta" },
  { value: "in_progress", label: "Em Progresso" },
  { value: "completed", label: "Concluída" },
  { value: "urgent", label: "Urgente" },
];

const QUICK_REASONS_CANCEL = [
  "Solicitação duplicada",
  "Fora do escopo do projeto",
  "Cliente cancelou a demanda",
  "Informações insuficientes",
  "Erro de lançamento",
];

export default function RequestDetailModal({ request, onClose, onUpdate }: Props) {
  const [status, setStatus] = useState(request.status);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [request.id]);

  const fetchComments = async () => {
    const response = await fetch(`/api/requests/${request.id}/comments`);
    const data = await response.json();
    setComments(data);
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updated = await response.json();
      onUpdate(updated);
    } catch (error) {
      console.error("Failed to update request:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async () => {
    const finalReason = cancelReason || customReason;
    if (!finalReason.trim()) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "cancelled",
          cancellation_reason: finalReason,
        }),
      });
      const updated = await response.json();
      onUpdate(updated);
      setShowCancelForm(false);
    } catch (error) {
      console.error("Failed to cancel request:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const isCancelled = request.status === "cancelled";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{request.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-slate-500">Tipo: {request.type}</span>
              {request.category && (
                <span className="text-xs text-slate-500">• {request.category}</span>
              )}
              <span className="text-xs text-slate-500">
                • Por {request.requested_by_name}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Descrição</h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{request.description}</p>
          </div>

          {/* Status Update */}
          {!isCancelled && (
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Status</h3>
              <div className="flex gap-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {status !== request.status && (
                  <button
                    onClick={handleUpdateStatus}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? "Atualizando..." : "Atualizar"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Cancellation Info */}
          {isCancelled && request.cancellation_reason && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-900 mb-1">Solicitação Cancelada</h3>
                  <p className="text-sm text-red-700">Motivo: {request.cancellation_reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Section */}
          {!isCancelled && (
            <div>
              {!showCancelForm ? (
                <button
                  onClick={() => setShowCancelForm(true)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Cancelar Solicitação
                </button>
              ) : (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <h3 className="text-sm font-medium text-slate-700">Motivo do Cancelamento</h3>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600">Respostas rápidas:</p>
                    {QUICK_REASONS_CANCEL.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => {
                          setCancelReason(reason);
                          setCustomReason("");
                        }}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-lg border transition-colors ${
                          cancelReason === reason
                            ? "bg-blue-50 border-blue-600 text-blue-900"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs text-slate-600 mb-2">Ou insira outro motivo:</p>
                    <input
                      type="text"
                      value={customReason}
                      onChange={(e) => {
                        setCustomReason(e.target.value);
                        setCancelReason("");
                      }}
                      placeholder="Descreva o motivo..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setShowCancelForm(false);
                        setCancelReason("");
                        setCustomReason("");
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isUpdating || (!cancelReason && !customReason.trim())}
                      className="flex-1 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? "Cancelando..." : "Confirmar Cancelamento"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comments */}
          <CommentList
            entityType="requests"
            entityId={request.id}
            comments={comments}
            onAdd={(newComment) => {
              setComments([...comments, newComment]);
            }}
          />
        </div>
      </div>
    </div>
  );
}
