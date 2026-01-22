import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Building,
  FileText,
  Users,
  Briefcase,
  CheckSquare,
  ArrowRight,
  Inbox,
  PenTool,
  PlusCircle,
  Gavel
} from 'lucide-react';
import { obras, registros, profissionais, tasks, clients } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (item: SearchResult) => void;
}

type SearchResult = {
  id: string;
  type: 'obra' | 'registro' | 'profissional' | 'task' | 'client' | 'action';
  title: string;
  subtitle: string;
  icon: React.ElementType;
};

const quickActions: SearchResult[] = [
  { id: 'new-registro', type: 'action', title: 'Novo Registro', subtitle: 'Capturar ocorrência ou inspeção', icon: PlusCircle },
  { id: 'new-sketch', type: 'action', title: 'Novo Esboço', subtitle: 'Abrir canvas de desenho', icon: PenTool },
  { id: 'inbox', type: 'action', title: 'Ir para Inbox', subtitle: 'Registros aguardando triagem', icon: Inbox },
  { id: 'new-obra', type: 'action', title: 'Nova Obra', subtitle: 'Cadastrar novo empreendimento', icon: Building },
];

export function CommandPalette({ isOpen, onClose, onSelect }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  // const navigate = useNavigate(); // Hook if we had routing set up for all items

  const results = useMemo(() => {
    if (!query.trim()) return quickActions;

    const q = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search clients
    clients?.filter((c: any) => (c.nome || '').toLowerCase().includes(q))
      .forEach((c: any) => searchResults.push({
        id: c.id,
        type: 'client',
        title: c.nome,
        subtitle: 'Cliente / Contratante',
        icon: Briefcase,
      }));

    // Search obras
    obras.filter((o) => o.name.toLowerCase().includes(q) || o.address.toLowerCase().includes(q))
      .forEach((o) => searchResults.push({
        id: o.id,
        type: 'obra',
        title: o.name,
        subtitle: o.address,
        icon: Building,
      }));

    // Search registros
    registros.filter((r) => r.title.toLowerCase().includes(q))
      .forEach((r) => searchResults.push({
        id: r.id,
        type: 'registro',
        title: r.title,
        subtitle: `${r.obraName} • ${r.status}`,
        icon: FileText,
      }));

    // Search profissionais
    profissionais.filter((p) => p.name.toLowerCase().includes(q) || p.specialty.toLowerCase().includes(q))
      .forEach((p) => searchResults.push({
        id: p.id,
        type: 'profissional',
        title: p.name,
        subtitle: p.specialty,
        icon: Users,
      }));

    // Search tasks
    tasks.filter((t) => t.title.toLowerCase().includes(q))
      .forEach((t) => searchResults.push({
        id: t.id,
        type: 'task',
        title: t.title,
        subtitle: `Tarefa • ${t.status}`,
        icon: CheckSquare,
      }));

    return searchResults.slice(0, 10);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      // Handle selection
      console.log('Selected:', results[selectedIndex]);
      if (onSelect) onSelect(results[selectedIndex]);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/60 backdrop-blur-sm"
          />

          {/* Palette */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-xl"
            >
              <div className="bg-popover rounded-[4px] shadow-2xl overflow-hidden border border-border ring-1 ring-black/5">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Buscar..."
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      <span className="text-xs">ESC</span>
                    </kbd>
                  </div>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto py-2">
                  {!query && (
                    <div className="px-4 py-2">
                      <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">
                        Sugestões
                      </span>
                    </div>
                  )}

                  {results.map((result, index) => {
                    const Icon = result.icon;
                    const isSelected = index === selectedIndex;

                    return (
                      <div
                        key={`${result.type}-${result.id}`}
                        onClick={() => {
                          console.log('Click select:', result);
                          if (onSelect) onSelect(result);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-l-2',
                          isSelected
                            ? 'bg-primary/5 border-primary'
                            : 'border-transparent hover:bg-muted/30'
                        )}
                      >
                        <div
                          className={cn(
                            'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className={cn("text-sm font-medium truncate", isSelected ? "text-primary" : "text-foreground")}>
                            {result.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                        </div>
                        {isSelected && (
                          <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </div>
                    );
                  })}

                  {query && results.length === 0 && (
                    <div className="px-4 py-12 text-center text-muted-foreground">
                      <p className="text-sm">Sem resultados para "{query}"</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="hidden sm:flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/20">
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-background border border-border rounded shadow-sm">↑↓</kbd>
                      navegar
                    </span>
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-background border border-border rounded shadow-sm">↵</kbd>
                      selecionar
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium">
                    VERCFLOW OS
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
