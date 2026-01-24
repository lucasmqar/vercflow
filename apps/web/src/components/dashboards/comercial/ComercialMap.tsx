"use client"

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Lead, Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, Building2, TrendingUp, Clock, Search, Zap, Map as MapIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppFlow } from '@/store/useAppFlow';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Leaflet marker fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Icones coloridos para diferentes estados
const createColoredIcon = (color: string) => {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24]
    });
};

const icons = {
    LEAD: createColoredIcon('#f97316'), // Orange
    BUDGET: createColoredIcon('#3b82f6'), // Blue
    PROPOSAL: createColoredIcon('#a855f7'), // Purple
    PROJECT: createColoredIcon('#10b981'), // Emerald
};

interface ComercialMapProps {
    leads: Lead[];
    projects: Project[];
    budgets: any[];
    proposals: any[];
}

export function ComercialMap({ leads, projects, budgets, proposals }: ComercialMapProps) {
    const [mapCenter, setMapCenter] = React.useState<[number, number]>([-17.7915, -50.9197]); // Rio Verde, GO centered
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedPointId, setSelectedPointId] = React.useState<string | null>(null);

    // Seeding Logic Hooks
    const { addLead, createBudget, createProposal, activateProject, updateProjectStatus } = useAppFlow();
    const mapRef = React.useRef<L.Map>(null);

    const seedData = () => {
        // Rio Verde, GO base coords
        const baseLat = -17.7915;
        const baseLng = -50.9197;

        // Helper for random coords nearby
        const randCoord = () => [(Math.random() - 0.5) * 0.05 + baseLat, (Math.random() - 0.5) * 0.05 + baseLng] as [number, number];

        // 1. Create 3 Commercial Items (Budget, Proposal, Contract(Closed))

        // Budget
        const l1 = addLead({
            nomeObra: 'Residencial Viena',
            nomeValidacao: 'Construtora Viena',
            tipoObra: 'RESIDENCIAL',
            localizacao: 'Rio Verde, GO - Centro',
            status: 'QUALIFICADO',
            ... { lat: randCoord()[0], lng: randCoord()[1] } // Inject coords
        } as any);
        createBudget({
            leadId: l1,
            escopoMacro: 'Construção Torre A',
            valorEstimado: 2500000,
            prazoEstimadoMeses: 24,
            status: 'EM_ELABORACAO'
        });

        // Proposal
        const posProposal = randCoord();
        const l2 = addLead({
            nomeObra: 'Galpão Logístico Agro',
            nomeValidacao: 'AgroTech Ldta',
            tipoObra: 'INDUSTRIAL',
            localizacao: 'Rio Verde, GO - DIMPE',
            status: 'QUALIFICADO',
            lat: posProposal[0], lng: posProposal[1]
        } as any);
        const b2 = createBudget({
            leadId: l2,
            escopoMacro: 'Galpão Pré-moldado',
            valorEstimado: 800000,
            prazoEstimadoMeses: 6,
            status: 'APROVADO'
        });
        createProposal({
            budgetId: b2,
            versao: 1,
            valorFinal: 780000,
            status: 'PENDENTE'
        });

        // Contract (Active Project but new)
        const posContract = randCoord();
        const l3 = addLead({
            nomeObra: 'Clinica Saúde Vida',
            nomeValidacao: 'Dra. Ana Maria',
            tipoObra: 'COMERCIAL',
            localizacao: 'Rio Verde, GO - Jd. Goiás',
            status: 'CONVERTIDO',
            lat: posContract[0], lng: posContract[1]
        } as any);
        const b3 = createBudget({
            leadId: l3,
            escopoMacro: 'Reforma Clínica',
            valorEstimado: 300000,
            prazoEstimadoMeses: 4,
            status: 'APROVADO'
        });
        const p3 = createProposal({
            budgetId: b3,
            versao: 2,
            valorFinal: 290000,
            status: 'APROVADA'
        });
        activateProject(p3.id); // Pass ID


        // 2. Create 7 Execution Projects (Active)
        for (let i = 0; i < 7; i++) {
            const pos = randCoord();
            const l = addLead({
                nomeObra: `Edifício Orizon ${i + 1}`,
                nomeValidacao: `Investidor ${i + 1}`,
                tipoObra: 'RESIDENCIAL',
                localizacao: `Rio Verde, GO - Qd. ${10 + i}`,
                status: 'CONVERTIDO',
                lat: pos[0], lng: pos[1]
            } as any);

            const b = createBudget({
                leadId: l,
                escopoMacro: 'Obra Completa',
                valorEstimado: 1000000 + (i * 500000),
                prazoEstimadoMeses: 12 + i,
                status: 'APROVADO'
            });

            const p = createProposal({
                budgetId: b,
                versao: 1,
                valorFinal: 1000000 + (i * 500000),
                status: 'APROVADA'
            });

            const projId = activateProject(p.id); // Pass ID
            if (projId) {
                updateProjectStatus(projId, 'ATIVA');
            }
        }

        toast.success("Ambiente resetado e populado com sucesso!");
        window.location.reload();
    };

    // Seed Data Tool Handlers
    const handleResetAndSeed = () => {
        if (!confirm("Isso apagará TODOS os dados existentes e criará 10 obras de teste em Rio Verde, GO. Confirmar?")) return;
        localStorage.removeItem('vercflow-storage');
        localStorage.setItem('SEED_DEMO_DATA', 'true');
        window.location.reload();
    };

    React.useEffect(() => {
        if (localStorage.getItem('SEED_DEMO_DATA') === 'true') {
            localStorage.removeItem('SEED_DEMO_DATA');
            seedData();
        }
    }, [addLead, createBudget, createProposal, activateProject, updateProjectStatus]);

    // Filter Logic
    const filteredPoints = [
        ...leads.filter(l => l.status !== 'PERDIDO').map(l => ({
            ...l,
            type: 'LEAD',
            color: '#f97316',
            label: 'Comercial'
        })),
        ...projects.map(p => ({
            ...p,
            type: 'PROJECT',
            color: '#10b981',
            label: 'Execução'
        }))
    ].filter(p => {
        const hasGeo = p.lat && p.lng;
        if (!hasGeo) return false;

        const q = searchQuery.toLowerCase();
        return (
            p.nomeObra?.toLowerCase().includes(q) ||
            p.localizacao?.toLowerCase().includes(q) ||
            p.nome?.toLowerCase().includes(q)
        );
    });

    const flyToPoint = (lat: number, lng: number) => {
        mapRef.current?.flyTo([lat, lng], 15, { duration: 1.5 });
    };

    return (
        <Card className="rounded-[2.5rem] overflow-hidden border border-border/20 shadow-2xl h-[calc(100vh-200px)] relative bg-muted/5 flex">

            {/* Control Sidebar */}
            <div className="w-80 bg-background/95 backdrop-blur-xl border-r border-border/40 p-6 flex flex-col z-[1000]">
                <div className="mb-6">
                    <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <MapIcon className="text-primary" /> GeoManager
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">Gestão territorial de obras</p>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Buscar obra, lead ou endereço..."
                        className="pl-9 bg-muted/30 border-transparent rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-none">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Resultados ({filteredPoints.length})</p>
                    {filteredPoints.map((p: any) => (
                        <div
                            key={p.id}
                            onClick={() => {
                                setSelectedPointId(p.id);
                                if (p.lat && p.lng) flyToPoint(p.lat, p.lng);
                            }}
                            className={cn(
                                "p-3 rounded-xl border cursor-pointer transition-all hover:bg-muted/50",
                                selectedPointId === p.id ? "bg-primary/5 border-primary/30 shadow-sm" : "bg-background border-border/40"
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <Badge variant="outline" className={cn("text-[9px] font-black border-none px-1.5 h-5", p.type === 'LEAD' ? "bg-orange-500/10 text-orange-600" : "bg-emerald-500/10 text-emerald-600")}>
                                    {p.type === 'LEAD' ? 'COMERCIAL' : 'OBRA'}
                                </Badge>
                                <span className="text-[9px] font-mono text-muted-foreground">REF-{p.id.substring(0, 4)}</span>
                            </div>
                            <h4 className="font-bold text-sm leading-tight mb-0.5 line-clamp-1">{p.nome || p.nomeObra}</h4>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">{p.localizacao || p.endereco || 'Sem endereço'}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border/40 space-y-3">
                    <Button variant="outline" className="w-full text-xs font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleResetAndSeed}>
                        <Zap size={14} className="mr-2" /> Reset & Seed (Rio Verde)
                    </Button>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="flex-1 justify-center py-2 bg-orange-50 text-orange-600 border-orange-100">
                            {filteredPoints.filter(p => p.type === 'LEAD').length} Leads
                        </Badge>
                        <Badge variant="outline" className="flex-1 justify-center py-2 bg-emerald-50 text-emerald-600 border-emerald-100">
                            {filteredPoints.filter(p => p.type === 'PROJECT').length} Obras
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative">
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    ref={mapRef}
                    scrollWheelZoom={true}
                    className="w-full h-full z-10"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {filteredPoints.map((p: any) => (
                        <Marker
                            key={p.id}
                            position={[p.lat || mapCenter[0], p.lng || mapCenter[1]]}
                            icon={icons[p.type as keyof typeof icons] || DefaultIcon}
                            eventHandlers={{
                                click: () => setSelectedPointId(p.id)
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="p-2 min-w-[200px]">
                                    <Badge className={cn(
                                        "mb-2 font-black text-[9px] uppercase tracking-widest border-none",
                                        p.type === 'LEAD' ? "bg-orange-500" : "bg-emerald-500"
                                    )}>
                                        {p.label}
                                    </Badge>
                                    <h3 className="font-black text-sm text-foreground mb-1">{p.nomeObra || p.nome}</h3>
                                    <p className="text-[10px] text-muted-foreground mb-3">{p.localizacao || p.endereco}</p>

                                    <div className="grid grid-cols-2 gap-2 border-t border-border/20 pt-2">
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-muted-foreground">Status</p>
                                            <p className="text-[10px] font-bold text-primary">{p.status}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-muted-foreground">Área</p>
                                            <p className="text-[10px] font-bold text-primary">{p.areaEstimada || p.areaConstruida || '--'} m²</p>
                                        </div>
                                    </div>
                                    <Button size="sm" className="w-full mt-3 h-7 text-[10px] font-black uppercase" onClick={() => toast.info(`Abrindo detalhes de ${p.nomeObra || p.nome}`)}>
                                        Ver Detalhes
                                    </Button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </Card>
    );
}
