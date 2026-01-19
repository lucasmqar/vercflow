import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Search, Filter, MoreHorizontal, Phone, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock Data matching "ID Verc" Flow 1.1
const initialColumns = {
    "novo": {
        id: "novo",
        title: "1.1.1 Entrada de Lead",
        color: "bg-blue-500",
        items: [
            { id: "lead-1", name: "Residencial Alphaville - João Silva", origin: "Indicação", time: "2h atrás" },
            { id: "lead-2", name: "Reforma Comercial - TechSolutions", origin: "Instagram", time: "5h atrás" },
        ]
    },
    "qualificacao": {
        id: "qualificacao",
        title: "1.1.2 Decisão: Captação",
        color: "bg-purple-500",
        items: [
            { id: "lead-3", name: "Galpão Industrial - Modulo 4", origin: "Site", time: "1d atrás" },
        ]
    },
    "briefing": {
        id: "briefing",
        title: "1.2 Briefing de Projeto",
        color: "bg-orange-500",
        items: [
            { id: "lead-4", name: "Casa de Campo - Sra. Maria", origin: "Antigo Cliente", time: "2d atrás" },
        ]
    },
    "proposta": {
        id: "proposta",
        title: "1.3 Proposta Comercial",
        color: "bg-yellow-500",
        items: []
    },
    "contrato": {
        id: "contrato",
        title: "1.5 Contratação",
        color: "bg-green-500",
        items: [
            { id: "lead-5", name: "Reforma Recepção", origin: "Indicação", time: "3d atrás" }
        ]
    }
};

export default function LeadKanban() {
    const [columns, setColumns] = useState(initialColumns);

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        // Logic to reorder (Mock)
        const { source, destination } = result;
        const sourceCol = columns[source.droppableId as keyof typeof columns];
        const destCol = columns[destination.droppableId as keyof typeof columns];
        const sourceItems = [...sourceCol.items];
        const destItems = [...destCol.items];
        const [removed] = sourceItems.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
            sourceItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: { ...sourceCol, items: sourceItems }
            });
        } else {
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: { ...sourceCol, items: sourceItems },
                [destination.droppableId]: { ...destCol, items: destItems }
            });
        }
    };

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 fade-in">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gradient">Comercial</h1>
                    <p className="text-muted-foreground">Gestão de Captação e Propostas (Fluxo 1.0)</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar leads..." className="pl-9 w-[200px] glass" />
                    </div>
                    <Button variant="outline" className="glass"><Filter className="mr-2 h-4 w-4" /> Filtros</Button>
                    <Button className="shadow-glow transition-all hover:scale-105"><Plus className="mr-2 h-4 w-4" /> Novo Lead</Button>
                </div>
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-1 gap-6 overflow-x-auto pb-4 h-full">
                    {Object.values(columns).map((col) => (
                        <div key={col.id} className="flex flex-col min-w-[300px] gap-4">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${col.color}`} />
                                    <span className="font-semibold text-sm">{col.title}</span>
                                </div>
                                <Badge variant="secondary" className="glass text-xs">{col.items.length}</Badge>
                            </div>

                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`flex flex-col gap-3 flex-1 rounded-xl transition-colors ${snapshot.isDraggingOver ? "bg-primary/5 ring-2 ring-primary/20" : ""
                                            }`}
                                    >
                                        {col.items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Card
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`glass-card cursor-grab active:cursor-grabbing border-l-4 group hover:border-primary/50 transition-all duration-200 ${snapshot.isDragging ? "rotate-2 scale-105 shadow-glow z-50" : ""
                                                            }`}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            borderLeftColor: col.color.replace('bg-', 'var(--')
                                                        }}
                                                    >
                                                        <CardContent className="p-4 flex flex-col gap-3">
                                                            <div className="flex justify-between items-start">
                                                                <span className="font-medium text-sm line-clamp-2">{item.name}</span>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent>
                                                                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                                                                        <DropdownMenuItem>Editar</DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>

                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <Badge variant="outline" className="text-[10px] h-5 px-1">{item.origin}</Badge>
                                                                <span>• {item.time}</span>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                                                                <div className="flex -space-x-2">
                                                                    <Avatar className="h-6 w-6 border-2 border-background">
                                                                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${item.id}`} />
                                                                        <AvatarFallback>U</AvatarFallback>
                                                                    </Avatar>
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-green-500/20 hover:text-green-500">
                                                                        <Phone className="h-3 w-3" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-blue-500/20 hover:text-blue-500">
                                                                        <FileText className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
