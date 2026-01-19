import React, { useState } from 'react';
import {
    LayoutGrid,
    List as ListIcon,
    Kanban as KanbanIcon,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export type ViewMode = 'table' | 'grid' | 'kanban';

interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
    width?: string;
}

interface DataViewProps<T> {
    data: T[];
    columns: Column<T>[];
    viewModes?: ViewMode[];
    defaultView?: ViewMode;
    searchPlaceholder?: string;
    onItemClick?: (item: T) => void;
    onAddClick?: () => void;
    isLoading?: boolean;
    filterGroups?: {
        name: string;
        property: keyof T;
        options: string[];
    }[];
    kanbanProperty?: keyof T;
    kanbanColumns?: { value: string; label: string; color?: string }[];
}

export function DataView<T extends { id: string | number }>({
    data,
    columns,
    viewModes = ['table', 'grid', 'kanban'],
    defaultView = 'table',
    searchPlaceholder = 'Buscar...',
    onItemClick,
    onAddClick,
    isLoading,
    kanbanProperty,
    kanbanColumns
}: DataViewProps<T>) {
    const [view, setView] = useState<ViewMode>(defaultView);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter((item) => {
        const searchStr = JSON.stringify(item).toLowerCase();
        return searchStr.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header Actions */}
            <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-4 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3 flex-1 min-w-[300px]">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="pl-10 h-10 bg-secondary/30 border-none focus-visible:ring-primary"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                        <Filter size={18} />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg mr-2">
                        {viewModes.includes('table') && (
                            <Button
                                variant={view === 'table' ? 'secondary' : 'ghost'}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setView('table')}
                            >
                                <ListIcon size={16} />
                            </Button>
                        )}
                        {viewModes.includes('grid') && (
                            <Button
                                variant={view === 'grid' ? 'secondary' : 'ghost'}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setView('grid')}
                            >
                                <LayoutGrid size={16} />
                            </Button>
                        )}
                        {viewModes.includes('kanban') && (
                            <Button
                                variant={view === 'kanban' ? 'secondary' : 'ghost'}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setView('kanban')}
                            >
                                <KanbanIcon size={16} />
                            </Button>
                        )}
                    </div>

                    {onAddClick && (
                        <Button onClick={onAddClick} className="h-10 gap-2">
                            <Plus size={18} />
                            <span className="hidden sm:inline">Adicionar</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-4 content-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-muted-foreground animate-pulse">Carregando dados...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2">
                        <Search size={48} className="opacity-20" />
                        <p>Nenhum item encontrado</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {view === 'table' && (
                            <motion.div
                                key="table"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="min-w-full overflow-x-auto rounded-xl border border-border"
                            >
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead>
                                        <tr className="bg-secondary/30">
                                            {columns.map((col) => (
                                                <th key={col.key as string} className="px-4 py-3 font-semibold text-muted-foreground first:rounded-tl-xl last:rounded-tr-xl">
                                                    {col.header}
                                                </th>
                                            ))}
                                            <th className="px-4 py-3 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((item) => (
                                            <tr
                                                key={item.id}
                                                onClick={() => onItemClick?.(item)}
                                                className="border-b border-border hover:bg-secondary/20 cursor-pointer transition-colors"
                                            >
                                                {columns.map((col) => (
                                                    <td key={col.key as string} className="px-4 py-4 truncate" style={{ width: col.width }}>
                                                        {col.render ? col.render(item) : (item[col.key as keyof T] as any)?.toString()}
                                                    </td>
                                                ))}
                                                <td className="px-4 py-4 text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}

                        {view === 'grid' && (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                            >
                                {filteredData.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => onItemClick?.(item)}
                                        className="group bg-card hover:bg-secondary/20 border border-border rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            {columns[0].render ? columns[0].render(item) : (
                                                <h3 className="font-bold text-lg line-clamp-1">{(item[columns[0].key as keyof T] as any)?.toString()}</h3>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal size={16} />
                                            </Button>
                                        </div>
                                        <div className="space-y-3">
                                            {columns.slice(1).map((col) => (
                                                <div key={col.key as string} className="text-sm flex justify-between items-center">
                                                    <span className="text-muted-foreground">{col.header}</span>
                                                    <span className="font-medium truncate max-w-[150px]">
                                                        {col.render ? col.render(item) : (item[col.key as keyof T] as any)?.toString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {view === 'kanban' && kanbanProperty && kanbanColumns && (
                            <motion.div
                                key="kanban"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-250px)]"
                            >
                                {kanbanColumns.map((col) => {
                                    const items = filteredData.filter(i => (i[kanbanProperty] as any) === col.value);
                                    return (
                                        <div key={col.value} className="flex-shrink-0 w-80 flex flex-col gap-4">
                                            <div className="flex items-center justify-between px-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color || 'var(--primary)' }} />
                                                    <h3 className="font-bold text-sm uppercase tracking-wider">{col.label}</h3>
                                                    <span className="text-xs bg-secondary px-2 py-0.5 rounded-full font-bold">{items.length}</span>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Plus size={16} />
                                                </Button>
                                            </div>
                                            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                                                {items.map(item => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => onItemClick?.(item)}
                                                        className="bg-card border border-border hover:border-primary/50 rounded-xl p-4 shadow-sm cursor-pointer transition-all hover:shadow-md"
                                                    >
                                                        <h4 className="font-bold text-sm mb-3 line-clamp-2">{(item[columns[0].key as keyof T] as any)?.toString()}</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {/* Render a few key badges */}
                                                            {columns.slice(1, 4).map(c => (
                                                                <div key={c.key as string} className="text-[10px] bg-secondary/50 px-2 py-1 rounded-md text-muted-foreground uppercase font-bold">
                                                                    {c.render ? c.render(item) : (item[c.key as keyof T] as any)?.toString()}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
