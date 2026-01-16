import { useState } from "react";
import { Send } from "lucide-react";
import type { Comment } from "@/shared/types";

interface Props {
  entityType: string;
  entityId: number;
  comments: Comment[];
  onAdd: (comment: Comment) => void;
}

const QUICK_REPLIES = [
  "Preciso de mais informações.",
  "A tarefa foi atualizada.",
  "Enviei para revisão.",
  "Aguardando retorno do órgão público.",
  "Disciplina concluída, prosseguindo para próxima fase.",
];

export default function CommentList({ entityType, entityId, comments, onAdd }: Props) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/${entityType}/${entityId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const comment = await response.json();
      onAdd(comment);
      setContent("");
      setShowQuickReplies(false);
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setContent(reply);
    setShowQuickReplies(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-700">Comentários</h3>

      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            Nenhum comentário ainda
          </div>
        ) : (
          comments.map((comment: any) => (
            <div key={comment.id} className="flex gap-3">
              {comment.photo_url ? (
                <img
                  src={comment.photo_url}
                  alt={comment.user_name}
                  className="h-8 w-8 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {comment.user_name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-900">{comment.user_name}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(comment.created_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Replies */}
      {showQuickReplies && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-700">Respostas Rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowQuickReplies(false)}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Escrever manualmente
          </button>
        </div>
      )}

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        {!showQuickReplies && (
          <button
            type="button"
            onClick={() => setShowQuickReplies(true)}
            className="text-xs text-blue-600 hover:text-blue-700 mb-2"
          >
            Usar resposta rápida
          </button>
        )}
        <div className="flex gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva um comentário..."
            rows={2}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 self-end"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
