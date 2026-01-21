import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronDown, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface TimeFilterValue {
    startDate?: Date;
    endDate?: Date;
    startTime?: string;
    endTime?: string;
    month?: number;
    year?: number;
}

interface AdvancedTimeFilterProps {
    onFilterChange: (value: TimeFilterValue) => void;
    className?: string;
}

export function AdvancedTimeFilter({ onFilterChange, className }: AdvancedTimeFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState<TimeFilterValue>({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
    });

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    const handleApply = () => {
        onFilterChange(filter);
        setIsOpen(false);
    };

    const handleClear = () => {
        const reset = { year: new Date().getFullYear(), month: new Date().getMonth() };
        setFilter(reset);
        onFilterChange(reset);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-9 px-4 text-[11px] font-bold gap-2 glass-card border-border/40 bg-background/40 hover:bg-background/60 transition-all",
                        className
                    )}
                >
                    <CalendarIcon size={14} className="text-primary/70" />
                    <span>
                        {filter.month !== undefined ? months[filter.month] : 'Mês'} {filter.year}
                    </span>
                    <ChevronDown size={12} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 glass-card border-border/40 bg-background/90 backdrop-blur-xl shadow-2xl" align="end">
                <div className="p-4 border-b border-border/20 flex items-center justify-between bg-muted/20">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Filtro de Período</h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                        <X size={14} />
                    </Button>
                </div>

                <div className="p-5 space-y-6">
                    {/* Month Picker */}
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Mês</label>
                        <div className="grid grid-cols-3 gap-1.5">
                            {months.map((m, idx) => (
                                <button
                                    key={m}
                                    onClick={() => setFilter({ ...filter, month: idx })}
                                    className={cn(
                                        "py-1.5 rounded-md text-[10px] font-bold transition-all border",
                                        filter.month === idx
                                            ? "bg-primary text-primary-foreground border-primary shadow-glow-sm"
                                            : "bg-muted/10 text-muted-foreground border-border/20 hover:border-primary/40 hover:bg-muted/30"
                                    )}
                                >
                                    {m.substring(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Year Picker */}
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Ano</label>
                        <div className="flex flex-wrap gap-2">
                            {years.map(y => (
                                <button
                                    key={y}
                                    onClick={() => setFilter({ ...filter, year: y })}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-[10px] font-bold transition-all border",
                                        filter.year === y
                                            ? "bg-primary text-primary-foreground border-primary shadow-glow-sm"
                                            : "bg-muted/10 text-muted-foreground border-border/20 hover:border-primary/40 hover:bg-muted/30"
                                    )}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Inputs (Optional) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 flex items-center gap-1.5">
                                <Clock size={10} /> Início
                            </label>
                            <input
                                type="time"
                                className="w-full bg-muted/10 border border-border/20 rounded-md p-2 text-[11px] font-mono text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                value={filter.startTime || ''}
                                onChange={(e) => setFilter({ ...filter, startTime: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 flex items-center gap-1.5">
                                <Clock size={10} /> Fim
                            </label>
                            <input
                                type="time"
                                className="w-full bg-muted/10 border border-border/20 rounded-md p-2 text-[11px] font-mono text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                value={filter.endTime || ''}
                                onChange={(e) => setFilter({ ...filter, endTime: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-border/20 bg-muted/30 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-[10px] font-bold uppercase tracking-widest h-8" onClick={handleClear}>
                        Limpar
                    </Button>
                    <Button size="sm" className="flex-1 text-[10px] font-black uppercase tracking-widest h-8 shadow-glow-sm" onClick={handleApply}>
                        Filtrar
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
