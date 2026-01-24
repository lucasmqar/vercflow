"use client"

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    LayoutTemplate, Plus, Image, ArrowRight,
    Search, Filter, Heart, Share2, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function DesignMoodboards() {
    // Mock 5 Developed Moodboard Models with "Screens"
    const moodboardModels = [
        {
            id: 1,
            title: "Nordic Minimal",
            category: "Residencial",
            screens: [
                { id: 's1', name: 'Living Room', color: 'bg-[#E5E5E5]' },
                { id: 's2', name: 'Kitchen', color: 'bg-[#D4D4D4]' },
                { id: 's3', name: 'Bedroom', color: 'bg-[#F5F5F4]' },
                { id: 's4', name: 'Bath', color: 'bg-[#A8A29E]' }
            ],
            tags: ["Madeira Clara", "Tons Pastéis", "Luz Natural"],
            likes: 124,
            author: "Studio Verc"
        },
        {
            id: 2,
            title: "Urban Industrial",
            category: "Comercial",
            screens: [
                { id: 'u1', name: 'Open Space', color: 'bg-[#525252]' },
                { id: 'u2', name: 'Meeting Room', color: 'bg-[#262626]' },
                { id: 'u3', name: 'Coffee Area', color: 'bg-[#78716C]' }
            ],
            tags: ["Cimento Queimado", "Estrutura Aparente", "Couro"],
            likes: 89,
            author: "Design Team"
        },
        {
            id: 3,
            title: "Modern Farmhouse",
            category: "Residencial",
            screens: [
                { id: 'm1', name: 'Facade', color: 'bg-[#F0FDF4]' },
                { id: 'm2', name: 'Gourmet', color: 'bg-[#BBF7D0]' },
                { id: 'm3', name: 'Pool Area', color: 'bg-[#86EFAC]' },
                { id: 'm4', name: 'Suite', color: 'bg-[#DCFCE7]' }
            ],
            tags: ["Conforto", "Rústico Chique", "Integração"],
            likes: 210,
            author: "Studio Verc"
        },
        {
            id: 4,
            title: "Biofilic Office",
            category: "Corporativo",
            screens: [
                { id: 'b1', name: 'Reception', color: 'bg-[#14532D]' },
                { id: 'b2', name: 'Workstations', color: 'bg-[#166534]' },
                { id: 'b3', name: 'Relax Zone', color: 'bg-[#15803D]' },
                { id: 'b4', name: 'Garden', color: 'bg-[#22C55E]' },
                { id: 'b5', name: 'Cafeteria', color: 'bg-[#4ADE80]' }
            ],
            tags: ["Sustentabilidade", "Verde", "Bem-estar"],
            likes: 342,
            author: "Eco Design"
        },
        {
            id: 5,
            title: "Luxury Classic",
            category: "Hotelaria",
            screens: [
                { id: 'l1', name: 'Lobby', color: 'bg-[#451A03]' },
                { id: 'l2', name: 'Master Suite', color: 'bg-[#78350F]' },
                { id: 'l3', name: 'Ballroom', color: 'bg-[#92400E]' }
            ],
            tags: ["Dourado", "Mármore", "Veludo"],
            likes: 156,
            author: "Verc Exclusive"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        Moodboards e Conceitos
                        <Badge variant="secondary" className="text-xs font-black px-2">{moodboardModels.length}</Badge>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Galeria de inspirações, painéis semânticos e modelos visuais.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Buscar referências..." className="pl-10 rounded-xl bg-background/50 border-border/40" />
                    </div>
                    <Button className="rounded-xl font-bold text-xs uppercase tracking-wide bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Plus size={16} className="mr-2" /> Novo Board
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="models" className="w-full">
                <TabsList className="bg-transparent p-0 h-auto gap-4 border-b border-transparent mb-6">
                    <TabsTrigger value="models" className="px-6 h-10 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent font-bold text-xs uppercase tracking-wide">
                        Modelos de Inspiração
                    </TabsTrigger>
                    <TabsTrigger value="mine" className="px-6 h-10 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent font-bold text-xs uppercase tracking-wide">
                        Meus Boards
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="models" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {moodboardModels.map((board) => (
                            <Card key={board.id} className="group rounded-[2rem] border-border/40 bg-background/40 backdrop-blur-md overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer flex flex-col h-[400px]">
                                {/* Preview Area (Screens) */}
                                <div className="h-48 relative p-3">
                                    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
                                        {/* Main Large Screen */}
                                        <div className={cn("rounded-xl col-span-1 row-span-2 relative overflow-hidden", board.screens[0].color)}>
                                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                                                <p className="text-[9px] font-bold text-white uppercase tracking-wider">{board.screens[0].name}</p>
                                            </div>
                                        </div>
                                        {/* Smaller Screens */}
                                        <div className={cn("rounded-lg relative overflow-hidden", board.screens[1]?.color)}>
                                            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/20">
                                                <p className="text-[8px] font-medium text-white/90 truncate">{board.screens[1]?.name}</p>
                                            </div>
                                        </div>
                                        <div className={cn("rounded-lg relative overflow-hidden", board.screens[2]?.color || 'bg-muted')}>
                                            {board.screens.length > 3 && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                    <span className="text-white font-bold text-xs">+{board.screens.length - 2}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Badge className="absolute top-5 right-5 bg-background/80 backdrop-blur-md text-foreground hover:bg-background border-none shadow-sm">
                                        {board.category}
                                    </Badge>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-black text-lg leading-tight group-hover:text-primary transition-colors">{board.title}</h3>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-red-500">
                                            <Heart size={16} />
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {board.tags.map(tag => (
                                            <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-border/20 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                            <Layers size={12} /> {board.screens.length} Telas
                                        </div>
                                        <Button size="sm" variant="ghost" className="h-8 px-3 rounded-lg text-[10px] uppercase font-black tracking-wider hover:bg-primary hover:text-white">
                                            Usar Modelo
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="mine">
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/5 rounded-[3rem] border-2 border-dashed border-border/40">
                        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                            <LayoutTemplate className="text-muted-foreground" size={32} />
                        </div>
                        <h3 className="font-bold text-lg text-muted-foreground">Nenhum board criado</h3>
                        <p className="text-sm text-muted-foreground/60 mb-6">Comece um novo board do zero ou use um modelo.</p>
                        <Button className="rounded-xl font-black uppercase text-xs tracking-widest">
                            Criar Primeiro Board
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
